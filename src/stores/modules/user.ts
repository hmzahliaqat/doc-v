import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserApi } from '@/composables/user';
export const useAuthStore = defineStore('auth', () => {
  // Initialize role from localStorage if available
  const storedRole = localStorage.getItem('user_role');
  
  const user = ref(null as null | { name: string; email: string; email_verified_at?: string });
  const role = ref(storedRole as null | string);
  const isLoading = ref(false);
  const verificationEmailSent = ref(false);
  const passwordResetEmailSent = ref(false);
  const passwordResetSuccess = ref(false);
  const registrationSuccess = ref(false);
  const profileUpdateSuccess = ref(false);
  const passwordUpdateSuccess = ref(false);

  const { 
    getUser: fetchUser, 
    login, 
    logout, 
    register, 
    forgotPassword, 
    resetPassword, 
    resendVerificationEmail, 
    verifyEmail,
    updateProfile,
    updatePassword,
    checkVerificationStatus
  } = useUserApi();

  const isAuthenticated = computed(() => !!user.value);
  const isVerified = computed(() => !!user.value?.email_verified_at);

  async function getUser() {
    try {
      const response = await fetchUser();
      user.value = response;
    } catch {
      user.value = null;
    }
  }

  async function loginUser(email: string, password: string) {
    isLoading.value = true;
    try {
      await login(email, password);
      await getUser();
      await getUserRole();
    } finally {
      isLoading.value = false;
    }
  }

  async function registerUser(name: string, email: string, password: string, password_confirmation: string) {
    await register(name, email, password, password_confirmation);
    // Send verification email automatically after registration
    await resendVerification();
    registrationSuccess.value = true;
    await getUser();
  }

  async function forgotPasswordRequest(email: string) {
    await forgotPassword(email);
    passwordResetEmailSent.value = true;
  }

  async function resetPasswordRequest(email: string, password: string, password_confirmation: string, token: string) {
    await resetPassword(email, password, password_confirmation, token);
    passwordResetSuccess.value = true;
  }

  async function resendVerification() {
    await resendVerificationEmail();
    verificationEmailSent.value = true;
  }

  async function verifyUserEmail(id: string, hash: string) {
    try {
      await verifyEmail(id, hash);
      await getUser();
      return true;
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  }

  async function updateUserProfile(userData: { name?: string; email?: string; current_password?: string; password?: string; password_confirmation?: string }) {
    await updateProfile(userData);
    profileUpdateSuccess.value = true;
    await getUser();
  }

  async function updateUserPassword(current_password: string, password: string, password_confirmation: string, email: string) {
    await updatePassword(current_password, password, password_confirmation, email);
    passwordUpdateSuccess.value = true;
  }

  async function logoutUser() {
    await logout();
    user.value = null;
    role.value = null;
    localStorage.removeItem('user_role');
  }

  function resetFlags() {
    verificationEmailSent.value = false;
    passwordResetEmailSent.value = false;
    passwordResetSuccess.value = false;
    registrationSuccess.value = false;
    profileUpdateSuccess.value = false;
    passwordUpdateSuccess.value = false;
  }
  
  async function getUserRole() {
    try {
      isLoading.value = true;
      const response = await useUserApi().getUserRole();
      role.value = response.role;
      
      // Save role to localStorage for persistence
      if (response.role) {
        localStorage.setItem('user_role', response.role);
      } else {
        localStorage.removeItem('user_role');
      }
      
      return response.role;
    } catch (error) {
      console.error('Failed to get user role:', error);
      role.value = null;
      localStorage.removeItem('user_role');
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function checkEmailVerificationStatus() {
    try {
      const status = await checkVerificationStatus();
      // Update user verification status if we have a user object
      if (user.value) {
        user.value.email_verified_at = status.email_verified ? status.email_verified_at : null;
      }
      return status;
    } catch (error) {
      console.error('Failed to check verification status:', error);
      return { email_verified: false, email_verified_at: null };
    }
  }

  return {
    user,
    role,
    isLoading,
    isAuthenticated,
    isVerified,
    verificationEmailSent,
    passwordResetEmailSent,
    passwordResetSuccess,
    registrationSuccess,
    profileUpdateSuccess,
    passwordUpdateSuccess,
    getUser,
    getUserRole,
    loginUser,
    registerUser,
    forgotPasswordRequest,
    resetPasswordRequest,
    resendVerification,
    verifyUserEmail,
    updateUserProfile,
    updateUserPassword,
    logoutUser,
    resetFlags,
    checkEmailVerificationStatus
  };
});
