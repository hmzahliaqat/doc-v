import axios from 'axios';
import { defineStore } from 'pinia';
import { IDB_KEY } from '@/constants/idb';
import { getIdb, setIdb } from '@/utils/idb';
import type { MenuTab } from '@/types/menu';
import type { PDF } from '@/types/pdf';
import { usePdf } from '@/composables/pdf';
interface PDFStore {
  currentPDF: PDF;
  PDFList: PDF[];
  archiveList: PDF[];
  trashList: PDF[];
}

const { getDocuments, storeDocument, updateDocument, getTrashed, deleteDocument } = usePdf();

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
      // const currentPDF = await getIdb<PDF>(IDB_KEY.CURRENT_PDF);

      // if (!currentPDF) return;
      // this.currentPDF = currentPDF;
    },
    setCurrentPDF(PDF: PDF) {
      this.currentPDF = PDF;
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
    },
    setCurrentPDFName(name: string) {
      this.currentPDF.name = name;
    },
    setCurrentPDFCanvas(canvas: string[]) {
      this.currentPDF.canvas = canvas;
    },
    updateCurrentPDFIdb() {
      // return setIdb(IDB_KEY.CURRENT_PDF, this.currentPDF);
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
      const archiveList = await getIdb<PDF[]>(IDB_KEY.ARCHIVE_LIST);

      if (!archiveList) return;
      this.archiveList = archiveList;
    },
    addArchive(PDF: PDF) {
      this.deletePDF(PDF.PDFId);
      this.archiveList.unshift(PDF);
      return this.updateArchiveIdb();
    },
    batchAddArchive(PDFList: Set<PDF>) {
      for (const PDF of PDFList) {
        this.PDFList = this.PDFList.filter(({ PDFId }) => PDF.PDFId !== PDFId);
        this.archiveList.unshift(PDF);
      }
      return Promise.all([this.updatePDFIdb(), this.updateArchiveIdb()]);
    },
    deleteArchive(id: string) {
      this.archiveList = this.archiveList.filter(({ PDFId }) => id !== PDFId);
      return this.updateArchiveIdb();
    },
    batchReductionArchive(PDFList: Set<PDF>) {
      for (const PDF of PDFList) {
        this.archiveList = this.archiveList.filter(({ PDFId }) => PDF.PDFId !== PDFId);
        this.PDFList.unshift(PDF);
      }
      return Promise.all([this.updatePDFIdb(), this.updateArchiveIdb()]);
    },
    updateArchiveIdb() {
      return setIdb(IDB_KEY.ARCHIVE_LIST, this.archiveList);
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
