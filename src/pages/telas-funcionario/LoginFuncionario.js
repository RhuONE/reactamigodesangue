import React, { useState } from 'react';
import api from '../../services/api'; // Importa a configuração da API
import './LoginFuncionario.css'; // Importa o arquivo CSS para estilização
import { useNavigate } from 'react-router-dom';

const LoginFuncionario = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

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
                navigate('/estoque/estoque-sangue')
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            // Exibe mensagem de erro se as credenciais estiverem incorretas
            setErrorMessage('Email ou senha incorretos. Tente novamente.');
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
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="login-btn">Entrar</button>
            </form>
        </div>
    );
};

export default LoginFuncionario;
