<template>
  <v-card width="100%">
    <v-text-field v-model="search" label="Search by Room ID or Player" prepend-inner-icon="mdi-magnify"
      variant="outlined" density="compact" clearable class="ma-4" hide-details />

    <v-data-table :headers="headers" :items="filteredList" :items-per-page="5" ref="tableRef"
      class="elevation-1 shadow-1" :loading="tableLoading" v-model:page="page">
      <template #item.player1="{ item }">
        {{ item.player1.slice(0, 6) }}...{{ item.player1.slice(-5) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn color="green" @click="selectGameId(item)">Join</v-btn>
      </template>

      <template #bottom>
        <v-divider></v-divider>
        <div class="custom-footer">
          <v-pagination v-model="page" :length="pageCount" color="amber darken-4" rounded="circle"
            :total-visible="totalVisible"></v-pagination>
        </div>
      </template>
    </v-data-table>

    <div class="btn-box">
      <div>
        <v-btn size="x-large" @click="manualRefresh">
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

  @media (max-width: 768px) {
    button {
      width: calc(100% - 32px);
      margin: 8px 16px;
    }
  }
}

.v-input__details {
  display: none;
}

.v-table {
  flex: 1;
  overflow-y: auto;
  max-height: 600px;
  height: calc(100% - 140px);
  /* background: transparent; */
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
  background: transparent;
  height: 100%;
  border-radius: 24px;
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
  color: #000000;
}

.v-dialog .v-card {
  background-color: #FFD208;
  border-radius: 8px;
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

.v-table .v-data-table-footer .v-data-table-footer__items-per-page {
  display: none !important;
}

.custom-footer {
  display: flex;
  justify-content: center;
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
watch(() => props.playerChoice, (val) => {
  playerChoice.value = val;
});

const emit = defineEmits(['update:gameId', 'CreateGame']);

const gameList = ref([]);

const page = ref(1);
const pageCount = computed(() => {
  return Math.ceil(filteredList.value.length / 5);
});

const totalVisible = ref(5);
const tableRef = ref(null);
onMounted(() => {
  const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      const width = entry.contentRect.width;
      if (width < 500) {
        totalVisible.value = 3;
      } else if (width < 800) {
        totalVisible.value = 5;
      } else {
        totalVisible.value = 7;
      }
    }
  });

  if (tableRef.value) {
    observer.observe(tableRef.value.$el ?? tableRef.value);
  }

  onBeforeUnmount(() => observer.disconnect());
});

const headers = [
  { title: "Room", key: "id", align: "start" },
  { title: "Player", key: "player1" },
  { title: "", key: "actions", sortable: false },
];

const search = ref("");
const filteredList = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return gameList.value.filter(item => {
    const idStr = String(item.id).trim().toLowerCase()
    const player1Str = String(item.player1).trim().toLowerCase()

    return idStr.includes(keyword) || player1Str.includes(keyword)
  })
})

function convertDate(i) {
  return new Date(i * 1000).toLocaleDateString()
}

function selectGameId(element) {
  emit('update:gameId', element.id);
  emit('update:showGameList', false);
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
      // gameDetails.push(games);
      // gameDetails.push(games);
      // gameDetails.push(games);
      // gameDetails.push(games);
      // gameDetails.push(games);
      // gameDetails.push(games);
      // gameDetails.push(games);
    }
    gameList.value = gameDetails;
    tableLoading.value = false;
  } catch (error) {
    console.log(error);
    tableLoading.value = false;
  }
}

let refreshTimer = null;
function resetAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);

  refreshTimer = setInterval(() => {
    getGameList();
  }, 7000);
}

async function manualRefresh() {
  await getGameList();
  resetAutoRefresh();
}

onMounted(() => {
  getGameList();
  resetAutoRefresh();
});

onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer);
});

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
