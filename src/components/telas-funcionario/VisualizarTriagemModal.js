import React from 'react';
import './VisualizarTriagemModal.css';
import { Tooltip } from 'react-tooltip';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import jsPDF from 'jspdf'; // Importação da biblioteca jsPDF
import 'jspdf-autotable'; // Opcional, para ajudar com a formatação de tabelas


const VisualizarTriagemModal = ({ isOpen, onRequestClose, doacaoSelecionada }) => {
    if (!isOpen || !doacaoSelecionada || !doacaoSelecionada.triagem) return null;

    const relatorio = doacaoSelecionada.triagem;

    const aptidaoIcon = relatorio.aptidaoParaDoar === "1" ? (
        <FaCheckCircle className="visualizacaoRelatorio-aprovado-icon" />
    ) : (
        <FaTimesCircle className="visualizacaoRelatorio-reprovado-icon" />
    );

    const verificarIntervalo = (valor, min, max) => valor < min || valor > max;

    const getClassEIconeAlerta = (valor, min, max) => {
        if (verificarIntervalo(valor, min, max)) {
            return <FaExclamationTriangle className="alerta-icon" />;
        }
        return null;
    };

    const formatarValor = (valor, casasDecimais = 1) => parseFloat(valor).toFixed(casasDecimais);


    function gerarRelatorioTriagem(relatorio) {
        const doc = new jsPDF();
        let posY = 20;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório de Triagem', 105, posY, { align: 'center' });
        posY += 10;

        const statusText = relatorio.aptidaoParaDoar === "1" ? 'Aprovado' : 'Reprovado';
        const statusColor = relatorio.aptidaoParaDoar === "1" ? 'green' : 'red';
        doc.setTextColor(statusColor);
        doc.setFontSize(14);
        doc.text(`Aptidão: ${statusText}`, 105, posY, { align: 'center' });
        posY += 10;

        doc.setDrawColor(200, 200, 200);
        doc.line(15, posY, 195, posY);
        posY += 5;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const detalhes = [
            { label: 'Temperatura', valor: `${relatorio.temperatura} °C`, normal: '36 - 37.5 °C', alerta: [36, 37.5] },
            { label: 'Pressão Arterial', valor: `${relatorio.pressaoArterial}`, normal: '120/80 mmHg', alerta: null },
            { label: 'Frequência Cardíaca', valor: `${relatorio.frequenciaCardiaca} bpm`, normal: '60 - 100 bpm', alerta: [60, 100] },
            { label: 'Nível de Hemoglobina', valor: `${relatorio.nivelHemoglobina} g/dL`, normal: '12 - 17 g/dL', alerta: [12, 17] },
            { label: 'Peso', valor: `${relatorio.peso} kg`, normal: '> 50 kg', alerta: [50, Infinity] },
            { label: 'Altura', valor: `${relatorio.altura} cm`, normal: '-', alerta: null },
            { label: 'IMC', valor: `${relatorio.imc}`, normal: '18.5 - 24.9', alerta: [18.5, 24.9] },
        ];

        detalhes.forEach((detalhe) => {
            const [min, max] = detalhe.alerta || [null, null];
            const valorNum = parseFloat(detalhe.valor);
            const foraDoIntervalo = min !== null && (valorNum < min || valorNum > max);

            doc.setFont('helvetica', 'bold');
            doc.text(`${detalhe.label}:`, 20, posY);
            doc.setFont('helvetica', 'normal');
            doc.text(detalhe.valor, 70, posY);

            if (foraDoIntervalo) {
                doc.setTextColor('orange');
                //doc.text('⚠', 65, posY);
                doc.setTextColor('red');
            } else {
                doc.setTextColor('green');
            }
            doc.text(`Normal: ${detalhe.normal}`, 150, posY);
            doc.setTextColor(0, 0, 0);

            posY += 10;
        });

        doc.setFont('helvetica', 'bold');
        doc.text('Observações:', 20, posY);
        posY += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(relatorio.observacoes || 'Nenhuma observação', 20, posY);

        doc.save('relatorio-triagem.pdf');
    }
    
    

    return (
        <div className="visualizacaoRelatorio-modal">
            <div className="visualizacaoRelatorio-content">
                <h2 className="visualizacaoRelatorio-header">Relatório de Triagem</h2>
                <div className={`visualizacaoRelatorio-status ${relatorio.aptidaoParaDoar === "1" ? 'aprovado' : 'reprovado'}`}>
                    <p>Aprovado: {aptidaoIcon}</p>
                </div>
                
                {/** Linha separadora */}
                <hr className='visualizacaoRelatorio-separador' />


                <div className="visualizacaoRelatorio-detalhes">
                    <div className="relatorio-item" id="temperatura-tip">
                        <div>
                            <strong>Temperatura:</strong> {formatarValor(relatorio.temperatura)} °C
                            {getClassEIconeAlerta(relatorio.temperatura, 36, 37.5)}
                        </div>
                        <div>
                            <span className={verificarIntervalo(relatorio.temperatura, 36, 37.5) ? 'alterado' : 'normal'}>
                                {' '} Normal: 36 - 37.5 °C
                            </span>
                        </div>
                        <Tooltip anchorSelect="#temperatura-tip" place="top" content="Temperatura corporal deve estar entre 36 e 37.5 °C para ser considerada normal." />
                    </div>
                    <div className="relatorio-item" id="pressao-tip">
                        <div>
                            <strong>Pressão Arterial:</strong> {relatorio.pressaoArterial}
                        </div>
                        <div>
                            <span className={relatorio.pressaoArterial === '120/80' ? 'normal' : 'alterado'}>
                                {' '} Normal: 120/80 mmHg
                            </span>
                        </div>
                        <Tooltip anchorSelect="#pressao-tip" place="top" content="A pressão arterial ideal para um adulto é 120/80 mmHg." />
                    </div>
                    <div className="relatorio-item" id="frequencia-tip">
                        <div>
                            <strong>Frequência Cardíaca:</strong> {formatarValor(relatorio.frequenciaCardiaca, 0)} bpm
                            {getClassEIconeAlerta(relatorio.frequenciaCardiaca, 60, 100)}
                        </div>
                        <div>
                            <span className={verificarIntervalo(relatorio.frequenciaCardiaca, 60, 100) ? 'alterado' : 'normal'}>
                                {' '} Normal: 60 - 100 bpm
                            </span>
                        </div>
                        <Tooltip anchorSelect="#frequencia-tip" place="top" content="A frequência cardíaca normal em repouso varia de 60 a 100 bpm para adultos." />
                    </div>
                    <div className="relatorio-item" id="hemoglobina-tip">
                        <div>
                            <strong>Nível de Hemoglobina:</strong> {formatarValor(relatorio.nivelHemoglobina)} g/dL
                            {getClassEIconeAlerta(relatorio.nivelHemoglobina, 12, 17)}
                        </div>
                        <div>
                            <span className={verificarIntervalo(relatorio.nivelHemoglobina, 12, 17) ? 'alterado' : 'normal'}>
                                {' '} Normal: 12 - 17 g/dL
                            </span>
                        </div>
                        <Tooltip anchorSelect="#hemoglobina-tip" place="top" content="Níveis normais de hemoglobina em adultos variam de 12 a 17 g/dL." />
                    </div>
                    <div className="relatorio-item" id="peso-tip">
                        <div>
                            <strong>Peso:</strong> {formatarValor(relatorio.peso)} kg
                            {relatorio.peso < 50 ? <FaExclamationTriangle className="alerta-icon" /> : null}
                        </div>
                        <div>
                            <span className={relatorio.peso >= 50 ? 'normal' : 'alterado'}>
                                {' '} Normal: ≥ 50 kg
                            </span>
                        </div>
                        <Tooltip anchorSelect="#peso-tip" place="top" content="O peso mínimo aceitável para doação de sangue é geralmente 50 kg." />
                    </div>
                    <div className="relatorio-item">
                        <div>
                            <strong>Altura:</strong> {formatarValor(relatorio.altura, 0)} cm
                        </div>
                    </div>
                    <div className="relatorio-item" id="imc-tip">
                        <div>
                            <strong>IMC:</strong> {formatarValor(relatorio.imc, 2)}
                            {getClassEIconeAlerta(relatorio.imc, 18.5, 24.9)}
                        </div>
                        <div>
                            <span className={verificarIntervalo(relatorio.imc, 18.5, 24.9) ? 'alterado' : 'normal'}>
                                {' '} Normal: 18.5 - 24.9
                            </span>
                        </div>
                        <Tooltip anchorSelect="#imc-tip" place="top" content="O IMC normal está entre 18.5 e 24.9." />
                    </div>
                    <div className="relatorio-item">
                        <strong>Observações:</strong> {relatorio.observacoes || 'Nenhuma observação'}
                    </div>
                </div>
                <button onClick={() => gerarRelatorioTriagem(relatorio)} className='visualizacaoRelatorio-download-btn'>Download Relatório</button>
                <button onClick={onRequestClose} className="visualizacaoRelatorio-fechar-btn">Fechar</button>
            </div>
        </div>
    );
};

export default VisualizarTriagemModal;
