import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './HemocentroFuncionario.css';
import CadastrarFuncionarioModal from '../components/CadastrarFuncionarioModal';
import { useNavigate } from 'react-router-dom';
import EditarFuncionarioModal from '../components/EditarFuncionarioModal';
import InputMask from 'react-input-mask';

const HemocentroFuncionarios = () => {
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

    return (
        <div className="funcionarios-content">
            <div className="header-content">
                <h1>Funcionários do Hemocentro</h1>
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
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionarios.map((funcionario) => (
                        <tr key={funcionario.idFuncionario}>
                            
                            <td>{funcionario.nomeFuncionario}</td>
                            <td>
                                <InputMask
                                    style={{width: 200, border: 0, backgroundColor: 'transparent'}}
                                    disabled
                                    mask={'999.999.999-99'}
                                    value={funcionario.cpfFuncionario}
                                />
                            </td>

                            <td>{funcionario.descFuncionario}</td>

                            <td>{funcionario.emailFuncionario}</td>


                            <td>
                                <button
                                    className='triagensIniciadas-btnRelatorio'
                                    onClick={() => handleEditFuncionario(funcionario)}
                                >
                                    Editar
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
        </div>
    );
};

export default HemocentroFuncionarios;
