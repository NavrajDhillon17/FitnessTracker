import { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIES = ['cardio', 'strength', 'flexibility', 'sports', 'other'];
const MOODS = ['great', 'good', 'okay', 'tired', 'exhausted'];
const MOOD_EMOJI = { great: '🔥', good: '😊', okay: '😐', tired: '😴', exhausted: '💀' };

const emptyExercise = () => ({ name: '', category: 'strength', sets: '', reps: '', weight: '', duration: '', calories: '', notes: '' });
const emptyWorkout = () => ({ title: '', date: new Date().toISOString().split('T')[0], exercises: [emptyExercise()], totalDuration: '', totalCalories: '', mood: 'good', notes: '' });

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyWorkout());
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchWorkouts(); }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('/api/workouts?limit=50');
      setWorkouts(res.data.workouts || []);
    } catch { } finally { setLoading(false); }
  };

  const openModal = (workout = null) => {
    if (workout) {
      setForm({ ...workout, date: new Date(workout.date).toISOString().split('T')[0] });
      setEditId(workout._id);
    } else {
      setForm(emptyWorkout());
      setEditId(null);
    }
    setError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditId(null); };

  const handleWorkoutChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleExerciseChange = (idx, e) => {
    const exs = [...form.exercises];
    exs[idx] = { ...exs[idx], [e.target.name]: e.target.value };
    setForm({ ...form, exercises: exs });
  };

  const addExercise = () => setForm({ ...form, exercises: [...form.exercises, emptyExercise()] });
  const removeExercise = (idx) => setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editId) {
        await axios.put(`/api/workouts/${editId}`, form);
      } else {
        await axios.post('/api/workouts', form);
      }
      await fetchWorkouts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const deleteWorkout = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await axios.delete(`/api/workouts/${id}`);
      setWorkouts(workouts.filter(w => w._id !== id));
    } catch { }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1>WORKOUTS</h1>
          <div className="label-font" style={{ color: 'var(--text-secondary)' }}>{workouts.length} sessions logged</div>
        </div>
        <button className="btn-fire" onClick={() => openModal()}>+ Log Workout</button>
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💪</div>
          <h3>NO WORKOUTS YET</h3>
          <p>Log your first workout to start tracking your progress</p>
          <button className="btn-fire mt-3" onClick={() => openModal()}>Log First Workout</button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {workouts.map(w => {
            const d = new Date(w.date);
            return (
              <div key={w._id} className="workout-item">
                <div className="workout-date-badge">
                  <div className="day">{d.getDate()}</div>
                  <div className="month">{d.toLocaleDateString('en', { month: 'short' })}</div>
                </div>
                <div className="flex-grow-1">
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.5px' }}>{w.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>💪 {w.exercises?.length || 0} exercises</span>
                    <span>🔥 {w.totalCalories || 0} cal</span>
                    <span>⏱ {w.totalDuration || 0} min</span>
                    <span>{MOOD_EMOJI[w.mood]} {w.mood}</span>
                  </div>
                </div>
                <div className="d-flex gap-2 flex-shrink-0">
                  <button className="btn-ghost" onClick={() => openModal(w)}>Edit</button>
                  <button className="btn-danger-custom" onClick={() => deleteWorkout(w._id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-custom" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div className="modal-header-custom">
              <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.8rem', letterSpacing: '2px' }}>
                {editId ? 'EDIT WORKOUT' : 'LOG WORKOUT'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {error && <div className="alert-custom alert-danger-custom mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-8">
                  <label className="form-label-custom">Workout Title</label>
                  <input className="form-control-custom" name="title" placeholder="e.g. Chest & Back Day" value={form.title} onChange={handleWorkoutChange} required />
                </div>
                <div className="col-4">
                  <label className="form-label-custom">Date</label>
                  <input type="date" className="form-control-custom" name="date" value={form.date} onChange={handleWorkoutChange} />
                </div>
                <div className="col-4">
                  <label className="form-label-custom">Duration (min)</label>
                  <input type="number" className="form-control-custom" name="totalDuration" placeholder="60" value={form.totalDuration} onChange={handleWorkoutChange} />
                </div>
                <div className="col-4">
                  <label className="form-label-custom">Total Calories</label>
                  <input type="number" className="form-control-custom" name="totalCalories" placeholder="400" value={form.totalCalories} onChange={handleWorkoutChange} />
                </div>
                <div className="col-4">
                  <label className="form-label-custom">Mood</label>
                  <select className="form-control-custom" name="mood" value={form.mood} onChange={handleWorkoutChange}>
                    {MOODS.map(m => <option key={m} value={m}>{MOOD_EMOJI[m]} {m}</option>)}
                  </select>
                </div>
              </div>

              <hr className="divider" />
              <div className="d-flex align-items-center justify-content-between mb-3">
                <label className="form-label-custom" style={{ marginBottom: 0 }}>Exercises</label>
                <button type="button" className="btn-ghost" onClick={addExercise}>+ Add Exercise</button>
              </div>

              <div className="d-flex flex-column gap-3">
                {form.exercises.map((ex, idx) => (
                  <div key={idx} style={{ background: 'var(--surface)', borderRadius: 8, padding: '1rem' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="label-font">Exercise {idx + 1}</span>
                      {form.exercises.length > 1 && (
                        <button type="button" className="btn-danger-custom" onClick={() => removeExercise(idx)}>Remove</button>
                      )}
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <input className="form-control-custom" name="name" placeholder="Exercise name" value={ex.name} onChange={e => handleExerciseChange(idx, e)} required />
                      </div>
                      <div className="col-6">
                        <select className="form-control-custom" name="category" value={ex.category} onChange={e => handleExerciseChange(idx, e)}>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-3">
                        <input type="number" className="form-control-custom" name="sets" placeholder="Sets" value={ex.sets} onChange={e => handleExerciseChange(idx, e)} />
                      </div>
                      <div className="col-3">
                        <input type="number" className="form-control-custom" name="reps" placeholder="Reps" value={ex.reps} onChange={e => handleExerciseChange(idx, e)} />
                      </div>
                      <div className="col-3">
                        <input type="number" className="form-control-custom" name="weight" placeholder="kg" value={ex.weight} onChange={e => handleExerciseChange(idx, e)} />
                      </div>
                      <div className="col-3">
                        <input type="number" className="form-control-custom" name="calories" placeholder="Cal" value={ex.calories} onChange={e => handleExerciseChange(idx, e)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <label className="form-label-custom">Notes</label>
                <textarea className="form-control-custom" name="notes" placeholder="How did it go?" value={form.notes} onChange={handleWorkoutChange} rows={2} style={{ resize: 'vertical' }} />
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-fire" disabled={saving}>
                  {saving ? 'Saving...' : (editId ? 'Update Workout' : 'Save Workout')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}