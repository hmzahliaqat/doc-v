<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useConfigStore } from '@/stores';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const configStore = useConfigStore();

const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const token = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

onMounted(() => {
  // Get token and email from route query parameters
  token.value = route.query.token?.toString() || '';
  email.value = route.query.email?.toString() || '';
  
  if (!token.value) {
    errorMessage.value = 'Invalid password reset link. Please request a new one.';
  }
});

const submit = async () => {
  if (!email.value || !password.value || !passwordConfirmation.value || !token.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    await authStore.resetPasswordRequest(
      email.value,
      password.value,
      passwordConfirmation.value,
      token.value
    );
    
    if (authStore.passwordResetSuccess) {
      successMessage.value = 'Password has been reset successfully.';
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push({ name: 'login' });
      }, 2000);
    }
  } catch (error) {
    console.error('Password reset failed:', error);
    errorMessage.value = 'Failed to reset password. Please check your information and try again.';
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};

const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' });
};
</script>

<template>
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-20 w-auto" :src="configStore.logos.auth" alt="Your Company" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Reset your password</h2>
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
        <label for="password" class="block text-sm/6 font-medium text-gray-900">New Password</label>
        <div class="mt-2">
          <input v-model="password" type="password" name="password" id="password" autocomplete="new-password" required 
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <label for="password_confirmation" class="block text-sm/6 font-medium text-gray-900">Confirm New Password</label>
        <div class="mt-2">
          <input v-model="passwordConfirmation" type="password" name="password_confirmation" id="password_confirmation" autocomplete="new-password" required 
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <span v-if="isLoading">Processing...</span>
          <span v-else>Reset Password</span>
        </button>
      </div>
    </form>

    <div class="mt-10 text-center text-sm/6 text-gray-500">
      <p>
        <a @click="goToLogin" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Back to login</a>
      </p>
      <p class="mt-2">
        <a @click="goToForgotPassword" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Request a new reset link</a>
      </p>
    </div>
  </div>
</div>
</template>