import React from 'react';
import './FeedbackMessage.css';

const FeedbackMessage = ({ type, message }) => {
    if (!message) return null; // Não exibe nada se não houver mensagem

    return (
        <div className={`feedback-message ${type}`}>
            {message}
        </div>
    );
};

export default FeedbackMessage;
