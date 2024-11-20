import React, { useState } from 'react';
import Modal from 'react-modal';
import './RelatorioColetaModal.css';
import api from '../../services/api';

import { FaDownload, FaPrint } from 'react-icons/fa'; // Importação dos ícones de download e impressão


import { ClipLoader } from 'react-spinners';


Modal.setAppElement('#root');

const RelatorioColetaModal = ({ isOpen, onRequestClose, onSubmitRelatorio, doacaoSelecionada }) => {
    const [quantidadeMl, setQuantidadeMl] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isQrCodeGenerated, setIsQrCodeGenerated] = useState(false);
    const [showForm, setShowForm] = useState(false); // Controle para exibir o formulário

    
    const [isGeneratingQrCode, setIsGeneratingQrCode] = useState(false);
    const [isSavingRelatorio, setIsSavingRelatorio] = useState(false);


    const token = localStorage.getItem('token');

    const gerarQrCode = async (idDoacao) => {
        setIsGeneratingQrCode(true); // Ativa o estado de carregamento
        try {
            const response = await api.get(`/doacoes/${idDoacao}/qrcode`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const url = URL.createObjectURL(response.data);
            setQrCodeUrl(url);
            setIsQrCodeGenerated(true);
        } catch (error) {
            console.error('Erro ao gerar QR Code:', error);
        } finally {
            setIsGeneratingQrCode(false); // Finaliza o carregamento
        }
    };
    

    const handleSalvarRelatorio = () => {
        setIsSavingRelatorio(true); // Ativa o estado de carregamento
        const relatorio = {
            quantidadeMl,
            observacoes,
        };
        onSubmitRelatorio(relatorio);
        setIsSavingRelatorio(false); // Finaliza o carregamento
    };
    
    const baixarQrCode = () => {
        const canvas = document.createElement('canvas');
        const img = new Image();
    
        img.onload = () => {
            // Configura o tamanho do canvas de acordo com a imagem
            canvas.width = img.width;
            canvas.height = img.height;
    
            // Desenha a imagem no canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
    
            // Converte o canvas para PNG
            const pngUrl = canvas.toDataURL('image/png');
    
            // Cria o link para download
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `qr_code_doacao_${doacaoSelecionada.idDoacao}.png`;
            link.click();
        };
    
        // Define a URL da imagem como a URL do QR Code gerado
        img.src = qrCodeUrl;
    };

    const imprimirQrCode = () => {
        const janelaImpressao = window.open();
        janelaImpressao.document.write(
            `<img src="${qrCodeUrl}" alt="QR Code da Coleta" style="width:300px;height:300px;">`
        );
        janelaImpressao.document.close();
        janelaImpressao.print();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Relatório de Coleta"
            className="relatorioColeta-modal"
            overlayClassName="relatorioColeta-overlay"
        >
            <h2>Relatório de Coleta</h2>

            {!showForm ? (
                // Exibição do QR Code
                <div>
                    {!isQrCodeGenerated ? (
                        <div>
                            <p>Gere o QR Code para a bolsa de sangue.</p>
                            <button
                                type="button"
                                className="salvar-btn"
                                onClick={() => gerarQrCode(doacaoSelecionada.idDoacao)}
                                disabled={isGeneratingQrCode} // Desativa enquanto carrega
                            >
                                {isGeneratingQrCode ? <ClipLoader size={16} color="#fff" /> : 'Gerar QR Code'}
                            </button>

                        </div>
                    ) : (
                        <div>
                            <p>QR Code gerado com sucesso! Escolha uma das opções abaixo:</p>
                            <div className="qr-code-preview">
                                <img src={qrCodeUrl} alt="QR Code da Bolsa de Sangue" style={{ width: '300px', height: '300px' }} />
                                <div className="qr-code-actions">
                                    <button
                                        onClick={baixarQrCode}
                                        className="icon-button"
                                        title="Baixar QR Code"
                                    >
                                        <FaDownload size={24} />
                                    </button>
                                    <button
                                        onClick={imprimirQrCode}
                                        className="icon-button"
                                        title="Imprimir QR Code"
                                    >
                                        <FaPrint size={24} />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowForm(true)} // Habilita o formulário
                                className="salvar-btn"
                                style={{ marginTop: '20px' }}
                            >
                                Preencher Relatório
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                // Exibição do Formulário
                <form>
                    <label>Quantidade Coletada (ml):</label>
                    <input
                        type="number"
                        value={quantidadeMl}
                        onChange={(e) => setQuantidadeMl(e.target.value)}
                        placeholder="Insira a quantidade em ml"
                    />

                    <label>Observações:</label>
                    <textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Insira observações (opcional)"
                    ></textarea>

                    <div className="relatorioColeta-actions">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)} // Voltar para o QR Code
                            className="cancelar-btn"
                        >
                            Voltar
                        </button>
                        <button
                            type="button"
                            onClick={handleSalvarRelatorio}
                            className="salvar-btn"
                            disabled={isSavingRelatorio} // Desativa enquanto carrega
                        >
                            {isSavingRelatorio ? <ClipLoader size={16} color="#fff" /> : 'Salvar Relatório'}
                        </button>

                    </div>
                </form>
            )}
        </Modal>
    );
};

export default RelatorioColetaModal;
