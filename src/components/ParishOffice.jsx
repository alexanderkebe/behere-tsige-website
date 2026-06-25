'use client';

import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { createClient } from '@/lib/supabase/client';

const T = {
  en: {
    tag: 'Parish Office',
    title: 'Parish Council',
    intro1: 'Thank you for visiting the website of Behere Tsige Mekane Selam St. Mary Ethiopian Orthodox Tewahedo Church. Ours is a community standing firm in faith, love, and fellowship — active and welcoming. The members of the parish council dedicate their time to serve, safeguarding our Orthodox Tewahedo Church. If you are new to the area or looking for ways to take part in the parish, you are most welcome! We are ready to serve you in spiritual ministry to the best of our ability.',
    intro2: 'The members of the Parish Council serve for three years. Three new members are elected from the congregation by a vote of the general assembly; two from the clergy by a vote of the clergy assembly; and one from the Sunday school. Join in membership to grow in faith, to serve, and to carry out the mission of the Church.',
    membersTitle: 'Parish Council Members',
    confessorTitle: 'Get in Contact with a Father Confessor',
    confessorQuote:
      '“Therefore confess your sins to each other and pray for each other so that you may be healed.” — James 5:16',
    confessorIntro:
      'Reach out in confidence. A father confessor will contact you to guide you in the sacrament of penance.',
    fathersTitle: 'Our Fathers',
    name: 'Your Name',
    phone: 'Phone',
    email: 'Email',
    preferred: 'Preferred Father (optional)',
    anyFather: 'No preference',
    message: 'Message',
    send: 'Send Request',
    sending: 'Sending…',
    success: 'Thank you. Your request has been received — a father will be in touch.',
    error: 'Something went wrong. Please try again.',
    emptyFathers: 'Father profiles will appear here soon.',
    emptyMembers: 'Office members will appear here soon.',
  },
  am: {
    tag: 'የደብር ጽ/ቤት',
    title: 'ሰበካ ጉባዔ',
    intro1: 'የብሔረ ጽጌ መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን ድህረ ገጽን ስለጎበኙ እናመሰግናለን። ካቴድራላችን በእምነት፣ ፍቅር እና ኅብረት በአላማ የቆመ እንዲሁም ንቁ እና እንግዳ ተቀባይ ማህበረሰብ ያለበት ነው። የሰበካው አባላት ኦርቶዶክሳዊት ተዋህዶ ቤተ ክርስቲያናችንን ጠብቆ ለማስጠበቅ የጊዜ አስራት በማውጣት ለአገልግሎት ቆመናል። ለአካባቢው አዲስ ከሆኑ ወይም የኢት/ኦ/ተ/ቤ/ክርስቲያን አጥቢያ የሚሳተፉበትን መንገድ እየፈለጉ ከሆነ እንኳን ደህና መጡ! ባለን አቅም በመንፈሳዊ አገልግሎት ልናገለግልዎ ዝግጁ ነን።',
    intro2: 'የሰበካ ጉባዔ አባላት ለሦስት ዓመታት ያገለግላሉ። ከምዕመናን 3 አዲስ ተመራጮች በጠቅላላ ጉባኤ ድምፅ አሰጣጥ፣ ከካህናት 2 ተመራጮች በካህናት ጉባኤ፣ ከሰንበት ትምህርት ቤት 1 ተመራጭ ይመረጣሉ። በእምነት ለማደግና ለማገልገል፣ የቤተ ክርስቲያኑን ተልእኮ ለማስፈጸም በአባልነት ይቀላቀሉ።',
    membersTitle: 'የሰበካ ጉባዔ አባላት',
    confessorTitle: 'ከንስሐ አባት ጋር ይገናኙ',
    confessorQuote:
      '“እርስ በርሳችሁ ኃጢአታችሁን ተናዘዙ፥ ትፈወሱም ዘንድ እርስ በርሳችሁ ጸልዩ።” — ያዕቆብ 5፥16',
    confessorIntro:
      'በመተማመን ያግኙን። የንስሐ አባት በንስሐ ሥርዓት ሊመሩዎት ያገኙዎታል።',
    fathersTitle: 'አባቶቻችን',
    name: 'ስምዎ',
    phone: 'ስልክ',
    email: 'ኢሜይል',
    preferred: 'የሚመርጡት አባት (በፈቃደኝነት)',
    anyFather: 'ምርጫ የለኝም',
    message: 'መልእክት',
    send: 'ጥያቄ ላክ',
    sending: 'በመላክ ላይ…',
    success: 'እናመሰግናለን። ጥያቄዎ ደርሶናል — አባት ያገኙዎታል።',
    error: 'የሆነ ስህተት ተፈጥሯል። እባክዎን እንደገና ይሞክሩ።',
    emptyFathers: 'የአባቶች መረጃ በቅርቡ ይታያል።',
    emptyMembers: 'የጽ/ቤት አባላት በቅርቡ ይታያሉ።',
  },
};

