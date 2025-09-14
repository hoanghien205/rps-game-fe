<template>
  <v-card width="100%" :loading="tableLoading">
    <v-table>
      <thead>
        <tr class="shadow-1">
          <th class="text-left">
            Room
          </th>
          <th class="text-left">
            Player 1
          </th>
          <!-- <th class="text-left">
            Created At
          </th> -->
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in gameList" :key="item.name">
          <td>{{ item.id }}</td>
          <td>{{ item.player1.slice(0, 6) }}...{{ item.player1.slice(-5) }}</td>
          <!-- <td>{{ convertDate(item.createdAt) }}</td> -->
          <td>
            <v-btn color="green" @click="selectGameId(item)">Join</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="btn-box shadow-1">
      <div>
        <v-btn size="x-large" @click="getGameList">
          <v-icon class="cursor-pointer">mdi-refresh</v-icon>
        </v-btn>
        <v-btn size="x-large" @click="dialog = true">Create Game</v-btn>
      </div>
    </div>
  </v-card>

  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>Create Game</span>
        <v-icon-btn @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-icon-btn>
      </v-card-title>
      <div class="pa-4 text-center">
        <div>Bet Amount: <b>{{ bet }}</b> ETH</div>
        <div class="py-2">
          Your Choise:
          <div class="choices">
            <button class="choice-btn" data-choice="rock" @click="onChoice('1')">
              <img alt="" src="@/assets/game/rock-btn.webp" :class="{ selected: playerChoice === '1' }" />
              <span class="font-weight-bold text-h6">Rock</span>
            </button>
            <button class="choice-btn" data-choice="paper" @click="onChoice('2')">
              <img alt="" src="@/assets/game/paper-btn.webp" :class="{ selected: playerChoice === '2' }" />
              <span class="font-weight-bold text-h6">Paper</span>
            </button>
            <button class="choice-btn" data-choice="scissors" @click="onChoice('3')">
              <img alt="" src="@/assets/game/scissors-btn.webp" :class="{ selected: playerChoice === '3' }" />
              <span class="font-weight-bold text-h6">Scissors</span>
            </button>
          </div>
        </div>
        <v-btn color="light-blue-accent-4" @click="createGame">Encrypt & Create</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.shadow-1 {
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
}

.btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0px;

  button {
    background-color: #002238;
    color: white;
    margin: 0px 16px;
  }

  button:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
  }
}

.v-table {
  flex: 1;
  overflow-y: auto;
  max-height: 600px;
}

.v-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: white;
}


.v-table th {
  color: #333;
  font-weight: 600;
  padding: 10px;
  text-align: center;
}

.v-table td {
  padding: 12px;
  border-top: 1px solid #eee;
}

.v-table tbody tr:nth-child(odd) {
  background-color: #fafafa;
}

.v-table tbody tr:hover {
  background-color: #fff6cc;
  transition: background 0.3s ease;
  cursor: pointer;
}

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

/* Font tổng thể trong card/table */
.v-card,
.v-table,
.v-dialog {
  font-family: 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #2c3e50;
}

/* Header table */
.v-table thead th {
  font-weight: 600;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #37474f;
  padding: 12px 16px;
}

.v-table thead {
  background: linear-gradient(90deg, #FFD208, #e5b700);
}

/* Cell table */
.v-table tbody td {
  font-size: 14px;
  padding: 12px 16px;
  color: #424242;
  vertical-align: middle;
}

/* Row hover effect */
.v-table tbody tr:hover {
  background-color: #f5f7fa;
  transition: background-color 0.2s ease-in-out;
}

.v-btn {
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
}

.v-card-title {
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
}
</style>


<script setup>
import { onMounted, ref } from "vue";
import { ethers } from "ethers";
import contractABI from "@/abi/RockPaperScissorsABI.json";

const tableLoading = ref(false);
const dialog = ref(false);
const props = defineProps({
  gameId: {
    type: Number,
    required: true
  },
  contractAddress: {
    type: String,
    required: true
  },
  bet: {
    type: Number,
  },
  playerChoice: {
    type: String,
    default: '1',
  },
})
const playerChoice = ref(props.playerChoice);
const emit = defineEmits(['update:gameId', 'CreateGame']);

const gameList = ref([])

function convertDate(i) {
  return new Date(i * 1000).toLocaleDateString()
}

function selectGameId(element) {
  emit('update:gameId', element.id);
  // document.getElementById("GameDetailEL")
  //   ?.scrollIntoView({ behavior: "smooth" });
}

function onChoice(element) {
  playerChoice.value = element;
}

async function getGameList() {
  tableLoading.value = true;
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(props.contractAddress, contractABI, signer);
    const listId = await contract.getActiveGames();
    const idGames = [...listId].map(v => Number(v));
    const gameDetails = [];
    for (const id of idGames) {
      const item = await contract.games(id);
      const games = {
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
    tableLoading.value = false;
  } catch (error) {
    console.log(error);
    tableLoading.value = false;
  }

}

function createGame() {
  emit('CreateGame', playerChoice);
}


function closeCreateDialog() {
  dialog.value = false;
}
defineExpose({ closeCreateDialog })
onMounted(() => {
  getGameList();
})

</script>
