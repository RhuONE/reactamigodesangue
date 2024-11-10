import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import './DoadorDetalhesModal.css';

const DoadorDetalhesModal = ({ isOpen, onRequestClose, doador }) => {
    const [fotoPreview, setFotoPreview] = useState(null);
    const [dataTratada, setDataTratada] = useState(null);

    useEffect(() => {
        if (doador?.fotoUsuario) {
            const baseUrl = 'http://localhost:8000/storage/';
            setFotoPreview(`${baseUrl}${doador.fotoUsuario}`);
        } else {
            setFotoPreview(null);
        }

        if (doador?.dataNascUsuario) {
            setDataTratada(doador.dataNascUsuario.split(' ')[0]);
        }

    }, [doador]);

    if (!isOpen || !doador) return null;

    return (
        <div className="doadorDetalhes-modal">
            <div className="doadorDetalhes-content">
                <div className="exibirEditarModal-etapa">
                    <div className='exibirEditarModal-btn-container'>
                        <h2 className="exibirEditarModal-header">Doador</h2>
                        <AiOutlineClose className='doadorDetalhesModal-fechar' onClick={onRequestClose} size={22} style={{ marginRight : '10px'}}/>
                    </div>
                    <div className='centralizado'>
                        <div className='exibirEditarModal-foto-container'>
                            <img 
                                src={fotoPreview || 'http://localhost:8000/storage/uploads/usuarios/perfil-padrao.jpg'} 
                                alt="Foto do usuário" 
                                className="foto-preview" 
                            />
                        </div>
                    </div>
                    <input
                        className="doadorDetalhesModal-input"
                        value={doador.nomeUsuario}
                        placeholder="Nome"
                        disabled
                    />
                    <input
                        className="doadorDetalhesModal-input"
                        value={doador.cpfUsuario}
                        placeholder="CPF"
                        disabled
                    />
                    <input
                        className="doadorDetalhesModal-input"
                        type="date"
                        value={dataTratada}
                        placeholder="Data de Nascimento"
                        disabled
                    />
                    <input
                        className="doadorDetalhesModal-input"
                        value={doador.generoUsuario}
                        disabled
                    />
                </div>
            </div>
        </div>
    );
};

export default DoadorDetalhesModal;
