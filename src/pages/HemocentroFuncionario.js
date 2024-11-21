import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './HemocentroFuncionario.css';
import CadastrarFuncionarioModal from '../components/CadastrarFuncionarioModal';
import { useNavigate } from 'react-router-dom';
import EditarFuncionarioModal from '../components/EditarFuncionarioModal';
import InputMask from 'react-input-mask';
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { FaCheck, FaEdit } from 'react-icons/fa';
import { FiArchive } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ConfirmationModal from '../components/modalConfirm';
import { ToastContainer, toast } from 'react-toastify';


const HemocentroFuncionarios = () => {

    const [modalConfirm, setModalConfirm] = useState(false);
    const [mensagemModal, setMensagemModal] = useState('');
    const [actionToConfirm, setActionToConfirm] = useState('');
    const [idToConfirm, setIdToConfirm] = useState(null);
    const [activeButton, setActiveButton] = useState('todos');
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o valor da pesquisa
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editModalData, setEditModalData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();

    // Função para buscar os funcionários na API
    useEffect(() => {
        const fetchFuncionarios = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login/hemocentro');
                return;
            }

            try {
                const response = await api.get('/hemocentro/funcionarios', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFuncionarios(response.data);
                setError(null);
            } catch (error) {
                setError('Erro ao carregar lista de funcionários. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchFuncionarios();
    }, [navigate]);

    // Função para cadastrar um novo funcionário
    const handleAddFuncionario = async (formData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.post('/funcionario', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFuncionarios([...funcionarios, response.data.data]);
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error.response);
            if (error.response && error.response.data && error.response.data.errors) {
                throw error;
            }
        }
    };
    // Função para atualizar os dados do funcionário
    const handleUpdateFuncionario = async (formData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.put(`/funcionario/${editModalData.idFuncionario}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Atualiza o funcionário na lista
            setFuncionarios(funcionarios.map(func =>
                func.idFuncionario === editModalData.idFuncionario
                    ? response.data.data
                    : func
            ));
            setShowEditModal(false); // Fecha o modal após salvar
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error.response);
        }
    };

    //Função para abrir o modal de edição
    const handleEditFuncionario = (funcionario) => {
        setEditModalData(funcionario);
        setShowEditModal(true);
    }

    // Função para arquivar um funcionário
    const handleArchiveFuncionario = async (idFuncionario) => {
        const token = localStorage.getItem('token');
        try {
            await api.put(`/funcionario/${idFuncionario}/arquivar`, { // Rota de arquivamento
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFuncionarios(funcionarios.map(func =>
                func.idFuncionario === idFuncionario
                    ? { ...func, statusFuncionario: 'arquivado' }
                    : func
            ));
        } catch (error) {
            console.error('Erro ao arquivar funcionário:', error);
        }
    };

    // Função para ativar um funcionário
    const handleActivateFuncionario = async (idFuncionario) => {
        const token = localStorage.getItem('token');
        try {
            await api.put(`/funcionario/${idFuncionario}/ativar`, { // Rota de ativação
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFuncionarios(funcionarios.map(func =>
                func.idFuncionario === idFuncionario
                    ? { ...func, statusFuncionario: 'ativo' }
                    : func
            ));
        } catch (error) {
            console.error('Erro ao ativar funcionário:', error);
        }
    };

    if (loading) {
        return <div className="loader-container"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }



    const filteredFuncionarios = funcionarios.filter((funcionario) => {
        const matchesSearch =
            funcionario.nomeFuncionario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            funcionario.emailFuncionario.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFunction =
            activeButton === 'todos' || funcionario.descFuncionario === activeButton;

        return matchesSearch && matchesFunction;
    });


    const handleOpenModal = (action, id, nome) => {
        if (action === 'ativar') {
            setMensagemModal(`Você realmente deseja Ativar, ${nome}?`);
        }
        if (action === 'arquivar') {
            setMensagemModal(`Você realmente deseja Arquivar, ${nome}?`);
        }

        setActionToConfirm(action);
        setIdToConfirm(id);
        setModalConfirm(true);
    };

    const handleConfirm = async () => {
        const toastId = "approval-toast";

        if (actionToConfirm === 'ativar') {
            if (!toast.isActive(toastId)) {
                toast.success('Funcionario ativado com sucesso!', {
                    toastId: toastId,
                    autoClose: 3000,
                });
            }

            await handleActivateFuncionario(idToConfirm);
        } else if (actionToConfirm === 'arquivar') {
            const errorToastId = "deny-toast";
            if (!toast.isActive(errorToastId)) {
                toast.success('Funcionario arquivado com sucesso!', {
                    toastId: errorToastId,
                    autoClose: 3000,
                });
            }

            await handleArchiveFuncionario(idToConfirm);
        }

        setModalConfirm(false);
    };

    const handleCancel = () => {
        setModalConfirm(false);
        toast.info('Operação Cancelada.');
    };


    return (
        <div className="funcionarios-container">
      <ToastContainer /> {/** Container para exibir notificações */}
            <div className='funcionarios-content'>

                <div className='filtros-container'>
                    <div className='filtro-item'>
                        <label htmlFor='funcao'>Filtrar por Função:</label>
                        <select
                            id='funcao'
                            value={activeButton}
                            onChange={(e) => setActiveButton(e.target.value)}
                            className="funcao-dropdown"
                        >
                            <option value="todos">Todas</option>
                            <option value="totem">Totem</option>
                            <option value="recepcao">Recepção</option>
                            <option value="triagem">Triagem</option>
                            <option value="entrevista">Entrevista</option>
                            <option value="coleta">Coleta</option>
                            <option value="laboratorio">Laboratório</option>
                            <option value="estoque">Estoque</option>
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
                    <button className="add-funcionario-btn" onClick={() => setShowModal(true)}>
                        Adicionar Funcionário
                    </button>
                </div>
                <table className="funcionarios-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Função</th>
                            <th>Status</th>
                            <th>Email</th>
                            <th className='funcionarios-acoes'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFuncionarios.map((funcionario) => (
                            <tr key={funcionario.idFuncionario}>

                                <td>{funcionario.nomeFuncionario}</td>
                                <td>
                                    <InputMask
                                        style={{ width: 200, border: 0, backgroundColor: 'transparent' }}
                                        disabled
                                        mask={'999.999.999-99'}
                                        value={funcionario.cpfFuncionario}
                                    />
                                </td>

                                <td>{funcionario.descFuncionario}</td>

                                <td>{funcionario.statusFuncionario}</td>

                                <td>{funcionario.emailFuncionario}</td>

                                <td className='funcionarios-acoes'>
                                    <button
                                        className='funcionarios-btnAcoes editar'
                                        onClick={() => handleEditFuncionario(funcionario)}
                                        data-tooltip-id="editar-btn-tooltip" // Atribua o ID do Tooltip
                                        data-tooltip-content="Editar" // Texto do Tooltip
                                    >
                                        <AiOutlineEdit />
                                    </button>
                                    <button
                                        className='funcionarios-btnAcoes arquivar'
                                        onClick={() => handleOpenModal('arquivar', funcionario.idFuncionario, funcionario.nomeFuncionario)}
                                        data-tooltip-id="arquivar-btn-tooltip" // Atribua o ID do Tooltip
                                        data-tooltip-content="Arquivar" // Texto do Tooltip
                                    >
                                        <FiArchive
                                        />
                                    </button>
                                    <button
                                        className='funcionarios-btnAcoes ativar'
                                        onClick={() => handleOpenModal('ativar', funcionario.idFuncionario, funcionario.nomeFuncionario)}
                                        data-tooltip-id="ativar-btn-tooltip" // Atribua o ID do Tooltip
                                        data-tooltip-content="Ativar" // Texto do Tooltip
                                    >
                                        <FaCheck />
                                    </button>
                                    {/* {funcionario.statusFuncionario === 'ativo' ? (
                                    <button
                                        className="archive-btn"
                                        onClick={() => handleArchiveFuncionario(funcionario.idFuncionario)}
                                    >
                                        Arquivar
                                    </button>
                                ) : (
                                    <button
                                        className="activate-btn"
                                        onClick={() => handleActivateFuncionario(funcionario.idFuncionario)}
                                    >
                                        Ativar
                                    </button>
                                )} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <Tooltip id="ativar-btn-tooltip" place="top" style={{ backgroundColor: "#28a745" }} />
            <Tooltip id="arquivar-btn-tooltip" place="top" style={{ backgroundColor: "#ed1724" }} />
            <Tooltip id="editar-btn-tooltip" place="top" style={{ backgroundColor: "cadetblue" }} />

            <CadastrarFuncionarioModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleAddFuncionario}
            />

            <EditarFuncionarioModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleUpdateFuncionario}
                funcionario={editModalData}
            />

            <ConfirmationModal
                isOpen={modalConfirm}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                message={mensagemModal}
            />
        </div>
    );
};

export default HemocentroFuncionarios;
