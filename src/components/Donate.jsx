'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import PageHero from './PageHero';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import '../styles/donate.css';

export default function Donate({ lang }) {
  const [projects, setProjects] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] = useState(null); // null, 'general', or project object
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  // Form Fields
  const [form, setForm] = useState({
    name: '',
    email: '',
    amount: '',
    isAnonymous: false,
    message: ''
  });
  const [formError, setFormError] = useState('');

  const isAm = lang === 'am';
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch projects
        const { data: projData, error: projErr } = await supabase
          .from('donation_projects')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: true });

        // Fetch bank accounts
        const { data: bankData, error: bankErr } = await supabase
          .from('bank_accounts')
          .select('*')
          .order('display_order', { ascending: true });

        if (projErr) console.error('Error fetching projects:', projErr);
        else setProjects(projData || []);

        if (bankErr) console.error('Error fetching bank accounts:', bankErr);
        else setBankAccounts(bankData || []);

      } catch (err) {
        console.error('Error loading donations data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Check URL parameters for redirection status
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      setShowSuccess(true);
      // Remove query parameters from URL without reloading
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleOpenModal = (project) => {
    setModalProject(project);
    setForm({
      name: '',
      email: '',
      amount: '',
      isAnonymous: false,
      message: ''
    });
    setFormError('');
  };

  const handleCloseModal = () => {
    setModalProject(null);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    const amt = Number(form.amount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setFormError(isAm ? 'እባክዎን ትክክለኛ የገንዘብ መጠን ያስገቡ' : 'Please enter a valid donation amount.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        type: 'donation',
        projectId: modalProject === 'general' ? null : modalProject.id,
        amount: amt,
        email: form.email || null,
        name: form.isAnonymous ? 'Anonymous' : (form.name || 'Anonymous'),
        isAnonymous: form.isAnonymous,
        message: form.message || null
      };

      const res = await fetch('/api/chapa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (err) {
      console.error('Initiation failed:', err);
      setFormError(err.message || (isAm ? 'ክፍያውን መጀመር አልተቻለም፡ እባክዎን ቆይተው ይሞክሩ' : 'Failed to initiate payment. Please try again.'));
      setSubmitting(false);
    }
  };

  const toggleReadMore = (id) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  // Group bank accounts by type
  const localAccounts = bankAccounts.filter((b) => b.type === 'local');
  const internationalAccounts = bankAccounts.filter((b) => b.type === 'international' || b.type === 'us');

  const heroTitle = isAm ? 'ቤተክርስቲያናችንን ይደግፉ' : 'Support Our Sanctuary';
  const heroSubtitle = isAm ? 'በአይነት፣ በገንዘብ እና በሃሳብ የድርሻዎን በመወጣት የበረከቱ ተካፋይ ይሁኑ' : 'Join hands with us to build, sustain, and grow our spiritual sanctuary.';

  return (
    <div className="donate-container-wrapper">
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="donate-intro-section" style={{ paddingTop: '4rem' }}>
        <blockquote className="donate-intro-quote">
          {isAm
            ? '«እያንዳንዱ በልቡ እንዳሰበ ይስጥ፥ በኀዘን ወይም በግድ አይደለም፤ እግዚአብሔር በደስታ የሚሰጠውን ይወዳልና።» — ፪ኛ ቆሮንቶስ ፱:፯'
            : '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7'}
        </blockquote>
        <p className="donate-intro-text">
          {isAm
            ? 'የእርስዎ ልግስና የደብራችንን አገልግሎት፣ የአቢነትና ሰንበት ትምህርት ቤቶችን፣ እንዲሁም የማኅበረሰብ ተደራሽነት ሥራዎችን ለመደገፍ ይውላል። እያንዳንዱ ድጋፍ የተቀደሰውን ሃይማኖታዊ ቅርሳችንን ለመጠበቅ ይረዳል።'
            : 'Your generous donations support our parish, traditional school, Sunday school, and local community outreach programs. Every contribution helps preserve our sacred heritage.'}
        </p>
      </section>

      {/* Projects Grid Section */}
      <section className="donate-projects-section">
        <h2 className="donate-section-subtitle">
          {isAm ? 'አሁን ያሉ ፕሮጀክቶች' : 'Active Projects'}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto', borderTopColor: 'var(--gold)' }}></div>
            <p>{isAm ? 'በመጫን ላይ...' : 'Loading projects...'}</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const percent = Math.min(100, Math.round((project.raised_amount / project.goal_amount) * 100));
              const isExpanded = expandedProjectId === project.id;
              
              return (
                <Reveal key={project.id} className="project-card" direction="up">
                  {project.cover_url && (
                    <img src={project.cover_url} alt="" className="project-card-image" />
                  )}
                  <div className="project-card-content">
                    <span className="project-card-category">
                      {project.category}
                    </span>
                    <h3 className="project-card-title">
                      {isAm ? project.title_am || project.title_en : project.title_en}
                    </h3>
                    <p className="project-card-desc">
                      {isAm ? project.description_am || project.description_en : project.description_en}
                    </p>

                    {/* Progress Bar */}
                    <div className="project-progress-container">
                      <div className="project-progress-bar-bg">
                        <div className="project-progress-bar-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className="project-progress-stats">
                        <span className="stat-raised">
                          {isAm ? 'የተሰበሰበ፡' : 'Raised:'} {Number(project.raised_amount).toLocaleString()} {project.currency}
                        </span>
                        <span className="stat-percent">{percent}%</span>
                        <span className="stat-goal">
                          {isAm ? 'ግብ፡' : 'Goal:'} {Number(project.goal_amount).toLocaleString()} {project.currency}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Read More */}
                    {(project.read_more_en || project.read_more_am) && (
                      <>
                        <button onClick={() => toggleReadMore(project.id)} className="project-readmore-btn">
                          <span>{isExpanded ? (isAm ? 'ቀንስ' : 'Show Less') : (isAm ? 'ተጨማሪ ያንብቡ' : 'Read More')}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="project-readmore-content">
                            {isAm ? project.read_more_am || project.read_more_en : project.read_more_en}
                          </div>
                        )}
                      </>
                    )}

                    <button onClick={() => handleOpenModal(project)} className="btn-contribute">
                      {isAm ? 'ለዚህ ፕሮጀክት ይለግሱ' : 'Contribute to Project'}
                    </button>
                  </div>
                </Reveal>
              );
            })}

            {/* General Donation Box */}
            <Reveal className="general-donation-card" direction="up">
              <div className="general-donation-content">
                <h3 className="general-donation-title">
                  {isAm ? 'ጠቅላላ የደብር ድጋፍ' : 'General Sanctuary Support'}
                </h3>
                <p className="general-donation-desc">
                  {isAm
                    ? 'የደብራችንን የዕለት ተዕለት ሥራዎች፣ የቅዳሴ አገልግሎትና ጠቅላላ የቤተ መቅደሱን ፍላጎቶች ይደግፉ።'
                    : 'Support our parish\'s daily operations, liturgical needs, and general sanctuary upkeep.'}
                </p>
              </div>
              <button onClick={() => handleOpenModal('general')} className="btn-contribute">
                {isAm ? 'ጠቅላላ ልገሳ' : 'General Donation'}
              </button>
            </Reveal>
          </div>
        )}
      </section>

      {/* Bank Accounts Section */}
      <section className="donate-projects-section" style={{ borderTop: '1px solid rgba(197, 160, 68, 0.15)', paddingTop: '4rem' }}>
        <h2 className="donate-section-subtitle">
          {isAm ? 'በቀጥታ የባንክ ሂሳብ መላኪያ' : 'Direct Bank Accounts'}
        </h2>

        <div className="donate-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {bankAccounts.map((method) => (
            <div key={method.id} className="donate-card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(197, 160, 68, 0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
              <div>
                <div className="donate-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span className="donate-card-icon" style={{ fontSize: '2rem' }}>{method.type === 'local' ? '🏦' : '📱'}</span>
                  <span className="donate-card-type" style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--gold-dark)', fontWeight: 'bold' }}>
                    {method.type === 'local' ? (isAm ? 'የባንክ ሒሳብ' : 'Bank Account') : (isAm ? 'ሞባይል/ዓለም አቀፍ' : 'Mobile / International')}
                  </span>
                </div>

                <h3 className="donate-bank-name" style={{ color: 'var(--navy)', fontSize: '1.25rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  {method.bank_name}
                </h3>

                <div className="donate-details" style={{ fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <div className="donate-detail-row">
                    <span className="donate-label" style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>{isAm ? 'የሒሳብ ስም፡' : 'Account Name:'}</span>
                    <span className="donate-value" style={{ fontWeight: '600' }}>{method.account_name}</span>
                  </div>

                  <div className="donate-detail-row donate-account-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span className="donate-label" style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                      {method.type === 'us' ? (isAm ? 'ኢሜይል፡' : 'Email:') : (isAm ? 'የሒሳብ ቍጥር፡' : 'Account Number:')}
                    </span>
                    <span className="donate-value account-num" style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--navy)' }}>{method.account_number}</span>
                  </div>

                  {method.swift && (
                    <div className="donate-detail-row">
                      <span className="donate-label" style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>SWIFT:</span>
                      <span className="donate-value" style={{ fontFamily: 'monospace' }}>{method.swift}</span>
                    </div>
                  )}

                  {method.notes && (
                    <p className="donate-zelle-note" style={{ fontSize: '0.85rem', color: 'var(--gold-dark)', fontStyle: 'italic', marginTop: '0.5rem', lineHeight: '1.4' }}>
                      {method.notes}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleCopy(method.account_number, method.id)}
                className={`btn-copy-account ${copiedId === method.id ? 'copied' : ''}`}
                style={{ width: '100%', background: copiedId === method.id ? '#f0fdf4' : 'var(--navy)', color: copiedId === method.id ? '#16a34a' : 'white', border: copiedId === method.id ? '1px solid #bbf7d0' : 'none', padding: '0.8rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
              >
                {copiedId === method.id ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>{isAm ? 'ተገልብጧል!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>{isAm ? 'ሂሳብ ቁጥር ገልብጥ' : 'Copy Account Details'}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Donation Modal */}
      {modalProject && (
        <div className="donation-modal-overlay" onClick={handleCloseModal}>
          <div className="donation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="donation-modal-header">
              <h3>{isAm ? 'ደህንነቱ የተጠበቀ ልገሳ' : 'Secure Online Donation'}</h3>
              <button className="btn-close-modal" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="donation-modal-body">
              <div className="modal-project-badge">
                {isAm ? 'ልገሳ ለ፡' : 'Supporting:'}{' '}
                {modalProject === 'general'
                  ? (isAm ? 'ጠቅላላ የደብር ድጋፍ' : 'General Sanctuary Support')
                  : (isAm ? modalProject.title_am || modalProject.title_en : modalProject.title_en)}
              </div>

              {formError && (
                <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.8rem 1rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1.2rem', fontWeight: '500' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleDonateSubmit} className="donation-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{isAm ? 'ሙሉ ስም' : 'Full Name'}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      disabled={form.isAnonymous || submitting}
                      placeholder={form.isAnonymous ? (isAm ? 'በምስጢር' : 'Anonymous') : (isAm ? 'ለጋሽ ስም' : 'e.g. John Doe')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isAm ? 'የገንዘብ መጠን (ETB) *' : 'Amount (ETB) *'}</label>
                    <input
                      type="number"
                      required
                      min="10"
                      className="form-input"
                      value={form.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      disabled={submitting}
                      placeholder="e.g. 1000"
                    />
                  </div>
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">{isAm ? 'ኢሜይል (ክፍያ ማረጋገጫ ለመቀበል)' : 'Email (For receipt confirmation)'}</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    disabled={submitting}
                    placeholder="e.g. email@example.com"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">{isAm ? 'መልእክት / የጸሎት ጥያቄ (ከተፈለገ)' : 'Message / Prayer Request (Optional)'}</label>
                  <textarea
                    rows="3"
                    className="form-input"
                    value={form.message}
                    onChange={(e) => handleFormChange('message', e.target.value)}
                    disabled={submitting}
                    placeholder={isAm ? 'ለመንፈሳዊ አባቶች የሚተላለፍ መልእክት...' : 'Any prayer names or message...'}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.isAnonymous}
                      onChange={(e) => handleFormChange('isAnonymous', e.target.checked)}
                      disabled={submitting}
                    />
                    <span>{isAm ? 'በምስጢር ይለገስ (ስም አይገለጽ)' : 'Donate anonymously (Hide name on public feed)'}</span>
                  </label>
                </div>

                <button type="submit" className="btn-submit-donation" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner"></div>
                      <span>{isAm ? 'በመላክ ላይ...' : 'Redirecting to payment...'}</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>{isAm ? 'በChapa ይክፈሉ' : 'Proceed to Pay with Chapa'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Redirect Toast */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon-wrapper">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="success-title">
              {isAm ? 'እናመሰግናለን!' : 'Thank You!'}
            </h3>
            <p className="success-text">
              {isAm
                ? 'ልገሳዎ ደህንነቱ በተጠበቀ መንገድ በChapa ተፈጽሟል። ድጋፍዎ ከጥቂት ደቂቃዎች በኋላ በፕሮጀክቱ የሂደት አሞሌ ላይ ይንጸባረቃል። እግዚአብሔር አገልግሎትዎን ይቀበል!'
                : 'Your secure transaction has been completed successfully via Chapa. Your support will reflect on the project progress bar shortly. May God bless your generosity!'}
            </p>
            <button onClick={() => setShowSuccess(false)} className="btn-success-close">
              {isAm ? 'እሺ' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
