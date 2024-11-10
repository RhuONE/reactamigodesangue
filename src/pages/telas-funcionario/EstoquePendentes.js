import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ConfirmationModal from '../../components/ConfirmationModal'; // Modal de confirmação para adicionar ao estoque
import './EstoquePendentes.css';

const EstoquePendentes = () => {
    const [doacoesPendentes, setDoacoesPendentes] = useState([]);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    // Função para buscar doações pendentes de inclusão no estoque
    const fetchDoacoesPendentes = () => {
        api.get('/estoque/doacoes-pendentes', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { idHemocentro },
        })
        .then(response => {
            setDoacoesPendentes(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar doações pendentes:', error);
        });
    };

    useEffect(() => {
        fetchDoacoesPendentes();
    }, []);

    // Função para abrir o modal de confirmação e definir a doação selecionada
    const handleConfirmAddToStock = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsModalOpen(true);
    };

    // Função para adicionar a doação ao estoque
    const confirmarAdicaoAoEstoque = () => {
        if (doacaoSelecionada) {
            const payload = {
                idHemocentro,
                tipoSanguineo: doacaoSelecionada.tipoSanguineo,
                quantidadeMl: doacaoSelecionada.quantidadeDoada,
                idFuncionario: localStorage.getItem('idFuncionario'), // ID do estoquista
            };

            api.put('/estoque-sangue/adicionar', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                // Após adicionar ao estoque, atualiza a lista de doações pendentes
                fetchDoacoesPendentes();
                setIsModalOpen(false);
                setDoacaoSelecionada(null);
            })
            .catch(error => {
                console.error('Erro ao adicionar ao estoque:', error);
            });
        }
    };

    return (
        <div className="estoquePendentes-container">
            <h1>Doações Pendentes para Estoque</h1>
            <ul className="estoquePendentes-list">
                {doacoesPendentes.map(doacao => (
                    <li key={doacao.idDoacao} className="estoquePendentes-item">
                        <div>
                            <strong>Código da Doação:</strong> {doacao.idDoacao}
                        </div>
                        <div>
                            <strong>Tipo Sanguíneo:</strong> {doacao.tipoSanguineo}
                        </div>
                        <div>
                            <strong>Quantidade:</strong> {doacao.quantidadeDoada} ml
                        </div>
                        <button
                            className="estoquePendentes-btnConfirmar"
                            onClick={() => handleConfirmAddToStock(doacao)}
                        >
                            Adicionar ao Estoque
                        </button>
                    </li>
                ))}
            </ul>

            {isModalOpen && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    onConfirm={confirmarAdicaoAoEstoque}
                    message={`Você tem certeza que deseja adicionar ${doacaoSelecionada?.quantidadeDoada} ml do tipo ${doacaoSelecionada?.tipoSanguineo} ao estoque?`}
                />
            )}
        </div>
    );
};

export default EstoquePendentes;
