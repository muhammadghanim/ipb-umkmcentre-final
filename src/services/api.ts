import axios from 'axios';

// Membuat instance Axios yang sudah diarahkan ke URL FastAPI
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;