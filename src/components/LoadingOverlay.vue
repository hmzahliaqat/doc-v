<template>
  <Teleport to="body">
    <div v-if="visible" class="loading-overlay">
      <div class="loading-container">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <p v-if="message" class="loading-message">{{ message }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Loading...'
  }
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.loading-message {
  margin-top: 1rem;
  font-size: 1rem;
  color: #4b5563;
}
</style>