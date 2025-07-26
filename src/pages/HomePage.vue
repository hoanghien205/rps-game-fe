
<template>
  <v-app>
    <v-main>
      <v-container class="home-container">
        <!-- Header -->
        <v-row>
          <v-col cols="12">
            <v-card class="header-card" elevation="4" color="primary">
              <v-card-text class="white--text">
                <v-row align="center">
                  <v-col cols="12" sm="6">
                    <h2 class="text-h6">User: {{ truncateAddress(walletAddress) }}</h2>
                  </v-col>
                  <v-col cols="12" sm="6" class="text-sm-right">
                    <v-chip color="white" text-color="primary">
                      Balance: {{ walletBalance }} ETH
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Body: Game List -->
        <v-row class="mt-6">
          <v-col cols="12">
            <v-card class="game-list-card" elevation="4">
              <v-card-title class="text-h6">Active Games</v-card-title>
              <v-card-text>
                <v-list v-if="availableGames.length > 0" two-line>
                  <v-list-item
                    v-for="game in availableGames"
                    :key="game.id"
                    :to="`/game/${game.id}`"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        Game {{ game.id }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Created by {{ truncateAddress(game.creator) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon>
                        <v-icon>mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
                <v-alert v-else type="info" dense>
                  No active games. Create a new one!
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Footer -->
        <v-footer class="mt-6" color="primary" padless>
          <v-row justify="center" no-gutters>
            <v-btn
              color="white"
              text
              class="my-2"
              @click="createGame"
            >
              <v-icon left>mdi-plus</v-icon>
              Create Game
            </v-btn>
            <v-btn
              color="white"
              text
              class="my-2 mx-4"
              to="/history"
            >
              <v-icon left>mdi-history</v-icon>
              Play History
            </v-btn>
            <v-btn
              color="white"
              text
              class="my-2"
              to="/info"
            >
              <v-icon left>mdi-information</v-icon>
              Info
            </v-btn>
          </v-row>
        </v-footer>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ethers } from 'ethers';
import { useRouter } from 'vue-router';

const router = useRouter();
const walletAddress = ref(localStorage.getItem('walletAddress') || '');
const walletBalance = ref('0.00');
const availableGames = ref([]);

const truncateAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
};

const fetchBalance = async () => {
  if (!window.ethereum) return;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const balance = await provider.getBalance(walletAddress.value);
  walletBalance.value = ethers.formatEther(balance);
};

const createGame = () => {
  const gameId = Date.now().toString();
  const game = {
    id: gameId,
    creator: walletAddress.value,
    player1: walletAddress.value,
    player2: null,
    player1Move: null,
    player2Move: null,
  };
  localStorage.setItem(`game_${gameId}`, JSON.stringify(game));
  loadGames();
  router.push(`/game/${gameId}`);
};

const loadGames = () => {
  availableGames.value = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('game_')) {
      const game = JSON.parse(localStorage.getItem(key));
      if (!game.player2 || game.player2 === walletAddress.value) {
        availableGames.value.push(game);
      }
    }
  }
};

onMounted(() => {
  if (!walletAddress.value) {
    router.push('/');
  } else {
    fetchBalance();
    loadGames();
  }
});
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.header-card {
  border-radius: 8px;
}
.game-list-card {
  border-radius: 8px;
}
</style>

