import axios from 'axios';

const api = axios.create({
  baseURL: 'http://179.63.40.44:8000/api', // Altere para o endpoint real da sua API
});

export default api;
