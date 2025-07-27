import { ref } from 'vue';

// Create a singleton instance that can be imported across the application
const isLoading = ref(false);
const loadingMessage = ref('Loading...');

export function useLoading() {
  /**
   * Show the loading overlay
   * @param message Optional custom message to display
   */
  function showLoading(message?: string) {
    if (message) {
      loadingMessage.value = message;
    }
    isLoading.value = true;
  }

  /**
   * Hide the loading overlay
   */
  function hideLoading() {
    isLoading.value = false;
    // Reset to default message
    loadingMessage.value = 'Loading...';
  }

  /**
   * Wrap an async function with loading state
   * @param asyncFn The async function to wrap
   * @param message Optional custom message to display
   * @returns A function that shows loading state while the wrapped function executes
   */
  function withLoading<T>(asyncFn: () => Promise<T>, message?: string): () => Promise<T> {
    return async () => {
      try {
        showLoading(message);
        return await asyncFn();
      } finally {
        hideLoading();
      }
    };
  }

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    withLoading
  };
}