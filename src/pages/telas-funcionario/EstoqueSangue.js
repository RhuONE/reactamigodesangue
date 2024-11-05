import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './EstoqueSangue.css';

const EstoqueSangue = () => {
    const [estoques, setEstoques] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [tipoSanguineoSelecionado, setTipoSanguineoSelecionado] = useState(null);
    const [quantidadeMovimentacao, setQuantidadeMovimentacao] = useState('');
    const [tipoMovimentacao, setTipoMovimentacao] = useState('entrada'); // 'entrada' ou 'saída'
    const idHemocentro = localStorage.getItem('idHemocentro');
    
    const token = localStorage.getItem('token');

    // Função para buscar o estoque de sangue do hemocentro
    const fetchEstoqueSangue = () => {
        api.get(`/estoque-sangue/${idHemocentro}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setEstoques(response.data))
        .catch(error => console.error('Erro ao buscar estoque de sangue:', error));
    };

    // Função para buscar movimentações para o tipo sanguíneo selecionado
    const fetchMovimentacoes = (idEstoqueSangue) => {
        api.get(`/estoque-sangue/movimentacoes/${idEstoqueSangue}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setMovimentacoes(response.data))
        .catch(error => console.error('Erro ao buscar movimentações:', error));
    };

    useEffect(() => {
        fetchEstoqueSangue();
    }, []);

    // Função para registrar movimentação
    const registrarMovimentacao = () => {
        const payload = {
            idEstoqueSangue: tipoSanguineoSelecionado,
            quantidadeMl: quantidadeMovimentacao,
        };

        const endpoint = tipoMovimentacao === 'entrada' ? '/estoque-sangue/abastecer' : '/estoque-sangue/retirar';

        api.post(endpoint, payload, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            alert(`Movimentação de ${tipoMovimentacao} registrada com sucesso.`);
            setQuantidadeMovimentacao('');
            fetchEstoqueSangue();
            fetchMovimentacoes(tipoSanguineoSelecionado);
        })
        .catch(error => {
            console.error(`Erro ao registrar ${tipoMovimentacao}:`, error);
            alert(`Erro ao registrar ${tipoMovimentacao}`);
        });
    };

    return (
        <div className="estoqueSangue-container">
            <h1 className="estoqueSangue-title">Estoque de Sangue</h1>
            
            <div className="estoqueSangue-list">
                {estoques.map(estoque => (
                    <div key={estoque.idEstoqueSangue} className="estoqueSangue-item">
                        <span>Tipo: {estoque.tipoSanguineo}</span>
                        <span>Quantidade: {estoque.quantidadeMlTotal} mL</span>
                        <button
                            onClick={() => {
                                setTipoSanguineoSelecionado(estoque.idEstoqueSangue);
                                fetchMovimentacoes(estoque.idEstoqueSangue);
                            }}
                        >
                            Ver Movimentações
                        </button>
                    </div>
                ))}
            </div>

            {tipoSanguineoSelecionado && (
                <div className="estoqueSangue-movimentacao">
                    <h2>Registrar Movimentação</h2>
                    <select onChange={(e) => setTipoMovimentacao(e.target.value)} value={tipoMovimentacao}>
                        <option value="entrada">Entrada</option>
                        <option value="saída">Saída</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Quantidade em mL"
                        value={quantidadeMovimentacao}
                        onChange={(e) => setQuantidadeMovimentacao(e.target.value)}
                    />
                    <button onClick={registrarMovimentacao}>Registrar {tipoMovimentacao}</button>
                </div>
            )}

            {movimentacoes.length > 0 && (
                <div className="estoqueSangue-historico">
                    <h2>Histórico de Movimentações</h2>
                    <ul>
                        {movimentacoes.map(movimentacao => (
                            <li key={movimentacao.idMovimentacaoEstoqueSangue}>
                                <span>{movimentacao.tipoMovimentacao} de {movimentacao.quantidadeMovimentadaMl} mL em {new Date(movimentacao.dataMovimentacao).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EstoqueSangue;
