import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', letterSpacing: '3px', color: 'var(--primary)' }}>IRONTRACK</div>
          <h1 className="auth-title mt-1">WELCOME BACK</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>Sign in to continue your journey</p>
        </div>

        {error && <div className="alert-custom alert-danger-custom mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label-custom">Email Address</label>
            <input type="email" name="email" className="form-control-custom" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label-custom">Password</label>
            <input type="password" name="password" className="form-control-custom" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-fire w-100 justify-content-center" disabled={loading}
            style={{ width: '100%', padding: '0.8rem' }}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          New to IronTrack?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}