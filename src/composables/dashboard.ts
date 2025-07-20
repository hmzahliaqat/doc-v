import type { PDF } from '@/types/pdf';
import baseAxios from '@/base-axios';
import axiosInstance from '@/axios-instance';
import { useRouter } from 'vue-router';
import { sleep } from '@/utils/common';
export const useDashboardApi = () => {
  const router = useRouter(); 

    async function getData() {
        try {
        const response = await baseAxios.get(`api/dashboard`);
        return response.data;
        } catch (error) {
        console.error('Failed to get user:', error);
        throw error;
        }
    }

 
  return {
   getData,
  };
};