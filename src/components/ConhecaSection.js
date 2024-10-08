import React from 'react';
import './ConhecaSection.css';
import appIniImage from '../images/Blood donation-cuate.svg';
import appImage from '../images/appImg.png';

const ConhecaSection = () => {
  return (
    <section id="section2" className="conheca-section">
      <div className='cardSection card1'>
      <div className="text-column1">
        <h1>Amigo de Sangue</h1>
        <p>
          A Apex uma inovadora empresa no campo da tecnologia, lançou o aplicativo Amigo de Sangue, 
          projetado para facilitar e tornar mais acessível a doação de sangue.
        </p>
      </div>
      <div className="image-column1">
        <img src={appIniImage} alt="App Preview" />
      </div>
      </div>

      <div className='cardSection card2'>
      <div className="image-column1">
        <img src={appImage} alt="App Preview" />
      </div>
      <div className="text-column1">
        <h1>Conheça o nosso App</h1>
        <p>
          A Apex uma inovadora empresa no campo da tecnologia, lançou o aplicativo Amigo de Sangue, 
          projetado para facilitar e tornar mais acessível a doação de sangue.
        </p>
        <button>Baixe nosso app na Google Play</button>
      </div>
      </div>
      
    </section>
  );
};

export default ConhecaSection;
