import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

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
    setMenuOpen(false);
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/shop', label: 'Shop', icon: '🛍️' },
    { to: '/services', label: 'Services', icon: '🏥' },
    { to: '/appointments', label: 'Book', icon: '📅' },
  ];

  return (
    <>
      {/* ── Top info bar (hidden on mobile) ── */}
      <div style={{ background: 'var(--teal-dark)', color: 'white', padding: '7px 0', fontSize: '0.78rem', display: 'none' }} className="desktop-topbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
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

      {/* ── Main Navbar ── */}
      <nav style={{
        background: 'white',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, zIndex: 1000,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="/truwell-logo.png" alt="Truwell Pharmacy" height={44}
              style={{ objectFit: 'contain', display: 'block' }} />
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '8px 14px', borderRadius: 8, fontWeight: 500, fontSize: '0.9rem',
                color: isActive(to) ? 'var(--orange)' : 'var(--gray-800)',
                background: isActive(to) ? 'var(--orange-pale)' : 'transparent',
                transition: 'var(--transition)',
              }}>{label}</Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Cart button */}
            <Link to="/cart" style={{
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 42, height: 42, borderRadius: 10, background: 'var(--gray-50)',
              color: 'var(--gray-800)', transition: 'var(--transition)', flexShrink: 0,
            }}>
              <span style={{ fontSize: '1.1rem' }}>🛒</span>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: 'var(--orange)', color: 'white',
                  borderRadius: '50%', width: 18, height: 18,
                  fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{totalItems}</span>
              )}
            </Link>

            {/* Desktop: user actions */}
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'pharmacist') && (
                    <Link to="/admin/medicines" style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 12px', borderRadius: 10,
                      background: isActive('/admin') ? 'var(--orange-pale)' : 'var(--gray-50)',
                      color: isActive('/admin') ? 'var(--orange)' : 'var(--gray-600)',
                      fontWeight: 600, fontSize: '0.82rem', border: '1.5px solid var(--gray-200)',
                    }}>⚕️ Medicines</Link>
                  )}
                  <Link to="/account" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 12px', borderRadius: 10,
                    background: 'var(--teal-pale)', color: 'var(--teal-dark)', fontWeight: 500, fontSize: '0.88rem'
                  }}>
                    <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--teal-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    {user.name?.split(' ')[0]}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)', boxShadow: 'none' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
                  <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
                </>
              )}
            </div>

            {/* Mobile: hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
              style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.4rem', padding: '4px 6px', borderRadius: 8, color: 'var(--gray-800)' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div style={{
            background: 'white', borderTop: '1px solid var(--gray-100)',
            padding: '12px 16px 16px',
          }}>
            {/* User info */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-100)', marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--teal-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{user.email}</div>
                </div>
              </div>
            )}

            {/* Nav links */}
            {navLinks.map(({ to, label, icon }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 8px', borderBottom: '1px solid var(--gray-100)',
                fontWeight: 500, color: isActive(to) ? 'var(--orange)' : 'var(--gray-800)',
                fontSize: '1rem',
              }}>
                <span style={{ fontSize: '1.1rem', width: 24 }}>{icon}</span>
                {label}
              </Link>
            ))}

            {/* Auth links */}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {user ? (
                <>
                  <Link to="/account" onClick={() => setMenuOpen(false)} className="btn btn-teal" style={{ width: '100%' }}>
                    👤 My Account
                  </Link>
                  {(user.role === 'admin' || user.role === 'pharmacist') && (
                    <Link to="/admin/medicines" onClick={() => setMenuOpen(false)} className="btn btn-outline" style={{ width: '100%' }}>
                      ⚕️ Manage Medicines
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn" style={{ width: '100%', background: 'var(--gray-100)', color: 'var(--gray-600)', boxShadow: 'none' }}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline" style={{ width: '100%' }}>Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Register Free</Link>
                </>
              )}
            </div>

            {/* Contact info */}
            <div style={{ marginTop: 16, padding: '12px', background: 'var(--teal-pale)', borderRadius: 10, fontSize: '0.82rem', color: 'var(--teal-dark)' }}>
              📞 01865 777836 &nbsp;·&nbsp; ⏰ Mon–Fri 9:00–18:30
            </div>
          </div>
        )}
      </nav>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-bottom-nav">
        {[
          { to: '/', icon: '🏠', label: 'Home' },
          { to: '/shop', icon: '🛍️', label: 'Shop' },
          { to: '/cart', icon: '🛒', label: 'Cart', badge: totalItems },
          { to: '/services', icon: '🏥', label: 'Services' },
          { to: user ? '/account' : '/login', icon: user ? '👤' : '🔑', label: user ? 'Account' : 'Login' },
        ].map(({ to, icon, label, badge }) => (
          <Link key={to} to={to} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '6px 4px', position: 'relative',
            color: isActive(to) ? 'var(--orange)' : 'var(--gray-400)',
            transition: 'var(--transition)', textDecoration: 'none',
          }}>
            <span style={{ fontSize: '1.2rem', position: 'relative' }}>
              {icon}
              {badge > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -8,
                  background: 'var(--orange)', color: 'white',
                  borderRadius: '50%', width: 16, height: 16,
                  fontSize: '0.6rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{badge}</span>
              )}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: isActive(to) ? 700 : 400 }}>{label}</span>
            {isActive(to) && (
              <div style={{ position: 'absolute', bottom: 0, width: 24, height: 3, background: 'var(--orange)', borderRadius: 2 }} />
            )}
          </Link>
        ))}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .desktop-topbar { display: block !important; }
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
