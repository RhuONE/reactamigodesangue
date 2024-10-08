import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './HemocentroCampanhas.css';
<<<<<<< Updated upstream
=======
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import CadastrarCampanhaModal from '../components/CadastrarCampanhaModal';
>>>>>>> Stashed changes

const HemocentroCampanhas = () => {
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
<<<<<<< Updated upstream
=======
    const navigate = useNavigate(); // Hook para redirecionar
    const [showModal, setShowModal] = useState(false);

>>>>>>> Stashed changes

    useEffect(() => {
        const fetchCampanhas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/hemocentro/campanhas', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCampanhas(response.data || []); // Certifique-se de que `campanhas` seja um array
                setError(null);
            } catch (error) {
                setError('Erro ao carregar campanhas. Tente novamente mais tarde.');
                console.error('Erro ao buscar campanhas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampanhas();
    }, []);

    const handleAddCampanha = async (formData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.post('/campanha', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCampanhas([...campanhas, response.data.data]);
        } catch (error) {
            console.error('Erro ao cadastrar campanha:', error);
        }
    }

    return (
        <div className="campanhas-content">
            <h1>Campanhas do Hemocentro</h1>
            {loading ? (
                <div>Carregando campanhas...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="campanhas-list">
                    {campanhas.length === 0 ? (
                        <p>Não há campanhas cadastradas.</p>
                    ) : (
                        campanhas.map((campanha) => (
                            <div key={campanha.idCampanha} className="campanha-card">
                                <h3>{campanha.tituloCampanha}</h3>
                                <p><strong>Data de Início:</strong> {campanha.dataInicioCampanha}</p>
                                <p><strong>Data de Término:</strong> {campanha.dataFimCampanha}</p>
                                <p><strong>Descrição:</strong> {campanha.descCampanha}</p>
                            </div>
                        ))
                    )}
                    <button className="add-campanha-button" onClick={() => setShowModal(true)}>
                      Adicionar Campanha
                    </button>

                    <CadastrarCampanhaModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onSave={handleAddCampanha}
                    />
                </div>
            )}
        </div>
    );
};

export default HemocentroCampanhas;
