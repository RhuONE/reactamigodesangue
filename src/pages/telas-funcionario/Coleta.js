import React, { useState, useEffect } from 'react';
import api from '../../services/api';

//estilos porém nem vou usar, pois to usando do triagem
import './Coleta.css';

//Import ícone de mostrar mais 
import { BsBoxArrowUpRight } from "react-icons/bs";

//Import detalhes doador
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';

//Modal de confirmacao de ação
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';

// Import navigate para login
import { useNavigate } from 'react-router-dom';

const Coleta = () => {

    //Estado de doacoes
    const [doacoes, setDoacoes] = useState([]);

    //Estado de detalhes do doador
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    //Modal de confirmação
    const [isConfirmacaoModalOpen, setIsConfirmacaoModalOpen] = useState(false);

    //Credenciais autenticadas
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    //Navigate para redirecionar para teça
    const navigate = useNavigate();

     //Função para autenticar credenciais, caso não, redireciona para login
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

    // Função para abrir modal de confirmação 
    const abrirModalConfirmacao = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsConfirmacaoModalOpen(true);
    }


    const fetchDoacoesColeta = () => {
        api.get('/doacoes/senhas/coleta', {
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
            console.error('Erro ao buscar doações para coleta:', error);
        });
    };

    useEffect(() => {
        fetchDoacoesColeta();
        const interval = setInterval(() => {
            fetchDoacoesColeta();
        }, 5000);
    }, []);

    const chamarColeta = (idDoacao) => {
        api.put(`/doacoes/senhas/chamar-coleta/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            fetchDoacoesColeta();
            
        })
        .catch(error => {
            console.error('Erro ao chamar coleta:', error);
        });
    };

    const iniciarColeta = (idDoacao) => {
        
            api.put(`/doacoes/senhas/iniciar-coleta/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                setIsConfirmacaoModalOpen(false);
                setDoacaoSelecionada(null);
                fetchDoacoesColeta();
                navigate('/coleta/coletas-iniciadas');
            })
            .catch(error => {
                console.error('Erro ao iniciar coleta:', error);
            });
        
    };

    return (
        <div className="triagem-container">
            <h1 className="triagem-title">Doações Aguardando Coleta</h1>
            <h2 className='triagem-subtitle'>Chame o doador ou inicie o atendimento</h2>
            <ul className="triagem-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="triagem-senha-item">
                        <span className="triagem-senha">
                            {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                        </span>
                        <span onClick={() => openDoadorDetalhesModal(doacao)} className="triagem-doador-nome">
                            Doador: {doacao.usuario.nomeUsuario || "Nome do doador não disponível"}
                            <BsBoxArrowUpRight  className='triagem-mostrar-mais-icone' size={22} style={{marginLeft: '10px'}}/>
                        </span>
                        <div className="triagem-acoes">
                            <button 
                                className="triagem-chamar-btn" 
                                onClick={() => chamarColeta(doacao.idDoacao)}
                            >
                                Chamar Coleta
                            </button>
                            <button 
                                className="triagem-iniciar-btn" 
                                onClick={() => abrirModalConfirmacao(doacao.idDoacao)}>
                                    Iniciar Coleta
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
                        onConfirm={() => iniciarColeta(doacaoSelecionada)}
                        mensagem="Você tem certeza que deseja iniciar a coleta?"
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default Coleta;
