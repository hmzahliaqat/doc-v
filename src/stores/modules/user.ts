import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserApi } from '@/composables/user';
export const useAuthStore = defineStore('auth', () => {
  // Initialize values from localStorage if available
  const storedRole = localStorage.getItem('user_role');
  const storedPartiallyAuthenticated = localStorage.getItem('partially_authenticated') === 'true';
  const storedOtpVerificationPending = localStorage.getItem('otp_verification_pending') === 'true';
  const storedPendingEmail = localStorage.getItem('pending_email') || '';
  
  const user = ref(null as null | { name: string; email: string; email_verified_at?: string });
  const role = ref(storedRole as null | string);
  const isLoading = ref(false);
  const verificationEmailSent = ref(false);
  const passwordResetEmailSent = ref(false);
  const passwordResetSuccess = ref(false);
  const registrationSuccess = ref(false);
  const profileUpdateSuccess = ref(false);
  const passwordUpdateSuccess = ref(false);
  const otpEnabled = ref(false);
  const otpUpdateSuccess = ref(false);
  const otpVerificationPending = ref(storedOtpVerificationPending);
  const otpVerificationSuccess = ref(false);
  const partiallyAuthenticated = ref(storedPartiallyAuthenticated);
  const pendingEmail = ref(storedPendingEmail);

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
    getOtpSettings,
    toggleOtpVerification,
    verifyOtp,
    requestOtp
  } = useUserApi();

  // User is authenticated if they have user data AND either OTP is not enabled or OTP verification is not pending
  const isAuthenticated = computed(() => {
    return !!user.value && (!otpEnabled.value || !otpVerificationPending.value);
  });
  const isVerified = computed(() => !!user.value?.email_verified_at);

  async function getUser() {
    try {
      const response = await fetchUser();
      user.value = response;
    } catch {
      user.value = null;
    }
  }

  async function loginUser(email: string, password: string, captchaToken: string) {
    isLoading.value = true;
    try {
      // Store the email for later use
      pendingEmail.value = email;
      localStorage.setItem('pending_email', email);
      
      // Perform login
      await login(email, password, captchaToken);
      
      // Fetch OTP settings from the server
      await getOtpStatus();
      
      // Check if OTP verification is enabled
      if (otpEnabled.value) {
        // Set partial authentication state
        partiallyAuthenticated.value = true;
        otpVerificationPending.value = true;
        
        // Persist authentication state in localStorage
        localStorage.setItem('partially_authenticated', 'true');
        localStorage.setItem('otp_verification_pending', 'true');
        
        // Don't fetch user data yet - we'll do that after OTP verification
      } else {
        // If OTP is not enabled, complete the authentication process
        await getUser();
        await getUserRole();
        partiallyAuthenticated.value = false;
        
        // Clear partial authentication state in localStorage
        localStorage.removeItem('partially_authenticated');
        localStorage.removeItem('otp_verification_pending');
        localStorage.removeItem('pending_email');
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function registerUser(name: string, email: string, password: string, password_confirmation: string, captchaToken: string) {
    await register(name, email, password, password_confirmation, captchaToken);
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

  async function updateUserPassword(current_password: string, password: string, password_confirmation: string, email: string) {
    await updatePassword(current_password, password, password_confirmation, email);
    passwordUpdateSuccess.value = true;
  }

  async function logoutUser() {
    await logout();
    user.value = null;
    role.value = null;
    
    // Clear all authentication state from localStorage
    localStorage.removeItem('user_role');
    localStorage.removeItem('partially_authenticated');
    localStorage.removeItem('otp_verification_pending');
    localStorage.removeItem('pending_email');
    
    // Reset OTP-related state
    otpVerificationPending.value = false;
    partiallyAuthenticated.value = false;
    pendingEmail.value = '';
  }

  function resetFlags() {
    verificationEmailSent.value = false;
    passwordResetEmailSent.value = false;
    passwordResetSuccess.value = false;
    registrationSuccess.value = false;
    profileUpdateSuccess.value = false;
    passwordUpdateSuccess.value = false;
    otpUpdateSuccess.value = false;
    otpVerificationSuccess.value = false;
  }
  
  function resetOtpVerification() {
    otpVerificationPending.value = false;
    otpVerificationSuccess.value = false;
    partiallyAuthenticated.value = false;
    pendingEmail.value = '';
    
    // Clear partial authentication state in localStorage
    localStorage.removeItem('partially_authenticated');
    localStorage.removeItem('otp_verification_pending');
    localStorage.removeItem('pending_email');
    
    // We don't log out the user here because we'll do that explicitly in the OtpVerification component
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
  
  async function getOtpStatus() {
    try {
      isLoading.value = true;
      const response = await getOtpSettings();
      otpEnabled.value = response.otp_enabled;
      return response.otp_enabled;
    } catch (error) {
      console.error('Failed to get OTP status:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function toggleOtp(enabled) {
    try {
      isLoading.value = true;
      otpUpdateSuccess.value = false;
      await toggleOtpVerification(enabled);
      otpEnabled.value = enabled;
      otpUpdateSuccess.value = true;
    } catch (error) {
      console.error('Failed to toggle OTP verification:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function requestOtpCode() {
    try {
      isLoading.value = true;
      
      if (!pendingEmail.value) {
        throw new Error('No email available for OTP request');
      }
      
      await requestOtp(pendingEmail.value);
      return true;
    } catch (error) {
      console.error('Failed to request OTP code:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function verifyOtpCode(otp: string) {
    try {
      isLoading.value = true;
      otpVerificationSuccess.value = false;
      
      if (!pendingEmail.value) {
        throw new Error('No email available for OTP verification');
      }
      
      await verifyOtp(pendingEmail.value, otp);
      
      // OTP verification successful, complete the authentication process
      if (partiallyAuthenticated.value) {
        await getUser();
        await getUserRole();
      }
      
      otpVerificationSuccess.value = true;
      otpVerificationPending.value = false;
      partiallyAuthenticated.value = false;
      
      // Clear partial authentication state in localStorage
      localStorage.removeItem('partially_authenticated');
      localStorage.removeItem('otp_verification_pending');
      localStorage.removeItem('pending_email');
      
      return true;
    } catch (error) {
      console.error('Failed to verify OTP code:', error);
      throw error;
    } finally {
      isLoading.value = false;
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
    otpEnabled,
    otpUpdateSuccess,
    otpVerificationPending,
    otpVerificationSuccess,
    partiallyAuthenticated,
    pendingEmail,
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
    resetOtpVerification,
    getOtpStatus,
    toggleOtp,
    requestOtpCode,
    verifyOtpCode
  };
});
