import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8765',
});

// ✅ Attach token to every request except public endpoints
API.interceptors.request.use((config) => {
  // Public endpoints that don't require authentication
  const publicEndpoints = [
    '/admin/login',
    '/users/login',
    '/admin/registration',
    '/users/registration',
  ];

  // Check if the request URL matches any of the public endpoints
  const isPublic = publicEndpoints.some((url) => config.url.includes(url));

  if (!isPublic) {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ✅ Optional: handle 401 errors globally (for expired sessions)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized! Redirecting to login...');
      sessionStorage.removeItem('authToken');
      window.location.href = '/user-login'; // or handle more gracefully in app
    }
    return Promise.reject(error);
  }
);

// ✅ Auth APIs
export const login = (role, data) => {
  const endpoint = role === 'Admin' ? '/admin/login' : '/users/login';
  return API.post(endpoint, data);
};

// ✅ Registration APIs
export const registerAdmin = (data) => API.post('/admin/registration', data);
export const registerUser = (data) => API.post('/users/registration', data);

// ✅ User APIs
export const getUserDetails = (userId) => API.get(`/users/get-user-details/${userId}`);
export const applyLeave = (userId, data) => API.post(`/users/apply-leave/${userId}`, data);
export const getLeaveBalance = (userId) => API.get(`/users/get-leave-balance/${userId}`);
export const getUserLeaveRequests = (userId) => API.get(`/users/get-leave-requests/${userId}`);

// ✅ Admin APIs
export const getAllLeaveRequests = (userId) => API.get(`/users/get-all-leave-requests/${userId}`);

export default API;
