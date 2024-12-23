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

import { ClipLoader } from 'react-spinners';


// Redirecionar
import { useNavigate } from 'react-router-dom';


//pdf
import jsPDF from 'jspdf'; // Importação da biblioteca jsPDF
import 'jspdf-autotable'; // Opcional, para ajudar com a formatação de tabelas

const ColetasIniciadas = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    const [isFirstLoad, setIsFirstLoad] = useState(true); // Controle para carregamento inicial
    const [isFetching, setIsFetching] = useState(false); // Controle para atualizações subsequentes

    const [loadingActions, setLoadingActions] = useState({}); // Controle de carregamento individual

    const [isLoadingCancelar, setIsLoadingCancelar] = useState(false);
    const [isLoadingEncaminhar, setIsLoadingEncaminhar] = useState(false);


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



    const fetchColetasIniciadas = async () => {
        if (isFirstLoad) {
            setIsFetching(true); // Exibe o carregamento global na primeira carga
        }
    
        try {
            const response = await api.get('/doacoes/coletas-iniciadas', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { idHemocentro },
            });
            setDoacoes(response.data);
            setIsFirstLoad(false); // Desativa o carregamento inicial após a primeira execução
        } catch (error) {
            console.error('Erro ao buscar coletas iniciadas:', error);
        } finally {
            if (isFirstLoad) {
                setIsFetching(false); // Finaliza o carregamento global
            }
        }
    };
    

    useEffect(() => {
        fetchColetasIniciadas(); // Primeira carga
        const interval = setInterval(fetchColetasIniciadas, 5000); // Atualizações subsequentes
        return () => clearInterval(interval);
    }, []);
    

    const cancelarColeta = async (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [idDoacao]: true })); // Ativa o carregamento para o botão específico
        setIsLoadingCancelar(true); // Inicia o estado de carregamento

        try {
            await api.put(`/doacoes/cancelar-coleta/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsConfirmacaoCancelarOpen(false);
            setDoacaoSelecionada(null);
            fetchColetasIniciadas(); // Atualiza a lista
        } catch (error) {
            console.error('Erro ao cancelar coleta:', error);
        } finally {
            setIsLoadingCancelar(false); // Finaliza o estado de carregamento
            setLoadingActions((prev) => ({ ...prev, [idDoacao]: false })); // Desativa o carregamento
        }
    };
    

    const encaminharParaLaboratorio = async (idDoacao) => {
        setLoadingActions((prev) => ({ ...prev, [idDoacao]: true })); // Ativa o carregamento para o botão específico
        setIsLoadingEncaminhar(true); // Inicia o estado de carregamento

        try {
            await api.put(`/doacoes/encaminhar-laboratorio/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsEncaminharModalOpen(false);
            setDoacaoSelecionada(null);
            fetchColetasIniciadas(); // Atualiza a lista
        } catch (error) {
            console.error('Erro ao encaminhar para laboratório:', error);
        } finally {
            setIsLoadingEncaminhar(false); // Finaliza o estado de carregamento
            setLoadingActions((prev) => ({ ...prev, [idDoacao]: false })); // Desativa o carregamento
        }
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
    
        const dataCompleta = doacao.coleta.dataHoraColeta;
    
        // Criar um objeto Date a partir da string
        const data = new Date(dataCompleta);
    
        // Extrair a parte da data (YYYY-MM-DD)
        const somenteData = data.toISOString().split('T')[0];
    
        // Extrair a parte da hora (HH:mm:ss)
        const somenteHora = data.toTimeString().split(' ')[0];
    
        // Título
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("DECLARAÇÃO DE DOAÇÃO DE SANGUE", 105, 20, { align: "center" });
    
        // Texto principal
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const texto = `
    Declaramos para os devidos fins e com agradecimentos que o(a) Sr(a) 
    ${doacao.usuario.nomeUsuario}, inscrito(a) no CPF sob o nº ${doacao.usuario.cpfUsuario}, 
    doou sangue voluntariamente ao(a) ${doacao.hemocentro.nomeHemocentro}, às ${somenteHora} 
    do dia ${somenteData}.
        `;
    
        // Ajuste de alinhamento e largura
        doc.text(texto, 20, 40, {
            maxWidth: 170,
            align: "justify",
        });
    
        // Informações adicionais
        doc.setFontSize(12);
        doc.text("CID Z52.0", 20, 90);
        doc.text(
            `${doacao.hemocentro.cidadeHemocentro} - ${doacao.hemocentro.estadoHemocentro}, ${somenteData}, ${somenteHora}`,
            20,
            100
        );
    
        // Assinatura
        doc.setFontSize(12);
        doc.text("(assinatura)", 20, 130);
    
        // Nome e endereço da instituição
        doc.text(
            `Nome da instituição: ${doacao.hemocentro.nomeHemocentro}`,
            20,
            150
        );
        doc.text(
            `Endereço: ${doacao.hemocentro.logHemocentro} ${doacao.hemocentro.numLogHemocentro}`,
            20,
            160
        );
    
        // Salvar PDF
        doc.save(`declaracao_doacao_${doacao.usuario.nomeUsuario}.pdf`);
    };
    

    return (
        <div className="entrevistasIniciadas-container">
            <h1 className="entrevistasIniciadas-title">Coletas Iniciadas</h1>

            {isFirstLoad && isFetching ? (
                <div className="loading-container">
                    <ClipLoader size={40} color="#0a93a1" />
                    <p>Carregando coletas...</p>
                </div>
            ) : (

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
                                                            disabled={loadingActions[doacao.idDoacao]} // Desativa enquanto carrega
                                                        >
                                                            {loadingActions[doacao.idDoacao] ? (
                                                                <ClipLoader size={16} color="#fff" />
                                                            ) : (
                                                                'Finalizar coleta'
                                                            )}
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
                                                            disabled={loadingActions[doacao.idDoacao]} // Desativa enquanto carrega
                                                        >
                                                            {loadingActions[doacao.idDoacao] ? (
                                                                <ClipLoader size={16} color="#fff" />
                                                            ) : (
                                                                'Cancelar coleta'
                                                            )}
                                                        </button>

                                                    </>
                                                )
                                        }
                                    
                                </div>
                                {!isFirstLoad && isFetching && (
                                    <div className="update-indicator">
                                        Atualizando dados...
                                    </div>
                                )}

                            </li>
                            
                        );
                    })}
                </ul>
            )}

            {/* Modal de Relatório de Coleta */}
            <RelatorioColetaModal
                isOpen={isRelatorioModalOpen}
                onRequestClose={closeRelatorioModal}
                onSubmitRelatorio={handleSubmitRelatorio}
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
                        onConfirm={() => cancelarColeta(doacaoSelecionada)}
                        isLoading={isLoadingCancelar} // Passa o estado de carregamento
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
                        isLoading={isLoadingEncaminhar} // Passa o estado de carregamento
                        mensagem="Finalizar coleta e encaminhar para o laboratório?"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ColetasIniciadas;
