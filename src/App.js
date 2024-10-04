import React from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './components/Usuarios';
import Hemocentros from './components/Hemocentros';
import Campanhas from './components/Campanhas';
import Pendencias from './components/Pendencias';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

function Layout() {
  const location = useLocation();
  
  return (
    <div className='App'>
      {/* Exibe a Sidebar somente se a rota não for '/login' */}
      {location.pathname !== '/login' && <Sidebar />}
      <div className='main-content'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/hemocentros" element={<Hemocentros />} />
          <Route path='/campanhas' element={<Campanhas />} />
          <Route path='/pendencias' element={<Pendencias />} />
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