const initialState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        token: action.payload.token,  // Guardar el token en el estado
        user: action.payload.user,    // Guardar los datos del usuario en el estado
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,  // Guardar el mensaje de error
      };
    default:
      return state;
  }
};

export default authReducer;
