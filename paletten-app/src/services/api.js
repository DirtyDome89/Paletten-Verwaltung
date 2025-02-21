import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Stelle sicher, dass der Port korrekt ist

export const getPalettes = async () => {
  try {
    const response = await axios.get(`${API_URL}/palettes`);
    return response.data; // Gibt das Array der Paletten zurück
  } catch (error) {
    console.error('Fehler beim Abrufen der Paletten:', error);
    return [];
  }
};
