import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '💪', title: 'Track Workouts', desc: 'Log every exercise, set, rep and weight. Build your workout library with detailed tracking.' },
  { icon: '🎯', title: 'Set Goals', desc: 'Define fitness goals and track your progress. Stay motivated with visual milestones.' },
  { icon: '📊', title: 'View Progress', desc: 'Visualize your fitness journey with beautiful charts and weekly/monthly stats.' },
  { icon: '🔥', title: 'Burn Calories', desc: 'Track calories burned across every workout session and hit your daily targets.' },
  { icon: '⚡', title: 'Performance', desc: 'Monitor strength gains, endurance improvements, and personal records over time.' },
  { icon: '🏆', title: 'Achievements', desc: 'Celebrate milestones, streaks, and new personal bests as you level up your fitness.' },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500K+', label: 'Workouts Logged' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Always Available' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* HERO */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="mb-3">
                <span className="badge-custom badge-fire">🔥 Your Fitness, Tracked</span>
              </div>
              <h1 className="hero-title">
                CRUSH
                <span className="highlight">EVERY</span>
                WORKOUT
              </h1>
              <p className="hero-subtitle mt-3 mb-4">
                The ultimate fitness tracking platform built for athletes who demand more from their training.
              </p>
              <div className="hero-cta-group">
                {user ? (
                  <Link to="/dashboard" className="btn-fire" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.8rem 2rem' }}>
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-fire" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.8rem 2rem' }}>
                      Start Free Today →
                    </Link>
                    <Link to="/login" className="btn-outline-fire" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.8rem 2rem' }}>
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="d-flex flex-column gap-3">
                {[
                  { icon: '💪', label: 'Chest & Triceps Day', meta: '6 exercises · 450 cal', tag: 'Strength' },
                  { icon: '🏃', label: '10K Morning Run', meta: '52 min · 620 cal', tag: 'Cardio' },
                  { icon: '🎯', label: 'Goal: Bench 100kg', meta: '78% complete · 22kg left', tag: 'Active Goal' },
                ].map((item, i) => (
                  <div key={i} className="floating-stat">
                    <div className="fs-icon">{item.icon}</div>
                    <div className="flex-grow-1">
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px' }}>{item.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.meta}</div>
                    </div>
                    <span className="badge-custom badge-fire">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', padding: '2rem 0' }}>
        <div className="container">
          <div className="row g-3 text-center">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem', letterSpacing: '2px', color: 'var(--primary)' }}>{s.value}</div>
                <div className="label-font">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '6rem 0', background: 'var(--dark-bg)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="label-font mb-2">Everything You Need</div>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>BUILT FOR ATHLETES</h2>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {f.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)' }}>
        <div className="container text-center">
          <h2 className="section-title" style={{ fontSize: '3.5rem' }}>READY TO LEVEL UP?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '1rem auto 2rem', fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', letterSpacing: '1px' }}>
            Join thousands of athletes tracking their fitness journey on IronTrack.
          </p>
          {!user && (
            <Link to="/register" className="btn-fire" style={{ textDecoration: 'none', fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Create Free Account →
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--card-border)', padding: '2rem 0', textAlign: 'center' }}>
        <div className="label-font" style={{ color: 'var(--text-muted)' }}>
          © 2024 IRONTRACK · Built with MERN Stack + Bootstrap
        </div>
      </footer>
    </div>
  );
}