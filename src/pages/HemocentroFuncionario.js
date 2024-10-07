import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './HemocentroFuncionario.css';

const HemocentroFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/hemocentro/funcionarios', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFuncionarios(response.data);
                setError(null);
            } catch (error) {
                setError('Erro ao carregar lista de funcionários. Tente novamente mais tarde.');
                console.error('Erro ao buscar funcionários:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFuncionarios();
    }, []);

    if (loading) {
        return (
            <div className="loader-container">
                <p>Carregando...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="funcionarios-content">
            <h1>Funcionários do Hemocentro</h1>
            <table className="funcionarios-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionarios.map((funcionario) => (
                        <tr key={funcionario.idFuncionario}>
                            <td>{funcionario.idFuncionario}</td>
                            <td>{funcionario.nomeFuncionario}</td>
                            <td>{funcionario.cpfFuncionario}</td>
                            <td>{funcionario.emailFuncionario}</td>
                            <td>{funcionario.statusFuncionario}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HemocentroFuncionarios;
