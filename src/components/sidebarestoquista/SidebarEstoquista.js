import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaClipboardList, FaUserCheck, FaHeartbeat, FaBars } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import '../sidebartriagem/SidebarTriagem.css';
import logoExpand from '../../images/LogoAmgSangueText.png';
import logo from '../../images/LogoAmgSangue.png';

function handleLogout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/login/funcionario';
}

const SidebarEstoquista = () => {
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
                    <li className={location.pathname === '/estoque/pendentes' ? 'active' : ''}>
                        <Link to='/estoquista/pendentes'> <FaUserCheck /> <p>Pendentes</p></Link>
                    </li>
                    {/* <li className={location.pathname === '/triagem/formulario-triagem' ? 'active' : ''}>
                        <Link to='/triagem/formulario-triagem'> <FaHeartbeat /> <p>Triagem</p></Link>
                    </li>
                    <li className={location.pathname === '/triagem/historico-triagem' ? 'active' : ''}>
                        <Link to='/triagem/historico-triagem'> <FaClipboardList /> <p>Histórico</p></Link>
                    </li> */}
                    <li className={location.pathname === '/estoque/estoque-sangue' ? 'active' : ''}>
                        <Link to='/estoquista/estoque-sangue'> <FaClipboardList /> <p>Histórico</p></Link>
                    </li>
                    <li className={`logoutBtn`} onClick={handleLogout}>
                        <Link><BiLogOut /> <p>Sair</p></Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SidebarEstoquista;
