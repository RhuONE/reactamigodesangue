import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Campanhas.css';
import { AiOutlineSearch } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar'; // Importando a barra de progresso

const Campanhas = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [activeButton, setActiveButton] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const loadingBarRef = useRef(null); // Referência para a barra de progresso

  useEffect(() => {
    const fetchCampanhas = async () => {
      const toastId = "toastId";
      const token = localStorage.getItem('token');
      const tipoUsuario = localStorage.getItem('tipoUsuario');
      
      if (!token || tipoUsuario !== 'administrador') {
        navigate('/login');
        return;
      }

      try {
        loadingBarRef.current.continuousStart(); // Inicia a barra de progresso

        const response = await api.get('/campanhas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        
        setCampanhas(Array.isArray(response.data) ? response.data : []);
        setError(null);
        toast.success('Dados carregados com sucesso!', {
          toastId: toastId,
          autoClose: 3000,
        });
      } catch (error) {
        setError('Erro ao carregar campanhas. Tente novamente mais tarde.');
        toast.error('Algo deu errado no carregamento!', {
          toastId: toastId,
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
      }
    };

    fetchCampanhas();
  }, [navigate]);

  return (
    <div className="campanhas-container">
      <LoadingBar color="#f11946" ref={loadingBarRef} /> {/* Barra de progresso */}
      <ToastContainer />
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className='campanhas-content'>
          <div className='filtros-container'>
            <div className='filtro-item'>
              <label htmlFor='tipo-sanguineo'>Filtrar por Status:</label>
              <select
                id='tipo-sanguineo'
                value={activeButton}
                onChange={(e) => setActiveButton(e.target.value)}
                className="tipo-sanguineo-dropdown"
              >
                <option value="todos">Todos</option>
                <option value="ativos">Ativos</option>
                <option value="inativos">Inativos</option>
              </select>
            </div>

            <div className='filtro-item'>
              <label htmlFor='pesquisa'>Pesquisar:</label>
              <div className='pesquisaCampo'>
                <input
                  id='pesquisa'
                  type='text'
                  placeholder='Pesquisar por nome ou email...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <AiOutlineSearch className='lupaIcon' />
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Banner</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Data de Início</th>
                <th>Data de Término</th>
              </tr>
            </thead>
            <tbody>
              {campanhas
                .filter((campanha) => {
                  // Filtro por status
                  if (activeButton === "ativos" && campanha.statusCampanha !== "ativo") {
                    return false;
                  }
                  if (activeButton === "inativos" && campanha.statusCampanha !== "inativo") {
                    return false;
                  }
                  return true;
                })
                .filter((campanha) =>
                  // Filtro por pesquisa
                  campanha.tituloCampanha.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((campanha) => (
                  <tr key={campanha.idCampanha}>
                    <td>
                      <img
                        src={`http://179.63.40.44:8000/storage/${
                          campanha.fotoCampanha || "uploads/campanhas/banner-para-campanha-de-doacao.avif"
                        }`}
                        alt="Banner"
                      />
                    </td>
                    <td>{campanha.tituloCampanha}</td>
                    <td>{campanha.descCampanha}</td>
                    <td>{new Date(campanha.dataInicioCampanha).toLocaleDateString()}</td>
                    <td>{new Date(campanha.dataFimCampanha).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Campanhas;
