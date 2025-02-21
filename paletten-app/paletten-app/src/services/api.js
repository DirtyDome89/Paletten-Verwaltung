// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Passe den Endpunkt deines Backends an

export const getPalettes = async () => {
  const response = await axios.get(`${API_URL}/palettes`);
  return response.data;
};

export const createPalette = async (data) => {
  const response = await axios.post(`${API_URL}/palettes`, data);
  return response.data;
};
