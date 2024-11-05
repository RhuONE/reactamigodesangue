import React from 'react';
import './DoadorDetalhesModal.css';

const DoadorDetalhesModal = ({ isOpen, onRequestClose, doador }) => {
    if (!isOpen || !doador) return null;

    return (
        <div className="doadorDetalhes-modal">
            <div className="doadorDetalhes-content">
                <h2>Dados do Doador</h2>
                <p><strong>Nome:</strong> {doador.nomeUsuario}</p>
                <p><strong>Email:</strong> {doador.emailUsuario}</p>
                <p><strong>CPF:</strong> {doador.cpfUsuario}</p>
                <p><strong>Data de Nascimento:</strong> {doador.dataNascUsuario}</p>
                <p><strong>Gênero:</strong> {doador.generoUsuario}</p>
                <p><strong>Telefone:</strong> {doador.numTelefone}</p>
                <button onClick={onRequestClose}>Fechar</button>
            </div>
        </div>
    );
};

export default DoadorDetalhesModal;
