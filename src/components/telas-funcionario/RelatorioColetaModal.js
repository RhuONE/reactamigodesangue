// RelatorioColetaModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import './RelatorioColetaModal.css';

Modal.setAppElement('#root');

const RelatorioColetaModal = ({ isOpen, onRequestClose, onSubmitRelatorio }) => {
    const [quantidadeMl, setQuantidadeMl] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const handleSalvarRelatorio = () => {
        const relatorio = {
            quantidadeMl,
            observacoes,
        };
        onSubmitRelatorio(relatorio);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Relatório de Coleta"
            className="relatorioColeta-modal"
            overlayClassName="relatorioColeta-overlay"
        >
            <h2>Relatório de Coleta</h2>
            <form>
                <label>Quantidade Coletada (ml):</label>
                <input
                    type="number"
                    value={quantidadeMl}
                    onChange={(e) => setQuantidadeMl(e.target.value)}
                    placeholder="Insira a quantidade em ml"
                />
                
                <label>Observações:</label>
                <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Insira observações (opcional)"
                ></textarea>

                <div className="relatorioColeta-actions">
                    <button type="button" onClick={handleSalvarRelatorio} className="salvar-btn">Salvar Relatório</button>
                    <button type="button" onClick={onRequestClose} className="cancelar-btn">Cancelar</button>
                </div>
            </form>
        </Modal>
    );
};

export default RelatorioColetaModal;
