import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8765',
});

export const loginUser = (data) => API.post('/admin/login', data);
export const registerUser = (data) => API.post('/users/registration', data);
export const applyLeave = (userId, data) => API.post(`/users/apply-leave/${userId}`, data);
export const getLeaveBalance = (userId) => API.get(`/users/get-leave-balance/${userId}`);
