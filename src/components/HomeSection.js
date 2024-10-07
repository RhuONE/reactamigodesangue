import React from 'react';
import './HomeSection.css';

const HomeSection = () => {
  return (
    <section id="section1" className="inicio">
      <div className="overlay"></div> {/* Overlay escuro */}
      <div className="divdireita">
        <h2>Seja bem-vindo!</h2>
        <h1>Amigo de Sangue</h1>
        <p>
          "Amigo de Sangue: Conectando Vidas, Salvando Destinos." Somos uma plataforma dedicada
          a conectar doadores de sangue com aqueles que mais precisam.
        </p>
        <a href="#section2"><button>CONHECER</button></a>
      </div>
    </section>
  );
};

export default HomeSection;
