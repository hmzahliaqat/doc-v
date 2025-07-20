import type { PDF } from '@/types/pdf';
import baseAxios from '@/base-axios';
import axiosInstance from '@/axios-instance';
import { useRouter } from 'vue-router';
import { sleep } from '@/utils/common';

export const useUserApi = () => {
  const router = useRouter(); 

  async function getUser() {
    try {
      const response = await baseAxios.get(`api/user`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await baseAxios.get(`/sanctum/csrf-cookie`);
        sleep(1000); 
      const response = await baseAxios.post(`api/login`, {
        email,
        password,
      });
  
        
      return response.data;
    } catch (error :any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      const response = await baseAxios.post(`api/logout`);

      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  return {
    getUser,
    login,
    logout,
  };
};