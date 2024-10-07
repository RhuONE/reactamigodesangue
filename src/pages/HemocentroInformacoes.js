import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './HemocentroInformacoes.css';
import EditHemocentroModal from '../components/EditHemocentroModal';

const HemocentroInformacoes = () => {
    const [hemocentro, setHemocentro] = useState({
        nomeHemocentro: '',
        logHemocentro: '',
        numLogHemocentro: '',
        cidadeHemocentro: '',
        estadoHemocentro: '',
        cepHemocentro: '',
        telHemocentro: '',
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchHemocentroInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/hemocentro/perfil', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHemocentro(response.data);
            } catch (error) {
                console.error('Erro ao buscar informações do hemocentro:', error);
            }
        };

        fetchHemocentroInfo();
    }, []);

    const handleSaveChanges = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            await api.put('/hemocentro/update', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHemocentro(updatedData);
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar alterações do hemocentro:', error);
        }
    };

    return (
        <div className="informacoes-hemocentro-content">
            <h1>Informações do Hemocentro</h1>
            <div className="hemocentro-info-card">
                <h2>{hemocentro.nomeHemocentro}</h2>
                <p><strong>Endereço:</strong> {hemocentro.logHemocentro}, {hemocentro.numLogHemocentro}</p>
                <p><strong>Cidade:</strong> {hemocentro.cidadeHemocentro}, {hemocentro.estadoHemocentro}</p>
                <p><strong>CEP:</strong> {hemocentro.cepHemocentro}</p>
                <p><strong>Telefone:</strong> {hemocentro.telHemocentro}</p>
                <button className="edit-button" onClick={() => setShowModal(true)}>Alterar Informações</button>
            </div>

            <EditHemocentroModal
                hemocentro={hemocentro}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveChanges}
            />
        </div>
    );
};

export default HemocentroInformacoes;
