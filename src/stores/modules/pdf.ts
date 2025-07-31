import axios from 'axios';
import { defineStore } from 'pinia';
import { IDB_KEY } from '@/constants/idb';
import { getIdb, setIdb } from '@/utils/idb';
import type { MenuTab } from '@/types/menu';
import type { PDF } from '@/types/pdf';
import { usePdf } from '@/composables/pdf';
import { useRoute } from 'vue-router';
interface PDFStore {
  currentPDF: PDF;
  PDFList: PDF[];
  archiveList: PDF[];
  trashList: PDF[];
}

const { getDocuments, getDocumentById, storeDocument, updateDocument, getTrashed, deleteDocument } = usePdf();

const defaultState: PDFStore = {
  currentPDF: {
    PDFId: '',
    name: '',
    updateDate: 0,
    PDFBase64: '',
    pages: 0,
    canvas: [],
    trashDate: 0,
    isUpdate: false,
  },
  PDFList: [],
  archiveList: [],
  trashList: [],
};

export const usePdfStore = defineStore('pdf', {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    async getCurrentPDF() {
      // Try to get from IndexedDB first for backward compatibility
      const currentPDF = null;
      
      if (currentPDF && currentPDF?.PDFId) {
        this.currentPDF = currentPDF;
        return;
      }
      
      // If not in IndexedDB, check if there's a document_pdf_id in the route
      const route = useRoute();
      const document_pdf_id = route?.query?.document_pdf_id;
      
      if (document_pdf_id) {
       this.currentPDF = await this.getDocumentByIdAction(String(document_pdf_id));
      }
    },
    
    async getDocumentByIdAction(id: string) {
      try {
        const document = await getDocumentById(id);
        if (document) {
          // Map API response fields to the expected PDF format
          this.currentPDF = {
            PDFId: document.pdf_id || '',
            name: document.name || '',
            updateDate: document.update_date || 0,
            PDFBase64: document.file_path || '',
            pages: document.pages || 0,
            canvas: document.canvas || [],
            isUpdate: false,
          };
        }
        return document;
      } catch (error) {
        console.error('Failed to get document by ID:', error);
        return null;
      }
    },
    setCurrentPDF(PDF: PDF) {
      this.currentPDF = PDF;
      this.updateCurrentPDFIdb();
    },
    clearCurrentPDF() {
      this.currentPDF = {
        PDFId: '',
        name: '',
        updateDate: 0,
        PDFBase64: '',
        pages: 0,
        canvas: [],
      };
      this.updateCurrentPDFIdb();
    },
    setCurrentPDFName(name: string) {
      this.currentPDF.name = name;
      this.updateCurrentPDFIdb();
    },
    setCurrentPDFCanvas(canvas: string[]) {
      this.currentPDF.canvas = canvas;
      this.updateCurrentPDFIdb();
    },
    updateCurrentPDFIdb() {
      return setIdb(IDB_KEY.CURRENT_PDF, this.currentPDF);
    },

    async getPDF() {
      getDocuments()
      .then(data => {
        this.PDFList = data;
      })
      .catch(error => {
        console.error('Failed to load PDFs:', error);
      });      
      
    },
    addPDF(PDF: PDF) {
      this.PDFList.unshift({ ...PDF });

      storeDocument(PDF);

      // return this.updatePDFIdb();
    },
    updatePDF(PDF: PDF) {
      const index = this.PDFList.findIndex(item => item.PDFId === PDF.PDFId);

      if (index === -1) return;
      this.PDFList[index] = PDF;
   
     updateDocument(PDF, PDF.PDFId);
   
    },
    deletePDF(id: string) {
      this.PDFList = this.PDFList.filter(({ PDFId }) => id !== PDFId);
      deleteDocument(id);
      // return this.updatePDFIdb();
    },
    updatePDFIdb() {
      return setIdb(IDB_KEY.PDF_LIST, this.PDFList);
    },

    async getArchive() {
      // API call would go here to fetch archive list
      this.archiveList = [];
    },
    addArchive(PDF: PDF) {
      this.deletePDF(PDF.PDFId);
      this.archiveList.unshift(PDF);
      // API call would go here to update archive
    },
    batchAddArchive(PDFList: Set<PDF>) {
      for (const PDF of PDFList) {
        this.PDFList = this.PDFList.filter(({ PDFId }) => PDF.PDFId !== PDFId);
        this.archiveList.unshift(PDF);
      }
      // API call would go here to update archive
    },
    deleteArchive(id: string) {
      this.archiveList = this.archiveList.filter(({ PDFId }) => id !== PDFId);
      // API call would go here to delete from archive
    },
    batchReductionArchive(PDFList: Set<PDF>) {
      for (const PDF of PDFList) {
        this.archiveList = this.archiveList.filter(({ PDFId }) => PDF.PDFId !== PDFId);
        this.PDFList.unshift(PDF);
      }
      // API call would go here to update archive
    },

    async getTrash() {
      const trashList = await getIdb<PDF[]>(IDB_KEY.TRASH_LIST);

      const trash = await getTrashed();

      if (!trash) return;
      this.trashList = trash;
    },
    addTrash(PDF: PDF, type?: MenuTab) {
      if (!type || type === 'file') this.deletePDF(PDF.PDFId);
      if (!type || type === 'archive') this.deleteArchive(PDF.PDFId);
      this.trashList.unshift({ ...PDF, trashDate: Date.now() });
      return this.updateTrashIdb();
    },
    batchAddTrash(PDFList: Set<PDF>, type: MenuTab) {
      for (const PDF of PDFList) {
        if (type === 'file') {
          this.PDFList = this.PDFList.filter(({ PDFId }) => PDF.PDFId !== PDFId);
        }
        if (type === 'archive') {
          this.archiveList = this.archiveList.filter(({ PDFId }) => PDF.PDFId !== PDFId);
        }
        this.trashList.unshift({ ...PDF, trashDate: Date.now() });
      }
      return Promise.all([this.updatePDFIdb(), this.updateArchiveIdb(), this.updateTrashIdb()]);
    },
    deleteTrash(id?: string) {
      if (!id) return;
      this.trashList = this.trashList.filter(({ PDFId }) => id !== PDFId);
      return this.updateTrashIdb();
    },
    batchDeleteTrash(PDFList: Set<PDF>) {
      for (const PDF of PDFList) {
        this.trashList = this.trashList.filter(({ PDFId }) => PDF.PDFId !== PDFId);
      }
      return this.updateTrashIdb();
    },
    batchReductionTrash(PDFList: Set<PDF>) {
      for (const PDF of PDFList) {
        this.trashList = this.trashList.filter(({ PDFId }) => PDF.PDFId !== PDFId);
        this.PDFList.unshift(PDF);
      }
      return Promise.all([this.updatePDFIdb(), this.updateTrashIdb()]);
    },
    filterTrash() {
      const MAX_DAY = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      this.trashList = this.trashList.filter(({ trashDate }) => {
        if (!trashDate) return true;
        return now - trashDate < MAX_DAY;
      });
      return this.updateTrashIdb();
    },
    updateTrashIdb() {
      return setIdb(IDB_KEY.TRASH_LIST, this.trashList);
    },
  },
});
