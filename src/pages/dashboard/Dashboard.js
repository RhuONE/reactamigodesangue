import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import MetricCard from '../../components/MetricCard';
import DonationChart from '../../components/DonationChart';
import BloodTypeChart from '../../components/BloodTypeChart';
import UserGrowthChart from '../../components/UserGrowthChart';
import { toast, ToastContainer } from 'react-toastify'; // Importando Toastify
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import { FaUser, FaHospital, FaHeartbeat, FaClipboard } from 'react-icons/fa';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Hook para redirecionar
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
          const token = localStorage.getItem('token'); // Assumindo que o token é armazenado no localStorage
          console.log(token);
          const tipoUsuario = localStorage.getItem('tipoUsuario');
          console.log(tipoUsuario);
          if (!token) {
            // Se o token não estiver presente, redireciona para a tela de login
            navigate('/login');
            return;
          }
          if (tipoUsuario !== 'administrador') {
            // Se o tipo de usuário não for administrador, redireciona para o login
            navigate('/login');
            return;
          }

            try {
                const response = await api.get('/dashboard/metrics', {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }); // Ou a rota das métricas real
                
               

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
    
    <div className="ADM-dashboard-content">
      <ToastContainer /> {/** Container para exibir notificações */}
      <h1>Dashboard</h1>
      {loading ? (
        <div className='loader-container'>
          <ClipLoader color='#2c3e50' loading={loading} size={50} />
        </div>
      ) : error ? (
        <div className='error-message'>{error}</div>
      ) : (
        <>
          <div className="ADM-dashboard-metrics">
            <MetricCard title="Total de Usuários" value={metrics.totalUsuarios} icon={<FaUser />} />
            <MetricCard title="Total de Hemocentros" value={metrics.totalHemocentros} icon={<FaHospital />} />
            <MetricCard title="Doações Realizadas" value={metrics.totalDoacoes} icon={<FaHeartbeat />} />
            <MetricCard title="Campanhas Ativas" value={metrics.campanhasAtivas} icon={<FaClipboard />} />
          </div>
          <div className='dashboard-cards'>
            <div className='dashboard-graphChart'>
              <h3>Doações Realizadas</h3>
              <DonationChart />
            </div>
            <div className='dashboard-graphChart'>
            <h3>Distribuição Tipos Sanguineos (Doador)</h3>
              <BloodTypeChart />
            </div>
            <div className='dashboard-graphChart'>
            <h3>Cadastros Realizados</h3>
              <UserGrowthChart />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
