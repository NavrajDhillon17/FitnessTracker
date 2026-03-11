import { useState, useEffect } from 'react';
import axios from 'axios';

const GOAL_TYPES = ['weight', 'workouts_per_week', 'calories', 'distance', 'strength', 'custom'];
const TYPE_ICONS = { weight: '⚖️', workouts_per_week: '📅', calories: '🔥', distance: '🏃', strength: '💪', custom: '🎯' };

const emptyGoal = () => ({ title: '', type: 'custom', targetValue: '', currentValue: '', unit: '', deadline: '', notes: '' });

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyGoal());
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const res = await axios.get('/api/goals');
      setGoals(res.data || []);
    } catch { } finally { setLoading(false); }
  };

  const openModal = (goal = null) => {
    if (goal) {
      setForm({ ...goal, deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '' });
      setEditId(goal._id);
    } else {
      setForm(emptyGoal());
      setEditId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditId(null); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await axios.put(`/api/goals/${editId}`, form); }
      else { await axios.post('/api/goals', form); }
      await fetchGoals();
      closeModal();
    } catch { } finally { setSaving(false); }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await axios.delete(`/api/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
    } catch { }
  };

  const updateProgress = async (goal, newValue) => {
    try {
      const updated = await axios.put(`/api/goals/${goal._id}`, {
        ...goal,
        currentValue: newValue,
        status: newValue >= goal.targetValue ? 'completed' : 'active'
      });
      setGoals(goals.map(g => g._id === goal._id ? updated.data : g));
    } catch { }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1>GOALS</h1>
          <div className="label-font" style={{ color: 'var(--text-secondary)' }}>
            {activeGoals.length} active · {completedGoals.length} completed
          </div>
        </div>
        <button className="btn-fire" onClick={() => openModal()}>+ New Goal</button>
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>NO GOALS YET</h3>
          <p>Set your first fitness goal and start crushing it</p>
          <button className="btn-fire mt-3" onClick={() => openModal()}>Create Goal</button>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="mb-4">
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                🔥 Active Goals
              </h2>
              <div className="row g-3">
                {activeGoals.map(g => {
                  const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100)) || 0;
                  return (
                    <div key={g._id} className="col-md-6 col-lg-4">
                      <div className="card-custom h-100">
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div>
                            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{TYPE_ICONS[g.type]}</div>
                            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '1px' }}>{g.title}</h3>
                            <span className="badge-custom badge-fire" style={{ fontSize: '0.65rem', marginTop: '4px' }}>{g.type.replace('_', ' ')}</span>
                          </div>
                          <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2rem', color: 'var(--primary)', lineHeight: 1 }}>{pct}%</div>
                        </div>

                        <div className="progress-custom mb-2">
                          <div className="progress-bar-custom" style={{ width: `${pct}%` }} />
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                          {g.currentValue} / {g.targetValue} {g.unit}
                          {g.deadline && <span className="ms-2">· Due {new Date(g.deadline).toLocaleDateString()}</span>}
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <input type="number" className="form-control-custom" placeholder="Update progress"
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                            onBlur={e => { if (e.target.value) updateProgress(g, parseFloat(e.target.value)); e.target.value = ''; }}
                            onKeyDown={e => { if (e.key === 'Enter' && e.target.value) { updateProgress(g, parseFloat(e.target.value)); e.target.value = ''; } }} />
                          <button className="btn-ghost" onClick={() => openModal(g)} style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.7rem', fontSize: '0.75rem' }}>Edit</button>
                          <button className="btn-danger-custom" onClick={() => deleteGoal(g._id)} style={{ whiteSpace: 'nowrap' }}>Del</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                🏆 Completed Goals
              </h2>
              <div className="row g-3">
                {completedGoals.map(g => (
                  <div key={g._id} className="col-md-6 col-lg-4">
                    <div className="card-custom" style={{ opacity: 0.7 }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontSize: '1.5rem' }}>{TYPE_ICONS[g.type]}</span>
                          <div>
                            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>{g.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✓ Completed · {g.targetValue} {g.unit}</div>
                          </div>
                        </div>
                        <button className="btn-danger-custom" onClick={() => deleteGoal(g._id)}>Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-custom" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <div className="modal-header-custom">
              <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.8rem', letterSpacing: '2px' }}>
                {editId ? 'EDIT GOAL' : 'NEW GOAL'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-custom">Goal Title</label>
                  <input className="form-control-custom" name="title" placeholder="e.g. Bench Press 100kg" value={form.title} onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label-custom">Goal Type</label>
                  <select className="form-control-custom" name="type" value={form.type} onChange={handleChange}>
                    {GOAL_TYPES.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label-custom">Unit</label>
                  <input className="form-control-custom" name="unit" placeholder="kg, km, times, etc." value={form.unit} onChange={handleChange} />
                </div>
                <div className="col-6">
                  <label className="form-label-custom">Target Value</label>
                  <input type="number" className="form-control-custom" name="targetValue" placeholder="100" value={form.targetValue} onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label-custom">Current Value</label>
                  <input type="number" className="form-control-custom" name="currentValue" placeholder="0" value={form.currentValue} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Deadline (optional)</label>
                  <input type="date" className="form-control-custom" name="deadline" value={form.deadline} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Notes</label>
                  <textarea className="form-control-custom" name="notes" placeholder="Why is this goal important to you?" value={form.notes} onChange={handleChange} rows={2} style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-end mt-4">
                <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-fire" disabled={saving}>
                  {saving ? 'Saving...' : (editId ? 'Update Goal' : 'Create Goal')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}