import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    servicesAPI.getAll()
      .then(res => setServices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? services : services.filter(s => s.type === tab);

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--teal-dark), var(--teal-mid))',
        padding: '80px 0',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-orange" style={{ marginBottom: 16 }}>Same-Day Appointments Available</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: 'white', marginBottom: 16 }}>
            Our Services
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: 560 }}>
            From free NHS services to confidential private consultations — expert pharmacist-led care available 5 days a week at our Oxford pharmacy.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1.5px solid var(--gray-100)', position: 'sticky', top: 72, zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: 4 }}>
          {[['all', 'All Services'], ['nhs', '🏥 NHS Free Services'], ['private', '🩺 Private Consultations']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              padding: '16px 24px', border: 'none', background: 'none',
              fontWeight: tab === val ? 700 : 400,
              color: tab === val ? 'var(--orange)' : 'var(--gray-600)',
              borderBottom: tab === val ? '3px solid var(--orange)' : '3px solid transparent',
              cursor: 'pointer', fontSize: '0.95rem', transition: 'var(--transition)',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : (
          <>
            {/* NHS Info Banner */}
            {(tab === 'all' || tab === 'nhs') && (
              <div style={{ background: 'var(--teal-pale)', border: '1.5px solid var(--teal-light)', borderRadius: 'var(--radius-lg)', padding: '20px 28px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: '2rem' }}>🏥</span>
                <div>
                  <h3 style={{ color: 'var(--teal-dark)', marginBottom: 4 }}>NHS Free Services</h3>
                  <p style={{ color: 'var(--teal-mid)', fontSize: '0.9rem' }}>All NHS services are completely free to eligible patients. No GP referral needed for most services.</p>
                </div>
                <Link to="/appointments?type=nhs" className="btn btn-teal" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>Book NHS Appointment</Link>
              </div>
            )}

            {/* Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {filtered.map(service => (
                <div key={service.id} className="card" style={{ padding: 28 }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: service.type === 'nhs' ? 'var(--teal-pale)' : 'var(--orange-pale)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', marginBottom: 20
                  }}>{service.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gray-800)' }}>{service.name}</h3>
                    <span className={service.type === 'nhs' ? 'badge badge-teal' : 'badge badge-orange'} style={{ fontSize: '0.72rem' }}>
                      {service.type === 'nhs' ? 'FREE' : 'PRIVATE'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>{service.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>⏱ {service.duration} min appointment</span>
                    <Link to={`/appointments?service=${service.id}`} className="btn btn-sm" style={{
                      background: service.type === 'nhs' ? 'var(--teal-dark)' : 'var(--orange)',
                      color: 'white', boxShadow: 'none'
                    }}>Book Now</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--orange)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: 'white', marginBottom: 12 }}>
            Need Expert Advice?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 32, fontSize: '1.05rem' }}>
            Walk in, call us, or book a same-day appointment online. We're here to help.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/appointments" className="btn btn-lg" style={{ background: 'white', color: 'var(--orange-dark)', fontWeight: 700 }}>Book Appointment</Link>
            <a href="tel:01865777836" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}>📞 01865 777836</a>
          </div>
        </div>
      </div>
    </div>
  );
}
