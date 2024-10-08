import React, { useState } from 'react';
import './CadastrarCampanhaModal.css';

const CadastrarCampanhaModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        tituloCampanha: '',
        descCampanha: '',
        dataInicioCampanha: '',
        dataFimCampanha: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            setErrorMessage('');
            await onSave(formData);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                setErrorMessage(errorMessages);
            } else {
                setErrorMessage('Erro ao cadastrar campanha.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Cadastrar Nova Campanha</h2>
                <form>
                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            name="tituloCampanha"
                            value={formData.tituloCampanha}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            name="descCampanha"
                            value={formData.descCampanha}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data de Início</label>
                        <input
                            type="date"
                            name="dataInicioCampanha"
                            value={formData.dataInicioCampanha}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data de Término</label>
                        <input
                            type="date"
                            name="dataFimCampanha"
                            value={formData.dataFimCampanha}
                            onChange={handleChange}
                        />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

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

export default CadastrarCampanhaModal;
