import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="mobile-page-padding" style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: '4rem', marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: 10 }}>Your cart is empty</h2>
      <p style={{ color: 'var(--gray-600)', marginBottom: 28 }}>Add some products to get started!</p>
      <Link to="/shop" className="btn btn-primary btn-lg">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="page-enter mobile-page-padding">
      <div style={{ background: 'var(--teal-dark)', padding: '36px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'white' }}>Your Cart</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 4, fontSize: '0.9rem' }}>{cart.length} item(s)</p>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 16px' }}>
        <div className="sidebar-layout">
          {/* Cart Items */}
          <div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {cart.map((item, idx) => (
                <div key={item._id} style={{
                  display: 'grid', gridTemplateColumns: '72px 1fr auto',
                  gap: 14, padding: '16px', alignItems: 'center',
                  borderBottom: idx < cart.length - 1 ? '1px solid var(--gray-100)' : 'none',
                }}>
                  <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', background: 'var(--gray-50)' }}>
                    <img src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                      alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</h3>
                    {item.brand && <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: 8 }}>{item.brand}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => updateQty(item._id, item.quantity - 1)} style={{ width: 28, height: 28, border: '1.5px solid var(--gray-200)', borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)} style={{ width: 28, height: 28, border: '1.5px solid var(--gray-200)', borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--teal-dark)' }}>£{(item.price * item.quantity).toFixed(2)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>£{item.price.toFixed(2)} each</div>
                    <button onClick={() => removeFromCart(item._id)} style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', fontSize: '1rem' }}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <Link to="/shop" style={{ color: 'var(--teal-dark)', fontWeight: 500, fontSize: '0.9rem' }}>← Continue Shopping</Link>
              <button onClick={clearCart} style={{ color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Clear Cart</button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', marginBottom: 20 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                  <span>Subtotal ({cart.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--teal-dark)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <span>🚚 Delivery</span><span>FREE</span>
                </div>
                <div style={{ borderTop: '1.5px solid var(--gray-100)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--teal-dark)' }}>£{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                Proceed to Checkout →
              </button>
              <div style={{ marginTop: 12, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 16, color: 'var(--gray-400)', fontSize: '0.78rem' }}>
                <span>🔒 Secure checkout</span>
                <span>✓ SSL encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
