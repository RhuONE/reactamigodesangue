import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RelatorioColetaModal from '../../components/telas-funcionario/RelatorioColetaModal';
import './ColetasIniciadas.css';

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

const ColetasIniciadas = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    //Credenciais
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');
    //Redireicionar
    const navigate = useNavigate();
    //Função para autenticar credenciais, caso não, redireciona para login
    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'coleta') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

    //Exibir dados do doador
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
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

    //Confirmar cancelar
    const [isConfirmacaoCancelarOpen, setIsConfirmacaoCancelarOpen] = useState(false);
    //Confirmar encaminhar
    const [isEncaminharModalOpen, setIsEncaminharModalOpen] = useState(false);
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



    const fetchColetasIniciadas = () => {
        api.get('/doacoes/coletas-iniciadas', {
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
            console.error('Erro ao buscar coletas iniciadas:', error);
        });
    };

    useEffect(() => {
        fetchColetasIniciadas();
    }, []);

    const cancelarColeta = (idDoacao) => {
            api.put(`/doacoes/cancelar-coleta/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                setIsConfirmacaoCancelarOpen(false);
                setDoacaoSelecionada(null);
                fetchColetasIniciadas();
            })
            .catch(error => {
                console.error('Erro ao cancelar coleta:', error);
                setIsConfirmacaoCancelarOpen(false);
            });
        
    };

    const encaminharParaLaboratorio = (idDoacao) => {
        api.put(`/doacoes/encaminhar-laboratorio/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            setIsEncaminharModalOpen(false);
            setDoacaoSelecionada(null);
            fetchColetasIniciadas();
        })
        .catch(error => {
            console.error('Erro ao encaminhar para laboratório:', error);
            setIsEncaminharModalOpen(false);
        });
    };

    const openRelatorioModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsRelatorioModalOpen(true);
    };

    const closeRelatorioModal = () => {
        setIsRelatorioModalOpen(false);
        setDoacaoSelecionada(null);
    };

    const handleSubmitRelatorio = (relatorio) => {
        const payload = {
            ...relatorio,
            idFuncionario: doacaoSelecionada.idFuncionario, // Ajustar conforme necessário
            idDoacao: doacaoSelecionada.idDoacao,
        };

        api.post('/coletas', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            fetchColetasIniciadas();
            closeRelatorioModal();
        })
        .catch(error => {
            console.error('Erro ao salvar relatório de coleta:', error);
        });
    };

    const gerarAtestado = (doacao) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Atestado de  Doação', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Doador: ${doacao.usuario.nomeUsuario}`, 20, 40);
        doc.text(`Doação concluída com sucesso: coletado ${doacao.coleta.quantidadeMl}`, 20, 50);
        // doc.text('Observações:', 20, 60);
        // doc.text(doacao.entrevista.observacoes || 'Nenhuma observação', 20, 70);
        doc.save(`atestado_${doacao.usuario.nomeUsuario}.pdf`);
    };


    return (
        <div className="entrevistasIniciadas-container">
            <h1 className="entrevistasIniciadas-title">Coletas Iniciadas</h1>
            <ul className="entrevistasIniciadas-list">
                {doacoes.map(doacao =>  {
                    const backgroundColor =
                        doacao.coleta? 
                             '#e6ffec' // Verde claro se apto
                            :  '#eaf4fc' // Caso nada cor padrão

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
                                {doacao.coleta? 'Coletada' : 'Pendente'}
                            </span>
                            <div className="entrevistasIniciadas-acoes">
                                
                                        {doacao.idColeta ? (

                                                <>

                                                    <button
                                                            className='triagensIniciadas-btnAtestado'
                                                            onClick={() => gerarAtestado(doacao)}
                                                        >
                                                            Gerar atestado
                                                    </button>

                                                    <button
                                                        className="triagensIniciadas-btnEntrevista"
                                                        onClick={() => abrirModalEncaminhar(doacao.idDoacao)}
                                                    >
                                                        Finalizar coleta
                                                    </button>
                                                    
                                                    {/* <button
                                                        className="triagensIniciadas-btnCancelar"
                                                        onClick={() => abrirModalCancelar(doacao.idDoacao)}
                                                        >
                                                        Cancelar Triagem
                                                    </button> */}
                                                </>
                                            ) : (
                                                // botões se pendente
                                                <>           

                                                    <button
                                                        className='triagensIniciadas-btnRelatorio'
                                                        onClick={() => openRelatorioModal(doacao)}
                                                    >
                                                        Gerar coleta
                                                    </button>


                                                    <button
                                                        className="triagensIniciadas-btnCancelar"
                                                        onClick={() => abrirModalCancelar(doacao.idDoacao)}
                                                        >
                                                        Cancelar coleta
                                                    </button>
                                                </>
                                            )
                                       }
                                  
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Modal de Relatório de Coleta */}
            <RelatorioColetaModal
                isOpen={isRelatorioModalOpen}
                onRequestClose={closeRelatorioModal}
                onSubmitRelatorio={handleSubmitRelatorio}
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
                        onConfirm={() => cancelarColeta(doacaoSelecionada)}
                        mensagem="Você tem certeza que deseja cancelar a coleta?"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEncaminharModalOpen && (
                    <ConfirmacaoModal 
                        isOpen={isEncaminharModalOpen}
                        onRequestClose={() => setIsEncaminharModalOpen(false)}
                        onConfirm={() => encaminharParaLaboratorio(doacaoSelecionada)}
                        mensagem="Finalizar coleta e encaminhar para o laboratório?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ColetasIniciadas;
