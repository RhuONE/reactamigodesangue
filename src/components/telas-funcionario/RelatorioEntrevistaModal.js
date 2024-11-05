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
    const [aptoParaDoacao, setAptoParaDoacao] = useState('Não');
    const [votoAutoExclusao, setVotoAutoExclusao] = useState(false);

    const handleSalvarRelatorio = () => {
        const relatorio = {
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
            aptoParaDoacao: aptoParaDoacao === 'Sim',
            votoAutoExclusao,
        };
        onSubmitRelatorio(relatorio);
    };

    if (!isOpen) return null;

    return (
        <div className="entrevista-modal-overlay">
            <div className="entrevista-modal">
                <h2>Relatório de Entrevista</h2>
                
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={historicoDoencaInfecciosa}
                            onChange={(e) => setHistoricoDoencaInfecciosa(e.target.checked)}
                        />
                        Histórico de Doença Infecciosa
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={usoMedicamentosRecente}
                            onChange={(e) => setUsoMedicamentosRecente(e.target.checked)}
                        />
                        Uso de Medicamentos Recente
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={cirurgiasRecentes}
                            onChange={(e) => setCirurgiasRecentes(e.target.checked)}
                        />
                        Cirurgias Recentes
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={tatuagemOuPiercingRecente}
                            onChange={(e) => setTatuagemOuPiercingRecente(e.target.checked)}
                        />
                        Tatuagem ou Piercing Recente
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={relacoesSexuaisDeRisco}
                            onChange={(e) => setRelacoesSexuaisDeRisco(e.target.checked)}
                        />
                        Relações Sexuais de Risco
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={viagemRecentePaisRisco}
                            onChange={(e) => setViagemRecentePaisRisco(e.target.checked)}
                        />
                        Viagem Recente a Países de Risco
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={historicoCancer}
                            onChange={(e) => setHistoricoCancer(e.target.checked)}
                        />
                        Histórico de Câncer
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={gravidezOuAmamentacao}
                            onChange={(e) => setGravidezOuAmamentacao(e.target.checked)}
                        />
                        Gravidez ou Amamentação
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={usoAlcoolicoRecentemente}
                            onChange={(e) => setUsoAlcoolicoRecentemente(e.target.checked)}
                        />
                        Uso Alcoólico Recentemente
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={usoDrogas}
                            onChange={(e) => setUsoDrogas(e.target.checked)}
                        />
                        Uso de Drogas
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={votoAutoExclusao}
                            onChange={(e) => setVotoAutoExclusao(e.target.checked)}
                        />
                        Voto de Autoexclusão
                    </label>
                </div>

                <label>Observações da Entrevista:</label>
                <textarea
                    value={observacoesEntrevista}
                    onChange={(e) => setObservacoesEntrevista(e.target.value)}
                />

                <label>Apto para Doação:</label>
                <select
                    value={aptoParaDoacao}
                    onChange={(e) => setAptoParaDoacao(e.target.value)}
                >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>

                <div className="entrevista-modal-actions">
                    <button className="btn-salvar" onClick={handleSalvarRelatorio}>
                        Salvar Relatório
                    </button>
                    <button className="btn-cancelar" onClick={onRequestClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RelatorioEntrevistaModal;
