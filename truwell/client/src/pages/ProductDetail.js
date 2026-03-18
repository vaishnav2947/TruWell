import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    productsAPI.getOne(id)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to leave a review'); return; }
    setSubmitting(true);
    try {
      const res = await productsAPI.addReview(id, reviewForm);
      setProduct(res.data);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!product) return null;

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100) : null;

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--gray-100)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', gap: 8, fontSize: '0.875rem', color: 'var(--gray-500)', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--gray-400)' }}>Home</Link>
          <span>›</span>
          <Link to="/shop" style={{ color: 'var(--gray-400)' }}>Shop</Link>
          <span>›</span>
          <span style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          {/* Image */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              background: 'var(--gray-50)', position: 'relative',
              aspectRatio: '1 / 1',
            }}>
              <img
                src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {discount && (
                <div style={{
                  position: 'absolute', top: 20, left: 20,
                  background: 'var(--orange)', color: 'white',
                  padding: '6px 14px', borderRadius: 8,
                  fontWeight: 700, fontSize: '0.9rem'
                }}>SAVE {discount}%</div>
              )}
              {product.requiresPrescription && (
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  background: 'var(--teal-dark)', color: 'white',
                  padding: '6px 14px', borderRadius: 8,
                  fontWeight: 700, fontSize: '0.9rem'
                }}>Prescription Required</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span className="badge badge-teal" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {product.category.replace(/-/g, ' ')}
              </span>
              {product.stock > 0 ? (
                <span className="badge badge-green">✓ In Stock ({product.stock} left)</span>
              ) : (
                <span className="badge badge-gray">Out of Stock</span>
              )}
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: 'var(--gray-800)', marginBottom: 8, lineHeight: 1.2 }}>
              {product.name}
            </h1>
            {product.brand && (
              <p style={{ color: 'var(--gray-400)', marginBottom: 16, fontSize: '0.95rem' }}>by {product.brand}</p>
            )}

            {/* Rating */}
            {product.ratings?.count > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: s <= Math.round(product.ratings.average) ? '#F59E0B' : 'var(--gray-200)', fontSize: '1.1rem' }}>★</span>
                  ))}
                </div>
                <span style={{ fontWeight: 700, color: 'var(--gray-700)' }}>{product.ratings.average.toFixed(1)}</span>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>({product.ratings.count} reviews)</span>
              </div>
            )}

            <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, fontSize: '1.02rem', marginBottom: 28 }}>
              {product.shortDesc || product.description}
            </p>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 32 }}>
              <span style={{ fontSize: '2.6rem', fontWeight: 700, color: 'var(--teal-dark)', fontFamily: 'Playfair Display, serif' }}>
                £{product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span style={{ fontSize: '1.2rem', color: 'var(--gray-400)', textDecoration: 'line-through' }}>
                  £{product.comparePrice.toFixed(2)}
                </span>
              )}
              {discount && (
                <span style={{ background: 'var(--orange-pale)', color: 'var(--orange-dark)', padding: '4px 10px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 700 }}>
                  Save £{(product.comparePrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {!product.requiresPrescription && product.stock > 0 && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)', overflow: 'hidden'
                }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                    width: 44, height: 48, border: 'none', background: 'var(--gray-50)',
                    cursor: 'pointer', fontSize: '1.2rem', color: 'var(--gray-700)',
                    borderRight: '1px solid var(--gray-200)'
                  }}>−</button>
                  <span style={{ width: 52, textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{
                    width: 44, height: 48, border: 'none', background: 'var(--gray-50)',
                    cursor: 'pointer', fontSize: '1.2rem', color: 'var(--gray-700)',
                    borderLeft: '1px solid var(--gray-200)'
                  }}>+</button>
                </div>
                <button onClick={handleAddToCart} className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
                  🛒 Add to Cart
                </button>
              </div>
            )}

            {product.requiresPrescription && (
              <div style={{ background: 'var(--teal-pale)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <p style={{ color: 'var(--teal-dark)', fontWeight: 600, marginBottom: 8 }}>
                  💊 Prescription Required
                </p>
                <p style={{ color: 'var(--teal-mid)', fontSize: '0.9rem', marginBottom: 16 }}>
                  This medicine requires a valid prescription. Book a consultation or upload your existing prescription.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to="/appointments?service=pharmacy-first" className="btn btn-teal btn-sm">Book Consultation</Link>
                  <button className="btn btn-outline btn-sm">Upload Prescription</button>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 20, borderTop: '1px solid var(--gray-100)' }}>
              {[
                { icon: '🚚', text: 'Free UK Delivery' },
                { icon: '🔒', text: 'Secure Checkout' },
                { icon: '↩️', text: 'Easy Returns' },
                { icon: '🏥', text: 'NHS Registered' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-600)', fontSize: '0.85rem' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Dosage / Reviews */}
        <div style={{ marginTop: 64 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--gray-100)', marginBottom: 40 }}>
            {[
              { id: 'description', label: 'Description' },
              { id: 'dosage', label: 'Dosage & Usage' },
              { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: '14px 28px', border: 'none', background: 'none', cursor: 'pointer',
                fontWeight: tab === id ? 700 : 400, fontSize: '0.95rem',
                color: tab === id ? 'var(--teal-dark)' : 'var(--gray-500)',
                borderBottom: tab === id ? '3px solid var(--teal-dark)' : '3px solid transparent',
                marginBottom: -2, transition: 'var(--transition)',
              }}>{label}</button>
            ))}
          </div>

          {tab === 'description' && (
            <div style={{ maxWidth: 760 }}>
              <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '1.02rem', marginBottom: 24 }}>
                {product.description}
              </p>
              {product.ingredients?.length > 0 && (
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--gray-700)' }}>Active Ingredients</h4>
                  <ul style={{ paddingLeft: 20, color: 'var(--gray-600)', lineHeight: 2 }}>
                    {product.ingredients.map(i => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              )}
              {product.warnings?.length > 0 && (
                <div style={{ marginTop: 24, background: '#FFF8E1', borderRadius: 12, padding: 20, borderLeft: '4px solid #F59E0B' }}>
                  <h4 style={{ color: '#92400E', marginBottom: 12, fontWeight: 700 }}>⚠️ Warnings</h4>
                  <ul style={{ paddingLeft: 20, color: '#92400E', lineHeight: 1.8, fontSize: '0.9rem' }}>
                    {product.warnings.map(w => <li key={w}>{w}</li>)}
                  </ul>
                </div>
              )}
              <div style={{ marginTop: 24, background: 'var(--teal-pale)', borderRadius: 12, padding: 20 }}>
                <p style={{ color: 'var(--teal-dark)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <strong>🚚 Delivery:</strong> {product.deliveryInfo || 'Free UK delivery in 2–3 business days'}
                </p>
              </div>
            </div>
          )}

          {tab === 'dosage' && (
            <div style={{ maxWidth: 760 }}>
              {product.dosage ? (
                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
                  <h4 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Recommended Dosage</h4>
                  <p style={{ color: 'var(--gray-700)', lineHeight: 1.8 }}>{product.dosage}</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
                  <p style={{ marginBottom: 16 }}>Dosage information not available online.</p>
                  <p>Please consult our pharmacist for guidance.</p>
                  <Link to="/appointments" className="btn btn-teal" style={{ marginTop: 20, display: 'inline-flex' }}>
                    Book Free Consultation
                  </Link>
                </div>
              )}
            </div>
          )}

          {tab === 'reviews' && (
            <div style={{ maxWidth: 760 }}>
              {/* Write a review */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow-sm)', marginBottom: 32 }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: 20 }}>Leave a Review</h4>
                {user ? (
                  <form onSubmit={handleReview}>
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[1,2,3,4,5].map(s => (
                          <button type="button" key={s} onClick={() => setReviewForm(f => ({ ...f, rating: s }))} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '1.8rem', color: s <= reviewForm.rating ? '#F59E0B' : 'var(--gray-200)',
                            transition: 'var(--transition)', padding: '4px 2px'
                          }}>★</button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Review</label>
                      <textarea className="form-control" rows={4} placeholder="Share your experience with this product..."
                        value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} required />
                    </div>
                    <button type="submit" disabled={submitting} className="btn btn-teal">
                      {submitting ? 'Submitting...' : '✓ Submit Review'}
                    </button>
                  </form>
                ) : (
                  <p style={{ color: 'var(--gray-500)' }}>
                    <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 600 }}>Login</Link> to leave a review.
                  </p>
                )}
              </div>

              {/* Existing reviews */}
              {product.reviews?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)' }}>
                  No reviews yet. Be the first to review this product!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {product.reviews?.map((rev, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                            {rev.userName?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{rev.userName}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ color: s <= rev.rating ? '#F59E0B' : 'var(--gray-200)', fontSize: '0.95rem' }}>★</span>
                          ))}
                        </div>
                      </div>
                      <p style={{ color: 'var(--gray-700)', lineHeight: 1.6 }}>{rev.comment}</p>
                      <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem', marginTop: 8 }}>
                        {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
