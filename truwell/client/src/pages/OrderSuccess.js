import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI } from '../api';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    ordersAPI.getOne(id).then(res => setOrder(res.data)).catch(() => {});
  }, [id]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--off-white)' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        {/* Success animation */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--teal-dark), var(--teal-mid))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', margin: '0 auto 28px',
          boxShadow: 'var(--shadow-teal)',
          animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>✓</div>

        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', color: 'var(--teal-dark)', marginBottom: 12 }}>
          Order Confirmed!
        </h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', marginBottom: 32 }}>
          Thank you for your order. Your medicines are being prepared for dispatch.
        </p>

        {order && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 28, boxShadow: 'var(--shadow-sm)', marginBottom: 32, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem', marginBottom: 2 }}>ORDER NUMBER</p>
                <p style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{order.orderNumber}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem', marginBottom: 2 }}>TOTAL</p>
                <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--teal-dark)' }}>£{order.total.toFixed(2)}</p>
              </div>
            </div>

            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--gray-700)' }}>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--teal-pale)', borderRadius: 10 }}>
              <p style={{ color: 'var(--teal-dark)', fontWeight: 600, fontSize: '0.9rem' }}>
                🚚 Estimated delivery: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '2–3 business days'}
              </p>
              <p style={{ color: 'var(--teal-mid)', fontSize: '0.82rem', marginTop: 4 }}>Free delivery to {order.shippingAddress?.city}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/account" className="btn btn-teal">View My Orders</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>

        <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: 24 }}>
          A confirmation email will be sent to your registered address.
          <br />Questions? Call us on <strong>01865 777836</strong>
        </p>
      </div>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
