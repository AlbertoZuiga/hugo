import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import courseReducer from './reducers/courseReducer';
import schedulesReducer from './reducers/schedulesReducer'; // Importar el reducer de horarios

const store = configureStore({
  reducer: {
    auth: authReducer,          // Reducer de autenticación
    courses: courseReducer,     // Reducer de cursos seleccionados
    schedules: schedulesReducer // Reducer de horarios
  },
});

export default store;
