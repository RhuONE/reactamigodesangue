import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário

import api from '../services/api';
import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirecionar

  useEffect(() => {
    const fetchUsuarios = async () => {
        const token = localStorage.getItem('token'); // Assumindo que o token é armazeado no localStorage

        if(!token){
            // Se o token não estiver presente, redireciona para a tela de login
            navigate('/login');
            return;
        }

        try {
            const response = await api.get('/usuarios', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsuarios(Array.isArray(response.data.data) ? response.data.data : []);
            setError(null);
            console.log(response.data);
        } catch (error) {
            setError('Erro ao carregar usuários. Tente novamente mais tarde.');
            console.error('Erro ao buscar usuários', error);
            
        } finally {
            setLoading(false);
        }
    };

    fetchUsuarios();
  }, [navigate]);

  return (
    <div className="usuarios-container">
      <h2>Usuários</h2>
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
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.idUsuario}>
                <td>{usuario.nomeUsuario}</td>
                <td>{usuario.emailUsuario}</td>
                <td>{usuario.tipoUsuario}</td>
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

export default Usuarios;
