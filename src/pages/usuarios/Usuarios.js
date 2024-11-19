import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";

import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';

import api from '../../services/api';
import './Usuarios.css';

const Usuarios = () => {


  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [isDetalhesDoadorOpen, setIsDetalhesDoadorOpen] = useState(false);
  const abrirDetalhesDoador = (usuario) => {
      setUsuarioSelecionado(usuario);
      setIsDetalhesDoadorOpen(true);
  }
  const fecharDetalhesDoador = (usuario) => {
     setUsuarioSelecionado(null);
     setIsDetalhesDoadorOpen(false);
  }

  const [selectedUsers, setSelectedUsers] = useState([]);


  const [activeButton, setActiveButton] = useState('todos');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o valor da pesquisa

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem('token');
      const tipoUsuario = localStorage.getItem('tipoUsuario');

      if (!token || tipoUsuario !== 'administrador') {
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
      } catch (error) {
        setError('Erro ao carregar usuários. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [navigate]);

  const enviarNotificacoes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token de autenticação não encontrado. Faça login novamente.");
        return;
      }
  
      const response = await api.post(
        "/notificacoes/enviar",
        {
          usuarios: selectedUsers, // IDs selecionados
          mensagem: "Mensagem personalizada para os usuários",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Verifica se a resposta é um sucesso
      if (response.status === 200) {
        alert("Notificações enviadas com sucesso!");
        setSelectedUsers([]); // Limpa a seleção após o envio
      } else {
        console.error("Erro inesperado:", response.data);
        alert("Erro ao enviar notificações. Tente novamente mais tarde.");
      }
    } catch (error) {
      // Captura detalhes do erro retornado pela API
      if (error.response) {
        console.error("Erro do servidor:", error.response.data);
        alert(`Erro ao enviar notificações: ${error.response.data.error || "Desconhecido"}`);
      } else if (error.request) {
        console.error("Erro na requisição:", error.request);
        alert("Não foi possível enviar a requisição. Verifique sua conexão com a internet.");
      } else {
        console.error("Erro desconhecido:", error.message);
        alert("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };
  
  

  // Filtra os usuários com base no termo de pesquisa e no botão ativo
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nomeUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.emailUsuario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType =
      activeButton === 'todos' || usuario.descTipoSanguineo === activeButton;

    return matchesSearch && matchesBloodType;
  });

  return (
    <div className="usuarios-container">
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className='usuarios-content'>
          
          <div className='filtros-container'>
            <div className='filtro-item'>
              <label htmlFor='tipo-sanguineo'>Filtrar por Tipo:</label>
              <select
                id='tipo-sanguineo'
                value={activeButton}
                onChange={(e) => setActiveButton(e.target.value)}
                className="tipo-sanguineo-dropdown"
              >
                <option value="todos">Todos</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
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

          <div className="usuarios-acoes">
          <p>
            {filteredUsuarios.filter((usuario) =>
              selectedUsers.includes(usuario.idUsuario)
            ).length}{' '}
            usuário(s) selecionado(s)
          </p>

            <button
              onClick={() => enviarNotificacoes()}
              disabled={selectedUsers.length === 0}
              className="notificacao-button"
            >
              Enviar Notificações
            </button>
          </div>



          <table>
            <thead>
              <tr>
                
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo Sanguineo</th>
                <th>
                  Açoes
                </th>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Seleciona apenas os usuários filtrados
                        const filteredIds = filteredUsuarios.map((usuario) => usuario.idUsuario);
                        setSelectedUsers((prev) => [...new Set([...prev, ...filteredIds])]);
                      } else {
                        // Remove os usuários filtrados da seleção
                        const filteredIds = filteredUsuarios.map((usuario) => usuario.idUsuario);
                        setSelectedUsers((prev) => prev.filter((id) => !filteredIds.includes(id)));
                      }
                    }}
                    // Marca o checkbox caso todos os usuários filtrados estejam selecionados
                    checked={
                      filteredUsuarios.length > 0 &&
                      filteredUsuarios.every((usuario) => selectedUsers.includes(usuario.idUsuario))
                    }
                  />  
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.idUsuario}>
                  
                  <td>{usuario.nomeUsuario}</td>
                  <td>{usuario.emailUsuario}</td>
                  <td>{usuario.descTipoSanguineo}</td>
                  
                  <td>
                    <>
                      <button onClick={() => abrirDetalhesDoador(usuario)} className="edit-button" >Visualizar</button>
                    </>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(usuario.idUsuario)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers((prev) => [...prev, usuario.idUsuario]);
                        } else {
                          setSelectedUsers((prev) =>
                            prev.filter((id) => id !== usuario.idUsuario)
                          );
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    <DoadorDetalhesModal
      isOpen={isDetalhesDoadorOpen}
      onRequestClose={fecharDetalhesDoador}
      doador={usuarioSelecionado}
    />
    </div>
  );
};

export default Usuarios;
