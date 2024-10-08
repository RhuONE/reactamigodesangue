import React from 'react';
import './SobreAppSection.css';
import sobreNos from '../images/homesomos.svg';

const SobreNosSection = () => {
  return (
    <section id="section4" className="sobreNos-section">
        <div className="image">
        <img src={sobreNos} alt="App Preview" />
      </div>
      <div className="text">
        <h1>Sobre Nós</h1>
        <p>
        A Apex uma inovadora empresa no campo da tecnologia, lançou o aplicativo Amigo de Sangue, projetado para facilitar e tornar mais acessível a doação de sangue. O app conecta doadores com hemocentros de forma rápida, permitindo localizar os centros mais próximos, agendar doações e receber notificações sobre necessidades específicas de tipos sanguíneos. Além disso, oferece aos hemocentros uma ferramenta para gerenciar doações, controlar estoques e organizar campanhas de maneira eficiente. Com isso, a Apex busca melhorar a acessibilidade e a organização das doações de sangue, ajudando a salvar vidas e apoiar a gestão dos hemocentros.
        </p>
        <button>Ver mais sobre a Apex</button>
      </div>
    </section>
  );
};

export default SobreNosSection;
