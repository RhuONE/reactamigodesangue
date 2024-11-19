import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './HemocentroDoacoes.css';

import { useNavigate, Link } from 'react-router-dom';

const Doacoes = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoacoes = async () => {

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

            try {
                
                const response = await api.get('/hemocentro/doacoes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseFuncionarios = await api.get('/hemocentro/funcionariosAtivo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFuncionarios(responseFuncionarios.data); // Salva os funcionários para usar no dropdown


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
                           
                            <th>Quantidade (ml)</th>
                            <th>Tipo Sanguíneo</th>
                            
                            <th>Data da Doação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doacoes.map((doacao) => (
                            <tr key={doacao.idDoacao}>
                                
                                <td>{doacao.coleta.quantidadeMl}</td>
                                <td>{doacao.exame_laboratorio.tipoSanguineo}</td>
                        
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
