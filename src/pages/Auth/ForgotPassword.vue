<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const submit = async () => {
  if (!email.value) {
    errorMessage.value = 'Please enter your email address';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    await authStore.forgotPasswordRequest(email.value);
    
    if (authStore.passwordResetEmailSent) {
      successMessage.value = 'Password reset link has been sent to your email address.';
      email.value = ''; // Clear the email field
    }
  } catch (error) {
    console.error('Forgot password request failed:', error);
    errorMessage.value = 'Failed to send password reset email. Please check your email address and try again.';
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-20 w-auto" src="/logo.svg" alt="Your Company" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Forgot your password?</h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Enter your email address and we'll send you a link to reset your password.
    </p>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" @submit.prevent="submit">
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4">
        <div class="text-sm text-red-700">{{ errorMessage }}</div>
      </div>
      
      <div v-if="successMessage" class="rounded-md bg-green-50 p-4 mb-4">
        <div class="text-sm text-green-700">{{ successMessage }}</div>
      </div>
      
      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div class="mt-2">
          <input v-model="email" type="email" name="email" id="email" autocomplete="email" required 
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <span v-if="isLoading">Processing...</span>
          <span v-else>Send Reset Link</span>
        </button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Remember your password?
      <a @click="goToLogin" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Back to login</a>
    </p>
  </div>
</div>
</template>