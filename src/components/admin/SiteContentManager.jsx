'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import defaultContent from '../../data/defaultContent';
import { mergeContentShape } from '../../lib/contentShape';

/**
 * Edits every piece of site copy — all sections, all languages — stored in
 * the site_content table (one row per section, JSONB). The editor walks the
 * section's structure and renders an input for every text field, so anything
 * shown on the website (EN and AM alike) can be changed here. Saving upserts
 * the section row; the public site reads it back through /api/content.
 *
 * The section list comes from defaultContent, which mirrors exactly what the
 * site renders — every section here controls real, visible text.
 */

const SECTION_LABELS = {
  hero: 'Home — Hero Banner',
  about: 'Home — About / Our Journey',
  services: 'Services Page',
  churchSchool: 'Services — Church Education',
  events: 'Events Page',
  donate: 'Donate Page',
  media: 'Media Page',
  contact: 'Contact Page',
  footer: 'Footer',
  socials: 'Social Links',
};

const LANG_LABELS = { en: 'English', am: 'አማርኛ (Amharic)' };

const prettify = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

/* ---------- immutable helpers for deep paths ---------- */

function getAt(obj, path) {
  return path.reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function setAt(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  clone[head] = setAt(clone[head], rest, value);
  return clone;
}

function removeAt(obj, path) {
  const parentPath = path.slice(0, -1);
  const key = path[path.length - 1];
  const parent = getAt(obj, parentPath);
  if (Array.isArray(parent)) {
    const next = parent.filter((_, i) => i !== key);
    return setAt(obj, parentPath, next);
  }
  const { [key]: _omit, ...rest } = parent || {};
  return setAt(obj, parentPath, rest);
}

/** Blank copy of a value: same shape, empty strings (template for new array items). */
function blankOf(value) {
  if (typeof value === 'string') return '';
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blankOf(v)]));
  }
  return '';
}

/* ---------- recursive field editor ---------- */

