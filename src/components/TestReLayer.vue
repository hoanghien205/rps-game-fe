<!-- Welcome to ZamaRPS — Rock-Paper-Scissors On-Chain
Play the classic game of Rock-Paper-Scissors, now on-chain with real opponents. Get matched with another player online and see who comes out on top.

Every match is recorded on-chain for transparency and fairness.
💰 Total transaction = Your Bet + Fee

🤖 How to Play
1️⃣ Place Your Bet — Wager between 0.01 and 0.5 $ETH.
2️⃣ Pick Your Move — Rock, Paper, or Scissors. Your choice is locked on-chain.
3️⃣ Get Matched — The system pairs you with another player.
4️⃣ See the Result —

Win: Double your bet.

Draw: Your $ETH is refunded.

Lose: Your bet goes to your opponent. -->

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="logo bg-blue-lighten-2">
        <img alt="" src="@/assets/logo.png">
      </div>
      <nav class="nav pa-4">
        <v-btn v-if=!userAddress @click="initialize" class="connect-btn">Connect</v-btn>
        <div v-if="userAddress">
          <span class="mr-2">{{ shortAddress(userAddress) }}</span>
          <v-icon class="cursor-pointer" color="deep-orange-darken-1" @click="disconnectWallet">mdi-close</v-icon>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main">
      <div class="game-container">
        <!-- Left Panel: Game Controls -->
        <!-- <div class="game-controls" v-if="gameId" id="GameDetailEL"> -->
        <div class="game-controls" id="GameDetailEL">

          <h1 v-if="!gameId" class="shake-text">Join or create new game!!!</h1>

          <h1 v-else>Room: {{ gameId }}</h1>

          <!-- <button class="play-button">Let's play!</button> -->
          <div class="game-container-2">
            <div class="amount-section">

              <div>
                <h3>Bet size</h3>
                <input type="number" v-model="bet" value="0.001" :min="0.001" step="0.001" class="bet-input"/>
                <div>
                  <button class="amount-btn" @click="amountUp(1)">1x</button>
                  <button class="amount-btn" @click="amountUp(5)">5x</button>
                  <button class="amount-btn" @click="amountUp(10)">10x</button>
                  <!-- <button class="amount-btn" @click="amountUp(1)">max</button> -->
                </div>
              </div>

              <div class="choices-section">
                <h3>Your Choice</h3>
                <div class="choices">
                  <button class="choice-btn" data-choice="1" @click="onChoice('1')">
                    <img alt="" src="@/assets/game/rock-btn.webp" :class="{ selected: playerChoice === '1' }" />
                    <span class="font-weight-bold">Rock</span>
                  </button>
                  <button class="choice-btn" data-choice="2" @click="onChoice('2')">
                    <img alt="" src="@/assets/game/paper-btn.webp" :class="{ selected: playerChoice === '2' }" />
                    <span class="font-weight-bold">Paper</span>
                  </button>
                  <button class="choice-btn" data-choice="3" @click="onChoice('3')">
                    <img alt="" src="@/assets/game/scissors-btn.webp" :class="{ selected: playerChoice === '3' }" />
                    <span class="font-weight-bold">Scissors</span>
                  </button>
                </div>
              </div>

              <img alt="" class="play-btn" src="@/assets/game/submit-btn.webp" @click="joinGame()" />

              <div class="winnings">
                <span>Your Winnings:</span>
                <span>0 </span>
              </div>
            </div>


            <!-- Game Visual 1 -->
            <transition name="slide-fade" mode="out-in">
              <div class="game-visual" v-if="gameId">
                <!-- Nếu chưa chọn -->
                <h1 v-if="!playerChoice" class="hint">
                  Please choose Rock, Paper, or Scissors
                </h1>

                <!-- Nếu đã chọn -->
                <div v-else class="choice">
                  <img v-if="playerChoice" :key="playerChoice" :src="images[playerChoice]" :alt="playerChoice" />

                  <span class="vs" v-if="playerChoice && opponentChoice">VS</span>
                  <transition name="fade" mode="out-in">
                    <img v-if="opponentChoice" :key="opponentChoice" :src="images[opponentChoice]"
                      :alt="opponentChoice" />
                  </transition>
                </div>


              </div>
            </transition>

            <!-- Game Visual 2 -->
            <div class="game-visual game-visual-2 " :class="{ 'full-width': !gameId, 'partial-width': gameId }">
              <GameList v-model:gameId="gameId" :contractAddress="contractAddress" :bet="bet"
                :playerChoice="playerChoice" @CreateGame="createGame($event)" />
            </div>
          </div>


        </div>


        <div class="game-container-3">
          <!-- Left history -->
          <div class="game-result-history">
            <h3>Your Recent Games</h3>

            <div class="game-history">
              <table>
                <thead>
                  <tr>
                    <th>Game ID</th>
                    <th>Bet Amount</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in gameHistory" :key="item.gameId">
                    <td>{{ item.gameId }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.date }}</td>
                    <td>
                      <v-btn color="purple-accent-2">Result</v-btn>
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>

          <!-- Right Leaderboard -->
          <div class="game-result-history">
            <h3>Leaderboard</h3>

            <div class="game-history">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Total Bets</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in leaderboard" :class="`rank-${player.rank}`" :key="player.rank">
                    <td>{{ player.rank }}</td>
                    <td>{{ player.player }}</td>
                    <td>{{ player.total }}</td>
                    <td>{{ player.rewards }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <v-overlay v-model="dialogLoading" class="loading-overlay">
    <v-progress-circular color="primary" indeterminate size="x-large"></v-progress-circular>
  </v-overlay>

  <v-dialog v-model="dialogRequestDecryption" max-width="400" persistent>
    <v-card>
      <v-card-title>Match Completed - Request Decryption</v-card-title>
      <v-card-text>
        <p>Both players have locked in their moves.</p>
        <p>To finalize the game, you need to send a decryption request to the Oracle.</p>
        <p>The Oracle will securely decrypt the result and automatically distribute the prize:</p>
        <p> Winner receives the total pot (0.002 ETH).</p>
        <p>In case of a draw, both players get their bets refunded.</p>
        <p>This action only requires a gas fee. No additional bet is needed</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="requestPayout(gameId)">Request Result</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snackbar">
    {{ message }}

    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.app-container {
  background-image: url('@/assets/game/background-game.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: #1D1D1B;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header {
  width: calc(100% + 40px);
  margin-top: -20px;
  background-color: #FFD208;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}


.selected {
  /* filter: brightness(1.3);
  border: 2px solid #ffd700;
  border-radius: 4px; */
  box-shadow: 0 0 20px rgba(255, 225, 0, 0.9);
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  boder-radius: 16px;

  img {
    border-top-left-radius: 16px;
    width: 64px;
  }
}

.nav {
  display: flex;
  gap: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.nav span {
  position: relative;
  cursor: pointer;
  background: linear-gradient(90deg, #002133, #e52e71, #6a5acd);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background-position 0.5s ease;
}

.nav span::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, #002133, #e52e71, #6a5acd);
  background-size: 300% 100%;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s ease, background-position 0.5s ease;
  border-radius: 2px;
}

.nav span:hover {
  background-position: 100% 0;
}

.nav span:hover::after {
  transform: scaleX(1);
  transform-origin: left;
  background-position: 100% 0;
}

.airdrop {
  background-color: #FFD208;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.airdrop-amount {
  margin-left: 10px;
}

.airdrop-balance {
  margin-left: 10px;
  font-size: 0.9em;
}

.main {
  width: 100%;
  max-width: 1600px;
  margin-top: 20px;
}

.game-container {
  background-color: #F4F4F4;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.game-container-2 {
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.game-container-3 {
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.game-result-history {
  width: 50%;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.game-controls {
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
}

.game-controls {
  padding: 15px;
  background-color: #E8E8E8;
  border-radius: 5px;
}

.game-controls h1,
.game-controls h2,
.game-history h3 {
  text-align: center;
  margin-bottom: 15px;
}

.play-btn {
  width: 100%;
  color: white;
  cursor: pointer;
  font-weight: 700;
  font-size: 32px;
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
}

.amount-section {
  margin-bottom: 15px;
  width: 30%;
}

.amount-section label {
  display: block;
  margin-bottom: 5px;
}

.connect-btn{
  padding: 10px 8px;
  background-color: #002133;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.amount-btn {
  padding: 10px 8px;
  background-color: #002133;
  color: white;
  border: none;
  border-radius: 50%;
  margin-right: 24px;
  cursor: pointer;
  width: 60px;
  font-weight: 600;
}

.amount-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
}

.amount-glow {
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8),
    0 0 20px rgba(255, 215, 0, 0.6),
    0 0 30px rgba(255, 215, 0, 0.4);
  animation: pulseGlow 2s infinite alternate;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.6),
      0 0 15px rgba(255, 215, 0, 0.4);
    transform: scale(1);
  }

  100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 1),
      0 0 40px rgba(255, 215, 0, 0.8),
      0 0 60px rgba(255, 215, 0, 0.6);
    transform: scale(1.05);
  }
}

.choices-section {
  margin-top: 32px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.choices {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(20px, 100px);
  gap: 48px;
  width: 100%;
  margin-top: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
}

.choice-btn {
  /* background: linear-gradient(145deg, #2c2c2c, #1a1a1a); */
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  /* width: 100px; */
}

.choice-btn img {
  width: 100%;
  border-radius: 4px;
  /* height: 76%; */
}

.choice-btn img:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
}

.choice {
  display: grid;
  text-align: center;
  width: 100%;
}

.choice img {
  width: 60%;
  margin: auto;
}

.bet-input {
  width: 100%;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 16px 0px;
  color: #ffd208;
  background: #002133;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);

  outline: none;
  transition: all 0.3s ease;
}

/* Hiệu ứng khi hover */
.bet-input:hover {
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.5);
  transform: scale(1.05);
}

