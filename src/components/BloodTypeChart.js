import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import api from '../services/api';

// Registrar componentes necessários para o gráfico de pizza
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const BloodTypeChart = () => {
    const [bloodTypeData, setBloodTypeData] = useState([]);

    useEffect(() => {
        const fetchBloodTypeData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get('/dashboard/tipos-sanguineos', {
                  headers : {
                    Authorization: `Bearer ${token}`,
                  },
                });
                setBloodTypeData(response.data); // Exemplo: [{ descTipoSanguineo: 'O+', quantidade: 40 }, ...]
            } catch (error) {
                console.error('Erro ao buscar dados dos tipos sanguíneos:', error);
            }
        };

        fetchBloodTypeData();
    }, []);

    const data = {
        labels: bloodTypeData.map((item) => item.descTipoSanguineo),
        datasets: [
            {
                label: 'Distribuição de Tipos Sanguíneos',
                data: bloodTypeData.map((item) => item.quantidade),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(201, 203, 207, 0.6)',
                    'rgba(120, 46, 139, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)',
                    'rgba(120, 46, 139, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            datalabels: {
                color: '#ffffff', // Cor dos rótulos dentro das fatias
                font: {
                    size: 18, // Tamanho da fonte dos rótulos
                },
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    return label; // Exibe o tipo sanguíneo dentro da fatia
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <Pie data={data} options={options} />
        </div>
    );
};

export default BloodTypeChart;
