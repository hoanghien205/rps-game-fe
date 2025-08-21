<template>
  <div class="game">
    <v-img :src="gameBg" contain max-width="390px"></v-img>
    <div class="list-action">
      <div class="actions">
        <v-img
          :src="rockBtn"
          max-width="90px"
          class="cursor-pointer"
          :class="{ selected: selectedAction === 'rock' }"
          @click="selectAction('rock')"
        ></v-img>
        <v-img
          :src="paperBtn"
          max-width="90px"
          class="cursor-pointer"
          :class="{ selected: selectedAction === 'paper' }"
          @click="selectAction('paper')"
        ></v-img>
        <v-img
          :src="scissorsBtn"
          max-width="90px"
          class="cursor-pointer"
          :class="{ selected: selectedAction === 'scissors' }"
          @click="selectAction('scissors')"
        ></v-img>
      </div>
      <div class="submit">
        <v-img
          :src="submitBtn"
          class="cursor-pointer"
          max-width="160px"
          :class="{ disabled: !selectedAction }"
          :disabled="!selectedAction"
          @click="submitAction"
        ></v-img>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import gameBg from "@/assets/game/bg-game.webp";
import rockBtn from "@/assets/game/rock-btn.webp";
import paperBtn from "@/assets/game/paper-btn.webp";
import scissorsBtn from "@/assets/game/scissors-btn.webp";
import submitBtn from "@/assets/game/submit-btn.webp";

// Reactive state to track the selected action
const selectedAction = ref(null);

// Function to handle action selection
const selectAction = (action) => {
  selectedAction.value = action;
};

// Function to handle submit button click
const submitAction = () => {
  if (selectedAction.value) {
    console.log(`Selected action: ${selectedAction.value}`);
    // Add your submit logic here (e.g., send to backend, process game logic)
  }
};
</script>

<style scoped>
.game {
  display: flex;
  justify-content: center;
  position: relative;
}

.list-action {
  position: absolute;
  width: 390px;
  top: 420px;
}

.actions {
  justify-content: space-between;
  padding: 16px;
  display: flex;
}

.submit {
  display: flex;
  justify-content: center;
}


.selected {
  filter: brightness(1.3);
  border: 2px solid #ffd700;
  border-radius: 4px;
}


.disabled {
  filter: grayscale(100%);
  opacity: 0.5;
  pointer-events: none;
}


.submit img:not(.disabled):hover {
  filter: brightness(1.2);
  cursor: pointer;
}
</style>
