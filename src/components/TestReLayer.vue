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
      <div class="logo">ZamaRPS</div>
      <nav class="nav">
        <!-- <span>Games</span> -->
        <!-- <span>Monroll</span> -->
        <span>Connect</span>
        <!-- <span>Leaderboard</span> -->
      </nav>
      <!-- <div class="airdrop">
        <span>Weekly Airdrop</span>
        <span class="airdrop-amount">8,759.51 </span>
        <span class="airdrop-balance">140.9 </span>
      </div> -->
    </header>

    <!-- Main Content -->
    <main class="main">
      <div class="game-container">
        <!-- Left Panel: Game Controls -->
        <div class="game-controls">
          <h1>Rock Paper Scissors</h1>
          <!-- <button class="play-button">Let's play!</button> -->
          <div class="game-container-2">
            <div class="amount-section">

              <div>
                <h3>Bet size</h3>
                <input type="number" v-model="bet" value="0.01" />
                <button class="amount-btn" @click="amountUp(1)">1x</button>
                <button class="amount-btn" @click="amountUp(2)">2x</button>
                <button class="amount-btn" @click="amountUp(3)">3x</button>
                <!-- <button class="amount-btn" @click="amountUp(1)">max</button> -->
              </div>

              <div class="choices-section">
                <h3>Your Choice</h3>
                <div class="choices">
                  <button class="choice-btn" data-choice="rock" @click="onChoice('rock')">
                    <img src="@/assets/rock.svg" />
                  </button>
                  <button class="choice-btn" data-choice="paper" @click="onChoice('paper')">
                    <img src="@/assets/paper.svg" />
                  </button>
                  <button class="choice-btn" data-choice="scissors" @click="onChoice('scissors')">
                    <img src="@/assets/scissors.svg" />
                  </button>
                </div>
              </div>

              <button class="play-btn" @click="play()">PLAY</button>

              <div class="winnings">
                <span>Your Winnings:</span>
                <span>0 </span>
              </div>
            </div>


            <div class="game-visual">
              <img v-if="playerChoice" :key="playerChoice" :src="images[playerChoice]" :alt="playerChoice" />
              <span class="vs" v-if="playerChoice && opponentChoice">VS</span>
              <transition name="fade" mode="out-in">
                <img v-if="opponentChoice" :key="opponentChoice" :src="images[opponentChoice]" :alt="opponentChoice" />
              </transition>
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
                    <th>Your Pick</th>
                    <th>Opponent Pick</th>
                    <th>Bet</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in gameHistory">
                    <td>{{ item.yourPick }}</td>
                    <td>{{ item.opponentPick }}</td>
                    <td>{{ item.bet }}</td>
                    <td>
                      <span class="result-badge" :class="item.result >= item.bet ? 'win' : 'lose'">{{ item.result
                      }}</span>
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
                  <tr v-for="player in leaderboard" :class="`rank-${player.rank}`">
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
</template>

