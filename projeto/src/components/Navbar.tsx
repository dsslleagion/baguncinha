// src/components/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.jpg';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <img src={Logo} alt="Logo" className="logo" />
      <div className="menu">
        <Link to="/" className="nav-link">Início</Link>
        <Link to="/sobre" className="nav-link">Sobre</Link>
        <Link to="/contato" className="nav-link">Contato</Link>
      </div>
    </div>
  );
}

export default Navbar;
