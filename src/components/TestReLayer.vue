<template>
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
</template>

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
