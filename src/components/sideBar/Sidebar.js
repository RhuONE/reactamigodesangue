import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaHospital, FaClipboardList, FaExclamationCircle, FaBullhorn } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import './Sidebar.css';
import logoExpand from '../../images/LogoAmgSangueText.png';
import logo from '../../images/LogoAmgSangue.png';

function handleLogout() {
    // Remove o token do localStorage ou sessionStorage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Redireciona o usuário para a página de login ou outra página
    window.location.href = '/login';
}

const Sidebar = () => {

    const location = useLocation(); //Hook para pegar a localização atual

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Sidebar */}
            <div
                className={`sidebar ${isOpen ? 'open' : 'closed'}`}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                {isOpen ? (
                    <img src={logoExpand} alt='Logo Expandido' />
                ) : (
                    <img src={logo} alt='Logo Compacto' />
                )}
                <ul>
                    <li className={location.pathname === '/adm/dashboard' ? 'active' : ''}>
                        <Link to='/adm/dashboard'> <FaTachometerAlt /> <p>Dashboard</p></Link>
                    </li>
                    <li className={location.pathname === '/adm/usuarios' ? 'active' : ''}>
                        <Link to='/adm/usuarios'> <FaUser /> <p>Usuários</p></Link>
                    </li>
                    <li className={location.pathname === '/adm/hemocentros' ? 'active' : ''}>
                        <Link to='/adm/hemocentros'> <FaHospital /> <p>Hemocentros</p></Link>
                    </li>
                    <li className={location.pathname === '/adm/campanhas' ? 'active' : ''}>
                        <Link to='/adm/campanhas'> <FaBullhorn /> <p>Campanhas</p></Link>
                    </li>
                    <li className={location.pathname === '/adm/pendencias' ? 'active' : ''}>
                        <Link to='/adm/pendencias'><FaExclamationCircle /> <p>Pendências</p></Link>
                    </li>
                    <li className={`logoutBtn`} onClick={handleLogout}>
                        <Link><BiLogOut /> <p>Sair</p></Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;