import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserApi } from '@/composables/user';
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null as null | { name: string; email: string; email_verified_at?: string });
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
    updatePassword
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
    await login(email, password);
    await getUser();
  }

  async function registerUser(name: string, email: string, password: string, password_confirmation: string) {
    await register(name, email, password, password_confirmation);
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
    await verifyEmail(id, hash);
    await getUser();
  }

  async function updateUserProfile(userData: { name?: string; email?: string; current_password?: string; password?: string; password_confirmation?: string }) {
    await updateProfile(userData);
    profileUpdateSuccess.value = true;
    await getUser();
  }

  async function updateUserPassword(current_password: string, password: string, password_confirmation: string) {
    await updatePassword(current_password, password, password_confirmation);
    passwordUpdateSuccess.value = true;
  }

  async function logoutUser() {
    await logout();
    user.value = null;
  }

  function resetFlags() {
    verificationEmailSent.value = false;
    passwordResetEmailSent.value = false;
    passwordResetSuccess.value = false;
    registrationSuccess.value = false;
    profileUpdateSuccess.value = false;
    passwordUpdateSuccess.value = false;
  }

  return {
    user,
    isAuthenticated,
    isVerified,
    verificationEmailSent,
    passwordResetEmailSent,
    passwordResetSuccess,
    registrationSuccess,
    profileUpdateSuccess,
    passwordUpdateSuccess,
    getUser,
    loginUser,
    registerUser,
    forgotPasswordRequest,
    resetPasswordRequest,
    resendVerification,
    verifyUserEmail,
    updateUserProfile,
    updateUserPassword,
    logoutUser,
    resetFlags
  };
});
