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

                    <div className="exameModal-groups">
                        <div className="exameModal-group">
                            <h3>Dados do Exame</h3>
                            
                            <div className="exameModal-input-group">
                                <label>Tipo Sanguíneo</label>
                                <select value={tipoSanguineo} onChange={(e) => setTipoSanguineo(e.target.value)}>
                                    <option value="" disabled>Selecione o tipo sanguíneo</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div className="exameModal-input-group">
                                <label>Hemoglobina (g/dL)</label>
                                <input 
                                    type="text" 
                                    value={hemoglobina} 
                                    onChange={(e) => setHemoglobina(e.target.value.replace(/[^0-9.]/g, ''))} 
                                    placeholder="Ex: 14.0"
                                />
                            </div>

                            <div className="exameModal-input-group">
                                <label>Hematócrito (%)</label>
                                <input 
                                    type="text" 
                                    value={hematocrito} 
                                    onChange={(e) => setHematocrito(e.target.value.replace(/[^0-9.]/g, ''))} 
                                    placeholder="Ex: 40.0"
                                />
                            </div>

                            <div className="exameModal-input-group">
                                <label>Plaquetas (milhões/mcL)</label>
                                <input 
                                    type="text" 
                                    value={plaquetas} 
                                    onChange={(e) => setPlaquetas(e.target.value.replace(/[^0-9.]/g, ''))} 
                                    placeholder="Ex: 250"
                                />
                            </div>

                            <div className="exameModal-input-group">
                                <label>Leucócitos (milhões/mcL)</label>
                                <input 
                                    type="text" 
                                    value={leucocitos} 
                                    onChange={(e) => setLeucocitos(e.target.value.replace(/[^0-9.]/g, ''))} 
                                    placeholder="Ex: 5.5"
                                />
                            </div>

                            <div className="exameModal-input-group">
                                <label>Observações</label>
                                <textarea 
                                    value={observacoes} 
                                    onChange={(e) => setObservacoes(e.target.value)} 
                                    placeholder="Descreva observações relevantes"
                                />
                            </div>
                        </div>

                        <div className="exameModal-group">
                            <h3>Resultados de Testes</h3>
                            {Object.keys(testes).map((teste) => (
                                <div key={teste} className="exameModal-test-group">
                                    <label>{teste.toUpperCase()}</label>
                                    <select value={testes[teste]} onChange={(e) => setTestes({ ...testes, [teste]: e.target.value === 'true' })}>
                                        <option value="false">Negativo</option>
                                        <option value="true">Positivo</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="exameModal-button-group">
                        <button className="exameModal-save-button" onClick={handleSubmit}>Salvar Exame</button>
                        <button className="exameModal-cancel-button" onClick={onRequestClose}>Cancelar</button>
                        <button className="exameModal-clear-button" onClick={() => {
                            setTipoSanguineo('');
                            setHemoglobina('');
                            setHematocrito('');
                            setPlaquetas('');
                            setLeucocitos('');
                            setObservacoes('');
                            setTestes({
                                hiv: false,
                                hepatiteB: false,
                                hepatiteC: false,
                                chagas: false,
                                sifilis: false,
                                htlv: false,
                            });
                        }}>Limpar Campos</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ExameLaboratorioModal;
