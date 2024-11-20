import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import './ExamesPendentes.css';
import api from '../../services/api';
import ExameLaboratorioModal from '../../components/telas-funcionario/ExameLaboratorioModal';
import VisualizarExame from '../../components/telas-funcionario/VisualizarExame';
import FeedbackMessage from '../../components/FeedbackMessage.js';

import { ClipLoader } from 'react-spinners';


const ExamesPendentes = () => {
    const [qrCodeData, setQrCodeData] = useState('');
    const [useCamera, setUseCamera] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // Estado para a imagem selecionada
    const [idDoacao, setIdDoacao] = useState(''); // Estado para armazenar o ID da doação
    const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
    const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
    const [exameData, setExameData] = useState(null); // Estado para armazenar dados do exame (caso existam)

    const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loader

    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState(''); // 'success' ou 'error'


    const token = localStorage.getItem('token');

    const resetarTela = () => {
        setQrCodeData('');
        setSelectedImage(null);
        setUseCamera(true);
        setIdDoacao('');
        setExameData(null);
        setIsCadastroModalOpen(false);
        setIsVisualizarModalOpen(false);
        console.log("Tela resetada com sucesso!");
    };
    

    // Verifica o QR Code e decide qual modal abrir
    const verificarExame = async () => {
        if (!qrCodeData) {
            setFeedbackMessage('Nenhum QR Code detectado. Certifique-se de que a câmera ou imagem estão corretas.');
            setFeedbackType('error');
            clearFeedback(); // Limpa a mensagem após 5 segundos

            return;
        }
    
        setIsLoading(true); // Ativa o loader
        try {
            const parsedData = JSON.parse(qrCodeData);
    
            if (!parsedData.CodigoDoacao) {
                setFeedbackMessage('O QR Code não contém um Código de Doação válido.');
                setFeedbackType('error');
                clearFeedback(); // Limpa a mensagem após 5 segundos

                return;
            }
    
            const codigoDoacao = parsedData.CodigoDoacao;
            setIdDoacao(codigoDoacao);
    
            setFeedbackMessage(`QR Code processado com sucesso!`);
            setFeedbackType('success');
            clearFeedback(); // Limpa a mensagem após 5 segundos

    
            const response = await api.get(`/exames/${codigoDoacao}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.data.exameLaboratorio) {
                setExameData(response.data.exameLaboratorio);
                setIsVisualizarModalOpen(true);
            } else {
                setIsCadastroModalOpen(true);
            }
        } catch (error) {
            console.error('Erro ao verificar o QR Code:', error);
            setFeedbackMessage('Erro ao processar o QR Code. Verifique o formato ou tente novamente.');
            setFeedbackType('error');
            clearFeedback(); // Limpa a mensagem após 5 segundos

        } finally {
            setIsLoading(false); // Desativa o loader
        }
    };

    const clearFeedback = () => {
        setTimeout(() => {
            setFeedbackMessage('');
            setFeedbackType('');
        }, 5000); // Limpa após 5 segundos
    };
    
    

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setFeedbackMessage('Nenhum arquivo escolhido. Selecione uma imagem válida.');
            setFeedbackType('error');
            clearFeedback(); // Limpa a mensagem após 5 segundos
            return;
        }
    
        setIsLoading(true); // Ativa o loader
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    setSelectedImage(e.target.result); // Exibe a imagem carregada
    
                    // Cria uma imagem para processar
                    const img = new Image();
                    img.src = e.target.result;
    
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
    
                        ctx.drawImage(img, 0, 0, img.width, img.height);
    
                        // Obtem os dados da imagem
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
                        // Usa jsQR para decodificar o QR Code
                        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
    
                        if (qrCode) {
                            console.log('QR Code encontrado:', qrCode.data);
                            setQrCodeData(qrCode.data); // Atualiza o estado com os dados do QR Code
                            setFeedbackMessage('QR Code lido com sucesso!');
                            setFeedbackType('success');
                            clearFeedback(); // Limpa a mensagem após 5 segundos
                        } else {
                            setQrCodeData(''); // Limpa o estado caso o QR Code não seja detectado
                            setFeedbackMessage('Não foi possível ler o QR Code. Tente outra imagem.');
                            setFeedbackType('error');
                            clearFeedback(); // Limpa a mensagem após 5 segundos
                        }
                    };
                } catch (err) {
                    console.error('Erro ao processar a imagem:', err);
                    setFeedbackMessage('Erro ao processar o arquivo. Tente novamente.');
                    setFeedbackType('error');
                    clearFeedback(); // Limpa a mensagem após 5 segundos
                }
            };
    
            reader.readAsDataURL(file); // Converte a imagem para Data URL
        } catch (error) {
            console.error('Erro ao carregar o arquivo:', error);
            setFeedbackMessage('Erro ao carregar o arquivo. Verifique e tente novamente.');
            setFeedbackType('error');
            clearFeedback(); // Limpa a mensagem após 5 segundos
        } finally {
            setIsLoading(false); // Desativa o loader
        }
    };
    ;
    

    return (
        <div className="examesPendentes-container">
            <h1 className="examesPendentes-title">Registrar Exames no Laboratório</h1>
            
            <FeedbackMessage type={feedbackType} message={feedbackMessage} />

            {isLoading ?  (
                <div className='loading-container'>
                    <ClipLoader size={40} color='#0a93a1' />
                    <p>Carregando exame...</p>
                </div>
            ) : (
                useCamera ? (
                    <div className="examesPendentes-scan">
                        <div className="examesPendentes-camera">
                            <QrScanner
                                delay={300}
                                style={{ width: '100%', height: '100%' }}
                                onError={(err) => console.error('Erro ao usar a câmera:', err)}
                                onScan={(data) => data && setQrCodeData(data.text)}
                            />
                        </div>
                        <button
                            className="examesPendentes-btnOption"
                            onClick={() => setUseCamera(false)}
                        >
                            Usar arquivo
                        </button>
                    </div>
                ) : (
                    <div className="examesPendentes-upload">
                        <label className="custom-file-upload">
                            Escolher arquivo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }} // Oculta o input padrão
                            />
                        </label>
                        <p className="upload-text">
                            {selectedImage
                                ? ``
                                : 'Nenhum arquivo escolhido'}
                        </p>
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="QR Code Selecionado"
                                className="examesPendentes-image"
                            />
                        )}
                        {qrCodeData && (
                            <button
                                className="examesPendentes-btnVerify"
                                onClick={verificarExame}
                            >
                                Verificar QR Code
                            </button>
                        )}
                        <button
                            className="examesPendentes-btnBack"
                            onClick={() => setUseCamera(true)}
                        >
                            Voltar para a câmera
                        </button>
                    </div>
                )
            )}

            {/* Modal para cadastro de exame */}
            <ExameLaboratorioModal
                isOpen={isCadastroModalOpen}
                onRequestClose={() => {
                    setIsCadastroModalOpen(false);
                    resetarTela();
                }}
                onSubmitExame={(exameData) => {
                    api.post(
                        '/laboratorio/exame',
                        {
                            ...exameData,
                            idDoacao, // Usa o estado idDoacao
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )
                        .then(() => {
                            setIsCadastroModalOpen(false);
                            resetarTela();
                            setFeedbackMessage('Exame registrado com sucesso.');
                            setFeedbackType('success');
                            clearFeedback(); // Limpa a mensagem após 5 segundos

                        })
                        .catch((err) => {
                            console.error('Erro ao registrar exame:', err.response?.data || err);
                            setFeedbackMessage('Erro ao registrar exame.');
                            setFeedbackType('error');
                            clearFeedback(); // Limpa a mensagem após 5 segundos

                        });
                }}
            />

            {/* Modal para visualizar exame */}
            <VisualizarExame
                isOpen={isVisualizarModalOpen}
                onRequestClose={() => { 
                    setIsVisualizarModalOpen(false);
                    resetarTela();
                }}
                exameData={exameData}
            />
        </div>
    );
};

export default ExamesPendentes;
