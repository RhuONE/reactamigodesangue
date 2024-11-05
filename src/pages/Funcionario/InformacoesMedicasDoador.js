import React, { useState } from 'react';

const InformacoesMedicasDoador = () => {
  const [medicalData, setMedicalData] = useState({
    historicoDoencas: '',
    usoMedicamentos: '',
    // Adicione mais campos aqui
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicalData({ ...medicalData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia os dados da avaliação de aptidão para o backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Histórico de Doenças</label>
      <input
        type="text"
        name="historicoDoencas"
        value={medicalData.historicoDoencas}
        onChange={handleChange}
      />
      <label>Uso de Medicamentos</label>
      <input
        type="text"
        name="usoMedicamentos"
        value={medicalData.usoMedicamentos}
        onChange={handleChange}
      />
      {/* Adicione mais campos conforme necessário */}
      <button type="submit">Finalizar Avaliação</button>
    </form>
  );
};

export default InformacoesMedicasDoador;
