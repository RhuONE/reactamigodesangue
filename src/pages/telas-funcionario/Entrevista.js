import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';
import './Entrevista.css';

//Import ícone de mostrar mais 
import { BsBoxArrowUpRight } from "react-icons/bs";


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

    //Função para autenticar credenciais, caso não, redireciona para login
    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'entrevista') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

    // Função para buscar as doações para entrevista no backend
    const fetchDoacoes = () => {
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
        });
    };

    //Atualizar as doacoes na pagina
    useEffect(() => {
        fetchDoacoes();
        const interval = setInterval(() => {
            fetchDoacoes();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    //atualiza o status da doacao para chamada-entrevista
    const chamarEntrevista = (idDoacao) => {
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
        });
    };

    //função para atualizar o status da doacao para entrevista-iniciada
    const iniciarEntrevista = (idDoacao) => {
        
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
            });
        
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
                            >
                                Chamar
                            </button>
                            <button 
                                className='triagem-iniciar-btn'
                                onClick={() => abrirModalConfirmacao(doacao.idDoacao)}
                            >
                                Iniciar Entrevista
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            
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
                        mensagem="Você tem certeza que deseja iniciar a entrevista?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Entrevista;
