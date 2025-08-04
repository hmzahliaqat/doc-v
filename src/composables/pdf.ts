import type { PDF } from '@/types/pdf';
import baseAxios from '@/base-axios';
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import type { Ref } from 'vue';
import { useLoading } from '@/composables/loading';
import { sanitizeFilePath } from '@/utils/path-helper';

export const usePdf = () => {
  const toast = useToast();
  const { showLoading, hideLoading } = useLoading();

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
  
  function getDocumentById(id: string) {
    return baseAxios
      .get(`api/documents/external/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching document:', error);
        toast.error('Failed to fetch document.', {
          position: 'top-right',
        });
        throw error;
      });
  }

  function storeDocument(PDF: PDF) {
    // Sanitize PDFBase64 if it contains a file path with URL prefix
    if (PDF.PDFBase64) {
      PDF.PDFBase64 = sanitizeFilePath(PDF.PDFBase64);
    }
    
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
    // Sanitize PDFBase64 if it contains a file path with URL prefix
    if (PDF.PDFBase64) {
      PDF.PDFBase64 = sanitizeFilePath(PDF.PDFBase64);
    }
    
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
    // Show global loading overlay
    showLoading('Sharing document...');
    
    // Sanitize any file paths in the data object
    if (data) {
      // If data has a file_path property, sanitize it
      if (data.file_path) {
        data.file_path = sanitizeFilePath(data.file_path);
      }
      
      // If data has a PDFBase64 property, sanitize it
      if (data.PDFBase64) {
        data.PDFBase64 = sanitizeFilePath(data.PDFBase64);
      }
      
      // If data has a document property with a file_path, sanitize it
      if (data.document && data.document.file_path) {
        data.document.file_path = sanitizeFilePath(data.document.file_path);
      }
    }
    
    return baseAxios
      .post('/api/documents/share', data)
      .then(response => {
        toast.success('Document shared successfully.', {
          position: 'top-right',
        });
        // Hide loading state
        hideLoading();
        return response.data;
      })
      .catch(error => {
        const message = error.response?.data?.message || 'An error occurred while sharing the document.';
        toast.error(message, {
          position: 'top-right',
        });
        // Hide loading state
        hideLoading();
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

  function remindDocument(id: string) {
    // Show global loading overlay
    showLoading('Sending reminder...');
    
    return baseAxios
      .post('/api/documents/remind', { id })
      .then(response => {
        toast.success('Reminder sent successfully.', {
          position: 'top-right',
        });
        // Hide loading state
        hideLoading();
        return response.data;
      })
      .catch(error => {
        const message = error.response?.data?.message || 'An error occurred while sending the reminder.';
        toast.error(message, {
          position: 'top-right',
        });
        // Hide loading state
        hideLoading();
        throw new Error(message);
      });
  }

  return {
    getDocuments,
    getDocumentById,
    storeDocument,
    updateDocument,
    shareDocument,
    trackDocument,
    getTrashed,
    deleteDocument,
    remindDocument,
  };
};
