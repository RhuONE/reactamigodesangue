import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ExibirEditarModal.css';

const ExibirEditarModal = ({ isOpen, onRequestClose, usuarioEncontrado, onEditarUsuario, onConfirmarRelacionamento }) => {
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
        numTelefone: '',
        senhaUsuario: ''
    });

    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        if (usuarioEncontrado) {
            setFormData({
                idUsuario: usuarioEncontrado.idUsuario || '', // Inclui idUsuario aqui
                nomeUsuario: usuarioEncontrado.nomeUsuario || '',
                cpfUsuario: usuarioEncontrado.cpfUsuario || '',
                dataNascUsuario: usuarioEncontrado.dataNascUsuario || '',
                generoUsuario: usuarioEncontrado.generoUsuario || '',
                logUsuario: usuarioEncontrado.logUsuario || '',
                numLogUsuario: usuarioEncontrado.numLogUsuario || '',
                compUsuario: usuarioEncontrado.compUsuario || '',
                bairroUsuario: usuarioEncontrado.bairroUsuario || '',
                cidadeUsuario: usuarioEncontrado.cidadeUsuario || '',
                estadoUsuario: usuarioEncontrado.estadoUsuario || '',
                cepUsuario: usuarioEncontrado.cepUsuario || '',
                emailUsuario: usuarioEncontrado.emailUsuario || '',
                numTelefone: usuarioEncontrado.numTelefone || '',
                senhaUsuario: ''
            });
            setIsEditable(false);
        }
    }, [usuarioEncontrado]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const avancarEtapa = () => setEtapaAtual(etapaAtual + 1);
    const voltarEtapa = () => setEtapaAtual(etapaAtual - 1);

    const handleConfirmarAlteracoes = () => {
        onEditarUsuario(formData);
        onRequestClose();
    };

    const handleConfirmarRelacionamento = () => {
        // Passa o idUsuario junto com os dados do usuário
        onConfirmarRelacionamento({ idUsuario: usuarioEncontrado.idUsuario, ...formData });
        onRequestClose();
    };

    const handleEditClick = () => {
        setIsEditable(true);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="exibirEditarModal-content"
            overlayClassName="exibirEditarModal-overlay"
        >
            {etapaAtual === 1 && (
                <div className="exibirEditarModal-etapa">
                    <h2 className="exibirEditarModal-header">Dados Pessoais</h2>
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="nomeUsuario"
                        placeholder="Nome"
                        value={formData.nomeUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="cpfUsuario"
                        placeholder="CPF"
                        value={formData.cpfUsuario}
                        disabled
                    />
                    <input
                        className="exibirEditarModal-input"
                        type="date"
                        name="dataNascUsuario"
                        placeholder="Data de Nascimento"
                        value={formData.dataNascUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    <select
                        className="exibirEditarModal-input"
                        name="generoUsuario"
                        value={formData.generoUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    >
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                    </select>
                    <button className="exibirEditarModal-btn" onClick={avancarEtapa}>
                        Próximo
                    </button>
                </div>
            )}

            {etapaAtual === 2 && (
                <div className="exibirEditarModal-etapa">
                    <h2 className="exibirEditarModal-header">Endereço</h2>
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="logUsuario"
                        placeholder="Logradouro"
                        value={formData.logUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="numLogUsuario"
                        placeholder="Número"
                        value={formData.numLogUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
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
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="cidadeUsuario"
                        placeholder="Cidade"
                        value={formData.cidadeUsuario}
                        onChange={handleInputChange}
                        disabled
                    />
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="estadoUsuario"
                        placeholder="Estado"
                        value={formData.estadoUsuario}
                        onChange={handleInputChange}
                        disabled
                    />
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="cepUsuario"
                        placeholder="CEP"
                        value={formData.cepUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    <button className="exibirEditarModal-btn" onClick={voltarEtapa}>
                        Voltar
                    </button>
                    <button className="exibirEditarModal-btn" onClick={avancarEtapa}>
                        Próximo
                    </button>
                </div>
            )}

            {etapaAtual === 3 && (
                <div className="exibirEditarModal-etapa">
                    <h2 className="exibirEditarModal-header">Contato</h2>
                    <input
                        className="exibirEditarModal-input"
                        type="email"
                        name="emailUsuario"
                        placeholder="Email"
                        value={formData.emailUsuario}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    <input
                        className="exibirEditarModal-input"
                        type="text"
                        name="numTelefone"
                        placeholder="Telefone"
                        value={formData.numTelefone}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                    />
                    <button className="exibirEditarModal-btn" onClick={voltarEtapa}>
                        Voltar
                    </button>
                    <button className="exibirEditarModal-btn" onClick={handleConfirmarAlteracoes} disabled={!isEditable}>
                        Confirmar Alterações
                    </button>
                </div>
            )}

            <button className="exibirEditarModal-btn-relacionar" onClick={handleConfirmarRelacionamento}>
                Confirmar Relacionamento
            </button>

            {!isEditable && (
                <button className="exibirEditarModal-btn-editar" onClick={handleEditClick}>
                    Editar
                </button>
            )}
        </Modal>
    );
};

export default ExibirEditarModal;
