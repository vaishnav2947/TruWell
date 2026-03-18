import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../api';
import ProductCard from '../components/ProductCard';

const FEATURES = [
  { icon: '🚚', title: 'Free Home Delivery', desc: 'Fast & free to all UK mainland addresses', color: 'var(--orange)' },
  { icon: '📅', title: 'Same-Day Appointments', desc: 'Expert care when you need it most', color: 'var(--teal-dark)' },
  { icon: '💊', title: 'Free Pharmacist Advice', desc: 'Expert prescribing advice at no cost', color: 'var(--orange)' },
  { icon: '✈️', title: 'Travel Health Clinic', desc: 'Vaccines, checks & tailored travel advice', color: 'var(--teal-dark)' },
  { icon: '🩺', title: 'Private Consultations', desc: 'Confidential & personalised care', color: 'var(--orange)' },
  { icon: '🏥', title: 'NHS Services', desc: 'Full range of NHS pharmacy services', color: 'var(--teal-dark)' },
];

const NHS_SERVICES = [
  { icon: '❤️', title: 'Healthy Living Advice' },
  { icon: '🩺', title: 'Minor Ailment Advice' },
  { icon: '🔷', title: 'Pharmacy First' },
  { icon: '💉', title: 'Blood Pressure Check' },
  { icon: '💊', title: 'Contraception Service' },
  { icon: '🚭', title: 'Stop Smoking' },
];

const PRIVATE_SERVICES = [
  { icon: '🩺', title: 'Private Consultations' },
  { icon: '✈️', title: 'Travel Health' },
  { icon: '⚖️', title: 'Weight Management' },
  { icon: '🌸', title: "Women's Health" },
  { icon: '💪', title: "Men's Health" },
  { icon: '✨', title: 'Skin & Cosmetic' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ featured: true, limit: 4 })
      .then(res => setFeatured(res.data.products))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="page-enter">
      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, var(--teal-dark) 0%, var(--teal-mid) 50%, var(--teal-light) 100%)',
        position: 'relative', overflow: 'hidden', padding: '100px 0',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(232,82,26,0.10)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="badge badge-orange" style={{ marginBottom: 20, fontSize: '0.82rem' }}>
                🏥 Open 5 Days a Week · Oxford's Trusted Pharmacy
              </div>
              <h1 style={{ fontSize: '3.2rem', color: 'white', fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
                Your Health,<br />
                <span style={{ color: 'var(--orange)' }}>Our Priority</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                Truwell Pharmacy offers NHS services, private consultations, travel health advice, and free UK-wide medicine delivery — all from our friendly Oxford pharmacy.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/shop" className="btn btn-primary btn-lg">
                  🛒 Shop Now
                </Link>
                <Link to="/appointments" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  📅 Book Appointment
                </Link>
              </div>
              <div style={{ display: 'flex', gap: 28, marginTop: 40 }}>
                {[['500+', 'Products'], ['5★', 'Patient Rating'], ['Free', 'UK Delivery']].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--orange)' }}>{val}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '🚚', text: 'Free UK-Wide Delivery on all orders' },
                { icon: '📅', text: 'Same-Day Appointments Available' },
                { icon: '🔒', text: 'Confidential & Personalised Care' },
                { icon: '🏥', text: 'Registered NHS Pharmacy' },
              ].map(({ icon, text }) => (
                <div key={text} style={{
                  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                  borderRadius: 16, padding: '18px 24px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                  <span style={{ color: 'white', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section style={{ background: 'white', padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Why Choose Truwell?</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>Comprehensive care, convenient services, trusted expertise</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ icon, title, desc, color }) => (
              <div key={title} style={{
                padding: '28px 24px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--gray-100)',
                transition: 'var(--transition)',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = color; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--gray-100)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: color === 'var(--orange)' ? 'var(--orange-pale)' : 'var(--teal-pale)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', marginBottom: 16
                }}>{icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: 'var(--gray-800)' }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SPLIT */}
      <section style={{ background: 'var(--off-white)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title">Our Services</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem' }}>Same-day appointments · Free & confidential</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* NHS */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ background: 'var(--teal-dark)', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🏥</div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em' }}>FREE</div>
                  <h3 style={{ color: 'white', fontSize: '1.4rem', fontFamily: 'Playfair Display, serif' }}>NHS Services</h3>
                </div>
              </div>
              <div style={{ padding: '24px 32px' }}>
                {NHS_SERVICES.map(({ icon, title }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                    <span style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{title}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--teal-mid)', fontSize: '0.8rem', fontWeight: 600 }}>FREE</span>
                  </div>
                ))}
                <Link to="/appointments" className="btn btn-teal" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
                  Book NHS Appointment
                </Link>
              </div>
            </div>

            {/* Private */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--orange) 0%, var(--orange-dark) 100%)', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🩺</div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em' }}>CONFIDENTIAL</div>
                  <h3 style={{ color: 'white', fontSize: '1.4rem', fontFamily: 'Playfair Display, serif' }}>Private Consultations</h3>
                </div>
              </div>
              <div style={{ padding: '24px 32px' }}>
                {PRIVATE_SERVICES.map(({ icon, title }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                    <span style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{title}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--orange)', fontSize: '0.8rem', fontWeight: 600 }}>BOOK →</span>
                  </div>
                ))}
                <Link to="/appointments" className="btn btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
                  Book Private Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ background: 'white', padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p style={{ color: 'var(--gray-600)' }}>Top picks from our pharmacy</p>
            </div>
            <Link to="/shop" className="btn btn-outline">View All Products →</Link>
          </div>
          {loadingProducts ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <div className="spinner" />
            </div>
          ) : featured.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>
              <p style={{ marginBottom: 16 }}>No products yet.</p>
              <button onClick={() => productsAPI.seed().then(() => window.location.reload())} className="btn btn-primary">
                Load Sample Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* DELIVERY BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, var(--orange) 0%, var(--orange-dark) 100%)',
        padding: '64px 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛵</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', color: 'white', marginBottom: 12 }}>
            Free UK-Wide Delivery
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: 32 }}>
            Order your medicines and pharmacy products online. Free delivery to all UK mainland addresses.
          </p>
          <Link to="/shop" className="btn btn-lg" style={{ background: 'white', color: 'var(--orange-dark)', fontWeight: 700 }}>
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
