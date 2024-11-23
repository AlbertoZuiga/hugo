import axios from 'axios';

// Función para obtener horarios con los datos proporcionados
export const schedulesApi = async (formData) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL;
    const response = await axios.post(`${API_URL}/get_horarios/`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en la comunicación con la API');
  }
};
