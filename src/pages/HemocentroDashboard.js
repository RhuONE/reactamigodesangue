import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import MetricCard from '../components/MetricCard';
import api from '../services/api';
import './HemocentroDashboard.css';
import BarChart from '../components/BarChart';
import SidebarHemocentro from '../components/SidebarHemocentro';
import { useNavigate, Link } from 'react-router-dom';

const HemocentroDashboard = () => {
    const [metrics, setMetrics] = useState({
        totalDoacoes: 0,
        campanhasAtivas: 0,
    });

    const [estoques, setEstoques] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
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
            setLoading(true);
            try {
                
    
                // Fetch Metrics
                const metricsResponse = await api.get('/hemocentro/metrics', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMetrics(metricsResponse.data.data);
    
                // Fetch Estoques
                const estoquesResponse = await api.get('/hemocentro/estoque-sangue', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEstoques(estoquesResponse.data.data);
    
                setError(null);
            } catch (error) {
                setError('Erro ao carregar dados do hemocentro. Tente novamente mais tarde.');
                console.error('Erro ao buscar dados', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchAllData();
    }, []);
    

    return (

        <div className='dashboard-container'>
            
            <div className="dashboard-content">
                <h1>Dashboard do Hemocentro</h1>
                {loading ? (
                    <div className="loader-container">
                        <ClipLoader color="#2c3e50" loading={loading} size={50} />
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <div className="dashboard-metrics">
                            <MetricCard title="Total de Doações" value={metrics.totalDoacoes} />
                            <MetricCard title="Campanhas Ativas" value={metrics.campanhasAtivas} />
                        </div>
                        <div className='estoque-container'>
                            <h2>Nível de Estoque</h2>
                            <BarChart estoques={estoques} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HemocentroDashboard;
