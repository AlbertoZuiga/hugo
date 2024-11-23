import axios from 'axios';

// Función para subir un archivo Excel y las cabeceras
export const uploadExcelApi = async (formData, token) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL;
    const response = await axios.post(`${API_URL}/upload-excel/`, formData, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en la comunicación con la API');
  }
};
