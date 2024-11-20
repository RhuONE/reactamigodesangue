import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <FaExclamationCircle style={{ color: "red", fontSize: "50px" }} />
        <h2 style={{textAlign: 'center'}}>Erro!</h2>
        <p>{message}</p>
        <button style={styles.button} onClick={onClose}>
          Fechar
        </button>
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
    width: "300px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    border: "none",
    backgroundColor: "red",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ErrorModal;
