import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8765',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API calls
export const login = (role, data) => {
  const endpoint = role === 'Admin' ? '/admin/login' : '/users/login';
  return API.post(endpoint, data);
};

export const getUserDetails = (userId) => API.get(`/users/get-user-details/${userId}`);

export const registerUser = (data) => API.post('/users/registration', data);

export const applyLeave = (userId, data) => API.post(`/users/apply-leave/${userId}`, data);

export const getLeaveBalance = (userId) => API.get(`/users/get-leave-balance/${userId}`);

export const getUserLeaveRequests = (userId) =>
  API.get(`/users/get-leave-requests/${userId}`);

export const getAllLeaveRequests = (userId) =>
  API.get(`/users/get-all-leave-requests/${userId}`);
