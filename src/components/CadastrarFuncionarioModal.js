import React, { useState } from 'react';
import './CadastrarFuncionarioModal.css';
import InputMask from 'react-input-mask';

const CadastrarFuncionarioModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nomeFuncionario: '',
        cpfFuncionario: '',
        descFuncionario: '',
        emailFuncionario: '',
        senhaFuncionario: '',
        numTelefone: '',
    });

    const [errorMessage, setErrorMessage] = useState(''); // Novo estado para capturar o erro

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            setErrorMessage(''); // Limpa a mensagem de erro antes de tentar salvar
            await onSave(formData); // Salva os dados usando a função onSave passada pelo pai
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                // Captura a mensagem de erro da API e define no estado
                const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                setErrorMessage(errorMessages);
            } else {
                setErrorMessage('Ocorreu um erro ao cadastrar o funcionário.');
            }
        }
    };
    

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Cadastrar Novo Funcionário</h2>
                <form>
                    <div className="form-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            name="nomeFuncionario"
                            value={formData.nomeFuncionario}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>CPF</label>
                        <InputMask
                            mask={'999.999.999-99'}
                            type="text"
                            name="cpfFuncionario"
                            value={formData.cpfFuncionario}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Funcao</label>
                        <select name="descFuncionario" value={formData.descFuncionario} onChange={handleChange}>
                            <option value="" disabled>Selecione a área de atuação...</option>
                            <option value="totem">Totem</option>
                            <option value="recepcao">Recepção</option>
                            <option value="triagem">Triagem</option>
                            <option value="entrevista">Entrevista</option>
                            <option value="coleta">Coleta</option>
                            <option value="laboratorio">Laboratório</option>
                            <option value="estoque">Estoque</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="emailFuncionario"
                            value={formData.emailFuncionario}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="senha"
                            name="senhaFuncionario"
                            value={formData.senhaFuncionario}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefone</label>
                        <input
                            type="text"
                            name="numTelefone"
                            value={formData.numTelefone}
                            onChange={handleChange}
                        />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Exibe a mensagem de erro */}

                    <div className="modal-actions">
                        <button type="button" onClick={handleSubmit}>
                            Salvar
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CadastrarFuncionarioModal;
