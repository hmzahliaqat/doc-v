<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Shared Documents</h1>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-blue-100 p-3 rounded-full">
              <!-- Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Documents</p>
              <p class="text-xl font-semibold text-gray-900">{{ totalShared ?? 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Signed Documents</p>
              <p class="text-xl font-semibold text-gray-900">{{ totalSigned ?? 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-yellow-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Pending Documents</p>
              <p class="text-xl font-semibold text-gray-900">{{ totalPending ?? 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <DataTable
          v-model:expandedRowGroups="expandedRowGroups"
          :value="customers"
          tableStyle="min-width: 50rem"
          expandableRowGroups
          rowGroupMode="subheader"
          groupRowsBy="employee.id"
          sortMode="single"
          sortField="employee.name"
          :sortOrder="1"
        >
          <template #groupheader="slotProps">
            <span class="align-middle ml-2 font-bold leading-normal">
              {{ slotProps.data?.employee?.name }}
            </span>
          </template>

          <Column field="shared_document_name" header="Name"></Column>
          <Column field="file_path" header="PDF Path"></Column>
          <Column field="pages" header="Pages"></Column>
          <Column field="signed_at" header="Signed At" style="width: 20%"></Column>

          <Column field="status" header="Status" style="width: 20%">
            <template #body="{ data }">
              <Badge :value="data.status" :severity="getBadgeSeverity(data.status)" />
            </template>
          </Column>

          <Column header="Actions" style="width: 10%">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  v-if="data.status === 'Signed'"
                  icon="pi pi-download"
                  class="p-button-rounded p-button-success p-button-sm"
                  @click="downloadDocument(data)"
                  tooltip="Download"
                />
                <Button
                  v-if="data.status === 'Pending'"
                  icon="pi pi-bell"
                  class="p-button-rounded p-button-sm"
                  @click="remindUser(data)"
                  tooltip="Remind"
                />
              </div>
            </template>
          </Column>


        </DataTable>
        <Toast />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Badge from 'primevue/badge';
import { usePdf } from '@/composables/pdf.js';
import { usePdfStore } from '@/stores';
import baseAxios from '@/base-axios';
const toast = useToast();
const customers = ref([]);
const expandedRowGroups = ref();
const totalShared = ref(null);
const totalSigned = ref(null);
const totalPending = ref(null);
import { downloadPDF } from '@/utils/jspdf';

const { trackDocument, remindDocument } = usePdf();
const {PDFList} = usePdfStore();
onMounted(async () => {
  try {
    const doc = await trackDocument();
    customers.value = doc.users;
    totalShared.value = doc.totalDocuments;
    totalSigned.value = doc.totalSignedDocuments;
    totalPending.value = doc.totalPendingDocuments;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error loading data',
      detail: error.message,
      life: 3000,
    });
  }
});



const downloadDocument = async(data) => {
  try {
    // Extract filename from data
    const filename = data.file_path;

    // First, check if we have a matching document in the local PDFList
    const localDocument = PDFList.find(pdf => {
      // Try to match by file path
      if (pdf.PDFBase64 && pdf.PDFBase64.includes(filename)) {
        return true;
      }

      // Try to match by document ID if available
      if (data.id && pdf.PDFId && pdf.PDFId.includes(data.id)) {
        return true;
      }

      // Try to match by filename if we stored it
      if (pdf.fileName && filename.includes(pdf.fileName)) {
        return true;
      }

      return false;
    });

    // If we found a local document, recreate the blob from PDFBase64
    if (localDocument && localDocument.PDFBase64) {
      console.log('Found local document, downloading from PDFBase64:', localDocument);

      try {
        // Convert base64 to blob
        let pdfBlob;

        if (localDocument.PDFBase64.startsWith('data:application/pdf;base64,')) {
          // If it's a data URL, extract the base64 part
          const base64Data = localDocument.PDFBase64.split(',')[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          pdfBlob = new Blob([bytes], { type: 'application/pdf' });
        } else {
          // If it's just base64 string, decode it directly
          const binaryString = atob(localDocument.PDFBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          pdfBlob = new Blob([bytes], { type: 'application/pdf' });
        }

        // Create new blob URL
        const blobUrl = URL.createObjectURL(pdfBlob);

        // Create temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename.split('/').pop() || localDocument.fileName || 'document.pdf';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Cleanup after a short delay
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 100);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Document downloaded from local storage', life: 3000 });
        return;

      } catch (base64Error) {
        console.warn('Failed to download from local PDFBase64, falling back to server:', base64Error);
        // Fall through to server download
      }
    }

    // If no local document found or local download failed, fall back to server download
    console.log('Downloading from server');

    // Send the file path in the request body using POST with responseType: 'blob'
    const response = await baseAxios.post('api/documents/download-signed', {
      file_name: filename
    }, {
      responseType: 'blob', // Important: This tells axios to expect binary data
      timeout: 30000 // 30 second timeout
    });

    // Verify we got a valid blob response
    if (!response.data || response.data.size === 0) {
      throw new Error('Received empty file from server');
    }

    // Create blob with explicit PDF type
    const blob = new Blob([response.data], { type: 'application/pdf' });

    // Create download URL
    const url = URL.createObjectURL(blob);

    // Create temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.split('/').pop() || 'document.pdf'; // Extract just the filename
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup after a short delay
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    toast.add({ severity: 'success', summary: 'Success', detail: 'Document downloaded from server', life: 3000 });

  } catch (error) {
    console.error('Error downloading document:', error);

    // More specific error messages
    let errorMessage = 'Failed to download document';

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Download timeout - file too large or server slow';
    } else if (error.response?.status === 404) {
      errorMessage = 'Document not found on server';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access denied - insufficient permissions';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    toast.add({
      severity: 'error',
      summary: 'Download Failed',
      detail: errorMessage,
      life: 5000
    });
  }
}
const remindUser = (data) => {
  remindDocument(data.id)
    .then(res => {
      toast.add({ severity: 'success', summary: 'Reminder Sent', detail: res.message || 'Reminder sent successfully.', life: 3000 });
    })
    .catch(error => {
      console.error(error);
      toast.add({ severity: 'error', summary: 'Reminder Failed', detail: error.message, life: 3000 });
    });
};




const getBadgeSeverity = (status) => {
  switch (status) {
    case 'Signed': return 'success';
    case 'Pending': return 'warning';
    default: return 'info';
  }
};
</script>
