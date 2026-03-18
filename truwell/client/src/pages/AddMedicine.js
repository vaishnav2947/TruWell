import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api';
import { toast } from 'react-toastify';
import TruwellLogo from '../components/TruwellLogo';

const CATEGORIES = [
  { value: 'otc',           label: 'Over The Counter',     icon: '💊' },
  { value: 'prescription',  label: 'Prescription (Rx)',    icon: '📋' },
  { value: 'vitamins',      label: 'Vitamins & Supplements',icon: '🌿' },
  { value: 'skincare',      label: 'Skincare',             icon: '✨' },
  { value: 'first-aid',     label: 'First Aid',            icon: '🩺' },
  { value: 'travel-health', label: 'Travel Health',        icon: '✈️' },
  { value: 'baby',          label: 'Baby & Child',         icon: '👶' },
  { value: 'personal-care', label: 'Personal Care',        icon: '🛁' },
];

const STATUS_COLORS = {
  pending:    { bg: '#FFF8E1', color: '#F57F17' },
  confirmed:  { bg: 'var(--teal-pale)', color: 'var(--teal-dark)' },
  processing: { bg: '#E3F2FD', color: '#1565C0' },
  dispatched: { bg: '#E8F5E9', color: '#2E7D32' },
  delivered:  { bg: '#E8F5E9', color: '#1B5E20' },
  cancelled:  { bg: 'var(--gray-100)', color: 'var(--gray-600)' },
};

const EMPTY_FORM = {
  name: '', shortDesc: '', description: '', price: '',
  comparePrice: '', category: 'otc', brand: '', sku: '',
  stock: '', requiresPrescription: false,
  imageUrl: '', dosage: '', tags: '', warnings: '', ingredients: '',
  isFeatured: false, isActive: true, deliveryInfo: 'Free UK delivery in 2–3 business days',
};

