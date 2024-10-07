import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './HemocentroInformacoes.css';
import EditHemocentroModal from '../components/EditHemocentroModal';
import { useNavigate, Link } from 'react-router-dom';

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

    useEffect(() => {
        const fetchHemocentroInfo = async () => {

            const token = localStorage.getItem('token'); // Assumindo que o token é armazenado no localStorage
          console.log(token);
          const tipoUsuario = localStorage.getItem('tipoUsuario');
          console.log(tipoUsuario);
          if (!token) {
            // Se o token não estiver presente, redireciona para a tela de login
            navigate('/login/hemocentro');
            return;
          }
          if (tipoUsuario !== 'hemocentro') {
            // Se o tipo de usuário não for hemocentro, redireciona para o login
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
