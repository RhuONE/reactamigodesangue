import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './HemocentroInformacoes.css';
import EditHemocentroModal from '../components/EditHemocentroModal';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    // Função fetchHemocentroInfo extraída para reutilização
    const fetchHemocentroInfo = async () => {
        const token = localStorage.getItem('token');
        const tipoUsuario = localStorage.getItem('tipoUsuario');

        if (!token || tipoUsuario !== 'hemocentro') {
            navigate('/login/hemocentro');
            return;
        }

        try {
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

    // Chame a função no useEffect para carregar os dados na primeira renderização
    useEffect(() => {
        fetchHemocentroInfo();
    }, []);

    const handleSaveChanges = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
    
            const formData = new FormData();
            Object.keys(updatedData).forEach(key => {
                formData.append(key, updatedData[key] ?? '');
            });
    
            await api.post('/hemocentro/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            // Atualizar as informações após salvar as mudanças
            await fetchHemocentroInfo();

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
                <img 
                    style={{width: 200}}
                    src={`http://179.63.40.44:8000/storage/${hemocentro.fotoHemocentro || 'uploads/hemocentros/foto-generica-hemocentro.webp'}`}
                    alt="Banner do hemocentro"
                />
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
