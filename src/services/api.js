import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8765',
});

// Attach token to protected requests
API.interceptors.request.use((config) => {
  const publicEndpoints = [
    '/admin/login',
    '/users/login',
    '/admin/registration',
    '/users/registration',
  ];

  const isPublic = publicEndpoints.some((url) => config.url.includes(url));

  if (!isPublic) {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Handle 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Redirecting to login...');
      sessionStorage.removeItem('authToken');
      window.location.href = '/user-login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (role, data) => {
  const endpoint = role === 'Admin' ? '/admin/login' : '/users/login';
  return API.post(endpoint, data);
};

// Registration APIs
export const registerUser = (data) => API.post('/users/registration', data);
export const registerAdmin = (data) => API.post('/admin/registration', data);

// User APIs
export const updateUserDetails = (userId, data) => API.put(`/users/update/${userId}`, data);
export const getUserDetails = (userId) => API.get(`/users/get-user-details/${userId}`);
export const getAllCountries = () => API.get('/users/get-all-countries');

export const applyLeave = (userId, data) => API.post(`/users/apply-leave/${userId}`, data);
export const cancelLeaveRequest = (userId, leaveId) => API.put(`/users/cancel-leave/${userId}/${leaveId}`);
export const approveLeaveRequest = (userId, requesterId) => API.post(`/users/approve-leave/${userId}/${requesterId}`);
export const rejectLeaveRequest = (userId, requesterId) => API.post(`/users/reject-leave/${userId}/${requesterId}`);
export const calculateDuration = (userId, data) => API.post(`/users/calculate-duration/${userId}`, data);
export const getLeaveBalance = (userId) => API.get(`/users/get-leave-balance/${userId}`);
export const getUserLeaveRequests = (userId) => API.get(`/users/get-leave-requests/${userId}`);
export const getHolidayCalendar = (userId) => API.get(`/users/get-holidays/${userId}`);
export const getAllLeaveRequests = (userId) => API.get(`/users/get-all-leave-requests/${userId}`);

// Admin APIs
export const updateLeaveStatus = (leaveId, status) =>
  API.put(`/admin/update-leave-status/${leaveId}`, { status });

export const deleteUserAccount = (adminId, userId) =>
  API.delete(`/admin/delete-user/${adminId}/${userId}`);

export const getAllUsers = () => API.get('/admin/get-all-users');
export const getAdminDetails = (adminId) => API.get(`/admin/get-admin-details/${adminId}`);
export const getAllRoles = (adminId) => API.get(`/admin/get-all-roles/${adminId}`);
export const getAllRolesBasedLeavePolicies = (adminId) =>
  API.get(`/admin/get-all-roles-based-leaves-policies/${adminId}`);
export const getAllAdminLeaveRequests = (adminId) =>
  API.get(`/admin/get-all-leave-requests/${adminId}`);
export const getAllAdminHolidays = (adminId) =>
  API.get(`/admin/get-all-holidays/${adminId}`);

export const promoteUser = (adminId, userId, roleName) =>
  API.put(`/admin/promote/${adminId}/${userId}/${roleName}`);

export const addNewRole = (adminId, data) =>
  API.post(`/admin/add-newrole/${adminId}`, data);

export const addNewLeavePolicies = (adminId, data) =>
  API.post(`/admin/add-new-leave-policies/${adminId}`, data);

export const addNewCountryCalendar = (adminId, data) =>
  API.post(`/admin/add-new-country-calendar/${adminId}`, data);

export const updateCalendar = (adminId, data) =>
  API.post(`/admin/update-calendar/${adminId}`, data);

export const approveLeaveAdmin = (adminId, leaveId) =>
  API.post(`/admin/approve/${adminId}/${leaveId}`);

export const rejectLeaveAdmin = (adminId, leaveId) =>
  API.post(`/admin/reject/${adminId}/${leaveId}`);
export const updateAdminDetails = (adminId, data) =>
  API.put(`/admin/update/${adminId}`, data);

export default API;