export default function ParishOffice({ lang, fathers = [], members = [] }) {
  const t = T[lang] || T.en;
  const [form, setForm] = useState({
    requester_name: '',
    phone: '',
    email: '',
    preferred_father_id: '',
    message: '',
  });
  const [state, setState] = useState('idle'); // idle | sending | sent | error

  const change = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('confessor_requests').insert({
        ...form,
        preferred_father_id: form.preferred_father_id || null,
      });
      if (error) throw error;
      setState('sent');
      setForm({ requester_name: '', phone: '', email: '', preferred_father_id: '', message: '' });
    } catch (err) {
      console.error('confessor request failed:', err?.message || err);
      setState('error');
    }
  };

  const fName = (f) => (lang === 'am' ? f.full_name_am || f.full_name_en : f.full_name_en);
  const fTitle = (f) => (lang === 'am' ? f.title_am || f.title_en : f.title_en);
  const fBio = (f) => (lang === 'am' ? f.bio_am || f.bio_en : f.bio_en);
  const mRole = (m) => (lang === 'am' ? m.role_am || m.role_en : m.role_en);

  return (
    <section id="parish" className="parish-section">
      <Reveal className="parish-header">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{t.tag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="parish-section-title">{t.title}</h2>
        <div className="parish-council-intro">
          <p>{t.intro1}</p>
          <p>{t.intro2}</p>
        </div>
      </Reveal>

      {/* Office members */}
      <Reveal className="parish-subhead" delay={60}>
        <h3 className="parish-subtitle">{t.membersTitle}</h3>
      </Reveal>
      <div className="parish-grid">
        {members.length === 0 && <p className="parish-empty">{t.emptyMembers}</p>}
        {members.map((m, i) => (
          <Reveal className="parish-card" key={m.id} delay={i * 80}>
            <div className="parish-avatar">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.full_name} />
              ) : (
                <span className="parish-avatar-initial">{(m.full_name || '?').charAt(0)}</span>
              )}
            </div>
            <div className="parish-card-name">{m.full_name}</div>
            <div className="parish-card-role">{mRole(m)}</div>
          </Reveal>
        ))}
      </div>

      {/* Fathers list */}
      <Reveal className="parish-subhead" delay={60}>
        <h3 className="parish-subtitle">{t.fathersTitle}</h3>
      </Reveal>
      <div className="fathers-grid">
        {fathers.length === 0 && <p className="parish-empty">{t.emptyFathers}</p>}
        {fathers.map((f, i) => (
          <Reveal className="father-profile-card" key={f.id} delay={i * 80}>
            <div className="father-profile-avatar">
              {f.photo_url ? (
                <img src={f.photo_url} alt={fName(f)} />
              ) : (
                <span className="parish-avatar-initial">{(fName(f) || '?').charAt(0)}</span>
              )}
            </div>
            <div className="father-profile-name">{fName(f)}</div>
            <div className="father-profile-title">{fTitle(f)}</div>
            {fBio(f) && <p className="father-profile-bio">{fBio(f)}</p>}
          </Reveal>
        ))}
      </div>

      {/* Father-Confessor contact — the heart of the page */}
      <Reveal className="confessor-block" delay={80}>
        <div className="confessor-intro-col">
          <h3 className="confessor-title">{t.confessorTitle}</h3>
          <blockquote className="confessor-quote">{t.confessorQuote}</blockquote>
          <p className="confessor-intro">{t.confessorIntro}</p>
        </div>

        <form className="confessor-form" onSubmit={submit}>
          <label className="contact-field">
            <span className="contact-field-label">{t.name}</span>
            <input className="contact-input" type="text" required value={form.requester_name} onChange={change('requester_name')} />
          </label>
          <div className="confessor-form-row">
            <label className="contact-field">
              <span className="contact-field-label">{t.phone}</span>
              <input className="contact-input" type="tel" value={form.phone} onChange={change('phone')} />
            </label>
            <label className="contact-field">
              <span className="contact-field-label">{t.email}</span>
              <input className="contact-input" type="email" value={form.email} onChange={change('email')} />
            </label>
          </div>
          <label className="contact-field">
            <span className="contact-field-label">{t.preferred}</span>
            <select className="contact-input" value={form.preferred_father_id} onChange={change('preferred_father_id')}>
              <option value="">{t.anyFather}</option>
              {fathers.filter((f) => f.is_confessor).map((f) => (
                <option key={f.id} value={f.id}>{fName(f)}</option>
              ))}
            </select>
          </label>
          <label className="contact-field">
            <span className="contact-field-label">{t.message}</span>
            <textarea className="contact-input contact-textarea" rows={4} value={form.message} onChange={change('message')} />
          </label>

          {state === 'sent' && <p className="confessor-success">{t.success}</p>}
          {state === 'error' && <p className="confessor-error">{t.error}</p>}

          <button type="submit" className="btn-contact-send" disabled={state === 'sending'}>
            {state === 'sending' ? t.sending : t.send}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
