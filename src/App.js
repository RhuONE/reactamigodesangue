import React from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './components/Usuarios';
import Hemocentros from './components/Hemocentros';
import Campanhas from './components/Campanhas';
import Pendencias from './components/Pendencias';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App(){
  return (
    <Router>
      <div className='App'>
        <Sidebar />
        <div className='main-content'>
          <Routes>          
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/hemocentros" element={<Hemocentros />} />
            <Route path='/campanhas' element={<Campanhas />} />
            <Route path='/pendencias' element={<Pendencias />} />
          {/*Aqui você pode adicionar gráfico e cards do dashborad */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;