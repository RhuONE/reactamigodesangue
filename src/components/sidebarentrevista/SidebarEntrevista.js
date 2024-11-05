import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaClipboardList, FaUserCheck, FaHeartbeat, FaBars } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import './SidebarEntrevista.css';
import logoExpand from '../../images/LogoAmgSangueText.png';
import logo from '../../images/LogoAmgSangue.png';

function handleLogout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/login/funcionario';
}

const SidebarEntrevista = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
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
                    <li className={location.pathname === '/entrevista/chamar-senhas' ? 'active' : ''}>
                        <Link to='/entrevista/chamar-senhas'> <FaUserCheck /> <p>Chamadas</p></Link>
                    </li>
                    <li className={location.pathname === '/entrevista/entrevistas-iniciadas' ? 'active' : ''}>
                        <Link to='/entrevista/entrevistas-iniciadas'> <FaHeartbeat /> <p>Entrevista</p></Link>
                    </li>
                   
                    <li className={`logoutBtn`} onClick={handleLogout}>
                        <Link><BiLogOut /> <p>Sair</p></Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SidebarEntrevista;
