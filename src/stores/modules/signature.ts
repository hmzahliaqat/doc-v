import { defineStore } from 'pinia';
import { usePartialsApi } from '@/composables/partials.ts';
interface Signature {
  id: number;
  user_id: number;
  document_id: number;
  employee_id: number | null;
  file_path: string;
  file_type: string;
  created_at: string;
  updated_at: string;
}

interface SignatureStore {
  signatureList: Signature[];
}
const {getPartials, storePartial } = usePartialsApi();
const defaultState: SignatureStore = {
  signatureList: [],
};

export const useSignatureStore = defineStore('signature', {
  state: () => ({ ...defaultState }),
  actions: {
  async getSignature(employeeId?: string){
    // const sign = await getPartials(employeeId, 'signature');
    // this.signatureList = sign;
  },
   async addSignature(signature: string) {
    // const  sign = await storePartial(signature, 'signature');
      this.signatureList.unshift(signature);
    },
    deleteSignature(signature: string) {
      // this.signatureList = this.signatureList.filter(sign => sign !== signature);
    },
  },
  persist: {
    storage: localStorage,
    pick: ['signatureList'],
  },
});
