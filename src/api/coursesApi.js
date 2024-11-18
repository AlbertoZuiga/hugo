import axios from "axios";

export const coursesApi = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/cursos/`, {
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
