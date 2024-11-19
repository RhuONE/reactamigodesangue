import React, { useState, useEffect } from 'react';
import api from '../../services/api';

import './HistoricoExames.css';


//Modal de confirmação
import { AnimatePresence } from 'framer-motion';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';

import VisualizarExame from '../../components/telas-funcionario/VisualizarExame';

//pdf
import jsPDF from 'jspdf'; // Importação da biblioteca jsPDF
import 'jspdf-autotable'; // Opcional, para ajudar com a formatação de tabelas

const HistoricoExames = () => {

    //Estado que armazena as doacoes
    const [doacoes, setDoacoes] = useState([]);
    
    //Abrir modal de visualizar exame
    const [isVisualizarExameOpen, setIsVisualizarExameOpen] = useState(false);
    
    //Abrir modal de confirmação encaminhar
    const [isEncaminharModalOpen, setIsEncaminharModalOpen] = useState(false);
    //Abrir modal de confirmação descarte
    const [isEncaminharDescarteModalOpen, setIsEncaminharDescarteModalOpen] = useState(false);
    //Estado da doacao selecionada
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    //Recupera credenciais de aceesso
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    //Função de recuperar doacoes
    const fetchDoacoes = () => {
        api.get(`/doacoes/laboratorio-historico`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                idHemocentro,
            },
        })
        .then(response => {
            console.log('Dados de doações:', response.data); // Verifica a estrutura dos dados
            const doacoesOrdenadas = response.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            setDoacoes(doacoesOrdenadas);
        })
        .catch(error => {
            console.error('Erro ao buscar doações para triagem:', error);
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

    //Função de abrir confirmação encaminhar descarte
    const abrirModalDescarte = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsEncaminharDescarteModalOpen(true);
    }

    //Função de abrir modal exame
    const openVisualizarModal = (doacao) => {
        if (doacao) {
            setDoacaoSelecionada(doacao);
            setIsVisualizarExameOpen(true);
            console.log("Modal aberto com a doação:", doacao); // Verifique se isso aparece no console
        }
    };
    
    //Função de fechar o modal de exame
    const closeVisualizarModal = () => {
        setIsVisualizarExameOpen(false);
        setDoacaoSelecionada(null);
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


    //Função de encaminhar para estoque
    const encaminharParaEstoque = (idDoacao) => {
        api.put(`/doacoes/encaminhar-estoque/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            setIsEncaminharModalOpen(false);
            setDoacaoSelecionada(null);
            fetchDoacoes();
        })
        .catch(error => {
            console.error('Erro ao encaminhar para estoque:', error);
            setIsEncaminharModalOpen(false);
        });
    };

    const encaminharParaDescarte = (idDoacao) => {
        api.put(`/doacoes/encaminhar-descarte/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            setIsEncaminharDescarteModalOpen(false);
            setDoacaoSelecionada(null);
            fetchDoacoes();
        })
        .catch(error => {
            console.error('Erro ao encaminhar para descarte:', error);
            setIsEncaminharDescarteModalOpen(false);
        });
    };

    return (
        <div className="triagensIniciadas-container">
            <h1 className="triagensIniciadas-title">Historico Exames</h1>
            <ul className="triagensIniciadas-list">
                    {doacoes.map(doacao => {
                        const backgroundColor = 
                            doacao.exame_laboratorio?.aptoParaDoacao === '1'
                                ? '#e6ffec' // Verde claro pra apto
                                :  '#f7dfe1' //  Vermelhor claro para inpto
                        return (
                            <li key={doacao.idDoacao} className="triagensIniciadas-item" style={{ backgroundColor }}>
                                <div className="triagensIniciadas-senhaInfo">
                                    <span className="triagensIniciadas-senhaNumero">
                                        {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                                    </span>
                                </div>
                                <span  style={{color : '#969595', fontSize : '20px'}}>
                                    {doacao.exame_laboratorio?.aptoParaDoacao === '1' ? 'Aprovado' :  'Reprovado' }
                                 </span>
                                <div className="triagensIniciadas-acoes">
                                   
                                        <>
                                                {doacao.exame_laboratorio && doacao.exame_laboratorio.aptoParaDoacao === '1'? (
                                                    // Botão de encaminhar se apto para doar
                                                    <>
                                                    
                                                        <button
                                                            className="triagensIniciadas-btnRelatorio"
                                                            onClick={() => openVisualizarModal(doacao)}
                                                        >
                                                            Visualizar Exame
                                                        </button>

                                                        <button
                                                            className="triagensIniciadas-btnEntrevista"
                                                            onClick={() => abrirModalEncaminhar(doacao.idDoacao)}
                                                        >
                                                            Encaminhar para Estoque
                                                        </button>
                                
                                                    </>
                                                ) : (
                                                    // Botão de visualização do relatório se inapto
                                                    <>  

                                                        <button
                                                            className="triagensIniciadas-btnRelatorio"
                                                            onClick={() => openVisualizarModal(doacao)}
                                                        >
                                                            Visualizar Exame
                                                        </button>

                                                        <button
                                                            className="triagensIniciadas-btnCancelar"
                                                            onClick={() => abrirModalDescarte(doacao.idDoacao)}
                                                        >
                                                            Encaminhar para descarte
                                                        </button>
                                                    </>
                                                )}
                                                   
                                        </>
                                   
                                </div>

                            </li>
                        );
                    })}
            </ul>
          
        
            {/** Modal de visualizar exame */}
            <VisualizarExame
                isOpen={isVisualizarExameOpen}
                onRequestClose={closeVisualizarModal}
                doacaoSelecionada={doacaoSelecionada}
            />

            {/** Modais de confirmação */}
            <AnimatePresence>
                {isEncaminharModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isEncaminharModalOpen}
                        onRequestClose={() => setIsEncaminharModalOpen(false)}
                        onConfirm={() => encaminharParaEstoque(doacaoSelecionada)}
                        mensagem="Você tem certeza que deseja encaminhar para o estoque?"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEncaminharDescarteModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isEncaminharDescarteModalOpen} // Correção para isEncaminharDescarteModalOpen
                        onRequestClose={() => setIsEncaminharDescarteModalOpen(false)}
                        onConfirm={() => encaminharParaDescarte(doacaoSelecionada)}
                        mensagem="Você tem certeza que deseja descartar o exemplar?"
                    />
                )}
            </AnimatePresence>


        </div>
    );
};

export default HistoricoExames;
