import axios from "axios";

export const coursesApi = async () => {
  try {
    const API_URL = process.env.REACT_APP_API_URL;
    const response = await axios.get(`${API_URL}/cursos/`, {
      headers: {
        "Content-Type": "multipart/form-data", // Asegúrate de que sea necesario
      },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Error en la comunicación con la API");
  }
};
