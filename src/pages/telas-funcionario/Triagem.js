import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Triagem.css';
import Modal from 'react-modal';
import './ModalStyles.css';
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const Triagem = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null); // Armazena a doação selecionada
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'triagem') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

    // Função para buscar as doações para triagem no backend
    const fetchDoacoes = () => {
        api.get('/doacoes/senhas/triagem', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                idHemocentro,
            },
        })
        .then(response => {
            setDoacoes(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar doações:', error);
        });
    };

    useEffect(() => {
        fetchDoacoes();
        const interval = setInterval(() => {
            fetchDoacoes();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Função para abrir o modal de detalhes do doador
    const openDoadorDetalhesModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsDoadorDetalhesModalOpen(true);
    };

    // Função para fechar o modal de detalhes do doador
    const closeDoadorDetalhesModal = () => {
        setIsDoadorDetalhesModalOpen(false);
        setDoacaoSelecionada(null);
    };

    // Função para chamar uma doação (muda o status para "chamada-triagem")
    const chamarDoacao = (idDoacao) => {
        api.put(`/doacoes/senhas/chamar-triagem/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            fetchDoacoes();
        })
        .catch(error => {
            console.error('Erro ao chamar doação para triagem:', error);
        });
    };

    // Função para iniciar triagem (muda o status para "triagem-iniciada")
    const iniciarTriagem = (idDoacao) => {
        const confirmacao = window.confirm("Você tem certeza que deseja iniciar a triagem?");
        if (confirmacao) {
            api.put(`/doacoes/senhas/iniciar-triagem/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                fetchDoacoes();
            })
            .catch(error => {
                console.error('Erro ao iniciar triagem:', error);
            });
        }
    };

    return (
        <div className="triagem-container">
            <h1 className="triagem-title">Triagem - Doações para Triagem</h1>
            <ul className="triagem-senha-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="triagem-senha-item">
                        <span className="triagem-senha-numero">
                            {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                        </span>
                        <span className="triagem-doador-nome">
                            {doacao.usuario ? `Doador: ${doacao.usuario.nomeUsuario}` : "Nome do doador não disponível"}
                        </span>
                        <div>
                            <button 
                                className="triagem-chamar-btn" 
                                onClick={() => chamarDoacao(doacao.idDoacao)}
                            >
                                Chamar
                            </button>
                            <button 
                                className="triagem-iniciar-btn" 
                                onClick={() => iniciarTriagem(doacao.idDoacao)}
                            >
                                Iniciar Triagem
                            </button>
                            <button 
                                className="triagem-detalhes-btn" 
                                onClick={() => openDoadorDetalhesModal(doacao)}
                            >
                                Ver Detalhes
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {/* Modal de Detalhes do Doador */}
            <DoadorDetalhesModal
                isOpen={isDoadorDetalhesModalOpen}
                onRequestClose={closeDoadorDetalhesModal}
                doador={doacaoSelecionada ? doacaoSelecionada.usuario : null}
            />
        </div>
    );
};

export default Triagem;
