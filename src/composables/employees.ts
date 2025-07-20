import type { PDF } from '@/types/pdf';
import baseAxios from '@/base-axios';
import axiosInstance from '@/axios-instance';
import { useRouter } from 'vue-router';
import { sleep } from '@/utils/common';
export const useEmployeesApi = () => {
  const router = useRouter();

  async function getEmployees() {
    try {
      const response = await baseAxios.get(`api/employees`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  }

  async function storeEmployee(employee: any) {
    try {
      const response = baseAxios.post(`api/employees`, employee);
      return response;
    } catch (error: any) {
      console.error('Error storing employee:', error.response?.data || error.message);
      throw error;
    }
  }


  async function importEmployees(data :any){
    try {
        const response = await baseAxios.post('api/employees/import', data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

       
        return response.data.data;
    } catch (error: any) {
        console.error(error.response?.data?.errors || error.message);
        alert("Failed to import CSV.");
    }
  }

  async function destroyEmployee(id: string | string[]) {
    const isArray = Array.isArray(id);
    const payload = isArray ? { ids: id } : { id };

    try {
      await baseAxios.delete(`api/employees/delete`, {
        data: payload,
      });

      return 'Employee(s) deleted successfully';
    } catch (error) {
      console.error('Error deleting employee(s):', error);
      throw error;
    }
  }

  return {
    getEmployees,
    storeEmployee,
    importEmployees,
    destroyEmployee,
  };
};
