import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import { AiOutlineSearch } from "react-icons/ai";

import api from '../../services/api';
import './Usuarios.css';

const Usuarios = () => {
  const [activeButton, setActiveButton] = useState('todos'); // Estado para controlar qual botão está ativo
  const [pesquisa, setPesquisa] = useState(''); // Estado para armazenar o termo de pesquisa
  const [filtro, setFiltro] = useState(null); // Condição que define o filtro

  const handleClick = (button) => {
    setActiveButton(button);
    setFiltro(button);
  };
  
  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value); // Atualiza o estado com o valor do input
  };

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirecionar

  useEffect(() => {
    const fetchUsuarios = async () => {
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

  const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);

  useEffect(() => {
    const usuariosFiltradosPorStatus = filtro === 'doadores'
      ? usuariosFiltrados.filter(u => u.tipoUsuario === 'doador')
          : usuarios; // Se não houver filtro, pega todos

    // Aplica a pesquisa por nome na lista filtrada
    const usuariosFiltradosPorNome = usuariosFiltradosPorStatus.filter(u =>
      u.nomeUsuario.toLowerCase().includes(pesquisa.toLowerCase()) ||
      u.emailUsuario.toLowerCase().includes(pesquisa.toLowerCase())
    );

    setUsuariosFiltrados(usuariosFiltradosPorNome);
  }, [filtro, pesquisa, usuarios]);

  return (
    <div className="usuarios-container">
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className='usuarios-content'>
          <div className='usuarios-cards'>
            <div className='usuarios-card'>
            </div>
            <div className='usuarios-card'>
            </div>
            <div className='usuarios-card'>
            </div>
            <div className='usuarios-card'>
            </div>
          </div>

          <div className='pesquisaFiltroHemo'>
            <button className={activeButton === 'todos' ? 'active' : ''} onClick={() => handleClick('todos')}>
              Todos
            </button>
            <button className={activeButton === 'doadores' ? 'active' : ''} onClick={() => handleClick('doadores')}>
            Doadores
            </button>
            <div className='pesquisaCampo'>
              <input type='text' placeholder='Pesquisar...'
                value={pesquisa}
                onChange={handlePesquisaChange} // Atualiza o estado ao digitar
              />
              <AiOutlineSearch className='lupaIcon' />
            </div>
          </div>

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
              {usuariosFiltrados.map((usuario) => (
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
        </div>
      )}

    </div>
  );
};

export default Usuarios;
