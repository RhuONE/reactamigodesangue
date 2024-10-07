import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { BiCurrentLocation, BiChevronDown } from "react-icons/bi";
import imgBase from '../../images/hospital.jpg';
import './Pendencias.css';

const Pendencias = () => {
  const [pendencias, setPendencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendencias = async () => {
      const token = localStorage.getItem('token'); // Assumindo que o token é armazenado no localStorage
          console.log(token);
          const tipoUsuario = localStorage.getItem('tipoUsuario');
          console.log(tipoUsuario);
          if (!token) {
            // Se o token não estiver presente, redireciona para a tela de login
            navigate('/login');
            return;
          }
          if (tipoUsuario !== 'administrador') {
            // Se o tipo de usuário não for administrador, redireciona para o login
            navigate('/login');
            return;
          }

      try {
        const response = await api.get('/hemocentros/pendentes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPendencias(Array.isArray(response.data.data) ? response.data.data : []);
        setError(null);
        console.log(response.data.data)
      } catch (error) {
        setError('Erro ao carregar pendências. Tente novamente mais tarde.');
        console.error('Erro ao buscar pendências', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendencias();
  }, [navigate]);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/hemocentros/aceitar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendencias(pendencias.filter((pendencia) => pendencia.idHemocentro !== id));
    } catch (error) {
      console.error('Erro ao aprovar hemocentro', error);
      setError('Erro ao aprovar o hemocentro. Tente novamente.');
    }
  };

  return (
    <div className="pendencias-container">
      <div className='pendencias-header'>
        <h1>Pendências</h1> 
        <p>{pendencias.length}</p>
      </div>
      {/* {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : ( */}
          <div className='cards'>
            {/* <div className='card'>
                <div className="baseInfo">
                  <img id="hemoIcon" src={imgBase} />
                  <div id="info">
                    <h2>pendencia.nomeHemocentro</h2>
                    <p>
                      <BiCurrentLocation/>
                      pendencia.cidadeHemocentro, pendencia.estadoHemocentro
                    </p>
                  </div>

                  <div className='btns'>
                    <button id="aceitarHemo">Aceitar</button>
                    <button id="negarHemo">Negar</button>
                  </div>
                  <BiChevronDown/>
                </div>
                <div className='cardInfo'>

                </div>
              </div> */}
            {pendencias.map((pendencia) => (
              <div className='card' key={pendencia.idHemocentro}>
                <div className="baseInfo">
                  <img id="hemoIcon" src={imgBase} />
                  <div id="info">
                    <h2>{pendencia.nomeHemocentro}</h2>
                    <p>
                      <BiCurrentLocation/>
                      {pendencia.cidadeHemocentro}, {pendencia.estadoHemocentro}
                    </p>
                  </div>

                  <div className='btns'>
                    <button id="aceitarHemo" onClick={() => handleApprove(pendencia.idHemocentro)}>Aceitar</button>
                    <button id="negarHemo">Negar</button>
                  </div>
                  <BiChevronDown/>
                </div>
                <div className='cardInfo'>

                </div>
              </div>
            ))}
        </div>
      {/* )} */}
    </div>
  );
};

export default Pendencias;
