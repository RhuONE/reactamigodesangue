import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'; // Importando axios para buscar o endereço por CEP
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
        telefone: '',
        senha: ''
    });

    // Função para atualizar o estado do formData conforme os campos forem preenchidos
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Se o campo for CEP e tiver 8 caracteres, busca o endereço
        if (name === 'cep' && value.length === 8) {
            buscarEnderecoPorCep(value);
        }
    };

    // Função para buscar o endereço pelo CEP
    const buscarEnderecoPorCep = (cep) => {
        axios.get(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (response.data.erro) {
                    alert('CEP não encontrado!');
                } else {
                    setFormData({
                        ...formData,
                        logradouro: response.data.logradouro,
                        bairro: response.data.bairro,
                        cidade: response.data.localidade,
                        estado: response.data.uf
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o endereço:', error);
            });
    };

    const avancarEtapa = () => setEtapaAtual(etapaAtual + 1);
    const voltarEtapa = () => setEtapaAtual(etapaAtual - 1);

    // Função para confirmar o cadastro e enviar os dados para a função de criar usuário
    const handleConfirmar = () => {
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
    
        // Verifica se algum campo obrigatório está vazio
        for (const field of requiredFields) {
            if (!formData[field]) {
                alert(`O campo ${field} é obrigatório.`);
                return;
            }
        }
    
        // Se todos os campos estão preenchidos, procede com o cadastro
        onCadastrarUsuario(formData);
        onRequestClose(); // Fecha o modal após confirmar
    };
    

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="cadastroModal-content"
            overlayClassName="cadastroModal-overlay"
        >
            {/* Etapa 1: Dados Pessoais */}
            {etapaAtual === 1 && (
                <div className="cadastroModal-etapa">
                    <h2 className="cadastroModal-header">Dados Pessoais</h2>
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="cpf"
                        placeholder="CPF"
                        value={formData.cpf}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="rg"
                        placeholder="RG"
                        value={formData.rg}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="date"
                        name="dataNasc"
                        placeholder="Data de Nascimento"
                        value={formData.dataNasc}
                        onChange={handleInputChange}
                    />
                    <select
                        className="cadastroModal-input"
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                    >
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                    </select>

                    <button className="cadastroModal-btn" onClick={avancarEtapa}>Próximo</button>
                </div>
            )}

            {/* Etapa 2: Dados de Endereço */}
            {etapaAtual === 2 && (
                <div className="cadastroModal-etapa">
                    <h2 className="cadastroModal-header">Dados de Endereço</h2>
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="cep"
                        placeholder="CEP"
                        value={formData.cep}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="logradouro"
                        placeholder="Logradouro"
                        value={formData.logradouro}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="numero"
                        placeholder="Número"
                        value={formData.numero}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="complemento"
                        placeholder="Complemento"
                        value={formData.complemento}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="bairro"
                        placeholder="Bairro"
                        value={formData.bairro}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="cidade"
                        placeholder="Cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        disabled
                    />
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="estado"
                        placeholder="Estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        disabled
                    />
                    <button className="cadastroModal-btn" onClick={voltarEtapa}>Voltar</button>
                    <button className="cadastroModal-btn" onClick={avancarEtapa}>Próximo</button>
                </div>
            )}

            {/* Etapa 3: Dados de Contato e Senha */}
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
                    <input
                        className="cadastroModal-input"
                        type="text"
                        name="telefone"
                        placeholder="Telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                    />
                    <input
                        className="cadastroModal-input"
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                    />
                    <button className="cadastroModal-btn" onClick={voltarEtapa}>Voltar</button>
                    <button className="cadastroModal-btn" onClick={handleConfirmar}>Confirmar e Relacionar</button>
                </div>
            )}
        </Modal>
    );
};

export default CadastroModal;
