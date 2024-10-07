import React, { useState, useEffect } from 'react';
import './EditHemocentroModal.css';

const EditHemocentroModal = ({ hemocentro, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nomeHemocentro: '',
        logHemocentro: '',
        numLogHemocentro: '',
        compHemocentro: '',
        bairroHemocentro: '',
        cidadeHemocentro: '',
        estadoHemocentro: '',
        cepHemocentro: '',
        telHemocentro: '',
        emailHemocentro: '',
        senhaHemocentro: '',
        cnpjHemocentro: '',
        hospitalVinculadoHemocentro: '',
    });

    const [currentStep, setCurrentStep] = useState(1);

    // Atualiza os valores do formData quando o hemocentro é recebido
    useEffect(() => {
        if (hemocentro) {
            setFormData({
                nomeHemocentro: hemocentro.nomeHemocentro || '',
                logHemocentro: hemocentro.logHemocentro || '',
                numLogHemocentro: hemocentro.numLogHemocentro || '',
                compHemocentro: hemocentro.compHemocentro || '',
                bairroHemocentro: hemocentro.bairroHemocentro || '',
                cidadeHemocentro: hemocentro.cidadeHemocentro || '',
                estadoHemocentro: hemocentro.estadoHemocentro || '',
                cepHemocentro: hemocentro.cepHemocentro || '',
                telHemocentro: hemocentro.telHemocentro || '',
                emailHemocentro: hemocentro.emailHemocentro || '',
                senhaHemocentro: '',
                cnpjHemocentro: hemocentro.cnpjHemocentro || '',
                hospitalVinculadoHemocentro: hemocentro.hospitalVinculadoHemocentro || '',
            });
        }
    }, [hemocentro]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Informações do Hemocentro</h2>
                <form>
                    {currentStep === 1 && (
                        <>
                            <h3>Informações Básicas</h3>
                            <div className="form-group">
                                <label>Nome</label>
                                <input
                                    type="text"
                                    name="nomeHemocentro"
                                    value={formData.nomeHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Logradouro</label>
                                <input
                                    type="text"
                                    name="logHemocentro"
                                    value={formData.logHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Número</label>
                                <input
                                    type="text"
                                    name="numLogHemocentro"
                                    value={formData.numLogHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Complemento</label>
                                <input
                                    type="text"
                                    name="compHemocentro"
                                    value={formData.compHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Bairro</label>
                                <input
                                    type="text"
                                    name="bairroHemocentro"
                                    value={formData.bairroHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Cidade</label>
                                <input
                                    type="text"
                                    name="cidadeHemocentro"
                                    value={formData.cidadeHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <input
                                    type="text"
                                    name="estadoHemocentro"
                                    value={formData.estadoHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={handleNext}>
                                    Próximo
                                </button>
                                <button type="button" onClick={onClose}>
                                    Cancelar
                                </button>
                            </div>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <h3>Informações de Contato</h3>
                            <div className="form-group">
                                <label>CEP</label>
                                <input
                                    type="text"
                                    name="cepHemocentro"
                                    value={formData.cepHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Telefone</label>
                                <input
                                    type="text"
                                    name="telHemocentro"
                                    value={formData.telHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="text"
                                    name="emailHemocentro"
                                    value={formData.emailHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Senha</label>
                                <input
                                    type="text"
                                    name="sehaHemocentro"
                                    value={formData.senhaHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>CNPJ</label>
                                <input
                                    type="text"
                                    name="cnpjHemocentro"
                                    value={formData.cnpjHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Hospital Vinculado</label>
                                <input
                                    type="text"
                                    name="hospitalVinculadoHemocentro"
                                    value={formData.hospitalVinculadoHemocentro}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={handleBack}>
                                    Voltar
                                </button>
                                <button type="button" onClick={handleSubmit}>
                                    Salvar
                                </button>
                                <button type="button" onClick={onClose}>
                                    Cancelar
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditHemocentroModal;
