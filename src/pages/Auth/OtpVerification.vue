<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useConfigStore } from '@/stores';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const configStore = useConfigStore();

// OTP input fields
const otpDigits = reactive(['', '', '', '']);
const otpInputRefs = ref([]);
const errorMessage = ref('');
const isLoading = ref(false);

// Check if OTP verification is pending and request OTP code
onMounted(async () => {
  if (!authStore.otpVerificationPending || !authStore.partiallyAuthenticated) {
    // If OTP verification is not pending or user is not partially authenticated, redirect to login
    router.push({ name: 'login' });
    return;
  }
  
  // Always request a new OTP code when the component is mounted
  // This ensures the OTP email is sent as soon as the user logs in
  try {
    // Request OTP code
    await authStore.requestOtpCode();
  } catch (error) {
    console.error('Failed to request OTP code:', error);
    errorMessage.value = 'Failed to request OTP code. Please try again.';
  }
});

// Focus on the first input field when component is mounted
onMounted(() => {
  nextTick(() => {
    if (otpInputRefs.value[0]) {
      otpInputRefs.value[0].focus();
    }
  });
});

// Handle input in OTP fields
const handleInput = (index, event) => {
  const value = event.target.value;
  
  // Only allow digits
  if (/^\d*$/.test(value)) {
    // Take only the last character if multiple characters are pasted
    otpDigits[index] = value.slice(-1);
    
    // Auto-focus next input if a digit was entered
    if (value && index < 3) {
      nextTick(() => {
        otpInputRefs.value[index + 1].focus();
      });
    }
  } else {
    // Clear non-digit input
    otpDigits[index] = '';
  }
};

// Handle keydown in OTP fields
const handleKeyDown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!otpDigits[index] && index > 0) {
      // If current field is empty and backspace is pressed, focus previous field
      otpDigits[index - 1] = '';
      nextTick(() => {
        otpInputRefs.value[index - 1].focus();
      });
    }
  }
  
  // Handle left arrow key
  if (event.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      otpInputRefs.value[index - 1].focus();
    });
  }
  
  // Handle right arrow key
  if (event.key === 'ArrowRight' && index < 3) {
    nextTick(() => {
      otpInputRefs.value[index + 1].focus();
    });
  }
};

// Handle paste event
const handlePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text');
  
  // Check if pasted data contains only digits
  if (/^\d+$/.test(pastedData)) {
    // Fill the OTP fields with the pasted digits
    for (let i = 0; i < Math.min(pastedData.length, 4); i++) {
      otpDigits[i] = pastedData[i];
    }
    
    // Focus the next empty field or the last field
    const nextEmptyIndex = otpDigits.findIndex(digit => !digit);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 4) {
      nextTick(() => {
        otpInputRefs.value[nextEmptyIndex].focus();
      });
    } else {
      nextTick(() => {
        otpInputRefs.value[3].focus();
      });
    }
  }
};

// Submit OTP code
const submitOtp = async () => {
  // Check if all digits are filled
  if (otpDigits.some(digit => !digit)) {
    errorMessage.value = 'Please enter all 4 digits of the OTP code';
    return;
  }
  
  // Combine the digits into a single string
  const otpCode = otpDigits.join('');
  
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    await authStore.verifyOtpCode(otpCode);
    
    if (authStore.otpVerificationSuccess) {
      // Redirect to home page after successful verification
      router.push({ name: 'home' });
    }
  } catch (error) {
    console.error('OTP verification failed:', error);
    
    // Check if the error has a structured response
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      errorMessage.value = message || 'Invalid OTP code. Please try again.';
    } else {
      // Fallback to generic error message
      errorMessage.value = 'Invalid OTP code. Please try again.';
    }
    
    // Clear the OTP fields
    otpDigits.forEach((_, index) => {
      otpDigits[index] = '';
    });
    
    // Focus the first field
    nextTick(() => {
      otpInputRefs.value[0].focus();
    });
  } finally {
    isLoading.value = false;
  }
};

// Resend OTP code
const resendOtp = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    await authStore.requestOtpCode();
    
    // Clear the OTP fields
    otpDigits.forEach((_, index) => {
      otpDigits[index] = '';
    });
    
    // Focus the first field
    nextTick(() => {
      otpInputRefs.value[0].focus();
    });
    
  } catch (error) {
    console.error('Failed to resend OTP code:', error);
    errorMessage.value = 'Failed to resend OTP code. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Go back to login page
const goToLogin = async () => {
  try {
    isLoading.value = true;
    
    // First reset OTP verification state
    authStore.resetOtpVerification();
    
    // Then log out the user
    await authStore.logoutUser();
    
    // Finally redirect to login page
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Failed to go back to login:', error);
    errorMessage.value = 'Failed to go back to login. Please try again.';
    isLoading.value = false;
  }
};
</script>

<template>
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-20 w-auto" :src="configStore.logos.auth" alt="Your Company" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">OTP Verification</h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Please enter the 4-digit code sent to your email
    </p>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" @submit.prevent="submitOtp">
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4">
        <div class="text-sm text-red-700">{{ errorMessage }}</div>
      </div>
      
      <div>
        <div class="flex justify-center space-x-4">
          <template v-for="(digit, index) in otpDigits" :key="index">
            <input
              type="text"
              :value="digit"
              @input="(e) => handleInput(index, e)"
              @keydown="(e) => handleKeyDown(index, e)"
              @paste="handlePaste"
              ref="otpInputRefs"
              maxlength="1"
              class="w-12 h-14 text-center text-xl font-semibold rounded-md bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              :class="{ 'border-red-500': errorMessage }"
            />
          </template>
        </div>
      </div>

      <div>
        <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <span v-if="isLoading">Verifying...</span>
          <span v-else>Verify OTP</span>
        </button>
      </div>
    </form>

    <div class="mt-6 flex items-center justify-between">
      <button 
        type="button" 
        @click="resendOtp" 
        :disabled="isLoading" 
        class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Resend OTP
      </button>
      
      <button 
        type="button" 
        @click="goToLogin" 
        :disabled="isLoading" 
        class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Back to Login
      </button>
    </div>
  </div>
</div>
</template>