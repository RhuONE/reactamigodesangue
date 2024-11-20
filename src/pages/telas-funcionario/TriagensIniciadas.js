import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RelatorioTriagemModal from '../../components/telas-funcionario/RelatorioTriagemModal';
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';
import './TriagensIniciadas.css';

//Import ícone de mostrar mais 
import { BsBoxArrowUpRight } from "react-icons/bs";

//Modal de confirmação
import { AnimatePresence } from 'framer-motion';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import VisualizarTriagemModal from '../../components/telas-funcionario/VisualizarTriagemModal';

//pdf
import jsPDF from 'jspdf'; // Importação da biblioteca jsPDF
import 'jspdf-autotable'; // Opcional, para ajudar com a formatação de tabelas

import { ClipLoader } from 'react-spinners';


const TriagensIniciadas = () => {

    //Estado que armazena as doacoes
    const [doacoes, setDoacoes] = useState([]);
    //Abrir modal de relatorio cadastro
    const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);
    //Abrir modal de visualizar relatorio
    const [isVisualizarRelatorioOpen, setIsVisualizarRelatorioOpen] = useState(false);
    //Abrir modal de dados do doador
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    //Abrir modal de confirmação encaminhar
    const [isEncaminharModalOpen, setIsEncaminharModalOpen] = useState(false);
    //Abrir modal de confirmação cancelar
    const [isCancelarModalOpen, setIsCancelarModalOpen] = useState(false);
    //Estado da doacao selecionada
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    //Recupera credenciais de acesso
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    //Estados de carregamento
    const [isFirstLoad, setIsFirstLoad] = useState(true); // Para exibir um loader na primeira carga
    const [isFetching, setIsFetching] = useState(false); // Para exibir carregamento durante as atualizações periódicas
    const [loadingActions, setLoadingActions] = useState({}); // Para controlar o carregamento individual dos botões
    const [isEncaminharLoading, setIsEncaminharLoading] = useState(false); // Carregamento do modal de encaminhar
    const [isCancelarLoading, setIsCancelarLoading] = useState(false); // Carregamento do modal de cancelar
    

    //Função de recuperar doacoes
    const fetchDoacoes = () => {
        setIsFetching(true); // Indica que os dados estão sendo carregados
        api.get(`/doacoes/triagens-iniciadas`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                idHemocentro,
            },
        })
        .then(response => {
            const doacoesOrdenadas = response.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            setDoacoes(doacoesOrdenadas);
        })
        .catch(error => {
            console.error('Erro ao buscar doações para triagem:', error);
        })
        .finally(() => {
            setIsFetching(false); // Finaliza o carregamento
            setIsFirstLoad(false); // Define que a primeira carga foi concluída
        });
    };
    

    useEffect(() => {
        fetchDoacoes();
    }, []);

    //Função de abrir confirmação encaminhar
    const abrirModalEncaminhar = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsEncaminharModalOpen(true);
    }

    //Função de abrir confirmação cancelar
    const abrirModalCancelar = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsCancelarModalOpen(true);
    }

    //Função de abrir relatorio
    const openRelatorioModal = (doacao) => {
        if (doacao){
            setDoacaoSelecionada(doacao);
            setIsRelatorioModalOpen(true);
        }
    };

    //Função de fechar relatorio
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

    //Função de abrir doador
    const openDoadorDetalhesModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsDoadorDetalhesModalOpen(true);
    };

    //Função de fechar doador
    const closeDoadorDetalhesModal = () => {
        setIsDoadorDetalhesModalOpen(false);
        setDoacaoSelecionada(null);
    };

    //Função de registar relatorio
    const handleSubmitRelatorio = (relatorio) => {

            fetchDoacoes();
         
    };

    const gerarAtestado = (doacao) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Atestado de Inaptidão para Doação', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Doador: ${doacao.usuario.nomeUsuario}`, 20, 40);
        doc.text('Motivo da Inaptidão: Resultados fora dos parâmetros', 20, 50);
        doc.text('Observações:', 20, 60);
        doc.text(doacao.triagem.observacoes || 'Nenhuma observação', 20, 70);
        doc.save(`atestado_${doacao.usuario.nomeUsuario}.pdf`);
    };

    //Função de cancelar triagem
    const cancelarTriagem = (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [`cancel-${idDoacao}`]: true })); // Identificador único para cancelar
        setIsCancelarLoading(true); // Ativa o loader do modal de cancelar
    
        api.put(`/doacoes/cancelar-triagem/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            setIsCancelarModalOpen(false); // Fecha o modal
            fetchDoacoes(); // Atualiza a lista
        })
        .catch(error => {
            console.error('Erro ao cancelar a triagem:', error);
        })
        .finally(() => {
            setLoadingActions((prev) => ({ ...prev, [`cancel-${idDoacao}`]: false })); // Desativa o loader
            setIsCancelarLoading(false); // Ativa o loader do modal de cancelar
        });
    };
    

    //Função de encaminhar para entrevista
    const encaminharParaEntrevista = (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [`encaminhar-${idDoacao}`]: true })); // Identificador único para encaminhar
        setIsEncaminharLoading(true); // Ativa o loader do modal de encaminhar
    
        api.put(`/doacoes/encaminhar-entrevista/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            setIsEncaminharModalOpen(false); // Fecha o modal
            fetchDoacoes(); // Atualiza a lista
        })
        .catch(error => {
            console.error('Erro ao encaminhar para entrevista:', error);
        })
        .finally(() => {
            setLoadingActions((prev) => ({ ...prev, [`encaminhar-${idDoacao}`]: false })); // Desativa o loader
            setIsEncaminharLoading(false); // Ativa o loader do modal de encaminhar
        });
    };
    

    return (
        <div className="triagensIniciadas-container">
            <h1 className="triagensIniciadas-title">Triagens Iniciadas</h1>

            {isFirstLoad ? (
                <div className='loading-container'>
                <ClipLoader size={40} color='#0a93a1' />
                <p>Carregando triagens...</p>
            </div>
            ) : (

                <ul className="triagensIniciadas-list">
                        {doacoes.map(doacao => {
                            const backgroundColor = 
                                doacao.triagem?.aptidaoParaDoar === '1'
                                    ? '#e6ffec' // Verde claro pra apto
                                    : doacao.triagem?.aptidaoParaDoar === '0'
                                    ? '#f7dfe1' //  Vermelhor claro para inpto
                                    : '#eaf4fc'
                            return (
                                <li key={doacao.idDoacao} className="triagensIniciadas-item" style={{ backgroundColor }}>
                                    <div className="triagensIniciadas-senhaInfo">
                                        <span className="triagensIniciadas-senhaNumero">
                                            {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                                        </span>
                                        {doacao.usuario && (
                                            <span onClick={() => openDoadorDetalhesModal(doacao)} className="triagensIniciadas-doadorNome">
                                            {doacao.usuario ? `Doador: ${doacao.usuario.nomeUsuario}` : "Nome do doador não disponível"}
                                            <BsBoxArrowUpRight  className='triagem-mostrar-mais-icone' size={22} style={{marginLeft: '10px'}}/>
                                        </span>
                                        )}
                                    </div>
                                    <span  style={{color : '#969595', fontSize : '20px'}}>
                                        {doacao.triagem ?.aptidaoParaDoar === '1' ? 'Aprovado' : doacao.triagem?.aptidaoParaDoar === '0' ? 'Reprovado' : 'Pendente'}
                                    </span>
                                    <div className="triagensIniciadas-acoes">
                                        {doacao.statusDoacao === "triagem-iniciada" && (
                                            <>
                                                {doacao.idTriagem ? (
                                                    doacao.triagem && doacao.triagem.aptidaoParaDoar === '1'? (
                                                        // Botão de encaminhar se apto para doar
                                                        <>
                                                        
                                                        <button
                                                            className="triagensIniciadas-btnEntrevista"
                                                            onClick={() => abrirModalEncaminhar(doacao.idDoacao)}
                                                            disabled={loadingActions[`encaminhar-${doacao.idDoacao}`]} // Verifica o estado de carregamento para encaminhar
                                                        >
                                                            {loadingActions[`encaminhar-${doacao.idDoacao}`] ? (
                                                                <ClipLoader size={16} color="#fff" />
                                                            ) : (
                                                                'Encaminhar para Entrevista'
                                                            )}
                                                        </button>


                                                        <button
                                                            className="triagensIniciadas-btnRelatorio"
                                                            onClick={() => openVisualizarRelatorioModal(doacao)}
                                                        >
                                                            Visualizar Relatório
                                                        </button>

                                                        <button
                                                            className="triagensIniciadas-btnCancelar"
                                                            onClick={() => abrirModalCancelar(doacao.idDoacao)}
                                                            disabled={loadingActions[`cancel-${doacao.idDoacao}`]} // Verifica o estado de carregamento para cancelar
                                                        >
                                                            {loadingActions[`cancel-${doacao.idDoacao}`] ? (
                                                                <ClipLoader size={16} color="#fff" />
                                                            ) : (
                                                                'Cancelar Triagem'
                                                            )}
                                                        </button>
                                                        </>
                                                    ) : (
                                                        // Botão de visualização do relatório se inapto ou triagem não encontrada
                                                        <>  

                                                            {/* <button
                                                                className="triagensIniciadas-btnAtestado"
                                                                onClick={() => gerarAtestado(doacao)}
                                                            >
                                                                Gerar Atestado
                                                            </button> */}

                                                            <button
                                                                className="triagensIniciadas-btnRelatorio"
                                                                onClick={() => openVisualizarRelatorioModal(doacao)}
                                                            >
                                                                Visualizar Relatório
                                                            </button>

                                                            <button
                                                                className="triagensIniciadas-btnCancelar"
                                                                onClick={() => abrirModalCancelar(doacao.idDoacao)}
                                                                disabled={loadingActions[`cancel-${doacao.idDoacao}`]} // Verifica o estado de carregamento para cancelar
                                                            >
                                                                {loadingActions[`cancel-${doacao.idDoacao}`] ? (
                                                                    <ClipLoader size={16} color="#fff" />
                                                                ) : (
                                                                    'Finalizar Triagem'
                                                                )}
                                                            </button>
                                                        </>
                                                    )
                                                ) : (
                                                    // Botão para gerar o relatório se ainda não tiver sido feito
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
                                                        disabled={loadingActions[`cancel-${doacao.idDoacao}`]} // Verifica o estado de carregamento para cancelar
                                                    >
                                                        {loadingActions[`cancel-${doacao.idDoacao}`] ? (
                                                            <ClipLoader size={16} color="#fff" />
                                                        ) : (
                                                            'Cancelar Triagem'
                                                        )}
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
            )}

            {/* Modal de Relatório de Triagem */}
            <RelatorioTriagemModal
                isOpen={isRelatorioModalOpen}
                onRequestClose={closeRelatorioModal}
                onSubmitRelatorio={handleSubmitRelatorio}
                doacaoSelecionada={doacaoSelecionada}
            />

            {/* Modal de Detalhes do Doador */}
            <DoadorDetalhesModal
                isOpen={isDoadorDetalhesModalOpen}
                onRequestClose={closeDoadorDetalhesModal}
                doador={doacaoSelecionada ? doacaoSelecionada.usuario : null}
            />

            {/** Modal de visualizar relatório de triagem */}
            <VisualizarTriagemModal
                isOpen={isVisualizarRelatorioOpen}
                onRequestClose={closeVisualizarRelatorioModal}
                doacaoSelecionada={doacaoSelecionada}
            />

            {/** Modais de confirmação */}
            <AnimatePresence>
                {isEncaminharModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isEncaminharModalOpen}
                        onRequestClose={() => setIsEncaminharModalOpen(false)}
                        onConfirm={() => encaminharParaEntrevista(doacaoSelecionada)}
                        isLoading={isEncaminharLoading} // Passa o estado de carregamento
                        mensagem="Você tem certeza que deseja encaminhar para entrevista?"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCancelarModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isCancelarModalOpen}
                        onRequestClose={() => setIsCancelarModalOpen(false)}
                        onConfirm={() => cancelarTriagem(doacaoSelecionada)}
                        isLoading={isCancelarLoading} // Passa o estado de carregamento
                        mensagem="Você tem certeza que deseja cancelar a triagem?"
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default TriagensIniciadas;
