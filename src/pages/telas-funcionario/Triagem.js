import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Triagem.css';
import Modal from 'react-modal';
import './ModalStyles.css';
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';

//Import ícone de mostrar mais 
import { BsBoxArrowUpRight } from "react-icons/bs";

import { ClipLoader } from 'react-spinners';


//Modal de confirmacao de ação
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const Triagem = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
    const navigate = useNavigate();
    const [isConfirmacaoModalOpen, setIsConfirmacaoModalOpen] = useState(false);

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [loadingActions, setLoadingActions] = useState({});
    const [loadingIniciar, setLoadingIniciar] = useState({});
    const [isModalLoading, setIsModalLoading] = useState(false);

    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'triagem') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

    const fetchDoacoes = () => {
        setIsFetching(true);
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
        })
        .finally(() => {
            setIsFetching(false);
            setIsFirstLoad(false);
        });
    };

    useEffect(() => {
        fetchDoacoes();
        const interval = setInterval(() => {
            fetchDoacoes();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const chamarDoacao = (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [idDoacao]: true }));
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
        })
        .finally(() => {
            setLoadingActions((prev) => ({ ...prev, [idDoacao]: false }));
        });
    };

    const iniciarTriagem = (idDoacao) => {
        setLoadingIniciar((prev) => ({ ...prev, [idDoacao]: true }));
        setIsModalLoading(true);

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
        })
        .finally(() => {
            setLoadingIniciar((prev) => ({ ...prev, [idDoacao]: false }));
            setIsModalLoading(false);
        });
    };

    const abrirModalConfirmacao = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsConfirmacaoModalOpen(true);
    };

    const openDoadorDetalhesModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsDoadorDetalhesModalOpen(true);
    };

    const closeDoadorDetalhesModal = () => {
        setIsDoadorDetalhesModalOpen(false);
        setDoacaoSelecionada(null);
    };

    return (
        <div className="triagem-container">
            
                    <h1 className="triagem-title">Triagem - Doações para Triagem</h1>
                    <h2 className="triagem-subtitle">Chame o doador ou inicie o atendimento</h2>
            {isFirstLoad ? (
                <div className='loading-container'>
                    <ClipLoader size={40} color='#0a93a1' />
                    <p>Carregando senhas...</p>
                </div>
            ) : (
                <>
                    <ul className="triagem-senha-list">
                        {doacoes.map((doacao) => (
                            <li key={doacao.idDoacao} className="triagem-senha-item">
                                <span className="triagem-senha-numero">
                                    {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : 'Sem informação de senha'}
                                </span>
                                <span onClick={() => openDoadorDetalhesModal(doacao)} className="triagem-doador-nome">
                                    {doacao.usuario ? `Doador: ${doacao.usuario.nomeUsuario}` : 'Nome do doador não disponível'}
                                    <BsBoxArrowUpRight className="triagem-mostrar-mais-icone" size={22} style={{ marginLeft: '10px' }} />
                                </span>
                                <div>
                                    <button
                                        className="triagem-chamar-btn"
                                        onClick={() => chamarDoacao(doacao.idDoacao)}
                                        disabled={loadingActions[doacao.idDoacao]}
                                    >
                                        {loadingActions[doacao.idDoacao] ? <ClipLoader size={16} color="#fff" /> : 'Chamar'}
                                    </button>
                                    <button
                                        className="triagem-iniciar-btn"
                                        onClick={() => abrirModalConfirmacao(doacao.idDoacao)}
                                        disabled={loadingIniciar[doacao.idDoacao]}
                                    >
                                        {loadingIniciar[doacao.idDoacao] ? <ClipLoader size={16} color="#fff" /> : 'Iniciar Triagem'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <DoadorDetalhesModal
                isOpen={isDoadorDetalhesModalOpen}
                onRequestClose={closeDoadorDetalhesModal}
                doador={doacaoSelecionada ? doacaoSelecionada.usuario : null}
            />
            <AnimatePresence>
                {isConfirmacaoModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isConfirmacaoModalOpen}
                        onRequestClose={() => setIsConfirmacaoModalOpen(false)}
                        onConfirm={() => iniciarTriagem(doacaoSelecionada)}
                        isLoading={isModalLoading}
                        mensagem="Você tem certeza que deseja iniciar a triagem?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Triagem;