/* Hiệu ứng khi focus */
.bet-input:focus {
  background: linear-gradient(135deg, #0056cc, #00b8ff);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.6);
}

/* Ẩn nút tăng giảm của input number */
.bet-input::-webkit-outer-spin-button,
.bet-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.bet-input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}

.winnings {
  padding: 10px;
  background-color: #d4a017;
  color: #1a1a2e;
  border-radius: 5px;
  text-align: center;
  margin-top: 15px;
}

.game-visual {
  width: 35%;
  align-items: center;
  display: flex;
  background: linear-gradient(90deg, #FFD208, #e5b700);
  border-radius: 24px;
  margin-left: 24px;
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
}

.game-visual-2 {
  transition: all 0.4s ease;
}

.game-visual-2.full-width {
  width: 70%;
}

.vs {
  font-size: 2em;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.game-result-history h3 {
  background: linear-gradient(90deg, #FFD208, #e5b700);
  color: #1D1D1B;
  padding: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  border-radius: 5px 5px 0px 0px;
}

.game-history {
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  background-color: #E8E8E8;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 0px 0px 5px 5px;
}

.game-history thead {
  position: sticky;
  top: 0;
  background: #f5f5f5;
  z-index: 1;
}

.game-history table {
  width: 100%;
  border-collapse: collapse;
}

.game-history th {
  background-color: #E8E8E8;
  color: #333;
  font-weight: 600;
  padding: 10px;
  text-align: center;
}

.game-history td {
  padding: 12px;
  text-align: center;
  border-top: 1px solid #eee;
}

.game-history tbody tr:nth-child(odd) {
  background-color: #fafafa;
}

.game-history tbody tr:hover {
  background-color: #fff6cc;
  transition: background 0.3s ease;
  cursor: pointer;
}

.game-history .win {
  color: #1b4332;
  font-weight: bold;
}

.game-history .lose {
  color: red;
  font-weight: bold;
}

.loading-overlay {
  left: 50%;
  top: 50%;
}

@media (max-width: 768px) {
  .game-container-2 {
    flex-direction: column;
    align-items: center;
  }

  .amount-section, .game-visual {
    width: 100% !important;
    margin-left: 0px !important;
  }
}

.highlight-text {
  font-weight: bold;
  color: #ff9800; /* màu cam nổi bật */
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 8px rgba(255, 152, 0, 0.8);
  }
  50% {
    opacity: 0.7;
    text-shadow: 0 0 16px rgba(255, 152, 0, 1);
  }
}

.shake-text {
  font-weight: bold;
  color: #002133;
  animation: shake 1s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}
</style>

<script>
import { initializeRelayerSDK } from '../utils/relayer-sdk';
import { ethers, parseEther } from 'ethers';
import contractABI from "@/abi/RockPaperScissorsABI.json";
import { ref } from "vue";
import rockImg from "@/assets/game/rock-btn.webp";
import paperImg from "@/assets/game/paper-btn.webp";
import scissorsImg from "@/assets/game/scissors-btn.webp";
import GameList from "@/components/GameList.vue";

export default {
  name: 'TestReLayer',
  components: { GameList },
  data() {
    return {
      message: 'Not initialized',
      isInitialized: false,
      instance: null,
      userAddress: null,
      dialogLoading: false,
      choice: '',
      gameId: null,
      contractAddress: '0x8178ee3F90F08011370671Fd082Df390C648ecb2',
      gameHistory: [
        { gameId: 1, amount: 0.001, date: '8/29/2025' },
        { gameId: 2, amount: 0.001, date: '8/31/2025' },
        { gameId: 3, amount: 0.001, date: '8/31/2025' },
        { gameId: 4, amount: 0.001, date: '8/31/2025' },
        { gameId: 5, amount: 0.001, date: '8/31/2025' },
      ],
      leaderboard: [
        { rank: 1, player: "0x37...9427", total: 2000, rewards: 38.8 },
        { rank: 2, player: "0x12...1bn8", total: 200, rewards: 19.4 },
        { rank: 3, player: "0x6b...7zv9", total: 190, rewards: 12.4 },

      ],
      bet: 0.001,
      images: {
        '1': rockImg,
        '2': paperImg,
        '3': scissorsImg,
      },
      playerChoice: null,
      opponentChoice: null,
      options: ["1", "2", "3"],
      intervalId: null,
      dialogRequestDecryption: false,
      snackbar: true
    };
  },
  methods: {
    async initialize() {
      if (this.isInitialized) {
        console.log('Component already initialized, skipping...');
        return;
      }
      try {
        const { instance, userAddress } = await initializeRelayerSDK();
        this.instance = instance;
        this.userAddress = userAddress;
        console.log('User address set:', this.userAddress);
        this.message = 'SDK initialized successfully!';
        this.isInitialized = true;
        // this.decrypt();
      } catch (error) {
        this.message = 'Failed to initialize SDK';
        console.error('Initialization error:', error);
      }
    },
    async createGame(event) {
      this.dialogLoading = true;
      const choice = Number(event.value);
      if (!this.instance || !choice || !this.userAddress) {
        this.message = 'SDK not initialized, no choice selected, or no user address!';
        this.dialogLoading = false;
        return;
      }

      try {
        console.log('Encrypting choice:', choice);
        const buffer = this.instance.createEncryptedInput(this.contractAddress, this.userAddress);
        buffer.add8(BigInt(parseInt(choice))); // Rock = 1, Paper = 2, Scissors = 3

        const encrypted = await buffer.encrypt();
        const inputChoice = encrypted.handles;  // ✅ Lấy đúng address
        const inputProof = encrypted.inputProof;

        const toHex = (u8arr) =>
          '0x' + [...u8arr].map(x => x.toString(16).padStart(2, '0')).join('');

        const inputChoiceHex = toHex(inputChoice[0]);
        const inputProofHex = toHex(inputProof);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, contractABI, signer);

        const betAmount = parseEther(bet);
        this.dialogLoading = false;
        const tx = await contract.createGame(inputChoiceHex, inputProofHex, { value: betAmount });
        console.log('Transaction sent:', tx.hash);

        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        const event = receipt.logs
          .map((log) => {
            try {
              return contract.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .find((e) => e?.name === 'GameCreated');

        if (event) {
          this.gameId = event.args.gameId.toString();
          this.message = `Game created successfully! ID: ${this.gameId}`;
          this.snackbar = true;
        } else {
          this.message = 'Game created, but could not retrieve game ID';
        }
      } catch (error) {
        this.message = 'Failed to create game';
        this.dialogLoading = false;
        console.error('Create game error:', error);
      }
    },

    shortAddress(addr) {
      if (!addr) return ''
      return addr.slice(0, 6) + '...' + addr.slice(-4)
    },

    async joinGame() {
      if (!this.instance || !this.playerChoice || !this.userAddress) {
        this.message = 'SDK not initialized, no choice selected, or no user address!';
        return;
      }

      if (!ethers.isAddress(this.contractAddress)) {
        this.message = 'Invalid contract address!';
        return;
      }

      // Kiểm tra giá trị choice
      if (![1, 2, 3].includes(parseInt(this.playerChoice))) {
        this.message = 'Invalid choice! Must be 1 (Rock), 2 (Paper), or 3 (Scissors)';
        console.error(this.message);
        return;
      }

      try {
        this.dialogLoading = true;
        const toHex = (u8arr) =>
          '0x' + [...u8arr].map((x) => x.toString(16).padStart(2, '0')).join('');
        console.log('Encrypting choice:', this.playerChoice);

        // Tạo buffer và mã hóa lựa chọn
        const buffer = this.instance.createEncryptedInput(this.contractAddress, this.userAddress);
        buffer.add8(BigInt(parseInt(this.playerChoice)));
        const encrypted = await buffer.encrypt();
        const inputChoiceHex = toHex(encrypted.handles[0]);
        const inputProofHex = typeof encrypted.inputProof === 'string'
          ? encrypted.inputProof
          : toHex(encrypted.inputProof);

        // Kết nối với smart contract
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, contractABI, signer);

        // Gọi joinGame với gasLimit cao
        const betAmount = parseEther("0.001"); // 0.001 ETH
        const tx = await contract.joinGame(this.gameId, inputChoiceHex, inputProofHex, {
          value: betAmount,
        });
        console.log('Transaction sent:', tx.hash);

        // Chờ giao dịch hoàn tất và phân tích log
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.transactionHash);
        this.dialogLoading = false;
        this.dialogRequestDecryption = true;
      } catch (error) {
        this.message = 'Failed to join game';
        this.dialogLoading = false;
        console.error('Join game error:', error);
        if (error.data) {
          console.error('Error data:', error.data);
        }
      }
    },

    async requestPayout(gameId) {
      // Kết nối với smart contract
      this.dialogLoading = true;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(this.contractAddress, contractABI, signer);
      const tx = await contract.requestDecryptionAndPayout(gameId);
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      this.dialogLoading = false;
      this.dialogRequestDecryption = false;
      this.message = 'Transaction sent:', receipt.transactionHash;
      this.snackbar = true;
      console.log('Transaction confirmed:', receipt);
    },

    amountUp(multiplier) {
      const current = Number(this.bet) || 0.001;
      this.bet = current * multiplier;
    },

    onChoice(choice) {
      if (this.intervalId) {
        return;
      }
      this.playerChoice = choice;
      this.opponentChoice = null;
    },

    disconnectWallet() {
      this.userAddress = null
    },

  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  },
  mounted() {
    this.initialize()
  }
};
</script>
