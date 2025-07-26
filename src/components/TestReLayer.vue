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

// ABI of the RockPaperScissors contract
const contractABI = [
  'function createGame(address inputChoice, bytes calldata inputProof) external',
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
      contractAddress: '0xf657c9B0fB564618124C5a9ECd3C8c89F7bc40cC', // Replace with your deployed contract address
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
        console.log('Creating game with choice:', this.choice, 'User address:', this.userAddress);

        // Encrypt the choice
        const encryptedInput = this.instance.createEncryptedInput(
          this.contractAddress,
          parseInt(this.choice),
          this.userAddress
        );
        console.log('Encrypted input:', encryptedInput);

        // Get provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum); // Ethers.js v6
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, contractABI, signer);

        // Call createGame
        const tx = await contract.createGame(
          encryptedInput.handle,
          encryptedInput.inputProof
        );
        console.log('Transaction sent:', tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        // Extract gameId from event
        const event = receipt.logs
          .map((log) => contract.interface.parseLog(log))
          .find((e) => e?.name === 'GameCreated');
        if (event) {
          this.gameId = event.args.gameId.toNumber();
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
