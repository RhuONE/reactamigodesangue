import React, { useState } from "react";
import Modal from "react-modal";
import "./EnviarNotificacaoModal.css"; // Opcional: estilos específicos para o modal

const EnviarNotificacaoModal = ({ isOpen, onRequestClose, onSend, selectedUsers }) => {
  const [mensagem, setMensagem] = useState("");

  const handleEnviar = () => {
    if (!mensagem.trim()) {
      alert("A mensagem não pode estar vazia!");
      return;
    }
    onSend(mensagem); // Chama a função de envio com a mensagem
    setMensagem(""); // Reseta a mensagem após o envio
    onRequestClose(); // Fecha o modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Enviar Notificação"
      ariaHideApp={false} // Apenas se não houver rootId definido para o modal
      className="notificacao-modal"
      overlayClassName="notificacao-overlay"
    >
      <h2>Enviar Notificação</h2>
      <p>{selectedUsers.length} usuário(s) selecionado(s)</p>
      <textarea
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Escreva a mensagem aqui..."
        className="notificacao-textarea"
      ></textarea>
      <div className="modal-buttons">
        <button onClick={handleEnviar} className="send-button">
          Enviar
        </button>
        <button onClick={onRequestClose} className="cancel-button">
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default EnviarNotificacaoModal;
