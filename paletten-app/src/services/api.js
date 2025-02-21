import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Falls dein Backend läuft, passe die URL an

export const getPalettes = async () => {
  try {
    const response = await axios.get(`${API_URL}/palettes`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Paletten:', error);
    return [];
  }
};
