import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const GOAL_OPTIONS = [
  { value: 'lose_weight', label: '⚖️ Lose Weight' },
  { value: 'build_muscle', label: '💪 Build Muscle' },
  { value: 'improve_endurance', label: '🏃 Improve Endurance' },
  { value: 'stay_active', label: '⚡ Stay Active' },
];

export default function Profile() {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    fitnessGoal: user?.fitnessGoal || 'stay_active',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await axios.put('/api/auth/profile', form);
      await fetchUser();
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const bmi = user?.weight && user?.height
    ? ((user.weight / ((user.height / 100) ** 2)).toFixed(1))
    : null;

  const getBMIStatus = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Underweight', color: 'var(--secondary)' };
    if (bmi < 25) return { label: 'Normal', color: 'var(--success)' };
    if (bmi < 30) return { label: 'Overweight', color: 'var(--warning)' };
    return { label: 'Obese', color: 'var(--primary)' };
  };

  const bmiStatus = getBMIStatus(bmi);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>PROFILE</h1>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="card-custom text-center mb-4">
            <div style={{
              width: 80, height: 80, background: 'var(--gradient-fire)', borderRadius: '50%',
              margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontFamily: 'Bebas Neue, cursive', color: 'white', letterSpacing: '1px'
            }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.8rem', letterSpacing: '2px' }}>{user?.name}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>{user?.email}</div>
            <div className="mt-2">
              <span className="badge-custom badge-fire">
                {GOAL_OPTIONS.find(g => g.value === user?.fitnessGoal)?.label || '⚡ Stay Active'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="card-custom">
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Body Stats
            </h3>
            <div className="d-flex flex-column gap-3">
              {[
                { label: 'Age', value: user?.age ? `${user.age} years` : '—' },
                { label: 'Weight', value: user?.weight ? `${user.weight} kg` : '—' },
                { label: 'Height', value: user?.height ? `${user.height} cm` : '—' },
              ].map((s, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center">
                  <span className="label-font">{s.label}</span>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem' }}>{s.value}</span>
                </div>
              ))}
              {bmi && (
                <div className="d-flex justify-content-between align-items-center">
                  <span className="label-font">BMI</span>
                  <span style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.4rem', color: bmiStatus?.color }}>
                    {bmi} <span style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>{bmiStatus?.label}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="col-lg-8">
          <div className="card-custom">
            <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>
              EDIT PROFILE
            </h2>

            {success && <div className="alert-custom alert-success-custom mb-3">{success}</div>}
            {error && <div className="alert-custom alert-danger-custom mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-custom">Full Name</label>
                  <input className="form-control-custom" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="col-4">
                  <label className="form-label-custom">Age</label>
                  <input type="number" className="form-control-custom" name="age" value={form.age} onChange={handleChange} min="10" max="100" />
                </div>
                <div className="col-4">
                  <label className="form-label-custom">Weight (kg)</label>
                  <input type="number" className="form-control-custom" name="weight" value={form.weight} onChange={handleChange} />
                </div>
                <div className="col-4">
                  <label className="form-label-custom">Height (cm)</label>
                  <input type="number" className="form-control-custom" name="height" value={form.height} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Primary Fitness Goal</label>
                  <select className="form-control-custom" name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange}>
                    {GOAL_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn-fire" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}