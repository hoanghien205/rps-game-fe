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
    <button @click="createGame" :disabled="!isInitialized || !choice">Create Game</button>
    <p>{{ message }}</p>
    <p v-if="gameId">Game Created: ID {{ gameId }}</p>
  </div>
</template>

<script>
import { initializeRelayerSDK } from '../utils/relayer-sdk';
import { ethers } from 'ethers';

const contractABI = [
  'function createGame(bytes32 inputChoice, bytes calldata inputProof) external',
  'event GameCreated(uint256 indexed gameId, address indexed player1)',
];

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
      contractAddress: '0xf657c9B0fB564618124C5a9ECd3C8c89F7bc40cC', // thay bằng địa chỉ contract thật của bạn
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

        // ✅ 1. Tạo buffer và thêm lựa chọn (1, 2 hoặc 3)
        const buffer = this.instance.createEncryptedInput(this.contractAddress, this.userAddress);
        buffer.add64(BigInt(parseInt(this.choice))); // Rock = 1, Paper = 2, Scissors = 3

        // ✅ 2. Mã hóa & gửi lên relayer
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

        const tx = await contract.createGame(inputChoiceHex, inputProofHex);
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
  },
};
</script>
