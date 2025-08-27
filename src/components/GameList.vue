<template>
  <v-card width="100%">
    <v-card-title>
      <v-icon class="cursor-pointer" @click="getGameList">mdi-refresh</v-icon>
    </v-card-title>
    <v-table>
      <thead>
      <tr>
        <th class="text-left">
          Game ID {{ gameId }}
        </th>
        <th class="text-left">
          Player 1
        </th>
        <th class="text-left">
          createdAt
        </th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="item in gameList"
        :key="item.name"
      >
        <td>{{ item.id }}</td>
        <td>{{ item.player1 }}</td>
        <td>{{ convertDate(item.createdAt) }}</td>
        <td>
          <v-btn color="green" @click="selectGameId(item)">Join Game</v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>

    <div class="text-center pa-2">
      <v-btn color="blue" size="x-large" @click="dialog=true">Create Game</v-btn>
    </div>
  </v-card>

  <v-dialog
    v-model="dialog"
    max-width="400"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>Create Game</span>
        <v-icon-btn @click="dialog=false"><v-icon>mdi-close</v-icon></v-icon-btn>
      </v-card-title>
      <div class="pa-4 text-center">
        <div>Bet Amount: 0.001ETH</div>
        <div class="py-2">
          Your Choise:
          <div class="choices">
            <button class="choice-btn" :class="{ selected: playerChoice === '1' }" data-choice="rock"
                    @click="onChoice('1')">
              <img alt="" src="@/assets/game/rock-btn.webp"/>
              <span class="font-weight-bold text-h6">Rock</span>
            </button>
            <button class="choice-btn" data-choice="paper" :class="{ selected: playerChoice === '2' }"
                    @click="onChoice('2')">
              <img alt="" src="@/assets/game/paper-btn.webp"/>
              <span class="font-weight-bold text-h6">Paper</span>
            </button>
            <button class="choice-btn" data-choice="scissors" :class="{ selected: playerChoice === '3' }"
                    @click="onChoice('3')">
              <img alt="" src="@/assets/game/scissors-btn.webp"/>
              <span class="font-weight-bold text-h6">Scissors</span>
            </button>
          </div>
        </div>
        <v-btn color="light-blue-accent-4" @click="createGame">Encrypt & Create</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {ethers} from "ethers";
import contractABI from "@/abi/RockPaperScissorsABI.json";

const dialog = ref(true);
const playerChoice = ref("1");
const props = defineProps({
  gameId: {
    type: Number,
    required: true
  },
  contractAddress: {
    type: String,
    required: true
  },
})
const emit = defineEmits(['update:gameId','CreateGame']);

const gameList = ref([])

function convertDate(i) {
  return new Date(i * 1000).toLocaleDateString()
}

function selectGameId(element) {
  emit('update:gameId', element.id);
}

function onChoice(element) {
  playerChoice.value = element;
}

async function getGameList() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(props.contractAddress, contractABI, signer);
  const listId= await contract.getActiveGames();
  const idGames = [...listId].map(v => Number(v));
  const gameDetails = [];
  for (const id of idGames) {
    const item = await contract.games(id);
    const games ={
      id: id,
      player1: item[0],
      player1Move: item[1],
      createdAt: Number(item[2]),
      player2: item[3],
      player2Move: item[4],
      played2: item[5],
      resultCipher: item[6],
      rewarded: item[7],
      decryptPending: item[8],
      decryptReqId: Number(item[9]),
      decryptRequestedAt: Number(item[10])
    };
    gameDetails.push(games);
  }


  gameList.value = gameDetails;
}

function createGame() {
  emit('CreateGame', playerChoice);
}
onMounted(() => {
  getGameList();
})

</script>
<style scoped>
.v-card {
  max-width: 1200px;
}

.choices {
  display: flex;
  justify-content: space-between;
  text-align: center;

  .choice-btn {
    width: 90px;
    justify-content: space-between;

    img {
      width: 80px;
    }
  }
}

.selected {
  filter: brightness(1.3);
  border: 2px solid #ffd700;
  border-radius: 4px;
}
</style>
