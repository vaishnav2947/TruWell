import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { value: '', label: 'All Products' },
  { value: 'otc', label: 'Over The Counter' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'vitamins', label: 'Vitamins & Supplements' },
  { value: 'skincare', label: 'Skincare' },
  { value: 'first-aid', label: 'First Aid' },
  { value: 'travel-health', label: 'Travel Health' },
  { value: 'baby', label: 'Baby & Child' },
  { value: 'personal-care', label: 'Personal Care' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchInput, setSearchInput] = useState(search);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    productsAPI.getAll({ category, search, sort, page, limit: 12 })
      .then(res => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value; else delete params[key];
    if (key !== 'page') delete params.page;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ background: 'var(--teal-dark)', padding: '48px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', color: 'white', marginBottom: 8 }}>
            Online Pharmacy Shop
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>
            {total} products · Free UK-wide delivery on all orders
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
          {/* Sidebar */}
          <aside>
            {/* Search */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
              <form onSubmit={handleSearch}>
                <label className="form-label">Search Products</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="form-control"
                    placeholder="e.g. paracetamol..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">🔍</button>
                </div>
              </form>
            </div>

            {/* Categories */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--teal-dark)' }}>Categories</h3>
              {CATEGORIES.map(({ value, label }) => (
                <button key={value} onClick={() => updateParam('category', value)} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px', borderRadius: 8, border: 'none',
                  background: category === value ? 'var(--teal-pale)' : 'transparent',
                  color: category === value ? 'var(--teal-dark)' : 'var(--gray-700)',
                  fontWeight: category === value ? 600 : 400,
                  fontSize: '0.9rem', cursor: 'pointer', transition: 'var(--transition)',
                  marginBottom: 2,
                }}
                  onMouseEnter={e => { if (category !== value) e.target.style.background = 'var(--gray-50)'; }}
                  onMouseLeave={e => { if (category !== value) e.target.style.background = 'transparent'; }}
                >{label}</button>
              ))}
            </div>

            {/* Sort */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: 'var(--teal-dark)' }}>Sort By</h3>
              <select className="form-control" value={sort} onChange={e => updateParam('sort', e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            {/* Active filters */}
            {(category || search) && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Filters:</span>
                {category && (
                  <span className="badge badge-teal" style={{ cursor: 'pointer' }} onClick={() => updateParam('category', '')}>
                    {category} ✕
                  </span>
                )}
                {search && (
                  <span className="badge badge-orange" style={{ cursor: 'pointer' }} onClick={() => { setSearchInput(''); updateParam('search', ''); }}>
                    "{search}" ✕
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                <h3 style={{ marginBottom: 8, color: 'var(--gray-800)' }}>No products found</h3>
                <p style={{ color: 'var(--gray-400)' }}>Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: 20 }}>
                  Showing {products.length} of {total} products
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => updateParam('page', p)} className="btn btn-sm" style={{
                        background: p === page ? 'var(--teal-dark)' : 'white',
                        color: p === page ? 'white' : 'var(--gray-800)',
                        border: '1.5px solid var(--gray-200)',
                        boxShadow: 'none',
                      }}>{p}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
