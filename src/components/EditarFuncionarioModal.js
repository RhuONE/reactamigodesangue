import React, { useState, useEffect } from 'react';
import './EditarFuncionarioModal.css'; // Importar o CSS do modal

import InputMask from 'react-input-mask';

const EditarFuncionarioModal = ({ isOpen, onClose, onSave, funcionario }) => {
    const [formData, setFormData] = useState({
        nomeFuncionario: '',
        cpfFuncionario: '',
        emailFuncionario: '',
        descFuncionario: '',
        numTelefone: ''
    });

    useEffect(() => {
        // Preencher o modal com os dados do funcionário quando ele é passado
        if (funcionario) {
            setFormData({
                nomeFuncionario: funcionario.nomeFuncionario,
                cpfFuncionario: funcionario.cpfFuncionario,
                emailFuncionario: funcionario.emailFuncionario,
                descFuncionario: funcionario.descFuncionario,
                numTelefone: funcionario.numTelefone,
            });
        }
    }, [funcionario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Funcionário</h2>
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
                            disabled
                            type="text"
                            name="cpfFuncionario"
                            value={formData.cpfFuncionario}
                            onChange={handleChange}
                        />
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
                        <label>Telefone</label>
                        <input
                            type="text"
                            name="numTelefone"
                            value={formData.numTelefone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="save-btn" onClick={handleSubmit}>
                            Salvar
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarFuncionarioModal;
