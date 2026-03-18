import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { toast } from 'react-toastify';
import TruwellLogo from '../components/TruwellLogo';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--teal-pale) 0%, var(--orange-pale) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="card page-enter" style={{ width: '100%', maxWidth: '460px', padding: '48px 40px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <TruwellLogo size={0.95} />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email" className="form-control" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password" className="form-control" placeholder="Enter your password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px', fontSize: '1rem' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }} />
          <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }} />
        </div>

        <p style={{ textAlign: 'center', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--orange)', fontWeight: '600' }}>Create one free</Link>
        </p>

        <div style={{ marginTop: '24px', background: 'var(--teal-pale)', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span>🏥</span>
          <p style={{ fontSize: '0.82rem', color: 'var(--teal-dark)', lineHeight: '1.5' }}>
            NHS patients can access free services without an account. Visit our <Link to="/services" style={{ color: 'var(--orange)', fontWeight: '600' }}>Services page</Link> to book.
          </p>
        </div>
      </div>
    </div>
  );
}
