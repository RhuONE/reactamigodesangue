import React from 'react';

import Sidebar from './components/sideBar/Sidebar';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Usuarios from './pages/usuarios/Usuarios';
import Hemocentros from './pages/hemocentros/Hemocentros';
import Campanhas from './pages/campanhas/Campanhas';
import Pendencias from './pages/pendencias/Pendencias';
import SidebarHemocentro from './components/SidebarHemocentro';
import SidebarFuncionario from './components/sidebarfuncionario/SidebarFuncionario';
import SidebarTriagem from './components/sidebartriagem/SidebarTriagem';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import HemocentroDashboard from './pages/HemocentroDashboard';
import HemocentroInformacoes from './pages/HemocentroInformacoes';
import Doacoes from './pages/HemocentroDoacoes';
import HemocentroFuncionarios from './pages/HemocentroFuncionario';
import HemocentroCampanhas from './pages/HemocentroCampanhas';
import CadastroHemocentro from './pages/cadastroHemocentro/CadastroHemocentro';
import LoginHemocentro from './pages/loginHemocentro/LoginHemocentro';
import Home from './pages/home/Home';
import FuncionarioDashboard from './pages/Funcionario/FuncionarioDashboard';
import PreRegistroDoador from './pages/Funcionario/PreRegistroDoador';
import InformacoesMedicasDoador from './pages/Funcionario/InformacoesMedicasDoador';
import Recepcao from './pages/telas-funcionario/Recepcao';
import TotemSenha from './pages/telas-funcionario/Totem';
import HistoricoSenhas from './pages/telas-funcionario/HistoricoSenhas';
import SidebarRecepcao from './components/sidebarrececpcao/SidebarRecepcao';
import PreCadastro from './pages/telas-funcionario/PreCadastro';
import Triagem from './pages/telas-funcionario/Triagem';
import FormularioTriagem from './pages/telas-funcionario/FormularioTriagem';
import LoginFuncionario from './pages/telas-funcionario/LoginFuncionario';
import PacientesAguardando from './pages/telas-funcionario/PacientesAguardando';

//Telas Entrevista
import Entrevista from './pages/telas-funcionario/Entrevista';

//Telas Coleta
import Coleta from './pages/telas-funcionario/Coleta';
import AtendimentosIniciados from './pages/telas-funcionario/AtendimentosIniciados';
import TriagensIniciadas from './pages/telas-funcionario/TriagensIniciadas';
import EntrevistasIniciadas from './pages/telas-funcionario/EntrevistasIniciadas';
import SidebarEntrevista from './components/sidebarentrevista/SidebarEntrevista';
import SidebarColeta from './components/sidebarcoleta/SidebarColeta';
import ColetasIniciadas from './pages/telas-funcionario/ColetasIniciadas';
import ExamesPendentes from './pages/telas-funcionario/ExamesPendentes';
import EstoqueSangue from './pages/telas-funcionario/EstoqueSangue';
import HistoricoExames from './pages/telas-funcionario/HistoricoExames';


import SidebarLaboratorio from './components/sidebarlaboratorio/SidebarLaboratorio';
import SidebarEstoquista from './components/sidebarestoquista/SidebarEstoquista';
import EstoquePendentes from './pages/telas-funcionario/EstoquePendentes';


