import React from 'react';
import Sidebar from './components/Sidebar';
import SidebarHemocentro from './components/SidebarHemocentro';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './components/Usuarios';
import Hemocentros from './components/Hemocentros';
import Campanhas from './components/Campanhas';
import Pendencias from './components/Pendencias';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import HemocentroDashboard from './pages/HemocentroDashboard';
import HemocentroInformacoes from './pages/HemocentroInformacoes';
import Doacoes from './pages/HemocentroDoacoes';
import HemocentroFuncionarios from './pages/HemocentroFuncionario';
import HemocentroCampanhas from './pages/HemocentroCampanhas';

function Layout() {
  const location = useLocation();
  const isHemocentroRoute = location.pathname.startsWith('/hemocentro');

  
  return (
    <div className='App'>
      {/* Exibe a Sidebar específica para cada tipo de usuário */}
      {location.pathname !== '/login' && (
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