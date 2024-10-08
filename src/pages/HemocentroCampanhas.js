import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './HemocentroCampanhas.css';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import { FaEye, FaSearch } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';


const HemocentroCampanhas = () => {
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para redirecionar

    useEffect(() => {
        const fetchCampanhas = async () => {
        const token = localStorage.getItem('token'); // Assumindo que o token é armazenado no localStorage
          console.log(token);
          const tipoUsuario = localStorage.getItem('tipoUsuario');
          console.log(tipoUsuario);
          if (!token) {
            // Se o token não estiver presente, redireciona para a tela de login
            navigate('/login/hemocentro');
            return;
          }
          if (tipoUsuario !== 'hemocentro') {
            // Se o tipo de usuário não for hemocentro, redireciona para o login
            navigate('/login/hemocentro');
            return;
          }
            try {
                
                const response = await api.get('/hemocentro/campanhas', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCampanhas(response.data || []); // Certifique-se de que `campanhas` seja um array
                setError(null);
            } catch (error) {
                setError('Erro ao carregar campanhas. Tente novamente mais tarde.');
                console.error('Erro ao buscar campanhas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampanhas();
    }, []);

    return (
        <div className="campanhas-content">
            <h1>Campanhas</h1>
            {loading ? (
                <div>Carregando campanhas...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="campanhas-list">
                    <div class="card cardTabela">
                <div class="header">
                    <h3></h3>
                    <div class="search-container">
                        <input type="text" id="pesquisaBar" class="search-box" placeholder="Digite sua pesquisa..."/>
                        <AiOutlineSearch className='search-icon'/>
                    </div>
                </div>
                <div class="items">
                    {campanhas.length === 0 ? (
                        <p>Não há campanhas cadastradas.</p>
                    ) : (
                        campanhas.map((campanha) => (
                            <div class="item" key={campanha.idCampanha}>
                        <img src="img/hospital.jpg" alt=""/>
                        <div class="info">
                            <p class="tituloCamp">{campanha.tituloCampanha}</p>
                            <p class="dtInicio"><strong>Data Inicio: </strong>{campanha.dataInicioCampanha}</p>
                            <p class="dtFim"><strong>Data Fim: </strong>{campanha.dataFimCampanha}</p>
                            <p class="desc"><strong>Descrição: </strong>{campanha.descCampanha}</p>
                            <a class="verCardBtn" href="">
                                Ver Mais
                                <FaEye/>
                            </a>
                        </div>
                    </div>
                        ))
                    )}
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HemocentroCampanhas;
