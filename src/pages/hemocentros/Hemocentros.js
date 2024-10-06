import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import api from '../../services/api'; // Certifique-se de que o arquivo da API esteja importado corretamente
import './Hemocentros.css';
import hospitalImg from '../../images/hospital.jpg';
import { AiTwotoneEye, AiOutlineClose, AiOutlineSearch, AiOutlineMinus } from "react-icons/ai";
import { BiDonateBlood } from "react-icons/bi";
import { FaClipboardList } from "react-icons/fa";

const Hemocentros = () => {
  const [hemocentros, setHemocentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirecionar

  useEffect(() => {
    const fetchHemocentros = async () => {
      const token = localStorage.getItem('token'); // Assumindo que o token é armazenado no localStorage

      if (!token) {
        // Se o token não estiver presente, redireciona para a tela de login
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/hemocentros', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Ajustando a lógica para acessar os dados corretamente
        if (Array.isArray(response.data)) {
          setHemocentros(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setHemocentros(response.data.data);
        } else {
          setHemocentros([]);
        }
        console.log(response.data);
      } catch (error) {
        setError('Erro ao carregar hemocentros. Tente novamente mais tarde.');
        console.error('Erro ao buscar hemocentros', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHemocentros();
  }, [navigate]);

  return (
    <div className="hemocentros-container">
      <h2>Hemocentros</h2>
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>

      ) : (
        <div className='cardHemo cardTabela'>
          <div className="header">
            <h3>Listagem Hemocentros</h3>
            <div className="search-container">
              <input type="text" id="pesquisaBar" className="search-box" placeholder="Digite sua pesquisa..." />
              <AiOutlineSearch className='search-icon' />

            </div>
          </div>
          <div className="items">
            {hemocentros.map((hemocentro) => (
              <div className="item" key={hemocentro.idHemocentro} data-nomehemo={hemocentro.nomeHemocentro}>
                <img src={hospitalImg} alt="" />
                <div className="info">
                  <p className="nome">{hemocentro.nomeHemocentro}</p>
                  <p className="email">{hemocentro.emailHemocentro}</p>
                  <p className="telefone">{hemocentro.telHemocentro}</p>
                  <a className="verCardBtn" href="">
                    Ver Mais
                    <AiTwotoneEye />
                  </a>
                </div>
              </div>
              // <tr key={hemocentro.idHemocentro}>
              //   <td>{hemocentro.nomeHemocentro}</td>
              //   <td>{hemocentro.emailHemocentro}</td>
              //   <td>{hemocentro.telHemocentro}</td>
              //   <td>{`${hemocentro.logHemocentro}, ${hemocentro.numLogHemocentro}, ${hemocentro.bairroHemocentro}, ${hemocentro.cidadeHemocentro}, ${hemocentro.estadoHemocentro}`}</td>
              //   <td>
              //     <button className="edit-button">Editar</button>
              //     <button className="delete-button">Excluir</button>
              //   </td>
              // </tr>
            ))}
            <div className="item" data-nomehemo="Hemocentro Genérico">
              <img src={hospitalImg} alt="" />
              <div className="info">
                <p className="nome">Hemocentro Genérico</p>
                <p className="email">hemo@gmail.com</p>
                <p className="telefone">+55 11 94401-2536</p>
                <a className="verCardBtn" href="">
                  Ver Mais
                  <AiTwotoneEye />
                </a>
              </div>
            </div>
          </div>
          <dialog id="modalHemo">
            <button id="closeModalBtn">
              <AiOutlineClose />
            </button>
            <img src={hospitalImg} alt="" />
            <div className="header">
              <div className="info">
                <div>
                  <p className="nome">Hemocentro Genérico</p>
                  <p className="email">hemo@gmail.com</p>
                  <p className="telefone">+55 11 94401-2536</p>
                  <p><strong>Hospital:</strong> Hospital Genérico</p>
                  <p><strong>CNPJ:</strong> 12.345.678/0001-00</p>
                </div>
                <div>
                  <p className="subTitulo">Localização:</p>
                  <p><strong>CEP:</strong> 08151-260</p>
                  <p><strong>Rua:</strong> Rua Almiranda, 6</p>
                  <p><strong>Complemento:</strong> Lado A</p>
                  <p><strong>Cidade/Estado:</strong> São Paulo - SP</p>
                </div>
                <button id="disableHemoBtn">
                  <AiOutlineMinus />
                  Desabilitar
                </button>
              </div>
              <div className="cards">
                <div className="cardHemo cardNumInfo doacao">
                  <div className="informacoes">
                    <h3 className="titulo">Total Doações</h3>
                    <p className="numDestaque doacao" id="numDoacao">35</p>
                  </div>
                  <BiDonateBlood className='icon doacao' />
                </div>
                <div className="cardHemo cardNumInfo campanha">
                  <div className="informacoes">
                    <h3 className="titulo">Campanhas Ativas</h3>
                    <p className="numDestaque campanha" id="numDoacao">35</p>
                  </div>
                  <FaClipboardList className='icon campanha' />
                </div>
                <div className="cardHemo cardGraph">
                  <h3>Banco de Sangue (%)</h3>
                  <canvas id="bancoSangueChart"></canvas>
                </div>
              </div>

            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default Hemocentros;
