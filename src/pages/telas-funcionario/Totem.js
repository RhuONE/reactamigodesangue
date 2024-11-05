import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Totem.css';

const TotemSenha = () => {
  const [senha, setSenha] = useState(null);
  const [tipoDoacao, setTipoDoacao] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const funcao = localStorage.getItem('funcao');
    
    if (!token || funcao !== 'totem') {
      navigate('/login/funcionario');
    }
  }, [navigate]);

  const gerarSenha = (tipo) => {
    setTipoDoacao(tipo === 'A' ? 'Agendada' : 'Nao Agendada');

    const idHemocentro = localStorage.getItem('idHemocentro'); 
    const token = localStorage.getItem('token');

    console.log("Tentando gerar senha com tipo:", tipo); // Log de depuração

    api.post('/gerar-senha', {
      tipoSenha: tipo === 'A' ? 'Agendada' : 'Nao Agendada',
      idHemocentro,
    }, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then(response => {
        console.log("Resposta da API:", response); // Log de depuração
        const senhaGerada = response.data.numeroSenha;
        setSenha(senhaGerada);
      })
      .catch(error => {
        console.error('Erro ao gerar senha:', error);
      });
  };

  const reset = () => {
    setSenha(null);
  };

  return (
    <div className="totem-container">
      {senha ? (
        <div className="totem-confirmation">
          <h1 className="totem-heading">Sua senha foi gerada!</h1>
          <p className="totem-senha"><strong>{senha}</strong></p>
          <p className="totem-tipoDoacao">Tipo de Doação: {tipoDoacao}</p>
          <button onClick={reset} className="totem-button">Gerar outra senha</button>
        </div>
      ) : (
        <div className="totem-options">
          <h1 className="totem-heading">Gerar Senha</h1>
          <button className="totem-button" onClick={() => gerarSenha('A')}>Doação Agendada</button>
          <button className="totem-button" onClick={() => gerarSenha('N')}>Doação Não Agendada</button>
        </div>
      )}
    </div>
  );
};

export default TotemSenha;