<style scoped>
.app-container {
  background-color: #FFD208;
  color: #1D1D1B;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header {
  width: 100%;
  background-color: #FFD208;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
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
  background: linear-gradient(90deg, #2D2D44, #e52e71, #6a5acd);
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
  background: linear-gradient(90deg, #2D2D44, #e52e71, #6a5acd);
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
  max-width: 1200px;
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
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.game-container-3 {
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.game-result-history {
  width: 50%;
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
  padding: 10px;
  background-color: #FFD208;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin: auto;
  margin-top: 24px;
  font-weight: 700;
  font-size: 32px;
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
}

.amount-section {
  margin-bottom: 15px;
  width: 40%;
}

.amount-section label {
  display: block;
  margin-bottom: 5px;
}

.amount-section input {
  width: 100%;
  padding: 10px;
  background-color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
}

.amount-btn {
  padding: 10px 8px;
  background-color: #2d2d44;
  color: white;
  border: none;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
  width: 60px;
}

.amount-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
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
}

.choice-btn {
  /* background: linear-gradient(145deg, #2c2c2c, #1a1a1a); */
  border: none;
  padding: 15px;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  width: 100px;
  height: 100px;
}

.choice-btn img {
  width: 100%;
  /* height: 76%; */
}

.choice-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
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
  width: 60%;
  align-items: center;
  display: flex;
  justify-content: space-around;
  background: linear-gradient(90deg, #FFD208, #e5b700);
  border-radius: 24px;
  margin-left: 24px;
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
}

.game-visual img {
  width: 40%;
  margin: 10px;
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
</style>

<script>
import { initializeRelayerSDK } from '../utils/relayer-sdk';
import { ethers, parseEther } from 'ethers';
import contractABI from "@/abi/RockPaperScissorsABI.json";
import { ref } from "vue";
import rockImg from "@/assets/rock.svg";
import paperImg from "@/assets/paper.svg";
import scissorsImg from "@/assets/scissors.svg";

export default {
  name: 'TestReLayer',
  data() {
    return {
      message: 'Not initialized',
      isInitialized: false,
      instance: null,
      userAddress: null,
      choice: '',
      gameId: null,
      contractAddress: '0x1dFc7F2ab482da7cFA182e1E6992947F3C4F20BB', // thay bằng địa chỉ contract thật của bạn
      gameHistory: [
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 20 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 1 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 20 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 20 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 1 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 20 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 20 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 1 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 20 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 20 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 1 },
        { yourPick: 'Rock', opponentPick: "Scissors", bet: 10, result: 20 },
      ],
      leaderboard: [
        { rank: 1, player: "0x37...7777", total: 2000, rewards: 38.8 },
        { rank: 2, player: "0x37...7778", total: 200, rewards: 19.4 },
        { rank: 3, player: "0x37...7779", total: 190, rewards: -19.4 },
        { rank: 1, player: "0x37...7777", total: 2000, rewards: 38.8 },
        { rank: 2, player: "0x37...7778", total: 200, rewards: 19.4 },
        { rank: 3, player: "0x37...7779", total: 190, rewards: -19.4 },
        { rank: 1, player: "0x37...7777", total: 2000, rewards: 38.8 },
        { rank: 2, player: "0x37...7778", total: 200, rewards: 19.4 },
        { rank: 3, player: "0x37...7779", total: 190, rewards: -19.4 },
        { rank: 1, player: "0x37...7777", total: 2000, rewards: 38.8 },
        { rank: 2, player: "0x37...7778", total: 200, rewards: 19.4 },
        { rank: 3, player: "0x37...7779", total: 190, rewards: -19.4 },

      ],
      bet: 0.01,
      images: {
        rock: rockImg,
        paper: paperImg,
        scissors: scissorsImg,
      },
      playerChoice: null,
      opponentChoice: null,
      options: ["rock", "paper", "scissors"],
      intervalId: null,
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
    async createGame() {
      if (!this.instance || !this.choice || !this.userAddress) {
        this.message = 'SDK not initialized, no choice selected, or no user address!';
        return;
      }

      if (!ethers.isAddress(this.contractAddress)) {
        this.message = 'Invalid contract address!';
        return;
      }

      try {
        console.log('Encrypting choice:', this.choice);


        const buffer = this.instance.createEncryptedInput(this.contractAddress, this.userAddress);
        buffer.add8(BigInt(parseInt(this.choice))); // Rock = 1, Paper = 2, Scissors = 3

        const encrypted = await buffer.encrypt();
        const inputChoice = encrypted.handles;  // ✅ Lấy đúng address
        const inputProof = encrypted.inputProof;

        const toHex = (u8arr) =>
          '0x' + [...u8arr].map(x => x.toString(16).padStart(2, '0')).join('');

        const inputChoiceHex = toHex(inputChoice[0]);  // ✅ chính xác
        const inputProofHex = toHex(inputProof);

        // ✅ 3. Kết nối và gọi smart contract
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, contractABI, signer);

        const betAmount = parseEther("0.001");
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
        } else {
          this.message = 'Game created, but could not retrieve game ID';
        }
      } catch (error) {
        this.message = 'Failed to create game';
        console.error('Create game error:', error);
      }
    },

    async joinGame(id) {
      if (!this.instance || !this.choice || !this.userAddress) {
        this.message = 'SDK not initialized, no choice selected, or no user address!';
        return;
      }

      if (!ethers.isAddress(this.contractAddress)) {
        this.message = 'Invalid contract address!';
        return;
      }

      // Kiểm tra giá trị choice
      if (![1, 2, 3].includes(parseInt(this.choice))) {
        this.message = 'Invalid choice! Must be 1 (Rock), 2 (Paper), or 3 (Scissors)';
        console.error(this.message);
        return;
      }

      try {
        const toHex = (u8arr) =>
          '0x' + [...u8arr].map((x) => x.toString(16).padStart(2, '0')).join('');
        console.log('Encrypting choice:', this.choice);

        // Tạo buffer và mã hóa lựa chọn
        const buffer = this.instance.createEncryptedInput(this.contractAddress, this.userAddress);
        buffer.add8(BigInt(parseInt(this.choice)));
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
        const tx = await contract.joinGame(id, inputChoiceHex, inputProofHex, {
          value: betAmount,
        });
        console.log('Transaction sent:', tx.hash);

        // Chờ giao dịch hoàn tất và phân tích log
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.transactionHash);

        // Phân tích các sự kiện DebugFHE
        const debugEvents = receipt.logs
          .map((log) => {
            try {
              return contract.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .filter((e) => e?.name === 'DebugFHE');

        if (debugEvents.length > 0) {
          console.log('DebugFHE events:');
          debugEvents.forEach((event) => {
            const message = event.args.message;
            const data = event.args.data;
            let numericData;
            try {
              numericData = ethers.BigNumber.from(data).toNumber();
            } catch {
              numericData = data; // Giữ nguyên nếu không chuyển thành số được
            }
            console.log(`- ${message}: ${numericData}`);
          });
          this.message = 'Game joined successfully! Check console for debug logs.';
        } else {
          this.message = 'Game joined, but no DebugFHE events found.';
        }
      } catch (error) {
        this.message = 'Failed to join game';
        console.error('Join game error:', error);
        if (error.data) {
          console.error('Error data:', error.data);
        }
      }
    },

    async revealAndGetResult(gameId) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const ciphertextHandle = '0x59573f986e594fd35e77d341aca13b22053eb3871dff0000000000aa36a70200';
      const keypair = this.instance.generateKeypair();

      // 4. Chuẩn bị request EIP-712
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "10";
      const contractAddresses = [this.contractAddress];
      const contractAddress = this.contractAddress;
      const eip712 = this.instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      );

      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message
      );
      // 5. Gọi userDecrypt
      const result = await this.instance.userDecrypt(
        [{ handle: ciphertextHandle, contractAddress }],
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        signer.address,
        startTimeStamp,
        durationDays
      );

      const decryptedValue = result[ciphertextHandle];
      console.log("Giá trị giải mã:", decryptedValue);
      return decryptedValue;
    },

    amountUp(multiplier) {
      this.bet = Number(this.bet) * multiplier;
    },

    onChoice(choice) {
      if (this.intervalId) {
        return;
      }
      this.playerChoice = choice;
      this.opponentChoice = null;
    },

    play() {
      if (this.intervalId) {
        return;
      }
      let index = 0;
      this.intervalId = setInterval(() => {
        this.opponentChoice = this.options[index % this.options.length];
        index++;
      }, 300);

      // Sau 2s thì dừng và chọn kết quả thật sự
      setTimeout(() => {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.opponentChoice =
          this.options[Math.floor(Math.random() * this.options.length)];
      }, 2000);
    },
  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  },
};
</script>
