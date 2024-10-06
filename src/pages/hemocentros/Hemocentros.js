import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import MetricCard from '../../components/MetricCard';
import api from '../../services/api'; // Certifique-se de que o arquivo da API esteja importado corretamente
import './Hemocentros.css';
import { AiOutlineSearch } from "react-icons/ai";
import { BiCurrentLocation, BiChevronDown } from "react-icons/bi";
import { FaTrash } from "react-icons/fa6";
import { FaEdit, FaHospital } from "react-icons/fa";
import hospitalIcon from '../../images/hospital.jpg'

const Hemocentros = () => {
  const [hemocentros, setHemocentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirecionar

  useEffect(() => {
    const fetchHemocentros = async () => {
      const token = localStorage.getItem('token'); // Assumindo que o token é armazenado no localStorage

      if (!token) {
        // Se o token não estiver presente, redireciona para a tela de login
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/hemocentros', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Ajustando a lógica para acessar os dados corretamente
        if (Array.isArray(response.data)) {
          setHemocentros(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setHemocentros(response.data.data);
        } else {
          setHemocentros([]);
        }
        console.log(response.data);
      } catch (error) {
        setError('Erro ao carregar hemocentros. Tente novamente mais tarde.');
        console.error('Erro ao buscar hemocentros', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHemocentros();
  }, [navigate]);

  return (
    <div className="hemocentros-container">
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className='hemocentros-content'>
          {/* <h2 className='titulo'>Hemocentros<FaHospital/></h2> */}
          <h3 className='subTitulo'>Hemocentros com Mais Doações</h3>
          <div className="hemocentros-metrics">
            <div className='hemocentroCard-tier'>
              <h3 className='posicaoRanking'>1º</h3>
              <img src={hospitalIcon}/>
              <div className='info'>
                <h2>Gusmão e Zambrano</h2>
                <h3>Doações <span>28</span></h3>
              </div>
            </div>
            <div className='hemocentroCard-tier'>
            <h3 className='posicaoRanking'>2º</h3>
              <img src={hospitalIcon}/>
              <div className='info'>
                <h2>Gusmão e Zambrano</h2>
                <h3>Doações <span>28</span></h3>
              </div>
            </div>
            <div className='hemocentroCard-tier'>
            <h3 className='posicaoRanking'>3º</h3>
            <img src={hospitalIcon}/>
              <div className='info'>
                <h2>Gusmão e Zambrano</h2>
                <h3>Doações <span>28</span></h3>
              </div>
            </div>
            <div className='hemocentroCard-tier'>
            <h3 className='posicaoRanking'>4º</h3>
            <img src={hospitalIcon}/>
              <div className='info'>
                <h2>Gusmão e Zambrano</h2>
                <h3>Doações <span>28</span></h3>
              </div>
            </div>
          </div>
          <div className='pesquisaFiltroHemo'>
            <button className='active'>Recentes</button>
            <button>Por Status</button>
            <button>Por Região</button>
            <div className='pesquisaCampo'>
              <input type='text' placeholder='Pesquisar...'/>
              <AiOutlineSearch className='lupaIcon'/>
            </div>
          </div>
          <table className='tableListaHemo'>
            <thead className='headerListaHemo'>
              <tr className='headerLinhaListaHemo'>
                <th className='headerCelulaListaHemo imgCampo'></th>
                <th className='headerCelulaListaHemo nomeCampo'>Nome/Local</th>
                <th className='headerCelulaListaHemo emailCampo'>E-mail</th>
                <th className='headerCelulaListaHemo statusCampo'>Status</th>
                <th className='headerCelulaListaHemo opcaoCampo'>Funções</th>
              </tr>
            </thead>
          </table>
          <div className='cardsListagem'>
            {hemocentros.map((hemocentro) => (
              <div className='card' key={hemocentro.idHemocentro}>
                <div className="baseInfo">
                  <img id="hemoIcon" src={hospitalIcon} />
                  <div id="info">
                    <h2>{hemocentro.nomeHemocentro}</h2>
                    <p>
                      <BiCurrentLocation />
                      {hemocentro.cidadeHemocentro}, {hemocentro.estadoHemocentro}
                    </p>
                  </div>

                  <p className='emailCard'>hemo@gmail.com</p>
                  <p className={`statusCard ${hemocentro.statusHemocentro}`}>{hemocentro.statusHemocentro}</p>
                  <div className='btns'>
                    <button className='aceitarHemoBtn'><FaEdit /></button>
                    <button className='deleteHemoBtn'><FaTrash /></button>
                  </div>
                  <BiChevronDown />
                </div>
                <div className='cardInfo'>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hemocentros;
