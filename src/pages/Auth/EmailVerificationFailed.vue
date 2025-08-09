<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfigStore } from '@/stores';

const router = useRouter();
const route = useRoute();
const configStore = useConfigStore();

const errorMessage = ref('Email verification failed.');

onMounted(() => {
  const error = route.query.error?.toString();
  
  if (error === 'invalid-link') {
    errorMessage.value = 'The verification link is invalid or has expired.';
  } else if (error === 'verification-failed') {
    errorMessage.value = 'Unable to verify your email. Please try again.';
  }
});

const goToDashboard = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-20 w-auto" :src="configStore.logos.auth" alt="Your Company" />
      <h1 class="mt-10 text-center text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <div class="rounded-md bg-red-50 p-4 mb-4">
        <div class="text-sm text-red-700">{{ errorMessage }}</div>
      </div>
      
      <p class="text-gray-600 mb-4">Please try again or contact support if the problem persists.</p>
      
      <button
        @click="goToDashboard"
        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
</template>