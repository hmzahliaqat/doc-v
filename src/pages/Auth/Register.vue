<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const submit = async () => {
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
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
    await authStore.registerUser(name.value, email.value, password.value, passwordConfirmation.value);
    
    // If registration was successful, redirect to login or verification page
    if (authStore.registrationSuccess) {
      router.push({ name: 'login' });
    }
  } catch (error) {
    console.error('Registration failed:', error);
    errorMessage.value = 'Registration failed. Please check your information and try again.';
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
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" @submit.prevent="submit">
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4">
        <div class="text-sm text-red-700">{{ errorMessage }}</div>
      </div>
      
      <div>
        <label for="name" class="block text-sm/6 font-medium text-gray-900">Full name</label>
        <div class="mt-2">
          <input v-model="name" type="text" name="name" id="name" autocomplete="name" required 
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div class="mt-2">
          <input v-model="email" type="email" name="email" id="email" autocomplete="email" required 
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
        <div class="mt-2">
          <input v-model="password" type="password" name="password" id="password" autocomplete="new-password" required 
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <label for="password_confirmation" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
        <div class="mt-2">
          <input v-model="passwordConfirmation" type="password" name="password_confirmation" id="password_confirmation" autocomplete="new-password" required 
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <span v-if="isLoading">Processing...</span>
          <span v-else>Register</span>
        </button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Already have an account?
      <a @click="goToLogin" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Sign in</a>
    </p>
  </div>
</div>
</template>