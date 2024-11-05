import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RelatorioColetaModal from '../../components/telas-funcionario/RelatorioColetaModal';
import './ColetasIniciadas.css';

const ColetasIniciadas = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

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
        if (window.confirm("Você tem certeza que deseja cancelar esta coleta?")) {
            api.put(`/doacoes/cancelar-coleta/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                fetchColetasIniciadas();
                alert('Coleta cancelada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao cancelar coleta:', error);
            });
        }
    };

    const encaminharParaLaboratorio = (idDoacao) => {
        api.put(`/doacoes/encaminhar-laboratorio/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            fetchColetasIniciadas();
            alert('Doação encaminhada para o laboratório com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao encaminhar para laboratório:', error);
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
            alert('Relatório de coleta salvo com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao salvar relatório de coleta:', error);
            alert('Erro ao salvar o relatório de coleta');
        });
    };

    return (
        <div className="coletasIniciadas-container">
            <h1 className="coletasIniciadas-title">Coletas Iniciadas</h1>
            <ul className="coletasIniciadas-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="coletasIniciadas-item">
                        <span className="coletasIniciadas-senha">
                            {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                        </span>
                        <span className="coletasIniciadas-doador">
                            Doador: {doacao.usuario.nomeUsuario || "Nome do doador não disponível"}
                        </span>
                        <div className="coletasIniciadas-acoes">
                            {doacao.idColeta ? (
                                <>
                                    <button 
                                        onClick={() => encaminharParaLaboratorio(doacao.idDoacao)} 
                                        className="coletasIniciadas-btnLaboratorio"
                                    >
                                        Encaminhar para Laboratório
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => openRelatorioModal(doacao)} 
                                        className="coletasIniciadas-btnRelatorio"
                                    >
                                        Criar Relatório
                                    </button>
                                    <button 
                                        onClick={() => cancelarColeta(doacao.idDoacao)} 
                                        className="coletasIniciadas-btnCancelar"
                                    >
                                        Cancelar Coleta
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal de Relatório de Coleta */}
            <RelatorioColetaModal
                isOpen={isRelatorioModalOpen}
                onRequestClose={closeRelatorioModal}
                onSubmitRelatorio={handleSubmitRelatorio}
            />
        </div>
    );
};

export default ColetasIniciadas;
