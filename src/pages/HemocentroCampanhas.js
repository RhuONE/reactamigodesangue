import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './HemocentroCampanhas.css';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário


const HemocentroCampanhas = () => {
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para redirecionar

    useEffect(() => {
        const fetchCampanhas = async () => {
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
                </div>
            )}
        </div>
    );
};

export default HemocentroCampanhas;
