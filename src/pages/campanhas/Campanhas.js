import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Campanhas.css';

const Campanhas = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampanhas = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
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
      <h2>Campanhas</h2>
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Data de Início</th>
              <th>Data de Término</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {campanhas.map((campanha) => (
              <tr key={campanha.idCampanha}>
                <td>{campanha.tituloCampanha}</td>
                <td>{campanha.descCampanha}</td>
                <td>{new Date(campanha.dataInicioCampanha).toLocaleDateString()}</td>
                <td>{new Date(campanha.dataFimCampanha).toLocaleDateString()}</td>
                <td>{campanha.statusCampanha}</td>
                <td>
                  <button className="edit-button">Editar</button>
                  <button className="delete-button">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Campanhas;
