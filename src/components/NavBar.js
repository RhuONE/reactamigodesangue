import React from 'react';
import './NavBar.css';
import logo from '../images/LogoAmgSangue.png';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" width="50px" />
      </div>
      <ul>
        <li><a href="#section1">Home</a></li>
        <li><a href="#section2">Conheça</a></li>
        <li><a href="#section3">Vantagens</a></li>
        <li><a href="#section4">Quem somos?</a></li>
      </ul>
      <div className="botoes">
        <a href="/login/hemocentro"><button className="entrar">Entrar</button></a>
      </div>
    </nav>
  );
};

export default NavBar;
