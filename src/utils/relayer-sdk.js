// src/utils/relayer-sdk.js
import { ethers } from 'ethers';

export const initializeRelayerSDK = async () => {
  console.log('Starting SDK initialization...');

  if (!window.relayerSDK) {
    throw new Error('Relayer SDK not loaded. Check CDN script in index.html.');
  }

  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const { initSDK, createInstance, SepoliaConfig } = window.relayerSDK;

  try {
    // Request MetaMask account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No MetaMask accounts connected');
    }
    const userAddress = accounts[0];
    console.log('MetaMask user address:', userAddress);

    // Validate user address (Ethers.js v6)
    if (!ethers.isAddress(userAddress)) {
      throw new Error('Invalid MetaMask user address');
    }

    // Ensure Sepolia network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
    });

    await initSDK();
    console.log('SDK initialized, creating instance...');
    const config = { ...SepoliaConfig, network: window.ethereum };
    const instance = await createInstance(config);
    console.log('Instance created:', instance);
    return { instance, userAddress };
  } catch (error) {
    console.error('Failed to initialize relayer-sdk:', error);
    throw error;
  }
};
