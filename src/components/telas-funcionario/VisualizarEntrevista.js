import React from 'react';
import './VisualizarEntrevista.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import jsPDF from 'jspdf'; // Importação da biblioteca jsPDF
import 'jspdf-autotable'; // Opcional, para ajudar com a formatação de tabelas


const VisualizarEntrevista = ({ isOpen, onRequestClose, doacaoSelecionada }) => {
    if (!isOpen || !doacaoSelecionada || !doacaoSelecionada.entrevista) return null;

    const entrevista = doacaoSelecionada.entrevista;

    const aptidaoIcon = entrevista.aptoParaDoacao === true ? (
        <FaCheckCircle className="visualizacaoEntrevista-aprovado-icon" />
    ) : (
        <FaTimesCircle className="visualizacaoEntrevista-reprovado-icon" />
    );

    const formatarResposta = (valor) => {
        return valor === "1" ? "Sim" : "Não";
    };
    
    function gerarRelatorioEntrevista(entrevista) {
        const doc = new jsPDF();
        let posY = 20;
    
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório de Entrevista', 105, posY, { align: 'center' });
        posY += 10;
    
        const statusText = entrevista.aptoParaDoacao === "1" ? 'Aprovado' : 'Reprovado';
        const statusColor = entrevista.aptoParaDoacao === "1" ? 'green' : 'red';
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
            { label: 'Histórico de Doença Infecciosa', valor: entrevista.historicoDoencaInfecciosa === "1" ? "Sim" : "Não" },
            { label: 'Uso de Medicamentos Recente', valor: entrevista.usoMedicamentosRecente === "1" ? "Sim" : "Não" },
            { label: 'Cirurgias Recentes', valor: entrevista.cirurgiasRecentes === "1" ? "Sim" : "Não" },
            { label: 'Tatuagem ou Piercing Recente', valor: entrevista.tatuagemOuPiercingRecente === "1" ? "Sim" : "Não" },
            { label: 'Relações Sexuais de Risco', valor: entrevista.relacoesSexuaisDeRisco === "1" ? "Sim" : "Não" },
            { label: 'Viagem Recente a Países de Risco', valor: entrevista.viagemRecentePaisRisco === "1" ? "Sim" : "Não" },
            { label: 'Histórico de Câncer', valor: entrevista.historicoCancer === "1" ? "Sim" : "Não" },
            { label: 'Gravidez ou Amamentação', valor: entrevista.gravidezOuAmamentacao === "1" ? "Sim" : "Não" },
            { label: 'Uso Alcoólico Recentemente', valor: entrevista.usoAlcoolicoRecentemente === "1" ? "Sim" : "Não" },
            { label: 'Uso de Drogas', valor: entrevista.usoDrogas === "1" ? "Sim" : "Não" },
            { label: 'Voto de Autoexclusão', valor: entrevista.votoAutoExclusao === "1" ? "Sim" : "Não" }
        ];
    
        detalhes.forEach((detalhe) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${detalhe.label}:`, 20, posY);
            doc.setFont('helvetica', 'normal');
            doc.text(detalhe.valor, 100, posY);
            posY += 10;
        });
    
        doc.setFont('helvetica', 'bold');
        doc.text('Observações:', 20, posY);
        posY += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(entrevista.observacoesEntrevista || 'Nenhuma observação', 20, posY);
    
        doc.save('relatorio-entrevista.pdf');
    }
    

    return (
        <div className="visualizacaoEntrevista-modal">
            <div className="visualizacaoEntrevista-content">
            <h2 className="visualizacaoRelatorio-header">Relatório de Entrevista</h2>
                <div className={`visualizacaoRelatorio-status ${doacaoSelecionada.entrevista.aptoParaDoacao === "1" ? 'aprovado' : 'reprovado'}`}>
                    <p>Apto para Doação: {doacaoSelecionada.entrevista.aptoParaDoacao === "1" ? <FaCheckCircle className="visualizacaoRelatorio-aprovado-icon" /> : <FaTimesCircle className="visualizacaoRelatorio-reprovado-icon" />}</p>
                </div>
                <hr className='visualizacaoRelatorio-separador' />
                <div className="visualizacaoRelatorio-detalhes">
                    <div className="relatorio-item">
                        <strong>Histórico de Doença Infecciosa:</strong> {formatarResposta(doacaoSelecionada.entrevista.historicoDoencaInfecciosa)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Uso de Medicamentos Recente:</strong> {formatarResposta(doacaoSelecionada.entrevista.usoMedicamentosRecente)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Cirurgias Recentes:</strong> {formatarResposta(doacaoSelecionada.entrevista.cirurgiasRecentes)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Tatuagem ou Piercing Recente:</strong> {formatarResposta(doacaoSelecionada.entrevista.tatuagemOuPiercingRecente)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Relações Sexuais de Risco:</strong> {formatarResposta(doacaoSelecionada.entrevista.relacoesSexuaisDeRisco)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Viagem Recente a Países de Risco:</strong> {formatarResposta(doacaoSelecionada.entrevista.viagemRecentePaisRisco)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Histórico de Câncer:</strong> {formatarResposta(doacaoSelecionada.entrevista.historicoCancer)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Gravidez ou Amamentação:</strong> {formatarResposta(doacaoSelecionada.entrevista.gravidezOuAmamentacao)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Uso Alcoólico Recentemente:</strong> {formatarResposta(doacaoSelecionada.entrevista.usoAlcoolicoRecentemente)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Uso de Drogas:</strong> {formatarResposta(doacaoSelecionada.entrevista.usoDrogas)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Voto de Autoexclusão:</strong> {formatarResposta(doacaoSelecionada.entrevista.votoAutoExclusao)}
                    </div>
                    <div className="relatorio-item">
                        <strong>Observações:</strong> {doacaoSelecionada.entrevista.observacoesEntrevista || 'Nenhuma observação'}
                    </div>
                </div>

                <button onClick={() => gerarRelatorioEntrevista(entrevista)} className='visualizacaoRelatorio-download-btn'>Download Relatório</button>



                <button onClick={onRequestClose} className="visualizacaoEntrevista-fechar-btn">Fechar</button>
            </div>
        </div>
    );
};

export default VisualizarEntrevista;
