<!-- <template>
  <div>
    <h1>Rock Paper Scissors</h1>
    <button @click="initialize" :disabled="isInitialized">Initialize SDK</button>
    <select v-model="choice" :disabled="!isInitialized">
      <option value="" disabled>Select Choice</option>
      <option value="1">Rock</option>
      <option value="2">Paper</option>
      <option value="3">Scissors</option>
    </select>
    <v-btn color="primary" @click="createGame" :disabled="!isInitialized || !choice">Create Game</v-btn>
    <v-btn color="secondary" @click="joinGame(1)" :disabled="!isInitialized || !choice">Join Game</v-btn>
    <v-btn color="green" @click="revealAndGetResult(1)" :disabled="!isInitialized">view result</v-btn>
    <p>{{ message }}</p>
    <p v-if="gameId">Game Created: ID {{ gameId }}</p>
  </div>
</template> -->

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
        <span>Faucet</span>
        <span>Leaderboard</span>
      </nav>
      <div class="airdrop">
        <span>Weekly Airdrop</span>
        <span class="airdrop-amount">8,759.51 </span>
        <span class="airdrop-balance">140.9 </span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main">
      <div class="game-container">
        <!-- Left Panel: Game Controls -->
        <div class="game-controls">
          <h2>Rock Paper Scissors</h2>
          <button class="play-button">Let's play!</button>
          <div class="amount-section">
            <label>Amount</label>
            <input type="number" value="20" />
            <button class="amount-btn">2x</button>
            <button class="amount-btn">max</button>
          </div>
          <div class="choices-section">
            <label>Choose side</label>
            <div class="choices">
              <button class="choice-btn">Rock</button>
              <button class="choice-btn">Paper</button>
              <button class="choice-btn">Scissors</button>
            </div>
          </div>
          <button class="play-btn">Play</button>
          <div class="winnings">
            <span>Your Winnings:</span>
            <span>0 </span>
          </div>
        </div>

        <!-- Center Panel: Game Visual -->
        <div class="game-visual">
          <img src="" alt="Rock" />
          <span class="vs">VS</span>
          <img src="" alt="Scissors" />
        </div>

        <!-- Right Panel: Result and Recent Games -->
        <div class="game-result-history">
          <div class="game-result">
            <span>YOU WIN</span>
            <span class="win-amount">38.8 MONAD</span>
          </div>
          <div class="game-history">
            <h3>Your Recent Games</h3>
            <table>
              <tr>
                <th>Game</th>
                <th>Player Pick</th>
                <th>Contract Pick</th>
                <th>Bet</th>
                <th>Winnings</th>
                <th>Time</th>
                <th>Transaction</th>
              </tr>
              <tr>
                <td>RPS</td>
                <td>Rock</td>
                <td>Scissors</td>
                <td>20</td>
                <td class="win">38.8</td>
                <td>10 Aug 16:23</td>
                <td>Explore</td>
              </tr>
              <tr>
                <td>RPS</td>
                <td>Scissors</td>
                <td>Scissors</td>
                <td>20</td>
                <td class="win">19.4</td>
                <td>10 Aug 16:23</td>
                <td>Explore</td>
              </tr>
            </table>
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
  padding: 10px;
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
  gap: 15px;
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

.game-controls, .game-history {
  padding: 15px;
  background-color: #E8E8E8;
  border-radius: 5px;
}

.game-controls h2, .game-history h3 {
  text-align: center;
  margin-bottom: 15px;
}

.play-button {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #1b4332;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.play-btn {
  width: 100%;
  padding: 10px;
  background-color: #FFD208;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.amount-section {
  margin-bottom: 15px;
}

.amount-section label {
  display: block;
  margin-bottom: 5px;
}

.amount-section input {
  width: 100%;
  padding: 10px;
  background-color: #2d2d44;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
}

.amount-btn {
  padding: 10px 20px;
  background-color: #FFD208;
  color: white;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
}

.choices-section label {
  display: block;
  margin-bottom: 5px;
}

.choices {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.choice-btn {
  padding: 10px 20px;
  background-color: #1a1a2e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
  text-align: center;
}

.game-visual img {
  width: 120px;
  margin: 10px;
}

.vs {
  font-size: 2em;
  font-weight: bold;
}

.game-result {
  background-color: #1b4332;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 15px;
}

.game-result .win-amount {
  color: #d4a017;
  margin-left: 10px;
}

.game-history table {
  width: 100%;
  border-collapse: collapse;
}

.game-history th, .game-history td {
  padding: 5px;
  text-align: center;
}

.game-history .win {
  color: #1b4332;
}
</style>

<script>
import { initializeRelayerSDK } from '../utils/relayer-sdk';
import { ethers,parseEther } from 'ethers';
import contractABI from "@/abi/RockPaperScissorsABI.json";

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
        const tx = await contract.createGame(inputChoiceHex, inputProofHex,  { value: betAmount });
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
    }

  },
};
</script>
