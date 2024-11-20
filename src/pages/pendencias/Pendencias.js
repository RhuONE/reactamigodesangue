import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { BiCurrentLocation, BiChevronDown } from "react-icons/bi";
import './Pendencias.css';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from '../../components/modalConfirm';

const Pendencias = () => {

  const [modalConfirm, setModalConfirm] = useState(false);
  const [mensagemModal, setMensagemModal] = useState('');
  const [actionToConfirm, setActionToConfirm] = useState('');
  const [idToConfirm, setIdToConfirm] = useState(null);

  const handleOpenModal = (action, id, nome) => {
    if(action === 'aprovar'){
      setMensagemModal(`Você realmente deseja Aprovar, ${nome}?`);
    }
    if(action === 'negar'){
      setMensagemModal(`Você realmente deseja Negar, ${nome}?`);
    }

    setActionToConfirm(action);
    setIdToConfirm(id);
    setModalConfirm(true);
  };

  const handleConfirm = async () => {
    const toastId = "approval-toast";
  
    if (actionToConfirm === 'aprovar') {
      if (!toast.isActive(toastId)) {
        toast.success('Hemocentro aprovado com sucesso!', {
          toastId: toastId,
          autoClose: 3000,
        });
      }
  
      await handleApprove(idToConfirm);
    } else if (actionToConfirm === 'negar') {
      const errorToastId = "deny-toast";
      if (!toast.isActive(errorToastId)) {
        toast.error('Hemocentro negado com sucesso!', {
          toastId: errorToastId,
          autoClose: 3000,
        });
      }
  
      await handleDeny(idToConfirm);
    }
  
    setModalConfirm(false);
  };
  
  const handleCancel = () => {
    setModalConfirm(false);
    toast.info('Operação Cancelada.');
  };


  const [pendencias, setPendencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendencias = async () => {
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
        const response = await api.get('/hemocentros/pendentes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPendencias(Array.isArray(response.data.data) ? response.data.data : []);
        setError(null);
        console.log(response.data.data)
      } catch (error) {
        setError('Erro ao carregar pendências. Tente novamente mais tarde.');
        console.error('Erro ao buscar pendências', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendencias();
  }, [navigate]);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/hemocentros/aceitar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Hemocentro aprovado com sucesso!');
      setPendencias(pendencias.filter((pendencia) => pendencia.idHemocentro !== id));
    } catch (error) {
      console.error('Erro ao aprovar hemocentro', error);
      setError('Erro ao aprovar o hemocentro. Tente novamente.');
    }
  };

  const handleDeny = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/hemocentros/arquivar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendencias(pendencias.filter((pendencia) => pendencia.idHemocentro !== id));
    } catch (error) {
      console.error('Erro ao negar hemocentro', error);
      setError('Erro ao negar o hemocentro. Tente novamente.');
    }
  };
  

  return (
    <div className="pendencias-container">
      <ToastContainer/>
      <ConfirmationModal
        isOpen={modalConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={mensagemModal}
      />
      <div className='pendencias-header'>
        <h1>Pendências</h1> 
        <p>{pendencias.length}</p>
      </div>
      {loading ? (
        <div className="loader">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : ( 
          <div className='cards'>
            {/* <div className='card'>
                <div className="baseInfo">
                  <img id="hemoIcon" src={imgBase} />
                  <div id="info">
                    <h2>pendencia.nomeHemocentro</h2>
                    <p>
                      <BiCurrentLocation/>
                      pendencia.cidadeHemocentro, pendencia.estadoHemocentro
                    </p>
                  </div>

                  <div className='btns'>
                    <button id="aceitarHemo">Aceitar</button>
                    <button id="negarHemo">Negar</button>
                  </div>
                  <BiChevronDown/>
                </div>
                <div className='cardInfo'>

                </div>
              </div> */}
            {pendencias && pendencias.length > 0 ? pendencias.map((pendencia) => (
              <div className='card' key={pendencia.idHemocentro}>
                <div className="baseInfo">
                  <img id="hemoIcon" src={`http://179.63.40.44:8000/storage/${pendencia.fotoHemocentro || 'uploads/hemocentros/foto-generica-hemocentro.webp'}`} />
                  <div id="info">
                    <h2>{pendencia.nomeHemocentro}</h2>
                    <p>
                      <BiCurrentLocation/>
                      {pendencia.cidadeHemocentro}, {pendencia.estadoHemocentro}
                    </p>
                  </div>

                  <div className='btns'>
                    <button id="aceitarHemo" onClick={() => handleOpenModal('aprovar', pendencia.idHemocentro, pendencia.nomeHemocentro)}>Aceitar</button>
                    <button id="negarHemo" onClick={() => handleOpenModal('negar', pendencia.idHemocentro, pendencia.nomeHemocentro)}>Negar</button>
                  </div>
                  <BiChevronDown/>
                </div>
                <div className='cardInfo'>

                </div>
              </div>
            )) : (
              <p>Nenhum hemocentro Pendente</p>
            )}
        </div>
      )} 
    </div>
  );
};

export default Pendencias;
