import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RelatorioEntrevistaModal from '../../components/telas-funcionario/RelatorioEntrevistaModal';
import './EntrevistasIniciadas.css';

const EntrevistasIniciadas = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

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
            idDoacao: doacaoSelecionada.idDoacao,
            idFuncionario: localStorage.getItem('idFuncionario')
        };

        api.post('/entrevistas', payload, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            fetchEntrevistasIniciadas(); // Atualiza a lista
            closeRelatorioModal();
            alert('Relatório de entrevista salvo com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao salvar relatório de entrevista:', error);
            alert('Erro ao salvar o relatório de entrevista');
        });
    };

    const encaminharParaColeta = (idDoacao) => {
        api.put(`/doacoes/encaminhar-coleta/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            fetchEntrevistasIniciadas(); // Atualiza a lista
            alert('Doação encaminhada para coleta com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao encaminhar para coleta:', error);
        });
    };

    return (
        <div className="entrevistasIniciadas-container">
            <h1 className="entrevistasIniciadas-title">Entrevistas Iniciadas</h1>
            <ul className="entrevistasIniciadas-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="entrevistasIniciadas-item">
                        <div className="entrevistasIniciadas-info">
                            <span className="entrevistasIniciadas-senhaNumero">
                                {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                            </span>
                            {doacao.usuario && (
                                <span className="entrevistasIniciadas-doadorNome">
                                    <strong>Doador:</strong> {doacao.usuario.nomeUsuario}
                                </span>
                            )}
                        </div>
                        <div className="entrevistasIniciadas-acoes">
                            {doacao.statusDoacao === "entrevista-iniciada" && (
                                <>
                                    {!doacao.idEntrevista ? (
                                        <button
                                            className="entrevistasIniciadas-btnRelatorio"
                                            onClick={() => openRelatorioModal(doacao)}
                                        >
                                            Criar Relatório
                                        </button>
                                    ) : (
                                        <button
                                            className="entrevistasIniciadas-btnColeta"
                                            onClick={() => encaminharParaColeta(doacao.idDoacao)}
                                        >
                                            Encaminhar para Coleta
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            <RelatorioEntrevistaModal
                isOpen={isRelatorioModalOpen}
                onRequestClose={closeRelatorioModal}
                onSubmitRelatorio={handleSubmitRelatorio}
            />
        </div>
    );
};

export default EntrevistasIniciadas;
