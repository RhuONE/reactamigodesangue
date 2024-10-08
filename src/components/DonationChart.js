import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import api from '../services/api';
  // Registrar os componentes necessários
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const DonationChart = () => {

    const [donationData, setDonationData] = useState([]);

    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                const response = await api.get('/dashboard/doacoes'); //Rota de doacoes
                setDonationData(response.data); // Exemplo [{month: 'Janeiro', count: 10}, ...]
            } catch (error){
                console.error('Erro ao buscar dados de doações', error);
            }
        };

        fetchDonationData();
    }, []);

  const data = {

    labels: donationData.map((item) => item.mes),
    datasets: [
      {
        label: 'Doações Realizadas',
        data: donationData.map((item) => item.quantidade), // Exemplo de dados
        backgroundColor: 'rgba(24, 188, 156, 0.5)',
        borderColor: 'rgba(24, 188, 156, 1)',
        borderWidth: 1,
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default DonationChart;
