import React, { useState } from 'react';
import './RelatorioTriagemModal.css';

const RelatorioTriagemModal = ({ isOpen, onRequestClose, onSubmitRelatorio }) => {
    const [observacoes, setObservacoes] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [pressaoArterial, setPressaoArterial] = useState('');
    const [frequenciaCardiaca, setFrequenciaCardiaca] = useState('');
    const [nivelHemoglobina, setNivelHemoglobina] = useState('');
    const [aptidaoParaDoar, setAptidaoParaDoar] = useState(true);
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');

    const handleSalvarRelatorio = () => {
        const relatorio = {
            observacoes,
            temperatura: parseFloat(temperatura), // Converte para número
            pressaoArterial: parseFloat(pressaoArterial), // Converte para número
            frequenciaCardiaca: parseInt(frequenciaCardiaca), // Converte para inteiro
            nivelHemoglobina: parseFloat(nivelHemoglobina), // Converte para número
            aptidaoParaDoar: aptidaoParaDoar === "true", // Converte para booleano
            peso: parseFloat(peso), // Converte para número
            altura: parseInt(altura), // Converte para inteiro
        };
        onSubmitRelatorio(relatorio);
    };

    return (
        isOpen && (
            <div className="relatorioTriagem-modal">
                <div className="relatorioTriagem-content">
                    <h2>Relatório de Triagem</h2>
                    <div>
                        <label>Observações:</label>
                        <textarea
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Temperatura (°C):</label>
                        <input
                            type="number"
                            value={temperatura}
                            onChange={(e) => setTemperatura(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Pressão Arterial:</label>
                        <input
                            type="number"
                            value={pressaoArterial}
                            onChange={(e) => setPressaoArterial(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Frequência Cardíaca (bpm):</label>
                        <input
                            type="number"
                            value={frequenciaCardiaca}
                            onChange={(e) => setFrequenciaCardiaca(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Nível de Hemoglobina:</label>
                        <input
                            type="number"
                            value={nivelHemoglobina}
                            onChange={(e) => setNivelHemoglobina(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Peso (kg):</label>
                        <input
                            type="number"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Altura (cm):</label>
                        <input
                            type="number"
                            value={altura}
                            onChange={(e) => setAltura(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Status de Aptidão:</label>
                        <select
                            value={aptidaoParaDoar}
                            onChange={(e) => setAptidaoParaDoar(e.target.value)}
                        >
                            <option value="true">Apto</option>
                            <option value="false">Inapto</option>
                        </select>
                    </div>
                    <div className="relatorioTriagem-actions">
                        <button onClick={handleSalvarRelatorio}>Salvar Relatório</button>
                        <button onClick={onRequestClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default RelatorioTriagemModal;
