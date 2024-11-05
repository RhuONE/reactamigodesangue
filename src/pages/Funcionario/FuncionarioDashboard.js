import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './FuncionarioDashboard.css'; // Arquivo CSS para estilização

const FuncionarioDashboard = () => {
    const [totalDoacoes, setTotalDoacoes] = useState(0);
    const [doacoesPorTipo, setDoacoesPorTipo] = useState([]);
    const [mediaDoacoesMes, setMediaDoacoesMes] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/funcionariodashboard/dashboard', {
                    headers: {
                        Authorization: `Bearer 179|7wdQfaEGPu57TXp6adv7VoM5TWVyRvXKiyIXS6Xpca5c05d5`,
                    },
                });
                
                // Atualizar as métricas
                setTotalDoacoes(response.data.totalDoacoes);
                setDoacoesPorTipo(response.data.doacoesPorTipo);
                setMediaDoacoesMes(response.data.mediaDoacoesMes);
                setLoading(false);
            } catch (error) {
                setError('Erro ao carregar os dados da dashboard.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="card">
                <h2>Total de Doações</h2>
                <p>{totalDoacoes}</p>
            </div>

            <div className="card">
                <h2>Doações por Tipo Sanguíneo</h2>
                <ul>
                    {doacoesPorTipo.map((tipo) => (
                        <li key={tipo.tipo}>{tipo.tipo}: {tipo.quantidade}</li>
                    ))}
                </ul>
            </div>

            <div className="card">
                <h2>Média de Doações por Mês</h2>
                <p>{mediaDoacoesMes}</p>
            </div>
        </div>
    );
};

export default FuncionarioDashboard;
