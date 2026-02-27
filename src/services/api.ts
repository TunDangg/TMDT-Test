import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend không có prefix /api
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào header Authorization
  }
  return config;
});

export default api;
