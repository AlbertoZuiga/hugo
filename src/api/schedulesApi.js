import axios from 'axios';

// Función para obtener horarios con los datos proporcionados
export const schedulesApi = async (token, formData) => {
  try {
    const response = await axios.post(`http://localhost:8000/get_horarios/`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en la comunicación con la API');
  }
};
