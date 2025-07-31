// Test script to verify the PDF store functionality
import { usePdfStore } from './src/stores/modules/pdf';

async function testPdfStore() {
  console.log('Testing PDF store...');
  
  // Initialize the PDF store
  const pdfStore = usePdfStore();
  
  // Test getDocumentByIdAction with a sample ID
  const documentId = 'dummy.pdf-1753841484287'; // Use a valid document ID
  console.log(`Fetching document with ID: ${documentId}`);
  
  try {
    const document = await pdfStore.getDocumentByIdAction(documentId);
    console.log('API Response:', document);
    console.log('Current PDF in store:', pdfStore.currentPDF);
    
    // Verify that the currentPDF has been properly set
    if (pdfStore.currentPDF && pdfStore.currentPDF.PDFId) {
      console.log('SUCCESS: Current PDF has been properly set!');
    } else {
      console.error('ERROR: Current PDF has not been properly set!');
    }
  } catch (error) {
    console.error('Error testing PDF store:', error);
  }
}

// Run the test
testPdfStore();