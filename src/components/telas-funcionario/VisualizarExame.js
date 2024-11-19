import React from 'react';
import './VisualizarEntrevista.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VisualizarExame = ({ isOpen, onRequestClose, exameData }) => {
    if (!isOpen || !exameData) return null; // Checa se o modal está aberto e se há dados do exame

    const exame = exameData; // Usa diretamente `exameData`

    const aptidaoIcon = exame.aptoParaDoacao === "1" ? (
        <FaCheckCircle className="visualizacaoRelatorio-aprovado-icon" />
    ) : (
        <FaTimesCircle className="visualizacaoRelatorio-reprovado-icon" />
    );

    function gerarRelatorioExame(exame) {
        const doc = new jsPDF();
        let posY = 20;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório de Exame', 105, posY, { align: 'center' });
        posY += 10;

        const statusText = exame.aptoParaDoacao === "1" ? 'Aprovado' : 'Reprovado';
        const statusColor = exame.aptoParaDoacao === "1" ? 'green' : 'red';
        doc.setTextColor(statusColor);
        doc.setFontSize(14);
        doc.text(`Aptidão para Doação: ${statusText}`, 105, posY, { align: 'center' });
        posY += 10;

        doc.setDrawColor(200, 200, 200);
        doc.line(15, posY, 195, posY);
        posY += 5;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const detalhes = [
            { label: 'Tipo Sanguíneo', valor: exame.tipoSanguineo },
            { label: 'Hemoglobina (g/dL)', valor: exame.hemoglobina },
            { label: 'Hematócrito (%)', valor: exame.hematocrito },
            { label: 'Plaquetas (milhões/mcL)', valor: exame.plaquetas },
            { label: 'Leucócitos (milhões/mcL)', valor: exame.leucocitos },
            { label: 'HIV', valor: exame.hiv === "1" ? "Positivo" : "Negativo" },
            { label: 'Hepatite B', valor: exame.hepatiteB === "1" ? "Positivo" : "Negativo" },
            { label: 'Hepatite C', valor: exame.hepatiteC === "1" ? "Positivo" : "Negativo" },
            { label: 'Chagas', valor: exame.chagas === "1" ? "Positivo" : "Negativo" },
            { label: 'Sífilis', valor: exame.sifilis === "1" ? "Positivo" : "Negativo" },
            { label: 'HTLV', valor: exame.htlv === "1" ? "Positivo" : "Negativo" }
        ];

        detalhes.forEach((detalhe) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${detalhe.label}:`, 20, posY);
            doc.setFont('helvetica', 'normal');
            doc.text(detalhe.valor.toString(), 100, posY);
            posY += 10;
        });

        doc.setFont('helvetica', 'bold');
        doc.text('Observações:', 20, posY);
        posY += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(exame.observacoes || 'Nenhuma observação', 20, posY);

        doc.save('relatorio-exame.pdf');
    }

    return (
        <div className="visualizacaoEntrevista-modal">
            <div className="visualizacaoEntrevista-content">
                <h2 className="visualizacaoRelatorio-header">Relatório de Exame</h2>
                <div className={`visualizacaoRelatorio-status ${exame.aptoParaDoacao === "1" ? 'aprovado' : 'reprovado'}`}>
                    <p>Apto para Doação: {aptidaoIcon}</p>
                </div>
                <hr className='visualizacaoRelatorio-separador' />
                <div className="visualizacaoRelatorio-detalhes">
                    <div className="relatorio-item"><strong>Tipo Sanguíneo:</strong> {exame.tipoSanguineo}</div>
                    <div className="relatorio-item"><strong>Hemoglobina (g/dL):</strong> {exame.hemoglobina}</div>
                    <div className="relatorio-item"><strong>Hematócrito (%):</strong> {exame.hematocrito}</div>
                    <div className="relatorio-item"><strong>Plaquetas (milhões/mcL):</strong> {exame.plaquetas}</div>
                    <div className="relatorio-item"><strong>Leucócitos (milhões/mcL):</strong> {exame.leucocitos}</div>
                    <div className="relatorio-item"><strong>HIV:</strong> {exame.hiv === "1" ? "Positivo" : "Negativo"}</div>
                    <div className="relatorio-item"><strong>Hepatite B:</strong> {exame.hepatiteB === "1" ? "Positivo" : "Negativo"}</div>
                    <div className="relatorio-item"><strong>Hepatite C:</strong> {exame.hepatiteC === "1" ? "Positivo" : "Negativo"}</div>
                    <div className="relatorio-item"><strong>Chagas:</strong> {exame.chagas === "1" ? "Positivo" : "Negativo"}</div>
                    <div className="relatorio-item"><strong>Sífilis:</strong> {exame.sifilis === "1" ? "Positivo" : "Negativo"}</div>
                    <div className="relatorio-item"><strong>HTLV:</strong> {exame.htlv === "1" ? "Positivo" : "Negativo"}</div>
                    <div className="relatorio-item"><strong>Observações:</strong> {exame.observacoes || 'Nenhuma observação'}</div>
                </div>

                <button onClick={() => gerarRelatorioExame(exame)} className='visualizacaoRelatorio-download-btn'>Download Relatório</button>
                <button onClick={onRequestClose} className="visualizacaoEntrevista-fechar-btn">Fechar</button>
            </div>
        </div>
    );
};

export default VisualizarExame;
