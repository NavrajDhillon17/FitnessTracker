import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar-custom">
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
        <Link to="/" className="navbar-brand-custom">
          IRON<span>TRACK</span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link-custom ${isActive('/dashboard')}`}>Dashboard</Link>
              <Link to="/workouts" className={`nav-link-custom ${isActive('/workouts')}`}>Workouts</Link>
              <Link to="/goals" className={`nav-link-custom ${isActive('/goals')}`}>Goals</Link>
              <Link to="/profile" className={`nav-link-custom ${isActive('/profile')}`}>Profile</Link>
              <div className="divider-v" style={{ width: 1, height: 20, background: '#1E1E2E', margin: '0 0.5rem' }}></div>
              <button onClick={handleLogout} className="btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-custom">Login</Link>
              <Link to="/register" className="btn-fire" style={{ textDecoration: 'none' }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}