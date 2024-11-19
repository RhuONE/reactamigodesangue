import React, { useState } from 'react';
import './RelatorioTriagemModal.css';
import { AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import { FaExclamationCircle } from 'react-icons/fa';
import api from '../../services/api';

const RelatorioTriagemModal = ({ isOpen, onRequestClose, onSubmitRelatorio, doacaoSelecionada }) => {
    const [observacoes, setObservacoes] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [pressaoArterial, setPressaoArterial] = useState('');
    const [frequenciaCardiaca, setFrequenciaCardiaca] = useState('');
    const [nivelHemoglobina, setNivelHemoglobina] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');

    const token = localStorage.getItem('token');

    const [feedbackMessage, setFeedbackMessage] = useState('');

    const [erros, setErros] = useState({
        temperatura: '',
        pressaoArterial: '',
        frequenciaCardiaca: '',
        nivelHemoglobina: '',
        peso: '',
        altura: '',
    });
    
    const validarTemperatura = (valor) => {
        if (valor < 35 || valor > 42) {
            return 'Temperatura fora do intervalo normal (35-42°C)';
        }
        return '';
    };
    
    const validarPressaoArterial = (valor) => {
        const regex = /^\d{2,3}\/\d{2,3}$/; // Formato esperado: 120/80
        if (!regex.test(valor)) {
            return 'Insira a pressão no formato correto (ex.: 120/80)';
        }
        return '';
    };
    
    const validarFrequenciaCardiaca = (valor) => {
        if (valor < 40 || valor > 200) {
            return 'Frequência cardíaca fora do intervalo normal (40-200 bpm)';
        }
        return '';
    };
    
    const validarPeso = (valor) => {
        if (valor <= 0) {
            return 'Peso deve ser maior que 0';
        }
        return '';
    };
    
    const validarAltura = (valor) => {
        if (valor < 50 || valor > 250) {
            return 'Altura fora do intervalo realista (50-250 cm)';
        }
        return '';
    };
    
    const handleTemperaturaChange = (e) => {
        const valor = e.target.value;
        setTemperatura(valor);
        setErros({ ...erros, temperatura: validarTemperatura(valor) });
    };
    
    const handlePressaoArterialChange = (e) => {
        const valor = e.target.value;
        setPressaoArterial(valor);
        setErros({ ...erros, pressaoArterial: validarPressaoArterial(valor) });
    };

    const handleFrequenciaCardiacaChange = (e) => {
        const valor = e.target.value;
        setFrequenciaCardiaca(valor);
        setErros({ ...erros, frequenciaCardiaca: validarFrequenciaCardiaca(valor)});
    }

    const handlePesoChange = (e) => {
        const valor = e.target.value;
        setPeso(valor);
        setErros({ ...erros, peso: validarPeso(valor)});
    }

    const handleAlturaChange = (e) => {
        const valor = e.target.value;
        setAltura(valor);
        setErros({ ...erros, altura: validarAltura(valor)});
    }

    const handleFocus = (campo) => {
        setErros({ ...erros, [campo]: ''}); // Limpa o erro ao focar no campo
    }

    const handleSalvarRelatorio = async () => {

        if (!doacaoSelecionada || !doacaoSelecionada.idDoacao) {
            setFeedbackMessage('Erro: Nenhuma doação selecionada.');
            return;
        }

        const relatorio = {
            observacoes,
            temperatura: parseFloat(temperatura), 
            pressaoArterial,
            frequenciaCardiaca: parseInt(frequenciaCardiaca), 
            nivelHemoglobina: parseFloat(nivelHemoglobina),
            peso: parseFloat(peso),
            altura: parseInt(altura),
            idDoacao: doacaoSelecionada.idDoacao,
        };
        try {
            const response = await api.post('/triagem', relatorio, {
                headers: { Authorization : `Bearer ${token}`},
            });

            onSubmitRelatorio();

            if (response.data.aptidaoParaDoar) {
                setFeedbackMessage('Relatório salvo com sucesso! Paciente apto para doação.');
            } else {
                setFeedbackMessage('Relatório salvo, mas paciente não está apto para doação.');
            }

            onRequestClose();
        } catch (error) {
            console.error('Erro na API:', error.response ? error.response.data : error.message);

            setFeedbackMessage('Erro ao salvar o relatório de triagem. Tente novamente.');
        }
    
        setTimeout(() => setFeedbackMessage(''), 3000);
    };

    const handleResetForm = () => {
        setObservacoes('');
        setTemperatura('');
        setPressaoArterial('');
        setFrequenciaCardiaca('');
        setNivelHemoglobina('');
        setPeso('');
        setAltura('');
        setErros({}); // Limpa todas as mensagens de erro
    };
    

    return (
        isOpen && (
            <div className="relatorioTriagem-modal">
                <div className="relatorioTriagem-content">
                    <h2>Relatório de Triagem</h2>
                    
                        {/* Seção de Observações */}
                        <div className="relatorioTriagem-section">
                            <label>Observações:</label>
                            <textarea
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                placeholder="Descreva observações relevantes"
                            />
                        </div>
                    <div className='lado-a-lado'>
                        {/* Seção de Dados Vitais */}
                        <div className="relatorioTriagem-section-group">
                            <h3 className="relatorioTriagem-subtitle">Dados Vitais</h3>
                            <div className="relatorioTriagem-section">
                                <label>
                                    Temperatura (°C):
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={temperatura}
                                    onChange={handleTemperaturaChange}
                                    onFocus={() => handleFocus('temperatura')}
                                    placeholder="Ex.: 36.5"
                                />
                                {erros.temperatura && 
                                    <div className='error-message-2'>
                                         <FaExclamationCircle className="fas fa-exclamation-circle"  size={16} style={{ marginRight: '5px' }}/>
                                        {erros.temperatura}
                                    </div>}
                            </div>
                            <div className="relatorioTriagem-section">
                                <label>Pressão Arterial:</label>
                                <input
                                    type="text"
                                    value={pressaoArterial}
                                    onChange={handlePressaoArterialChange}
                                    onFocus={() => handleFocus('pressaoArterial')}
                                    placeholder="Ex.: 120/80"
                                />
                                {erros.pressaoArterial && 
                                    <div className='error-message-2'>
                                        <FaExclamationCircle className="fas fa-exclamation-circle"  size={16} style={{ marginRight: '5px' }}/>
                                        {erros.pressaoArterial}
                                    </div>}
                            </div>
                            <div className="relatorioTriagem-section">
                                <label>Frequência Cardíaca (bpm):</label>
                                <input
                                    type="number"
                                    value={frequenciaCardiaca}
                                    onChange={handleFrequenciaCardiacaChange}
                                    onFocus={() => handleFocus('frequenciaCardiaca')}
                                    placeholder="Ex.: 70"
                                />
                                {erros.frequenciaCardiaca && 
                                    <div className='error-message-2'>
                                        <FaExclamationCircle className="fas fa-exclamation-circle"  size={16} style={{ marginRight: '5px' }}/>
                                        {erros.frequenciaCardiaca}
                                    </div>}
                            </div>
                            
                        </div>

                        {/* Seção de Medições */}
                        <div className="relatorioTriagem-section-group">
                            <h3 className="relatorioTriagem-subtitle">Medições</h3>
                            <div className="relatorioTriagem-section">
                                <label>Nível de Hemoglobina:</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={nivelHemoglobina}
                                    onChange={(e) => setNivelHemoglobina(e.target.value)}
                                    
                                    placeholder="Ex.: 14.0"
                                />
                            </div>
                            <div className="relatorioTriagem-section">
                                <label>Peso (kg):</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={peso}
                                    onChange={handlePesoChange}
                                    onFocus={() => handleFocus('peso')}
                                    placeholder="Ex.: 70.5"
                                />
                                {erros.peso && 
                                    <div className='error-message-2'>
                                        <FaExclamationCircle className="fas fa-exclamation-circle"  size={16} style={{ marginRight: '5px' }}/>
                                        {erros.peso}
                                    </div>}
                            </div>
                            <div className="relatorioTriagem-section">
                                <label>Altura (cm):</label>
                                <input
                                    type="number"
                                    value={altura}
                                    onChange={handleAlturaChange}
                                    onFocus={() => handleFocus('altura')}
                                    placeholder="Ex.: 170"
                                />
                                {erros.altura && 
                                    <div className='error-message-2'>
                                        <FaExclamationCircle className="fas fa-exclamation-circle"  size={16} style={{ marginRight: '5px' }}/>
                                        {erros.altura}
                                    </div>}
                            </div>
                        </div>
                    </div>

                    <div className="relatorioTriagem-actions">
                        <button onClick={handleSalvarRelatorio}>Salvar Relatório</button>
                        <button onClick={onRequestClose} className="cancelar-btn">Cancelar</button>
                        <button onClick={handleResetForm} className="reset-btn">Limpar Campos</button>
                    </div>
                    {feedbackMessage && (
                    <div className="feedback-message">
                        {feedbackMessage}
                    </div>
                )}
                
                </div>
               
                    
            </div>
        )
    );
};

export default RelatorioTriagemModal;

