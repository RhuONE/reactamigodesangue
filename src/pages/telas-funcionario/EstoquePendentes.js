import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import './EstoquePendentes.css';
import api from '../../services/api';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';

const EstoquePendentes = () => {
    const [qrCodeData, setQrCodeData] = useState('');
    const [useCamera, setUseCamera] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [idDoacao, setIdDoacao] = useState('');
    const [exameData, setExameData] = useState(null);
    const [isConfirmarRegistrarModalOpen, setIsConfirmarRegistrarModalOpen] = useState(false);
    const [isConfirmarDescarteModalOpen, setIsConfirmarDescarteModalOpen] = useState(false);

    const token = localStorage.getItem('token');

    const resetarTela = () => {
        setQrCodeData('');
        setSelectedImage(null);
        setUseCamera(true);
        setIdDoacao('');
        setExameData(null);
        setIsConfirmarRegistrarModalOpen(false);
        setIsConfirmarDescarteModalOpen(false);
    };

    const verificarExame = async () => {
        if (!qrCodeData) {
            alert('QR Code não processado. Verifique a imagem ou tente novamente.');
            return;
        }

        try {
            const parsedData = JSON.parse(qrCodeData);
            const codigoDoacao = parsedData.CodigoDoacao;
            setIdDoacao(codigoDoacao);

            const response = await api.get(`/exames/${codigoDoacao}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.exameLaboratorio) {
                setExameData(response.data.exameLaboratorio);
            } else {
                alert('Exame não encontrado para esta doação.');
                resetarTela();
            }
        } catch (error) {
            console.error('Erro ao verificar o exame:', error);
            alert('Erro ao verificar o QR Code.');
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Exibe a imagem carregada
            setSelectedImage(e.target.result);

            // Processa o QR Code
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

                if (qrCode) {
                    setQrCodeData(qrCode.data);
                } else {
                    alert('Não foi possível ler o QR Code. Tente novamente.');
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const registrarNoEstoque = async () => {
        try {
            await api.post(`/doacoes/${idDoacao}/adicionar-estoque`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Doação registrada no estoque com sucesso!');
            resetarTela();
        } catch (error) {
            console.error('Erro ao registrar no estoque:', error);
            alert('Erro ao registrar a doação no estoque.');
        }
    };

    const descartar = async () => {
        try {
            await api.post(`/doacoes/${idDoacao}/descartar`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Doação descartada com sucesso!');
            resetarTela();
        } catch (error) {
            console.error('Erro ao descartar a doação:', error);
            alert('Erro ao descartar a doação.');
        }
    };

    return (
        <div className="estoquePendentes-container">
            <h1 className="estoquePendentes-title">Verificar Doações</h1>

            {useCamera ? (
                <div className="estoquePendentes-scan">
                    <QrScanner
                        delay={300}
                        style={{ width: '100%', height: '100%' }}
                        onError={(err) => console.error('Erro ao usar a câmera:', err)}
                        onScan={(data) => data && setQrCodeData(data.text)}
                    />
                    <button className='examesPendentes-btnOption' onClick={() => setUseCamera(false)}>Usar arquivo</button>
                </div>
            ) : (
                <div className="estoquePendentes-upload">
                    <label className="custom-file-upload">
                        Escolher arquivo
                        <input type="file" accept="image/*" onChange={handleFileUpload} />
                    </label>
                    {selectedImage && (
                        <div className="estoquePendentes-image-container">
                            <img
                                src={selectedImage}
                                alt="QR Code Selecionado"
                                className="estoquePendentes-image"
                            />
                        </div>
                    )}
                    {qrCodeData && (
                        <button className="estoquePendentes-btnVerify" onClick={verificarExame}>
                            Verificar QR Code
                        </button>
                    )}
                    <button className="examesPendentes-btnBack" onClick={() => setUseCamera(true)}>
                        Voltar para a câmera
                    </button>
                </div>
            )}

            {exameData && (
                <div className="estoquePendentes-result">
                    <h2>Resultado do Exame</h2>
                    <p>
                        {exameData.aptoParaDoacao === "1"
                            ? 'Doação Apta para Estoque.'
                            : 'Doação Inapta. Encaminhar para descarte.'}
                    </p>
                    {exameData.aptoParaDoacao === "1" ? (
                        <button onClick={() => setIsConfirmarRegistrarModalOpen(true)}>Registrar no Estoque</button>
                    ) : (
                        <button onClick={() => setIsConfirmarDescarteModalOpen(true)}>Descartar</button>
                    )}
                </div>
            )}

            {isConfirmarRegistrarModalOpen && (
                <ConfirmacaoModal
                    isOpen={isConfirmarRegistrarModalOpen}
                    onRequestClose={() => setIsConfirmarRegistrarModalOpen(false)}
                    onConfirm={registrarNoEstoque}
                    mensagem="Registrar a doação no estoque?"
                />
            )}

            {isConfirmarDescarteModalOpen && (
                <ConfirmacaoModal
                    isOpen={isConfirmarDescarteModalOpen}
                    onRequestClose={() => setIsConfirmarDescarteModalOpen(false)}
                    onConfirm={descartar}
                    mensagem="Descartar a doação?"
                />
            )}
        </div>
    );
};

export default EstoquePendentes;
