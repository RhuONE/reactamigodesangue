import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';
import './Entrevista.css';

//Import ícone de mostrar mais 
import { BsBoxArrowUpRight } from "react-icons/bs";

import { ClipLoader } from 'react-spinners';


//Modal de confirmacao de ação
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

const Entrevista = () => {

    //Estado que armazena as doacoes
    const [doacoes, setDoacoes] = useState([]);

    //Estado de abertura para o modal de detalhes
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);

    //Estado que armazena a doacao selecionada
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    //Estado de abertura para modal de confirmação
    const [isConfirmacaoModalOpen, setIsConfirmacaoModalOpen] = useState(false);

    //Navigate para redirecionar para tela
    const navigate = useNavigate();

    //Recupera dados para armazenamento
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');


    const [loadingActions, setLoadingActions] = useState({}); // Carregamento individual por ação e doação
    const [isFetching, setIsFetching] = useState(false); // Estado para carregamento global da lista
    const [isFirstLoad, setIsFirstLoad] = useState(true); // Apenas para a primeira carga


    //Função para autenticar credenciais, caso não, redireciona para login
    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'entrevista') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

    // Função para buscar as doações para entrevista no backend
    const fetchDoacoes = () => {
        if (isFirstLoad) {
            setIsFetching(true); // Ativa o spinner global na primeira carga
        }
        api.get('/doacoes/senhas/entrevista', {
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
            setIsFetching(false); // Desativa o spinner após carregar
            setIsFirstLoad(false); // Finaliza o estado de primeira carga
        });
    };

    //Atualizar as doacoes na pagina
    useEffect(() => {
        fetchDoacoes();
        const interval = setInterval(() => {
            if (!isFirstLoad) {
                fetchDoacoes(); // Apenas atualizações após a primeira carga
            }
        }, 5000);
    
        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, [isFirstLoad]); // Dependência no estado de primeira carga
    
    //atualiza o status da doacao para chamada-entrevista
    const chamarEntrevista = (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [`chamar-${idDoacao}`]: true })); // Inicia o carregamento para "Chamar"


        api.put(`/doacoes/senhas/chamar-entrevista/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            fetchDoacoes();
        })
        .catch(error => {
            console.error('Erro ao chamar entrevista:', error);
        })
        .finally(() => {
            setLoadingActions((prev) => ({ ...prev, [`chamar-${idDoacao}`]: false })); // Finaliza o carregamento

        })
    };

    //função para atualizar o status da doacao para entrevista-iniciada
    const iniciarEntrevista = (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [`iniciar-${idDoacao}`]: true })); // Inicia o carregamento para "Iniciar"

        
        api.put(`/doacoes/senhas/iniciar-entevista/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                fetchDoacoes();
                setIsConfirmacaoModalOpen(false);
                navigate('/entrevista/entrevistas-iniciadas');
            })
            .catch(error => {
                console.error('Erro ao iniciar entrevista:', error);
            })
            .finally(() => {
                setLoadingActions((prev) => ({ ...prev, [`iniciar-${idDoacao}`]: false })); // Finaliza o carregamento
            })
        
    };

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

    return (
        <div className="entrevista-container">
            <h1 className="entrevista-title">Entrevista - Doações para Entrevista</h1>
            <h2 className='entrevista-subtitle'>Chame o doador ou inicie a entrevista</h2>

            {isFetching ? (
                <div className='loading-container'>
                    <ClipLoader size={40} color="#0a93a1" />
                    <p>Carregando entrevistas...</p>
                </div>
            ) : (
                <ul className="entrevista-list">
                    {doacoes.map(doacao => (
                        <li key={doacao.idDoacao} className="entrevista-item">
                            <span className="entrevista-numero">
                                {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                            </span>
                            <span onClick={() => openDoadorDetalhesModal(doacao)} className="entrevista-doador-nome">
                                {doacao.usuario ? `Doador: ${doacao.usuario.nomeUsuario}` : "Nome do doador não disponível"}
                                <BsBoxArrowUpRight className='triagem-mostrar-mais-icone' size={22} style={{marginLeft: '10px'}} />
                            </span>
                            <div>
                            <button 
                                className='triagem-chamar-btn'
                                onClick={() => chamarEntrevista(doacao.idDoacao)}
                                disabled={loadingActions[`chamar-${doacao.idDoacao}`]} // Desativa o botão enquanto carrega
                            >
                                {loadingActions[`chamar-${doacao.idDoacao}`] ? (
                                    <ClipLoader size={16} color="#fff" />
                                ) : (
                                    'Chamar'
                                )}
                            </button>
                            <button 
                                className='triagem-iniciar-btn'
                                onClick={() => abrirModalConfirmacao(doacao.idDoacao)}
                                disabled={loadingActions[`iniciar-${doacao.idDoacao}`]} // Desativa o botão enquanto carrega
                            >
                                {loadingActions[`iniciar-${doacao.idDoacao}`] ? (
                                    <ClipLoader size={16} color="#fff" />
                                ) : (
                                    'Iniciar Entrevista'
                                )}
                            </button>

                            </div>
                        </li>
                    ))}
                </ul>
            )}
            
            {/** Modal de Detalhes do Doador */}
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
                        onConfirm={() => iniciarEntrevista(doacaoSelecionada)}
                        isLoading={loadingActions[`iniciar-${doacaoSelecionada}`]} // Passa o estado de carregamento do botão "Iniciar"
                        mensagem="Você tem certeza que deseja iniciar a entrevista?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Entrevista;
