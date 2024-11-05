import React, { useState } from 'react';
import './CadastrarDoacaoModal.css';
import InputMask from 'react-input-mask';
import api from '../services/api';

const CadastrarDoacaoModal = ({ isOpen, onClose, onSave, funcionarios }) => {
    const [formData, setFormData] = useState({
        quantidadeMLDoacao: '',
        tipoDoacao: '',
        observacaoDoacao: '',
        dataDoacao: '',
        cpfUsuario: '',
        idFuncionario: '',
        descTipoSanguineo: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [isTipoSanguineoVisible, setIsTipoSanguineoVisible] = useState(false); // Para controle da exibição

    // Função para buscar o usuário por CPF
    const buscarUsuarioPorCpf = async (cpf) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/usuarios/buscarPorCpf/${cpf}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Retorna o usuário encontrado
        } catch (error) {
            console.error('Erro ao buscar o usuário:', error);
            return null; // Retorna nulo se ocorrer um erro
        }
    };

    // Verificar o CPF do usuário e exibir o campo de tipo sanguíneo se necessário
    const handleCpfBlur = async () => {
        const usuario = await buscarUsuarioPorCpf(formData.cpfUsuario);

        if (usuario && !usuario.descTipoSanguineo) {
            setIsTipoSanguineoVisible(true); // Exibe o campo se o tipo sanguíneo for nulo
        } else {
            setIsTipoSanguineoVisible(false); // Oculta o campo se o tipo sanguíneo já estiver definido
            if (usuario) {
                setFormData((prevData) => ({
                    ...prevData,
                    descTipoSanguineo: usuario.descTipoSanguineo,
                }));
            }
        }
    };

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
            await onSave(formData); // Salva os dados
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                setErrorMessage(errorMessages);
            } else {
                setErrorMessage('Erro ao registrar doação.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Registrar Nova Doação</h2>
                <form>
                    <div className="form-group">
                        <label>Quantidade (ml)</label>
                        <input
                            type="text"
                            name="quantidadeMLDoacao"
                            value={formData.quantidadeMLDoacao}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Tipo de Doação</label>
                        <input
                            type="text"
                            name="tipoDoacao"
                            value={formData.tipoDoacao}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Observação</label>
                        <input
                            type="text"
                            name="observacaoDoacao"
                            value={formData.observacaoDoacao}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data da Doação</label>
                        <input
                            type="date"
                            name="dataDoacao"
                            value={formData.dataDoacao}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>CPF do Doador</label>
                        <InputMask
                            mask="99999999999"
                            name="cpfUsuario"
                            value={formData.cpfUsuario}
                            onBlur={handleCpfBlur} // Verifica o CPF ao perder o foco
                            onChange={handleChange}
                        >
                            {(inputProps) => <input {...inputProps} type="text" />}
                        </InputMask>
                    </div>

                    {isTipoSanguineoVisible && (
                        <div className="form-group">
                            <label>Tipo Sanguíneo doado</label>
                            <select
                                name="descTipoSanguineo"
                                value={formData.descTipoSanguineo}
                                onChange={handleChange}
                            >
                                <option value="">Selecione o tipo sanguíneo</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Funcionário Responsável</label>
                        <select
                            name="idFuncionario"
                            value={formData.idFuncionario}
                            onChange={handleChange}
                        >
                            <option value="">Selecione o funcionário</option>
                            {funcionarios.map((funcionario) => (
                                <option key={funcionario.idFuncionario} value={funcionario.idFuncionario}>
                                    {funcionario.nomeFuncionario}
                                </option>
                            ))}
                        </select>
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

export default CadastrarDoacaoModal;
