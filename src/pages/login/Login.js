import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../../redux/actions/authActions';
import { loginUserApi } from '../../api/loginUserApi'; 
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginRequest({ username, password }));
    
    try {
      const { token, user } = await loginUserApi(username, password);
      dispatch(loginSuccess({ token, user }));
      console.log('Inicio de sesion exitoso')
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="floating-label">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Nombre de usuario"
          />
          <label htmlFor="username">Nombre de usuario</label>
        </div>
        <div className="floating-label">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Contraseña"
          />
          <label htmlFor="password">Contraseña</label>
        </div>
        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
