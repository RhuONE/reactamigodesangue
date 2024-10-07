import React from 'react';

import Sidebar from './components/sideBar/Sidebar';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Usuarios from './pages/usuarios/Usuarios';
import Hemocentros from './pages/hemocentros/Hemocentros';
import Campanhas from './pages/campanhas/Campanhas';
import Pendencias from './pages/pendencias/Pendencias';
import SidebarHemocentro from './components/SidebarHemocentro';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import HemocentroDashboard from './pages/HemocentroDashboard';
import HemocentroInformacoes from './pages/HemocentroInformacoes';
import Doacoes from './pages/HemocentroDoacoes';
import HemocentroFuncionarios from './pages/HemocentroFuncionario';
import HemocentroCampanhas from './pages/HemocentroCampanhas';
import CadastroHemocentro from './pages/cadastroHemocentro/CadastroHemocentro';
import LoginHemocentro from './pages/loginHemocentro/LoginHemocentro';

function Layout() {
  const location = useLocation();
  const isHemocentroRoute = location.pathname.startsWith('/hemocentro');

  
  return (
    <div className='App'>
      {/* Exibe a Sidebar específica para cada tipo de usuário */}
      {location.pathname !== '/login' && location.pathname !== '/cadastro/hemocentro' && location.pathname !== '/login/hemocentro' && (
        isHemocentroRoute ? <SidebarHemocentro /> : <Sidebar />
      )}
      <div className='main-content'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/adm/hemocentros" element={<Hemocentros />} />
          <Route path='/campanhas' element={<Campanhas />} />
          <Route path='/pendencias' element={<Pendencias />} />
          {/** Rotas Hemocentro*/}
          <Route path='/login/hemocentro' element={<LoginHemocentro />} />
          <Route path='/cadastro/hemocentro' element={<CadastroHemocentro />} />
          <Route path='/hemocentro/dashboard' element={<HemocentroDashboard />} />
          <Route path='/hemocentro/informacoes' element={<HemocentroInformacoes /> } />
          <Route path='/hemocentro/doacoes' element={<Doacoes />} />
          <Route path='/hemocentro/funcionarios' element={<HemocentroFuncionarios /> } />
          <Route path='/hemocentro/campanhas' element={<HemocentroCampanhas />} />
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