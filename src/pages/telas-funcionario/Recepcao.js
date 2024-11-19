import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Recepcao.css';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ClipLoader } from 'react-spinners';

const Recepcao = () => {
    const [senhas, setSenhas] = useState([]);
    const [feedbackChamado, setFeedbackChamado] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [senhaSelecionada, setSenhaSelecionada] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const [loadingActions, setLoadingActions] = useState({});
    const [loadingIniciar, setLoadingIniciar] = useState({});
    const [isModalLoading, setIsModalLoading] = useState(false);



    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'recepcao') {
            navigate('/login/funcionario');
        }
    }, [navigate, token]);

    const fetchSenhas = async () => {

        if (isFirstLoad) {
            setIsFetching(true); // Ativa o estado de carregamento
        }
        try {
            const response = await api.get('/senhas', {
                headers: { Authorization: `Bearer ${token}` },
                params: { idHemocentro },
            });
    
            setSenhas(response.data);
            setIsFirstLoad(false); // Após a primeira busca, desativa o carregamento inicial
        } catch (error) {
            console.error('Erro ao buscar senhas:', error);
        } finally {
             // O carregamento para de ser exibido apenas na primeira execução
            if (isFirstLoad) {
                setIsFetching(false);
            }
        }
    };

    useEffect(() => {
        fetchSenhas();
        const interval = setInterval(() => {
            fetchSenhas();
        }, 5000);

        return () => clearInterval(interval);
    }, [token, idHemocentro]);

    const chamarSenha = async (idSenha) => {

        setLoadingActions((prev) => ({ ...prev, [idSenha]: true }));

        try {
            // Realiza a requisição para chamar a senha
            const response = await api.post(`/chamar-senha/${idSenha}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Feedback visual para a senha chamada
            setFeedbackChamado((prev) => ({ ...prev, [idSenha]: true }));
            setTimeout(() => {
                setFeedbackChamado((prev) => ({ ...prev, [idSenha]: false }));
            }, 2000);
    
            // Atualiza a lista de senhas
            fetchSenhas();
        } catch (error) {
            console.error('Erro ao chamar senha:', error);
        } finally {
            // Reseta o estado de carregamento
            setLoadingActions((prev) => ({ ...prev, [idSenha]: false }));
        }
    };

    const abrirModalConfirmacao = (senha) => {
        setSenhaSelecionada(senha);
        setIsModalOpen(true);
    };

    const confirmarIniciarAtendimento = async () => {
        if (senhaSelecionada) {
            setLoadingIniciar((prev) => ({ ...prev, [senhaSelecionada.idSenha]: true }));
            setIsModalLoading(true); // Ativa o carregamento no modal

            try {
                const response = await api.put(`/senhas/iniciar-atendimento/${senhaSelecionada.idSenha}`, null, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                setSenhas((prevSenhas) => prevSenhas.filter((s) => s.idSenha !== senhaSelecionada.idSenha));
                setIsModalOpen(false);
                setSenhaSelecionada(null);
                navigate('/recepcao/atendimentos-iniciados');
            } catch (error) {
                console.error('Erro ao iniciar atendimento:', error);
                setIsModalOpen(false);
            } finally {
                setLoadingIniciar((prev) => ({ ...prev, [senhaSelecionada.idSenha]: false }));
                setIsModalLoading(true); // Ativa o carregamento no modal

            }
        }
    };
    

    return (
        <div className="recepcao-container">
            <h1 className="recepcao-title">Recepção - Senhas Geradas</h1>
            <h2 className='recepcao-subtitle'>Chame o doador ou inicie o atendimento</h2>
          
            {isFirstLoad && isFetching ?  (
                <div className='loading-container'>
                    <ClipLoader size={40} color='#0a93a1' />
                    <p>Carregando senhas...</p>
                </div>
            ) : (
                <ul className="recepcao-senha-list">
                    {senhas.map(senha => (
                        <li key={senha.idSenha} className="recepcao-senha-item">
                            <span className="recepcao-senha-numero">{senha.descSenha} ({senha.tipoSenha})</span>
                            <div>
                                <button
                                    className={`recepcao-chamar-btn ${feedbackChamado[senha.idSenha] ? 'chamado' : ''}`}
                                    onClick={() => chamarSenha(senha.idSenha)}
                                    disabled={loadingActions[senha.idSenha]}
                                >
                                    {loadingActions[senha.idSenha] ? <ClipLoader size={16} color='#fff' /> : 'Chamar'}
                                </button>
                                <button
                                    className="recepcao-iniciar-btn"
                                    onClick={() => abrirModalConfirmacao(senha)}
                                    disabled={loadingIniciar[senha.idSenha]}
                                >
                                    {loadingIniciar[senha.idSenha] ? <ClipLoader size={16} color='#fff' /> : 'Iniciar atendimento'}
                                </button>
                            </div>
                        </li>
                    ))}
                     {!isFirstLoad && isFetching && (
                        <div className="update-indicator">
                            Atualizando dados...
                        </div>
                    )}

                </ul>
            )}

           
            {/* Modal de Confirmação */}
            <AnimatePresence>
                {isModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        onConfirm={confirmarIniciarAtendimento}
                        isLoading={isModalLoading}
                        mensagem={`Você tem certeza que deseja iniciar o atendimento para a senha ${senhaSelecionada?.descSenha}?`}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Recepcao;




