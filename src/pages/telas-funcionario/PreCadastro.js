import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import axios from 'axios';
import './PreCadastro.css';
import { useNavigate } from 'react-router-dom';

const PreCadastro = () => {
  const [etapa, setEtapa] = useState(1);
  const navigate = useNavigate();

  // Verificação de credenciais
  useEffect(() => {
    const token = localStorage.getItem('token');
    const funcao = localStorage.getItem('funcao');

    if (!token || funcao !== 'recepcao') {
      // Se não houver token ou a função não for "recepcao", redireciona para a tela de login
      navigate('/login/funcionario');
    }
  }, [navigate]);

  // Estado para os dados do formulário
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [dataNascUsuario, setDataNascUsuario] = useState('');
  const [generoUsuario, setGeneroUsuario] = useState('');
  const [rgUsuario, setRgUsuario] = useState('');
  
  const [logUsuario, setLogUsuario] = useState('');
  const [numLogUsuario, setNumLogUsuario] = useState('');
  const [compUsuario, setCompUsuario] = useState('');
  const [bairroUsuario, setBairroUsuario] = useState('');
  const [cidadeUsuario, setCidadeUsuario] = useState('');
  const [estadoUsuario, setEstadoUsuario] = useState('');
  const [cepUsuario, setCepUsuario] = useState('');

  const [emailUsuario, setEmailUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [numTelefone, setNumTelefone] = useState('');

  // Função para avançar para a próxima etapa
  const proximaEtapa = () => {
    setEtapa(etapa + 1);
  };

  // Função para voltar para a etapa anterior
  const etapaAnterior = () => {
    setEtapa(etapa - 1);
  };

  // Função para consultar o endereço pelo CEP
  const buscarEndereco = () => {
    if (cepUsuario.length === 8) { // Verifica se o CEP tem 8 dígitos
      axios.get(`https://viacep.com.br/ws/${cepUsuario}/json/`)
        .then(response => {
          const dados = response.data;
          if (!dados.erro) {
            setLogUsuario(dados.logradouro);
            setBairroUsuario(dados.bairro);
            setCidadeUsuario(dados.localidade);
            setEstadoUsuario(dados.uf);
          } else {
            alert('CEP não encontrado!');
          }
        })
        .catch(error => {
          alert('Erro ao buscar o endereço. Verifique o CEP e tente novamente.');
          console.error(error);
        });
    }
  };

  // Função para enviar os dados à API
  const handlePreCadastro = (e) => {
    e.preventDefault();

    const dados = {
      nomeUsuario,
      cpfUsuario,
      dataNascUsuario,
      generoUsuario,
      rgUsuario,
      logUsuario,
      numLogUsuario,
      compUsuario,
      bairroUsuario,
      cidadeUsuario,
      estadoUsuario,
      cepUsuario,
      emailUsuario,
      numTelefone,
      senhaUsuario,
      statusUsuario: 'ativo',
      tipoUsuario: 'doador'
    };

    api.post('/usuario', dados)
      .then(response => {
        alert('Pré-cadastro realizado com sucesso!');
      })
      .catch(error => {
        alert('Erro ao realizar o pré-cadastro');
        console.error(error);
      });
  };

  return (
    <div className="precadastro-container">
      <h1>Pré-Cadastro do Doador</h1>

      <form onSubmit={handlePreCadastro} className="precadastro-form">
        {/* Etapa 1: Dados Pessoais */}
        {etapa === 1 && (
          <>
            <div className="form-group">
              <label>Nome Completo:</label>
              <input 
                type="text" 
                value={nomeUsuario} 
                onChange={(e) => setNomeUsuario(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>CPF:</label>
              <input 
                type="text" 
                value={cpfUsuario} 
                onChange={(e) => setCpfUsuario(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Data de Nascimento:</label>
              <input 
                type="date" 
                value={dataNascUsuario} 
                onChange={(e) => setDataNascUsuario(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Gênero:</label>
              <select 
                value={generoUsuario} 
                onChange={(e) => setGeneroUsuario(e.target.value)} 
                required
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="form-group">
              <label>RG:</label>
              <input 
                type="text" 
                value={rgUsuario} 
                onChange={(e) => setRgUsuario(e.target.value)} 
                required 
              />
            </div>
            <button type="button" className="precadastro-btn" onClick={proximaEtapa}>Próximo</button>
          </>
        )}

        {/* Etapa 2: Endereço */}
        {etapa === 2 && (
        <>
            <div className="form-group">
            <label>CEP:</label>
            <input 
                type="text" 
                value={cepUsuario} 
                onChange={(e) => setCepUsuario(e.target.value)} 
                onBlur={buscarEndereco}
                required 
            />
            </div>
            <div className="form-group">
            <label>Logradouro:</label>
            <input 
                type="text" 
                value={logUsuario} 
                onChange={(e) => setLogUsuario(e.target.value)} 
                required 
            />
            </div>
            <div className="form-group">
            <label>Número:</label>
            <input 
                type="text" 
                value={numLogUsuario} 
                onChange={(e) => setNumLogUsuario(e.target.value)} 
                required 
            />
            </div>
            <div className="form-group">
            <label>Complemento:</label>
            <input 
                type="text" 
                value={compUsuario} 
                onChange={(e) => setCompUsuario(e.target.value)} 
            />
            </div>
            <div className="form-group">
            <label>Bairro:</label>
            <input 
                type="text" 
                value={bairroUsuario} 
                onChange={(e) => setBairroUsuario(e.target.value)} 
                required 
            />
            </div>
            <div className="form-group">
            <label>Cidade:</label>
            <input 
                type="text" 
                value={cidadeUsuario} 
                onChange={(e) => setCidadeUsuario(e.target.value)} 
                required 
            />
            </div>
            <div className="form-group">
            <label>Estado:</label>
            <input 
                type="text" 
                value={estadoUsuario} 
                onChange={(e) => setEstadoUsuario(e.target.value)} 
                required 
            />
            </div>
            <button type="button" className="precadastro-btn" onClick={proximaEtapa}>Próximo</button>
            <button type="button" className="precadastro-cancel" onClick={etapaAnterior}>Voltar</button>
        </>
        )}

        {/* Etapa 3: Credenciais */}
        {etapa === 3 && (
          <>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={emailUsuario} 
                onChange={(e) => setEmailUsuario(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
                <label>Telefone:</label>
                <input 
                    type="text" 
                    value={numTelefone} 
                    onChange={(e) => setNumTelefone(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group">
              <label>Senha:</label>
              <input 
                type="password" 
                value={senhaUsuario} 
                onChange={(e) => setSenhaUsuario(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="precadastro-btn">Cadastrar</button>
            <button type="button" className="precadastro-cancel" onClick={etapaAnterior}>Voltar</button>
          </>
        )}
      </form>
    </div>
  );
};

export default PreCadastro;
