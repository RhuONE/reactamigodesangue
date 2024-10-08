import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ estoques }) => {
    if (!estoques || estoques.length === 0) {
        return <div>Nenhum dado de estoque disponível.</div>;
    }

    const labels = estoques.map((estoque) => estoque.tipoSanguineo);
    const data = estoques.map((estoque) => estoque.quantidadeMLTotal);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Quantidade de Sangue (ml)',
                data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '100%', height: '100%'}}>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;
