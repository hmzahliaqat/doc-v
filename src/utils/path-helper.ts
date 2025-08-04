/**
 * Helper functions for handling file paths
 */

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