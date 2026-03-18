import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import TruwellLogo from './TruwellLogo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/services', label: 'Services' },
    { to: '/appointments', label: 'Book Appointment' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div style={{ background: 'var(--teal-dark)', color: 'white', padding: '8px 0', fontSize: '0.82rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span>📍 6A Courtland Road, Rosehill, Oxford, OX4 4JA</span>
            <span>📞 01865 777836</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>✅ Free UK Delivery</span>
            <span>⏰ Mon–Fri: 9:00–18:30</span>
            <span>🚀 Same-Day Appointments</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: 'white',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <TruwellLogo size={0.85} />
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontWeight: 500,
                fontSize: '0.95rem',
                color: isActive(to) && to !== '/' ? 'var(--orange)' : to === '/' && location.pathname === '/' ? 'var(--orange)' : 'var(--gray-800)',
                background: (isActive(to) && to !== '/') || (to === '/' && location.pathname === '/') ? 'var(--orange-pale)' : 'transparent',
                transition: 'var(--transition)',
              }}
                onMouseEnter={e => e.target.style.background = 'var(--gray-50)'}
                onMouseLeave={e => e.target.style.background = (isActive(to) && to !== '/') || (to === '/' && location.pathname === '/') ? 'var(--orange-pale)' : 'transparent'}
              >{label}</Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 10, background: 'var(--gray-50)', color: 'var(--gray-800)', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--orange-pale)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-50)'}
            >
              <span style={{ fontSize: '1.2rem' }}>🛒</span>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: 'var(--orange)', color: 'white',
                  borderRadius: '50%', width: 20, height: 20,
                  fontSize: '0.7rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{totalItems}</span>
              )}
            </Link>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {(user.role === 'admin' || user.role === 'pharmacist') && (
                  <Link to="/admin/medicines" style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 10,
                    background: isActive('/admin') ? 'var(--orange-pale)' : 'var(--gray-50)',
                    color: isActive('/admin') ? 'var(--orange)' : 'var(--gray-600)',
                    fontWeight: 600, fontSize: '0.85rem', border: '1.5px solid var(--gray-200)',
                  }}>
                    ⚕️ Medicines
                  </Link>
                )}
                <Link to="/account" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 10,
                    background: 'var(--teal-pale)', color: 'var(--teal-dark)',
                    fontWeight: 500, fontSize: '0.9rem'
                  }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--teal-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    {user.name?.split(' ')[0]}
                  </Link>
                <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)', boxShadow: 'none' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', padding: 4 }}
              className="mobile-menu-btn"
            >☰</button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: 'white', borderTop: '1px solid var(--gray-100)', padding: '16px 24px' }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid var(--gray-100)', fontWeight: 500, color: 'var(--gray-800)' }}>{label}</Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
