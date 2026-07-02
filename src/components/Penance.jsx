import React, { useState } from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

const PENANCE_STEPS = [
  {
    title: 'Find a Penance Father',
    titleAm: 'የንስሐ አባት ይያዙ',
    desc: 'In the Ethiopian Orthodox Tewahedo Church, the "Penance Father" is often referred to as the priest or father-confessor. This priest plays a crucial role in the sacrament of Penance, where he listens to the penitent\'s confession, offers spiritual guidance, and grants absolution in the name of the Holy Trinity. If you don\'t have a penance father, the church highly recommends to explore and get your own penance father from your parish.',
    descAm: 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን "የንስሐ አባት" ብዙ ጊዜ ካህን ወይም የነፍስ-አባት ተብሎ ይጠራል። ይህ ካህን የንስሐን ኑዛዜ በሚያዳምጥበት፣ መንፈሳዊ መመሪያ ለንስሃ ልጁ በሚሰጥበት እና በቅድስት ሥላሴ ስም የጸሎት ፍጻሜ በሚሰጥበት የንስሐ ቁርባን ውስጥ ጉልህ ሚና ይጫወታል። የንስሐ አባት ከሌልዎት፣ ዛሬውኑ እንዲኖርዎት ቤተ ክርስቲያኒቱ አጥብቃ ትመክራለች እናም የአጥቢያው አባል ወይም ተገልጋይ ምዕመን ከሆኑ የራስዎን የንስሐ አባት ከካቴድራሉ ይያዙ።',
  },
  {
    title: 'Confess Sins',
    titleAm: 'ሃጢአትን ይናዘዙ',
    desc: 'The penitent confesses their sins to the priest, acknowledging their wrongdoings and expressing genuine remorse.',
    descAm: 'ንስሐ የገቡ ሰዎች ኃጢአታቸውን ለካህኑ ይናዘዛሉ፣ ስህተታቸውን አምነው እውነተኛ ጸጸታቸውን ይገልጻሉ። «መንግሥተ ሰማያት ቀርባለችና ንስሐ ግቡ» የማቴዎስ ወንጌል ምዕራፍ ፫፥፩',
    links: [
      { label: '📱 Use this app as a guide (for first-timers)', labelAm: '📱 ለጀማሪዎች እንደ መመሪያ ይህን መተግበሪያ ይጠቀሙ', url: 'https://www.confessionplanner.copticcollection.com/' },
      { label: '📄 Download the Confession Guide PDF', labelAm: '📄 የንስሐ መመሪያ ፒዲኤፍ (PDF) ያውርዱ', url: '/assets/confession pdf.pdf' },
      { label: '📖 Buy the Confession Book on Amazon', labelAm: '📖 የንስሐ መጽሐፍን ከአማዞን ይግዙ', url: 'https://www.amazon.com/Holy-Mystery-Confession-confession-teenagers/dp/B0F5QBN5W3' },
    ]
  },
  {
    title: 'Get a Prayer of Repentance',
    titleAm: 'ጸሎተ ንስሃ ይቀበሉ',
    desc: 'The priest leads the penitent in a prayer asking for God\'s forgiveness. This prayer often includes asking for the Holy Spirit to guide and strengthen the penitent in their journey of repentance.',
    descAm: 'የንስሃ አባትዎ የእግዚአብሔርን ምህረት እና ይቅርታ በመጠየቅ በጸሎተ ንስሃ ይመራል። ይህ ጸሎት ብዙውን ጊዜ በቅዳሴ መካከል ሲጸለይ ሰምተዋል። በጸሎቱ ንስሃ የገቡ/የሚገቡ ሰዎች መንፈስ ቅዱስ እንዲመራቸው እና ሃጢአታቸውን ይቅር እንዲላቸው ካህኑ በተደጋጋሚ ያሳስባል።'
  },
  {
    title: 'Get Absolution',
    titleAm: 'ኑዛዜ ይቀበሉ',
    desc: 'The priest pronounces absolution, declaring that the penitent\'s sins are forgiven in the name of the Holy Trinity.',
    descAm: 'በንስሃ ህይወት ለቀረቡ ሰዎች ካህኑ የኃጢያታቸው ማስተስረያ በኢየሱስ ክርስቶስ ስም እንደተሰረየላቸው በመግለጽ ይናገራል።'
  },
  {
    title: 'Receive a Penitential Acts',
    titleAm: 'ቀኖና ይቀበሉ',
    desc: 'The penitent may be assigned certain acts of penance, such as fasting, prayer, or almsgiving, to demonstrate their commitment to turning away from sin and living a more righteous life.',
    descAm: 'ንስሐ የገቡ ሰዎች ከኃጢአት ለመራቅ እና ዳግም ላለመበደል የበለጠ በጽድቅ ሕይወት ለመኖር ያላቸውን ቁርጠኝነት ለማሳየት እንደ ቤተ ክርስቲያኒቱ ስርዓት መሠረት ካህኑ ቀኖና ይሰጣል። ከነዚህም መካከል ጾም፣ ጸሎት ወይም እንደ ምጽዋት ያሉ አንዳንድ የንስሐ ሥራዎችን ንስሃ ለገባው ሰው ካህኑ ሊሰጥ ይችላል።'
  },
  {
    title: 'Get Blessed',
    titleAm: 'ቡራኬ ይቀበሉ',
    desc: 'The priest concludes the sacrament with a blessing, encouraging the penitent to continue their spiritual journey with faith and devotion.',
    descAm: 'ንስሃ አባትዎ በንስሃ ህይወት በመመለስዎ የተሰማውን ደስታ ይገልጻል የንስሃ ሂደቱን በቡራኬ ያጠናቅቃል። በቀጣይም በእምነት እና በታማኝነት መንፈሳዊ ጉዞዎን እንዲቀጥሉ ያበረታታል።'
  }
];

