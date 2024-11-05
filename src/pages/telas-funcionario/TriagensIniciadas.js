import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RelatorioTriagemModal from '../../components/telas-funcionario/RelatorioTriagemModal';
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';
import './TriagensIniciadas.css';

const TriagensIniciadas = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    const fetchDoacoes = () => {
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
        });
    };

    useEffect(() => {
        fetchDoacoes();
    }, []);

    const openRelatorioModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsRelatorioModalOpen(true);
    };

    const closeRelatorioModal = () => {
        setIsRelatorioModalOpen(false);
        setDoacaoSelecionada(null);
    };

    const openDoadorDetalhesModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsDoadorDetalhesModalOpen(true);
    };

    const closeDoadorDetalhesModal = () => {
        setIsDoadorDetalhesModalOpen(false);
        setDoacaoSelecionada(null);
    };

    const handleSubmitRelatorio = (relatorio) => {
        const payload = {
            ...relatorio,
            idDoacao: doacaoSelecionada.idDoacao,
            idUsuario: doacaoSelecionada.usuario.idUsuario
        };

        api.post('/triagens', payload, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            fetchDoacoes();
            closeRelatorioModal();
            alert('Relatório de triagem salvo com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao salvar relatório de triagem:', error);
            alert('Erro ao salvar o relatório de triagem');
        });
    };

    const cancelarTriagem = (idDoacao) => {
        const confirmacao = window.confirm("Você tem certeza que deseja cancelar esta Triagem?");
        if (confirmacao) {
            api.put(`/doacoes/cancelar-triagem/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                fetchDoacoes();
            })
            .catch(error => {
                console.error('Erro ao cancelar a Triagem:', error);
            });
        }
    };

    const encaminharParaEntrevista = (idDoacao) => {
        api.put(`/doacoes/encaminhar-entrevista/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            fetchDoacoes();
            alert('Doação encaminhada para entrevista com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao encaminhar para entrevista:', error);
            alert('Erro ao encaminhar para entrevista');
        });
    };

    return (
        <div className="triagensIniciadas-container">
            <h1 className="triagensIniciadas-title">Triagens Iniciadas</h1>
            <ul className="triagensIniciadas-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="triagensIniciadas-item">
                        <div className="triagensIniciadas-senhaInfo">
                            <span className="triagensIniciadas-senhaNumero">
                                {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                            </span>
                            {doacao.usuario && (
                                <span className="triagensIniciadas-doadorNome">
                                    <strong>Nome do Doador:</strong> {doacao.usuario.nomeUsuario}
                                </span>
                            )}
                        </div>
                        <div className="triagensIniciadas-acoes">
                            <span className="triagensIniciadas-statusSenha">
                                <strong>Status:</strong> {doacao.statusDoacao}
                            </span>
                            <button
                                className="triagensIniciadas-btnDetalhes"
                                onClick={() => openDoadorDetalhesModal(doacao)}
                            >
                                Ver Dados do Doador
                            </button>
                            {doacao.statusDoacao === "triagem-iniciada" && (
                                <>
                                    {doacao.idTriagem ? (
                                        <button
                                            className="triagensIniciadas-btnEntrevista"
                                            onClick={() => encaminharParaEntrevista(doacao.idDoacao)}
                                        >
                                            Encaminhar para Entrevista
                                        </button>
                                    ) : (
                                        <button
                                            className="triagensIniciadas-btnRelatorio"
                                            onClick={() => openRelatorioModal(doacao)}
                                        >
                                            Gerar Relatório
                                        </button>
                                    )}
                                    <button
                                        className="triagensIniciadas-btnCancelar"
                                        onClick={() => cancelarTriagem(doacao.idDoacao)}
                                    >
                                        Cancelar Triagem
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal de Relatório de Triagem */}
            <RelatorioTriagemModal
                isOpen={isRelatorioModalOpen}
                onRequestClose={closeRelatorioModal}
                onSubmitRelatorio={handleSubmitRelatorio}
            />

            {/* Modal de Detalhes do Doador */}
            <DoadorDetalhesModal
                isOpen={isDoadorDetalhesModalOpen}
                onRequestClose={closeDoadorDetalhesModal}
                doador={doacaoSelecionada ? doacaoSelecionada.usuario : null}
            />
        </div>
    );
};

export default TriagensIniciadas;
