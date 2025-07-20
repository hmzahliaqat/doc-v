import type { PDF } from '@/types/pdf';
import baseAxios from '@/base-axios';
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

export const usePdf = () => {
  const toast = useToast();

  function getDocuments() {
    return baseAxios
      .get(`api/documents`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching documents:', error);
        toast.error('Failed to fetch documents.', {
          position: 'top-right',
        });
        throw error;
      });
  }

  function storeDocument(PDF: PDF) {
    return baseAxios
      .post(`api/documents`, PDF, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        toast.success('Document stored successfully.', {
          position: 'top-right',
        });
        return response.data;
      })
      .catch(error => {
        console.error('Error storing document:', error);
        toast.error('Failed to store document.', {
          position: 'top-right',
        });
        throw error;
      });
  }

  function updateDocument(PDF: PDF, id: string) {
    return baseAxios
      .put(`api/documents/${id}`, PDF, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        toast.success('Document updated successfully.', {
          position: 'top-right',
        });
        return response.data;
      })
      .catch(error => {
        console.error('Error updating document:', error);
        toast.error('Failed to update document.', {
          position: 'top-right',
        });
        throw error;
      });
  }

  function shareDocument(data: any) {
    return baseAxios
      .post('/api/documents/share', data)
      .then(response => {
        toast.success('Document shared successfully.', {
          position: 'top-right',
        });
        return response.data;
      })
      .catch(error => {
        const message = error.response?.data?.message || 'An error occurred while sharing the document.';
        toast.error(message, {
          position: 'top-right',
        });
        throw new Error(message);
      });
  }

  function trackDocument() {
    return baseAxios
      .get('/api/documents/track')
      .then(response => {
        return response.data;
      })
      .catch(error => {
        const message = error.response?.data?.message || 'An error occurred while sharing the document.';
        toast.error(message, {
          position: 'top-right',
        });
        throw new Error(message);
      });
  }



  function deleteDocument(id: string) {
    return baseAxios
      .delete(`api/documents/${id}`)
      .then(response => {
        toast.success('Document deleted successfully.', {
          position: 'top-right',
        });
        return response.data;
      })
      .catch(error => {
        toast.error('Error deleting document.', {
          position: 'top-right',
        });
        console.error('Error deleting document:', error);
        throw error;
      });
  }

  function getTrashed() {
    return baseAxios
      .get(`api/documents/trash`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching trashed documents:', error);
        toast.error('Failed to fetch trashed documents.', {
          position: 'top-right',
        });
        throw error;
      });
  }

  return {
    getDocuments,
    storeDocument,
    updateDocument,
    shareDocument,
    trackDocument,
    getTrashed,
    deleteDocument,
  };
};
