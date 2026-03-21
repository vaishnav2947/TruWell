import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('truwell_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('truwell_token');
      localStorage.removeItem('truwell_user');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateMe: (data) => API.put('/auth/me', data),
};

export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  addReview: (id, data) => API.post(`/products/${id}/review`, data),
  seed: () => API.post('/products/seed/demo'),
};

export const ordersAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getOne: (id) => API.get(`/orders/${id}`),
  getAll: () => API.get('/orders'),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

export const servicesAPI = {
  getAll: () => API.get('/services'),
  getNHS: () => API.get('/services/nhs'),
  getPrivate: () => API.get('/services/private'),
};

export const appointmentsAPI = {
  book: (data) => API.post('/appointments', data),
  getSlots: (date) => API.get('/appointments/slots', { params: { date } }),
  getMy: () => API.get('/appointments/my'),
  getAll: () => API.get('/appointments'),
};

export default API;
