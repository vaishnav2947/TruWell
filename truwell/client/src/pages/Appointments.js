import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { servicesAPI, appointmentsAPI } from '../api';
import { toast } from 'react-toastify';

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];

export default function Appointments() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [step, setStep] = useState(1);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    serviceType: searchParams.get('service') || '',
    date: '', timeSlot: '', notes: '', isNHS: false,
  });

  useEffect(() => {
    servicesAPI.getAll().then(res => {
      setServices(res.data);
      if (searchParams.get('type') === 'nhs') {
        const first = res.data.find(s => s.type === 'nhs');
        if (first) setForm(f => ({ ...f, serviceType: first.id, isNHS: true }));
      }
    });
  }, [searchParams]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectedService = services.find(s => s.id === form.serviceType);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.serviceType || !form.date || !form.timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await appointmentsAPI.book({ ...form, isNHS: selectedService?.type === 'nhs' });
      setBooked(true);
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];
  // Get day of week for selected date
  const selectedDay = form.date ? new Date(form.date).getDay() : null;
  const isWeekend = selectedDay === 0 || selectedDay === 6;

  if (booked) return (
    <div style={{ textAlign: 'center', padding: '100px 24px', maxWidth: 500, margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: 24 }}>✅</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--teal-dark)', marginBottom: 12 }}>
        Appointment Booked!
      </h2>
      <p style={{ color: 'var(--gray-600)', marginBottom: 8 }}>
        Thank you, <strong>{form.name}</strong>! Your appointment has been received.
      </p>
      <div style={{ background: 'var(--teal-pale)', borderRadius: 'var(--radius-lg)', padding: 24, margin: '24px 0', textAlign: 'left' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Service', selectedService?.name],
            ['Date', form.date],
            ['Time', form.timeSlot],
            ['Confirmation to', form.email],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{label}</span>
              <span style={{ fontWeight: 600, color: 'var(--teal-dark)', fontSize: '0.9rem' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 24 }}>
        📍 6A Courtland Road, Rosehill, Oxford, OX4 4JA
      </p>
      <button onClick={() => { setBooked(false); setStep(1); setForm(f => ({ ...f, date: '', timeSlot: '' })); }} className="btn btn-teal">
        Book Another Appointment
      </button>
    </div>
  );

  return (
    <div className="page-enter">
      <div style={{ background: 'linear-gradient(135deg, var(--teal-dark), var(--teal-mid))', padding: '80px 0' }}>
        <div className="container">
          <span className="badge badge-orange" style={{ marginBottom: 16 }}>Free & Confidential</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: 'white', marginBottom: 12 }}>
            Book an Appointment
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}>
            Same-day appointments available · Mon–Fri, 9:00–18:30
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40 }}>
          {/* Form */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 36, boxShadow: 'var(--shadow-sm)' }}>
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 36, background: 'var(--gray-50)', borderRadius: 12, padding: 4 }}>
              {['Select Service', 'Your Details', 'Choose Time'].map((s, i) => (
                <button key={s} onClick={() => { if (i + 1 < step || (i + 1 === step)) setStep(i + 1); }} style={{
                  flex: 1, padding: '10px 8px', border: 'none', borderRadius: 10,
                  background: step === i + 1 ? 'white' : 'transparent',
                  fontWeight: step === i + 1 ? 600 : 400,
                  color: step === i + 1 ? 'var(--teal-dark)' : 'var(--gray-500)',
                  cursor: 'pointer', fontSize: '0.85rem',
                  boxShadow: step === i + 1 ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition)',
                }}>{i + 1}. {s}</button>
              ))}
            </div>

            {/* Step 1: Service */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 24 }}>Select a Service</h2>
                {['nhs', 'private'].map(type => (
                  <div key={type} style={{ marginBottom: 28 }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: type === 'nhs' ? 'var(--teal-dark)' : 'var(--orange)', marginBottom: 12 }}>
                      {type === 'nhs' ? '🏥 NHS Free Services' : '🩺 Private Consultations'}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {services.filter(s => s.type === type).map(s => (
                        <button key={s.id} onClick={() => update('serviceType', s.id)} style={{
                          padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                          border: `2px solid ${form.serviceType === s.id ? (type === 'nhs' ? 'var(--teal-dark)' : 'var(--orange)') : 'var(--gray-100)'}`,
                          background: form.serviceType === s.id ? (type === 'nhs' ? 'var(--teal-pale)' : 'var(--orange-pale)') : 'white',
                          textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, transition: 'var(--transition)'
                        }}>
                          <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--gray-800)', lineHeight: 1.3 }}>{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={() => { if (!form.serviceType) { toast.error('Please select a service'); return; } setStep(2); }} className="btn btn-primary btn-lg">
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 24 }}>Your Details</h2>
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'John Smith', type: 'text' },
                  { label: 'Email Address', key: 'email', placeholder: 'john@example.com', type: 'email' },
                  { label: 'Phone Number', key: 'phone', placeholder: '07700 000000', type: 'tel' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label} <span style={{ color: 'var(--orange)' }}>*</span></label>
                    <input className="form-control" type={type} placeholder={placeholder} value={form[key]} onChange={e => update(key, e.target.value)} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Additional Notes (optional)</label>
                  <textarea className="form-control" rows={3} placeholder="Any relevant medical info or special requirements..." value={form.notes} onChange={e => update('notes', e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
                  <button onClick={() => { if (!form.name || !form.email || !form.phone) { toast.error('Please fill required fields'); return; } setStep(3); }} className="btn btn-primary btn-lg">
                    Choose Time →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 24 }}>Choose Date & Time</h2>
                <div className="form-group">
                  <label className="form-label">Select Date <span style={{ color: 'var(--orange)' }}>*</span></label>
                  <input className="form-control" type="date" min={today} value={form.date} onChange={e => update('date', e.target.value)} />
                  {isWeekend && <p style={{ color: 'var(--orange)', fontSize: '0.82rem', marginTop: 6 }}>⚠️ We are closed on weekends. Please choose a weekday.</p>}
                </div>
                {form.date && !isWeekend && (
                  <div className="form-group">
                    <label className="form-label">Select Time Slot <span style={{ color: 'var(--orange)' }}>*</span></label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {TIME_SLOTS.map(slot => (
                        <button key={slot} onClick={() => update('timeSlot', slot)} style={{
                          padding: '10px 8px', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem',
                          border: `2px solid ${form.timeSlot === slot ? 'var(--teal-dark)' : 'var(--gray-200)'}`,
                          background: form.timeSlot === slot ? 'var(--teal-dark)' : 'white',
                          color: form.timeSlot === slot ? 'white' : 'var(--gray-700)',
                          fontWeight: form.timeSlot === slot ? 600 : 400,
                          transition: 'var(--transition)',
                        }}>{slot}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(2)} className="btn btn-outline">← Back</button>
                  <button onClick={handleSubmit} disabled={loading || isWeekend} className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
                    {loading ? 'Booking...' : '✓ Confirm Appointment'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <div>
            {selectedService && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--gray-700)' }}>Selected Service</h3>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '2rem' }}>{selectedService.icon}</span>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: 4, color: 'var(--gray-800)' }}>{selectedService.name}</h4>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: 8 }}>{selectedService.description}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className={selectedService.type === 'nhs' ? 'badge badge-teal' : 'badge badge-orange'}>{selectedService.type === 'nhs' ? 'FREE NHS' : 'PRIVATE'}</span>
                      <span className="badge badge-gray">⏱ {selectedService.duration} min</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: 'var(--teal-pale)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ color: 'var(--teal-dark)', fontWeight: 700, marginBottom: 16 }}>📍 Pharmacy Info</h3>
              {[
                { icon: '📍', text: '6A Courtland Road, Rosehill, Oxford, OX4 4JA' },
                { icon: '⏰', text: 'Mon–Fri: 9:00–18:30' },
                { icon: '📞', text: '01865 777836' },
                { icon: '✉️', text: 'info@truwellpharmacy.com' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12, color: 'var(--teal-dark)', fontSize: '0.9rem' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
