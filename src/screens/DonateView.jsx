'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import PageHero from '@/components/PageHero';
import '@/styles/donate.css';
import '@/styles/donate-bank.css';

const T = {
  en: {
    heroTitle: 'Donations & Support',
    heroSubtitle: 'Your generosity sustains our parish, our schools, and our outreach. Thank you for giving cheerfully.',
    quote: '“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.”',
    quoteRef: '— 2 Corinthians 9:7',
    introText: 'Your generosity sustains our parish, our schools, and our outreach. Thank you for giving cheerfully.',
    projectsTitle: 'Current Projects', raised: 'raised', goal: 'Goal',
    readMore: 'Read more', less: 'Show less', contribute: 'Contribute to this project',
    generalTitle: 'General Parish Support', generalDesc: 'Not sure where to give? Support the overall ministry of the parish — every gift helps.', giveNow: 'Give Now',
    modalTitle: 'Make a Donation', name: 'Full Name', email: 'Email', amount: 'Amount (ETB)', message: 'Message (optional)',
    anon: 'Give anonymously', giveWithChapa: 'Donate with Chapa', processing: 'Processing…',
    successTitle: 'Thank You!', successText: 'Your contribution has been received. May God bless your generosity.', close: 'Close',
    bankTitle: 'Bank Transfer', accName: 'Account Name', accNum: 'Account Number', copy: 'Copy', copied: 'Copied!',
  },
  am: {
    heroTitle: 'ልገሳ እና ድጋፍ',
    heroSubtitle: 'የእርስዎ ልግስና ደብራችንን፣ ትምህርት ቤቶቻችንንና አገልግሎቶቻችንን ይደግፋል። በደስታ ስለሰጡ እናመሰግናለን።',
    quote: '“እያንዳንዱ በልቡ እንዳሰበ ይስጥ፥ በኀዘን ወይም በግድ አይደለም፤ እግዚአብሔር በደስታ የሚሰጠውን ይወዳልና።”',
    quoteRef: '— 2ኛ ቆሮንቶስ 9፥7',
    introText: 'የእርስዎ ልግስና ደብራችንን፣ ትምህርት ቤቶቻችንንና አገልግሎቶቻችንን ይደግፋል። በደስታ ስለሰጡ እናመሰግናለን።',
    projectsTitle: 'የአሁኑ ፕሮጀክቶች', raised: 'ተሰብስቧል', goal: 'ግብ',
    readMore: 'ተጨማሪ ያንብቡ', less: 'ይዝጉ', contribute: 'ለዚህ ፕሮጀክት ያዋጡ',
    generalTitle: 'አጠቃላይ የደብር ድጋፍ', generalDesc: 'የት እንደሚሰጡ እርግጠኛ አይደሉም? የደብሩን አጠቃላይ አገልግሎት ይደግፉ — እያንዳንዱ ስጦታ ይረዳል።', giveNow: 'አሁን ይስጡ',
    modalTitle: 'ልገሳ ያድርጉ', name: 'ሙሉ ስም', email: 'ኢሜይል', amount: 'መጠን (ብር)', message: 'መልእክት (በፈቃደኝነት)',
    anon: 'በስም-አልባ ይስጡ', giveWithChapa: 'በቻፓ ይለግሱ', processing: 'በማስኬድ ላይ…',
    successTitle: 'እናመሰግናለን!', successText: 'ልገሳዎ ደርሶናል። እግዚአብሔር ልግስናዎን ይባርክ።', close: 'ዝጋ',
    bankTitle: 'የባንክ ማስተላለፊያ', accName: 'የሒሳብ ስም', accNum: 'የሒሳብ ቍጥር', copy: 'ቅዳ', copied: 'ተቀድቷል!',
  },
};

const CAT = {
  en: { parish: 'Parish', sunday_school: 'Sunday School', abnet: 'Abnet School', general: 'General' },
  am: { parish: 'ደብር', sunday_school: 'ሰንበት ት/ቤት', abnet: 'አብነት', general: 'አጠቃላይ' },
};

