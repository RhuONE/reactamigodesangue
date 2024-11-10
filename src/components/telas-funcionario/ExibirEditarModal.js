import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineLoading, AiOutlineDelete, AiFillDelete} from 'react-icons/ai';
import { BsChevronLeft, BsChevronRight, BsPlusCircle, BsDownload } from 'react-icons/bs';
import InputMask from 'react-input-mask';
import './ExibirEditarModal.css';
import api from '../../services/api';
import './ConfirmacaoModal';

const ExibirEditarModal = ({ isOpen, onRequestClose, usuarioEncontrado, onEditarUsuario, onConfirmarRelacionamento, onAtualizarTelefone }) => {
    const [etapaAtual, setEtapaAtual] = useState(1);
    const [formData, setFormData] = useState({
        nomeUsuario: '',
        cpfUsuario: '',
        dataNascUsuario: '',
        generoUsuario: '',
        logUsuario: '',
        numLogUsuario: '',
        compUsuario: '',
        bairroUsuario: '',
        cidadeUsuario: '',
        estadoUsuario: '',
        cepUsuario: '',
        emailUsuario: '',
        senhaUsuario: ''
    });
    const [telefones, setTelefones] = useState([]);
    const [novoTelefone, setNovoTelefone] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [isLoadingConfirmarRelacionamento, setIsLoadingConfirmarRelacionamento] = useState(false);
    const [isLoadingEditar, setIsLoadingEditar] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const [fotoUsuario, setFotoUsuario] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    const avancarEtapa = () => setEtapaAtual(etapaAtual + 1);
    const voltarEtapa = () => setEtapaAtual(etapaAtual - 1);

    const onAdicionarTelefone = async (novoTelefone) => {
        try {
            const response = await api.post('/usuario/fone', {
                numTelefone: novoTelefone,
                idUsuario: usuarioEncontrado.idUsuario,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.status !== 201) {
                throw new Error('Erro ao adicionar o telefone');
            }
    
            // Extrai o número de telefone da resposta correta
            const novoTelefoneData = response.data.data.telefone || response.data.data.foneUsuario;
    
            if (novoTelefoneData) {
                setTelefones((prevTelefones) => [...prevTelefones, novoTelefoneData]);
            } else {
                console.warn('Número de telefone não encontrado na resposta:', response.data);
            }
    
            setNovoTelefone('');
            console.log('Telefone adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar o telefone:', error);
            console.log('Houve um erro ao tentar adicionar o telefone. Tente novamente.');
        }
    };
    
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoUsuario(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };
    
    const handleFotoUpload = async () => {
        if (!fotoUsuario) return;
    
        const formData = new FormData();
        formData.append('foto', fotoUsuario);
    
        try {
            const response = await api.post(`/usuario/${usuarioEncontrado.idUsuario}/upload-foto`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                console.log('Foto atualizada com sucesso!');
            } else {
                throw new Error('Erro ao atualizar a foto');
            }
        } catch (error) {
            console.error('Erro ao atualizar a foto:', error);
            console.log('Houve um erro ao tentar atualizar a foto. Tente novamente.');
        }
    };
    

    useEffect(() => {
        if (usuarioEncontrado) {
            setFormData({
                idUsuario: usuarioEncontrado.idUsuario || '',
                nomeUsuario: usuarioEncontrado.nomeUsuario || '',
                cpfUsuario: usuarioEncontrado.cpfUsuario || '',
                dataNascUsuario: usuarioEncontrado.dataNascUsuario
                    ? usuarioEncontrado.dataNascUsuario.split(' ')[0]
                    : '',
                generoUsuario: usuarioEncontrado.generoUsuario || '',
                logUsuario: usuarioEncontrado.logUsuario || '',
                numLogUsuario: usuarioEncontrado.numLogUsuario || '',
                compUsuario: usuarioEncontrado.compUsuario || '',
                bairroUsuario: usuarioEncontrado.bairroUsuario || '',
                cidadeUsuario: usuarioEncontrado.cidadeUsuario || '',
                estadoUsuario: usuarioEncontrado.estadoUsuario || '',
                cepUsuario: usuarioEncontrado.cepUsuario || '',
                emailUsuario: usuarioEncontrado.emailUsuario || '',
                senhaUsuario: ''
            });
            if (usuarioEncontrado.fotoUsuario) {
                const baseUrl = 'http://localhost:8000/storage/'; // ajuste conforme necessário
                setFotoPreview(`${baseUrl}${usuarioEncontrado.fotoUsuario}`);
            } else {
                setFotoPreview(null);
            }

            api.get(`/usuarios/${usuarioEncontrado.idUsuario}/telefones`)
                .then(response => setTelefones(response.data.data || []))
                .catch(error => console.error('Erro ao buscar os telefones:', error));
            setIsEditable(false);
        }
    }, [usuarioEncontrado]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);

        if (name === 'cepUsuario' && value.length === 9) {
            buscarEnderecoPorCep(value.replace('-', ''));
        }
    };

    const handleTelefoneChange = (index, value) => {
        const updatedTelefones = [...telefones];
        updatedTelefones[index].numTelefone = value;
        setTelefones(updatedTelefones);
    };

    const handleAddTelefone = () => {
        if (novoTelefone.trim()) {
            onAdicionarTelefone(novoTelefone);
        }
    };

    const handleSaveTelefone = (telefone) => {
        onAtualizarTelefone(telefone);
    };

    const handleDeleteTelefone = async (idFoneUsuario) => {
        try {
            const response = await api.delete(`/usuario/fone/${idFoneUsuario}`);
            if (response.status === 200) {
                setTelefones((prevTelefones) =>
                    prevTelefones.filter(telefone => telefone.idFoneUsuario !== idFoneUsuario)
                );
                console.log('Telefone deletado com sucesso!');
            } else {
                throw new Error('Erro ao deletar o telefone');
            }
        } catch (error) {
            console.error('Erro ao deletar o telefone:', error);
            console.log('Houve um erro ao tentar deletar o telefone. Tente novamente.');
        }
    };

    const validateField = (name, value) => {
        let errors = { ...formErrors };
        if (!value) {
            errors[name] = 'Este campo é obrigatório';
        } else {
            delete errors[name];
        }

        if (name === 'emailUsuario' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors[name] = 'Formato de email inválido';
            }
        }

        setFormErrors(errors);
    };

    const isFormValid = () => {
        const requiredFields = ['nomeUsuario', 'cpfUsuario', 'dataNascUsuario', 'generoUsuario', 'logUsuario', 'numLogUsuario', 'bairroUsuario', 'cidadeUsuario', 'estadoUsuario', 'cepUsuario', 'emailUsuario'];
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
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                setShowErrorMessage(true);
                setTimeout(() => setShowErrorMessage(false), 3000);
                return;
            }
            setFormData((prevData) => ({
                ...prevData,
                logUsuario: data.logradouro || '',
                bairroUsuario: data.bairro || '',
                cidadeUsuario: data.localidade || '',
                estadoUsuario: data.uf || ''
            }));
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 3000);
        } finally {
            setIsCepLoading(false);
        }
    };

    const handleEditClick = async () => {
        if (isEditable) {
            if (!isFormValid()) {
                setShowErrorMessage(true);
                setTimeout(() => setShowErrorMessage(false), 3000);
                
                return;
            }

            setIsLoadingEditar(true);
            try {
                console.log('Enviando dados para edição:', formData);
                await onEditarUsuario(formData);
                console.log('Edição bem-sucedida');
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            } catch (error) {
                console.error('Erro ao editar usuário:', error);
                setShowErrorMessage(true);
                setTimeout(() => setShowErrorMessage(false), 3000);
            } finally {
                setIsLoadingEditar(false);
            }
        }
        setIsEditable(!isEditable);
    };

    const handleConfirmarRelacionamento = async () => {
        if (!isFormValid()) {
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 3000);
            return;
        }

        setIsLoadingConfirmarRelacionamento(true);
        try {
            await onConfirmarRelacionamento({ idUsuario: usuarioEncontrado.idUsuario, ...formData });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 3000);
        } finally {
            setIsLoadingConfirmarRelacionamento(false);
            onRequestClose();
        }
    };

    const renderIndicadorDePasso = () => (
        <div className="exibirEditarModal-steps">
            <div className={`exibirEditarModal-step ${etapaAtual === 1 ? 'active' : ''}`}>
                <FaUser className="exibirEditarModal-step-icon" />
                <span>1. Dados Pessoais</span>
            </div>
            <div className={`exibirEditarModal-step ${etapaAtual === 2 ? 'active' : ''}`}>
                <FaMapMarkerAlt className="exibirEditarModal-step-icon" />
                <span>2. Endereço</span>
            </div>
            <div className={`exibirEditarModal-step ${etapaAtual === 3 ? 'active' : ''}`}>
                <FaPhone className="exibirEditarModal-step-icon" />
                <span>3. Contato</span>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="exibirEditarModal-content"
            overlayClassName="exibirEditarModal-overlay"
        >
            {renderIndicadorDePasso()}
            
            {etapaAtual === 1 && (
                <div className="exibirEditarModal-etapa">
                    <div className='exibirEditarModal-btn-container'>
                        <h2 className="exibirEditarModal-header">Dados Pessoais</h2>
                        <div className='direita espaco-para-baixo'>
                            {!isEditable ? (
                                <AiOutlineEdit className='exibirEditarModal-btn-proximo' onClick={handleEditClick} size={24}/>
                            ) : (
                                isLoadingEditar ? <AiOutlineLoading className='exibirEditarModal-btn-relacionar exibirEditarModal-spinner-icon' />
                                    : <AiOutlineCheck className='exibirEditarModal-btn-relacionar' onClick={() => {handleEditClick(); handleFotoUpload();}} size={24}/>   
                            )}
                        </div>
                    </div>
                    <div className='centralizado'>
                        <div className='exibirEditarModal-foto-container'>
                            <img src={fotoPreview || 'http://localhost:8000/storage/uploads/usuarios/perfil-padrao.jpg'} alt="Foto do usuário" className="foto-preview" />
                                {isEditable && (
                                        <>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleFotoChange} 
                                            className="input-foto" 
                                            id="fileInput" 
                                            style={{ display: 'none' }} // Esconde o input
                                        />
                                        <BsDownload 
                                            onClick={() => document.getElementById('fileInput').click()} 
                                            className="exibirEditarModal-upload-foto-button"
                                            size={28}
                                        />
                                        
                                    </>
                                )}
                        </div>
                    </div>
                    <input
                        className="exibirEditarModal-input"
                        name="nomeUsuario"
                        placeholder="Nome"
                        value={formData.nomeUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    {formErrors.nomeUsuario && <div className="error-message">{formErrors.nomeUsuario}</div>}
                    <InputMask
                        className="exibirEditarModal-input"
                        mask='999.999.999-99'
                        name="cpfUsuario"
                        value={formData.cpfUsuario}
                        disabled
                    />
                    {formErrors.cpfUsuario && <div className="error-message">{formErrors.cpfUsuario}</div>}
                    <input
                        className="exibirEditarModal-input"
                        type="date"
                        name="dataNascUsuario"
                        placeholder="Data de Nascimento"
                        value={formData.dataNascUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    {formErrors.dataNascUsuario && <div className="error-message">{formErrors.dataNascUsuario}</div>}
                    <select
                        className="exibirEditarModal-input-select"
                        name="generoUsuario"
                        value={formData.generoUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    >
                        <option value="">Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                    </select>
                    {formErrors.generoUsuario && <div className="error-message">{formErrors.generoUsuario}</div>}
                    <div className='direita'>                    
                        <BsChevronRight className="exibirEditarModal-btn-proximo" onClick={avancarEtapa} size={24}/>       
                    </div>
                </div>
            )}

            {etapaAtual === 2 && (
                <div className="exibirEditarModal-etapa">
                    <div className='exibirEditarModal-btn-container'>
                        <h2 className="exibirEditarModal-header">Endereço</h2>
                        <div className='direita espaco-para-baixo'>
                            {!isEditable ? (
                                <AiOutlineEdit className='exibirEditarModal-btn-proximo' onClick={handleEditClick} size={24}/>
                            ) : (
                                isLoadingEditar ? <AiOutlineLoading className='exibirEditarModal-btn-relacionar exibirEditarModal-spinner-icon' />
                                    : <AiOutlineCheck className='exibirEditarModal-btn-relacionar' onClick={handleEditClick} size={24}/>   
                            )}
                        </div>
                    </div>
                    <InputMask
                        className="exibirEditarModal-input"
                        mask='99999-999'
                        name="cepUsuario"
                        value={formData.cepUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    {formErrors.cepUsuario && <div className="error-message">{formErrors.cepUsuario}</div>}
                    {isCepLoading && <AiOutlineLoading className="cep-loading-spinner" />}
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="logUsuario"
                        placeholder="Ex: Rua A, Av. B"
                        value={formData.logUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    {formErrors.logUsuario && <div className="error-message">{formErrors.logUsuario}</div>}
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="numLogUsuario"
                        placeholder="Número"
                        value={formData.numLogUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    {formErrors.numLogUsuario && <div className="error-message">{formErrors.numLogUsuario}</div>}
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="compUsuario"
                        placeholder="Complemento"
                        value={formData.compUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="bairroUsuario"
                        placeholder="Bairro"
                        value={formData.bairroUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    {formErrors.bairroUsuario && <div className="error-message">{formErrors.bairroUsuario}</div>}
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="cidadeUsuario"
                        placeholder="Cidade"
                        value={formData.cidadeUsuario}
                        onChange={handleInputChange}
                        disabled
                    />
                    {formErrors.cidadeUsuario && <div className="error-message">{formErrors.cidadeUsuario}</div>}
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="estadoUsuario"
                        placeholder="Estado"
                        value={formData.estadoUsuario}
                        onChange={handleInputChange}
                        disabled
                    />
                    {formErrors.estadoUsuario && <div className="error-message">{formErrors.estadoUsuario}</div>}
                    <div className='exibirEditarModal-btn-container'>
                        <BsChevronLeft className="exibirEditarModal-btn-proximo" onClick={voltarEtapa} size={24}/> 
                        <BsChevronRight className="exibirEditarModal-btn-proximo" onClick={avancarEtapa} size={24}/> 
                    </div>
                </div>
            )}

            {etapaAtual === 3 && (
                <div className="exibirEditarModal-etapa">
                    <div className='exibirEditarModal-btn-container'>
                        <h2 className="exibirEditarModal-header">Contato</h2>
                        <div className='direita espaco-para-baixo'>
                            {!isEditable ? (
                                <AiOutlineEdit className='exibirEditarModal-btn-proximo' onClick={handleEditClick} size={24}/>
                            ) : (
                                isLoadingEditar ? <AiOutlineLoading className='exibirEditarModal-btn-relacionar exibirEditarModal-spinner-icon' />
                                    : <AiOutlineCheck className='exibirEditarModal-btn-relacionar' onClick={handleEditClick} size={24}/>   
                            )}
                        </div>
                    </div>
                    <input
                        className="exibirEditarModal-input"
                        type="email"
                        name="emailUsuario"
                        placeholder="Email"
                        value={formData.emailUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    {formErrors.emailUsuario && <div className="error-message">{formErrors.emailUsuario}</div>}
                    
                    <div className="telefone-section">
                    
                        {telefones.map((telefone, index) => (
                            <div key={index} className="telefone-item">
                                <InputMask
                                    className="exibirEditarModal-input"
                                    mask='(99) 99999-9999'
                                    value={telefone.numFoneUsuario || telefone.numTelefone} // Verifique se está acessando corretamente a propriedade
                                    onChange={(e) => handleTelefoneChange(index, e.target.value)}
                                    disabled={!isEditable}
                                />
                                {isEditable && (
                                    <>

                                <AiFillDelete onClick={() => handleDeleteTelefone(telefone.idFoneUsuario || telefone.idTelefone)} className="telefone-item-delete" disabled={!isEditable} size={28} />
                                    </>
                                )}
                            </div>
                        ))}

                        {isEditable && (
                            <div className="adicionar-telefone">
                                <InputMask
                                    className="exibirEditarModal-input"
                                    mask='(99) 99999-9999'
                                    placeholder="Novo telefone"
                                    value={novoTelefone}
                                    onChange={(e) => setNovoTelefone(e.target.value)}
                                />
                                <BsPlusCircle onClick={handleAddTelefone} className='telefone-item-adicionar' size={28} />
                            </div>
                        )}
                    </div>
                    <div className='exibirEditarModal-btn-container'>
                        <BsChevronLeft className="exibirEditarModal-btn-proximo" onClick={voltarEtapa} size={24}/>  
                        {isLoadingConfirmarRelacionamento ? <AiOutlineLoading className='exibirEditarModal-btn-relacionar exibirEditarModal-spinner-icon' />  
                            : <AiOutlineCheck className='exibirEditarModal-btn-relacionar' onClick={handleConfirmarRelacionamento} size={28}/>
                        }
                    </div>
                </div>
            )}
            {showSuccessMessage && <div className="exibirEditalModal-sucess-message">Alterações salvas com sucesso!</div>}
            {showErrorMessage && <div className="exibirEditalModal-error-message">Erro ao salvar alterações. Tente novamente.</div>}    
        </Modal>
    );
};

export default ExibirEditarModal;
