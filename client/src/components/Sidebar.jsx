import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/workouts', icon: '💪', label: 'Workouts' },
  { to: '/goals', icon: '🎯', label: 'Goals' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 1.5rem 1rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--gradient-fire)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Bebas Neue, cursive', fontSize: '1.1rem', color: 'white', flexShrink: 0
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Athlete</div>
          </div>
        </div>
      </div>

      <nav>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="sidebar-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem 1.5rem', marginTop: 'auto', borderTop: '1px solid var(--card-border)', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <button className="btn-ghost" style={{ width: '100%', textAlign: 'center' }} onClick={logout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}