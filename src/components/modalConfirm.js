import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <FaExclamationTriangle style={{ color: "#f39c12", fontSize: "50px" }} />
        <h2>Confirmação</h2>
        <p>{message}</p>
        <div style={styles.buttons}>
          <button style={styles.confirmButton} onClick={onConfirm}>
            Sim
          </button>
          <button style={styles.cancelButton} onClick={onCancel}>
            Não
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "350px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  confirmButton: {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "green",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "red",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ConfirmationModal;
