import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// Import modal de relatorio
import RelatorioEntrevistaModal from '../../components/telas-funcionario/RelatorioEntrevistaModal';
import VisualizarEntrevista from '../../components/telas-funcionario/VisualizarEntrevista';

//Import do estilo
import './EntrevistasIniciadas.css';

// Import de detalhes do doador
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';
//Import ícone de mostrar mais
import { BsBoxArrowUpRight } from 'react-icons/bs';

// Modal de confirmação
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';

// Redirecionar
import { useNavigate } from 'react-router-dom';

//pdf
import jsPDF from 'jspdf'; // Importação da biblioteca jsPDF
import 'jspdf-autotable'; // Opcional, para ajudar com a formatação de tabelas


const EntrevistasIniciadas = () => {

    // Estado que recebe doacoes
    const [doacoes, setDoacoes] = useState([]);

    // Abrir o modal de relatorio 
    const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);

    // Estado da doacao selecionada
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    //Modais
    //Doador
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    //Confirmar cancelar
    const [isConfirmacaoCancelarOpen, setIsConfirmacaoCancelarOpen] = useState(false);
    //Confirmar encaminhar
    const [isEncaminharModalOpen, setIsEncaminharModalOpen] = useState(false);
    //Visualizar relatorio
    const [isVisualizarRelatorioOpen, setIsVisualizarRelatorioOpen] = useState(false);

    // Recupera credenciais do login
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    //Navigate para redirecionar para tela
    const navigate = useNavigate();

    //Função para autenticar credenciais, caso não, redireciona para login
    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'entrevista') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

    // Função para buscar as entrevistas
    const fetchEntrevistasIniciadas = () => {
        api.get(`/doacoes/entrevistas-iniciadas`, {
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
            console.error('Erro ao buscar entrevistas iniciadas:', error);
        });
    };

    useEffect(() => {
        fetchEntrevistasIniciadas();
    }, []);

    // Função de abrir confirmação cancelar
    const abrirModalCancelar = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsConfirmacaoCancelarOpen(true);
    }

    // Função de abrir confirmação encaminhar
    const abrirModalEncaminhar = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsEncaminharModalOpen(true);
    }

    // Função de abrir modal de relatorio
    const openRelatorioModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsRelatorioModalOpen(true);
    };

    // Função de fechar modal de relatorio
    const closeRelatorioModal = () => {
        setIsRelatorioModalOpen(false);
        setDoacaoSelecionada(null);
    };

    //Funcao abrir visualizar relatorio
    const openVisualizarRelatorioModal = (doacao) => {
        if (doacao){
            setDoacaoSelecionada(doacao);
            setIsVisualizarRelatorioOpen(true);
        }
    }
    
    //Funcao fechar visualizar relatorio
    const closeVisualizarRelatorioModal = () => {
        setIsVisualizarRelatorioOpen(false);
        setDoacaoSelecionada(null);
    }

    // Função de abrir doador
    const openDoadorDetalhesModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsDoadorDetalhesModalOpen(true);
    }

    // Função para fechar doador
    const closeDoadorDetalhesModal = () => {
        setIsDoadorDetalhesModalOpen(false);
        setDoacaoSelecionada(null);
    }

    const handleSubmitRelatorio = (relatorio) => {
        const payload = {
            ...relatorio,
            idDoacao: doacaoSelecionada.idDoacao,
            idFuncionario: localStorage.getItem('idFuncionario')
        };

        api.post('/entrevistas', payload, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            fetchEntrevistasIniciadas(); // Atualiza a lista
            closeRelatorioModal();
        })
        .catch(error => {
            console.error('Erro ao salvar relatório de entrevista:', error);
        });
    };

    //Função de cancelar entrevista
    const cancelarEntrevista = (idDoacao) => {

        api.put(`/doacoes/cancelar-entrevista/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            setIsConfirmacaoCancelarOpen(false);
            setDoacaoSelecionada(null);
            fetchEntrevistasIniciadas();
        })
        .catch(error => {
            console.error('Erro ao cancelar a Entrevista:', error);
            setIsConfirmacaoCancelarOpen(false);
        });

    }


    //Função de encaminhar para coleta
    const encaminharParaColeta = (idDoacao) => {
        api.put(`/doacoes/encaminhar-coleta/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            setIsEncaminharModalOpen(false);
            setDoacaoSelecionada(null);
            fetchEntrevistasIniciadas(); // Atualiza a lista
            
        })
        .catch(error => {
            console.error('Erro ao encaminhar para coleta:', error);
            setIsEncaminharModalOpen(false);
        });
    };

    const gerarAtestado = (doacao) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Atestado de Inaptidão para Doação', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Doador: ${doacao.usuario.nomeUsuario}`, 20, 40);
        doc.text('Motivo da Inaptidão: Resultados fora dos parâmetros', 20, 50);
        doc.text('Observações:', 20, 60);
        doc.text(doacao.entrevista.observacoes || 'Nenhuma observação', 20, 70);
        doc.save(`atestado_${doacao.usuario.nomeUsuario}.pdf`);
    };

    return (
        <div className="entrevistasIniciadas-container">
            <h1 className="entrevistasIniciadas-title">Entrevistas Iniciadas</h1>
            <ul className="entrevistasIniciadas-list">
                {doacoes.map(doacao =>  {
                    const backgroundColor =
                        doacao.entrevista?.aptoParaDoacao === '1'
                            ? '#e6ffec' // Verde claro se apto
                            : doacao.entrevista?.aptoParaDoacao === '0'
                            ? '#f7dfe1' // Vermelho claro para não apto
                            : '#eaf4fc' // Caso nada cor padrão

                    return (
                        <li key={doacao.idDoacao} className="entrevistasIniciadas-item" style={{backgroundColor}}>
                            <div className="entrevistasIniciadas-info">
                                <span className="triagensIniciadas-senhaNumero">
                                    {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                                </span>
                                {doacao.usuario && (
                                    <span onClick={() => openDoadorDetalhesModal(doacao)} className="triagensIniciadas-doadorNome">
                                    {doacao.usuario ? `Doador: ${doacao.usuario.nomeUsuario}` : "Nome do doador não disponível"}
                                    <BsBoxArrowUpRight className='triagem-mostrar-mais-icone' size={22} style={{marginLeft: '10px'}}/>
                                    </span>
                                )}
                            </div>
                            <span style={{color : '#969595', fontSize: '20px'}}>
                                {/**Espaço para colocar status (pendente, aprovado, reprovado) */}
                                {doacao.entrevista?.aptoParaDoacao === '1' ? 'Aprovado' : doacao.entrevista?.aptoParaDoacao === '0' ? 'Reprovado' : 'Pendente'}
                            </span>
                            <div className="entrevistasIniciadas-acoes">
                                {doacao.statusDoacao === "entrevista-iniciada" && (
                                    <>
                                        {doacao.idEntrevista ? (
                                            doacao.entrevista && doacao.entrevista?.aptoParaDoacao === '1' ? (
                                                // Botões se apto
                                                <>
                                                    <button
                                                        className="triagensIniciadas-btnEntrevista"
                                                        onClick={() => abrirModalEncaminhar(doacao.idDoacao)}
                                                    >
                                                        Encaminhar para Coleta
                                                    </button>
                                                    
                                                    <button
                                                        className='triagensIniciadas-btnRelatorio'
                                                        onClick={() => openVisualizarRelatorioModal(doacao)}
                                                    >
                                                        Visualizar Relatório
                                                    </button>

                                                    <button
                                                        className="triagensIniciadas-btnCancelar"
                                                        onClick={() => abrirModalCancelar(doacao.idDoacao)}
                                                        >
                                                        Cancelar Triagem
                                                    </button>
                                                </>
                                            ) : (
                                                // botões se inpto
                                                <>
                                                      <button
                                                        className="triagensIniciadas-btnAtestado"
                                                        onClick={() =>gerarAtestado(doacao)}
                                                    >
                                                        Gerar atestado
                                                    </button>              

                                                    <button
                                                        className='triagensIniciadas-btnRelatorio'
                                                        onClick={() => openVisualizarRelatorioModal(doacao)}
                                                    >
                                                        Visualizar Relatório
                                                    </button>


                                                    <button
                                                        className="triagensIniciadas-btnCancelar"
                                                        onClick={() => abrirModalCancelar(doacao.idDoacao)}
                                                        >
                                                        Finalizar Triagem
                                                    </button>
                                                </>
                                            )
                                        ) : (
                                            // Botão para quem estiver pendente
                                            <>
                                                <button
                                                    className="triagensIniciadas-btnRelatorio"
                                                    onClick={() => openRelatorioModal(doacao)}
                                                >
                                                    Gerar Relatório
                                                </button>

                                                <button
                                                    className="triagensIniciadas-btnCancelar"
                                                    onClick={() => abrirModalCancelar(doacao.idDoacao)}
                                                >
                                                    Cancelar Triagem
                                                </button>

                                                </>
                                        )}
                                        
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/** Modal de Relatorio */}
            <RelatorioEntrevistaModal
                isOpen={isRelatorioModalOpen}
                onRequestClose={closeRelatorioModal}
                onSubmitRelatorio={handleSubmitRelatorio}
            />

            {/** Visualizar relatorio */}
            <VisualizarEntrevista
                isOpen={isVisualizarRelatorioOpen}
                onRequestClose={closeVisualizarRelatorioModal}
                doacaoSelecionada={doacaoSelecionada}
            />

            {/** Modal de detalhes do doador */}
            <DoadorDetalhesModal
                isOpen={isDoadorDetalhesModalOpen}
                onRequestClose={closeDoadorDetalhesModal}
                doador={doacaoSelecionada ? doacaoSelecionada.usuario : null}
            />

            {/** Modais de confirmação */}
            <AnimatePresence>
                {isConfirmacaoCancelarOpen && (
                    <ConfirmacaoModal 
                        isOpen={isConfirmacaoCancelarOpen}
                        onRequestClose={() => setIsConfirmacaoCancelarOpen(false)}
                        onConfirm={() => cancelarEntrevista(doacaoSelecionada)}
                        mensagem="Você tem certeza que deseja cancelar a entrevista?"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEncaminharModalOpen && (
                    <ConfirmacaoModal 
                        isOpen={isEncaminharModalOpen}
                        onRequestClose={() => setIsEncaminharModalOpen(false)}
                        onConfirm={() => encaminharParaColeta(doacaoSelecionada)}
                        mensagem="Você tem certeza que deseja encaminhar para coleta?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EntrevistasIniciadas;
