import React, { useState } from 'react';
import api from '../../services/api'; // Importa a configuração da API
import './LoginFuncionario.css'; // Importa o arquivo CSS para estilização
import { useNavigate } from 'react-router-dom';

import { ClipLoader } from 'react-spinners'; // Importando o spinner


const LoginFuncionario = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Envia as credenciais para a API de autenticação
        try {
            const response = await api.post('/login', {
                email,
                senha,
            });

            // Se o login for bem-sucedido, o token e outras informações serão retornados
            const { token, funcao, idHemocentro } = response.data;

            // Armazena o token JWT no localStorage ou sessionStorage
            localStorage.setItem('token', token);
            localStorage.setItem('funcao', funcao); // Salva a função do usuário
            localStorage.setItem('idHemocentro', idHemocentro); // Salva o hemocentro associado

            // Redireciona para a página correta com base na função do usuário
            if (funcao === 'recepcao') {
                navigate('/recepcao/recepcao');
            } else if (funcao === 'triagem') {
                navigate('/triagem/chamar-senhas');
            } else if (funcao === 'totem') {
                navigate('/totem');
            } else if (funcao === 'entrevista') {
                navigate('/entrevista/chamar-senhas')
            } else if (funcao === 'coleta') {
                navigate('/coleta/chamar-senhas')
            } else if (funcao === 'laboratorio') {
                navigate('/laboratorio/exames-pendentes')
            } else if (funcao === 'estoque') {
                navigate('/estoquista/pendentes')
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            // Exibe mensagem de erro se as credenciais estiverem incorretas
            setErrorMessage('Email ou senha incorretos. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Login de Funcionário</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="text" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="Digite seu email" 
                        disabled={isLoading} // Desativa enquanto está carregando
                    />
                </div>
                <div className="form-group">
                    <label>Senha:</label>
                    <input 
                        type="password" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                        required 
                        placeholder="Digite sua senha" 
                        disabled={isLoading} // Desativa enquanto está carregando
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="login-btn">
                    {isLoading ? (
                        <ClipLoader size={16} color='#fff' />
                    ) : (
                        'Entrar'
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginFuncionario;