const pct = (r, g) => (!g || g <= 0 ? 0 : Math.min(100, Math.round((Number(r) / Number(g)) * 100)));
const money = (n, c) => `${Number(n || 0).toLocaleString()} ${c || 'ETB'}`;

function ProjectCard({ p, lang, t, onContribute }) {
  const [more, setMore] = useState(false);
  const title = lang === 'am' ? p.title_am || p.title_en : p.title_en;
  const desc = lang === 'am' ? p.description_am || p.description_en : p.description_en;
  const readMore = lang === 'am' ? p.read_more_am || p.read_more_en : p.read_more_en;
  const p100 = pct(p.raised_amount, p.goal_amount);

  return (
    <div className="project-card">
      {p.cover_url && <img className="project-card-image" src={p.cover_url} alt="" loading="lazy" />}
      <div className="project-card-content">
        <div className="project-card-category">{CAT[lang]?.[p.category] || p.category}</div>
        <h3 className="project-card-title">{title}</h3>
        <p className="project-card-desc">{desc}</p>

        <div className="project-progress-container">
          <div className="project-progress-bar-bg"><div className="project-progress-bar-fill" style={{ width: `${p100}%` }} /></div>
          <div className="project-progress-stats">
            <span className="stat-raised">{money(p.raised_amount, p.currency)}</span>
            <span className="stat-percent">{p100}%</span>
            <span className="stat-goal">{t.goal}: {money(p.goal_amount, p.currency)}</span>
          </div>
        </div>

        {readMore && (
          <>
            <button className="project-readmore-btn" onClick={() => setMore((m) => !m)}>{more ? t.less : t.readMore} {more ? '▲' : '▼'}</button>
            {more && <div className="project-readmore-content">{readMore}</div>}
          </>
        )}

        <button className="btn-contribute" onClick={() => onContribute(p)}>{t.contribute}</button>
      </div>
    </div>
  );
}

function DonationModal({ project, lang, t, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anon, setAnon] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const res = await fetch('/api/chapa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'donation',
          projectId: project === 'general' ? null : project.id,
          amount, name, email, message, isAnonymous: anon,
        }),
      });
      const json = await res.json();
      if (json.checkout_url) { window.location.href = json.checkout_url; return; }
      setErr(json.error || 'Something went wrong.');
    } catch {
      setErr('Network error.');
    } finally {
      setBusy(false);
    }
  };

  const projTitle = project !== 'general'
    ? (lang === 'am' ? project.title_am || project.title_en : project.title_en)
    : null;

  return (
    <div className="donation-modal-overlay" onClick={onClose}>
      <div className="donation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="donation-modal-header">
          <h3>{t.modalTitle}</h3>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="donation-modal-body">
          {projTitle && <div className="modal-project-badge">{projTitle}</div>}
          <form className="donation-form" onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t.name}</label>
                <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} disabled={anon} />
              </div>
              <div className="form-group">
                <label className="form-label">{t.email}</label>
                <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t.amount}</label>
              <input className="form-input" type="number" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.message}</label>
              <input className="form-input" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <label className="checkbox-label">
              <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> {t.anon}
            </label>
            {err && <p style={{ color: '#c62828', fontSize: '0.85rem', margin: 0 }}>{err}</p>}
            <button className="btn-submit-donation" disabled={busy}>
              {busy && <span className="spinner" />}{busy ? t.processing : t.giveWithChapa}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function BankCard({ b, t }) {
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard.writeText(b.account_number).then(() => {
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  });
  return (
    <div className="bank-card">
      <div className="bank-card-name">{b.bank_name}</div>
      <div className="bank-card-row"><span>{t.accName}</span><span>{b.account_name}</span></div>
      <div className="bank-card-row"><span>{t.accNum}</span><span className="bank-card-num">{b.account_number}</span></div>
      {b.swift && <div className="bank-card-row"><span>SWIFT</span><span>{b.swift}</span></div>}
      {b.notes && <p className="bank-card-notes">{b.notes}</p>}
      <button className="btn-copy-bank" onClick={copy}>{copied ? t.copied : t.copy}</button>
    </div>
  );
}

