import { defineStore } from 'pinia';
import { usePartialsApi } from '@/composables/partials.ts';
interface Literal {
  id: number;
  user_id: number;
  document_id: number;
  employee_id: number | null;
  file_path: string;
  file_type: string;
  created_at: string;
  updated_at: string;
}

interface ImageStore {
  literalList: Literal[];
}

const defaultState: ImageStore = {
  literalList: [],
};
const {getPartials, storePartial } = usePartialsApi();
export const useLiteralStore = defineStore('literal', {
  state: () => ({ ...defaultState }),
  actions: {
   async getLiteral(employeeId?: string){
    // const txt = await getPartials(employeeId, 'literal');
    //  this.literalList = txt;
   },
   async addLiteral(text: string) {
   // const txt = await storePartial(text, 'literal');
     this.literalList.unshift(text);
    },
    deleteLiteral(text: string) {
      // this.literalList = this.literalList.filter(literal => literal !== text);
    },
  },
  persist: {
    storage: localStorage,
    pick: ['literalList'],
  },
});
