import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">HUGO</Link>
            <ul className="navbar-links">
                <li><Link to="/search">Buscar Ramos</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
