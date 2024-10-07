import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CadastroHemocentro.css';

const CadastroHemocentro = () => {
  const [formData, setFormData] = useState({
    nomeHemocentro: '',
    descHemocentro: '',
    telHemocentro: '',
    cepHemocentro: '',
    logHemocentro: '',
    numLogHemocentro: '',
    compHemocentro: '',
    bairroHemocentro: '',
    cidadeHemocentro: '',
    estadoHemocentro: '',
    emailHemocentro: '',
    senhaHemocentro: '',
    cnpjHemocentro: '',
    hospitalVinculadoHemocentro: '',
    latitudeHemocentro: '',
    longitudeHemocentro: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/hemocentro', formData);
      console.log('Cadastro realizado com sucesso:', response.data);
      alert('Hemocentro cadastrado com sucesso!');
      navigate('/login/hemocentro');
    } catch (error) {
      console.error('Erro ao cadastrar hemocentro:', error.response?.data);
      alert('Erro ao cadastrar hemocentro. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="cadastro-hemocentro">
      <h2>Cadastro de Hemocentro</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nomeHemocentro" value={formData.nomeHemocentro} onChange={handleChange} placeholder="Nome do Hemocentro" required />
        <input type="text" name="descHemocentro" value={formData.descHemocentro} onChange={handleChange} placeholder="Descrição" />
        <input type="text" name="telHemocentro" value={formData.telHemocentro} onChange={handleChange} placeholder="Telefone" required />
        <input type="text" name="cepHemocentro" value={formData.cepHemocentro} onChange={handleChange} placeholder="CEP" required />
        <input type="text" name="logHemocentro" value={formData.logHemocentro} onChange={handleChange} placeholder="Logradouro" required />
        <input type="text" name="numLogHemocentro" value={formData.numLogHemocentro} onChange={handleChange} placeholder="Número" required />
        <input type="text" name="compHemocentro" value={formData.compHemocentro} onChange={handleChange} placeholder="Complemento" />
        <input type="text" name="bairroHemocentro" value={formData.bairroHemocentro} onChange={handleChange} placeholder="Bairro" required />
        <input type="text" name="cidadeHemocentro" value={formData.cidadeHemocentro} onChange={handleChange} placeholder="Cidade" required />
        <input type="text" name="estadoHemocentro" value={formData.estadoHemocentro} onChange={handleChange} placeholder="Estado" required />
        <input type="email" name="emailHemocentro" value={formData.emailHemocentro} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="senhaHemocentro" value={formData.senhaHemocentro} onChange={handleChange} placeholder="Senha" required />
        <input type="text" name="cnpjHemocentro" value={formData.cnpjHemocentro} onChange={handleChange} placeholder="CNPJ" required />
        <input type="text" name="hospitalVinculadoHemocentro" value={formData.hospitalVinculadoHemocentro} onChange={handleChange} placeholder="Hospital Vinculado" required />
        <input type="text" name="latitudeHemocentro" value={formData.latitudeHemocentro} onChange={handleChange} placeholder="Latitude" />
        <input type="text" name="longitudeHemocentro" value={formData.longitudeHemocentro} onChange={handleChange} placeholder="Longitude" />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroHemocentro;
