import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { AiOutlineCheck, AiOutlineLoading, AiFillDelete } from 'react-icons/ai';
import { BsChevronLeft, BsChevronRight, BsPlusCircle, BsDownload } from 'react-icons/bs';
import InputMask from 'react-input-mask';
import axios from 'axios';
import './CadastroModal.css';

const CadastroModal = ({ isOpen, onRequestClose, onCadastrarUsuario }) => {
    const [etapaAtual, setEtapaAtual] = useState(1);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNasc: '',
        genero: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        rg: '',
        email: '',
        senha: ''
    });
    const [telefones, setTelefones] = useState([]);
    const [novoTelefone, setNovoTelefone] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [isLoadingCadastrar, setIsLoadingCadastrar] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const [fotoUsuario, setFotoUsuario] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoUsuario(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Remove a pontuação do CPF antes de salvar no estado
        if (name === 'cpf') {
            const cpfSemPontuacao = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
            setFormData({ ...formData, [name]: cpfSemPontuacao });
            validateField(name, cpfSemPontuacao);
        } else {
            setFormData({ ...formData, [name]: value });
            validateField(name, value);
        }
    
        if (name === 'cep' && value.length === 9) { // Formato 99999-999
            buscarEnderecoPorCep(value.replace('-', ''));
        }
    };

    const handleAddTelefone = () => {
        if (novoTelefone.trim()) {
            setTelefones([...telefones, { numTelefone: novoTelefone }]);
            setNovoTelefone('');
        }
    };

    const handleTelefoneChange = (index, value) => {
        const updatedTelefones = [...telefones];
        updatedTelefones[index].numTelefone = value;
        setTelefones(updatedTelefones);
    };

    const handleDeleteTelefone = (index) => {
        setTelefones((prevTelefones) => prevTelefones.filter((_, i) => i !== index));
    };

    const validateField = (name, value) => {
        let errors = { ...formErrors };
        if (!value) {
            errors[name] = 'Este campo é obrigatório';
        } else {
            delete errors[name];
        }

        if (name === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors[name] = 'Formato de email inválido';
            }
        }

        setFormErrors(errors);
    };

    const isFormValid = () => {
        const requiredFields = [
            'nome',
            'cpf',
            'dataNasc',
            'genero',
            'logradouro',
            'numero',
            'bairro',
            'cidade',
            'estado',
            'cep',
            'rg',
            'email',
            'senha'
        ];
        let errors = {};
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                errors[field] = 'Este campo é obrigatório';
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const buscarEnderecoPorCep = async (cep) => {
        setIsCepLoading(true);
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data.erro) {
                setShowErrorMessage(true);
                setTimeout(() => setShowErrorMessage(false), 3000);
                return;
            }
            setFormData((prevData) => ({
                ...prevData,
                logradouro: response.data.logradouro || '',
                bairro: response.data.bairro || '',
                cidade: response.data.localidade || '',
                estado: response.data.uf || ''
            }));
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 3000);
        } finally {
            setIsCepLoading(false);
        }
    };

    const avancarEtapa = () => setEtapaAtual(etapaAtual + 1);
    const voltarEtapa = () => setEtapaAtual(etapaAtual - 1);

    const handleConfirmar = async () => {
        if (!isFormValid()) {
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 3000);
            return;
        }
    
        setIsLoadingCadastrar(true);
        try {
            const formDataWithFoto = new FormData();
            formDataWithFoto.append('nomeUsuario', formData.nome);
            formDataWithFoto.append('cpfUsuario', formData.cpf);
            formDataWithFoto.append('dataNascUsuario', formData.dataNasc);
            formDataWithFoto.append('generoUsuario', formData.genero);
            formDataWithFoto.append('logUsuario', formData.logradouro);
            formDataWithFoto.append('numLogUsuario', formData.numero);
            formDataWithFoto.append('compUsuario', formData.complemento);
            formDataWithFoto.append('bairroUsuario', formData.bairro);
            formDataWithFoto.append('cidadeUsuario', formData.cidade);
            formDataWithFoto.append('estadoUsuario', formData.estado);
            formDataWithFoto.append('cepUsuario', formData.cep);
            formDataWithFoto.append('rgUsuario', formData.rg);
            formDataWithFoto.append('emailUsuario', formData.email);
            formDataWithFoto.append('senhaUsuario', formData.senha);
            formDataWithFoto.append('telefones', JSON.stringify(telefones)); // Se precisar enviar como string
            if (fotoUsuario) {
                formDataWithFoto.append('fotoUsuario', fotoUsuario);
            }
    
            console.log('FormData antes do envio:', Array.from(formDataWithFoto.entries()));
    
            await onCadastrarUsuario(formDataWithFoto);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            onRequestClose();
        } catch (error) {
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 3000);
        } finally {
            setIsLoadingCadastrar(false);
        }
    };
    

    const renderIndicadorDePasso = () => (
        <div className="cadastroModal-steps">
            <div className={`cadastroModal-step ${etapaAtual === 1 ? 'active' : ''}`}>
                <FaUser className="cadastroModal-step-icon" />
                <span>1. Dados Pessoais</span>
            </div>
            <div className={`cadastroModal-step ${etapaAtual === 2 ? 'active' : ''}`}>
                <FaMapMarkerAlt className="cadastroModal-step-icon" />
                <span>2. Endereço</span>
            </div>
            <div className={`cadastroModal-step ${etapaAtual === 3 ? 'active' : ''}`}>
                <FaPhone className="cadastroModal-step-icon" />
                <span>3. Contato</span>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="cadastroModal-content"
            overlayClassName="cadastroModal-overlay"
        >
            {renderIndicadorDePasso()}
            
            {etapaAtual === 1 && (
                <div className="cadastroModal-etapa">
                    <h2 className="cadastroModal-header">Dados Pessoais</h2>
                    <div className='cadastroModal-foto-container'>
                        <img src={fotoPreview || 'http://localhost:8000/storage/uploads/usuarios/perfil-padrao.jpg'} alt="Foto do usuário" className="foto-preview" />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFotoChange} 
                            className="input-foto" 
                            id="fileInput" 
                            style={{ display: 'none' }}
                        />
                        <BsDownload 
                            onClick={() => document.getElementById('fileInput').click()} 
                            className="cadastroModal-upload-foto-button"
                            size={28}
                        />
                    </div>
                    <input
                        className="cadastroModal-input"
                        name="nome"
                        placeholder="Nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                    />
                    {formErrors.nome && <div className="error-message">{formErrors.nome}</div>}
                    <InputMask
                        className="cadastroModal-input"
                        mask="999.999.999-99"
                        name="cpf"
                        placeholder="CPF"
                        value={formData.cpf}
                        onChange={handleInputChange}
                    />
                    {formErrors.cpf && <div className="error-message">{formErrors.cpf}</div>}
                    <input
                        className="cadastroModal-input"
                        name="rg"
                        placeholder="RG"
                        value={formData.rg}
                        onChange={handleInputChange}
                    />
                    {formErrors.rg && <div className="error-message">{formErrors.rg}</div>}
                    <input
                        className="cadastroModal-input"
                        type="date"
                        name="dataNasc"
                        placeholder="Data de Nascimento"
                        value={formData.dataNasc}
                        onChange={handleInputChange}
                    />
                    {formErrors.dataNasc && <div className="error-message">{formErrors.dataNasc}</div>}
                    <select
                        className="cadastroModal-input-select"
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                    >
                        <option value="">Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                    </select>
                    {formErrors.genero && <div className="error-message">{formErrors.genero}</div>}
                    <div className='cadastroModal-btn-container direita'>
                        <BsChevronRight className="cadastroModal-btn-proximo" onClick={avancarEtapa} size={24} />
                    </div>
                </div>
            )}

            {etapaAtual === 2 && (
                <div className="cadastroModal-etapa">
                    <h2 className="cadastroModal-header">Dados de Endereço</h2>
                    <InputMask
                        className="cadastroModal-input"
                        mask="99999-999"
                        name="cep"
                        placeholder="CEP"
                        value={formData.cep}
                        onChange={handleInputChange}
                    />
                    {formErrors.cep && <div className="error-message">{formErrors.cep}</div>}
                    {isCepLoading && <AiOutlineLoading className="cep-loading-spinner" />}
                    <input
                        className="cadastroModal-input"
                        name="logradouro"
                        placeholder="Logradouro"
                        value={formData.logradouro}
                        onChange={handleInputChange}
                    />
                    {formErrors.logradouro && <div className="error-message">{formErrors.logradouro}</div>}
                    <input
                        className="cadastroModal-input"
                        name="numero"
                        placeholder="Número"
                        value={formData.numero}
                        onChange={handleInputChange}
                    />
                    {formErrors.numero && <div className="error-message">{formErrors.numero}</div>}
                    <input
                        className="cadastroModal-input"
                        name="complemento"
                        placeholder="Complemento"
                        value={formData.complemento}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        name="bairro"
                        placeholder="Bairro"
                        value={formData.bairro}
                        onChange={handleInputChange}
                    />
                    {formErrors.bairro && <div className="error-message">{formErrors.bairro}</div>}
                    <input
                        className="cadastroModal-input"
                        name="cidade"
                        placeholder="Cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        disabled
                    />
                    {formErrors.cidade && <div className="error-message">{formErrors.cidade}</div>}
                    <input
                        className="cadastroModal-input"
                        name="estado"
                        placeholder="Estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        disabled
                    />
                    {formErrors.estado && <div className="error-message">{formErrors.estado}</div>}
                    <div className='cadastroModal-btn-container'>
                        <BsChevronLeft className="cadastroModal-btn-proximo" onClick={voltarEtapa} size={24} />
                        <BsChevronRight className="cadastroModal-btn-proximo" onClick={avancarEtapa} size={24} />
                    </div>
                </div>
            )}

            {etapaAtual === 3 && (
                <div className="cadastroModal-etapa">
                    <h2 className="cadastroModal-header">Dados de Contato e Senha</h2>
                    <input
                        className="cadastroModal-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                    <div className="telefone-section">
                        {telefones.map((telefone, index) => (
                            <div key={index} className="telefone-item">
                                <InputMask
                                    className="cadastroModal-input"
                                    mask="(99) 99999-9999"
                                    value={telefone.numTelefone}
                                    onChange={(e) => handleTelefoneChange(index, e.target.value)}
                                />
                                <AiFillDelete onClick={() => handleDeleteTelefone(index)} className="telefone-item-delete" size={28} />
                            </div>
                        ))}
                        <div className="adicionar-telefone">
                            <InputMask
                                className="cadastroModal-input"
                                mask="(99) 99999-9999"
                                placeholder="Novo telefone"
                                value={novoTelefone}
                                onChange={(e) => setNovoTelefone(e.target.value)}
                            />
                            <BsPlusCircle onClick={handleAddTelefone} className="telefone-item-adicionar" size={28} />
                        </div>
                    </div>
                    <input
                        className="cadastroModal-input"
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                    />
                    {formErrors.senha && <div className="error-message">{formErrors.senha}</div>}
                    <div className='cadastroModal-btn-container'>
                        <BsChevronLeft className="cadastroModal-btn-proximo" onClick={voltarEtapa} size={24} />
                        {isLoadingCadastrar ? (
                            <AiOutlineLoading className="cadastroModal-btn-relacionar cadastroModal-spinner-icon" />
                        ) : (
                            <AiOutlineCheck className="cadastroModal-btn-relacionar" onClick={handleConfirmar} size={28} />
                        )}
                    </div>
                </div>
            )}
            {showSuccessMessage && <div className="cadastroModal-sucess-message">Cadastro realizado com sucesso!</div>}
            {showErrorMessage && <div className="cadastroModal-error-message">Erro ao cadastrar. Verifique os campos e tente novamente.</div>}
        </Modal>
    );
};

export default CadastroModal;
