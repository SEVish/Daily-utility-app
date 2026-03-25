import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
const usersAPI = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (userData) => apiClient.post('/users', userData),
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

// Claims API
const claimsAPI = {
  getAll: () => apiClient.get('/claims'),
  getById: (id) => apiClient.get(`/claims/${id}`),
  create: (claimData) => apiClient.post('/claims', claimData),
  update: (id, claimData) => apiClient.put(`/claims/${id}`, claimData),
  delete: (id) => apiClient.delete(`/claims/${id}`),
};

// Grocery API
const groceryAPI = {
  getAll: () => apiClient.get('/grocery'),
  getByCategory: (category) => apiClient.get(`/grocery/category/${category}`),
  create: (itemData) => apiClient.post('/grocery', itemData),
  toggle: (id) => apiClient.put(`/grocery/${id}/toggle`),
  update: (id, itemData) => apiClient.put(`/grocery/${id}`, itemData),
  delete: (id) => apiClient.delete(`/grocery/${id}`),
};

// Charts API
const chartsAPI = {
  getAll: () => apiClient.get('/charts'),
  getById: (id) => apiClient.get(`/charts/${id}`),
  save: (chartData) => apiClient.post('/charts', chartData),
  update: (id, chartData) => apiClient.put(`/charts/${id}`, chartData),
  delete: (id) => apiClient.delete(`/charts/${id}`),
};

export { usersAPI, claimsAPI, groceryAPI, chartsAPI, apiClient };
