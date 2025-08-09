<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-20 w-auto" :src="configStore.logos.auth" alt="Your Company" />
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
            <input
              v-model="name"
              type="text"
              name="name"
              id="name"
              autocomplete="name"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{ 'border-red-500': fieldErrors.name }"
            />
            <p v-if="fieldErrors.name" class="mt-1 text-sm text-red-600">{{ fieldErrors.name }}</p>
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{ 'border-red-500': fieldErrors.email }"
            />
            <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">{{ fieldErrors.email }}</p>
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          <div class="mt-2">
            <input
              v-model="password"
              type="password"
              name="password"
              id="password"
              autocomplete="new-password"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{ 'border-red-500': fieldErrors.password }"
            />
            <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">{{ fieldErrors.password }}</p>
          </div>
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
          <div class="mt-2">
            <input
              v-model="passwordConfirmation"
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              autocomplete="new-password"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{ 'border-red-500': fieldErrors.password_confirmation }"
            />
            <p v-if="fieldErrors.password_confirmation" class="mt-1 text-sm text-red-600">{{ fieldErrors.password_confirmation }}</p>
          </div>
        </div>

        <!-- Direct Google reCAPTCHA -->
        <div class="mt-4 flex justify-center">
          <div
            ref="recaptchaContainer"
            id="register-recaptcha-container"
          ></div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !captchaVerified"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
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

<script setup>
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useConfigStore } from '@/stores';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const configStore = useConfigStore();
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const errorMessage = ref('');
const fieldErrors = reactive({});
const isLoading = ref(false);
const captchaVerified = ref(false);
const captchaToken = ref('');
const recaptchaContainer = ref(null);
const recaptchaId = ref(null);

const SITE_KEY = '6LfEjZ8rAAAAAENDoqHf53o-JBp-nHiaFvaCSib2';

// Global callback functions for reCAPTCHA
const setupRecaptchaCallbacks = () => {
  // Success callback
  window.onRegisterRecaptchaSuccess = (token) => {
    captchaVerified.value = true;
    captchaToken.value = token;

    // Clear any reCAPTCHA-related error messages
    if (errorMessage.value.includes('CAPTCHA') || errorMessage.value.includes('captcha')) {
      errorMessage.value = '';
    }
  };

  // Expired callback
  window.onRegisterRecaptchaExpired = () => {
    captchaVerified.value = false;
    captchaToken.value = '';
    errorMessage.value = 'reCAPTCHA expired. Please verify again.';
  };

  // Error callback
  window.onRegisterRecaptchaError = () => {
    captchaVerified.value = false;
    captchaToken.value = '';
    errorMessage.value = 'reCAPTCHA failed. Please try again.';
  };
};

// Load and render reCAPTCHA
const loadRecaptcha = () => {
  // Check if script is already loaded
  if (window.grecaptcha && window.grecaptcha.render) {
    renderRecaptcha();
    return;
  }

  // Check if script is already in the DOM
  const existingScript = document.querySelector('script[src*="recaptcha"]');
  if (existingScript) {
    // Script exists, wait for it to load
    if (window.grecaptcha) {
      renderRecaptcha();
    } else {
      // Wait for the existing script to load
      const checkForGrecaptcha = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(checkForGrecaptcha);
          renderRecaptcha();
        }
      }, 100);
    }
    return;
  }

  // Load the reCAPTCHA script
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?onload=initRegisterRecaptcha&render=explicit`;
  script.async = true;
  script.defer = true;

  // Setup the initialization function
  window.initRegisterRecaptcha = () => {
    nextTick(() => {
      renderRecaptcha();
    });
  };

  document.head.appendChild(script);
};

// Render the reCAPTCHA widget
const renderRecaptcha = () => {
  if (!recaptchaContainer.value || !window.grecaptcha) {
    console.error('❌ reCAPTCHA container or grecaptcha not available');
    return;
  }

  try {
    // Clear any existing reCAPTCHA
    recaptchaContainer.value.innerHTML = '';

    // Render new reCAPTCHA
    recaptchaId.value = window.grecaptcha.render(recaptchaContainer.value, {
      sitekey: SITE_KEY,
      callback: 'onRegisterRecaptchaSuccess',
      'expired-callback': 'onRegisterRecaptchaExpired',
      'error-callback': 'onRegisterRecaptchaError',
      theme: 'light',
      size: 'normal'
    });

  } catch (error) {
    console.error('❌ Error rendering registration reCAPTCHA:', error);
    errorMessage.value = 'Failed to load reCAPTCHA. Please refresh the page.';
  }
};

// Reset reCAPTCHA
const resetRecaptcha = () => {
  if (window.grecaptcha && recaptchaId.value !== null) {
    try {
      window.grecaptcha.reset(recaptchaId.value);
    } catch (error) {
      console.error('❌ Error resetting registration reCAPTCHA:', error);
    }
  }
  captchaVerified.value = false;
  captchaToken.value = '';
};

const submit = async () => {

  // Basic validation
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  // Check if CAPTCHA is verified
  if (!captchaVerified.value || !captchaToken.value) {
    errorMessage.value = 'Please complete the CAPTCHA verification';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    // Clear any previous field errors
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);

    await authStore.registerUser(name.value, email.value, password.value, passwordConfirmation.value, captchaToken.value);

    // If registration was successful, redirect to login or verification page
    if (authStore.registrationSuccess) {
      router.push({ name: 'login' });
    }
  } catch (error) {
    console.error('❌ Registration failed:', error);

    // Reset reCAPTCHA on error
    resetRecaptcha();

    // Check if the error has a structured response
    if (error?.response?.data) {
      const { message, errors } = error.response.data;

      // Set the main error message
      errorMessage.value = message || 'Registration failed. Please check your information and try again.';

      // Set field-specific errors if available
      if (errors) {
        Object.keys(errors).forEach(field => {
          fieldErrors[field] = errors[field][0];
        });
      }
    } else {
      // Fallback to generic error message
      errorMessage.value = 'Registration failed. Please complete the reCAPTCHA and try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};

// Cleanup function
const cleanup = () => {
  // Clean up global callbacks
  if (window.onRegisterRecaptchaSuccess) delete window.onRegisterRecaptchaSuccess;
  if (window.onRegisterRecaptchaExpired) delete window.onRegisterRecaptchaExpired;
  if (window.onRegisterRecaptchaError) delete window.onRegisterRecaptchaError;
  if (window.initRegisterRecaptcha) delete window.initRegisterRecaptcha;
};

onMounted(() => {
  setupRecaptchaCallbacks();
  loadRecaptcha();
});

onBeforeUnmount(() => {
  cleanup();
});
</script>