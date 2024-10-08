import React from 'react';
import './SobreNosSection.css';
import appIniImage from '../images/Blood donation-cuate.svg';
import wave from '../images/wave2.svg';

const SobreAppSection = () => {
  return (
    <section id="section3" className="sobre-section">
        <img src={wave} id='wave'/>
      <div className='cardSection'>
        <div className='card'>
            <img src={appIniImage} />
        <h1>Banco de Sangue</h1>
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here.</p>
        </div>
        <div className='card'>
        <img src={appIniImage} />
        <h1>Comunicação</h1>
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here.</p>
        </div>
        <div className='card'>
        <img src={appIniImage} />
        <h1>Localização</h1>
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here.</p>

        </div>
        <div className='card'>
        <img src={appIniImage} />
        <h1>Camapanhas</h1>
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here.</p>
        </div>
      </div>
    </section>
  );
};

export default SobreAppSection;
