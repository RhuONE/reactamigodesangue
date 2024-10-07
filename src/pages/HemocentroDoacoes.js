import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './HemocentroDoacoes.css';

const Doacoes = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoacoes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/hemocentro/doacoes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDoacoes(response.data);
                setLoading(false);
                setError(null);
            } catch (error) {
                setError('Erro ao carregar doações. Tente novamente mais tarde.');
                console.error('Erro ao buscar doações:', error);
                setLoading(false);
            }
        };

        fetchDoacoes();
    }, []);

    return (
        <div className="doacoes-content">
            <h1>Lista de Doações</h1>
            {loading ? (
                <div>Carregando...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <table className="doacoes-table">
                    <thead>
                        <tr>
                            <th>ID Doação</th>
                            <th>Quantidade (ml)</th>
                            <th>Tipo Sanguíneo</th>
                            <th>Tipo Doação</th>
                            <th>Observação</th>
                            <th>Status</th>
                            <th>Data da Doação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doacoes.map((doacao) => (
                            <tr key={doacao.idDoacao}>
                                <td>{doacao.idDoacao}</td>
                                <td>{doacao.quantidadeMlDoacao}</td>
                                <td>{doacao.tipoSanguineoDoacao}</td>
                                <td>{doacao.tipoDoacao}</td>
                                <td>{doacao.observacaoDoacao}</td>
                                <td>{doacao.statusDoacao}</td>
                                <td>{new Date(doacao.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Doacoes;
