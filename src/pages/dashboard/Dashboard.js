import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import MetricCard from '../../components/MetricCard';
import DonationChart from '../../components/DonationChart';
import BloodTypeChart from '../../components/BloodTypeChart';
import UserGrowthChart from '../../components/UserGrowthChart';
import { toast, ToastContainer } from 'react-toastify'; // Importando Toastify
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaHospital, FaHeartbeat, FaClipboard } from 'react-icons/fa';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {

    const [metrics, setMetric] = useState({
        totalUsuarios : 0,
        totalHemocentros: 0,
        totalDoacoes: 0,
        campanhasAtivas: 0,
    });

    const [error, setError] = useState(null);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/dashboard/metrics'); // Ou a rota das métricas real
                setMetric({
                    totalUsuarios: response.data.totalUsuarios,
                    totalHemocentros: response.data.totalHemocentros,
                    totalDoacoes: response.data.totalDoacoes,
                    campanhasAtivas: response.data.campanhasAtivas,
                });
                setError(null);
                if (!loading) {
                  toast.success('Dados carregados com sucesso!'); //Notificação de sucesso
                }
            } catch (error) {
                setError('Erro ao carregas as métricas. Tente novamente mais tarde.');
                console.error('Error ao buscar métricas', error);
                toast.error('Erro ao carregar dados. Tente novamente.'); //Notificação de erro
            } finally {
              setLoading(false); //Sempre finalizar o carregamento
            }
        };

        fetchMetrics();
    }, [loading]);
  return (
    
    <div className="dashboard-content">
      <ToastContainer /> {/** Container para exibir notificações */}
      <h1>Dashboard</h1>
      <p>Bem-Vindo/a</p>
      <h2>Administrador/a</h2>
      {loading ? (
        <div className='loader-container'>
          <ClipLoader color='#2c3e50' loading={loading} size={50} />
        </div>
      ) : error ? (
        <div className='error-message'>{error}</div>
      ) : (
        <>
          <div className="dashboard-metrics">
            <MetricCard title="Total de Usuários" value={metrics.totalUsuarios} icon={<FaUser />} />
            <MetricCard title="Total de Hemocentros" value={metrics.totalHemocentros} icon={<FaHospital />} />
            <MetricCard title="Doações Realizadas" value={metrics.totalDoacoes} icon={<FaHeartbeat />} />
            <MetricCard title="Campanhas Ativas" value={metrics.campanhasAtivas} icon={<FaClipboard />} />
          </div>
          <DonationChart />
          <BloodTypeChart />
          <UserGrowthChart />
        </>
      )}
    </div>
  );
}

export default Dashboard;
