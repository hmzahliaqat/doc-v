# Path Helper Documentation

## Overview

This document provides information about the path helper utility that was added to the PDF-signature project to address an issue with file paths.

## Issue Description

The application was encountering an error when trying to access files with paths that included a full URL prefix:

```
"message": "file_get_contents(C:\\wamp64\\www\\pdf-sig\\public\\storage/http://localhost:8000/storage/pdfs/dummy (1) (1).pdf-1754242970104.pdf): Failed to open stream: No such file or directory"
```

The issue was that file paths were being constructed with the full URL (including "http://localhost:8000/storage") as part of the filename, which resulted in invalid file paths.

## Solution

A helper function was created to sanitize file paths by removing URL prefixes. This function is implemented in `src/utils/path-helper.ts` and is used in the PDF handling functions to ensure that file paths are properly formatted before being sent to the backend.

### Helper Function

```typescript
/**
 * Sanitizes a file path by removing URL prefixes like "http://localhost:8000/storage"
 * @param path - The file path to sanitize
 * @returns The sanitized file path
 */
export function sanitizeFilePath(path: string): string {
  if (!path) return path;
  
  // Check if the path contains "http://localhost:8000/storage" and remove it
  const urlPattern = /https?:\/\/localhost:8000\/storage\//;
  if (urlPattern.test(path)) {
    return path.replace(urlPattern, '');
  }
  
  // More general case: if the path contains any URL with "/storage/" path
  const generalUrlPattern = /https?:\/\/[^\/]+\/storage\//;
  if (generalUrlPattern.test(path)) {
    return path.replace(generalUrlPattern, '');
  }
  
  return path;
}
```

### Implementation

The helper function is used in the following functions in `src/composables/pdf.ts`:

1. `storeDocument(PDF)` - Sanitizes the `PDFBase64` property of the PDF object before sending it to the backend.
2. `updateDocument(PDF, id)` - Sanitizes the `PDFBase64` property of the PDF object before sending it to the backend.
3. `shareDocument(data)` - Sanitizes potential file paths in the data object, including `file_path`, `PDFBase64`, and nested properties like `document.file_path`.

## Usage

To use the helper function in other parts of the application, import it from the path-helper utility:

```typescript
import { sanitizeFilePath } from '@/utils/path-helper';

// Example usage
const sanitizedPath = sanitizeFilePath(originalPath);
```

This function should be used whenever file paths are being sent to the backend to ensure that they don't include URL prefixes that could cause issues with file operations.