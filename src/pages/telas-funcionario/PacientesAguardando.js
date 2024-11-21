import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './PacientesAguardando.css';



const PacientesAguardando = () => {
    const [senhaAtual, setSenhaAtual] = useState(null);
    const [tipoSenha, setTipoSenha] = useState('');
    const [statusSenha, setStatusSenha] = useState('');
    const [historicoSenhas, setHistoricoSenhas] = useState([]);

    // Função para buscar a senha mais recente chamada e o histórico de senhas
    const fetchSenhaAtual = () => {
        api.get('/senhas/ultima-chamada', {
            params: {
                idHemocentro: localStorage.getItem('idHemocentro'),
            },
        })
            .then(response => {
                const { senhaAtual, historicoSenhas } = response.data;
    
                setSenhaAtual(senhaAtual.senha.descSenha);
                setTipoSenha(senhaAtual.senha.tipoSenha);
                setStatusSenha(senhaAtual.statusDoacao);
    
                // Converte o objeto `historicoSenhas` em um array
                const historicoArray = Object.values(historicoSenhas);
                setHistoricoSenhas(historicoArray);
            })
            .catch(error => {
                console.error('Erro ao buscar a senha atual:', error);
            });
    };
    
    

    

    // Polling: busca a senha chamada a cada 5 segundos
    useEffect(() => {
        fetchSenhaAtual();
        const interval = setInterval(fetchSenhaAtual, 5000);
        return () => clearInterval(interval);  // Limpar o intervalo ao desmontar o componente
    }, []);

    return (
        <div className="pacientes-aguardando-container">
            <h1 className="pacientes-aguardando-titulo">Senha Atual</h1>
            {senhaAtual ? (
                <div className="pacientes-aguardando-senha-display">
                    <h2>Sua senha: <span className="pacientes-aguardando-senha">{senhaAtual}</span></h2>
                    <p>Status: <span className='pacientes-aguardando-tipo'>{statusSenha}</span> </p>
                </div>
            ) : (
                <p>Aguardando chamada...</p>
            )}

            {/* Histórico das últimas senhas chamadas */}
            {historicoSenhas.length > 0 && (
                <div className="pacientes-aguardando-historico">
                    <h3>Últimas Senhas Chamadas</h3>
                    <ul className="pacientes-aguardando-historico-lista">
                        {historicoSenhas.map((senha, index) => (
                            <li key={index} className="pacientes-aguardando-historico-item">
                                <span className="pacientes-aguardando-historico-senha">{senha.senha?.descSenha}</span>
                                <span className="pacientes-aguardando-historico-tipo"> - {senha.statusDoacao}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PacientesAguardando;
