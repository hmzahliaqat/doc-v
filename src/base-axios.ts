import axios from 'axios';

const baseAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, 
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json', 
  }
});

// Add request interceptor to manually handle CSRF token
baseAxios.interceptors.request.use((config) => {
  // Get CSRF token from cookie
  const token = getCsrfToken();
  if (token) {
    config.headers['X-XSRF-TOKEN'] = token;
  }
  return config;
});

// Helper function to extract CSRF token from cookie
function getCsrfToken(): string | null {
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop()?.split(';').shift();
    return token ? decodeURIComponent(token) : null;
  }
  return null;
}

export default baseAxios;