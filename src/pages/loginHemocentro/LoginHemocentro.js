import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../services/api';
import './LoginHemocentro.css'
import logo from '../../images/IconeAmigoSangueBranco.png';
import wave from './wave.png';

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
      <div className="side-img">
            <img src={logo} />
            <img src={wave} id="wave"/>
      </div>
      <div className="content">
        <form onSubmit={handleLogin} className='form-login'>
          <h2>Login do Hemocentro</h2>
          {error && <p className="error">{error}</p>}
          <div className="inputDiv">
            <input type="text" id="emailInput" placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
            <label htmlFor="emailInput">Email</label>
          </div>
          <div className="inputDiv">
            <input
              type="password"
              id="senhaInput"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <label htmlFor="senhaInput">Senha</label>
          </div>

          <button type="submit">Entrar</button>
          <Link to="/cadastro/hemocentro" className="register-link">
            Não tem cadastro? Cadastre-se aqui
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginHemocentro;
