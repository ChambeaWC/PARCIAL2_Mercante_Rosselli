import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppUsers } from '../data/mockData';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedStr = localStorage.getItem('loggedUser');
    if (!loggedStr) return;

    try {
      const logged = JSON.parse(loggedStr);
      if (logged?.role === 'trainer') {
        navigate('/admin', { replace: true });
      } else if (logged?.role === 'member') {
        navigate('/dashboard', { replace: true });
      }
    } catch {
      localStorage.removeItem('loggedUser');
    }
  }, [navigate]);

  const authenticateUser = (userInput, passInput) => {
    setError('');
    setIsSubmitting(true);

    const currentUsers = getAppUsers();
    const cleanUser = userInput.trim();
    const userFound = currentUsers.find(
      (u) => u.username === cleanUser && u.password === passInput
    );

    if (userFound) {
      localStorage.setItem('loggedUser', JSON.stringify(userFound));
      if (userFound.role === 'trainer') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Usuario o contraseña incorrectos. Revisá los datos e intentá de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    authenticateUser(username, password);
  };

  const handleQuickFill = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
  };

  const handleQuickEnter = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    authenticateUser(demoUser, demoPass);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-badge">GESTIÓN DE RUTINAS</span>
          <h1 className="login-title">IronTrack</h1>
          <p className="login-subtitle">
            Iniciá sesión para administrar rutinas o consultar tu plan semanal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label htmlFor="login-username">Usuario</label>
            <input
              id="login-username"
              type="text"
              placeholder="Ej: admin o socio"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input password-input"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="demo-box">
          <p className="demo-title">Cuentas de prueba disponibles</p>
          <div className="demo-accounts">
            <div className="demo-account-item">
              <div>
                <strong>Entrenador / Admin</strong>
                <span>
                  Usuario: <code>admin</code> · Clave: <code>123</code>
                </span>
              </div>
              <div className="demo-actions">
                <button
                  type="button"
                  className="demo-btn-ghost"
                  onClick={() => handleQuickFill('admin', '123')}
                >
                  Cargar
                </button>
                <button
                  type="button"
                  className="demo-btn-accent"
                  onClick={() => handleQuickEnter('admin', '123')}
                >
                  Entrar
                </button>
              </div>
            </div>

            <div className="demo-account-item">
              <div>
                <strong>Socio</strong>
                <span>
                  Usuario: <code>socio</code> · Clave: <code>123</code>
                </span>
              </div>
              <div className="demo-actions">
                <button
                  type="button"
                  className="demo-btn-ghost"
                  onClick={() => handleQuickFill('socio', '123')}
                >
                  Cargar
                </button>
                <button
                  type="button"
                  className="demo-btn-accent"
                  onClick={() => handleQuickEnter('socio', '123')}
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};