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
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
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
            <input
              v-model="password"
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{ 'border-red-500': fieldErrors.password }"
            />
            <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">{{ fieldErrors.password }}</p>
          </div>
        </div>

        <!-- Direct Google reCAPTCHA -->
        <div class="mt-4 flex justify-center">
          <div
            ref="recaptchaContainer"
            id="recaptcha-container"
          ></div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !captchaVerified"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
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

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useConfigStore } from '@/stores';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const configStore = useConfigStore();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const fieldErrors = reactive({});
const isLoading = ref(false);
const captchaVerified = ref(false);
const captchaToken = ref('');
const recaptchaContainer = ref(null);
const recaptchaId = ref(null);

const SITE_KEY = '6LfEjZ8rAAAAAENDoqHf53o-JBp-nHiaFvaCSib2';

// Global callback function for reCAPTCHA
const setupRecaptchaCallback = () => {
  // This function will be called when reCAPTCHA is solved
  window.onRecaptchaSuccess = (token) => {
    captchaVerified.value = true;
    captchaToken.value = token;

    // Clear any reCAPTCHA-related error messages
    if (errorMessage.value.includes('CAPTCHA') || errorMessage.value.includes('captcha')) {
      errorMessage.value = '';
    }
  };

  // This function will be called when reCAPTCHA expires
  window.onRecaptchaExpired = () => {
    console.log('⏰ reCAPTCHA expired');
    captchaVerified.value = false;
    captchaToken.value = '';
    errorMessage.value = 'reCAPTCHA expired. Please verify again.';
  };

  // This function will be called when reCAPTCHA encounters an error
  window.onRecaptchaError = () => {
    console.log('❌ reCAPTCHA error occurred');
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

  // Load the reCAPTCHA script
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?onload=initRecaptcha&render=explicit`;
  script.async = true;
  script.defer = true;

  // Setup the initialization function
  window.initRecaptcha = () => {
    console.log('📦 reCAPTCHA script loaded and ready');
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
      callback: 'onRecaptchaSuccess',
      'expired-callback': 'onRecaptchaExpired',
      'error-callback': 'onRecaptchaError',
      theme: 'light',
      size: 'normal'
    });

    console.log('✅ reCAPTCHA rendered successfully with ID:', recaptchaId.value);
  } catch (error) {
    console.error('❌ Error rendering reCAPTCHA:', error);
    errorMessage.value = 'Failed to load reCAPTCHA. Please refresh the page.';
  }
};

// Reset reCAPTCHA
const resetRecaptcha = () => {
  if (window.grecaptcha && recaptchaId.value !== null) {
    try {
      window.grecaptcha.reset(recaptchaId.value);
    } catch (error) {
      console.error('❌ Error resetting reCAPTCHA:', error);
    }
  }
  captchaVerified.value = false;
  captchaToken.value = '';
};

const submit = async () => {

  // Basic validation
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password';
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
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);

    await authStore.loginUser(email.value, password.value, captchaToken.value);

    if (authStore.otpEnabled && authStore.otpVerificationPending) {
      router.push({ name: 'otp-verification' });
    } else {
      router.push({ name: 'home' });
    }
  } catch (error) {
    console.error('❌ Login failed:', error);

    // Reset reCAPTCHA on error
    resetRecaptcha();

    if (error.response && error.response.data) {
      const { message, errors } = error.response.data;
      errorMessage.value = message || 'Login failed. Please try again.';

      if (errors) {
        Object.keys(errors).forEach(field => {
          fieldErrors[field] = errors[field][0];
        });
      }
    } else {
      errorMessage.value = 'Login failed. Please complete the reCAPTCHA and try again.';
    }
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

onMounted(() => {
  setupRecaptchaCallback();
  loadRecaptcha();
});
</script>