import React, { useState } from 'react';
import './RelatorioEntrevistaModal.css';

const RelatorioEntrevistaModal = ({ isOpen, onRequestClose, onSubmitRelatorio }) => {
    const [historicoDoencaInfecciosa, setHistoricoDoencaInfecciosa] = useState(false);
    const [usoMedicamentosRecente, setUsoMedicamentosRecente] = useState(false);
    const [cirurgiasRecentes, setCirurgiasRecentes] = useState(false);
    const [tatuagemOuPiercingRecente, setTatuagemOuPiercingRecente] = useState(false);
    const [relacoesSexuaisDeRisco, setRelacoesSexuaisDeRisco] = useState(false);
    const [viagemRecentePaisRisco, setViagemRecentePaisRisco] = useState(false);
    const [historicoCancer, setHistoricoCancer] = useState(false);
    const [gravidezOuAmamentacao, setGravidezOuAmamentacao] = useState(false);
    const [usoAlcoolicoRecentemente, setUsoAlcoolicoRecentemente] = useState(false);
    const [usoDrogas, setUsoDrogas] = useState(false);
    const [observacoesEntrevista, setObservacoesEntrevista] = useState('');
    const [votoAutoExclusao, setVotoAutoExclusao] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleSalvarRelatorio = async () => {
        const dados = {
            historicoDoencaInfecciosa,
            usoMedicamentosRecente,
            cirurgiasRecentes,
            tatuagemOuPiercingRecente,
            relacoesSexuaisDeRisco,
            viagemRecentePaisRisco,
            historicoCancer,
            gravidezOuAmamentacao,
            usoAlcoolicoRecentemente,
            usoDrogas,
            observacoesEntrevista,
            votoAutoExclusao
        };

        try {
            // Simula a chamada de API para envio dos dados
            const response = await onSubmitRelatorio(dados);
            setFeedbackMessage(response.message || 'Relatório salvo com sucesso!');
            setTimeout(() => setFeedbackMessage(''), 3000);
            onRequestClose();
        } catch (error) {
            console.error('Erro ao salvar relatório:', error);
            setFeedbackMessage('Erro ao salvar o relatório. Tente novamente.');
        }
    };

    const handleResetForm = () => {
        setHistoricoDoencaInfecciosa(false);
        setUsoMedicamentosRecente(false);
        setCirurgiasRecentes(false);
        setTatuagemOuPiercingRecente(false);
        setRelacoesSexuaisDeRisco(false);
        setViagemRecentePaisRisco(false);
        setHistoricoCancer(false);
        setGravidezOuAmamentacao(false);
        setUsoAlcoolicoRecentemente(false);
        setUsoDrogas(false);
        setObservacoesEntrevista('');
        setVotoAutoExclusao(false);
    };

    if (!isOpen) return null;

    return (
        <div className="entrevista-modal-overlay">
            <div className="entrevista-modal">
                <h2>Relatório de Entrevista</h2>

                {/* Campos do formulário de entrevista */}
                <div className="toggle-group">
                    <div className="toggle-column">
                        <label className="toggle-switch">
                            Histórico de Doença Infecciosa
                            <input
                                type="checkbox"
                                checked={historicoDoencaInfecciosa}
                                onChange={(e) => setHistoricoDoencaInfecciosa(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Uso de Medicamentos Recente
                            <input
                                type="checkbox"
                                checked={usoMedicamentosRecente}
                                onChange={(e) => setUsoMedicamentosRecente(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Cirurgias Recentes
                            <input
                                type="checkbox"
                                checked={cirurgiasRecentes}
                                onChange={(e) => setCirurgiasRecentes(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Tatuagem ou Piercing Recente
                            <input
                                type="checkbox"
                                checked={tatuagemOuPiercingRecente}
                                onChange={(e) => setTatuagemOuPiercingRecente(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Relações Sexuais de Risco
                            <input
                                type="checkbox"
                                checked={relacoesSexuaisDeRisco}
                                onChange={(e) => setRelacoesSexuaisDeRisco(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="toggle-column">
                        <label className="toggle-switch">
                            Viagem Recente a Países de Risco
                            <input
                                type="checkbox"
                                checked={viagemRecentePaisRisco}
                                onChange={(e) => setViagemRecentePaisRisco(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Histórico de Câncer
                            <input
                                type="checkbox"
                                checked={historicoCancer}
                                onChange={(e) => setHistoricoCancer(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Gravidez ou Amamentação
                            <input
                                type="checkbox"
                                checked={gravidezOuAmamentacao}
                                onChange={(e) => setGravidezOuAmamentacao(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Uso Alcoólico Recentemente
                            <input
                                type="checkbox"
                                checked={usoAlcoolicoRecentemente}
                                onChange={(e) => setUsoAlcoolicoRecentemente(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Uso de Drogas
                            <input
                                type="checkbox"
                                checked={usoDrogas}
                                onChange={(e) => setUsoDrogas(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <label className="toggle-switch">
                            Voto de Autoexclusão
                            <input
                                type="checkbox"
                                checked={votoAutoExclusao}
                                onChange={(e) => setVotoAutoExclusao(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="observacoes-section">
                    <label>Observações da Entrevista:</label>
                    <textarea
                        value={observacoesEntrevista}
                        onChange={(e) => setObservacoesEntrevista(e.target.value)}
                        placeholder="Descreva observações relevantes"
                    />
                </div>

                <div className="entrevista-modal-actions">
                    <button className="btn-salvar" onClick={handleSalvarRelatorio}>
                        Salvar Relatório
                    </button>
                    <button className="btn-cancelar" onClick={onRequestClose}>
                        Cancelar
                    </button>
                    <button className="btn-reset" onClick={handleResetForm}>
                        Limpar Campos
                    </button>
                </div>

                {feedbackMessage && (
                    <div className="feedback-message">
                        {feedbackMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RelatorioEntrevistaModal;
