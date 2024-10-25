import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import './Navbar.css';

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">HUGO</Link>
      <ul className="navbar-links">
        <li><Link to="/search-courses">Buscar Ramos</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/upload-excel">Subir Excel</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-button">Log out</button>
            </li>
          </>
        ) : (
          <li><Link to="/login">Iniciar Sesión</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
