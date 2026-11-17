import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { MemberDashboard } from './pages/MemberDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas de los paneles */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<MemberDashboard />} />
        
        {/* Ruta para capturar errores 404 */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;