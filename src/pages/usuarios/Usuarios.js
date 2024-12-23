import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineEye } from "react-icons/ai";

import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';
import EnviarNotificacaoModal from "../../components/EnviarNotificacaoModal";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import LoadingBar from 'react-top-loading-bar'; // Importando a barra de progresso

import api from '../../services/api';
import './Usuarios.css';
import { toast, ToastContainer } from 'react-toastify'; // Importando Toastify
import 'react-toastify/dist/ReactToastify.css';

const Usuarios = () => {

  const loadingBarRef = useRef(null); // Referência para a barra de progresso

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
  const [selectedAptidao, setSelectedAptidao] = useState("todos");

  const [isNotificacaoModalOpen, setIsNotificacaoModalOpen] = useState(false);

  const abrirModalNotificacao = () => {
    if (selectedUsers.length === 0) {
      alert("Selecione ao menos um usuário para enviar notificações.");
      return;
    }
    setIsNotificacaoModalOpen(true);
  };

  const fecharModalNotificacao = () => {
    setIsNotificacaoModalOpen(false);
  };

  const handleEnviarNotificacoes = async (mensagem) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/notificacoes/enviar",
        {
          usuarios: selectedUsers,
          mensagem,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Notificações enviadas com sucesso!");
        setSelectedUsers([]);
      }
    } catch (error) {
      toast.error("Erro ao enviar notificações. Tente novamente.");
      console.error(error);
    }
  };


  const navigate = useNavigate();

  useEffect(() => {
    const toastId = "toastId";
    const fetchUsuarios = async () => {
      const token = localStorage.getItem('token');
      const tipoUsuario = localStorage.getItem('tipoUsuario');

      if (!token || tipoUsuario !== 'administrador') {
        navigate('/login');
        return;
      }

      try {
        loadingBarRef.current.continuousStart(); // Inicia a barra de progresso
        const response = await api.get('/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuarios(Array.isArray(response.data.data) ? response.data.data : []);
        setError(null);
        
        if (!toast.isActive(toastId)) {
          toast.success('HDados carregados com sucesso!', {
            toastId: toastId,
            autoClose: 3000,
          });
        }
      } catch (error) {
        setError('Erro ao carregar usuários. Tente novamente mais tarde.');
        toast.error('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
      }
    };

    fetchUsuarios();
  }, [navigate]);

  
  
  

  // Filtra os usuários com base no termo de pesquisa e no botão ativo
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nomeUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.emailUsuario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType =
      activeButton === 'todos' || usuario.descTipoSanguineo === activeButton;

    const matchesAptidao =
      selectedAptidao === "todos" ||
      (selectedAptidao === "aptos" && usuario.aptoParaDoar) ||
      (selectedAptidao === "naoAptos" && !usuario.aptoParaDoar);

    return matchesSearch && matchesBloodType && matchesAptidao;
  });

  return (
    <div className="usuarios-container">
      <LoadingBar color="#f11946" ref={loadingBarRef} /> {/* Barra de progresso */}
      <ToastContainer /> {/** Container para exibir notificações */}
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className='usuarios-content'>
          
          <div className='filtros-container'>
            <div className='filtro-item'>
              <label htmlFor='tipo-sanguineo'>Filtrar por Tipo Sanguíneo:</label>
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
              <label htmlFor='aptidao'>Filtrar por Disponibilidade:</label>
              <select
                id='aptidao'
                value={selectedAptidao}
                onChange={(e) => setSelectedAptidao(e.target.value)}
                className="aptidao-dropdown"
              >
                <option value="todos">Todos</option>
                <option value="aptos">Disponível para doação</option>
                <option value="naoAptos">Indisponível para doação</option>
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
              onClick={abrirModalNotificacao}
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
                <th id='tipoSangue'>Tipo Sanguineo</th>
                <th>Aptidao para Doar</th>
                <th id='acoes'>
                  Açoes
                </th>
                <th id='notificacao'> 
                  <input
                    type="checkbox"
                    className='checkbox-notification'
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
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.idUsuario}>
                    
                    <td>{usuario.nomeUsuario}</td>
                    <td>{usuario.emailUsuario}</td>
                    <td id='tipoSangue'>{usuario.descTipoSanguineo}</td>

                    <td>
                      {usuario.aptoParaDoar? "Disponível" : "Indisponível"}
                    </td>
                    
                    <td id='acoes'>
                      <AiOutlineEye
                        data-tooltip-id="ver-detalhes-tooltip" // Atribua o ID do Tooltip
                        data-tooltip-content="Ver detalhes" // Texto do Tooltip
                        className="icon-visualizar"
                        onClick={() => abrirDetalhesDoador(usuario)}
                        style={{ cursor: "pointer", fontSize: "1.5rem"}} // Ajuste de estilo
                      />
                          <Tooltip id="ver-detalhes-tooltip" place="top" />
                    </td>
                    
                    <td id='notificacao'>
                      <input
                        type="checkbox"
                      className='checkbox-notification'
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "#999" }}>
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    <>
      {/* Modal de Envio de Notificação */}
      <EnviarNotificacaoModal
        isOpen={isNotificacaoModalOpen}
        onRequestClose={fecharModalNotificacao}
        onSend={handleEnviarNotificacoes}
        selectedUsers={selectedUsers}
      />
   

      <DoadorDetalhesModal
        isOpen={isDetalhesDoadorOpen}
        onRequestClose={fecharDetalhesDoador}
        doador={usuarioSelecionado}
      />
    </>
    </div>
  );
};

export default Usuarios;
