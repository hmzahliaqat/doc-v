import baseAxios from '@/base-axios';
import { usePdfStore } from '@/stores';

export const usePartialsApi = () => {

  async function getPartials(employeeId?: string, type: string) {
    try {
      const response = await baseAxios.get(`api/partials/${employeeId}/${type}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get Partials:', error);
      throw error;
    }
  }

  async function storePartial(partials :any, type:any) {
    try {

      const { currentPDF } = usePdfStore();
      const pdf_id = currentPDF.PDFId;

      const response = await baseAxios.post(`api/partials`, {
        partials,
        type,
        pdf_id,
      });
      return response.data;
    } catch (error :any) {
      console.error('Storing Partial failed:', error.response?.data || error.message);
      throw error;
    }
  }


  return {
   getPartials,
    storePartial,

  };
};