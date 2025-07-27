<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/modules/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

// Profile update
const name = ref('');
const email = ref('');
const profileUpdateError = ref('');
const profileUpdateSuccess = ref('');
const isProfileUpdateLoading = ref(false);

// Password update
const currentPassword = ref('');
const newPassword = ref('');
const newPasswordConfirmation = ref('');
const passwordUpdateError = ref('');
const passwordUpdateSuccess = ref('');
const isPasswordUpdateLoading = ref(false);

const user = computed(() => authStore.user);
const isVerified = computed(() => authStore.isVerified);

onMounted(() => {
  if (user.value) {
    name.value = user.value.name || '';
    email.value = user.value.email || '';
  } else {
    // Fetch user data if not available
    authStore.getUser().then(() => {
      if (authStore.user) {
        name.value = authStore.user.name || '';
        email.value = authStore.user.email || '';
      }
    });
  }
});

const updateProfile = async () => {
  if (!name.value || !email.value) {
    profileUpdateError.value = 'Name and email are required';
    return;
  }

  try {
    isProfileUpdateLoading.value = true;
    profileUpdateError.value = '';
    profileUpdateSuccess.value = '';
    
    await authStore.updateUserProfile({
      name: name.value,
      email: email.value
    });
    
    if (authStore.profileUpdateSuccess) {
      profileUpdateSuccess.value = 'Profile updated successfully';
      authStore.resetFlags();
    }
  } catch (error) {
    console.error('Profile update failed:', error);
    profileUpdateError.value = 'Failed to update profile. Please try again.';
  } finally {
    isProfileUpdateLoading.value = false;
  }
};

const updatePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !newPasswordConfirmation.value) {
    passwordUpdateError.value = 'All password fields are required';
    return;
  }

  if (newPassword.value !== newPasswordConfirmation.value) {
    passwordUpdateError.value = 'New passwords do not match';
    return;
  }

  try {
    isPasswordUpdateLoading.value = true;
    passwordUpdateError.value = '';
    passwordUpdateSuccess.value = '';
    
    await authStore.updateUserPassword(
      currentPassword.value,
      newPassword.value,
      newPasswordConfirmation.value
    );
    
    if (authStore.passwordUpdateSuccess) {
      passwordUpdateSuccess.value = 'Password updated successfully';
      currentPassword.value = '';
      newPassword.value = '';
      newPasswordConfirmation.value = '';
      authStore.resetFlags();
    }
  } catch (error) {
    console.error('Password update failed:', error);
    passwordUpdateError.value = 'Failed to update password. Please check your current password and try again.';
  } finally {
    isPasswordUpdateLoading.value = false;
  }
};

const resendVerificationEmail = async () => {
  try {
    await authStore.resendVerification();
    if (authStore.verificationEmailSent) {
      profileUpdateSuccess.value = 'Verification email sent successfully';
      authStore.resetFlags();
    }
  } catch (error) {
    console.error('Failed to send verification email:', error);
    profileUpdateError.value = 'Failed to send verification email';
  }
};

const goToDashboard = () => {
  router.push({ name: 'home' });
};
</script>

<template>
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <img class="mx-auto h-20 w-auto" src="/logo.svg" alt="Your Company" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Profile Settings</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
    <!-- Profile Information -->
    <div class="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-8 mb-8">
      <h3 class="text-lg font-medium leading-6 text-gray-900 mb-6">Profile Information</h3>
      
      <div v-if="!isVerified" class="rounded-md bg-yellow-50 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Email not verified</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>Your email address is not verified. Please verify your email to access all features.</p>
              <button 
                @click="resendVerificationEmail" 
                class="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-600"
              >
                Resend verification email
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <form @submit.prevent="updateProfile" class="space-y-6">
        <div v-if="profileUpdateError" class="rounded-md bg-red-50 p-4 mb-4">
          <div class="text-sm text-red-700">{{ profileUpdateError }}</div>
        </div>
        
        <div v-if="profileUpdateSuccess" class="rounded-md bg-green-50 p-4 mb-4">
          <div class="text-sm text-green-700">{{ profileUpdateSuccess }}</div>
        </div>
        
        <div>
          <label for="name" class="block text-sm/6 font-medium text-gray-900">Name</label>
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
          <button type="submit" :disabled="isProfileUpdateLoading" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <span v-if="isProfileUpdateLoading">Updating...</span>
            <span v-else>Update Profile</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Update Password -->
    <div class="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-8 mb-8">
      <h3 class="text-lg font-medium leading-6 text-gray-900 mb-6">Update Password</h3>
      
      <form @submit.prevent="updatePassword" class="space-y-6">
        <div v-if="passwordUpdateError" class="rounded-md bg-red-50 p-4 mb-4">
          <div class="text-sm text-red-700">{{ passwordUpdateError }}</div>
        </div>
        
        <div v-if="passwordUpdateSuccess" class="rounded-md bg-green-50 p-4 mb-4">
          <div class="text-sm text-green-700">{{ passwordUpdateSuccess }}</div>
        </div>
        
        <div>
          <label for="current_password" class="block text-sm/6 font-medium text-gray-900">Current Password</label>
          <div class="mt-2">
            <input v-model="currentPassword" type="password" name="current_password" id="current_password" autocomplete="current-password" required 
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-900">New Password</label>
          <div class="mt-2">
            <input v-model="newPassword" type="password" name="password" id="password" autocomplete="new-password" required 
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm/6 font-medium text-gray-900">Confirm New Password</label>
          <div class="mt-2">
            <input v-model="newPasswordConfirmation" type="password" name="password_confirmation" id="password_confirmation" autocomplete="new-password" required 
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isPasswordUpdateLoading" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <span v-if="isPasswordUpdateLoading">Updating...</span>
            <span v-else>Update Password</span>
          </button>
        </div>
      </form>
    </div>

    <div class="flex justify-center">
      <button 
        @click="goToDashboard" 
        class="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
</div>
</template>