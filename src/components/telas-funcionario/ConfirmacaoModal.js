// ConfirmacaoModal.js
import React from 'react';
import Modal from 'react-modal';
import './ConfirmacaoModal.css';

const ConfirmacaoModal = ({ isOpen, onRequestClose, onConfirm, mensagem }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="confirmacaoModal-content"
            overlayClassName="confirmacaoModal-overlay"
        >
            <h2 className="confirmacaoModal-header">Confirmação</h2>
            <p className="confirmacaoModal-mensagem">{mensagem}</p>
            <div className="confirmacaoModal-botoes">
                <button className="confirmacaoModal-btn confirmar" onClick={onConfirm}>
                    Confirmar
                </button>
                <button className="confirmacaoModal-btn cancelar" onClick={onRequestClose}>
                    Cancelar
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmacaoModal;
