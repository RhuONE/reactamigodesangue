import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import api from '../services/api'; // Certifique-se de que o arquivo da API esteja importado corretamente
import './Hemocentros.css';

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
      <h2>Hemocentros</h2>
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
            {hemocentros.map((hemocentro) => (
              <tr key={hemocentro.idHemocentro}>
                <td>{hemocentro.nomeHemocentro}</td>
                <td>{hemocentro.emailHemocentro}</td>
                <td>{hemocentro.telHemocentro}</td>
                <td>{`${hemocentro.logHemocentro}, ${hemocentro.numLogHemocentro}, ${hemocentro.bairroHemocentro}, ${hemocentro.cidadeHemocentro}, ${hemocentro.estadoHemocentro}`}</td>
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

export default Hemocentros;
