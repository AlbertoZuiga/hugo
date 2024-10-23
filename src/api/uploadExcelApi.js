import axios from 'axios';

// Función para subir un archivo Excel
export const uploadExcelApi = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`http://localhost:8000/upload-excel/`, formData, {
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
