import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer'; // Importa el authReducer
import courseReducer from './reducers/courseReducer'; // Importa el courseReducer

const store = configureStore({
  reducer: {
    auth: authReducer, // Reducer de autenticación
    courses: courseReducer, // Reducer de cursos seleccionados
  },
});

export default store;
