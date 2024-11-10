import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Triagem.css';
import Modal from 'react-modal';
import './ModalStyles.css';
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';

//Import ícone de mostrar mais 
import { BsBoxArrowUpRight } from "react-icons/bs";


//Modal de confirmacao de ação
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const Triagem = () => {

    //Estado de doacoes
    const [doacoes, setDoacoes] = useState([]);
    //Estado de Modal com detalhes do doador
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    //Estado com doacao selecionada
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null); // Armazena a doação selecionada
    //Navigate para redirecionar para tela
    const navigate = useNavigate();
    //Estado de abertura para modal de confirmação
    const [isConfirmacaoModalOpen, setIsConfirmacaoModalOpen] = useState(false);

    //Recupera credenciais de login do "armazenamento local"
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    //Função para autenticar credenciais, caso não, redireciona para login
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

    // Função para abrir modal de confirmação 
    const abrirModalConfirmacao = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsConfirmacaoModalOpen(true);
    }

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
            console.log(idDoacao);
            api.put(`/doacoes/senhas/iniciar-triagem/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                setIsConfirmacaoModalOpen(false);
                setDoacaoSelecionada(null);
                fetchDoacoes();
                navigate('/triagem/triagens-iniciadas');
            })
            .catch(error => {
                console.error('Erro ao iniciar triagem:', error);
                setIsConfirmacaoModalOpen(false);
            });
        
    };

    return (
        <div className="triagem-container">
            <h1 className="triagem-title">Triagem - Doações para Triagem</h1>
            <h2 className='triagem-subtitle'>Chame o doador ou inicie o atendimento</h2>
            <ul className="triagem-senha-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="triagem-senha-item">
                        <span className="triagem-senha-numero">
                            {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                        </span>
                        <span onClick={() => openDoadorDetalhesModal(doacao)} className="triagem-doador-nome">
                            {doacao.usuario ? `Doador: ${doacao.usuario.nomeUsuario}` : "Nome do doador não disponível"}
                            <BsBoxArrowUpRight  className='triagem-mostrar-mais-icone' size={22} style={{marginLeft: '10px'}}/>
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
                                onClick={() => abrirModalConfirmacao(doacao.idDoacao)}
                            >
                                Iniciar Triagem
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

            {/** Modal de Confirmação */}
            <AnimatePresence>
                {isConfirmacaoModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isConfirmacaoModalOpen}
                        onRequestClose={() => setIsConfirmacaoModalOpen(false)}
                        onConfirm={() => iniciarTriagem(doacaoSelecionada)}
                        mensagem="Você tem certeza que deseja iniciar a triagem?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Triagem;
