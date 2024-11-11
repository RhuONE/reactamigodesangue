import React, { useState, useEffect } from 'react';
import api from '../../services/api';

import { useNavigate } from 'react-router-dom'


import { AnimatePresence } from 'framer-motion';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';

const EstoquePendentes = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
    const navigate = useNavigate();

    const [isConfirmarRegistrarModalOpen, setIsConfirmarRegistrarModalOpen] = useState(false);
    const abrirConfirmarRegistro = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsConfirmarRegistrarModalOpen(true);
    }
    const [isConfirmarDescarteModalOpen, setIsConfirmarDescarteModalOpen] = useState(false);
    const abrirConfirmarDescarte = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setIsConfirmarDescarteModalOpen(true);
    }

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'estoque') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

    
    const fetchDoacoesPendentes = () => {
        api.get('/doacoes/estoquista-pendente', {
            headers: { Authorization: `Bearer ${token}` },
            params: { idHemocentro },
        })
        .then(response => setDoacoes(response.data))
        .catch(error => console.error('Erro ao buscar doações pendentes:', error));
    };

    useEffect(() => {
        fetchDoacoesPendentes();
    }, []);

    const registrarNoEstoque = (doacaoId) => {
        api.post(`/doacoes/${doacaoId}/adicionar-estoque`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            fetchDoacoesPendentes(); // Atualiza a lista após adicionar ao estoque
            setIsConfirmarRegistrarModalOpen(false); // Fecha o modal
        })
        .catch(error => {
            console.error('Erro ao adicionar ao estoque:', error);
        });
    };

    const descartar = (doacaoId) => {
        api.post(`/doacoes/${doacaoId}/descartar`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            fetchDoacoesPendentes(); // Atualiza a lista após descartar
            setIsConfirmarDescarteModalOpen(false); // Fecha o modal
        })
        .catch(error => {
            console.error('Erro ao descartar doação:', error);
        });
    };
    

    return (
        <div className="examesPendentes-container">
            <h1 className="examesPendentes-title">Exames Pendentes no Laboratório</h1>
            <ul className="examesPendentes-list">
                {doacoes.map(doacao => {
                    const backgroundColor =
                        doacao.statusDoacao === 'encaminhada-descarte'
                            ?  '#f7dfe1' //  Vermelhor claro para inpto
                            :  '#e6ffec' // Verde claro pra apto
                    return (
                        <li key={doacao.idDoacao} className="examesPendentes-item" style={{ backgroundColor }}>
                            <span className="examesPendentes-senha">
                                {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                            </span>
                            <span  style={{color : '#969595', fontSize : '20px'}}>
                                {doacao.statusDoacao === 'encaminhada-descarte' ? 'Descartar' :  'Registrar' }
                            </span>

                            <div className='triagensIniciadas-acoes'>
                                <>
                                    {doacao.statusDoacao === 'encaminhada-descarte' ? (

                                        <button
                                            className="triagensIniciadas-btnCancelar"
                                            onClick={() => abrirConfirmarDescarte(doacao)}
                                        >
                                            Descartar
                                        </button>
                                    ) : (
                                        <button
                                            className="triagensIniciadas-btnEntrevista"
                                            onClick={() => abrirConfirmarRegistro(doacao)}
                                        >
                                            Adicionar ao estoque
                                        </button>
                                    )}
                                </>
                            </div>

                        </li>
                    )}
                )}
            </ul>

            {/** Modais de confirmação */}
            <AnimatePresence>
                {isConfirmarRegistrarModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isConfirmarRegistrarModalOpen}
                        onRequestClose={() => setIsConfirmarRegistrarModalOpen(false)}
                        onConfirm={() => registrarNoEstoque(doacaoSelecionada.idDoacao)}
                        mensagem="Registar a doação?"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isConfirmarDescarteModalOpen && (
                    <ConfirmacaoModal
                        isOpen={isConfirmarDescarteModalOpen} 
                        onRequestClose={() => setIsConfirmarDescarteModalOpen(false)}
                        onConfirm={() => descartar(doacaoSelecionada.idDoacao)}
                        mensagem=" Descartar a coleta?"
                    />
                )}
            </AnimatePresence>


        </div>
    );
};

export default EstoquePendentes;
