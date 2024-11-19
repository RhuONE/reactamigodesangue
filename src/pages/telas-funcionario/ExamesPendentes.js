import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import './ExamesPendentes.css';
import api from '../../services/api';
import ExameLaboratorioModal from '../../components/telas-funcionario/ExameLaboratorioModal';
import VisualizarExame from '../../components/telas-funcionario/VisualizarExame';

const ExamesPendentes = () => {
    const [qrCodeData, setQrCodeData] = useState('');
    const [useCamera, setUseCamera] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // Estado para a imagem selecionada
    const [idDoacao, setIdDoacao] = useState(''); // Estado para armazenar o ID da doação
    const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
    const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
    const [exameData, setExameData] = useState(null); // Estado para armazenar dados do exame (caso existam)

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
            alert('QR Code não processado. Verifique a imagem ou tente novamente.');
            return;
        }

        // Extrai o ID da Doação do QR Code
        try {
            const parsedData = JSON.parse(qrCodeData); // Tenta interpretar o JSON do QR Code
            const codigoDoacao = parsedData.CodigoDoacao; // Extrai o valor do campo "CodigoDoacao"
            setIdDoacao(codigoDoacao); // Atualiza o estado com o ID da doação
            console.log('ID da Doação extraído do QR Code:', codigoDoacao);

            // Verifica se o exame já existe para a doação
            const response = await api.get(`/exames/${codigoDoacao}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Resposta da API ao verificar exame:', response.data);

            if (response.data.exameLaboratorio) {
                setExameData(response.data.exameLaboratorio); // Salva os dados do exame
                setIsVisualizarModalOpen(true); // Exibe o modal de visualização
            } else {
                setIsCadastroModalOpen(true); // Exibe o modal de cadastro
            }
        } catch (error) {
            console.error('Erro ao verificar o exame:', error);
            alert('Erro ao verificar o QR Code. Tente novamente.');
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                // Exibe a imagem carregada como Data URL
                setSelectedImage(e.target.result); // Atualiza a URL para exibição da imagem

                // Cria uma imagem para processar
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Obtem os dados da imagem
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    // Usa jsQR para decodificar o QR Code
                    const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

                    if (qrCode) {
                        console.log('QR Code encontrado:', qrCode.data);
                        setQrCodeData(qrCode.data);
                        alert(`QR Code lido com sucesso: ${qrCode.data}`);
                    } else {
                        alert('Não foi possível ler o QR Code. Tente outra imagem.');
                        setQrCodeData('');
                    }
                };
            } catch (error) {
                console.error('Erro ao processar a imagem:', error);
                alert('Erro ao processar o arquivo. Tente novamente.');
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="examesPendentes-container">
            <h1 className="examesPendentes-title">Registrar Exames no Laboratório</h1>

            {useCamera ? (
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
                        />
                    </label>
                    <p className="upload-text">
                        {selectedImage ? 'Arquivo selecionado!' : 'Nenhum arquivo escolhido'}
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
                            alert('Exame registrado com sucesso!');
                        })
                        .catch((err) => {
                            console.error('Erro ao registrar exame:', err.response?.data || err);
                            alert('Erro ao registrar exame.');
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
