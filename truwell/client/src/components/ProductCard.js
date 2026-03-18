import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const categoryColors = {
    'otc': { bg: 'var(--teal-pale)', color: 'var(--teal-dark)' },
    'vitamins': { bg: '#FFF8E1', color: '#F57F17' },
    'skincare': { bg: '#FCE4EC', color: '#C62828' },
    'first-aid': { bg: '#E8F5E9', color: '#2E7D32' },
    'travel-health': { bg: '#E3F2FD', color: '#1565C0' },
    'prescription': { bg: '#EDE7F6', color: '#4527A0' },
    'baby': { bg: '#FFF3E0', color: '#E65100' },
    'personal-care': { bg: 'var(--orange-pale)', color: 'var(--orange-dark)' },
  };
  const catStyle = categoryColors[product.category] || categoryColors.otc;

  return (
    <Link to={`/shop/${product._id}`}>
      <div className="card" style={{ cursor: 'pointer', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--gray-50)' }}>
          <img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          {discount && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--orange)', color: 'white',
              padding: '4px 10px', borderRadius: 6,
              fontSize: '0.78rem', fontWeight: 700
            }}>-{discount}%</div>
          )}
          {product.requiresPrescription && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'var(--teal-dark)', color: 'white',
              padding: '4px 10px', borderRadius: 6,
              fontSize: '0.75rem', fontWeight: 600
            }}>Rx</div>
          )}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '1.1rem'
            }}>Out of Stock</div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ ...catStyle, padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: 10 }}>
            {product.category.replace(/-/g, ' ').toUpperCase()}
          </span>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: 6, lineHeight: 1.4, flex: 1 }}>
            {product.name}
          </h3>
          {product.brand && (
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-400)', marginBottom: 8 }}>{product.brand}</p>
          )}
          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color: s <= Math.round(product.ratings.average) ? '#F59E0B' : 'var(--gray-200)', fontSize: '0.85rem' }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>({product.ratings.count})</span>
            </div>
          )}
          {/* Price & Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--teal-dark)' }}>£{product.price.toFixed(2)}</span>
              {product.comparePrice && (
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)', textDecoration: 'line-through', marginLeft: 6 }}>£{product.comparePrice.toFixed(2)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-sm btn-primary"
              style={{ padding: '8px 14px' }}
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
