import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCheck, FaHistory, FaBars, FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import '../sideBar/Sidebar.css';
import logoExpand from '../../images/LogoAmgSangueText.png'; // Atualize com a logo do hemocentro
import logo from '../../images/LogoAmgSangue.png'; // Atualize com a logo do hemocentro

function handleLogout() {
    // Remove o token do localStorage ou sessionStorage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Redireciona o usuário para a página de login ou outra página
    window.location.href = '/login/funcionario';
}

const SidebarRecepcao = () => {

    const location = useLocation(); // Hook para pegar a localização atual

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
                    <li className={location.pathname === '/recepcao/recepcao' ? 'active' : ''}>
                        <Link to='/recepcao/recepcao'> <FaUserCheck /> <p>Senhas Geradas</p></Link>
                    </li>
                    <li className={location.pathname === '/recepcao/atendimentos-iniciados' ? 'active' : ''}>
                        <Link to='/recepcao/atendimentos-iniciados'> <FaHistory /> <p>Atendimentos Iniciados</p></Link>
                    </li>
                    {/** Telas obsoletas 
                    <li className={location.pathname === '/recepcao/historico-senhas' ? 'active' : ''}>
                        <Link to='/recepcao/historico-senhas'> <FaHistory /> <p>Histórico de Senhas</p></Link>
                    </li>
                    <li className={location.pathname === '/recepcao/pre-cadastro' ? 'active' : ''}>
                        <Link to='/recepcao/pre-cadastro'> <FaUserPlus /> <p>Pré-Cadastro Doador</p></Link>
                    </li>
                    */}   
                    <li className={`logoutBtn`} onClick={handleLogout}>
                        <Link><BiLogOut /> <p>Sair</p></Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SidebarRecepcao;