export default function Penance({ settings = {}, fathers = [] }) {
  const { lang } = useLanguage();
  const penanceInfo = settings.penance_resources || {};

  const isAm = lang === 'am';
  const sectionTitle = isAm ? 'ምሥጢረ ንስሐ (Penance Services)' : 'Penance Services';

  const fName = (f) => (isAm ? f.full_name_am || f.full_name_en : f.full_name_en);
  const fTitle = (f) => (isAm ? f.title_am || f.title_en : f.title_en);
  const fBio = (f) => (isAm ? f.bio_am || f.bio_en : f.bio_en);
  // Only fathers who hear confession belong on the penance page, when flagged.
  const penanceFathers = fathers.filter((f) => f.is_confessor || f.is_penance_father);
  const listedFathers = penanceFathers.length > 0 ? penanceFathers : fathers;

  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredFather: '', message: '' });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Father Confessor Request: ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nPreferred Father: ${form.preferredFather || 'No preference'}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  return (
    <section id="penance" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Intro */}
        <Reveal direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-dark)', margin: 0 }}>
            {isAm 
              ? 'እንኳን ወደ ንስሐ አገልግሎት ገጻችን በደህና መጡ። አገልግሎቱ ምዕመናን ኃጢአታቸውን ለካህን እንዲናዘዙ እና ከአምላካቸው ይቅርታ እንዲቀበሉ ያስችላቸዋል። በተለይ ምዕመናን በቅዱስ ቁርባን ከመሳተፋቸው በፊት መደረግ ስለሚገባው ዝግጅት እና በዘላቂ የክርስትና ህይወት ጉዟቸው የንስሃ አባት ክትትል የሚያገኙበትን መንገድ በትምህርተ ንስሃ እንዲያጸኑ እና ዘለዓለማዊ ሕይወት የሚያገኙበትን መንገድ የሚያሳይ ነው።' 
              : 'Welcome to our penance services Page. The service allows believers to confess their sins to a priest and receive absolution. It\'s a way for individuals to seek forgiveness and return to a state of grace, especially before participating in the Holy Communion.'}
          </p>
        </Reveal>

        {/* Process Steps */}
        <div style={{ position: 'relative' }}>
          <h3 style={{ textAlign: 'center', color: 'var(--navy)', fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '2.5rem' }}>
            {isAm ? 'የንስሃ ሂደቶች' : 'Penance Process'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {PENANCE_STEPS.map((step, index) => (
              <Reveal key={index} delay={index * 100} direction={index % 2 === 0 ? 'left' : 'right'} as="div" className="nested-content-card penance-step" style={{
                display: 'flex',
                gap: '1.5rem',
                borderLeft: '4px solid var(--gold)',
                alignItems: 'flex-start'
              }}>
                <div className="penance-step-num" style={{
                  minWidth: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--navy)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>{isAm ? step.titleAm : step.title}</h4>
                  <p style={{ margin: '0', lineHeight: '1.7', color: 'var(--text-dark)', opacity: 0.85 }}>{isAm ? step.descAm : step.desc}</p>
                  
                  {step.links && (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {step.links.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-block',
                          color: 'var(--gold-dark)',
                          textDecoration: 'none',
                          fontWeight: '600',
                          padding: '0.4rem 0.8rem',
                          backgroundColor: 'rgba(197, 160, 68, 0.08)',
                          borderRadius: '4px',
                          border: '1px solid rgba(197, 160, 68, 0.2)',
                          fontSize: '0.9rem',
                          width: 'fit-content'
                        }}>
                          {isAm ? (link.labelAm || link.label) : link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Our Penance Fathers */}
        {listedFathers.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--navy)', fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '2.5rem' }}>
              {isAm ? 'የንስሐ አባቶቻችን' : 'Our Penance Fathers'}
            </h3>
            <div className="fathers-grid">
              {listedFathers.map((f, i) => (
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
          </div>
        )}

        {/* Contact Form */}
        <Reveal as="div" direction="up" className="form-container-card" style={{ maxWidth: '600px', marginTop: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--navy)', margin: '0 0 1rem 0', fontSize: '1.6rem', fontFamily: 'var(--font-heading)' }}>
              {isAm ? 'ከነፍስ አባት ጋር ይገናኙ' : 'Get in Contact with a Father Confessor'}
            </h3>
            <blockquote className="scripture-blockquote" style={{ margin: '0 0 1.5rem 0' }}>
              {isAm 
                ? '«እርስ በርሳችሁ በኃጢአታችሁ ተናዘዙ፥ ትፈወሱም ዘንድ እያንዳንዱ ስለ ሌላው ይጸልይ።» — ያዕቆብ ፭፥፲፮' 
                : '“Therefore confess your sins to each other and pray for each other so that you may be healed.” — James 5:16'}
            </blockquote>
            <p style={{ color: 'var(--text-dark)', lineHeight: '1.6', fontSize: '0.95rem', opacity: 0.85 }}>
              {isAm 
                ? 'በእምነት ያነጋግሩን። በንስሐ ምሥጢር እንዲመሩዎት የነፍስ አባት ያነጋግርዎታል።' 
                : 'Reach out in confidence. A father confessor will contact you to guide you in the sacrament of penance.'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="services-form" style={{ gridTemplateColumns: '1fr' }}>
            <label className="form-label-field">
              <span>{isAm ? 'ስም' : 'Your Name'} *</span>
              <input type="text" required value={form.name} onChange={handleChange('name')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'ስልክ' : 'Phone'} *</span>
              <input type="tel" required value={form.phone} onChange={handleChange('phone')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'ኢሜይል' : 'Email'} *</span>
              <input type="email" required value={form.email} onChange={handleChange('email')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'የሚመርጡት አባት (አማራጭ)' : 'Preferred Father (optional)'}</span>
              <select value={form.preferredFather} onChange={handleChange('preferredFather')} className="form-select-field">
                <option value="">{isAm ? 'ምንም ምርጫ የለኝም' : 'No preference'}</option>
                {listedFathers.map((f) => (
                  <option key={f.id} value={fName(f)}>{fName(f)}</option>
                ))}
              </select>
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'መልእክት' : 'Message'} *</span>
              <textarea required rows={4} value={form.message} onChange={handleChange('message')} className="form-textarea-field" />
            </label>

            <button type="submit" className="form-submit-btn">
              {isAm ? 'ጥያቄውን ላክ' : 'Send Request'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
