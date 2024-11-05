import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CadastroModal from '../../components/telas-funcionario/CadastroModal';
import ExibirEditarModal from '../../components/telas-funcionario/ExibirEditarModal';
import ConfirmacaoModal from '../../components/telas-funcionario/ConfirmacaoModal';
import './AtendimentosIniciados.css';

const AtendimentosIniciados = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [cpfMap, setCpfMap] = useState({});
    const [isVerificandoCpfMap, setIsVerificandoCpfMap] = useState({});
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

    const verificarCpf = (doacaoId) => {
        setIsVerificandoCpfMap({ ...isVerificandoCpfMap, [doacaoId]: true });
        const cpf = cpfMap[doacaoId];
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
                setIsCadastroModalOpen(true);
            } else {
                console.error('Erro ao verificar o CPF:', error);
            }
        })
        .finally(() => {
            setIsVerificandoCpfMap({ ...isVerificandoCpfMap, [doacaoId]: false });
        });
    };

    const handleCpfChange = (doacaoId, value) => {
        setCpfMap({ ...cpfMap, [doacaoId]: value });
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
        const payload = {
            nomeUsuario: formData.nome,
            dataNascUsuario: formData.dataNasc,
            generoUsuario: formData.genero,
            emailUsuario: formData.email,
            senhaUsuario: formData.senha,
            cpfUsuario: formData.cpf,
            logUsuario: formData.logradouro,
            numLogUsuario: formData.numero,
            compUsuario: formData.complemento || '', 
            bairroUsuario: formData.bairro,
            cidadeUsuario: formData.cidade,
            estadoUsuario: formData.estado,
            cepUsuario: formData.cep,
            rgUsuario: formData.rg, 
            numTelefone: formData.telefone
        };

        api.post('/usuario', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            const novoUsuario = response.data.data.doador;
            if (novoUsuario && novoUsuario.idUsuario) {
                relacionarDoadorDoacao({
                    ...formData,
                    idUsuario: novoUsuario.idUsuario 
                });
            } else {
                console.error('Erro ao obter o ID do usuário recém-criado.');
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar o usuário:', error);
        });
    };

    const onEditarUsuario = (formData) => {
        api.put(`/usuario/${usuarioEncontrado.idUsuario}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            const usuarioEditado = response.data.usuario;
            relacionarDoadorDoacao(usuarioEditado);
        })
        .catch(error => {
            console.error('Erro ao editar o usuário:', error.response ? error.response.data : error);
        });
    };

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
        });

    return (
        <div className="atendimentosIniciados-container">
            <h1 className="atendimentosIniciados-title">Atendimentos Iniciados</h1>

            <div className="filtros">
                <label>Filtrar por Tipo:</label>
                <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                    <option value="all">Todos</option>
                    <option value="agendada">Agendadas</option>
                    <option value="nao-agendada">Não Agendadas</option>
                </select>

                <label>Filtrar por Status:</label>
                <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
                    <option value="all">Todos</option>
                    <option value="atendimento-iniciado">Atendimento Iniciado</option>
                    <option value="encaminhada-triagem">Encaminhada para Triagem</option>
                    <option value="chamada-coleta">Chamada para Coleta</option>
                </select>
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
                                    <input
                                        type="text"
                                        placeholder="Digite o CPF"
                                        className="atendimentosIniciados-inputCpf"
                                        value={cpfMap[doacao.idDoacao] || ''} 
                                        onChange={(e) => handleCpfChange(doacao.idDoacao, e.target.value)}
                                    />
                                    <button
                                        className="atendimentosIniciados-btnVerificar"
                                        onClick={() => verificarCpf(doacao.idDoacao)}
                                        disabled={isVerificandoCpfMap[doacao.idDoacao] || !cpfMap[doacao.idDoacao]}
                                    >
                                        Verificar CPF
                                    </button>
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

            <ConfirmacaoModal
                isOpen={isConfirmModalOpen}
                onRequestClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmAction}
                mensagem={confirmMessage}
            />
        </div>
    );
};

export default AtendimentosIniciados;
