<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useConfigStore } from '@/stores';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const configStore = useConfigStore();

const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const resendLoading = ref(false);

const user = computed(() => authStore.user);
const isVerified = computed(() => authStore.isVerified);

// For handling the verification link from email
onMounted(async () => {
  // Check if we're verifying from an email link
  const id = route.params.id?.toString();
  const hash = route.params.hash?.toString();
  
  if (id && hash) {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      successMessage.value = '';
      
      await authStore.verifyUserEmail(id, hash);
      successMessage.value = 'Your email has been verified successfully!';
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push({ name: 'home' });
      }, 2000);
    } catch (error) {
      console.error('Email verification failed:', error);
      errorMessage.value = 'Failed to verify email. The verification link may be invalid or expired.';
    } finally {
      isLoading.value = false;
    }
  } else {
    // Just showing the verification status page
    await authStore.getUser();
  }
});

const resendVerificationEmail = async () => {
  try {
    resendLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    await authStore.resendVerification();
    
    if (authStore.verificationEmailSent) {
      successMessage.value = 'A new verification link has been sent to your email address.';
    }
  } catch (error) {
    console.error('Failed to resend verification email:', error);
    errorMessage.value = 'Failed to send verification email. Please try again later.';
  } finally {
    resendLoading.value = false;
  }
};

const goToDashboard = () => {
  router.push({ name: 'home' });
};
</script>

<template>
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-20 w-auto" :src="configStore.logos.auth" alt="Your Company" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Email Verification</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <div v-if="isLoading" class="text-center py-4">
      <p class="text-gray-600">Verifying your email...</p>
    </div>
    
    <div v-else>
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4">
        <div class="text-sm text-red-700">{{ errorMessage }}</div>
      </div>
      
      <div v-if="successMessage" class="rounded-md bg-green-50 p-4 mb-4">
        <div class="text-sm text-green-700">{{ successMessage }}</div>
      </div>
      
      <div v-if="!isVerified && user" class="text-center space-y-6">
        <div class="rounded-md bg-yellow-50 p-4 mb-4">
          <div class="text-sm text-yellow-700">
            Your email address is not verified. Please check your email for a verification link or request a new one.
          </div>
        </div>
        
        <p class="text-gray-600">
          A verification link has been sent to your email address: <strong>{{ user.email }}</strong>
        </p>
        
        <div>
          <button 
            @click="resendVerificationEmail" 
            :disabled="resendLoading" 
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span v-if="resendLoading">Sending...</span>
            <span v-else>Resend Verification Email</span>
          </button>
        </div>
      </div>
      
      <div v-else-if="isVerified && user" class="text-center space-y-6">
        <div class="rounded-md bg-green-50 p-4 mb-4">
          <div class="text-sm text-green-700">
            Your email address has been verified.
          </div>
        </div>
        
        <div>
          <button 
            @click="goToDashboard" 
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>