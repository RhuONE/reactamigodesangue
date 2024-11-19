import React from 'react';
import './SobreNosSection.css';
import appIniImage from '../images/Blood donation-cuate.svg';
import appBrancoImg from '../images/IconeAmigoSangueBranco.png';
import wave from '../images/wave2.svg';
import { MdCampaign, MdBloodtype } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { FaClipboard } from "react-icons/fa";



const SobreAppSection = () => {
  return (
    <section id="section3" className="sobre-section">
      <img src={wave} id='wave' />
      <div className='cardSection'>
        <div className='card'>
          <h1>Banco de Sangue</h1>
          <p>Acesso às informações sobre hemocentros próximos e a disponibilidade de bolsas de sangue.</p>
          <MdBloodtype className='icon'/>
        </div>
        <div className='card'>
          <h1>Comunicação</h1>
          <p>Facilitar a interação entre doadores e hemocentros, com notificações e mensagens importantes.</p>
          <MdCampaign className='icon'/>
        </div>
        <div className='card'>
          <h1>Localização</h1>
          <p>Encontre os hemocentros mais próximos para facilitar a doação.</p>
          <HiLocationMarker className='icon'/>
        </div>
        <div className='card'>
          <h1>Campanhas</h1>
          <p>Acompanhamento de campanhas de doação de sangue e incentivos para o engajamento da comunidade.</p>
          <FaClipboard className='icon'/>
        </div>
      </div>

      <div className='sideImg'>
        <img src={appBrancoImg} />
      </div>
      
    </section>
  );
};

export default SobreAppSection;
