import React from 'react';
import './ConhecaSection.css';
import appImage from '../images/Blood donation-cuate.svg';

const ConhecaSection = () => {
  return (
    <section id="section2" className="amigo-de-sangue">
      <div className="text-column1">
        <h1>Amigo de Sangue</h1>
        <p>
          A Apex uma inovadora empresa no campo da tecnologia, lançou o aplicativo Amigo de Sangue, 
          projetado para facilitar e tornar mais acessível a doação de sangue.
        </p>
      </div>
      <div className="image-column1">
        <img src={appImage} alt="App Preview" />
      </div>
    </section>
  );
};

export default ConhecaSection;
