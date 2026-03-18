import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, authAPI } from '../api';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  pending: { bg: '#FFF8E1', color: '#F57F17' },
  confirmed: { bg: 'var(--teal-pale)', color: 'var(--teal-dark)' },
  processing: { bg: '#E3F2FD', color: '#1565C0' },
  dispatched: { bg: '#E8F5E9', color: '#2E7D32' },
  delivered: { bg: '#E8F5E9', color: '#1B5E20' },
  cancelled: { bg: 'var(--gray-100)', color: 'var(--gray-600)' },
};

export default function Account() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', phone: '', street: '', city: '', postcode: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (tab === 'orders') {
      setLoadingOrders(true);
      ordersAPI.getMyOrders()
        .then(res => setOrders(res.data))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [tab, user, navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateMe({
        name: profile.name, phone: profile.phone,
        address: { street: profile.street, city: profile.city, postcode: profile.postcode }
      });
      login(localStorage.getItem('truwell_token'), { ...user, name: res.data.name });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page-enter">
      <div style={{ background: 'var(--teal-dark)', padding: '48px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, boxShadow: 'var(--shadow-orange)' }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'white', marginBottom: 4 }}>{user.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{user.email} · {user.role}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
          {/* Sidebar nav */}
          <aside>
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {[
                { id: 'profile', icon: '👤', label: 'My Profile' },
                { id: 'orders', icon: '📦', label: 'My Orders' },
                { id: 'prescriptions', icon: '💊', label: 'Prescriptions' },
              ].map(({ id, icon, label }) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '14px 20px', border: 'none', cursor: 'pointer',
                  background: tab === id ? 'var(--teal-pale)' : 'white',
                  color: tab === id ? 'var(--teal-dark)' : 'var(--gray-700)',
                  fontWeight: tab === id ? 600 : 400,
                  fontSize: '0.95rem', borderLeft: tab === id ? '3px solid var(--teal-dark)' : '3px solid transparent',
                  transition: 'var(--transition)',
                }}>{icon} {label}</button>
              ))}
              <div style={{ borderTop: '1px solid var(--gray-100)' }}>
                <button onClick={() => { logout(); navigate('/'); toast.success('Logged out'); }} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '14px 20px', border: 'none', cursor: 'pointer',
                  background: 'white', color: 'var(--orange)', fontWeight: 500, fontSize: '0.95rem',
                }}>🚪 Sign Out</button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div>
            {tab === 'profile' && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 28 }}>My Profile</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={user.email} disabled style={{ background: 'var(--gray-50)', color: 'var(--gray-400)' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="07700 000000" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Street Address</label>
                    <input className="form-control" value={profile.street} onChange={e => setProfile(p => ({ ...p, street: e.target.value }))} placeholder="123 High Street" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-control" value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="Oxford" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postcode</label>
                    <input className="form-control" value={profile.postcode} onChange={e => setProfile(p => ({ ...p, postcode: e.target.value }))} placeholder="OX1 1AA" />
                  </div>
                </div>
                <button onClick={handleSaveProfile} disabled={saving} className="btn btn-primary" style={{ marginTop: 8 }}>
                  {saving ? 'Saving...' : '✓ Save Changes'}
                </button>
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 24 }}>My Orders</h2>
                {loadingOrders ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
                ) : orders.length === 0 ? (
                  <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 60, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>📦</div>
                    <h3 style={{ marginBottom: 8 }}>No orders yet</h3>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>Start shopping to see your orders here</p>
                    <button onClick={() => navigate('/shop')} className="btn btn-primary">Browse Products</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {orders.map(order => {
                      const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                      return (
                        <div key={order._id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                              <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{order.orderNumber}</span>
                              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: 2 }}>
                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ ...statusStyle, padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <span style={{ fontWeight: 700, color: 'var(--teal-dark)', fontSize: '1.1rem' }}>£{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {order.items.slice(0, 3).map((item, i) => (
                              <span key={i} style={{ background: 'var(--gray-50)', padding: '4px 12px', borderRadius: 6, fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                                {item.name} ×{item.quantity}
                              </span>
                            ))}
                            {order.items.length > 3 && <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>+{order.items.length - 3} more</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === 'prescriptions' && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 36, boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 20 }}>💊</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 12 }}>Prescriptions</h3>
                <p style={{ color: 'var(--gray-600)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
                  Upload your NHS or private prescriptions to order your medicines online. Our pharmacists will review and dispense.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary">📤 Upload Prescription</button>
                  <button onClick={() => navigate('/appointments?service=pharmacy-first')} className="btn btn-outline">Book Consultation</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
