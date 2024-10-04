import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaHospital, FaClipboardList, FaExclamationCircle, FaBars } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {

    const location = useLocation(); //Hook para pegar a localização atual

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);

        // Adiciona ou remove a classe sidebar-open na div principal quando o menu está aberto/fechado
        const mainContent = document.querySelector('.main-content');
        if(mainContent) {
            if(!isOpen) {
                mainContent.classList.add('sidebar-open');
            } else {
                mainContent.classList.remove('sidebar-open');
            }
        }

    };

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
            {/* Botão Hambúrguer */}
            <button className='sidebar-button' onClick={toggleSidebar}>
                <FaBars />
            </button>

            {/** Overlay */}
            <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <h2>Amigo de Sangue</h2>
                <ul>
                    <li className={location.pathname === '/dashboard' ? 'active' : ''}>
                        <Link to='/dashboard'> <FaTachometerAlt /> Dashboard</Link>
                    </li>
                    <li className={location.pathname === '/usuarios' ? 'active' : ''}>
                        <Link to='/usuarios'> <FaUser /> Usuários</Link>
                    </li>
                    <li className={location.pathname === '/hemocentros' ? 'active' : ''}>
                        <Link to='/hemocentros'> <FaHospital /> Hemocentros</Link>
                    </li>
                    <li className={location.pathname === '/campanhas' ? 'active' : ''}>
                        <Link to='/campanhas'> <FaClipboardList /> Campanhas</Link>
                    </li>
                    <li className={location.pathname === '/pendencias' ? 'active' : ''}>
                        <Link to='/pendencias'><FaExclamationCircle /> Pendências</Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;