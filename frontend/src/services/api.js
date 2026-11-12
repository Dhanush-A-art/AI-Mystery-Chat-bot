import axios from 'axios';

const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token or Guest Session ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mystery_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const guestSessionId = localStorage.getItem('mystery_guest_session_id');
    if (guestSessionId) {
      config.headers['x-guest-session-id'] = guestSessionId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors uniformly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;

