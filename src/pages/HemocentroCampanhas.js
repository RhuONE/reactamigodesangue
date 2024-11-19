import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './HemocentroCampanhas.css';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import CadastrarCampanhaModal from '../components/CadastrarCampanhaModal';
import { FaArchive, FaCheck } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

const HemocentroCampanhas = () => {
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para redirecionar
    const [showModal, setShowModal] = useState(false);

    const [fotoPreview, setFotoPreview] = useState(null);

    // // useEffect(() => {
    // //     if (campanha?.fotoCampanha) {
    // //         const baseUrl = 'http://localhost:8000/storage/';
    // //         setFotoPreview(`${baseUrl}${campanha.fotoCampanha}`)
    // //     } else {
    // //         setFotoPreview(null);
    // //     }
    // // })

    useEffect(() => {
        const fetchCampanhas = async () => {
            const token = localStorage.getItem('token'); // Assumindo que o token é armazenado no localStorage
            if (!token) {
                navigate('/login/hemocentro'); // Redireciona para login se não houver token
                return;
            }

            try {
                const response = await api.get('/hemocentro/campanhas', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCampanhas(response.data || []); // Certifica-se que campanhas é um array
                setError(null);
            } catch (error) {
                setError('Erro ao carregar campanhas. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchCampanhas();
    }, [navigate]);

    // Função para ativar uma campanha
    const handleAtivarCampanha = async (idCampanha) => {
        const token = localStorage.getItem('token');
        try {
            await api.put(`/campanha/ativar/${idCampanha}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCampanhas(
                campanhas.map(campanha =>
                    campanha.idCampanha === idCampanha
                        ? { ...campanha, status: 'ativo' }
                        : campanha
                )
            );
        } catch (error) {
            console.error('Erro ao ativar campanha:', error);
        }
    };

    // Função para arquivar uma campanha
    const handleArquivarCampanha = async (idCampanha) => {
        const token = localStorage.getItem('token');
        try {
            await api.put(`/campanha/arquivar/${idCampanha}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCampanhas(
                campanhas.map(campanha =>
                    campanha.idCampanha === idCampanha
                        ? { ...campanha, status: 'arquivado' }
                        : campanha
                )
            );
        } catch (error) {
            console.error('Erro ao arquivar campanha:', error);
        }
    };

    const handleAddCampanha = async (formData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.post('/campanha', formData, {
                headers: { Authorization: `Bearer ${token}` },
                //'Content-Type': 'multipart/form-data'
            });
            setCampanhas([...campanhas, response.data.data]);
        } catch (error) {
            console.error('Erro ao cadastrar campanha:', error);
        }
    };

    return (
        <div className="campanhas-content">
            <h1>Campanhas</h1>
            {loading ? (
                <div>Carregando campanhas...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="campanhas-list">
                    <div className="card cardTabela">
                        <div className="header">
                            <h3></h3>
                            <div className="search-container">
                                <input
                                    type="text"
                                    id="pesquisaBar"
                                    className="search-box"
                                    placeholder="Digite sua pesquisa..."
                                />
                                <AiOutlineSearch className="search-icon" />
                            </div>
                        </div>
                        <div className="items">
                            {campanhas.length === 0 ? (
                                <p>Não há campanhas cadastradas.</p>
                            ) : (
                                campanhas.map((campanha) => (
                                    <div className="item" key={campanha.idCampanha}>
                                        <img 
                                            src={`http://localhost:8000/storage/${campanha.fotoCampanha || 'uploads/campanhas/banner-para-campanha-de-doacao.avif'}`} 
                                            alt="banner da campanha" 
                                        />
                                        <div className="info">
                                            <p className="tituloCamp">
                                                {campanha.tituloCampanha}
                                            </p>
                                            <p className="dtInicio">
                                                <strong>Data Inicio: </strong>
                                                {campanha.dataInicioCampanha}
                                            </p>
                                            <p className="dtFim">
                                                <strong>Data Fim: </strong>
                                                {campanha.dataFimCampanha}
                                            </p>
                                            <p className="desc">
                                                <strong>Descrição: </strong>
                                                {campanha.descCampanha}
                                            </p>
                                            {/* <div className="action-buttons">
                                                {campanha.status !== 'ativo' ? (
                                                    <button
                                                        className="ativar-btn"
                                                        onClick={() => handleAtivarCampanha(campanha.idCampanha)}
                                                    >
                                                        Ativar <FaCheck />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="arquivar-btn"
                                                        onClick={() => handleArquivarCampanha(campanha.idCampanha)}
                                                    >
                                                        Arquivar <FaArchive />
                                                    </button>
                                                )}
                                            </div> */}
                                        </div>
                                    </div>
                                ))
                            )}
                            <button
                                className="add-campanha-button"
                                onClick={() => setShowModal(true)}
                            >
                                Adicionar Campanha
                            </button>

                            <CadastrarCampanhaModal
                                isOpen={showModal}
                                onClose={() => setShowModal(false)}
                                onSave={handleAddCampanha}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HemocentroCampanhas;
