import React, { useState } from 'react';
import { BiCurrentLocation, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import hospitalIcon from '../images/hospital.jpg'; // Ajuste o caminho da imagem

const HemocentrosList = ({ hemocentros }) => {
  // Estado para armazenar o ID do card atualmente aberto
  const [openCardId, setOpenCardId] = useState(null);

  // Função para alternar a visibilidade do cardInfo
  const toggleCardInfo = (id) => {
    setOpenCardId(openCardId === id ? null : id);
    console.log(openCardId);
  };

  return (
    <div className='cardsListagem'>
      {hemocentros.map((hemocentro) => (
        <div className='card' key={hemocentro.idHemocentro}>
          <div className="baseInfo" onClick={() => toggleCardInfo(hemocentro.idHemocentro)}>
            <img id="hemoIcon"  src={`http://localhost:8000/storage/${hemocentro.fotoHemocentro || 'uploads/hemocentros/foto-generica-hemocentro.webp'}`} alt="Ícone do Hemocentro" />
            <div id="info">
              <h2>{hemocentro.nomeHemocentro}</h2>
              <p>
                <BiCurrentLocation />
                {hemocentro.cidadeHemocentro}, {hemocentro.estadoHemocentro}
              </p>
            </div>

            <p className='emailCard'>{hemocentro.emailHemocentro}</p>
            <p className={`statusCard ${hemocentro.statusHemocentro}`}>
              {hemocentro.statusHemocentro}
            </p>
            <div className='btns'>
              <button className='aceitarHemoBtn'><FaEdit /></button>
              <button className='deleteHemoBtn'><FaTrash /></button>
            </div>
            {openCardId === hemocentro.idHemocentro ? <BiChevronUp /> : <BiChevronDown />}
          </div>

          {/* Renderizar cardInfo condicionalmente para o card aberto */}
          {openCardId === hemocentro.idHemocentro && (
            <div className='cardInfo' >
              <p><strong>CNPJ:</strong> {hemocentro.cnpjHemocentro}</p>
              <p><strong>Hospital:</strong> {hemocentro.hospitalHemocentro}</p>
              <p><strong>CEP:</strong> {hemocentro.cepHemocentro}</p>
              <p><strong>Rua:</strong> {hemocentro.logHemocentro}, {hemocentro.numLogHemocentro}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HemocentrosList;
