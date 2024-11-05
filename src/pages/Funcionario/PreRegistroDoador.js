import React, { useState } from 'react';
import axios from 'axios';
import './PreRegistroDoador.css' 
import { useNavigate } from 'react-router-dom';

const PreRegistroDoador = () => {
  const [formData, setFormData] = useState({
    nomeUsuario: '',
    dataNascUsuario: '',
    generoUsuario: '',
    emailUsuario: '',
    senhaUsuario: '',
    cpfUsuario: '',
    logUsuario: '',
    numLogUsuario: '',
    compUsuario: '',
    bairroUsuario: '',
    cidadeUsuario: '',
    estadoUsuario: '',
    cepUsuario: '',
    rgUsuario: '',
    numTelefone: '',
    descTipoSanguineo: '', // opcional
    fotoUsuario: null, // para o upload de foto
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Função para lidar com a mudança dos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para lidar com o upload de imagem
  const handleImageChange = (e) => {
    setFormData({ ...formData, fotoUsuario: e.target.files[0] });
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem('token'); // Assumindo que o token de autenticação está armazenado no localStorage
      const response = await axios.post('http://seu-servidor.com/api/usuario', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setErrorMessage('');
      navigate('/funcionario/infomedicas');
    } catch (error) {
      setMessage('');
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Erro ao enviar os dados');
      } else {
        setErrorMessage('Erro ao conectar com o servidor.');
      }
    }
  };

  return (
    <div>
      <h2>Pré-Registro de Doador</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nomeUsuario"
          placeholder="Nome Completo"
          value={formData.nomeUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dataNascUsuario"
          placeholder="Data de Nascimento"
          value={formData.dataNascUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="generoUsuario"
          placeholder="Gênero"
          value={formData.generoUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="emailUsuario"
          placeholder="Email"
          value={formData.emailUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senhaUsuario"
          placeholder="Senha"
          value={formData.senhaUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cpfUsuario"
          placeholder="CPF"
          value={formData.cpfUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="logUsuario"
          placeholder="Logradouro"
          value={formData.logUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="numLogUsuario"
          placeholder="Número"
          value={formData.numLogUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="compUsuario"
          placeholder="Complemento"
          value={formData.compUsuario}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bairroUsuario"
          placeholder="Bairro"
          value={formData.bairroUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cidadeUsuario"
          placeholder="Cidade"
          value={formData.cidadeUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="estadoUsuario"
          placeholder="Estado"
          value={formData.estadoUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cepUsuario"
          placeholder="CEP"
          value={formData.cepUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rgUsuario"
          placeholder="RG"
          value={formData.rgUsuario}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="numTelefone"
          placeholder="Telefone"
          value={formData.numTelefone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descTipoSanguineo"
          placeholder="Tipo Sanguíneo (opcional)"
          value={formData.descTipoSanguineo}
          onChange={handleChange}
        />
        <input
          type="file"
          name="fotoUsuario"
          onChange={handleImageChange}
        />
        <button type="submit">Cadastrar</button>
      </form>
      {message && <p>{message}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PreRegistroDoador;
