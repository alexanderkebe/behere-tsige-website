import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useContent } from '../context/ContentContext';
import { getToken, login, logout, saveContent, clearToken } from '../admin/api';
import '../admin.css';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'churchSchool', label: 'Education' },
  { id: 'news', label: 'News' },
  { id: 'events', label: 'Events' },
  { id: 'donate', label: 'Donate' },
  { id: 'footer', label: 'Footer & Social' },
];

function BilingualField({ label, enValue, amValue, onEnChange, onAmChange, multiline = false }) {
  const Input = multiline ? 'textarea' : 'input';
  return (
    <div className="admin-field">
      <label className="admin-field-label">{label}</label>
      <div className="admin-bilingual">
        <div className="admin-lang-col">
          <span className="admin-lang-tag">English</span>
          <Input className="admin-input" value={enValue ?? ''} onChange={(e) => onEnChange(e.target.value)} rows={multiline ? 4 : undefined} />
        </div>
        <div className="admin-lang-col">
          <span className="admin-lang-tag">Amharic</span>
          <Input className="admin-input admin-input-am" value={amValue ?? ''} onChange={(e) => onAmChange(e.target.value)} rows={multiline ? 4 : undefined} />
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src="/assets/logo.png" alt="" className="admin-login-logo" />
        <h1>Site Admin</h1>
        <p className="admin-login-sub">Sign in to manage church website content</p>
        <input
          type="password"
          className="admin-input"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <Link href="/" className="admin-back-link">← Back to website</Link>
      </form>
    </div>
  );
}

