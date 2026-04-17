const BASE_URL = 'http://localhost:8000/api';

/**
 * Shared API client for handling JWT auth and JSON requests.
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.reload(); // Force login redirect via App logic
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `API Error: ${response.status}`);
  }

  // Handle No Content (e.g., DELETE)
  if (response.status === 204) {
    return true;
  }

  return await response.json();
};