/* ─── tiny reusable field ─── */
function Field({ label, required, hint, children }) {
  return (
    <div className="form-group">
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        {required && <span style={{ color: 'var(--orange)', fontSize: '0.8rem' }}>*</span>}
        {hint && <span style={{ color: 'var(--gray-400)', fontSize: '0.78rem', fontWeight: 400 }}>— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

/* ─── star rating display ─── */
function Stars({ n = 0 }) {
  return (
    <span>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= n ? '#F59E0B' : 'var(--gray-200)', fontSize: '0.85rem' }}>★</span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function AddMedicine() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  /* ── guard: admins / pharmacists only ── */
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin' && user.role !== 'pharmacist') {
      toast.error('Admin access required'); navigate('/');
    }
  }, [user, navigate]);

  /* ── state ── */
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editId,   setEditId]   = useState(null);
  const [tab,      setTab]      = useState('add');   // 'add' | 'manage'
  const [search,   setSearch]   = useState('');
  const [filterCat,setFilterCat]= useState('');
  const [deleting, setDeleting] = useState(null);
  const [seedBusy, setSeedBusy] = useState(false);

  /* ── fetch products ── */
  const fetchProducts = useCallback(() => {
    setLoading(true);
    productsAPI.getAll({ limit: 100 })
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── helpers ── */
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const reset = () => { setForm(EMPTY_FORM); setEditId(null); };

  const startEdit = (p) => {
    setForm({
      name:                p.name || '',
      shortDesc:           p.shortDesc || '',
      description:         p.description || '',
      price:               String(p.price ?? ''),
      comparePrice:        String(p.comparePrice ?? ''),
      category:            p.category || 'otc',
      brand:               p.brand || '',
      sku:                 p.sku || '',
      stock:               String(p.stock ?? ''),
      requiresPrescription:p.requiresPrescription || false,
      imageUrl:            p.images?.[0]?.url || '',
      dosage:              p.dosage || '',
      tags:               (p.tags || []).join(', '),
      warnings:           (p.warnings || []).join('\n'),
      ingredients:        (p.ingredients || []).join(', '),
      isFeatured:          p.isFeatured || false,
      isActive:            p.isActive !== false,
      deliveryInfo:        p.deliveryInfo || 'Free UK delivery in 2–3 business days',
    });
    setEditId(p._id);
    setTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.description) {
      toast.error('Please fill in all required fields'); return;
    }
    setSaving(true);
    try {
      const payload = {
        name:                form.name.trim(),
        shortDesc:           form.shortDesc.trim(),
        description:         form.description.trim(),
        price:               parseFloat(form.price),
        comparePrice:        form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        category:            form.category,
        brand:               form.brand.trim(),
        sku:                 form.sku.trim(),
        stock:               parseInt(form.stock) || 0,
        requiresPrescription:form.requiresPrescription,
        images:              form.imageUrl ? [{ url: form.imageUrl.trim(), alt: form.name }] : [],
        dosage:              form.dosage.trim(),
        tags:                form.tags.split(',').map(t => t.trim()).filter(Boolean),
        warnings:            form.warnings.split('\n').map(w => w.trim()).filter(Boolean),
        ingredients:         form.ingredients.split(',').map(i => i.trim()).filter(Boolean),
        isFeatured:          form.isFeatured,
        isActive:            form.isActive,
        deliveryInfo:        form.deliveryInfo,
      };

      if (editId) {
        await productsAPI.update(editId, payload);
        toast.success(`✓ "${form.name}" updated successfully`);
      } else {
        await productsAPI.create(payload);
        toast.success(`✓ "${form.name}" added to the pharmacy`);
      }
      reset();
      fetchProducts();
      setTab('manage');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ── */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the pharmacy?`)) return;
    setDeleting(id);
    try {
      await productsAPI.update(id, { isActive: false });
      toast.success(`"${name}" removed`);
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  /* ── seed ── */
  const handleSeed = async () => {
    setSeedBusy(true);
    try {
      await productsAPI.seed();
      toast.success('8 demo products loaded!');
      fetchProducts();
    } catch { toast.error('Seed failed'); }
    finally { setSeedBusy(false); }
  };

  /* ── filtered product list ── */
  const visibleProducts = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || '').toLowerCase().includes(search.toLowerCase());
    const matchCat    = !filterCat || p.category === filterCat;
    return matchSearch && matchCat;
  });

  /* ── live card preview ── */
  const catObj = CATEGORIES.find(c => c.value === form.category);
  const discount = form.price && form.comparePrice
    ? Math.round((1 - parseFloat(form.price) / parseFloat(form.comparePrice)) * 100)
    : null;

  if (!user) return null;

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="page-enter">

      {/* ── Page Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--teal-dark) 0%, var(--teal-mid) 60%, #2a7a6a 100%)',
        padding: '52px 0 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:200, height:200, borderRadius:'50%', background:'rgba(232,82,26,0.08)' }} />

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
            <Link to="/" style={{ opacity:0.7, color:'white', fontSize:'0.85rem' }}>← Back to store</Link>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16, paddingBottom:0 }}>
            <div>
              <div className="badge badge-orange" style={{ marginBottom:12, fontSize:'0.78rem' }}>
                👤 {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
              </div>
              <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'2.6rem', color:'white', marginBottom:8 }}>
                Medicine Management
              </h1>
              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'1rem' }}>
                Add, edit or remove products available in the Truwell online pharmacy
              </p>
            </div>
            <div style={{ display:'flex', gap:12, paddingBottom:4 }}>
              <button
                onClick={handleSeed} disabled={seedBusy}
                className="btn" style={{ background:'rgba(255,255,255,0.15)', color:'white', border:'1.5px solid rgba(255,255,255,0.3)', backdropFilter:'blur(8px)' }}
              >
                {seedBusy ? 'Loading...' : '🧪 Load Demo Products'}
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display:'flex', gap:0, marginTop:28 }}>
            {[['add', editId ? '✏️ Edit Medicine' : '➕ Add Medicine'], ['manage', `📦 Manage (${products.length})`]].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); if (id === 'add' && !editId) reset(); }} style={{
                padding:'14px 28px', border:'none', background:'none', cursor:'pointer',
                fontWeight: tab===id ? 700 : 400, fontSize:'0.95rem',
                color: tab===id ? 'white' : 'rgba(255,255,255,0.6)',
                borderBottom: tab===id ? '3px solid var(--orange)' : '3px solid transparent',
                transition:'var(--transition)',
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════ TAB: ADD / EDIT ════════════ */}
      {tab === 'add' && (
        <div className="container" style={{ padding:'48px 24px' }}>
          {editId && (
            <div style={{ background:'#FFF8E1', border:'1.5px solid #F59E0B', borderRadius:12, padding:'14px 20px', marginBottom:28, display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:'1.2rem' }}>✏️</span>
              <span style={{ color:'#92400E', fontWeight:500 }}>Editing existing product — changes will update the live store.</span>
              <button onClick={reset} style={{ marginLeft:'auto', background:'none', border:'none', color:'#92400E', cursor:'pointer', fontWeight:600, fontSize:'0.9rem' }}>✕ Cancel edit</button>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:40, alignItems:'start' }}>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit}>

              {/* Section: Basic Info */}
              <SectionCard title="💊 Basic Information" subtitle="Core product details shown to customers">
                <Field label="Medicine / Product Name" required>
                  <input className="form-control" placeholder="e.g. Paracetamol 500mg Tablets"
                    value={form.name} onChange={e => up('name', e.target.value)} required />
                </Field>
                <Field label="Short Description" hint="shown on product cards">
                  <input className="form-control" placeholder="e.g. Fast-acting pain & fever relief"
                    value={form.shortDesc} onChange={e => up('shortDesc', e.target.value)} />
                </Field>
                <Field label="Full Description" required>
                  <textarea className="form-control" rows={4}
                    placeholder="Detailed description of the medicine, its uses and benefits..."
                    value={form.description} onChange={e => up('description', e.target.value)} required />
                </Field>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <Field label="Brand / Manufacturer">
                    <input className="form-control" placeholder="e.g. Bayer, GSK, Boots Own"
                      value={form.brand} onChange={e => up('brand', e.target.value)} />
                  </Field>
                  <Field label="SKU / Product Code">
                    <input className="form-control" placeholder="e.g. TRW-OTC-001"
                      value={form.sku} onChange={e => up('sku', e.target.value)} />
                  </Field>
                </div>
              </SectionCard>

              {/* Section: Category & Status */}
              <SectionCard title="🏷️ Category & Status" subtitle="How this product is classified and displayed">
                <Field label="Category" required>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
                    {CATEGORIES.map(cat => (
                      <button key={cat.value} type="button" onClick={() => up('category', cat.value)} style={{
                        padding:'10px 8px', borderRadius:10, cursor:'pointer', textAlign:'center',
                        border:`2px solid ${form.category===cat.value ? 'var(--teal-dark)' : 'var(--gray-200)'}`,
                        background: form.category===cat.value ? 'var(--teal-pale)' : 'white',
                        transition:'var(--transition)',
                      }}>
                        <div style={{ fontSize:'1.3rem', marginBottom:4 }}>{cat.icon}</div>
                        <div style={{ fontSize:'0.72rem', fontWeight:600, color: form.category===cat.value ? 'var(--teal-dark)' : 'var(--gray-600)', lineHeight:1.3 }}>
                          {cat.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </Field>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:8 }}>
                  {/* Prescription toggle */}
                  <ToggleField
                    label="Requires Prescription"
                    icon="📋" color="var(--teal-dark)" paleBg="var(--teal-pale)"
                    checked={form.requiresPrescription}
                    onChange={v => up('requiresPrescription', v)}
                    hint="Customers must upload a valid Rx"
                  />
                  {/* Featured toggle */}
                  <ToggleField
                    label="Featured Product"
                    icon="⭐" color="var(--orange)" paleBg="var(--orange-pale)"
                    checked={form.isFeatured}
                    onChange={v => up('isFeatured', v)}
                    hint="Shown on the homepage"
                  />
                  {/* Active toggle */}
                  <ToggleField
                    label="Active / Visible"
                    icon="👁️" color="#2E7D32" paleBg="#E8F5E9"
                    checked={form.isActive}
                    onChange={v => up('isActive', v)}
                    hint="Hidden from customers if off"
                  />
                </div>
              </SectionCard>

              {/* Section: Pricing & Stock */}
              <SectionCard title="💷 Pricing & Stock" subtitle="Set price, discount, and inventory levels">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
                  <Field label="Sale Price (£)" required>
                    <input className="form-control" type="number" step="0.01" min="0" placeholder="0.00"
                      value={form.price} onChange={e => up('price', e.target.value)} required />
                  </Field>
                  <Field label="Compare-at Price (£)" hint="original RRP">
                    <input className="form-control" type="number" step="0.01" min="0" placeholder="0.00"
                      value={form.comparePrice} onChange={e => up('comparePrice', e.target.value)} />
                  </Field>
                  <Field label="Stock Quantity" required>
                    <input className="form-control" type="number" min="0" placeholder="0"
                      value={form.stock} onChange={e => up('stock', e.target.value)} />
                  </Field>
                </div>
                {discount !== null && discount > 0 && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'var(--orange-pale)', borderRadius:8, marginTop:4 }}>
                    <span style={{ fontSize:'1.1rem' }}>🏷️</span>
                    <span style={{ color:'var(--orange-dark)', fontWeight:600, fontSize:'0.9rem' }}>
                      Customer saves {discount}% — showing £{(parseFloat(form.comparePrice) - parseFloat(form.price)).toFixed(2)} off
                    </span>
                  </div>
                )}
              </SectionCard>

              {/* Section: Image */}
              <SectionCard title="🖼️ Product Image" subtitle="Paste an image URL or use one from Unsplash/your CDN">
                <Field label="Image URL">
                  <input className="form-control" type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={form.imageUrl} onChange={e => up('imageUrl', e.target.value)} />
                </Field>
                {form.imageUrl && (
                  <div style={{ marginTop:12, borderRadius:12, overflow:'hidden', height:160, background:'var(--gray-50)' }}>
                    <img src={form.imageUrl} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      onError={e => { e.target.style.display='none'; }} />
                  </div>
                )}
                <p style={{ fontSize:'0.8rem', color:'var(--gray-400)', marginTop:8 }}>
                  Tip: use <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color:'var(--teal-mid)' }}>unsplash.com</a> free pharmacy/medicine images.
                  Right-click → Copy image address.
                </p>
              </SectionCard>

              {/* Section: Clinical Details */}
              <SectionCard title="🩺 Clinical Details" subtitle="Dosage instructions, ingredients, warnings">
                <Field label="Dosage Instructions">
                  <textarea className="form-control" rows={3}
                    placeholder="e.g. Adults and children over 12: Take 1–2 tablets every 4–6 hours. Do not exceed 8 tablets in 24 hours."
                    value={form.dosage} onChange={e => up('dosage', e.target.value)} />
                </Field>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <Field label="Active Ingredients" hint="comma-separated">
                    <input className="form-control" placeholder="e.g. Paracetamol 500mg, Caffeine 65mg"
                      value={form.ingredients} onChange={e => up('ingredients', e.target.value)} />
                  </Field>
                  <Field label="Search Tags" hint="comma-separated">
                    <input className="form-control" placeholder="e.g. pain relief, fever, headache"
                      value={form.tags} onChange={e => up('tags', e.target.value)} />
                  </Field>
                </div>
                <Field label="Warnings" hint="one per line">
                  <textarea className="form-control" rows={3}
                    placeholder={"Do not exceed stated dose\nKeep out of reach of children\nNot suitable for under 12s"}
                    value={form.warnings} onChange={e => up('warnings', e.target.value)} />
                </Field>
                <Field label="Delivery Info">
                  <input className="form-control" value={form.deliveryInfo} onChange={e => up('deliveryInfo', e.target.value)} />
                </Field>
              </SectionCard>

              {/* Submit */}
              <div style={{ display:'flex', gap:12, marginTop:8 }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ flex:1, justifyContent:'center' }}>
                  {saving
                    ? (editId ? 'Updating...' : 'Adding...')
                    : (editId ? '✓ Update Medicine' : '➕ Add Medicine to Store')}
                </button>
                {editId && (
                  <button type="button" onClick={reset} className="btn btn-outline btn-lg">Cancel</button>
                )}
              </div>
            </form>

            {/* ── LIVE PREVIEW ── */}
            <div style={{ position:'sticky', top:90 }}>
              <div style={{ background:'var(--gray-50)', borderRadius:'var(--radius-xl)', padding:24, border:'1.5px dashed var(--gray-200)' }}>
                <p style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>
                  Live Card Preview
                </p>

                {/* Preview card */}
                <div style={{ background:'white', borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
                  <div style={{ height:180, background:'var(--gray-100)', position:'relative', overflow:'hidden' }}>
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="preview"
                        style={{ width:'100%', height:'100%', objectFit:'cover' }}
                        onError={e => { e.target.style.display='none'; }} />
                    ) : (
                      <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
                        <span style={{ fontSize:'2.5rem' }}>{catObj?.icon || '💊'}</span>
                        <span style={{ fontSize:'0.8rem', color:'var(--gray-400)' }}>No image yet</span>
                      </div>
                    )}
                    {discount && discount > 0 && (
                      <div style={{ position:'absolute', top:10, left:10, background:'var(--orange)', color:'white', padding:'3px 10px', borderRadius:6, fontSize:'0.75rem', fontWeight:700 }}>
                        -{discount}%
                      </div>
                    )}
                    {form.requiresPrescription && (
                      <div style={{ position:'absolute', top:10, right:10, background:'var(--teal-dark)', color:'white', padding:'3px 10px', borderRadius:6, fontSize:'0.72rem', fontWeight:600 }}>Rx</div>
                    )}
                    {!form.isActive && (
                      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700 }}>Hidden</div>
                    )}
                  </div>
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ display:'inline-block', padding:'2px 8px', borderRadius:5, fontSize:'0.7rem', fontWeight:700, background:'var(--teal-pale)', color:'var(--teal-dark)', marginBottom:8 }}>
                      {(catObj?.label || 'Category').toUpperCase()}
                    </div>
                    <h3 style={{ fontSize:'0.95rem', fontWeight:600, marginBottom:4, color:'var(--gray-800)', lineHeight:1.3 }}>
                      {form.name || 'Product Name'}
                    </h3>
                    {form.shortDesc && (
                      <p style={{ fontSize:'0.8rem', color:'var(--gray-500)', marginBottom:8 }}>{form.shortDesc}</p>
                    )}
                    {form.brand && (
                      <p style={{ fontSize:'0.78rem', color:'var(--gray-400)', marginBottom:8 }}>by {form.brand}</p>
                    )}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
                      <div>
                        <span style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--teal-dark)' }}>
                          {form.price ? `£${parseFloat(form.price).toFixed(2)}` : '£—'}
                        </span>
                        {form.comparePrice && (
                          <span style={{ fontSize:'0.82rem', color:'var(--gray-400)', textDecoration:'line-through', marginLeft:6 }}>
                            £{parseFloat(form.comparePrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="btn btn-sm btn-primary" style={{ pointerEvents:'none', opacity:0.9 }}>+ Add</div>
                    </div>
                  </div>
                </div>

                {/* Stock indicator */}
                <div style={{ marginTop:16, display:'flex', gap:8, flexWrap:'wrap' }}>
                  {form.stock && (
                    <span className={parseInt(form.stock) > 10 ? 'badge badge-green' : parseInt(form.stock) > 0 ? 'badge badge-orange' : 'badge badge-gray'}>
                      {parseInt(form.stock) > 0 ? `${form.stock} in stock` : 'Out of stock'}
                    </span>
                  )}
                  {form.isFeatured && <span className="badge badge-orange">⭐ Featured</span>}
                  {form.requiresPrescription && <span className="badge badge-teal">Rx Required</span>}
                </div>
              </div>

              {/* Checklist */}
              <div style={{ background:'white', borderRadius:'var(--radius-lg)', padding:20, marginTop:16, boxShadow:'var(--shadow-sm)' }}>
                <p style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
                  Completeness
                </p>
                {[
                  { label:'Product name',    done: !!form.name },
                  { label:'Description',     done: !!form.description },
                  { label:'Price set',       done: !!form.price && parseFloat(form.price) > 0 },
                  { label:'Category chosen', done: !!form.category },
                  { label:'Stock entered',   done: !!form.stock },
                  { label:'Image URL',       done: !!form.imageUrl },
                  { label:'Dosage info',     done: !!form.dosage },
                ].map(({ label, done }) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <span style={{ color: done ? '#2E7D32' : 'var(--gray-300)', fontSize:'0.9rem' }}>
                      {done ? '✓' : '○'}
                    </span>
                    <span style={{ fontSize:'0.85rem', color: done ? 'var(--gray-700)' : 'var(--gray-400)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ TAB: MANAGE ════════════ */}
      {tab === 'manage' && (
        <div className="container" style={{ padding:'48px 24px' }}>

          {/* Toolbar */}
          <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ flex:1, minWidth:220, position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)' }}>🔍</span>
              <input className="form-control" placeholder="Search medicines..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft:40 }} />
            </div>
            <select className="form-control" style={{ width:'auto', minWidth:180 }}
              value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
            <button onClick={() => { reset(); setTab('add'); }} className="btn btn-primary">
              ➕ Add New Medicine
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:32 }}>
            {[
              { label:'Total Products', value: products.length, icon:'📦', color:'var(--teal-dark)' },
              { label:'Active',         value: products.filter(p => p.isActive !== false).length, icon:'✅', color:'#2E7D32' },
              { label:'Featured',       value: products.filter(p => p.isFeatured).length, icon:'⭐', color:'var(--orange)' },
              { label:'Rx Products',    value: products.filter(p => p.requiresPrescription).length, icon:'💊', color:'#7B1FA2' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} style={{ background:'white', borderRadius:'var(--radius-lg)', padding:'20px 24px', boxShadow:'var(--shadow-sm)', borderLeft:`4px solid ${color}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:'1.4rem' }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:'1.8rem', fontWeight:700, color, lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--gray-500)', marginTop:2 }}>{label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product table */}
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner" /></div>
          ) : visibleProducts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0', color:'var(--gray-400)' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>📦</div>
              <p style={{ marginBottom:20 }}>No medicines found. Add your first product!</p>
              <button onClick={() => { reset(); setTab('add'); }} className="btn btn-primary">Add Medicine</button>
            </div>
          ) : (
            <div style={{ background:'white', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
              {/* Table header */}
              <div style={{
                display:'grid', gridTemplateColumns:'60px 1fr 120px 80px 80px 80px 140px',
                gap:16, padding:'12px 20px',
                background:'var(--gray-50)', borderBottom:'1.5px solid var(--gray-100)',
                fontSize:'0.78rem', fontWeight:700, color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:'0.06em'
              }}>
                <span>Image</span>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Status</span>
                <span style={{ textAlign:'right' }}>Actions</span>
              </div>

              {/* Rows */}
              {visibleProducts.map((p, idx) => {
                const catObj = CATEGORIES.find(c => c.value === p.category);
                return (
                  <div key={p._id} style={{
                    display:'grid', gridTemplateColumns:'60px 1fr 120px 80px 80px 80px 140px',
                    gap:16, padding:'14px 20px', alignItems:'center',
                    borderBottom: idx < visibleProducts.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    transition:'var(--transition)',
                    background: p.isActive === false ? 'var(--gray-50)' : 'white',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = p.isActive === false ? 'var(--gray-50)' : 'white'}
                  >
                    {/* Image */}
                    <div style={{ width:52, height:52, borderRadius:10, overflow:'hidden', background:'var(--gray-100)', flexShrink:0 }}>
                      {p.images?.[0]?.url ? (
                        <img src={p.images[0].url} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      ) : (
                        <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
                          {catObj?.icon || '💊'}
                        </div>
                      )}
                    </div>

                    {/* Name + meta */}
                    <div>
                      <div style={{ fontWeight:600, color:'var(--gray-800)', fontSize:'0.9rem', marginBottom:2 }}>
                        {p.name}
                        {p.requiresPrescription && <span style={{ marginLeft:6, background:'var(--teal-pale)', color:'var(--teal-dark)', padding:'1px 6px', borderRadius:4, fontSize:'0.7rem', fontWeight:700 }}>Rx</span>}
                        {p.isFeatured && <span style={{ marginLeft:4, color:'#F59E0B', fontSize:'0.85rem' }}>⭐</span>}
                      </div>
                      {p.brand && <div style={{ fontSize:'0.78rem', color:'var(--gray-400)' }}>{p.brand}</div>}
                      {p.ratings?.count > 0 && <Stars n={Math.round(p.ratings.average)} />}
                    </div>

                    {/* Category */}
                    <div style={{ fontSize:'0.8rem', color:'var(--gray-600)' }}>
                      {catObj?.icon} {catObj?.label || p.category}
                    </div>

                    {/* Price */}
                    <div>
                      <div style={{ fontWeight:700, color:'var(--teal-dark)', fontSize:'0.95rem' }}>£{p.price?.toFixed(2)}</div>
                      {p.comparePrice && <div style={{ fontSize:'0.75rem', color:'var(--gray-400)', textDecoration:'line-through' }}>£{p.comparePrice.toFixed(2)}</div>}
                    </div>

                    {/* Stock */}
                    <div>
                      <span style={{
                        fontWeight:600, fontSize:'0.9rem',
                        color: p.stock > 10 ? '#2E7D32' : p.stock > 0 ? '#F57F17' : '#C62828'
                      }}>
                        {p.stock ?? 0}
                      </span>
                      <div style={{ fontSize:'0.72rem', color:'var(--gray-400)' }}>units</div>
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{
                        padding:'3px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:600,
                        background: p.isActive !== false ? '#E8F5E9' : 'var(--gray-100)',
                        color:       p.isActive !== false ? '#2E7D32'  : 'var(--gray-500)',
                      }}>
                        {p.isActive !== false ? '● Active' : '○ Hidden'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                      <Link to={`/shop/${p._id}`} target="_blank"
                        className="btn btn-sm"
                        style={{ background:'var(--gray-100)', color:'var(--gray-600)', boxShadow:'none', padding:'6px 10px' }}
                        title="View in store">
                        👁️
                      </Link>
                      <button onClick={() => startEdit(p)}
                        className="btn btn-sm btn-outline"
                        style={{ padding:'6px 12px' }}
                        title="Edit product">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(p._id, p.name)}
                        disabled={deleting === p._id}
                        className="btn btn-sm"
                        style={{ background:'#FFEBEE', color:'#C62828', boxShadow:'none', padding:'6px 10px', border:'none' }}
                        title="Remove product">
                        {deleting === p._id ? '...' : '🗑️'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Section card wrapper ── */
function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{
      background:'white', borderRadius:'var(--radius-xl)',
      padding:28, boxShadow:'var(--shadow-sm)',
      marginBottom:24, border:'1px solid var(--gray-100)',
    }}>
      <div style={{ marginBottom:20, paddingBottom:16, borderBottom:'1.5px solid var(--gray-100)' }}>
        <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.15rem', color:'var(--gray-800)', marginBottom:4 }}>{title}</h3>
        {subtitle && <p style={{ fontSize:'0.85rem', color:'var(--gray-500)' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ── Toggle field ── */
function ToggleField({ label, icon, color, paleBg, checked, onChange, hint }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{
      display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px',
      borderRadius:12, cursor:'pointer', textAlign:'left',
      border:`2px solid ${checked ? color : 'var(--gray-200)'}`,
      background: checked ? paleBg : 'white',
      transition:'var(--transition)', width:'100%',
    }}>
      <span style={{ fontSize:'1.2rem', marginTop:1 }}>{icon}</span>
      <div>
        <div style={{ fontWeight:600, fontSize:'0.875rem', color: checked ? color : 'var(--gray-700)' }}>{label}</div>
        {hint && <div style={{ fontSize:'0.75rem', color:'var(--gray-400)', marginTop:2 }}>{hint}</div>}
      </div>
      <div style={{ marginLeft:'auto', marginTop:2 }}>
        <div style={{
          width:36, height:20, borderRadius:10, transition:'var(--transition)',
          background: checked ? color : 'var(--gray-200)',
          position:'relative',
        }}>
          <div style={{
            width:16, height:16, borderRadius:'50%', background:'white',
            position:'absolute', top:2,
            left: checked ? 18 : 2,
            transition:'left 0.2s',
            boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
      </div>
    </button>
  );
}
