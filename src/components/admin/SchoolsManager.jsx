'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { uploadImage } from '@/lib/admin/upload';
import { saveRow, deleteRow, saveConfig } from '@/lib/admin/db';

const EMPTY_TEAM = { name: '', role_en: '', role_am: '', photo_url: '', bio_en: '', bio_am: '', display_order: 0 };
const EMPTY_PROJECT = { title_en: '', title_am: '', description_en: '', description_am: '', type: 'event', event_date: '', poster_url: '', status: 'upcoming' };
const EMPTY_DEPT = { name_en: '', name_am: '', description_en: '', description_am: '', display_order: 0 };
const EMPTY_ABNET_EVENT = { title_en: '', title_am: '', description_en: '', description_am: '', event_date: '', poster_url: '' };

export default function SchoolsManager({ supabase }) {
  const [subTab, setSubTab] = useState('ss_team'); // ss_team | ss_projects | ss_depts | abnet_events | configs
  
  // Lists
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [depts, setDepts] = useState([]);
  const [abnetEvents, setAbnetEvents] = useState([]);

  // Configs
  const [ssConfig, setSsConfig] = useState({ message_en: '', message_am: '', plan_en: '', plan_am: '' });
  const [abnetConfig, setAbnetConfig] = useState({ mission_en: '', mission_am: '', vision_en: '', vision_am: '' });
  const [baptismConfig, setBaptismConfig] = useState({ infant_track_en: '', infant_track_am: '', catechumen_track_en: '', catechumen_track_am: '' });
  const [penanceConfig, setPenanceConfig] = useState({ application_url: '#', guide_booklet_url: '#' });

  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAllLists = useCallback(async () => {
    const [teamRes, projRes, deptRes, abnetRes] = await Promise.all([
      supabase.from('ss_team').select('*').order('display_order'),
      supabase.from('ss_projects').select('*').order('event_date', { ascending: false }),
      supabase.from('ss_departments').select('*').order('display_order'),
      supabase.from('abnet_events').select('*').order('event_date', { ascending: false })
    ]);

    if (teamRes.error) throw teamRes.error;
    if (projRes.error) throw projRes.error;
    if (deptRes.error) throw deptRes.error;
    if (abnetRes.error) throw abnetRes.error;

    setTeam(teamRes.data || []);
    setProjects(projRes.data || []);
    setDepts(deptRes.data || []);
    setAbnetEvents(abnetRes.data || []);
  }, [supabase]);

  const loadConfigs = useCallback(async () => {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data) {
      data.forEach(row => {
        if (row.key === 'sunday_school') setSsConfig(row.value || {});
        if (row.key === 'abnet') setAbnetConfig(row.value || {});
        if (row.key === 'baptism_info') setBaptismConfig(row.value || {});
        if (row.key === 'penance_resources') setPenanceConfig(row.value || {});
      });
    }
  }, [supabase]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await Promise.all([loadAllLists(), loadConfigs()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadAllLists, loadConfigs]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const onPhotoUpload = async (e, folderName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError('');
    try {
      const url = await uploadImage(supabase, folderName, file);
      change(folderName === 'ss_team' ? 'photo_url' : 'poster_url', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveRecord = async (e, tableName) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...editing };
    
    if ('display_order' in payload) {
      payload.display_order = Number(payload.display_order) || 0;
    }

    try {
      await saveRow(supabase, tableName, payload);
      setEditing(null);
      await loadAllLists();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeRecord = async (item, tableName) => {
    const name = item.name || item.title_en || item.name_en;
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteRow(supabase, tableName, item.id); await loadAllLists(); }
    catch (err) { setError(err.message); }
  };

  const saveAllConfigs = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await saveConfig(supabase, 'sunday_school', ssConfig);
      await saveConfig(supabase, 'abnet', abnetConfig);
      await saveConfig(supabase, 'baptism_info', baptismConfig);
      await saveConfig(supabase, 'penance_resources', penanceConfig);
      setSuccess('All settings configurations updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (editing && subTab === 'ss_team') {
    const t = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{t.id ? 'Edit Team Member' : 'New Team Member'}</h2>
          <div className="admin-header-actions"><button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button></div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-card" onSubmit={(e) => saveRecord(e, 'ss_team')}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview">
              {t.photo_url ? <img src={t.photo_url} alt="" /> : <span>No photo</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload Photo'}
              <input type="file" accept="image/*" hidden onChange={(e) => onPhotoUpload(e, 'ss_team')} />
            </label>
          </div>

          <div className="admin-grid-2">
            <Field label="Full Name"><input className="admin-input" required value={t.name} onChange={(e) => change('name', e.target.value)} /></Field>
            <Field label="Display Order"><input className="admin-input" type="number" required value={t.display_order} onChange={(e) => change('display_order', e.target.value)} /></Field>
            <Field label="Role (EN)"><input className="admin-input" value={t.role_en || ''} onChange={(e) => change('role_en', e.target.value)} /></Field>
            <Field label="Role (AM)"><input className="admin-input admin-input-am" value={t.role_am || ''} onChange={(e) => change('role_am', e.target.value)} /></Field>
            <Field label="Bio (EN)"><textarea className="admin-input" rows={3} value={t.bio_en || ''} onChange={(e) => change('bio_en', e.target.value)} /></Field>
            <Field label="Bio (AM)"><textarea className="admin-input admin-input-am" rows={3} value={t.bio_am || ''} onChange={(e) => change('bio_am', e.target.value)} /></Field>
          </div>
          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Member'}</button>
        </form>
      </div>
    );
  }

  if (editing && subTab === 'ss_projects') {
    const p = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{p.id ? 'Edit Project/Event' : 'New Project/Event'}</h2>
          <div className="admin-header-actions"><button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button></div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-card" onSubmit={(e) => saveRecord(e, 'ss_projects')}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview" style={{ borderRadius: '6px', width: '120px', height: '80px' }}>
              {p.poster_url ? <img src={p.poster_url} alt="" /> : <span>No poster</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload Poster'}
              <input type="file" accept="image/*" hidden onChange={(e) => onPhotoUpload(e, 'ss_projects')} />
            </label>
          </div>

          <div className="admin-grid-2">
            <Field label="Title (EN)"><input className="admin-input" required value={p.title_en} onChange={(e) => change('title_en', e.target.value)} /></Field>
            <Field label="Title (AM)"><input className="admin-input admin-input-am" value={p.title_am || ''} onChange={(e) => change('title_am', e.target.value)} /></Field>
            
            <Field label="Type">
              <select className="admin-input" value={p.type} onChange={(e) => change('type', e.target.value)}>
                <option value="event">Event</option>
                <option value="project">Project</option>
              </select>
            </Field>

            <Field label="Status">
              <select className="admin-input" value={p.status} onChange={(e) => change('status', e.target.value)}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </Field>

            <Field label="Event Date">
              <input className="admin-input" type="date" value={p.event_date || ''} onChange={(e) => change('event_date', e.target.value)} />
            </Field>
          </div>

          <div className="admin-grid-2">
            <Field label="Description (EN)"><textarea className="admin-input" rows={3} value={p.description_en || ''} onChange={(e) => change('description_en', e.target.value)} /></Field>
            <Field label="Description (AM)"><textarea className="admin-input admin-input-am" rows={3} value={p.description_am || ''} onChange={(e) => change('description_am', e.target.value)} /></Field>
          </div>
          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Project'}</button>
        </form>
      </div>
    );
  }

  if (editing && subTab === 'ss_depts') {
    const d = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{d.id ? 'Edit Department' : 'New Department'}</h2>
          <div className="admin-header-actions"><button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button></div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-card" onSubmit={(e) => saveRecord(e, 'ss_departments')}>
          <div className="admin-grid-2">
            <Field label="Dept Name (EN)"><input className="admin-input" required value={d.name_en} onChange={(e) => change('name_en', e.target.value)} /></Field>
            <Field label="Dept Name (AM)"><input className="admin-input admin-input-am" value={d.name_am || ''} onChange={(e) => change('name_am', e.target.value)} /></Field>
            <Field label="Display Order"><input className="admin-input" type="number" required value={d.display_order} onChange={(e) => change('display_order', e.target.value)} /></Field>
          </div>
          <div className="admin-grid-2">
            <Field label="Description (EN)"><textarea className="admin-input" rows={3} value={d.description_en || ''} onChange={(e) => change('description_en', e.target.value)} /></Field>
            <Field label="Description (AM)"><textarea className="admin-input admin-input-am" rows={3} value={d.description_am || ''} onChange={(e) => change('description_am', e.target.value)} /></Field>
          </div>
          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Department'}</button>
        </form>
      </div>
    );
  }

  if (editing && subTab === 'abnet_events') {
    const ae = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{ae.id ? 'Edit Abnet Event' : 'New Abnet Event'}</h2>
          <div className="admin-header-actions"><button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button></div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-card" onSubmit={(e) => saveRecord(e, 'abnet_events')}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview" style={{ borderRadius: '6px', width: '120px', height: '80px' }}>
              {ae.poster_url ? <img src={ae.poster_url} alt="" /> : <span>No poster</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload Poster'}
              <input type="file" accept="image/*" hidden onChange={(e) => onPhotoUpload(e, 'abnet_events')} />
            </label>
          </div>

          <div className="admin-grid-2">
            <Field label="Title (EN)"><input className="admin-input" required value={ae.title_en} onChange={(e) => change('title_en', e.target.value)} /></Field>
            <Field label="Title (AM)"><input className="admin-input admin-input-am" value={ae.title_am || ''} onChange={(e) => change('title_am', e.target.value)} /></Field>
            <Field label="Event Date"><input className="admin-input" type="date" value={ae.event_date || ''} onChange={(e) => change('event_date', e.target.value)} /></Field>
          </div>
          <div className="admin-grid-2">
            <Field label="Description (EN)"><textarea className="admin-input" rows={3} value={ae.description_en || ''} onChange={(e) => change('description_en', e.target.value)} /></Field>
            <Field label="Description (AM)"><textarea className="admin-input admin-input-am" rows={3} value={ae.description_am || ''} onChange={(e) => change('description_am', e.target.value)} /></Field>
          </div>
          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Event'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h2>Education & Schools</h2>
        <div className="admin-header-actions">
          {subTab === 'ss_team' && <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY_TEAM })} >+ Add Team Member</button>}
          {subTab === 'ss_projects' && <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY_PROJECT })} >+ Add Project/Event</button>}
          {subTab === 'ss_depts' && <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY_DEPT })} >+ Add Department</button>}
          {subTab === 'abnet_events' && <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY_ABNET_EVENT })} >+ Add Abnet Event</button>}
        </div>
      </div>

      {/* Sub tabs selector */}
      <div style={{ display: 'flex', gap: '16px', padding: '0 32px 16px 32px', borderBottom: '1px solid #e2e6ef', background: '#fff', position: 'sticky', top: '70px', zIndex: 9, flexWrap: 'wrap' }}>
        <button className="admin-link-btn" onClick={() => setSubTab('ss_team')} style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: subTab === 'ss_team' ? 'bold' : 'normal', color: subTab === 'ss_team' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'ss_team' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          SS Team
        </button>
        <button className="admin-link-btn" onClick={() => setSubTab('ss_projects')} style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: subTab === 'ss_projects' ? 'bold' : 'normal', color: subTab === 'ss_projects' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'ss_projects' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          SS Projects/Events
        </button>
        <button className="admin-link-btn" onClick={() => setSubTab('ss_depts')} style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: subTab === 'ss_depts' ? 'bold' : 'normal', color: subTab === 'ss_depts' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'ss_depts' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          SS Departments
        </button>
        <button className="admin-link-btn" onClick={() => setSubTab('abnet_events')} style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: subTab === 'abnet_events' ? 'bold' : 'normal', color: subTab === 'abnet_events' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'abnet_events' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          Abnet Events
        </button>
        <button className="admin-link-btn" onClick={() => setSubTab('configs')} style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: subTab === 'configs' ? 'bold' : 'normal', color: subTab === 'configs' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'configs' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          General School & Sacraments Settings
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-status ok" style={{ color: '#2e7d32', fontWeight: 'bold' }}>{success}</p>}
        
        {loading ? (
          <p className="admin-status">Loading data…</p>
        ) : subTab === 'ss_team' ? (
          <div className="admin-list">
            {team.length === 0 && <p className="admin-status">No Sunday School team members added.</p>}
            {team.map((t) => (
              <div className="admin-row" key={t.id}>
                <div className="admin-row-thumb">
                  {t.photo_url ? <img src={t.photo_url} alt="" /> : <span>👤</span>}
                </div>
                <div className="admin-row-main">
                  <div className="admin-row-title">{t.name} <span className="admin-badge">order {t.display_order}</span></div>
                  <div className="admin-row-sub">Role: {t.role_en || '—'} | Role (AM): {t.role_am || '—'}</div>
                </div>
                <div className="admin-row-actions">
                  <button className="admin-btn" onClick={() => setEditing({ ...t })}>Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => removeRecord(t, 'ss_team')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : subTab === 'ss_projects' ? (
          <div className="admin-list">
            {projects.length === 0 && <p className="admin-status">No Sunday School projects/events added.</p>}
            {projects.map((p) => (
              <div className="admin-row" key={p.id}>
                <div className="admin-row-thumb">
                  {p.poster_url ? <img src={p.poster_url} alt="" /> : <span>📋</span>}
                </div>
                <div className="admin-row-main">
                  <div className="admin-row-title">
                    {p.title_en}
                    <span className="admin-badge" style={{ textTransform: 'capitalize' }}>{p.type}</span>
                    <span className="admin-badge" style={{ backgroundColor: p.status === 'completed' ? '#d0f8d0' : '#fdf0d0', color: p.status === 'completed' ? '#1b5e20' : '#827717' }}>{p.status}</span>
                  </div>
                  <div className="admin-row-sub">Amharic: {p.title_am || '—'} | Date: {p.event_date || 'Ongoing'}</div>
                </div>
                <div className="admin-row-actions">
                  <button className="admin-btn" onClick={() => setEditing({ ...p })}>Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => removeRecord(p, 'ss_projects')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : subTab === 'ss_depts' ? (
          <div className="admin-list">
            {depts.length === 0 && <p className="admin-status">No Sunday School departments defined.</p>}
            {depts.map((d) => (
              <div className="admin-row" key={d.id}>
                <div className="admin-row-thumb" style={{ background: '#f8f6f0', color: 'var(--navy)' }}>🏫</div>
                <div className="admin-row-main">
                  <div className="admin-row-title">{d.name_en} <span className="admin-badge">order {d.display_order}</span></div>
                  <div className="admin-row-sub">Amharic: {d.name_am || '—'}</div>
                </div>
                <div className="admin-row-actions">
                  <button className="admin-btn" onClick={() => setEditing({ ...d })}>Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => removeRecord(d, 'ss_departments')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : subTab === 'abnet_events' ? (
          <div className="admin-list">
            {abnetEvents.length === 0 && <p className="admin-status">No Abnet School events defined.</p>}
            {abnetEvents.map((ae) => (
              <div className="admin-row" key={ae.id}>
                <div className="admin-row-thumb">
                  {ae.poster_url ? <img src={ae.poster_url} alt="" /> : <span>📜</span>}
                </div>
                <div className="admin-row-main">
                  <div className="admin-row-title">{ae.title_en}</div>
                  <div className="admin-row-sub">Amharic: {ae.title_am || '—'} | Date: {ae.event_date || '—'}</div>
                </div>
                <div className="admin-row-actions">
                  <button className="admin-btn" onClick={() => setEditing({ ...ae })}>Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => removeRecord(ae, 'abnet_events')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form className="admin-card" onSubmit={saveAllConfigs}>
            <h3 className="admin-subheading" style={{ borderBottom: '1px solid #e2e6ef', paddingBottom: '8px', marginBottom: '16px' }}>Sunday School Config</h3>
            <div className="admin-grid-2">
              <Field label="Sunday School Welcome Message (EN)"><textarea className="admin-input" rows={2} value={ssConfig.message_en || ''} onChange={(e) => setSsConfig(prev => ({ ...prev, message_en: e.target.value }))} /></Field>
              <Field label="Sunday School Welcome Message (AM)"><textarea className="admin-input admin-input-am" rows={2} value={ssConfig.message_am || ''} onChange={(e) => setSsConfig(prev => ({ ...prev, message_am: e.target.value }))} /></Field>
              <Field label="School Plan (EN)"><textarea className="admin-input" rows={2} value={ssConfig.plan_en || ''} onChange={(e) => setSsConfig(prev => ({ ...prev, plan_en: e.target.value }))} /></Field>
              <Field label="School Plan (AM)"><textarea className="admin-input admin-input-am" rows={2} value={ssConfig.plan_am || ''} onChange={(e) => setSsConfig(prev => ({ ...prev, plan_am: e.target.value }))} /></Field>
            </div>

            <h3 className="admin-subheading" style={{ borderBottom: '1px solid #e2e6ef', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>Abnet School Config</h3>
            <div className="admin-grid-2">
              <Field label="Abnet Mission (EN)"><textarea className="admin-input" rows={2} value={abnetConfig.mission_en || ''} onChange={(e) => setAbnetConfig(prev => ({ ...prev, mission_en: e.target.value }))} /></Field>
              <Field label="Abnet Mission (AM)"><textarea className="admin-input admin-input-am" rows={2} value={abnetConfig.mission_am || ''} onChange={(e) => setAbnetConfig(prev => ({ ...prev, mission_am: e.target.value }))} /></Field>
              <Field label="Abnet Vision (EN)"><textarea className="admin-input" rows={2} value={abnetConfig.vision_en || ''} onChange={(e) => setAbnetConfig(prev => ({ ...prev, vision_en: e.target.value }))} /></Field>
              <Field label="Abnet Vision (AM)"><textarea className="admin-input admin-input-am" rows={2} value={abnetConfig.vision_am || ''} onChange={(e) => setAbnetConfig(prev => ({ ...prev, vision_am: e.target.value }))} /></Field>
            </div>

            <h3 className="admin-subheading" style={{ borderBottom: '1px solid #e2e6ef', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>Holy Baptism Settings</h3>
            <div className="admin-grid-2">
              <Field label="Infant Track Description (EN)"><textarea className="admin-input" rows={2} value={baptismConfig.infant_track_en || ''} onChange={(e) => setBaptismConfig(prev => ({ ...prev, infant_track_en: e.target.value }))} /></Field>
              <Field label="Infant Track Description (AM)"><textarea className="admin-input admin-input-am" rows={2} value={baptismConfig.infant_track_am || ''} onChange={(e) => setBaptismConfig(prev => ({ ...prev, infant_track_am: e.target.value }))} /></Field>
              <Field label="Catechumen Track Description (EN)"><textarea className="admin-input" rows={2} value={baptismConfig.catechumen_track_en || ''} onChange={(e) => setBaptismConfig(prev => ({ ...prev, catechumen_track_en: e.target.value }))} /></Field>
              <Field label="Catechumen Track Description (AM)"><textarea className="admin-input admin-input-am" rows={2} value={baptismConfig.catechumen_track_am || ''} onChange={(e) => setBaptismConfig(prev => ({ ...prev, catechumen_track_am: e.target.value }))} /></Field>
            </div>

            <h3 className="admin-subheading" style={{ borderBottom: '1px solid #e2e6ef', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>Penance/Confession Resources</h3>
            <div className="admin-grid-2">
              <Field label="Penance Application PDF URL"><input className="admin-input" value={penanceConfig.application_url || ''} onChange={(e) => setPenanceConfig(prev => ({ ...prev, application_url: e.target.value }))} /></Field>
              <Field label="Confession Guide Booklet PDF URL"><input className="admin-input" value={penanceConfig.guide_booklet_url || ''} onChange={(e) => setPenanceConfig(prev => ({ ...prev, guide_booklet_url: e.target.value }))} /></Field>
            </div>

            <button className="admin-btn admin-btn-primary" disabled={saving} style={{ marginTop: '20px' }}>{saving ? 'Saving Configs…' : 'Save All Settings'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="admin-field">
      <label className="admin-field-label">{label}</label>
      {children}
    </div>
  );
}
