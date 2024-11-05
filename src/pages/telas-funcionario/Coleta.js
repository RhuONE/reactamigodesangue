import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Coleta.css';

const Coleta = () => {
    const [doacoes, setDoacoes] = useState([]);
    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    const fetchDoacoesColeta = () => {
        api.get('/doacoes/senhas/coleta', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                idHemocentro,
            },
        })
        .then(response => {
            setDoacoes(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar doações para coleta:', error);
        });
    };

    useEffect(() => {
        fetchDoacoesColeta();
    }, []);

    const chamarColeta = (idDoacao) => {
        api.put(`/doacoes/senhas/chamar-coleta/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            fetchDoacoesColeta();
            alert('Doação chamada para coleta com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao chamar coleta:', error);
        });
    };

    const iniciarColeta = (idDoacao) => {
        const confirmacao = window.confirm("Você tem certeza que deseja iniciar a coleta?");
        if (confirmacao) {
            api.put(`/doacoes/senhas/iniciar-coleta/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                fetchDoacoesColeta();
                alert('Coleta iniciada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao iniciar coleta:', error);
            });
        }
    };

    return (
        <div className="coleta-container">
            <h1 className="coleta-title">Doações Aguardando Coleta</h1>
            <ul className="coleta-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="coleta-item">
                        <span className="coleta-senha">
                            {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                        </span>
                        <span className="coleta-doador">
                            Doador: {doacao.usuario.nomeUsuario || "Nome do doador não disponível"}
                        </span>
                        <div className="coleta-acoes">
                            <button className="coleta-chamar-btn" onClick={() => chamarColeta(doacao.idDoacao)}>Chamar Coleta</button>
                            <button className="coleta-iniciar-btn" onClick={() => iniciarColeta(doacao.idDoacao)}>Iniciar Coleta</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Coleta;
