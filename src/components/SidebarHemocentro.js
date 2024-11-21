import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaHospital, FaClipboardList, FaUserCog, FaHeart, FaBullhorn } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import './SidebarHemocentro.css';
import logoExpand from '../images/LogoAmgSangueText.png';
import logo from '../images/LogoAmgSangue.png';

const SidebarHemocentro = () => {

    const location = useLocation(); //Hook para pegar a localização atual
    const navigate = useNavigate();  // Hook para navegar para outra página


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


    // Função de logout
    const handleLogout = () => {
        localStorage.removeItem('token');  // Remove o token
        localStorage.removeItem('tipoUsuario');  // Remove outros itens se necessário
        navigate('/login/hemocentro');  // Redireciona para a página de login
    };

    return (
        <>
            {/* SidebarHemocentro */}
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
                    <li className={location.pathname === '/hemocentro/dashboard' ? 'active' : ''}>
                        <Link to='/hemocentro/dashboard'> <FaTachometerAlt /> <p>Dashboard</p></Link>
                    </li>
                    <li className={location.pathname === '/hemocentro/informacoes' ? 'active' : ''}>
                        <Link to='/hemocentro/informacoes'> <FaHospital /> <p>Informações</p></Link>
                    </li>
                    <li className={location.pathname === '/hemocentro/doadores' ? 'active' : ''}>
                        <Link to='/hemocentro/doadores'> <FaUser /> <p>Doadores</p></Link>
                    </li>
                    <li className={location.pathname === '/hemocentro/doacoes' ? 'active' : ''}>
                        <Link to='/hemocentro/doacoes'> <FaHeart /> <p>Doações</p></Link>
                    </li>
                    <li className={location.pathname === '/hemocentro/funcionarios' ? 'active' : ''}>
                        <Link to='/hemocentro/funcionarios'> <FaUserCog /> <p>Funcionários</p></Link>
                    </li>
                    <li className={location.pathname === '/hemocentro/campanhas' ? 'active' : ''}>
                        <Link to='/hemocentro/campanhas'><FaBullhorn /> <p>Campanhas</p></Link>
                    </li>
                    <li className={`logoutBtn`} onClick={handleLogout}>
                        <Link><BiLogOut /> <p>Sair</p></Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SidebarHemocentro;


