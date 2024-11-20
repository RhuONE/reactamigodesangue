import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <FaCheckCircle style={{ color: "green", fontSize: "50px" }} />
        <h2 style={{textAlign:'center'}}>Sucesso!</h2>
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
    backgroundColor: "green",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SuccessModal;