export default function Admin() {
  const { content, setContent, reload } = useContent();
  const [draft, setDraft] = useState(content);
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState('hero');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const patch = useCallback((updater) => {
    setDraft((prev) => updater(structuredClone(prev)));
  }, []);

  const setLangField = useCallback((section, lang, key, value) => {
    patch((d) => {
      d[section][lang][key] = value;
      return d;
    });
  }, [patch]);

  const handleSave = async () => {
    setSaving(true);
    setStatus('');
    try {
      await saveContent(draft);
      setContent(draft);
      await reload();
      setStatus('Saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus(err.message);
      if (err.message === 'Unauthorized') {
        clearToken();
        setAuthed(false);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  const d = draft;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <img src="/assets/logo.png" alt="" />
          <span>Content Admin</span>
        </div>
        <nav className="admin-nav">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link href="/" className="admin-nav-btn">View Site</Link>
          <button type="button" className="admin-nav-btn" onClick={async () => { await logout(); setAuthed(false); }}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>{TABS.find((t) => t.id === tab)?.label}</h2>
          <div className="admin-header-actions">
            {status && <span className={`admin-status ${status.includes('success') ? 'ok' : 'err'}`}>{status}</span>}
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </header>

        <div className="admin-panel">
          {tab === 'hero' && (
            <>
              <BilingualField label="Welcome bubble" enValue={d.hero.en.bubble} amValue={d.hero.am.bubble} onEnChange={(v) => setLangField('hero', 'en', 'bubble', v)} onAmChange={(v) => setLangField('hero', 'am', 'bubble', v)} />
              <BilingualField label="Title" enValue={d.hero.en.title} amValue={d.hero.am.title} onEnChange={(v) => setLangField('hero', 'en', 'title', v)} onAmChange={(v) => setLangField('hero', 'am', 'title', v)} />
              <BilingualField label="Description" enValue={d.hero.en.description} amValue={d.hero.am.description} onEnChange={(v) => setLangField('hero', 'en', 'description', v)} onAmChange={(v) => setLangField('hero', 'am', 'description', v)} multiline />
            </>
          )}

          {tab === 'about' && (
            <>
              <BilingualField label="Section tag" enValue={d.about.en.tag} amValue={d.about.am.tag} onEnChange={(v) => setLangField('about', 'en', 'tag', v)} onAmChange={(v) => setLangField('about', 'am', 'tag', v)} />
              <BilingualField label="Heading" enValue={d.about.en.heading} amValue={d.about.am.heading} onEnChange={(v) => setLangField('about', 'en', 'heading', v)} onAmChange={(v) => setLangField('about', 'am', 'heading', v)} />
              <BilingualField label="Body paragraph 1" enValue={d.about.en.body1} amValue={d.about.am.body1} onEnChange={(v) => setLangField('about', 'en', 'body1', v)} onAmChange={(v) => setLangField('about', 'am', 'body1', v)} multiline />
              <BilingualField label="Body paragraph 2" enValue={d.about.en.body2} amValue={d.about.am.body2} onEnChange={(v) => setLangField('about', 'en', 'body2', v)} onAmChange={(v) => setLangField('about', 'am', 'body2', v)} multiline />
              <BilingualField label="Gallery title" enValue={d.about.en.galleryTitle} amValue={d.about.am.galleryTitle} onEnChange={(v) => setLangField('about', 'en', 'galleryTitle', v)} onAmChange={(v) => setLangField('about', 'am', 'galleryTitle', v)} />
              <h3 className="admin-subheading">Gallery slides</h3>
              {d.about.gallery.map((slide, i) => (
                <div key={i} className="admin-card">
                  <label className="admin-field-label">Slide {i + 1} — Image URL</label>
                  <input className="admin-input" value={slide.src} onChange={(e) => patch((x) => { x.about.gallery[i].src = e.target.value; return x; })} />
                  <BilingualField label="Caption" enValue={slide.en} amValue={slide.am} onEnChange={(v) => patch((x) => { x.about.gallery[i].en = v; return x; })} onAmChange={(v) => patch((x) => { x.about.gallery[i].am = v; return x; })} multiline />
                </div>
              ))}
            </>
          )}

          {tab === 'services' && (
            <>
              <BilingualField label="Section title" enValue={d.services.en.title} amValue={d.services.am.title} onEnChange={(v) => setLangField('services', 'en', 'title', v)} onAmChange={(v) => setLangField('services', 'am', 'title', v)} />
              {['worship', 'teaching', 'serving', 'fellowship'].map((key) => (
                <div key={key} className="admin-card">
                  <h3 className="admin-subheading">{key}</h3>
                  <BilingualField label="Title" enValue={d.services.en[key].title} amValue={d.services.am[key].title} onEnChange={(v) => patch((x) => { x.services.en[key].title = v; return x; })} onAmChange={(v) => patch((x) => { x.services.am[key].title = v; return x; })} />
                  <BilingualField label="Description" enValue={d.services.en[key].description} amValue={d.services.am[key].description} onEnChange={(v) => patch((x) => { x.services.en[key].description = v; return x; })} onAmChange={(v) => patch((x) => { x.services.am[key].description = v; return x; })} multiline />
                </div>
              ))}
            </>
          )}

          {tab === 'churchSchool' && (
            <>
              <BilingualField label="Section tag" enValue={d.churchSchool.en.sectionTag} amValue={d.churchSchool.am.sectionTag} onEnChange={(v) => setLangField('churchSchool', 'en', 'sectionTag', v)} onAmChange={(v) => setLangField('churchSchool', 'am', 'sectionTag', v)} />
              <BilingualField label="Section title" enValue={d.churchSchool.en.sectionTitle} amValue={d.churchSchool.am.sectionTitle} onEnChange={(v) => setLangField('churchSchool', 'en', 'sectionTitle', v)} onAmChange={(v) => setLangField('churchSchool', 'am', 'sectionTitle', v)} />
              {['abnet', 'sundaySchool'].map((prog) => (
                <div key={prog} className="admin-card">
                  <h3 className="admin-subheading">{prog}</h3>
                  <BilingualField label="Title" enValue={d.churchSchool.en[prog].title} amValue={d.churchSchool.am[prog].title} onEnChange={(v) => patch((x) => { x.churchSchool.en[prog].title = v; return x; })} onAmChange={(v) => patch((x) => { x.churchSchool.am[prog].title = v; return x; })} />
                  <BilingualField label="Subtitle" enValue={d.churchSchool.en[prog].subtitle} amValue={d.churchSchool.am[prog].subtitle} onEnChange={(v) => patch((x) => { x.churchSchool.en[prog].subtitle = v; return x; })} onAmChange={(v) => patch((x) => { x.churchSchool.am[prog].subtitle = v; return x; })} />
                  <BilingualField label="Intro" enValue={d.churchSchool.en[prog].intro} amValue={d.churchSchool.am[prog].intro} onEnChange={(v) => patch((x) => { x.churchSchool.en[prog].intro = v; return x; })} onAmChange={(v) => patch((x) => { x.churchSchool.am[prog].intro = v; return x; })} multiline />
                  <BilingualField label="Join button" enValue={d.churchSchool.en[prog].join} amValue={d.churchSchool.am[prog].join} onEnChange={(v) => patch((x) => { x.churchSchool.en[prog].join = v; return x; })} onAmChange={(v) => patch((x) => { x.churchSchool.am[prog].join = v; return x; })} />
                </div>
              ))}
            </>
          )}

          {tab === 'news' && (
            <>
              <BilingualField label="Section tag" enValue={d.news.en.sectionTag} amValue={d.news.am.sectionTag} onEnChange={(v) => setLangField('news', 'en', 'sectionTag', v)} onAmChange={(v) => setLangField('news', 'am', 'sectionTag', v)} />
              <BilingualField label="Section title" enValue={d.news.en.sectionTitle} amValue={d.news.am.sectionTitle} onEnChange={(v) => setLangField('news', 'en', 'sectionTitle', v)} onAmChange={(v) => setLangField('news', 'am', 'sectionTitle', v)} />
              <BilingualField label="Father name" enValue={d.news.en.fatherTitle} amValue={d.news.am.fatherTitle} onEnChange={(v) => setLangField('news', 'en', 'fatherTitle', v)} onAmChange={(v) => setLangField('news', 'am', 'fatherTitle', v)} />
              <BilingualField label="Father role" enValue={d.news.en.fatherRole} amValue={d.news.am.fatherRole} onEnChange={(v) => setLangField('news', 'en', 'fatherRole', v)} onAmChange={(v) => setLangField('news', 'am', 'fatherRole', v)} />
              <BilingualField label="Father message" enValue={d.news.en.fatherMessage} amValue={d.news.am.fatherMessage} onEnChange={(v) => setLangField('news', 'en', 'fatherMessage', v)} onAmChange={(v) => setLangField('news', 'am', 'fatherMessage', v)} multiline />
              <BilingualField label="News grid title" enValue={d.news.en.newsTitle} amValue={d.news.am.newsTitle} onEnChange={(v) => setLangField('news', 'en', 'newsTitle', v)} onAmChange={(v) => setLangField('news', 'am', 'newsTitle', v)} />
              {d.news.en.news.map((item, i) => (
                <div key={item.id} className="admin-card">
                  <h3 className="admin-subheading">News item {i + 1}</h3>
                  <BilingualField label="Date" enValue={d.news.en.news[i].date} amValue={d.news.am.news[i].date} onEnChange={(v) => patch((x) => { x.news.en.news[i].date = v; return x; })} onAmChange={(v) => patch((x) => { x.news.am.news[i].date = v; return x; })} />
                  <BilingualField label="Title" enValue={d.news.en.news[i].title} amValue={d.news.am.news[i].title} onEnChange={(v) => patch((x) => { x.news.en.news[i].title = v; return x; })} onAmChange={(v) => patch((x) => { x.news.am.news[i].title = v; return x; })} />
                  <BilingualField label="Excerpt" enValue={d.news.en.news[i].excerpt} amValue={d.news.am.news[i].excerpt} onEnChange={(v) => patch((x) => { x.news.en.news[i].excerpt = v; return x; })} onAmChange={(v) => patch((x) => { x.news.am.news[i].excerpt = v; return x; })} multiline />
                </div>
              ))}
            </>
          )}

          {tab === 'events' && (
            <>
              <BilingualField label="Section tag" enValue={d.events.en.sectionTag} amValue={d.events.am.sectionTag} onEnChange={(v) => setLangField('events', 'en', 'sectionTag', v)} onAmChange={(v) => setLangField('events', 'am', 'sectionTag', v)} />
              <BilingualField label="Section title" enValue={d.events.en.sectionTitle} amValue={d.events.am.sectionTitle} onEnChange={(v) => setLangField('events', 'en', 'sectionTitle', v)} onAmChange={(v) => setLangField('events', 'am', 'sectionTitle', v)} />
              <BilingualField label="Intro" enValue={d.events.en.intro} amValue={d.events.am.intro} onEnChange={(v) => setLangField('events', 'en', 'intro', v)} onAmChange={(v) => setLangField('events', 'am', 'intro', v)} multiline />
              <BilingualField label="Learn more button" enValue={d.events.en.learnMore} amValue={d.events.am.learnMore} onEnChange={(v) => setLangField('events', 'en', 'learnMore', v)} onAmChange={(v) => setLangField('events', 'am', 'learnMore', v)} />
              <BilingualField label="Main feast badge" enValue={d.events.en.mainFeastBadge} amValue={d.events.am.mainFeastBadge} onEnChange={(v) => setLangField('events', 'en', 'mainFeastBadge', v)} onAmChange={(v) => setLangField('events', 'am', 'mainFeastBadge', v)} />
              {d.events.en.events.map((ev, i) => (
                <div key={ev.id} className="admin-card">
                  <h3 className="admin-subheading">Event {i + 1}</h3>
                  <label className="admin-check">
                    <input type="checkbox" checked={ev.isMain} onChange={(e) => patch((x) => { x.events.en.events[i].isMain = e.target.checked; x.events.am.events[i].isMain = e.target.checked; return x; })} />
                    Main feast
                  </label>
                  <BilingualField label="Title" enValue={d.events.en.events[i].title} amValue={d.events.am.events[i].title} onEnChange={(v) => patch((x) => { x.events.en.events[i].title = v; return x; })} onAmChange={(v) => patch((x) => { x.events.am.events[i].title = v; return x; })} />
                  <BilingualField label="Date" enValue={d.events.en.events[i].date} amValue={d.events.am.events[i].date} onEnChange={(v) => patch((x) => { x.events.en.events[i].date = v; return x; })} onAmChange={(v) => patch((x) => { x.events.am.events[i].date = v; return x; })} />
                  <BilingualField label="Description" enValue={d.events.en.events[i].description} amValue={d.events.am.events[i].description} onEnChange={(v) => patch((x) => { x.events.en.events[i].description = v; return x; })} onAmChange={(v) => patch((x) => { x.events.am.events[i].description = v; return x; })} multiline />
                </div>
              ))}
            </>
          )}

          {tab === 'donate' && (
            <>
              <BilingualField label="Section tag" enValue={d.donate.en.sectionTag} amValue={d.donate.am.sectionTag} onEnChange={(v) => setLangField('donate', 'en', 'sectionTag', v)} onAmChange={(v) => setLangField('donate', 'am', 'sectionTag', v)} />
              <BilingualField label="Section title" enValue={d.donate.en.sectionTitle} amValue={d.donate.am.sectionTitle} onEnChange={(v) => setLangField('donate', 'en', 'sectionTitle', v)} onAmChange={(v) => setLangField('donate', 'am', 'sectionTitle', v)} />
              <BilingualField label="Intro" enValue={d.donate.en.intro} amValue={d.donate.am.intro} onEnChange={(v) => setLangField('donate', 'en', 'intro', v)} onAmChange={(v) => setLangField('donate', 'am', 'intro', v)} multiline />
              <BilingualField label="Zelle note" enValue={d.donate.en.zelleNote} amValue={d.donate.am.zelleNote} onEnChange={(v) => setLangField('donate', 'en', 'zelleNote', v)} onAmChange={(v) => setLangField('donate', 'am', 'zelleNote', v)} multiline />
              {d.donate.en.methods.map((method, i) => (
                <div key={method.id} className="admin-card">
                  <h3 className="admin-subheading">{method.id}</h3>
                  <BilingualField label="Bank name" enValue={d.donate.en.methods[i].bankName} amValue={d.donate.am.methods[i].bankName} onEnChange={(v) => patch((x) => { x.donate.en.methods[i].bankName = v; return x; })} onAmChange={(v) => patch((x) => { x.donate.am.methods[i].bankName = v; return x; })} />
                  <BilingualField label="Account name" enValue={d.donate.en.methods[i].accountName} amValue={d.donate.am.methods[i].accountName} onEnChange={(v) => patch((x) => { x.donate.en.methods[i].accountName = v; return x; })} onAmChange={(v) => patch((x) => { x.donate.am.methods[i].accountName = v; return x; })} />
                  <label className="admin-field-label">Account / email (shared)</label>
                  <input className="admin-input" value={method.accountNumber} onChange={(e) => patch((x) => { x.donate.en.methods[i].accountNumber = e.target.value; x.donate.am.methods[i].accountNumber = e.target.value; return x; })} />
                </div>
              ))}
            </>
          )}

          {tab === 'footer' && (
            <>
              <BilingualField label="Description" enValue={d.footer.en.description} amValue={d.footer.am.description} onEnChange={(v) => setLangField('footer', 'en', 'description', v)} onAmChange={(v) => setLangField('footer', 'am', 'description', v)} multiline />
              <BilingualField label="Sunday service" enValue={d.footer.en.sundayKidase} amValue={d.footer.am.sundayKidase} onEnChange={(v) => setLangField('footer', 'en', 'sundayKidase', v)} onAmChange={(v) => setLangField('footer', 'am', 'sundayKidase', v)} />
              <BilingualField label="Saturday service" enValue={d.footer.en.saturdayKidase} amValue={d.footer.am.saturdayKidase} onEnChange={(v) => setLangField('footer', 'en', 'saturdayKidase', v)} onAmChange={(v) => setLangField('footer', 'am', 'saturdayKidase', v)} />
              <BilingualField label="Weekday service" enValue={d.footer.en.weekdayKidase} amValue={d.footer.am.weekdayKidase} onEnChange={(v) => setLangField('footer', 'en', 'weekdayKidase', v)} onAmChange={(v) => setLangField('footer', 'am', 'weekdayKidase', v)} />
              <BilingualField label="Address" enValue={d.footer.en.address} amValue={d.footer.am.address} onEnChange={(v) => setLangField('footer', 'en', 'address', v)} onAmChange={(v) => setLangField('footer', 'am', 'address', v)} />
              <BilingualField label="Phone" enValue={d.footer.en.phone} amValue={d.footer.am.phone} onEnChange={(v) => setLangField('footer', 'en', 'phone', v)} onAmChange={(v) => setLangField('footer', 'am', 'phone', v)} />
              <BilingualField label="Email label" enValue={d.footer.en.email} amValue={d.footer.am.email} onEnChange={(v) => setLangField('footer', 'en', 'email', v)} onAmChange={(v) => setLangField('footer', 'am', 'email', v)} />
              <BilingualField label="Copyright" enValue={d.footer.en.copyright} amValue={d.footer.am.copyright} onEnChange={(v) => setLangField('footer', 'en', 'copyright', v)} onAmChange={(v) => setLangField('footer', 'am', 'copyright', v)} />
              <h3 className="admin-subheading">Social links</h3>
              {d.socials.map((s, i) => (
                <div key={s.id} className="admin-card">
                  <label className="admin-field-label">{s.label}</label>
                  <input className="admin-input" value={s.href} onChange={(e) => patch((x) => { x.socials[i].href = e.target.value; return x; })} />
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
