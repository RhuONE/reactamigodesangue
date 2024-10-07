import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CadastroHemocentro.css';
import logo from '../../images/cadastroHemocentro.png';
import wave from '../../images/wave.png';

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

  const [formStep, setformStep] = useState('0');
  const handleChangeFormStep = (e) => {
    setformStep(e);
  }

  const [confirmSenha, setConfirmSenha] = useState('');
  const handleChangeConfirmSenha = (e) => {
    setConfirmSenha(e.target.value);
  }

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
                            <img src="../assets/img/imgIcon.png"/>
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
                                <span id="nomeInvalido"></span>
                            </div>
                            
                            <div className='inputDiv'>
                            <input type="text" name="telHemocentro" value={formData.telHemocentro} onChange={handleChange} placeholder="" required />
                                <label htmlFor="telInput">Telefone</label>
                                <span id="telInvalido"></span>
                            </div>
                            
                            <div className="inputDiv">
                            <textarea type="text" name="descHemocentro" value={formData.descHemocentro} onChange={handleChange} placeholder="" />
                                <label htmlFor="descInput">Descrição</label>
                                <span id="descInvalido"></span>
                            </div>
                        </div>
                    </div>

                    <div className="inputDiv">
                    <input type="text" name="cnpjHemocentro" value={formData.cnpjHemocentro} onChange={handleChange} placeholder=""  />
                        <label htmlFor="cnpjInput">CNPJ</label>
                        <span id="cnpjInvalido"></span>
                    </div>
                    <div className="inputDiv">
                    <input type="text" name="hospitalVinculadoHemocentro" value={formData.hospitalVinculadoHemocentro} onChange={handleChange} placeholder=""  />
                        <label htmlFor="hospitalInput">Hospital Afiliado</label>
                        <span id="hospitalInvalido"></span>
                    </div>
                    <div className="prevNextBtn">
                        <a href="#" className="btn btn-next" onClick={() => handleChangeFormStep(1)}>Próxima Etapa</a>
                    </div>
                </div>
                

                <div className={`form-step ${formStep == 1 ? 'active' : ''}`}>
                    <h2>Localização do Hemocentro:</h2>
                    <div className="inputDiv">
                    <input type="text" name="cepHemocentro" value={formData.cepHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="cepInput">CEP</label>     
                        <span id="cepInvalido"></span>
                    </div>
                    
                    
                    <div className="inputDiv">
                    <input type="text" name="logHemocentro" value={formData.logHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="logradouroInput">Rua</label>        
                        <span id="logradouroInvalido"></span>
                    </div>
    
                    
                    <div className="inputDiv">
                    <input type="text" name="numLogHemocentro" value={formData.numLogHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="numInput">Número</label>
                        <span></span>
                    </div>
                    
                    <div className="inputDiv">
                    <input type="text" name="compHemocentro" value={formData.compHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="complementoInput">Complemento</label>     
                        <span></span> 
                    </div>
                    
                    <div className="inputDiv">
                    <input type="text" name="bairroHemocentro" value={formData.bairroHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="bairroInput">Bairro</label>     
                        <span id="bairroInvalido"></span> 
                    </div>
                    
                    <div className="cidadeEstado">
                        <div className="inputDiv">
                        <input type="text" name="cidadeHemocentro" value={formData.cidadeHemocentro} onChange={handleChange} placeholder="Cidade" />
                            <label htmlFor="cidadeInput">Cidade</label>
                            <span id="cidadeInvalido"></span>
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
                        <span id="emailInvalido"></span>
                    </div>
                    <div className="inputDiv">
                    <input type="password" name="senhaHemocentro" value={formData.senhaHemocentro} onChange={handleChange} placeholder="" />
                        <label htmlFor="senhaInput">Senha</label>
                        <span id="senhaInvalido"></span>
                    </div>
                    <div className="inputDiv">
                        <input type="password" name="confirmSenha" value={confirmSenha} onChange={handleChangeConfirmSenha} placeholder="" />
                        <label htmlFor="confirmSenhaInput">Confirme sua Senha</label>
                        <span id="confirmSenhaInvalido"></span>
                    </div>
                    <div className="prevNextBtn">
                        <a href="#" className="btn btn-prev" onClick={() => handleChangeFormStep(1)}>Voltar</a>
                        <button type="submit">Cadastrar</button>
                    </div>
                  </div>
            </form>
          
        </div>
        

      <form >
        <input type="text" name="estadoHemocentro" value={formData.estadoHemocentro} onChange={handleChange} placeholder="Estado" required />
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
