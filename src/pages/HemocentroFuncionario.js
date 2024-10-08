import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './HemocentroFuncionario.css';
import CadastrarFuncionarioModal from '../components/CadastrarFuncionarioModal';
import { useNavigate, Link } from 'react-router-dom';


const HemocentroFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {

        const fetchFuncionarios = async () => {

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

    const handleAddFuncionario = async (formData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.post('/funcionario', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFuncionarios([...funcionarios, response.data.data]); // Adiciona o novo funcionário à lista
            setShowModal(false); // Fecha o modal após a criação
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error.response);
            if (error.response && error.response.data && error.response.data.errors) {
                throw error; // Lança o erro para ser capturado pelo modal
            }
        }
    }

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
            <div className="header-content">
                <h1>Funcionários do Hemocentro</h1>
                <button className="add-funcionario-btn" onClick={() => setShowModal(true)}>
                    Adicionar Funcionário
                </button>
            </div>
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
    
            <CadastrarFuncionarioModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleAddFuncionario}
            />
        </div>
    );
    
};

export default HemocentroFuncionarios;
