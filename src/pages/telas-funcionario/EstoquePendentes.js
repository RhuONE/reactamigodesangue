import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import './EstoquePendentes.css';
import api from '../../services/api';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import FeedbackMessage from '../../components/FeedbackMessage';
import { ClipLoader } from 'react-spinners';

const EstoquePendentes = () => {
    const [qrCodeData, setQrCodeData] = useState('');
    const [useCamera, setUseCamera] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [idDoacao, setIdDoacao] = useState('');
    const [exameData, setExameData] = useState(null);
    const [isConfirmarRegistrarModalOpen, setIsConfirmarRegistrarModalOpen] = useState(false);
    const [isConfirmarDescarteModalOpen, setIsConfirmarDescarteModalOpen] = useState(false);

    const [statusDoacao, setStatusDoacao] = useState(''); // Estado para o status da doação


    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState(''); // 'success' ou 'error'
    const [isLoading, setIsLoading] = useState(false); // Controle do loader

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

    const clearFeedback = () => {
        setTimeout(() => {
            setFeedbackMessage('');
            setFeedbackType('');
        }, 5000); // Limpa após 5 segundos
    };

    const verificarExame = async () => {
        if (!qrCodeData) {
            setFeedbackMessage('QR Code não processado. Verifique a imagem ou tente novamente.');
            setFeedbackType('error');
            clearFeedback();
            return;
        }

        setIsLoading(true); // Ativa o loader
        try {
            const parsedData = JSON.parse(qrCodeData);
            const codigoDoacao = parsedData.CodigoDoacao;
            setIdDoacao(codigoDoacao);

            const response = await api.get(`/exames/${codigoDoacao}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { exameLaboratorio, statusDoacao } = response.data;

            if (!exameLaboratorio) {
                setFeedbackMessage('Exame não encontrado para esta doação.');
                setFeedbackType('error');
            } else {
                setExameData(exameLaboratorio); // Armazena os dados do exame
                setStatusDoacao(statusDoacao); // Armazena o status da doação

                if (statusDoacao === "estoque-adicionado") {
                    setFeedbackMessage('Esta bolsa já foi registrada no estoque.');
                    setFeedbackType('success');
                } else if (statusDoacao === "exame-realizado") {
                    setFeedbackMessage('Exame verificado com sucesso!');
                    setFeedbackType('success');
                } else {
                    setFeedbackMessage('Status da doação desconhecido.');
                    setFeedbackType('error');
                }
            }
        } catch (error) {
            console.error('Erro ao verificar o exame:', error);
            setFeedbackMessage('Erro ao verificar o QR Code.');
            setFeedbackType('error');
        } finally {
            setIsLoading(false); // Desativa o loader
            clearFeedback();
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setFeedbackMessage('Nenhum arquivo escolhido. Selecione uma imagem válida.');
            setFeedbackType('error');
            clearFeedback();
            return;
        }

        setIsLoading(true); // Ativa o loader
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);

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
                        setFeedbackMessage('QR Code lido com sucesso!');
                        setFeedbackType('success');
                    } else {
                        setFeedbackMessage('Não foi possível ler o QR Code. Tente novamente.');
                        setFeedbackType('error');
                    }
                    clearFeedback();
                };
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Erro ao carregar o arquivo:', error);
            setFeedbackMessage('Erro ao carregar o arquivo. Verifique e tente novamente.');
            setFeedbackType('error');
            clearFeedback();
        } finally {
            setIsLoading(false); // Desativa o loader
        }
    };

    const registrarNoEstoque = async () => {
        setIsLoading(true);
        try {
            await api.post(`/doacoes/${idDoacao}/adicionar-estoque`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbackMessage('Doação registrada no estoque com sucesso!');
            setFeedbackType('success');
            resetarTela();
        } catch (error) {
            console.error('Erro ao registrar no estoque:', error);
            setFeedbackMessage('Erro ao registrar a doação no estoque.');
            setFeedbackType('error');
        } finally {
            setIsLoading(false);
            clearFeedback();
        }
    };

    const descartar = async () => {
        setIsLoading(true);
        try {
            await api.post(`/doacoes/${idDoacao}/descartar`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbackMessage('Doação descartada com sucesso!');
            setFeedbackType('success');
            resetarTela();
        } catch (error) {
            console.error('Erro ao descartar a doação:', error);
            setFeedbackMessage('Erro ao descartar a doação.');
            setFeedbackType('error');
        } finally {
            setIsLoading(false);
            clearFeedback();
        }
    };

    return (
        <div className="estoquePendentes-container">
            <h1 className="estoquePendentes-title">Verificar Doações</h1>

            <FeedbackMessage type={feedbackType} message={feedbackMessage} />

            {isLoading ? (
                <div className="loading-container">
                    <ClipLoader size={40} color="#0a93a1" />
                    <p>Processando...</p>
                </div>
            ) : (
                useCamera ? (
                    <div className="estoquePendentes-scan">
                        <QrScanner
                            delay={300}
                            style={{ width: '100%', height: '100%' }}
                            onError={(err) => console.error('Erro ao usar a câmera:', err)}
                            onScan={(data) => data && setQrCodeData(data.text)}
                        />
                        <button className="examesPendentes-btnOption" onClick={() => setUseCamera(false)}>
                            Usar arquivo
                        </button>
                    </div>
                ) : (
                    <div className="estoquePendentes-upload">
                        <label className="custom-file-upload">
                            Escolher arquivo
                            <input type="file" accept="image/*" onChange={handleFileUpload} />
                        </label>
                        {selectedImage && (
                            <div className="estoquePendentes-image-container">
                                <img src={selectedImage} alt="QR Code Selecionado" className="estoquePendentes-image" />
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
                )
            )}

            {exameData && (
                <div className="estoquePendentes-result">
                    <h2>Resultado do Exame</h2>
                    <p>Tipo Sanguíneo: {exameData.tipoSanguineo}</p>
                    <p>
                        {statusDoacao === "estoque-adicionado"
                            ? 'Esta bolsa já foi registrada no estoque.'
                            : exameData.aptoParaDoacao === "1"
                            ? 'Doação Apta para Estoque.'
                            : 'Doação Inapta. Encaminhar para descarte.'}
                    </p>
                    {statusDoacao === "estoque-adicionado" ? null : exameData.aptoParaDoacao === "1" ? (
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
