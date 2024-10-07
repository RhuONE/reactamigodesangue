import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../services/api';

const LoginHemocentro = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
const navigate = useNavigate();  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/login', {
        email,
        senha,
      });
      if (response.data.tipoUsuario !== 'hemocentro') {
        toast.error('Erro ao realizar login. Login impróprio.');
        return;
      }
      // Armazena o token no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tipoUsuario', response.data.tipoUsuario);
      // Redireciona para o dashboard do hemocentro após o login bem-sucedido
      navigate('/hemocentro/dashboard');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Erro ao conectar-se com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login do Hemocentro</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      <Link to="/cadastro/hemocentro" className="register-link">
        Não tem cadastro? Cadastre-se aqui
      </Link>
    </div>
  );
};

export default LoginHemocentro;
