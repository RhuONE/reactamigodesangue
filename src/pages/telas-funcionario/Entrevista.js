import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DoadorDetalhesModal from '../../components/telas-funcionario/DoadorDetalhesModal';
import './Entrevista.css';

const Entrevista = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isDoadorDetalhesModalOpen, setIsDoadorDetalhesModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    // Função para buscar as doações para entrevista no backend
    const fetchDoacoes = () => {
        api.get('/doacoes/senhas/entrevista', {
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
            console.error('Erro ao buscar doações:', error);
        });
    };

    useEffect(() => {
        fetchDoacoes();
        const interval = setInterval(() => {
            fetchDoacoes();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const chamarEntrevista = (idDoacao) => {
        api.put(`/doacoes/senhas/chamar-entrevista/${idDoacao}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            fetchDoacoes();
        })
        .catch(error => {
            console.error('Erro ao chamar entrevista:', error);
        });
    };

    const iniciarEntrevista = (idDoacao) => {
        const confirmacao = window.confirm("Você deseja iniciar a entrevista?");
        if (confirmacao) {
            api.put(`/doacoes/senhas/iniciar-entevista/${idDoacao}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                fetchDoacoes();
            })
            .catch(error => {
                console.error('Erro ao iniciar entrevista:', error);
            });
        }
    };

    const openDoadorDetalhesModal = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsDoadorDetalhesModalOpen(true);
    };

    const closeDoadorDetalhesModal = () => {
        setIsDoadorDetalhesModalOpen(false);
        setDoacaoSelecionada(null);
    };

    return (
        <div className="entrevista-container">
            <h1 className="entrevista-title">Entrevista - Doações para Entrevista</h1>
            <ul className="entrevista-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="entrevista-item">
                        <span className="entrevista-numero">
                            {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                        </span>
                        <span className="entrevista-doador-nome">
                            {doacao.usuario ? `Doador: ${doacao.usuario.nomeUsuario}` : "Nome do doador não disponível"}
                        </span>
                        <button onClick={() => openDoadorDetalhesModal(doacao)}>Ver Dados</button>
                        <div>
                            <button onClick={() => chamarEntrevista(doacao.idDoacao)}>Chamar</button>
                            <button onClick={() => iniciarEntrevista(doacao.idDoacao)}>Iniciar Entrevista</button>
                        </div>
                    </li>
                ))}
            </ul>

            <DoadorDetalhesModal
                isOpen={isDoadorDetalhesModalOpen}
                onRequestClose={closeDoadorDetalhesModal}
                doador={doacaoSelecionada ? doacaoSelecionada.usuario : null}
            />
        </div>
    );
};

export default Entrevista;
