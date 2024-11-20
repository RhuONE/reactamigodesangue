import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import api from '../../services/api'; // Certifique-se de que o arquivo da API esteja importado corretamente
import './Hemocentros.css';
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronDown, } from "react-icons/bi";
import hospitalIcon from '../../images/hospital.jpg'
import HemocentrosList from '../../components/listagemHemocentros';
import { toast, ToastContainer } from 'react-toastify'; // Importando Toastify
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar'; // Importando a barra de progresso

const Hemocentros = () => {
  const loadingBarRef = useRef(null); // Referência para a barra de progresso
  const [activeButton, setActiveButton] = useState('recentes'); // Estado para controlar qual botão está ativo
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleClick = (button) => {
    setActiveButton(button);
    setFiltro(button);
  };

  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value); // Atualiza o estado com o valor do input
  };

  const [hemocentros, setHemocentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirecionar

  useEffect(() => {
    const fetchHemocentros = async () => {
      const token = localStorage.getItem('token'); // Assumindo que o token é armazenado no localStorage
          console.log(token);
          const tipoUsuario = localStorage.getItem('tipoUsuario');
          console.log(tipoUsuario);
          if (!token) {
            // Se o token não estiver presente, redireciona para a tela de login
            navigate('/login');
            return;
          }
          if (tipoUsuario !== 'administrador') {
            // Se o tipo de usuário não for administrador, redireciona para o login
            navigate('/login');
            return;
          }

      try {
        loadingBarRef.current.continuousStart(); // Inicia a barra de progresso
        const toastId = "toastId";
        const response = await api.get('/hemocentros', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setError(null);
        toast.success('Dados carregados com sucesso!', {
          toastId: toastId,
          autoClose: 3000,
        }); //Notificação de sucesso
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
          toast.error('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
        loadingBarRef.current.complete(); // Conclui a barra de progresso
      }
    };

    fetchHemocentros();
  }, [navigate]);

  const [hemocentrosFiltrados, setHemocentrosFiltrados] = useState(hemocentros);
  const [pesquisa, setPesquisa] = useState(''); // Estado para armazenar o termo de pesquisa
  const [filtro, setFiltro] = useState(null); // Condição que define o filtro

  useEffect(() => {
    // Filtra hemocentros por status e pesquisa
    const hemocentrosFiltradosPorStatus = filtro === 'filter-ativo'
      ? hemocentros.filter(h => h.statusHemocentro === 'ativo')
      : filtro === 'filter-inativo'
        ? hemocentros.filter(h => h.statusHemocentro === 'arquivado')
        : filtro === 'filter-pendente'
          ? hemocentros.filter(h => h.statusHemocentro === 'pendente')
          : hemocentros; // Se não houver filtro, pega todos

    // Aplica a pesquisa por nome na lista filtrada
    const hemocentrosFiltradosPorNome = hemocentrosFiltradosPorStatus.filter(h =>
      h.nomeHemocentro.toLowerCase().includes(pesquisa.toLowerCase()) ||
      h.emailHemocentro.toLowerCase().includes(pesquisa.toLowerCase())
    );

    setHemocentrosFiltrados(hemocentrosFiltradosPorNome);
  }, [filtro, pesquisa, hemocentros]);

  return (
    <div className="hemocentros-container">
      <LoadingBar color="#f11946" ref={loadingBarRef} /> {/* Barra de progresso */}
      <ToastContainer /> {/** Container para exibir notificações */}
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className='hemocentros-content'>
          {/* <h2 className='titulo'>Hemocentros<FaHospital/></h2> */}
          <h3 className='subTitulo'>Hemocentros com Mais Doações</h3>
          <div className="hemocentros-metrics">
            <div className='hemocentroCard-tier'>
              <h3 className='posicaoRanking'>1º</h3>
              <img src={hospitalIcon} />
              <div className='info'>
                <h2>Gusmão e Zambrano</h2>
                <h3>Doações <span>28</span></h3>
              </div>
            </div>
            <div className='hemocentroCard-tier'>
              <h3 className='posicaoRanking'>2º</h3>
              <img src={hospitalIcon} />
              <div className='info'>
                <h2>Carmona e Domingues</h2>
                <h3>Doações <span>18</span></h3>
              </div>
            </div>
            <div className='hemocentroCard-tier'>
              <h3 className='posicaoRanking'>3º</h3>
              <img src={hospitalIcon} />
              <div className='info'>
                <h2>Rangel e Queirós</h2>
                <h3>Doações <span>15</span></h3>
              </div>
            </div>
            <div className='hemocentroCard-tier'>
              <h3 className='posicaoRanking'>4º</h3>
              <img src={hospitalIcon} />
              <div className='info'>
                <h2>Hemocentro Generico</h2>
                <h3>Doações <span>12</span></h3>
              </div>
            </div>
          </div>
          <div className='pesquisaFiltroHemo'>
            <button
              className={activeButton === 'recentes' ? 'active' : ''}
              onClick={() => handleClick('recentes')}
            >
              Recentes
            </button>
            <div
              className={`status ${activeButton === 'filter-ativo' ? 'active' : ''} ${activeButton === 'filter-pendente' ? 'active' : ''} ${activeButton === 'filter-inativo' ? 'active' : ''}`}
              onMouseEnter={() => setIsDropDownOpen(true)}
              onMouseLeave={() => setIsDropDownOpen(false)}
              aria-expanded={isDropDownOpen}
              aria-haspopup="true"
            >
              Por Status
              <BiChevronDown className='icon' />
              {isDropDownOpen && (
                <div className="dropDown">
                  <button className={`ativo ${activeButton === 'filter-ativo' ? 'filter-ativo' : ''} `}
                    onClick={() => handleClick('filter-ativo')}>Ativos</button>
                  <button className={`inativo ${activeButton === 'filter-inativo' ? 'filter-inativo' : ''}`}
                    onClick={() => handleClick('filter-inativo')}>Inativos</button>
                  <button className={`pendente ${activeButton === 'filter-pendente' ? 'filter-pendente' : ''}`}
                    onClick={() => handleClick('filter-pendente')}>Pendentes</button>
                </div>
              )}
            </div>
            {/* <button
              className={activeButton === 'regiao' ? 'active' : ''}
              onClick={() => handleClick('regiao')}
            >
              Por Região
            </button> */}
            <div className='pesquisaCampo'>
              <input type='text' placeholder='Pesquisar...'
                value={pesquisa}
                onChange={handlePesquisaChange} // Atualiza o estado ao digitar
              />
              <AiOutlineSearch className='lupaIcon' />
            </div>
          </div>
          <table className='tableListaHemo'>
            <thead className='headerListaHemo'>
              <tr className='headerLinhaListaHemo'>
                <th className='headerCelulaListaHemo imgCampo'></th>
                <th className='headerCelulaListaHemo nomeCampo'>Nome/Local</th>
                <th className='headerCelulaListaHemo emailCampo'>E-mail</th>
                <th className='headerCelulaListaHemo statusCampo'>Status</th>
                <th className='headerCelulaListaHemo opcaoCampo'>Funções</th>
              </tr>
            </thead>
          </table>
          <HemocentrosList hemocentros={hemocentrosFiltrados} />
        </div>
      )}
    </div>
  );
};

export default Hemocentros;
