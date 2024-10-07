import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <ul className="social-links">
        <li><a href="https://facebook.com" title="Facebook"><i className="fab fa-facebook-f"></i></a></li>
        <li><a href="https://twitter.com" title="Twitter"><i className="fab fa-twitter"></i></a></li>
        <li><a href="https://instagram.com" title="Instagram"><i className="fab fa-instagram"></i></a></li>
        <li><a href="https://linkedin.com" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a></li>
      </ul>
      <p>&copy; 2024 Informativo de Saúde. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
