import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Coleta.css';

// Ícone para mostrar mais
import { BsBoxArrowUpRight } from "react-icons/bs";

// Modal de detalhes do doador
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';

// Modal de confirmação
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';

import { ClipLoader } from 'react-spinners';

// Navegação para login
import { useNavigate } from 'react-router-dom';

const Coleta = () => {
    // Estado das doações
    const [doacoes, setDoacoes] = useState([]);
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
    const [isConfirmacaoModalOpen, setIsConfirmacaoModalOpen] = useState(false);

    // Estado de carregamento
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [loadingActions, setLoadingActions] = useState({});

    // Token e ID do hemocentro
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    const navigate = useNavigate();

    // Autenticação inicial para verificar credenciais
    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'coleta') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

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

    // Função para abrir o modal de confirmação
    const abrirModalConfirmacao = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsConfirmacaoModalOpen(true);
    };

    // Função para buscar as doações aguardando coleta
    const fetchDoacoesColeta = async () => {
        if (isFirstLoad) setIsFetching(true); // Mostra o spinner inicial

        try {
            const response = await api.get('/doacoes/senhas/coleta', {
                headers: { Authorization: `Bearer ${token}` },
                params: { idHemocentro },
            });

            setDoacoes(response.data);
            setIsFirstLoad(false); // Após a primeira carga, desativa o carregamento inicial
        } catch (error) {
            console.error('Erro ao buscar doações para coleta:', error);
        } finally {
            if (isFirstLoad) setIsFetching(false); // Finaliza o carregamento inicial
        }
    };

    // Função para chamar coleta
    const chamarColeta = async (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [idDoacao]: { ...prev[idDoacao], chamar: true } }));

        try {
            await api.put(`/doacoes/senhas/chamar-coleta/${idDoacao}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchDoacoesColeta(); // Atualiza os dados após chamar coleta
        } catch (error) {
            console.error('Erro ao chamar coleta:', error);
        } finally {
            setLoadingActions((prev) => ({ ...prev, [idDoacao]: { ...prev[idDoacao], chamar: false } }));
        }
    };

    // Função para iniciar coleta
    const iniciarColeta = async (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [idDoacao]: { ...prev[idDoacao], iniciar: true } }));

        try {
            await api.put(`/doacoes/senhas/iniciar-coleta/${idDoacao}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsConfirmacaoModalOpen(false);
            setDoacaoSelecionada(null);
            fetchDoacoesColeta(); // Atualiza os dados após iniciar coleta
            navigate('/coleta/coletas-iniciadas');
        } catch (error) {
            console.error('Erro ao iniciar coleta:', error);
        } finally {
            setLoadingActions((prev) => ({ ...prev, [idDoacao]: { ...prev[idDoacao], iniciar: false } }));
        }
    };

    // Atualiza os dados periodicamente
    useEffect(() => {
        fetchDoacoesColeta(); // Faz a primeira chamada

        const interval = setInterval(() => {
            fetchDoacoesColeta(); // Atualizações subsequentes
        }, 5000);

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar
    }, []);

    return (
        <div className="triagem-container">
            <h1 className="triagem-title">Doações Aguardando Coleta</h1>
            <h2 className="triagem-subtitle">Chame o doador ou inicie o atendimento</h2>

            {isFirstLoad && isFetching ? (
                <div className="loading-container">
                    <ClipLoader size={40} color="#0a93a1" />
                    <p>Carregando senhas...</p>
                </div>
            ) : (
                <>
                    <ul className="triagem-list">
                        {doacoes.map((doacao) => (
                            <li key={doacao.idDoacao} className="triagem-senha-item">
                                <span className="triagem-senha">
                                    {doacao.senha
                                        ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})`
                                        : 'Sem informação de senha'}
                                </span>
                                <span
                                    onClick={() => openDoadorDetalhesModal(doacao)}
                                    className="triagem-doador-nome"
                                >
                                    Doador: {doacao.usuario?.nomeUsuario || 'Nome do doador não disponível'}
                                    <BsBoxArrowUpRight
                                        className="triagem-mostrar-mais-icone"
                                        size={22}
                                    />
                                </span>
                                <div className="triagem-acoes">
                                    <button
                                        className="triagem-chamar-btn"
                                        onClick={() => chamarColeta(doacao.idDoacao)}
                                        disabled={loadingActions[doacao.idDoacao]?.chamar}
                                    >
                                        {loadingActions[doacao.idDoacao]?.chamar ? (
                                            <ClipLoader size={16} color="#fff" />
                                        ) : (
                                            'Chamar Coleta'
                                        )}
                                    </button>
                                    <button
                                        className="triagem-iniciar-btn"
                                        onClick={() => abrirModalConfirmacao(doacao.idDoacao)}
                                        disabled={loadingActions[doacao.idDoacao]?.iniciar}
                                    >
                                        {loadingActions[doacao.idDoacao]?.iniciar ? (
                                            <ClipLoader size={16} color="#fff" />
                                        ) : (
                                            'Iniciar Coleta'
                                        )}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {!isFirstLoad && isFetching && (
                        <div className="update-indicator">Atualizando dados...</div>
                    )}
                </>
            )}

            <DoadorDetalhesModal
                isOpen={isDoadorDetalhesModalOpen}
                onRequestClose={closeDoadorDetalhesModal}
                doador={doacaoSelecionada?.usuario || null}
            />

            <AnimatePresence>
                {isConfirmacaoModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isConfirmacaoModalOpen}
                        onRequestClose={() => setIsConfirmacaoModalOpen(false)}
                        onConfirm={() => iniciarColeta(doacaoSelecionada)}
                        isLoading={loadingActions[doacaoSelecionada?.idDoacao]?.iniciar}
                        mensagem="Você tem certeza que deseja iniciar a coleta?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Coleta;
