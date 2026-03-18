import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { toast } from 'react-toastify';
import TruwellLogo from '../components/TruwellLogo';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      login(res.data.token, res.data.user);
      toast.success('Account created! Welcome to Truwell.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--teal-pale) 0%, var(--orange-pale) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="card page-enter" style={{ width: '100%', maxWidth: '500px', padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <TruwellLogo size={0.95} />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', marginBottom: '6px' }}>Create your account</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Join Truwell for fast, free UK delivery</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" placeholder="John Smith" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input type="tel" className="form-control" placeholder="07700 000000" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Minimum 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" placeholder="Repeat your password" value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: '20px', lineHeight: '1.5' }}>
            By registering, you agree to our Terms of Service and Privacy Policy. Your data is safe and will never be shared.
          </p>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--orange)', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
