import axios from 'axios';

export const loginUserApi = async (username, password) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL;
    // Realizamos la petición POST al servidor
    const response = await axios.post(`${API_URL}/login/`, {
      username: username,
      password: password,
    });

    // Desestructurar el token y el user de la respuesta
    const { token, user } = response.data;

    // Almacenar el token en localStorage o sessionStorage (opcional)
    localStorage.setItem('authToken', token);

    // Retornar el objeto con el token y los datos del usuario
    return { token, user };

  } catch (error) {
    if (error.response) {
      // Error de la API con código de respuesta (4xx o 5xx)
      throw new Error(error.response.data.message || 'Error en las credenciales');
    } else {
      // Error de red o de otro tipo
      throw new Error('Error de red o servidor');
    }
  }
};
