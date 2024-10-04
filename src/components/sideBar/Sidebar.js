import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaHospital, FaClipboardList, FaExclamationCircle, FaBars } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import './Sidebar.css';
import logoExpand from '../../images/LogoAmgSangueText.png';
import logo from '../../images/LogoAmgSangue.png';

const Sidebar = () => {

    const location = useLocation(); //Hook para pegar a localização atual

    const [isOpen, setIsOpen] = useState(false);


    // Fecha o sidebar automaticamente ao redimensionar para telas menores
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                    <li className={location.pathname === '/dashboard' ? 'active' : ''}>
                        <Link to='/dashboard'> <FaTachometerAlt /> <p>Dashboard</p></Link>
                    </li>
                    <li className={location.pathname === '/usuarios' ? 'active' : ''}>
                        <Link to='/usuarios'> <FaUser /> <p>Usuários</p></Link>
                    </li>
                    <li className={location.pathname === '/hemocentros' ? 'active' : ''}>
                        <Link to='/hemocentros'> <FaHospital /> <p>Hemocentros</p></Link>
                    </li>
                    <li className={location.pathname === '/campanhas' ? 'active' : ''}>
                        <Link to='/campanhas'> <FaClipboardList /> <p>Campanhas</p></Link>
                    </li>
                    <li className={location.pathname === '/pendencias' ? 'active' : ''}>
                        <Link to='/pendencias'><FaExclamationCircle /> <p>Pendências</p></Link>
                    </li>
                    <li className={`logoutBtn`}>
                        <Link><BiLogOut /> <p>Sair</p></Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;