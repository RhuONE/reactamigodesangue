import React from 'react';
import Modal from 'react-modal';
import './ModalStyles.css';

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="confirmation-modal"
            overlayClassName="confirmation-overlay"
        >
            <h2>Confirmação</h2>
            <p>{message}</p>
            <div className="modal-buttons">
                <button onClick={onConfirm} className="confirm-btn">Confirmar</button>
                <button onClick={onRequestClose} className="cancel-btn">Cancelar</button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
