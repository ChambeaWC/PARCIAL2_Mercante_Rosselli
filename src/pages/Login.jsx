import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppUsers } from '../data/mockData';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const currentUsers = getAppUsers();
    const userFound = currentUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (userFound) {
      localStorage.setItem('loggedUser', JSON.stringify(userFound));
      if (userFound.role === 'trainer') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">IronTrack - Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label>Usuario:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-btn">Entrar</button>
      </form>
    </div>
  );
};