import React, { useState } from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function Memorial({ services = [] }) {
  const { lang } = useLanguage();
  const isAm = lang === 'am';
  const supabase = createClient();

  const [form, setForm] = useState({
    sponsorName: '',
    departedName: '',
    phone: '',
    email: '',
    preferredDate: '',
    message: '',
    serviceId: '',
    paymentMethod: 'chapa' // 'chapa' or 'bank'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Find selected service to get the price
    const selectedService = services.find(s => s.id === form.serviceId);
    if (!selectedService) {
      setError(isAm ? 'እባክዎን የአገልግሎት አይነት ይምረጡ' : 'Please select a memorial service package.');
      setLoading(false);
      return;
    }

    try {
      if (form.paymentMethod === 'chapa') {
        // 1. Chapa Pay Online flow
        const payload = {
          type: 'memorial',
          serviceId: selectedService.id,
          sponsorName: form.sponsorName,
          departedName: form.departedName,
          phone: form.phone,
          email: form.email || null,
          preferredDate: form.preferredDate,
          message: form.message || null,
          amount: selectedService.price
        };

        const res = await fetch('/api/chapa/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Payment initiation failed');

        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          throw new Error('No checkout URL returned');
        }

      } else {
        // 2. Pay Later (direct insert) flow
        const { error: dbError } = await supabase
          .from('memorial_orders')
          .insert({
            service_id: selectedService.id,
            requester_name: form.sponsorName,
            requester_phone: form.phone,
            requester_email: form.email || null,
            deceased_name: form.departedName,
            preferred_date: form.preferredDate || null,
            amount: selectedService.price,
            payment_status: 'pending'
          });

        if (dbError) throw dbError;
        setSuccess(true);
      }

    } catch (err) {
      console.error('Memorial request error:', err);
      setError(err.message || (isAm ? 'ጥያቄውን ማቅረብ አልተቻለም፡ እባክዎን ቆይተው ይሞክሩ' : 'Failed to submit request. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const sectionTitle = isAm ? 'የፍትሐት እና የጸሎት አገልግሎት' : 'Memorial Services';
  const introText = isAm 
    ? 'ፍትሐት (የመታሰቢያ ጸሎት) ከዚህ ዓለም በሞት ለተለዩ ወገኖች በቤተ ክርስቲያን ሥርዓት መሠረት የሚደረግ የፍትሐትና የምሕረት ጸሎት ነው። እግዚአብሔር ለሟቹ ነፍስ ዕረፍተ መንግሥተ ሰማያትን እንዲሰጥና ለቤተሰቡ መጽናናትን እንዲሰጥ የሚጸለይ የፍቅር አገልግሎት ነው። የፍትሐት ጸሎት ለማስደረግ ከፈለጉ እባክዎ ከታች ያለውን ቅጽ ይሙሉ::'
    : 'Fithat (Memorial Service) is a sacred prayer offered by the Church for the repose of the souls of the departed, asking our Lord to forgive their transgressions and welcome them into His Heavenly Kingdom. It is also a source of comfort and grace for the family. To request a memorial service, please complete the form below.';

  const hasPackages = services && services.length > 0;

  if (success) {
    return (
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '3rem 2rem', background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(15,27,61,0.05)', border: '1px solid rgba(197,160,68,0.15)', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', margin: '0 auto 1.5rem auto', border: '2px solid #bbf7d0', color: '#16a34a' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ margin: 'auto' }}>
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)', fontSize: '1.8rem', marginBottom: '1rem' }}>
          {isAm ? 'ጥያቄዎ በተሳካ ሁኔታ ቀርቧል!' : 'Request Submitted Successfully!'}
        </h3>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {isAm
            ? 'የፍትሐት ጸሎት ጥያቄዎ በተሳካ ሁኔታ ተመዝግቧል። እባክዎን የባንክ ሂሳብ ቁጥሮቻችንን በመጠቀም ተዛማጁን ክፍያ ይፈጽሙና ደረሰኙን ለደብሩ ጽሕፈት ቤት ያሳውቁ።'
            : 'Your memorial prayer request has been recorded. Please fulfill the payment using our bank accounts and notify the parish office.'}
        </p>
        <button onClick={() => setSuccess(false)} className="btn-contact-send" style={{ backgroundColor: 'var(--navy)', color: 'white', border: 'none', padding: '0.8rem 2.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isAm ? 'ተመለስ' : 'Go Back'}
        </button>
      </div>
    );
  }

  return (
    <section id="memorial" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
        
        {/* Intro */}
        <Reveal direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <blockquote style={{ 
            fontSize: '1.25rem', 
            fontStyle: 'italic', 
            color: 'var(--gold-dark)',
            borderLeft: '4px solid var(--gold)',
            paddingLeft: '1rem',
            margin: '0 auto 1.5rem auto',
            maxWidth: '800px',
            textAlign: 'left'
          }}>
            {isAm 
              ? '«ጌታ ሆይ፥ ለእነዚህ ዕረፍትን ስጣቸው የዘላለም ብርሃንም ያብራላቸው።»'
              : '"O Lord, grant rest to their souls, and let perpetual light shine upon them."'}
          </blockquote>
          
          <p style={{ lineHeight: '1.8', color: 'var(--text-dark)', maxWidth: '800px', margin: '0 auto' }}>
            {introText}
          </p>
        </Reveal>

        {/* Custom Pricing Packages if any exist */}
        {hasPackages && (
          <Reveal as="div" direction="up" style={{ marginBottom: '4rem' }}>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--navy)', textAlign: 'center', marginBottom: '1.5rem' }}>
              {isAm ? 'አገልግሎቶችና ፓኬጆች' : 'Memorial Packages'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {services.map((service) => (
                <div key={service.id} style={{
                  background: 'white', padding: '1.5rem', borderRadius: '8px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.03)', textAlign: 'center',
                  border: '1px solid rgba(197, 160, 68, 0.15)'
                }}>
                  <h3 style={{ color: 'var(--gold-dark)', marginBottom: '0.5rem' }}>
                    {isAm ? service.name_am || service.name_en : service.name_en}
                  </h3>
                  <p style={{ margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {lang === 'am' ? service.description_am || service.description_en : service.description_en}
                  </p>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--navy)' }}>
                    {service.price} {service.currency}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Request Form */}
        <Reveal as="div" direction="up" style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(15,27,61,0.04)', border: '1px solid rgba(197,160,68,0.15)', maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'የፍትሐት ጸሎት መጠየቂያ ቅጽ' : 'Memorial Service Request Form'}
          </h3>

          {error && (
            <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.8rem 1rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '500', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <label className="contact-field" style={{ display: 'block' }}>
              <span className="contact-field-label">{isAm ? 'የአስቀዳሹ/ስፖንሰር ሙሉ ስም' : 'Sponsor Full Name'} *</span>
              <input type="text" required value={form.sponsorName} onChange={handleChange('sponsorName')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} disabled={loading} />
            </label>

            <label className="contact-field" style={{ display: 'block' }}>
              <span className="contact-field-label">{isAm ? 'የሟች ስም (የክርስትና/ዓለማዊ ስም)' : 'Departed Soul Name'} *</span>
              <input type="text" required value={form.departedName} onChange={handleChange('departedName')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} disabled={loading} />
            </label>

            <label className="contact-field" style={{ display: 'block' }}>
              <span className="contact-field-label">{isAm ? 'ስልክ ቁጥር' : 'Phone'} *</span>
              <input type="tel" required value={form.phone} onChange={handleChange('phone')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} disabled={loading} />
            </label>

            <label className="contact-field" style={{ display: 'block' }}>
              <span className="contact-field-label">{isAm ? 'የሚመርጡት ቀን' : 'Preferred Date'} *</span>
              <input type="date" required value={form.preferredDate} onChange={handleChange('preferredDate')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} disabled={loading} />
            </label>

            <label className="contact-field" style={{ display: 'block', gridColumn: '1 / -1' }}>
              <span className="contact-field-label">{isAm ? 'የአገልግሎት አይነት' : 'Memorial Package'} *</span>
              <select required value={form.serviceId} onChange={handleChange('serviceId')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }} disabled={loading}>
                <option value="">{isAm ? '-- ይምረጡ --' : '-- Select Package --'}</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {isAm ? s.name_am || s.name_en : s.name_en} ({s.price} {s.currency})
                  </option>
                ))}
              </select>
            </label>

            <label className="contact-field" style={{ display: 'block', gridColumn: '1 / -1' }}>
              <span className="contact-field-label">{isAm ? 'ኢሜይል (ክፍያ ማረጋገጫ ለመቀበል)' : 'Email (For receipt confirmation)'}</span>
              <input type="email" value={form.email} onChange={handleChange('email')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} disabled={loading} />
            </label>

            <label className="contact-field" style={{ display: 'block', gridColumn: '1 / -1' }}>
              <span className="contact-field-label">{isAm ? 'የክፍያ አማራጭ' : 'Payment Option'} *</span>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  <input type="radio" name="paymentMethod" value="chapa" checked={form.paymentMethod === 'chapa'} onChange={handleChange('paymentMethod')} disabled={loading} />
                  <span>{isAm ? 'በChapa (ኦንላይን መክፈያ)' : 'Pay Online (Chapa)'}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  <input type="radio" name="paymentMethod" value="bank" checked={form.paymentMethod === 'bank'} onChange={handleChange('paymentMethod')} disabled={loading} />
                  <span>{isAm ? 'በባንክ ሂሳብ/በአካል (ቆይተው መክፈያ)' : 'Pay Later (Bank Transfer / Cash)'}</span>
                </label>
              </div>
            </label>

            <label className="contact-field" style={{ display: 'block', gridColumn: '1 / -1' }}>
              <span className="contact-field-label">{isAm ? 'ተጨማሪ መረጃ ወይም የሚነበቡ ስሞች' : 'Names to be Read / Message'}</span>
              <textarea rows={4} value={form.message} onChange={handleChange('message')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} disabled={loading} />
            </label>

            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem' }}>
              <button type="submit" className="btn-contact-send" disabled={loading} style={{ 
                backgroundColor: 'var(--navy)', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
              }}>
                {loading && <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white' }}></div>}
                <span>
                  {form.paymentMethod === 'chapa'
                    ? (isAm ? 'ክፍያ ቀጥል' : 'Proceed to Payment')
                    : (isAm ? 'ቅጹን ላክ' : 'Submit Memorial Request')}
                </span>
              </button>
            </div>
          </form>
        </Reveal>

      </div>
    </section>
  );
}
