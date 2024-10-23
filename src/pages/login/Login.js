import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../../redux/actions/authActions';
import { loginUserApi } from '../../api/loginUserApi'; 

const Login = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginRequest({ username, password }));
    
    try {
      // Llamar a la API de login
      const { token, user } = await loginUserApi(username, password);

      // Despachar el loginSuccess con los datos del usuario
      dispatch(loginSuccess({ token, user }));

    } catch (err) {
      dispatch(loginFailure(err.message));  // Despachar el error si ocurre
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Iniciar sesión'}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
