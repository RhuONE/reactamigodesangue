import React from 'react';
import { Link } from 'react-router-dom';
import './SidebarFuncionario.css'; // Arquivo CSS para estilização

const SidebarFuncionario = () => {
  return (
    <div className="sidebar-funcionario">
      <ul>
        <li><Link to="/funcionario/recepcao">Dashboard</Link></li>
        <li><Link to="/funcionario/preregistrodoador">Doador</Link> </li>
        <li><Link to="/funcionario/infomedicas">Informações Medicas</Link> </li>
        {/* Outras opções da sidebar para funcionários */}
      </ul>
    </div>
  );
};

export default SidebarFuncionario;
