import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ estoques }) => {
    if (!estoques || estoques.length === 0) {
        return <div>Nenhum dado de estoque disponível.</div>;
    }

    const labels = estoques.map((estoque) => estoque.tipoSanguineo);
    const data = estoques.map((estoque) => estoque.quantidadeMlTotal);

    // Define as cores para as barras
    const backgroundColors = estoques.map((estoque) =>
        estoque.quantidadeMlTotal < 1500 ? '#f57878' : '#78bdf5'
    );

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Quantidade de Sangue (ml)',
                
                data,
                backgroundColor: backgroundColors,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: (context) => {
                        const quantidade = data[context.index];
                        return quantidade < 1500 ? '#FF0000' : '#000000';
                    },
                    font : {
                        size: 16,
                    },
                },
            },
            y: {
                ticks: {
                    color: '#000000',
                    
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default BarChart;
