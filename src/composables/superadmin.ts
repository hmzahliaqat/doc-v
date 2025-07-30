import baseAxios from '@/base-axios';
import { useRouter } from 'vue-router';
export const useSuperAdminApi = () => {
  const router = useRouter();

  async function getStats() {
    try {
      const response = await baseAxios.get(`api/sp/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  }

  async function getCompanyWithDetail() {
    try {
      const response = await baseAxios.get(`api/sp/company-with-detail`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  }


  return {
    getStats,
    getCompanyWithDetail
  };
};