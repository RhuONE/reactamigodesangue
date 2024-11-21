import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./HemocentroInformacoes.css";
import { FaInfoCircle, FaMapMarkerAlt, FaPhone, FaSave, FaEdit, FaUpload } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const HemocentroInformacoes = () => {
  const [hemocentro, setHemocentro] = useState({});
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState({
    basic: false,
    address: false,
    contact: false,
  });

  const [validationMessage, setValidationMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const normalizeField = (value) => (value?.trim() === "" ? null : value);

  const handleEdit = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchHemocentroInfo = async () => {
    const token = localStorage.getItem("token");
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (!token || tipoUsuario !== "hemocentro") {
      navigate("/login/hemocentro");
      return;
    }

    try {
      const response = await api.get("/hemocentro/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHemocentro(response.data);
    } catch (error) {
      console.error("Erro ao buscar informações do hemocentro:", error);
    }
  };

  useEffect(() => {
    fetchHemocentroInfo();
  }, []);

  const validateCNPJ = (cnpj) => {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
    return regex.test(cnpj);
  };

  const handleInputChange = (key, value) => {
    if (key === "cnpjHemocentro" && !validateCNPJ(value)) {
      setValidationMessage("CNPJ inválido.");
      return;
    }
    setValidationMessage("");
    setHemocentro((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (section) => {
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      const dataToUpdate = new FormData();
  
      // Adicionar todos os dados do hemocentro
      dataToUpdate.append("nomeHemocentro", hemocentro.nomeHemocentro || "");
      dataToUpdate.append("descHemocentro", hemocentro.descHemocentro || "");
      dataToUpdate.append("telHemocentro", hemocentro.telHemocentro || "");
      dataToUpdate.append("cepHemocentro", hemocentro.cepHemocentro || "");
      dataToUpdate.append("logHemocentro", hemocentro.logHemocentro || "");
      dataToUpdate.append("numLogHemocentro", hemocentro.numLogHemocentro || "");
      dataToUpdate.append("compHemocentro", hemocentro.compHemocentro || "");
      dataToUpdate.append("bairroHemocentro", hemocentro.bairroHemocentro || "");
      dataToUpdate.append("cidadeHemocentro", hemocentro.cidadeHemocentro || "");
      dataToUpdate.append("estadoHemocentro", hemocentro.estadoHemocentro || "");
      dataToUpdate.append("emailHemocentro", hemocentro.emailHemocentro || "");
      dataToUpdate.append("cnpjHemocentro", hemocentro.cnpjHemocentro || "");
      dataToUpdate.append("hospitalVinculadoHemocentro", hemocentro.hospitalVinculadoHemocentro || "");
      dataToUpdate.append("latitudeHemocentro", hemocentro.latitudeHemocentro || "");
      dataToUpdate.append("longitudeHemocentro", hemocentro.longitudeHemocentro || "");
  
      // Adicionar a imagem, se houver
      if (hemocentro.fotoHemocentro instanceof File) {
        dataToUpdate.append("fotoHemocentro", hemocentro.fotoHemocentro);
      }
  
      // Fazer a requisição POST (ou PUT)
      const response = await api.post("/hemocentro/update", dataToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      setSaveMessage("Dados salvos com sucesso!");
      setTimeout(() => setSaveMessage(""), 3000);
      handleEdit(section);
  
      // Atualizar os dados
      await refreshData();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      setSaveMessage("Erro ao salvar os dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };


    // Função para salvar a imagem imediatamente após a seleção
    const handleImageUpload = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
      
        try {
          const dataToUpdate = new FormData();
      
          // Adicionar todos os dados obrigatórios
          dataToUpdate.append("nomeHemocentro", hemocentro.nomeHemocentro || "");
          dataToUpdate.append("descHemocentro", hemocentro.descHemocentro || "");
          dataToUpdate.append("telHemocentro", hemocentro.telHemocentro || "");
          dataToUpdate.append("cepHemocentro", hemocentro.cepHemocentro || "");
          dataToUpdate.append("logHemocentro", hemocentro.logHemocentro || "");
          dataToUpdate.append("numLogHemocentro", hemocentro.numLogHemocentro || "");
          dataToUpdate.append("compHemocentro", hemocentro.compHemocentro || "");
          dataToUpdate.append("bairroHemocentro", hemocentro.bairroHemocentro || "");
          dataToUpdate.append("cidadeHemocentro", hemocentro.cidadeHemocentro || "");
          dataToUpdate.append("estadoHemocentro", hemocentro.estadoHemocentro || "");
          dataToUpdate.append("emailHemocentro", hemocentro.emailHemocentro || "");
          dataToUpdate.append("cnpjHemocentro", hemocentro.cnpjHemocentro || "");
          dataToUpdate.append("hospitalVinculadoHemocentro", hemocentro.hospitalVinculadoHemocentro || "");
          dataToUpdate.append("latitudeHemocentro", hemocentro.latitudeHemocentro || "");
          dataToUpdate.append("longitudeHemocentro", hemocentro.longitudeHemocentro || "");
      
          // Adicionar o arquivo de imagem
          if (hemocentro.fotoHemocentro instanceof File) {
            dataToUpdate.append("fotoHemocentro", hemocentro.fotoHemocentro);
          } else {
            console.error("Arquivo de imagem inválido ou não selecionado.");
          }
      
          // Verificar o conteúdo do FormData
          for (let pair of dataToUpdate.entries()) {
            console.log(pair[0] + ": ", pair[1]);
          }
      
          // Fazer a requisição para o backend
          await api.post("/hemocentro/update", dataToUpdate, {
            headers: {
              Authorization: `Bearer ${token}`,
              // NÃO defina "Content-Type", o navegador faz isso automaticamente
            },
          });
      
          setSaveMessage("Foto atualizada com sucesso!");
          setTimeout(() => setSaveMessage(""), 3000);
          await refreshData(); // Atualizar os dados
        } catch (error) {
          console.error("Erro ao atualizar a foto:", error);
          setSaveMessage("Erro ao atualizar a foto. Tente novamente.");
        } finally {
          setIsLoading(false);
        }
      };
      
      
      
        // Função para lidar com a mudança da imagem
        const handleImageChange = (e) => {
            const file = e.target.files[0]; // Obter o arquivo selecionado
            if (file) {
              // Atualizar o estado com o arquivo
              setHemocentro((prev) => ({ ...prev, fotoHemocentro: file }));
          
              // Atualizar preview da imagem
              const reader = new FileReader();
              reader.onload = () => {
                document.querySelector(".hemocentro-photo").src = reader.result;
              };
              reader.readAsDataURL(file);
          
              // Chamar a função para enviar a imagem
              handleImageUpload(file); // Passar o arquivo diretamente
            }
          };
          
          

    const refreshData = async () => {
        await fetchHemocentroInfo();
      };
      

  return (
    <div className="hemocentro-page">
      <h2>Dados do Hemocentro</h2>
      {!hemocentro.nomeHemocentro ? (
        <div className="loading-spinner">Carregando...</div>
      ) : (
        <>
        <div className="hemocentro-container">
            {/** Coluna Esquerda */}
            <div className="hemocentro-column">

                {/* Seção da Foto */}
                <div className="hemocentro-photo-section">
                    <img
                    src={
                        hemocentro.fotoHemocentro
                        ? `http://179.63.40.44:8000/storage/${hemocentro.fotoHemocentro}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="Foto do Hemocentro"
                    className="hemocentro-photo"
                    />
                    <button
                        className="edit-photo-button"
                        onClick={() => document.getElementById("photoInput").click()}
                    >
                        <FaUpload />
                    </button>
                    <input
                        type="file"
                        id="photoInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                </div>

            
                <div className="hemocentro-section" id="section-basic">
                    <h2>
                    <FaInfoCircle /> Informações Básicas
                    </h2>
                    {!editMode.basic ? (
                    <>
                        <p>Nome: {hemocentro.nomeHemocentro || "Carregando..."}</p>
                        <p>Status: {hemocentro.statusHemocentro || "Carregando..."}</p>
                        <p>
                        Hospital Vinculado: {hemocentro.hospitalVinculadoHemocentro || "Carregando..."}
                        </p>
                        <button onClick={() => handleEdit("basic")}>
                            <FaEdit /> 
                        </button>
                    </>
                    ) : (
                    <>
                        <input
                        type="text"
                        defaultValue={hemocentro.nomeHemocentro}
                        onChange={(e) => handleInputChange("nomeHemocentro", e.target.value)}
                        />
                        <input
                        type="text"
                        defaultValue={hemocentro.statusHemocentro}
                        onChange={(e) => handleInputChange("statusHemocentro", e.target.value)}
                        />
                        <input
                        type="text"
                        defaultValue={hemocentro.hospitalVinculadoHemocentro}
                        onChange={(e) =>
                            handleInputChange("hospitalVinculadoHemocentro", e.target.value)
                        }
                        />
                        <button onClick={() => handleSave("basic")} disabled={isLoading}>
                        {isLoading ? <ClipLoader size={15} color="#fff" /> : <FaSave />}
                        </button>
                        {saveMessage && <p className="save-message">{saveMessage}</p>}
                    </>
                    )}
                </div>
            </div>

            {/** Coluna Direita */}
            <div className="hemocentro-column">
            {/* Repeat similar logic for Address and Contact sections */}
            {/* Address Section */}
                <div className="hemocentro-section" id="section-address">
                    <h2>
                    <FaMapMarkerAlt /> Endereço
                    </h2>
                    {!editMode.address ? (
                    <>
                        <p>Logradouro: {hemocentro.logHemocentro || "Carregando..."}</p>
                        <p>Número: {hemocentro.numLogHemocentro || "Carregando..."}</p>
                        <p>Complemento: {hemocentro.compHemocentro || "Carregando..."}</p>
                        <p>Bairro: {hemocentro.bairroHemocentro || "Carregando..."}</p>
                        <p>Cidade: {hemocentro.cidadeHemocentro || "Carregando..."}</p>
                        <p>Estado: {hemocentro.estadoHemocentro || "Carregando..."}</p>
                        <p>CEP: {hemocentro.cepHemocentro || "Carregando..."}</p>
                        <button onClick={() => handleEdit("address")}>
                            <FaEdit /> 
                        </button>
                    </>
                    ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Logradouro"
                            defaultValue={hemocentro.logHemocentro}
                            onChange={(e) => handleInputChange("logHemocentro", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Número"
                            defaultValue={hemocentro.numLogHemocentro}
                            onChange={(e) => handleInputChange("numLogHemocentro", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Complemento"
                            defaultValue={hemocentro.compHemocentro}
                            onChange={(e) => handleInputChange("compHemocentro", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Bairro"
                            defaultValue={hemocentro.bairroHemocentro}
                            onChange={(e) => handleInputChange("bairroHemocentro", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Cidade"
                            defaultValue={hemocentro.cidadeHemocentro}
                            onChange={(e) => handleInputChange("cidadeHemocentro", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Estado"
                            defaultValue={hemocentro.estadoHemocentro}
                            onChange={(e) => handleInputChange("estadoHemocentro", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="CEP"
                            defaultValue={hemocentro.cepHemocentro}
                            onChange={(e) => handleInputChange("cepHemocentro", e.target.value)}
                        />
                        {/* Similar inputs for other fields */}
                        <button onClick={() => handleSave("address")} disabled={isLoading}>
                        {isLoading ? <ClipLoader size={15} color="#fff" /> : <FaSave />}
                        </button>
                        {saveMessage && <p className="save-message">{saveMessage}</p>}
                    </>
                    )}
                </div>

                {/* Contact Section */}
                <div className="hemocentro-section" id="section-contact">
                    <h2>
                    <FaPhone /> Contato e Credenciais
                    </h2>
                    {!editMode.contact ? (
                    <>
                        <p>Telefone: {hemocentro.telHemocentro || "Carregando..."}</p>
                        <p>Email: {hemocentro.emailHemocentro || "Carregando..."}</p>
                        <p>CNPJ: {hemocentro.cnpjHemocentro || "Carregando..."}</p>
                        <button onClick={() => handleEdit("contact")}>
                            <FaEdit /> 
                        </button>
                    </>
                    ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Telefone"
                            defaultValue={hemocentro.telHemocentro}
                            onChange={(e) => handleInputChange("telHemocentro", e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            defaultValue={hemocentro.emailHemocentro}
                            onChange={(e) => handleInputChange("emailHemocentro", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="CNPJ"
                            defaultValue={hemocentro.cnpjHemocentro}
                            onChange={(e) => {
                            const value = e.target.value;
                            if (validateCNPJ(value)) {
                                handleInputChange("cnpjHemocentro", value);
                                setValidationMessage("");
                            } else {
                                setValidationMessage("CNPJ inválido.");
                            }
                            }}
                        />
                        {validationMessage && <p className="validation-message">{validationMessage}</p>}
                        <button onClick={() => handleSave("contact")} disabled={isLoading}>
                        {isLoading ? <ClipLoader size={15} color="#fff" /> : <FaSave />}
                        </button>
                        {validationMessage && <p className="validation-message">{validationMessage}</p>}
                        {saveMessage && <p className="save-message">{saveMessage}</p>}
                    </>
                    )}
                </div>
            </div>
        </div>
        </>
      )}
    </div>
  );
};

export default HemocentroInformacoes;
