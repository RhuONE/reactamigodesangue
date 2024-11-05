import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Altere para o endpoint real da sua API
});

export default api;
