import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '0.7rem 1rem', fontSize: '0.85rem' }}>
        <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({});
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [weekRes, monthRes, workoutRes, goalRes] = await Promise.all([
        api.get('/progress/weekly'),
        api.get('/progress/monthly'),
        api.get('/workouts?limit=5'),
        api.get('/goals'),
      ]);
      setWeeklyData(weekRes.data.map(d => ({
        ...d,
        day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' })
      })));
      setMonthlyStats(monthRes.data);
      setRecentWorkouts(workoutRes.data.workouts || []);
      setGoals((goalRes.data || []).filter(g => g.status === 'active').slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  const statsCards = [
    { value: monthlyStats.workouts || 0, label: 'Workouts', icon: '💪', sub: 'This month' },
    { value: monthlyStats.calories ? Math.round(monthlyStats.calories) : 0, label: 'Calories', icon: '🔥', sub: 'This month' },
    { value: monthlyStats.duration ? Math.round(monthlyStats.duration / 60) : 0, label: 'Hours', icon: '⏱', sub: 'This month' },
    { value: goals.length, label: 'Active Goals', icon: '🎯', sub: 'In progress' },
  ];

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>DASHBOARD</h1>
          <div className="label-font" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Athlete'} 👋
          </div>
        </div>
        <Link to="/workouts" className="btn-fire" style={{ textDecoration: 'none' }}>+ Log Workout</Link>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 mb-4">
        {statsCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card-custom">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Weekly Calories
              </h3>
              <span className="badge-custom badge-fire">7 Days</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#8888A8', fontSize: 12, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8888A8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,61,0,0.05)' }} />
                <Bar dataKey="calories" fill="#FF3D00" radius={[4, 4, 0, 0]} name="Calories" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card-custom">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Duration (min)
              </h3>
              <span className="badge-custom badge-cyan">This Week</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#8888A8', fontSize: 12, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8888A8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="duration" stroke="#00E5FF" strokeWidth={2} dot={{ fill: '#00E5FF', r: 4 }} name="Duration" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="row g-4">
        {/* Recent Workouts */}
        <div className="col-lg-6">
          <div className="card-custom">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Recent Workouts
              </h3>
              <Link to="/workouts" style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'Rajdhani', letterSpacing: '1px' }}>
                View All →
              </Link>
            </div>
            {recentWorkouts.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-icon">💪</div>
                <h3>No Workouts Yet</h3>
                <p style={{ fontSize: '0.85rem' }}>Log your first workout to get started</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {recentWorkouts.map((w) => {
                  const d = new Date(w.date);
                  return (
                    <div key={w._id} className="d-flex align-items-center gap-3" style={{
                      background: 'var(--surface)', borderRadius: 8, padding: '0.8rem 1rem'
                    }}>
                      <div className="workout-date-badge">
                        <div className="day">{d.getDate()}</div>
                        <div className="month">{d.toLocaleDateString('en', { month: 'short' })}</div>
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>{w.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {w.exercises?.length || 0} exercises · {w.totalCalories || 0} cal
                        </div>
                      </div>
                      <span className="badge-custom badge-fire">{w.totalDuration || 0}m</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Active Goals */}
        <div className="col-lg-6">
          <div className="card-custom">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Active Goals
              </h3>
              <Link to="/goals" style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'Rajdhani', letterSpacing: '1px' }}>
                View All →
              </Link>
            </div>
            {goals.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-icon">🎯</div>
                <h3>No Goals Set</h3>
                <p style={{ fontSize: '0.85rem' }}>Create a goal to stay motivated</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {goals.map((g) => {
                  const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
                  return (
                    <div key={g._id} style={{ background: 'var(--surface)', borderRadius: 8, padding: '1rem' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.9rem' }}>{g.title}</div>
                        <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.2rem', color: 'var(--primary)' }}>{pct}%</div>
                      </div>
                      <div className="progress-custom">
                        <div className="progress-bar-custom" style={{ width: `${pct}%` }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                        {g.currentValue} / {g.targetValue} {g.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}