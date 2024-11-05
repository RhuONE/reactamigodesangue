import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './FormularioTriagem.css';
import { useNavigate } from 'react-router-dom';

const FormularioTriagem = ({ match }) => {
    const [pressaoArterial, setPressaoArterial] = useState('');
    const [frequenciaCardiaca, setFrequenciaCardiaca] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [peso, setPeso] = useState('');
    const [aptidao, setAptidao] = useState('Apto');
    const navigate = useNavigate();

    // Verificação de credenciais
    useEffect(() => {
        const token = localStorage.getItem('token');
        const funcao = localStorage.getItem('funcao');

        if (!token || funcao !== 'triagem') {
            // Se não houver token ou a função não for "triagem", redireciona para a tela de login
            navigate('/login/funcionario');
        }
    }, [navigate]);

    // Função para enviar os dados da triagem para o backend
    const enviarDadosTriagem = (e) => {
        e.preventDefault();

        const dados = {
            pressaoArterial,
            frequenciaCardiaca,
            temperatura,
            peso,
            aptidao
        };

        api.post(`/triagem/${match.params.id}`, dados, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                alert('Triagem realizada com sucesso!');
                // Redireciona para a próxima etapa ou finaliza o atendimento
            })
            .catch(error => {
                console.error('Erro ao realizar a triagem:', error);
            });
    };

    return (
        <div className="formulario-triagem-container">
            <h1>Dados da Triagem</h1>
            <form onSubmit={enviarDadosTriagem}>
                <div className="form-group">
                    <label>Pressão Arterial:</label>
                    <input
                        type="text"
                        value={pressaoArterial}
                        onChange={(e) => setPressaoArterial(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Frequência Cardíaca:</label>
                    <input
                        type="text"
                        value={frequenciaCardiaca}
                        onChange={(e) => setFrequenciaCardiaca(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Temperatura:</label>
                    <input
                        type="text"
                        value={temperatura}
                        onChange={(e) => setTemperatura(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Peso:</label>
                    <input
                        type="text"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Aptidão para Doação:</label>
                    <select
                        value={aptidao}
                        onChange={(e) => setAptidao(e.target.value)}
                        required
                    >
                        <option value="Apto">Apto</option>
                        <option value="Inapto">Inapto</option>
                    </select>
                </div>
                <button type="submit" className="formulario-btn">Finalizar Triagem</button>
            </form>
        </div>
    );
};

export default FormularioTriagem;
