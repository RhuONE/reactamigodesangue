import React, { useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';

// Registrar os componentes necessários para o gráfico de linha
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserGrowthChart = () => {

    const [userGrowthData, setUserGrowthData] = useState([]);
    const [hemocentroGrowthData, setHemocentroGrowthData] = useState([]);

    useEffect(() => {
        const fetchUserGrowthData = async () => {
          const token = localStorage.getItem('token');
            try {
                const response = await api.get('/dashboard/crescimento-usuario', {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }); // Rota de crescimento de usuário
                setUserGrowthData(response.data); // Exemplo: [{ month: 'Janeiro', count: 100}, . . .]
            } catch (error) {
                console.error('Erro ao buscar dados de crescimento de usuários:', error);
            }
        };

        const fetchHemocentroGrowthData = async () => {
          const token = localStorage.getItem('token');
            try {
                const response = await api.get('/dashboard/crescimento-hemocentro', {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }); // Rota de crescimento de usuário
                setHemocentroGrowthData(response.data); // Exemplo: [{ month: 'Janeiro', count: 100}, . . .]
            } catch (error) {
                console.error('Erro ao buscar dados de crescimento de hemocentros:', error);
            }
        };

        fetchHemocentroGrowthData();
        fetchUserGrowthData();
    }, []);

  const data = {
    labels: userGrowthData.map((item) => item.mes),
    datasets: [
      {
        label: 'Doadores',
        data: userGrowthData.map((item) => item.quantidade), // Exemplo de crescimento de doadores
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6  )',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4, // Suaviza a linha
      },{
        label: 'Hemocentros',
        data: hemocentroGrowthData.map((item) => item.quantidade), // Exemplo de crescimento de doadores
        fill: false,
        backgroundColor: '#d00e0e66',
        borderColor: '#d00e0e',
        tension: 0.4, // Suaviza a linha
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default UserGrowthChart;
