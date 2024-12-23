// ConfirmacaoModal.js
import React from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import './ConfirmacaoModal.css';
import { ClipLoader } from 'react-spinners'; // Importando o spinner


const ConfirmacaoModal = ({ isOpen, onRequestClose, onConfirm, isLoading, mensagem }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="confirmacaoModal-content"
            overlayClassName="confirmacaoModal-overlay"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="confirmacaoModal-header">Confirmação</h2>
                <p className="confirmacaoModal-mensagem">{mensagem}</p>
                <div className="confirmacaoModal-botoes">
                    <button 
                        className="confirmacaoModal-btn confirmar" 
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? <ClipLoader size={16} color='#fff' /> : 'Confirmar'}
                    </button>
                    <button className="confirmacaoModal-btn cancelar" onClick={onRequestClose}>
                        Cancelar
                    </button>
                </div>
            </motion.div>
        </Modal>
    );
};

export default ConfirmacaoModal;
