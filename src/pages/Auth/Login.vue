<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useConfigStore } from '@/stores';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const configStore = useConfigStore();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const submit = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    await authStore.loginUser(email.value, password.value);
    router.push({ name: 'home' });
  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = 'Invalid credentials. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const goToRegister = () => {
  router.push({ name: 'register' });
};

const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' });
};
</script>

<template>
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-20 w-auto" :src="configStore.logos.auth" alt="Your Company" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" @submit.prevent="submit">
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4">
        <div class="text-sm text-red-700">{{ errorMessage }}</div>
      </div>
      
      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div class="mt-2">
          <input v-model="email" type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          <div class="text-sm">
            <a @click="goToForgotPassword" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Forgot password?</a>
          </div>
        </div>
        <div class="mt-2">
          <input v-model="password" type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <span v-if="isLoading">Processing...</span>
          <span v-else>Sign in</span>
        </button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Not a member?
      <a @click="goToRegister" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Register</a>
    </p>
  </div>
</div>
</template>