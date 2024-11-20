import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Campanhas.css';
import { AiOutlineSearch } from "react-icons/ai";

const Campanhas = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [activeButton, setActiveButton] = useState('todos');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o valor da pesquisa


  useEffect(() => {
    const fetchCampanhas = async () => {
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
        const response = await api.get('/campanhas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Assumindo que as campanhas estão no formato response.data
        setCampanhas(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (error) {
        setError('Erro ao carregar campanhas. Tente novamente mais tarde.');
        console.error('Erro ao buscar campanhas', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampanhas();
  }, [navigate]);

  return (
    <div className="campanhas-container">
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
            {campanhas.map((campanha) => (
              <tr key={campanha.idCampanha}>
                <td><img src={`http://179.63.40.44:8000/storage/${campanha.fotoCampanha || 'uploads/campanhas/banner-para-campanha-de-doacao.avif'}`}/></td>
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
