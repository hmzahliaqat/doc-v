<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  showOnVerified: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const user = computed(() => authStore.user);
const isVerified = computed(() => authStore.isVerified);

// Check URL parameters for verification status and fetch verification status
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('verified') === '1') {
    // Show success message if verified parameter is present
    if (!urlParams.get('already_verified')) {
      successMessage.value = 'Email verified successfully!';
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    }
  }
  
  // Check verification status independently
  try {
    await authStore.checkEmailVerificationStatus();
  } catch (error) {
    console.error('Error checking verification status:', error);
  }
});

const sendVerificationEmail = async () => {
  loading.value = true;
  try {
    await authStore.resendVerification();
    
    if (authStore.verificationEmailSent) {
      successMessage.value = 'Verification email sent! Please check your inbox.';
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    errorMessage.value = 'Failed to send verification email. Please try again later.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!-- Success message toast -->
  <div v-if="successMessage" class="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
    {{ successMessage }}
  </div>
  
  <!-- Error message toast -->
  <div v-if="errorMessage" class="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
    {{ errorMessage }}
  </div>

  <!-- Verification banner for unverified users -->
  <div v-if="!isVerified && user" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
    <p class="mb-2">Please verify your email address to access all features.</p>
    <button
      @click="sendVerificationEmail"
      :disabled="loading"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {{ loading ? 'Sending...' : 'Send Verification Email' }}
    </button>
  </div>
  
  <!-- Success banner for verified users (optional) -->
  <div v-else-if="isVerified && user && showOnVerified" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
    ✅ Your email is verified!
  </div>
</template>