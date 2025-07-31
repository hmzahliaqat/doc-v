import type { PDF } from '@/types/pdf';
import baseAxios from '@/base-axios';
import axiosInstance from '@/axios-instance';
import { useRouter } from 'vue-router';
import { sleep } from '@/utils/common';
import { useAuthStore } from '@/stores/modules/user.ts';
export const useUserApi = () => {
  const router = useRouter(); 
  const authStore = useAuthStore();
  async function getUser() {
    try {
      const response = await axiosInstance.get(`user`);
      return response.data;
    } catch (error: any) {
      if(error?.response?.status == 401){
       authStore.user = null;
      }
    }
  }

  // Helper function to check if CSRF token is set
  function isCsrfTokenSet(): boolean {
    const token = getCsrfToken();
    return token !== null;
  }

// Modified login function with dynamic wait for CSRF token
  async function login(email: string, password: string) {
    try {
      // First, fetch the CSRF token and wait until it's set
      await baseAxios.get(`/sanctum/csrf-cookie`);

      // Wait for the CSRF token to be set dynamically
      while (!isCsrfTokenSet()) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Now that the CSRF token is set, proceed with the login request
      const response = await baseAxios.post(`login`, { email, password });

      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  }

// Helper function to extract CSRF token from cookie
  function getCsrfToken(): string | null {
    const name = 'XSRF-TOKEN';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const token = parts.pop()?.split(';').shift();
      return token ? decodeURIComponent(token) : null;
    }
    return null;
  }


  async function register(name: string, email: string, password: string, password_confirmation: string) {
    try {
      await baseAxios.get(`/sanctum/csrf-cookie`);
      while (!isCsrfTokenSet()) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      const response = await baseAxios.post(`register`, {
        name,
        email,
        password,
        password_confirmation,
      });
        
      return response.data;
    } catch (error :any) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async function forgotPassword(email: string) {
    try {
      await baseAxios.get(`/sanctum/csrf-cookie`);
      sleep(1000);
      const response = await baseAxios.post(`forgot-password`, {
        email,
      });
        
      return response.data;
    } catch (error :any) {
      console.error('Forgot password request failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async function resetPassword(email: string, password: string, password_confirmation: string, token: string) {
    try {
      await baseAxios.get(`/sanctum/csrf-cookie`);
      sleep(1000);
      const response = await baseAxios.post(`reset-password`, {
        email,
        password,
        password_confirmation,
        token,
      });
        
      return response.data;
    } catch (error :any) {
      console.error('Reset password failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async function resendVerificationEmail() {
    try {
      const response = await baseAxios.post(`email/verification-notification`);
      return response.data;
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      throw error;
    }
  }

  async function verifyEmail(id: string, hash: string) {
    try {
      const response = await baseAxios.get(`email/verify/${id}/${hash}`);
      return response.data;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  }

  async function updateProfile(userData: { name?: string; email?: string; current_password?: string; password?: string; password_confirmation?: string }) {
    try {
      await baseAxios.get(`/sanctum/csrf-cookie`);
      sleep(1000);
      const response = await baseAxios.post(`user/profile-information`, userData);
      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  async function updatePassword(current_password: string, password: string, password_confirmation: string, email: string ) {
    try {
      await baseAxios.get(`/sanctum/csrf-cookie`);
      sleep(1000);
      const response = await baseAxios.put(`user/password`, {
        current_password,
        password,
        password_confirmation,
        email
      });
      return response.data;
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      const response = await baseAxios.post(`logout`);
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
  
  async function getUserRole() {
    try {
      const response = await baseAxios.get(`/api/user/role`);
      return response.data;
    } catch (error) {
      console.error('Get user role failed:', error);
      throw error;
    }
  }

  return {
    getUser,
    login,
    register,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    verifyEmail,
    updateProfile,
    updatePassword,
    logout,
    getUserRole,
  };
};