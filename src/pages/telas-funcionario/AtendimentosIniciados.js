import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CadastroModal from '../../components/telas-funcionario/CadastroModal';
import ExibirEditarModal from '../../components/telas-funcionario/ExibirEditarModal';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import { AnimatePresence } from 'framer-motion';
import './AtendimentosIniciados.css';
import InputMask from 'react-input-mask';

const AtendimentosIniciados = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [cpfMap, setCpfMap] = useState({});
    const [isVerificandoCpfMap, setIsVerificandoCpfMap] = useState({});
    const [cpfValidandoMap, setCpfValidandoMap] = useState({});
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
    const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
    const [isExibirEditarModalOpen, setIsExibirEditarModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);
    const [usuariosMap, setUsuariosMap] = useState({});
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState(''); // Novo estado para o termo de pesquisa
    const [errorMessage, setErrorMessage] = useState('');

    const [confirmarVerificarCpf, setConfirmarVerificarCpf] = useState(false);
    const abrirConfirmarVerificarCpf = (idDoacao) => {
        setDoacaoSelecionada(idDoacao);
        setConfirmarVerificarCpf(true);
    }

    const token = localStorage.getItem('token');
    const idHemocentro = localStorage.getItem('idHemocentro');

    const fetchDoacoes = () => {
        api.get('/doacoes/atendimentos-iniciados', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { idHemocentro },
        })
        .then(response => {
            const doacoesOrdenadas = response.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            setDoacoes(doacoesOrdenadas);
            doacoesOrdenadas.forEach(doacao => {
                if (doacao.idUsuario) {
                    fetchNomeUsuario(doacao.idUsuario);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao buscar doações:', error);
        });
    };

    const fetchNomeUsuario = (idUsuario) => {
        if (idUsuario && !usuariosMap[idUsuario]) {
            api.get(`/usuario/${idUsuario}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                setUsuariosMap(prevMap => ({
                    ...prevMap,
                    [idUsuario]: response.data.nomeUsuario
                }));
            })
            .catch(error => {
                console.error('Erro ao buscar nome do usuário:', error);
            });
        }
    };

    useEffect(() => {
        fetchDoacoes();
    }, []);

    const validarCpf = (cpf) => {
        // Remove caracteres não numéricos
        const cpfNumeros = cpf.replace(/\D/g, '');
    
        // Verifica se o CPF tem 11 dígitos e não é uma sequência repetida
        if (cpfNumeros.length !== 11 || /^(\d)\1+$/.test(cpfNumeros)) {
            return false;
        }
    
        // Cálculo do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfNumeros.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfNumeros.charAt(9))) {
            return false;
        }
    
        // Cálculo do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfNumeros.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfNumeros.charAt(10))) {
            return false;
        }
    
        return true;
    };
    

    const verificarCpf = (doacaoId) => {

        const cpf = cpfMap[doacaoId];

        // Valida o CPF antes de prosseguir
        if (!validarCpf(cpf)) {

            setErrorMessage("O CPF informado é inválido. Verifique os dígitos.")
            return;
        }


        setIsVerificandoCpfMap({ ...isVerificandoCpfMap, [doacaoId]: true });
        
        api.get(`/usuarios/buscarPorCpf/${cpf}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.data.existe) {
                setUsuarioEncontrado(response.data.usuario);
                setDoacaoSelecionada(doacaoId);
                setIsExibirEditarModalOpen(true);
            }
        })
        .catch(error => {
            if (error.response && error.response.status === 404 && error.response.data.existe === false) {
                setUsuarioEncontrado(null);
                setDoacaoSelecionada(doacaoId);
                setConfirmarVerificarCpf(true);
            } else {
                console.error('Erro ao verificar o CPF:', error);
            }
        })
        .finally(() => {
            setIsVerificandoCpfMap({ ...isVerificandoCpfMap, [doacaoId]: false });
        });
    };

    const [errorMessageMap, setErrorMessageMap] = useState({});


    const handleCpfChange = (doacaoId, value) => {
        const cpfApenasNumeros = value.replace(/\D/g, '');
        setCpfMap({ ...cpfMap, [doacaoId]: cpfApenasNumeros });
    
        // Validação ao digitar
        if (cpfApenasNumeros.length < 11) {
            // CPF incompleto
            setCpfValidandoMap({ ...cpfValidandoMap, [doacaoId]: true });
            setErrorMessageMap({ ...errorMessageMap, [doacaoId]: '' });

        } else {
            // CPF completo
            const isValid = validarCpf(cpfApenasNumeros);
            setCpfValidandoMap({ ...cpfValidandoMap, [doacaoId]: !isValid });
            setErrorMessageMap({
                ...errorMessageMap,
                [doacaoId]: isValid ? '' : 'CPF inválido! Verifique os dígitos.',
            });
        }
    };

    

    const relacionarDoadorDoacao = (formData) => {
        if (doacaoSelecionada) {
            const payload = {
                idUsuario: formData.idUsuario || null,
                ...formData
            };

            api.put(`/relacionar-doacao-doador/${doacaoSelecionada}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                fetchDoacoes();
                setIsCadastroModalOpen(false);
                setIsExibirEditarModalOpen(false);
            })
            .catch(error => {
                console.error('Erro ao relacionar doador com a doação:', error);
            });
        }
    };

   
    

    const handleConfirmModal = (mensagem, acao) => {
        setConfirmMessage(mensagem);
        setConfirmAction(() => acao);
        setIsConfirmModalOpen(true);
    };

    const encaminharParaTriagem = (doacaoId) => {
        handleConfirmModal(
            "Você tem certeza que deseja encaminhar esta doação para triagem?",
            () => {
                api.put(`/encaminhar-doacao-triagem/${doacaoId}`, null, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(fetchDoacoes)
                .catch(error => console.error('Erro ao encaminhar para triagem:', error))
                .finally(() => setIsConfirmModalOpen(false));
            }
        );
    };

    const cancelarAtendimento = (doacaoId) => {
        handleConfirmModal(
            "Você tem certeza que deseja cancelar este atendimento?",
            () => {
                api.put(`/doacoes/cancelar-atendimento/${doacaoId}`, null, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(fetchDoacoes)
                .catch(error => console.error('Erro ao cancelar o atendimento:', error))
                .finally(() => setIsConfirmModalOpen(false));
            }
        );
    };
    

    const onCadastrarUsuario = (formData) => {
        // Verifique se formData é uma instância de FormData
        if (formData instanceof FormData) {
            console.log('FormData está sendo recebido com arquivos e campos:', Array.from(formData.entries()));
            

            
            api.post('/usuario', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Necessário para envio de FormData
                },
            })
            .then(response => {
                const novoUsuario = response.data.data.doador;
                if (novoUsuario && novoUsuario.idUsuario) {
                    // Adapte a lógica de relacionamento, se necessário
                    relacionarDoadorDoacao({
                        idUsuario: novoUsuario.idUsuario
                    });
                } else {
                    console.error('Erro ao obter o ID do usuário recém-criado.');
                }
            })
            .catch(error => {
                console.error('Erro ao cadastrar o usuário:', error);
            });
        } else {
            console.error('O parâmetro fornecido não é uma instância de FormData.');
        }
    }

    const onEditarUsuario = (formData) => {
        api.put(`/usuario/${usuarioEncontrado.idUsuario}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            const usuarioEditado = response.data.usuario;
    
        })
        .catch(error => {
            console.error('Erro ao editar o usuário:', error.response ? error.response.data : error);
        });
    };

    // Filtra as doações com base nos filtros de tipo, status e termo de pesquisa
    const filteredDoacoes = doacoes
        .filter(doacao => {
            if (filterType === 'all') return true;
            if (filterType === 'agendada') return doacao.senha.tipoSenha === 'Agendada';
            if (filterType === 'nao-agendada') return doacao.senha.tipoSenha === 'Nao Agendada';
            return true;
        })
        .filter(doacao => {
            if (filterStatus === 'all') return true;
            return doacao.statusDoacao === filterStatus;
        })
        .filter(doacao => {
            if (!searchTerm) return true;
            return (
                doacao.senha.descSenha.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (usuariosMap[doacao.idUsuario] &&
                 usuariosMap[doacao.idUsuario].toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });

    return (
        <div className="atendimentosIniciados-container">
            <h1 className="atendimentosIniciados-title">Atendimentos Iniciados</h1>

            <div className="atendimentosIniciados-filtros">
                <div className='atendimentosIniciados-filtro-tipo'>
                    <label>Filtrar por Tipo:</label>
                    <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                        <option value="all">Todos</option>
                        <option value="agendada">Agendadas</option>
                        <option value="nao-agendada">Não Agendadas</option>
                    </select>
                </div>
                <div className='atendimentosIniciados-filtro-status'>
                    <label>Filtrar por Status:</label>
                    <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
                        <option value="all">Todos</option>
                        <option value="atendimento-iniciado">Atendimento Iniciado</option>
                        <option value="encaminhada-triagem">Encaminhada para Triagem</option>
                        <option value="chamada-coleta">Chamada para Coleta</option>
                    </select>
                </div>
                <div className="atendimentosIniciados-pesquisa">
                    <label>Pesquisa Rápida:</label>
                    <input
                        type="text"
                        placeholder="Pesquisar por senha ou nome do doador..."
                        
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <ul className="atendimentosIniciados-list">
                {filteredDoacoes.map(doacao => (
                    <li key={doacao.idDoacao} className="atendimentosIniciados-item">
                        <div className="atendimentosIniciados-senhaInfo">
                            <span className="atendimentosIniciados-senhaNumero">{doacao.senha.descSenha} ({doacao.senha.tipoSenha})</span>
                            {doacao.idUsuario ? (
                                <span className="atendimentosIniciados-doadorNome">
                                    <strong>Nome do Doador:</strong> {usuariosMap[doacao.idUsuario] || "Carregando..."}
                                </span>
                            ) : (
                                <div className="atendimentosIniciados-verificarCpf">
                                    <InputMask
                                        mask='999.999.999-99'
                                        placeholder="Digite o CPF"
                                        className="atendimentosIniciados-inputCpf"
                                        value={cpfMap[doacao.idDoacao] || ''} 
                                        onChange={(e) => handleCpfChange(doacao.idDoacao, e.target.value)}
                                    />
                                    <button
                                        className="atendimentosIniciados-btnVerificar"
                                        onClick={() => verificarCpf(doacao.idDoacao)}
                                        disabled={
                                            isVerificandoCpfMap[doacao.idDoacao] 
                                            || !cpfMap[doacao.idDoacao] 
                                            || cpfValidandoMap[doacao.idDoacao]}
                                    >
                                        {isVerificandoCpfMap[doacao.idDoacao] ? "Carregando..." : "Verificar CPF"}
                                    </button>
                                    {errorMessageMap[doacao.idDoacao] && (
                                        <span className="error-message">{errorMessageMap[doacao.idDoacao]}</span>
                                    )}

                                </div>
                            )}
                        </div>
                        <div className="atendimentosIniciados-acoes">
                            <span className="atendimentosIniciados-statusSenha">
                                <strong>Localização:</strong> {doacao.statusDoacao}
                            </span>
                            {doacao.idUsuario && doacao.statusDoacao === "atendimento-iniciado" && (
                                <button
                                    className="atendimentosIniciados-btnTriagem"
                                    onClick={() => encaminharParaTriagem(doacao.idDoacao)}
                                >
                                    Encaminhar para Triagem
                                </button>
                            )}
                            {doacao.statusDoacao === "atendimento-iniciado" && (
                                <button
                                    className="atendimentosIniciados-btnCancelar"
                                    onClick={() => cancelarAtendimento(doacao.idDoacao)}
                                >
                                    Cancelar Atendimento
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal de Confirmação */}
            <AnimatePresence>
                {confirmarVerificarCpf && (
                    <ConfirmacaoModal
                        isOpen={confirmarVerificarCpf}
                        onRequestClose={() => setConfirmarVerificarCpf(false)}
                        onConfirm={() => {
                            setConfirmarVerificarCpf(false);
                            setIsCadastroModalOpen(true); // Abre o modal de cadastro
                        }}
                        mensagem="CPF não encontrado, deseja cadastrar o doador?"
                    />
                )}
            </AnimatePresence>

            <CadastroModal
                isOpen={isCadastroModalOpen}
                onRequestClose={() => setIsCadastroModalOpen(false)}
                onCadastrarUsuario={onCadastrarUsuario}
            />

            <ExibirEditarModal
                isOpen={isExibirEditarModalOpen}
                onRequestClose={() => setIsExibirEditarModalOpen(false)}
                usuarioEncontrado={usuarioEncontrado}
                onEditarUsuario={onEditarUsuario}
                onConfirmarRelacionamento={relacionarDoadorDoacao}
            />  
            <AnimatePresence>
                {isConfirmModalOpen && (
                <ConfirmacaoModal
                        isOpen={isConfirmModalOpen}
                        onRequestClose={() => setIsConfirmModalOpen(false)}
                        onConfirm={confirmAction}
                        mensagem={confirmMessage}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AtendimentosIniciados;
