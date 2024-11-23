import React from 'react';
import { Link } from 'react-router-dom';  // Importamos Link de react-router-dom
import './Footer.css';

const Footer = () => {
    return (
        <footer style={{ marginTop: 'auto', background: 'lightgray', textAlign: 'center', padding: '10px' }}>
            <p>Footer Content <Link 
                to="/login" 
                style={{
                    textDecoration: 'none',  // Remueve el subrayado
                    color: 'inherit',  // Hereda el color del texto circundante (no parece un link)
                    cursor: 'pointer',  // Muestra el cursor de mano, para indicar que es clickeable
                    fontWeight: 'normal',  // Elimina cualquier estilo de fuente de enlace (en caso de que lo haya)
                }}
            >Here</Link></p>
        </footer>
    );
};

export default Footer;
