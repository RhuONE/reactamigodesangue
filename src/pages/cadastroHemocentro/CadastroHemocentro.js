import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import axios from 'axios';
import './CadastroHemocentro.css';
import logo from '../../images/cadastroHemocentro.png';
import wave from '../../images/wave.png';
import imgIcon from '../../images/imgIcon.png';

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
  
    if (name === 'telHemocentro') {
      const formattedValue = formatPhone(value);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else if (name === 'cnpjHemocentro') {
      const formattedValue = formatCNPJ(value);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
//FIM FORMATACAO


//API CEP
  const [location, setLocation] = useState(null);
const handleCepChange = async (e) => {
  const { value } = e.target;
  const formattedValue = formatCEP(value);
  setFormData((prevData) => ({ ...prevData, cepHemocentro: formattedValue }));
  
    try {
      const response = await fetch(`https://viacep.com.br/ws/${formattedValue}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData((prevData) => ({
          ...prevData,
          logHemocentro: data.logradouro,
          bairroHemocentro: data.bairro,
          cidadeHemocentro: data.localidade,
          estadoHemocentro: data.uf
        }));
        const { logradouro, localidade, uf } = data;
        const address = `${logradouro}, ${localidade}, ${uf}`

        // Busca coordenadas pela localidade e estado
        const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${address}`);
        
        if (geoResponse.data.length > 0) {
          const { lat, lon } = geoResponse.data[0];
          // Atualiza o estado com as coordenadas
          setFormData((prevData) => ({
            ...prevData,
            latitudeHemocentro: lat,
            longitudeHemocentro: lon,
          }));
        }
        
      } else {
        alert('CEP não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  
  console.log(location);
};
//FIM API CEP


//RETORNO DE ERRO
const [error, setError] = useState({
  nomeInvalido: '',
  telInvalido: '',
  descInvalido: '',
  cnpjInvalido: '',
  hospitalInvalido: '',
  cepInvalido: '',
  logradouroInvalido: '',
  numLogInvalido: '',
  bairroInvalido:'',
  cidadeInvalido:'',
  emailInvalido: '',
  senhaInvalido: '',
  confirmSenhaInvalido:''
})


  // FORM STEPS e VALIDAÇÃO

    //FUNCOES DE VALIDAÇÃO
    const telefoneValido = (telefone) => {
      const telefoneLimpo = telefone.replace(/[^\d]/g, ''); // Remove espaços, traços e parênteses
      const regex = /^(\d{10}|\d{11})$/; // Verifica se tem 10 ou 11 dígitos
      return regex.test(telefoneLimpo);
    };
    
    const emailValido = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar formato de e-mail
      return regex.test(email);
    };
    
    const cnpjValido = (cnpj) => {
      const cnpjLimpo = cnpj.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
      return cnpjLimpo.length === 14; // CNPJ tem 14 dígitos
    };
    
    const cepValido = (cep) => {
      const cepLimpo = cep.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
      return cepLimpo.length === 8; // CEP tem 8 dígitos
    };
    
    const senhaValida = (senha) => {
      return senha.length >= 6; // Senha deve ter pelo menos 6 caracteres
    };
    
    const nomeValido = (nome) => {
      return nome.trim() !== ''; // Verifica se o nome não está vazio
    };
    // FIM FUNCOES DE VALIDACAO

  const [formStep, setformStep] = useState('0');
  const handleChangeFormStep = (e) => {
    let isValid = true;
    setError({
      nomeInvalido: '',
      telInvalido: '',
      descInvalido: '',
      cnpjInvalido: '',
      hospitalInvalido: '',
      cepInvalido: '',
      logradouroInvalido: '',
      bairroInvalido:'',
      cidadeInvalido:'',
      emailInvalido: '',
      senhaInvalido: '',
      confirmSenhaInvalido:''
    });

    switch(e){
      case 1:
        if (!nomeValido(formData.nomeHemocentro)) {
          setError((prevError) => ({
            ...prevError,
            nomeInvalido: 'O nome do hemocentro é obrigatório.'
          }));
          isValid = false;
          break;
        }
      
        if (!telefoneValido(formData.telHemocentro)) {
          setError((prevError) => ({
            ...prevError,
            telInvalido: 'Telefone inválido. Deve ter 10 ou 11 dígitos.'
          }));
          isValid = false;
          break;
        }
        if (!formData.descHemocentro) {
          setError((prevError) => ({
            ...prevError,
            descInvalido: 'Descrição é obrigatório.'
          }));
          isValid = false;
          break;
        }
        if (!cnpjValido(formData.cnpjHemocentro)) {
          setError((prevError) => ({
            ...prevError,
            cnpjInvalido: 'CNPJ inválido.'
          }));
          isValid = false;
          break;
        }
        if (!formData.hospitalVinculadoHemocentro) {
          setError((prevError) => ({
            ...prevError,
            hospitalInvalido: 'Hospital é Obrigatório.'
          }));
          isValid = false;
          break;
        }
        isValid = true;
        break;

      case 2:
        if(!cepValido(formData.cepHemocentro)){
          setError((prevError) => ({
            ...prevError,
            cepInvalido: 'Cep Inválido.'
          }));
          isValid = false;
          break;
        }
        if(!formData.logHemocentro){
          setError((prevError) => ({
            ...prevError,
            logradouroInvalido: 'Rua é Obrigatório.'
          }));
          isValid = false;
          break;
        }
        if(!formData.numLogHemocentro){
          setError((prevError) => ({
            ...prevError,
            numLogInvalido: 'Número é Obrigatório.'
          }));
          isValid = false;
          break;
        }
        if(!formData.bairroHemocentro){
          setError((prevError) => ({
            ...prevError,
            bairroInvalido: 'Bairro Obrigatório.'
          }));
          isValid = false;
          break;
        }
        if(!formData.cidadeHemocentro){
          setError((prevError) => ({
            ...prevError,
            bairroInvalido: 'Cidade Obrigatório.'
          }));
          isValid = false;
          break;
        }
        isValid = true;
        break;
      
      default:
        isValid = true;
        break;
    }

    if(isValid){
      setformStep(e);
    }
  }

  const [confirmSenha, setConfirmSenha] = useState('');
  const handleChangeConfirmSenha = (e) => {
    setConfirmSenha(e.target.value);
  }


  // Formatação de Campos
  const formatCNPJ = (value) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
    value = value.replace(/^(\d{2})(\d)/, "$1.$2"); // Coloca o primeiro ponto
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); // Coloca o segundo ponto
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2"); // Coloca a barra
    value = value.replace(/(\d{4})(\d)/, "$1-$2"); // Coloca o hífen
    return value;
  };

  const formatPhone = (value) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
  
    if (value.length > 10) {
      // Formato para celular: (XX) XXXXX-XXXX
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca os parênteses no DDD
      value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Coloca o hífen depois dos 5 primeiros dígitos
    } else {
      // Formato para telefone fixo: (XX) XXXX-XXXX
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca os parênteses no DDD
      value = value.replace(/(\d{4})(\d)/, "$1-$2"); // Coloca o hífen depois dos 4 primeiros dígitos
    }
  
    return value;
  };

  const formatCEP = (value) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
    value = value.replace(/^(\d{5})(\d)/, "$1-$2"); // Adiciona o hífen entre o quinto e o sexto dígito
    return value;
  };
  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError({
      nomeInvalido: '',
      telInvalido: '',
      descInvalido: '',
      cnpjInvalido: '',
      hospitalInvalido: '',
      cepInvalido: '',
      logradouroInvalido: '',
      bairroInvalido:'',
      cidadeInvalido:'',
      emailInvalido: '',
      senhaInvalido: '',
      confirmSenhaInvalido:''
    });
    console.log(formData);
    let isValid = true;
    if(!emailValido(formData.emailHemocentro)){
      setError((prevError) => ({
        ...prevError,
        emailInvalido: 'E-mail Inválido.'
      }));
      isValid = false;
    }else if(senhaValida(formData.senhaHemocentro)){
      if(!formData.senhaHemocentro == confirmSenha){
        setError((prevError) => ({
          ...prevError,
          senhaInvalido: 'Senhas não são idênticas.'
        }));
        isValid = false;
      }
    }else{
      setError((prevError) => ({
        ...prevError,
        senhaInvalido: 'Senha Inválida. Maior que 6 caracteres'
      }));
      isValid = false;
    }
    
    
    

    if(isValid){
      try {
        const response = await api.post('/hemocentro', formData);
        console.log('Cadastro realizado com sucesso:', response.data);
        alert('Hemocentro cadastrado com sucesso!');
        navigate('/login/hemocentro');
      } catch (error) {
        console.error('Erro ao cadastrar hemocentro:', error.response?.data);
        alert('Erro ao cadastrar hemocentro. Verifique os dados e tente novamente.');
      }
    }
  };


  return (
    <div className="cadastro-hemocentro">
      <div className="side-img">
            <img src={logo} />
            <img src={wave} id="wave"/>
        </div>
        <div className="content">
            <form name="formCadHemo" className="formCadHemo" onSubmit={handleSubmit}>
                <div className="progressBar">
                <div className={`progress ${formStep == 1 ? 'step1' : '' || formStep == 2 ? 'step2' : ''}`} id="progress"></div>
                    <div className={ `progress-step ${formStep == 0 || formStep == 1 || formStep == 2 ? 'active' : ''}`} data-title="Informações"></div>
                    <div className={`progress-step ${formStep == 1 || formStep == 2 ? 'active' : ''}`} data-title="Localização"></div>
                    <div className={`progress-step ${formStep == 2 ? 'active' : ''}`} data-title="Senha"></div>
                </div>


                <div className={`form-step ${formStep == 0 ? 'active' : ''}`}>
                    <div className="imgNameHemocentro">
                        <div className="imgInput">
                            <img src={imgIcon}/>
                            <label htmlFor="fotoHemocentro">
                                Escolher arquivo
                            </label>
                            <input id="fotoHemocentro" name="fotoHemocentro" type="file" 
                            accept=".jpg, .jpeg, .png"/>
                        </div>
    
                        <div className="dadosDiv">
                            <h2>Dados do Hemocentro:</h2>
                            <div className="inputDiv">
                            <input type="text" name="nomeHemocentro" value={formData.nomeHemocentro} onChange={handleChange} placeholder="" autoFocus/>
                                <label htmlFor="nomeInput">Nome Hemocentro</label>
                                <span>{error.nomeInvalido}</span>
                            </div>
                            
                            <div className='inputDiv'>
                            <input type="text" name="telHemocentro" value={formData.telHemocentro} onChange={handleChange} placeholder="" required />
                                <label htmlFor="telInput">Telefone</label>
                                <span id="telInvalido">{error.telInvalido}</span>
                            </div>
                            
                            <div className="inputDiv">
                            <textarea type="text" name="descHemocentro" value={formData.descHemocentro} onChange={handleChange} placeholder="" />
                                <label htmlFor="descInput">Descrição</label>
                                <span id="descInvalido">{error.descInvalido}</span>
                            </div>
                        </div>
                    </div>

                    <div className="inputDiv">
                    <input type="text" name="cnpjHemocentro" value={formData.cnpjHemocentro} onChange={handleChange} placeholder=""  />
                        <label htmlFor="cnpjInput">CNPJ</label>
                        <span id="cnpjInvalido">{error.cnpjInvalido}</span>
                    </div>
                    <div className="inputDiv">
                    <input type="text" name="hospitalVinculadoHemocentro" value={formData.hospitalVinculadoHemocentro} onChange={handleChange} placeholder=""  />
                        <label htmlFor="hospitalInput">Hospital Afiliado</label>
                        <span id="hospitalInvalido">{error.hospitalInvalido}</span>
                    </div>
                    <div className="prevNextBtn">
                        <a href="#" className="btn btn-next" onClick={() => handleChangeFormStep(1)}>Próxima Etapa</a>
                    </div>
                </div>
                

                <div className={`form-step ${formStep == 1 ? 'active' : ''}`}>
                    <h2>Localização do Hemocentro:</h2>
                    <div className="inputDiv">
                    <input type="text" name="cepHemocentro" value={formData.cepHemocentro} onChange={handleCepChange} placeholder="" />
                        <label htmlFor="cepInput">CEP</label>     
                        <span id="cepInvalido">{error.cepInvalido}</span>
                    </div>
                    
                    
                    <div className="inputDiv">
                    <input type="text" name="logHemocentro" value={formData.logHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="logradouroInput">Rua</label>        
                        <span id="logradouroInvalido">{error.logradouroInvalido}</span>
                    </div>
    
                    
                    <div className="inputDiv">
                    <input type="text" name="numLogHemocentro" value={formData.numLogHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="numInput">Número</label>
                        <span>{error.numLogInvalido}</span>
                    </div>
                    
                    <div className="inputDiv">
                    <input type="text" name="compHemocentro" value={formData.compHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="complementoInput">Complemento</label>     
                        <span></span> 
                    </div>
                    
                    <div className="inputDiv">
                    <input type="text" name="bairroHemocentro" value={formData.bairroHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="bairroInput">Bairro</label>     
                        <span id="bairroInvalido">{error.bairroInvalido}</span> 
                    </div>
                    
                    <div className="cidadeEstado">
                        <div className="inputDiv">
                        <input type="text" name="cidadeHemocentro" value={formData.cidadeHemocentro} onChange={handleChange} placeholder="" />
                            <label htmlFor="cidadeInput">Cidade</label>
                            <span id="cidadeInvalido">{error.cidadeInvalido}</span>
                        </div>
                        <div className="line"></div>
                        <div className="selectDiv">
                            <label htmlFor="estadoSelect">Estado</label>
                            <select name="estadoHemocentro" id="estadoSelect" value={formData.estadoHemocentro} onChange={handleChange}>
                                <option value={""} disabled>--</option>
                                <option value={"AC"}>AC</option>
                                <option value={"AL"}>AL</option>
                                <option value={"AP"}>AP</option>
                                <option value={"AM"}>AM</option>
                                <option value={"BA"}>BA</option>
                                <option value={"CE"}>CE</option>
                                <option value={"DF"}>DF</option>
                                <option value={"ES"}>ES</option>
                                <option value={"GO"}>GO</option>
                                <option value={"MA"}>MA</option>
                                <option value={"MT"}>MT</option>
                                <option value={"MS"}>MS</option>
                                <option value={"MG"}>MG</option>
                                <option value={"PA"}>PA</option>
                                <option value={"PB"}>PB</option>
                                <option value={"PR"}>PR</option>
                                <option value={"PE"}>PE</option>
                                <option value={"PI"}>PI</option>
                                <option value={"RJ"}>RJ</option>
                                <option value={"RN"}>RN</option>
                                <option value={"RS"}>RS</option>
                                <option value={"RO"}>RO</option>
                                <option value={"RR"}>RR</option>
                                <option value={"SC"}>SC</option>
                                <option value={"SP"}>SP</option>
                                <option value={"SE"}>SE</option>
                                <option value={"TO"}>TO</option>
                            </select>
                        </div>
                    </div>
                    <div className="prevNextBtn">
                        <a href="#" className="btn btn-prev" onClick={() => handleChangeFormStep(0)}>Voltar</a>
                        <a href="#" className="btn btn-next" onClick={() => handleChangeFormStep(2)}>Próxima Etapa</a>
                    </div>
                </div>


                  <div className={`form-step ${formStep == 2 ? 'active' : ''}`}>
                    <h2>Dados de Login</h2>
                    <div className="inputDiv">
                    <input type="email" name="emailHemocentro" value={formData.emailHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="emailInput">Email</label>
                        <span id="emailInvalido">{error.emailInvalido}</span>
                    </div>
                    <div className="inputDiv">
                    <input type="password" name="senhaHemocentro" value={formData.senhaHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="senhaInput">Senha</label>
                        <span id="senhaInvalido">{error.senhaInvalido}</span>
                    </div>
                    <div className="inputDiv">
                        <input type="password" name="confirmSenha" value={confirmSenha} onChange={handleChangeConfirmSenha} placeholder="" />
                        <label htmlFor="confirmSenhaInput">Confirme sua Senha</label>
                        <span id="confirmSenhaInvalido">{error.senhaInvalido}</span>
                    </div>
                    <div className="prevNextBtn">
                        <a href="#" className="btn btn-prev" onClick={() => handleChangeFormStep(1)}>Voltar</a>
                        <button type="submit">Cadastrar</button>
                    </div>
                  </div>
            </form>
          
        </div>
    </div>
  );
};

export default CadastroHemocentro;
