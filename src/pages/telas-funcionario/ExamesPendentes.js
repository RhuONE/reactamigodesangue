import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ExameLaboratorioModal from '../../components/telas-funcionario/ExameLaboratorioModal';
import './ExamesPendentes.css';
import { useNavigate } from 'react-router-dom'

const ExamesPendentes = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    useEffect(() => {
        const funcao = localStorage.getItem('funcao');
        if (!token || funcao !== 'laboratorio') {
            navigate('/login/funcionario');
        }
    }, [navigate]);

    
    const fetchDoacoesPendentes = () => {
        api.get('/doacoes/laboratorio-pendente', {
            headers: { Authorization: `Bearer ${token}` },
            params: { idHemocentro },
        })
        .then(response => setDoacoes(response.data))
        .catch(error => console.error('Erro ao buscar doações pendentes:', error));
    };

    useEffect(() => {
        fetchDoacoesPendentes();
    }, []);

    const abrirModalExame = (doacao) => {
        setDoacaoSelecionada(doacao);
        setIsModalOpen(true);
    };

    const fecharModalExame = () => {
        setIsModalOpen(false);
        setDoacaoSelecionada(null);
    };

    const handleSubmitExame = (exameData) => {
        const payload = { ...exameData, idDoacao: doacaoSelecionada.idDoacao };
        
        api.post('/laboratorio/exame', payload, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            fetchDoacoesPendentes();
            fecharModalExame();
            alert('Exame registrado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao registrar exame:', error);
            alert('Erro ao registrar o exame');
        });
    };

    return (
        <div className="examesPendentes-container">
            <h1 className="examesPendentes-title">Exames Pendentes no Laboratório</h1>
            <ul className="examesPendentes-list">
                {doacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="examesPendentes-item">
                        <span className="examesPendentes-senha">
                            {doacao.senha ? `${doacao.senha.descSenha} (${doacao.senha.tipoSenha})` : "Sem informação de senha"}
                        </span>
                        <span className="examesPendentes-doador">
                            Doador: {doacao.usuario ? doacao.usuario.nomeUsuario : "Nome do doador não disponível"}
                        </span>
                        <button
                            className="examesPendentes-btnIniciar"
                            onClick={() => abrirModalExame(doacao)}
                        >
                            Iniciar Exame
                        </button>
                    </li>
                ))}
            </ul>

            {/* Modal para Registrar Exame */}
            <ExameLaboratorioModal
                isOpen={isModalOpen}
                onRequestClose={fecharModalExame}
                onSubmitExame={handleSubmitExame}
            />
        </div>
    );
};

export default ExamesPendentes;
