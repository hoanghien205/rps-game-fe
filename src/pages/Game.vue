
<template>
  <v-app>
    <v-main>
      <v-container class="game-container">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="game-card" elevation="4">
              <v-card-title class="text-h5 primary white--text">
                Game {{ gameId }}
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row v-if="!currentGame">
                  <v-col cols="12">
                    <v-alert type="error" dense>
                      Game not found.
                    </v-alert>
                    <v-btn color="primary" to="/home">Back to Home</v-btn>
                  </v-col>
                </v-row>
                <v-row v-else-if="!gameResult">
                  <v-col cols="12" class="text-center">
                    <h3 class="text-h6 mb-4">Choose Your Action</h3>
                    <div class="action-buttons">
                      <v-btn
                        class="action-button ma-2"
                        color="primary"
                        large
                        @click="makeMove('rock')"
                      >
                        ✊ Rock
                      </v-btn>
                      <v-btn
                        class="action-button ma-2"
                        color="primary"
                        large
                        @click="makeMove('paper')"
                      >
                        ✋ Paper
                      </v-btn>
                      <v-btn
                        class="action-button ma-2"
                        color="primary"
                        large
                        @click="makeMove('scissors')"
                      >
                        ✌️ Scissors
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row v-if="gameResult" class="result-animation">
                  <v-col cols="12">
                    <v-alert
                      :type="gameResult.includes('Win') ? 'success' : gameResult.includes('Lose') ? 'error' : 'info'"
                      prominent
                      text
                    >
                      <h3 class="text-h6">Result: {{ gameResult }}</h3>
                      <p>Your move: {{ playerMove }}</p>
                      <p>Opponent's move: {{ opponentMove }}</p>
                    </v-alert>
                    <v-btn
                      color="primary"
                      large
                      class="mt-4"
                      @click="resetGame"
                    >
                      <v-icon left>mdi-replay</v-icon>
                      Play Again
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const gameId = route.params.id;
const walletAddress = ref(localStorage.getItem('walletAddress') || '');
const currentGame = ref(null);
const playerMove = ref(null);
const opponentMove = ref(null);
const gameResult = ref(null);

const joinGame = () => {
  const game = JSON.parse(localStorage.getItem(`game_${gameId}`));
  if (game && game.player1 !== walletAddress.value && !game.player2) {
    game.player2 = walletAddress.value;
    localStorage.setItem(`game_${gameId}`, JSON.stringify(game));
  }
  currentGame.value = game;
  checkGameStatus();
};

const makeMove = (move) => {
  playerMove.value = move;
  currentGame.value[currentGame.value.player1 === walletAddress.value ? 'player1Move' : 'player2Move'] = move;
  localStorage.setItem(`game_${gameId}`, JSON.stringify(currentGame.value));
  checkGameStatus();
};

const checkGameStatus = () => {
  const game = JSON.parse(localStorage.getItem(`game_${gameId}`));
  currentGame.value = game;
  if (game && game.player1Move && game.player2Move) {
    opponentMove.value = currentGame.value.player1 === walletAddress.value ? game.player2Move : game.player1Move;
    gameResult.value = determineWinner(game.player1Move, game.player2Move);
  } else if (game) {
    // Simulate opponent move for demo
    setTimeout(() => {
      const moves = ['rock', 'paper', 'scissors'];
      const randomMove = moves[Math.floor(Math.random() * 3)];
      currentGame.value[currentGame.value.player1 === walletAddress.value ? 'player2Move' : 'player1Move'] = randomMove;
      localStorage.setItem(`game_${gameId}`, JSON.stringify(currentGame.value));
      opponentMove.value = currentGame.value.player1 === walletAddress.value ? currentGame.value.player2Move : currentGame.value.player1Move;
      gameResult.value = determineWinner(playerMove.value, opponentMove.value);
    }, 1000);
  }
};

const determineWinner = (player1Move, player2Move) => {
  if (player1Move === player2Move) return 'Tie';
  const winningMoves = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };
  const isPlayer1 = currentGame.value.player1 === walletAddress.value;
  if (winningMoves[player1Move] === player2Move) {
    return isPlayer1 ? 'You Win!' : 'You Lose!';
  }
  return isPlayer1 ? 'You Lose!' : 'You Win!';
};

const resetGame = () => {
  localStorage.removeItem(`game_${gameId}`);
  router.push('/home');
};

onMounted(() => {
  if (!walletAddress.value) {
    router.push('/');
  } else {
    const game = JSON.parse(localStorage.getItem(`game_${gameId}`));
    if (game) {
      currentGame.value = game;
      if (game.player1 !== walletAddress.value && !game.player2) {
        joinGame();
      } else {
        checkGameStatus();
      }
    }
  }
});
</script>

<style scoped>
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.action-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.action-button {
  width: 120px;
  height: 120px;
  transition: transform 0.3s ease;
}
.action-button:hover {
  transform: scale(1.1);
}
.result-animation {
  animation: resultPop 0.5s ease-in-out;
}
@keyframes resultPop {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.game-card {
  border-radius: 8px;
}
</style>

