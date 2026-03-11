import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const goals = [
  { value: 'lose_weight', label: '⚖️ Lose Weight' },
  { value: 'build_muscle', label: '💪 Build Muscle' },
  { value: 'improve_endurance', label: '🏃 Improve Endurance' },
  { value: 'stay_active', label: '⚡ Stay Active' },
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '', weight: '', height: '', fitnessGoal: 'stay_active'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="text-center mb-4">
          <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', letterSpacing: '3px', color: 'var(--primary)' }}>IRONTRACK</div>
          <h1 className="auth-title mt-1">JOIN THE GRIND</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>Create your free account and start tracking</p>
        </div>

        {error && <div className="alert-custom alert-danger-custom mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label-custom">Full Name</label>
              <input type="text" name="name" className="form-control-custom" placeholder="John Doe"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label-custom">Email Address</label>
              <input type="email" name="email" className="form-control-custom" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label-custom">Password</label>
              <input type="password" name="password" className="form-control-custom" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="col-4">
              <label className="form-label-custom">Age</label>
              <input type="number" name="age" className="form-control-custom" placeholder="25"
                value={form.age} onChange={handleChange} min="10" max="100" />
            </div>
            <div className="col-4">
              <label className="form-label-custom">Weight (kg)</label>
              <input type="number" name="weight" className="form-control-custom" placeholder="75"
                value={form.weight} onChange={handleChange} />
            </div>
            <div className="col-4">
              <label className="form-label-custom">Height (cm)</label>
              <input type="number" name="height" className="form-control-custom" placeholder="175"
                value={form.height} onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label-custom">Primary Goal</label>
              <select name="fitnessGoal" className="form-control-custom" value={form.fitnessGoal} onChange={handleChange}>
                {goals.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-fire w-100 justify-content-center mt-4" disabled={loading}
            style={{ width: '100%', padding: '0.8rem' }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}