function Layout() {
  const location = useLocation();
  const isHemocentroRoute = location.pathname.startsWith('/hemocentro');
  const isFuncionarioRoute = location.pathname.startsWith('/funcionario');
  const isAdmRoute = location.pathname.startsWith('/adm');
  const isRecepcaoRoute = location.pathname.startsWith('/recepcao');
  const isTriagemRoute = location.pathname.startsWith('/triagem');
  const isEntrevistaRoute = location.pathname.startsWith('/entrevista');
  const isColetaRoute = location.pathname.startsWith('/coleta');
  const isLaboratorioRoute = location.pathname.startsWith('/laboratorio');
  const isEstoquistaRoute = location.pathname.startsWith('/estoquista');

  return (
    <div className='App'>
      {/* Exibe a Sidebar específica para cada tipo de usuário */}
      {location.pathname !== '/login' && location.pathname !== '/cadastro/hemocentro' && location.pathname !== '/login/hemocentro' &&
        location.pathname !== '/' && (
          isHemocentroRoute ? (
            <SidebarHemocentro />
          ) : isFuncionarioRoute ? (
            <SidebarFuncionario /> // Aqui exibimos a sidebar do funcionário
          ) : isAdmRoute ?(
            <Sidebar /> // Default para Admin
          ) : isRecepcaoRoute ? (
           <SidebarRecepcao />
          ) : isTriagemRoute ? (
           <SidebarTriagem />
          ) : isEntrevistaRoute ? (
           <SidebarEntrevista />
          ) : isColetaRoute ? (
           <SidebarColeta />
          ) : isLaboratorioRoute ? (
           <SidebarLaboratorio />
          ) : isEstoquistaRoute ? (
           <SidebarEstoquista /> 
          ) : null 
        )}
      <div className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adm/dashboard" element={<Dashboard />} />
          <Route path="/adm/usuarios" element={<Usuarios />} />
          <Route path="/adm/hemocentros" element={<Hemocentros />} />
          <Route path='/adm/campanhas' element={<Campanhas />} />
          <Route path='/adm/pendencias' element={<Pendencias />} />
          {/** Rotas Hemocentro*/}
          <Route path='/login/hemocentro' element={<LoginHemocentro />} />
          <Route path='/cadastro/hemocentro' element={<CadastroHemocentro />} />
          <Route path='/hemocentro/dashboard' element={<HemocentroDashboard />} />
          <Route path='/hemocentro/informacoes' element={<HemocentroInformacoes /> } />
          <Route path='/hemocentro/doacoes' element={<Doacoes />} />
          <Route path='/hemocentro/funcionarios' element={<HemocentroFuncionarios /> } />
          <Route path='/hemocentro/campanhas' element={<HemocentroCampanhas />} />
          {/** Rotas Funcionario */}
          <Route path='/funcionario/dashboard' element={<FuncionarioDashboard />} />
          <Route path='/funcionario/preregistrodoador' element={<PreRegistroDoador />} />
          <Route path='/funcionario/infomedicas' element={<InformacoesMedicasDoador />} />

        <Route path='/pacientes-aguardando' element={<PacientesAguardando />} /> 
        <Route path='/totem' element={<TotemSenha />} />

        {/** Login funcionarios */}
        <Route path='/login/funcionario' element={<LoginFuncionario />} />

        {/** Rotas telas de funcionario recepcao */}
        <Route path='/recepcao/recepcao' element={<Recepcao />} />
        <Route path='/recepcao/atendimentos-iniciados' element={<AtendimentosIniciados />} />
        <Route path='/recepcao/historico-senhas'element={<HistoricoSenhas />} />
        <Route path='/recepcao/pre-cadastro' element={<PreCadastro />} />

        {/** Rotas telas de triagem */}
        <Route path='/triagem/chamar-senhas' element={<Triagem />} />
        <Route path='/triagem/triagens-iniciadas' element={<TriagensIniciadas />} />
        <Route path='/triagem/formulario-triagem' element={<FormularioTriagem />} />
        

        {/** Rotas telas de entrevista */}
        <Route path='entrevista/chamar-senhas' element={<Entrevista />} />
        <Route path='entrevista/entrevistas-iniciadas' element={<EntrevistasIniciadas />} />

        {/** Rotas telas para coleta */}
        <Route path='coleta/chamar-senhas' element={<Coleta />} />
        <Route path='coleta/coletas-iniciadas' element={<ColetasIniciadas />} />

        {/** Rotas telas para laboratorio */}
        <Route path='laboratorio/exames-pendentes' element={<ExamesPendentes />} />
        <Route path='laboratorio/historico-exames' element={<HistoricoExames />} />

        {/** Rotas para o estoquista */}
        <Route path='/estoquista/pendentes' element={<EstoquePendentes />} />
        <Route path='/estoquista/estoque-sangue' element={<EstoqueSangue />} />
        

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;