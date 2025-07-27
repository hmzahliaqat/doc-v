import { defineStore } from 'pinia';
import { usePartialsApi } from '@/composables/partials.ts';

interface Image {
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
  imageList: Image[];
}

const defaultState: ImageStore = {
  imageList: [],
};
const {getPartials, storePartial } = usePartialsApi();

export const useImageStore = defineStore('image', {
  state: () => ({ ...defaultState }),
  actions: {

   async getImage(employeeId?: string){
     const images = await getPartials(employeeId, 'image');
      this.imageList= images;

    },

   async addImage(image: string) {
    const  img = await storePartial(image, 'image');
      this.imageList.unshift(img);
    },
    deleteImage(image: string) {
      this.imageList = this.imageList.filter(img => img !== image);
    },
  },
  // persist: {
  //   storage: localStorage,
  //   pick: ['imageList'],
  // },
});
