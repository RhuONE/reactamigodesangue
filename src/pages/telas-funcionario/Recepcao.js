import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Recepcao.css';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Recepcao = () => {
    const [senhas, setSenhas] = useState([]);
    const [feedbackChamado, setFeedbackChamado] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [senhaSelecionada, setSenhaSelecionada] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'recepcao') {
            navigate('/login/funcionario');
        }
    }, [navigate, token]);

    const fetchSenhas = () => {
        api.get('/senhas', {
            headers: { Authorization: `Bearer ${token}` },
            params: { idHemocentro },
        })
        .then(response => setSenhas(response.data))
        .catch(error => console.error('Erro ao buscar senhas:', error));
    };

    useEffect(() => {
        fetchSenhas();
        const interval = setInterval(() => {
            fetchSenhas();
        }, 5000);

        return () => clearInterval(interval);
    }, [token, idHemocentro]);

    const chamarSenha = (idSenha) => {
        api.post(`/chamar-senha/${idSenha}`, null, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            setFeedbackChamado(prev => ({ ...prev, [idSenha]: true }));
            setTimeout(() => {
                setFeedbackChamado(prev => ({ ...prev, [idSenha]: false }));
            }, 2000);

            fetchSenhas();
        })
        .catch(error => console.error('Erro ao chamar senha:', error));
    };

    const abrirModalConfirmacao = (idSenha) => {
        setSenhaSelecionada(idSenha);
        setIsModalOpen(true);
    };

    const confirmarIniciarAtendimento = () => {
        if (senhaSelecionada) {
            api.put(`/senhas/iniciar-atendimento/${senhaSelecionada}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                setSenhas(senhas.filter(s => s.idSenha !== senhaSelecionada));
                setIsModalOpen(false);
                setSenhaSelecionada(null);
                navigate('/recepcao/atendimentos-iniciados');
            })
            .catch(error => {
                console.error('Erro ao iniciar atendimento:', error);
                setIsModalOpen(false);
            });
        }
    };

    return (
        <div className="recepcao-container">
            <h1 className="recepcao-title">Recepção - Senhas Geradas</h1>
            <h2 className='recepcao-subtitle'>Chame o doador ou inicie o atendimento</h2>
            <ul className="recepcao-senha-list">
                {senhas.map(senha => (
                    <li key={senha.idSenha} className="recepcao-senha-item">
                        <span className="recepcao-senha-numero">{senha.descSenha} ({senha.tipoSenha})</span>
                        <div>
                            <button
                                className={`recepcao-chamar-btn ${feedbackChamado[senha.idSenha] ? 'chamado' : ''}`}
                                onClick={() => chamarSenha(senha.idSenha)}
                            >
                                Chamar
                            </button>
                            <button
                                className="recepcao-iniciar-btn"
                                onClick={() => abrirModalConfirmacao(senha.idSenha)}
                            >
                                Iniciar Atendimento
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal de Confirmação */}
            <AnimatePresence>
                {isModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        onConfirm={confirmarIniciarAtendimento}
                        mensagem="Você tem certeza que deseja iniciar o atendimento?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Recepcao;
