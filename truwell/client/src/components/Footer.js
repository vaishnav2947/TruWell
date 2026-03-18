import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--teal-dark)', color: 'white', paddingTop: 60, marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <img
                src="/truwell-logo.png"
                alt="Truwell Pharmacy"
                height={52}
                style={{
                  filter: 'brightness(0) invert(1)',
                  objectFit: 'contain',
                  display: 'block',
                  marginBottom: 16,
                }}
              />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
              Your trusted community pharmacy in Oxford, offering NHS services, private consultations, and free UK-wide delivery.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['📘 Facebook', '📸 Instagram'].map(s => (
                <a key={s} href="#!" style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', transition: 'var(--transition)' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >{s}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: 'var(--orange)' }}>Quick Links</h4>
            {[
              { to: '/shop', label: 'Online Shop' },
              { to: '/services', label: 'Our Services' },
              { to: '/appointments', label: 'Book Appointment' },
              { to: '/shop?category=prescription', label: 'Prescriptions' },
              { to: '/shop?category=travel-health', label: 'Travel Health' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: 10, transition: 'var(--transition)' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
              >→ {label}</Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: 'var(--orange)' }}>NHS Free Services</h4>
            {['Healthy Living Advice', 'Blood Pressure Check', 'Pharmacy First', 'Stop Smoking Service', 'Contraception Service'].map(s => (
              <div key={s} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: 10 }}>✓ {s}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: 'var(--orange)' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '📍', text: '6A Courtland Road, Rosehill, Oxford, OX4 4JA' },
                { icon: '📞', text: '01865 777836' },
                { icon: '✉️', text: 'info@truwellpharmacy.com' },
                { icon: '🌐', text: 'truwellpharmacy.co.uk' },
                { icon: '⏰', text: 'Mon–Fri: 9:00 – 18:30' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          <span>© {new Date().getFullYear()} Truwell Pharmacy. All rights reserved. Registered Pharmacy No. 1234567</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#!" style={{ color: 'rgba(255,255,255,0.5)' }}>Privacy Policy</a>
            <a href="#!" style={{ color: 'rgba(255,255,255,0.5)' }}>Terms of Use</a>
            <a href="#!" style={{ color: 'rgba(255,255,255,0.5)' }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