function ValueEditor({ value, path, onChange, onRemove, label }) {
  if (typeof value === 'string') {
    const long = value.length > 70 || value.includes('\n');
    const isAm = path.includes('am');
    const cls = `admin-input${isAm ? ' admin-input-am' : ''}`;
    return (
      <div className="admin-field">
        {label != null && <label className="admin-field-label">{label}</label>}
        {long ? (
          <textarea
            className={cls}
            rows={Math.min(8, Math.max(2, Math.ceil(value.length / 80)))}
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          />
        ) : (
          <input className={cls} value={value} onChange={(e) => onChange(path, e.target.value)} />
        )}
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className="admin-field">
        {label != null && <label className="admin-field-label">{label}</label>}
        <input
          className="admin-input"
          type="number"
          value={value}
          onChange={(e) => onChange(path, Number(e.target.value) || 0)}
        />
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="admin-check">
        <input type="checkbox" checked={value} onChange={(e) => onChange(path, e.target.checked)} />
        {label}
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="admin-content-group">
        {label != null && <p className="admin-subheading">{label}</p>}
        {value.map((item, i) => (
          <div className="admin-content-item" key={i}>
            <div className="admin-content-item-head">
              <span className="admin-badge">#{i + 1}</span>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => onRemove([...path, i])}
              >
                Remove
              </button>
            </div>
            <ValueEditor value={item} path={[...path, i]} onChange={onChange} onRemove={onRemove} />
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            onChange([...path, value.length], value.length > 0 ? blankOf(value[value.length - 1]) : '')
          }
        >
          + Add item
        </button>
      </div>
    );
  }

  if (value && typeof value === 'object') {
    return (
      <div className="admin-content-group">
        {label != null && <p className="admin-subheading">{label}</p>}
        {Object.entries(value).map(([k, v]) => (
          <ValueEditor
            key={k}
            value={v}
            path={[...path, k]}
            onChange={onChange}
            onRemove={onRemove}
            label={prettify(k)}
          />
        ))}
      </div>
    );
  }

  return null;
}

/* ---------- section editor (one site_content row) ---------- */

function SectionEditor({ supabase, user, section, initialData, onBack, onSaved }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState(null);

  const onChange = useCallback((path, value) => {
    setData((d) => setAt(d, path, value));
    setSavedAt(null);
  }, []);

  const onRemove = useCallback((path) => {
    if (!window.confirm('Remove this item?')) return;
    setData((d) => removeAt(d, path));
    setSavedAt(null);
  }, []);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      // Confirm the session is still valid, then upsert and verify a row came
      // back — an expired admin session otherwise makes this silently no-op.
      const { data: sess } = await supabase.auth.getSession();
      if (!sess?.session) throw new Error('Your admin session has expired. Please sign out, sign back in, and try again.');
      const { data: rows, error: err } = await supabase
        .from('site_content')
        .upsert({ section, data, updated_at: new Date().toISOString(), updated_by: user?.id || null })
        .select();
      if (err) throw err;
      if (!rows || rows.length === 0) {
        throw new Error('The change did not save (the database rejected it). Your admin session may have expired — sign out, sign back in, and try again.');
      }
      setSavedAt(new Date());
      onSaved(section, data);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    if (!defaultContent[section]) return;
    if (!window.confirm('Replace the current text of this section with the built-in defaults? You still need to press Save.')) return;
    setData(defaultContent[section]);
    setSavedAt(null);
  };

  // Show language groups first (en, am), then everything else (gallery, lists…).
  const entries = useMemo(() => {
    if (Array.isArray(data) || typeof data !== 'object' || data === null) return null;
    const keys = Object.keys(data);
    const langs = keys.filter((k) => k === 'en' || k === 'am');
    const rest = keys.filter((k) => k !== 'en' && k !== 'am');
    return [...langs, ...rest];
  }, [data]);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>{SECTION_LABELS[section] || prettify(section)}</h2>
        <div className="admin-header-actions">
          <button className="admin-btn" onClick={onBack}>← All Sections</button>
          {defaultContent[section] != null && (
            <button className="admin-btn" onClick={resetToDefault}>Reset to defaults</button>
          )}
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save Section'}
          </button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {savedAt && <p className="admin-status">✓ Saved — the website now shows this text.</p>}

      <div className="admin-card">
        {entries ? (
          entries.map((k) => (
            <ValueEditor
              key={k}
              value={data[k]}
              path={[k]}
              onChange={onChange}
              onRemove={onRemove}
              label={LANG_LABELS[k] || prettify(k)}
            />
          ))
        ) : (
          <ValueEditor value={data} path={[]} onChange={onChange} onRemove={onRemove} />
        )}
      </div>

      <div className="admin-header-actions" style={{ marginTop: '1rem' }}>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Section'}
        </button>
      </div>
    </div>
  );
}

/* ---------- main manager ---------- */

export default function SiteContentManager({ supabase, user }) {
  const [rows, setRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase.from('site_content').select('section, data, updated_at');
    if (err) setError(err.message);
    else {
      const map = {};
      for (const r of data || []) map[r.section] = r;
      setRows(map);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  // Only sections the site actually renders (defaultContent is the source of
  // truth); stale DB rows for removed sections are hidden and ignored.
  const sections = useMemo(() => Object.keys(defaultContent), []);

  const onSaved = (section, data) => {
    setRows((r) => ({ ...r, [section]: { section, data, updated_at: new Date().toISOString() } }));
  };

  if (active) {
    return (
      <SectionEditor
        supabase={supabase}
        user={user}
        section={active}
        initialData={mergeContentShape(defaultContent[active], rows[active]?.data)}
        onBack={() => setActive(null)}
        onSaved={onSaved}
      />
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Site Content & Translations</h2>
      </div>
      <p className="admin-status">
        Every text on the website — in both English and Amharic — is edited here. Pick a section,
        change any field, and press Save; the site updates immediately.
      </p>
      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-status">Loading content…</p>
      ) : (
        <div className="admin-list">
          {sections.map((s) => {
            const row = rows[s];
            return (
              <div className="admin-row" key={s}>
                <div className="admin-row-main">
                  <div className="admin-row-title">
                    {SECTION_LABELS[s] || prettify(s)}
                    {!row && <span className="admin-badge">defaults — not saved yet</span>}
                  </div>
                  <div className="admin-row-sub">
                    {row?.updated_at
                      ? `Last updated ${new Date(row.updated_at).toLocaleString()}`
                      : 'Using built-in default text'}
                  </div>
                </div>
                <div className="admin-row-actions">
                  <button className="admin-btn" onClick={() => setActive(s)}>Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
