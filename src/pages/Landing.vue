
<template>
  <v-app>
    <TestReLayer></TestReLayer>
    <!-- <v-main class="landing-background">
      <v-container class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6">
            <v-card class="pa-6" elevation="6" rounded="lg">
              <v-card-title class="text-h5 primary white--text justify-center">
                Welcome to Rock Paper Scissors
              </v-card-title>
              <v-card-text class="text-center">
                <v-progress-circular
                  v-if="walletLoading"
                  indeterminate
                  color="primary"
                  size="50"
                  class="my-4"
                ></v-progress-circular>
                <v-btn
                  v-else
                  color="primary"
                  large
                  :disabled="walletConnected"
                  @click="connectWallet"
                >
                  <v-icon left>mdi-wallet</v-icon>
                  Connect Web3 Wallet
                </v-btn>
                <v-alert
                  v-if="walletError"
                  type="error"
                  dense
                  class="mt-4"
                >
                  {{ walletError }}
                </v-alert>
                <p v-if="walletAddress" class="mt-4 text-body-1">
                  Connected: <strong>{{ truncateAddress(walletAddress) }}</strong>
                </p>
                <v-btn
                  v-if="walletConnected"
                  color="success"
                  large
                  class="mt-4"
                  to="/home"
                >
                  Go to Home
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main> -->
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { ethers } from 'ethers';
import { useRouter } from 'vue-router';
import TestReLayer from "@/components/TestReLayer.vue";

const router = useRouter();
const walletConnected = ref(false);
const walletAddress = ref('');
const walletLoading = ref(false);
const walletError = ref('');

const truncateAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
};

const connectWallet = async () => {
  walletLoading.value = true;
  walletError.value = '';
  try {
    if (!window.ethereum) {
      walletError.value = 'Please install MetaMask or another Web3 wallet.';
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    walletAddress.value = await signer.getAddress();
    walletConnected.value = true;
    // Store wallet address in localStorage for other components
    localStorage.setItem('walletAddress', walletAddress.value);
  } catch (error) {
    walletError.value = 'Failed to connect wallet: ' + error.message;
  } finally {
    walletLoading.value = false;
  }
};
</script>

<style scoped>
.landing-background {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
}
</style>

