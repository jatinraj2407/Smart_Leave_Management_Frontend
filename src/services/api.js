import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8765',
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (role, data) => {
  const endpoint = role === 'Admin' ? '/admin/login' : '/users/login';
  return API.post(endpoint, data);
};

export const registerUser = (data) => API.post('/users/registration', data);
export const registerAdmin = (data) => API.post('/admin/registration', data);
export const getUserDetails = (userId) => API.get(`/users/get-user-details/${userId}`);
export const updateUserDetails = (userId, data) => API.put(`/users/update/${userId}`, data);
export const getAllCountries = () => API.get('/users/get-all-countries');

export const applyLeave = (userId, data) => API.post(`/users/apply-leave/${userId}`, data);
export const calculateDuration = (userId, data) => API.post(`/users/calculate-duration/${userId}`, data);
export const getLeaveBalance = (userId) => API.get(`/users/get-leave-balance/${userId}`);
export const getUserLeaveRequests = (userId) => API.get(`/users/get-leave-requests/${userId}`);
export const getAllLeaveRequests = (userId) => API.get(`/users/get-all-leave-requests/${userId}`);
export const cancelLeaveRequest = (userId, leaveId) => API.put(`/users/cancel-leave/${userId}/${leaveId}`);
export const getHolidayCalendar = (userId) => API.get(`/users/get-holidays/${userId}`);

export const approveLeaveRequest = (userId, requesterId) =>
  API.post(`/users/approve-leave/${userId}/${requesterId}`);

export const rejectLeaveRequest = (userId, requesterId) =>
  API.post(`/users/reject-leave/${userId}/${requesterId}`);

export const updateLeaveStatus = (leaveId, status) =>
  API.put(`/admin/update-leave-status/${leaveId}`, { status });
