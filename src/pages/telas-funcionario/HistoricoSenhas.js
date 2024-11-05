import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './HistoricoSenhas.css';
import { useNavigate } from 'react-router-dom';

const HistoricoSenhas = () => {
  const [senhasChamadas, setSenhasChamadas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para verificar login e função
  useEffect(() => {
    const token = localStorage.getItem('token');
    const funcao = localStorage.getItem('funcao');
    const idHemocentro = localStorage.getItem('idHemocentro');

    if (!token || funcao !== 'recepcao') {
      // Se não houver token ou a função não for "recepcao", redireciona para a tela de login
      navigate('/login/funcionario');
    }

    // Função para buscar as senhas chamadas do hemocentro
    const fetchSenhasChamadas = () => {
      setLoading(true);
      api.get('/senhas-chamadas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          idHemocentro: idHemocentro, // Passa o idHemocentro como parâmetro
        },
      })
        .then(response => {
          setSenhasChamadas(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar senhas chamadas:', error);
          setLoading(false);
        });
    };

    // Faz a busca inicial e define o intervalo para atualizar a cada 5 segundos
    fetchSenhasChamadas();
    const interval = setInterval(fetchSenhasChamadas, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Função para filtrar as senhas conforme a pesquisa e o filtro
  const senhasFiltradas = () => {
    return senhasChamadas
      .filter(senha => filtro === '' || senha.tipoSenha === filtro)
      .filter(senha => senha.numeroSenha.toLowerCase().includes(pesquisa.toLowerCase()));
  };

  return (
    <div className="historico-container">
      <h1 className="historico-title">Histórico de Senhas Chamadas</h1>

      {/* Filtros e barra de pesquisa */}
      <div className="historico-filtros">
        <select className="historico-select" value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value=''>Todos</option>
          <option value='Agendada'>Doação Agendada</option>
          <option value='Nao Agendada'>Doação Não Agendada</option>
        </select>

        <input
          type="text"
          className="historico-search"
          placeholder="Buscar número de senha..."
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
        />
      </div>

      {/* Exibir o spinner durante o carregamento */}
      {/**{loading ? (
          <div className="historico-spinner"></div>
        ) : ( */}  
        <ul className="historico-list">
          {senhasFiltradas().map(senha => (
            <li key={senha.id} className="historico-item">
              <span className="historico-info">{senha.numeroSenha} ({senha.tipoSenha}) - Chamado em: {new Date(senha.updated_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      
    </div>
  );
};

export default HistoricoSenhas;
