import React, { useState } from 'react';
import './ExameLaboratorioModal.css';

const ExameLaboratorioModal = ({ isOpen, onRequestClose, onSubmitExame }) => {
    const [tipoSanguineo, setTipoSanguineo] = useState('');
    const [hemoglobina, setHemoglobina] = useState('');
    const [hematocrito, setHematocrito] = useState('');
    const [plaquetas, setPlaquetas] = useState('');
    const [leucocitos, setLeucocitos] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [testes, setTestes] = useState({
        hiv: false,
        hepatiteB: false,
        hepatiteC: false,
        chagas: false,
        sifilis: false,
        htlv: false,
    });

    const handleSubmit = () => {
        const exameData = {
            tipoSanguineo,
            hemoglobina,
            hematocrito,
            plaquetas,
            leucocitos,
            observacoes,
            ...testes,
        };
        onSubmitExame(exameData);
    };

    return (
        isOpen && (
            <div className="exameModal-container">
                <div className="exameModal-content">
                    <h2>Registrar Exame de Laboratório</h2>
                    <label>Tipo Sanguíneo</label>
                    <input value={tipoSanguineo} onChange={(e) => setTipoSanguineo(e.target.value)} />

                    <label>Hemoglobina (g/dL)</label>
                    <input type="number" value={hemoglobina} onChange={(e) => setHemoglobina(e.target.value)} />

                    <label>Hematócrito (%)</label>
                    <input type="number" value={hematocrito} onChange={(e) => setHematocrito(e.target.value)} />

                    <label>Plaquetas (milhões/mcL)</label>
                    <input type="number" value={plaquetas} onChange={(e) => setPlaquetas(e.target.value)} />

                    <label>Leucócitos (milhões/mcL)</label>
                    <input type="number" value={leucocitos} onChange={(e) => setLeucocitos(e.target.value)} />

                    <label>Observações</label>
                    <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />

                    <h3>Resultados de Testes</h3>
                    {Object.keys(testes).map((teste) => (
                        <div key={teste}>
                            <label>{teste.toUpperCase()}</label>
                            <select value={testes[teste]} onChange={(e) => setTestes({ ...testes, [teste]: e.target.value === 'true' })}>
                                <option value="false">Negativo</option>
                                <option value="true">Positivo</option>
                            </select>
                        </div>
                    ))}

                    <button onClick={handleSubmit}>Salvar Exame</button>
                    <button onClick={onRequestClose}>Cancelar</button>
                </div>
            </div>
        )
    );
};

export default ExameLaboratorioModal;
