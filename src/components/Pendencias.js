import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Pendencias.css';

const Pendencias = () => {
  const [pendencias, setPendencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendencias = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
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
      <h2>Pendências</h2>
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendencias.map((pendencia) => (
              <tr key={pendencia.idHemocentro}>
                <td>{pendencia.nomeHemocentro}</td>
                <td>{pendencia.emailHemocentro}</td>
                <td>{pendencia.telHemocentro}</td>
                <td>{`${pendencia.logHemocentro}, ${pendencia.numLogHemocentro}, ${pendencia.bairroHemocentro}, ${pendencia.cidadeHemocentro}, ${pendencia.estadoHemocentro}`}</td>
                <td>
                  <button className="approve-button" onClick={() => handleApprove(pendencia.idHemocentro)}>
                    Aprovar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Pendencias;