export default function DonateView({ projects = [], bankAccounts = [] }) {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;
  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('status') === 'success') setSuccess(true);
  }, []);

  const closeSuccess = () => {
    setSuccess(false);
    window.history.replaceState({}, '', '/donate');
  };

  return (
    <main className="site-page">
      <PageHero title={t.heroTitle} subtitle={t.heroSubtitle} />
      <div className="donate-container-wrapper" style={{ paddingTop: '4rem' }}>
        <section className="donate-intro-section">
          <blockquote className="donate-intro-quote" style={{ borderLeft: '4px solid var(--gold)', margin: '0 auto' }}>
            {t.quote}<br /><cite style={{ display: 'block', marginTop: '0.5rem', textAlign: 'right', fontWeight: 'bold' }}>{t.quoteRef}</cite>
          </blockquote>
        </section>

        <section className="donate-projects-section">
          <h2 className="donate-section-subtitle">{CAT[lang]?.parish || 'Projects of the Parish'}</h2>
          <div className="projects-grid">
            {projects.filter(p => p.category === 'parish').map((p) => <ProjectCard key={p.id} p={p} lang={lang} t={t} onContribute={setModal} />)}
            <div className="general-donation-card">
              <div className="general-donation-content">
                <h3 className="general-donation-title">{t.generalTitle}</h3>
                <p className="general-donation-desc">{t.generalDesc}</p>
              </div>
              <button className="btn-contribute" onClick={() => setModal('general')}>{t.giveNow}</button>
            </div>
          </div>

          <h2 className="donate-section-subtitle" style={{ marginTop: '60px' }}>{CAT[lang]?.sunday_school || 'Projects of the Sunday School'}</h2>
          <div className="projects-grid">
            {projects.filter(p => p.category === 'sunday_school').map((p) => <ProjectCard key={p.id} p={p} lang={lang} t={t} onContribute={setModal} />)}
            {projects.filter(p => p.category === 'sunday_school').length === 0 && (
              <p style={{ gridColumn: '1 / -1', color: 'var(--text-muted)' }}>{lang === 'am' ? 'በአሁኑ ጊዜ ፕሮጀክቶች የሉም' : 'No projects at this time.'}</p>
            )}
          </div>

          <h2 className="donate-section-subtitle" style={{ marginTop: '60px' }}>{CAT[lang]?.abnet || 'Projects of the Abnet School'}</h2>
          <div className="projects-grid">
            {projects.filter(p => p.category === 'abnet').map((p) => <ProjectCard key={p.id} p={p} lang={lang} t={t} onContribute={setModal} />)}
            {projects.filter(p => p.category === 'abnet').length === 0 && (
              <p style={{ gridColumn: '1 / -1', color: 'var(--text-muted)' }}>{lang === 'am' ? 'በአሁኑ ጊዜ ፕሮጀክቶች የሉም' : 'No projects at this time.'}</p>
            )}
          </div>
        </section>

        {bankAccounts.length > 0 && (
          <section className="donate-bank-section">
            <h2 className="donate-section-subtitle">{t.bankTitle}</h2>
            <div className="bank-grid">
              {bankAccounts.map((b) => <BankCard key={b.id} b={b} t={t} />)}
            </div>
          </section>
        )}
      </div>

      {modal && <DonationModal project={modal} lang={lang} t={t} onClose={() => setModal(null)} />}

      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon-wrapper">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h3 className="success-title">{t.successTitle}</h3>
            <p className="success-text">{t.successText}</p>
            <button className="btn-success-close" onClick={closeSuccess}>{t.close}</button>
          </div>
        </div>
      )}
    </main>
  );
}
