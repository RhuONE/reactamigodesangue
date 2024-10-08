import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Assumindo que seu axios já está configurado
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import logo from '../../images/LogoAmgSangue.png';

const Login = () => {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login', { email, senha });
      if (response.data.tipoUsuario ===  'hemocentro') {
        toast.error('Erro ao realizar login. Login impróprio.');
        return;
      }
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tipoUsuario', response.data.tipoUsuario);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard'); // Redireciona para o dashboard
    } catch (error) {
      toast.error('Erro ao realizar login. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <img src={logo} alt='logo'/>
      <h2>Login do Administrador</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
