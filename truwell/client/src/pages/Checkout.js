import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: '',
    street: '', city: '', postcode: '', country: 'UK',
    paymentMethod: 'card', cardNumber: '', expiry: '', cvv: '',
    notes: '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePlaceOrder = async () => {
    if (!form.street || !form.city || !form.postcode) {
      toast.error('Please fill in your delivery address');
      return;
    }
    if (!user) { navigate('/login'); return; }
    setPlacing(true);
    try {
      const order = await ordersAPI.create({
        items: cart.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.images?.[0]?.url })),
        shippingAddress: { name: form.name, street: form.street, city: form.city, postcode: form.postcode, country: form.country, phone: form.phone },
        paymentInfo: { method: form.paymentMethod, status: 'paid' },
        notes: form.notes,
      });
      clearCart();
      navigate(`/order-success/${order.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, required }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span style={{ color: 'var(--orange)' }}>*</span>}</label>
      <input type={type} className="form-control" placeholder={placeholder} value={form[name]} onChange={e => update(name, e.target.value)} />
    </div>
  );

  return (
    <div className="page-enter">
      <div style={{ background: 'var(--teal-dark)', padding: '48px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', color: 'white' }}>Checkout</h1>
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            {['Delivery', 'Payment', 'Review'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step > i + 1 ? 'var(--orange)' : step === i + 1 ? 'white' : 'rgba(255,255,255,0.3)',
                  color: step === i + 1 ? 'var(--teal-dark)' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700
                }}>{step > i + 1 ? '✓' : i + 1}</div>
                <span style={{ color: step === i + 1 ? 'white' : 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
                {i < 2 && <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
          <div>
            {/* Step 1: Delivery */}
            {step === 1 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 24, color: 'var(--gray-800)' }}>Delivery Address</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1/-1' }}><Field label="Full Name" name="name" placeholder="John Smith" required /></div>
                  <Field label="Email" name="email" type="email" placeholder="john@example.com" required />
                  <Field label="Phone" name="phone" type="tel" placeholder="07700 000000" />
                  <div style={{ gridColumn: '1/-1' }}><Field label="Street Address" name="street" placeholder="6A Courtland Road" required /></div>
                  <Field label="City" name="city" placeholder="Oxford" required />
                  <Field label="Postcode" name="postcode" placeholder="OX4 4JA" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Order Notes (optional)</label>
                  <textarea className="form-control" rows={2} placeholder="Any special instructions..." value={form.notes} onChange={e => update('notes', e.target.value)} />
                </div>
                <button onClick={() => setStep(2)} className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 24 }}>Payment Method</h2>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  {[{ val: 'card', label: '💳 Card' }, { val: 'paypal', label: '🅿️ PayPal' }].map(({ val, label }) => (
                    <button key={val} onClick={() => update('paymentMethod', val)} style={{
                      flex: 1, padding: '14px', borderRadius: 12,
                      border: `2px solid ${form.paymentMethod === val ? 'var(--teal-dark)' : 'var(--gray-200)'}`,
                      background: form.paymentMethod === val ? 'var(--teal-pale)' : 'white',
                      fontWeight: 600, cursor: 'pointer', color: 'var(--gray-800)'
                    }}>{label}</button>
                  ))}
                </div>
                {form.paymentMethod === 'card' && (
                  <div>
                    <Field label="Card Number" name="cardNumber" placeholder="4242 4242 4242 4242" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Field label="Expiry" name="expiry" placeholder="MM/YY" />
                      <Field label="CVV" name="cvv" placeholder="123" />
                    </div>
                    <div style={{ background: 'var(--gray-50)', borderRadius: 10, padding: 12, fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                      🔒 Demo mode — no real charges processed. Use card 4242 4242 4242 4242
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
                  <button onClick={() => setStep(3)} className="btn btn-primary btn-lg">Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 24 }}>Review Your Order</h2>
                <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <h4 style={{ marginBottom: 12, color: 'var(--gray-600)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivering to</h4>
                  <p style={{ fontWeight: 600 }}>{form.name}</p>
                  <p style={{ color: 'var(--gray-600)' }}>{form.street}, {form.city}, {form.postcode}</p>
                </div>
                {cart.map(i => (
                  <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ fontWeight: 500 }}>{i.name} × {i.quantity}</span>
                    <span style={{ fontWeight: 600, color: 'var(--teal-dark)' }}>£{(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontWeight: 700, fontSize: '1.1rem' }}>
                  <span>Total (incl. free delivery)</span>
                  <span style={{ color: 'var(--teal-dark)' }}>£{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                  <button onClick={() => setStep(2)} className="btn btn-outline">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={placing} className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
                    {placing ? 'Placing Order...' : '✓ Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 90 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 20 }}>Order ({cart.length} items)</h3>
              {cart.map(i => (
                <div key={i._id} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--gray-50)', flexShrink: 0 }}>
                    <img src={i.images?.[0]?.url || ''} alt={i.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{i.name} ×{i.quantity}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>£{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1.5px solid var(--gray-100)', paddingTop: 16, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--teal-dark)' }}>£{subtotal.toFixed(2)}</span>
                </div>
                <p style={{ color: 'var(--teal-mid)', fontSize: '0.85rem', marginTop: 8 }}>✓ Free UK delivery included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
