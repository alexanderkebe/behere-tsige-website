import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';



export default function ChurchSchool({ lang }) {
  const { content } = useContent();
  const c = content.churchSchool[lang] || content.churchSchool.en;
  const isAm = lang === 'am';
  const [subTab, setSubTab] = useState('abnet');

  // Forms States
  const [abnetForm, setAbnetForm] = useState({
    studentName: '',
    age: '',
    parentName: '',
    level: 'Beginner',
    phone: '',
    email: '',
    message: ''
  });

  const [sundayForm, setSundayForm] = useState({
    studentName: '',
    age: '',
    parentName: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleAbnetFormChange = (field) => (e) => {
    setAbnetForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSundayFormChange = (field) => (e) => {
    setSundayForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAbnetRegister = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Ye'abinet Timhirt Registration: ${abnetForm.studentName}`);
    const body = encodeURIComponent(
      `Student Full Name: ${abnetForm.studentName}\n` +
      `Age: ${abnetForm.age}\n` +
      `Parent/Guardian Name: ${abnetForm.parentName || 'N/A'}\n` +
      `Selected Level: ${abnetForm.level}\n` +
      `Phone: ${abnetForm.phone}\n` +
      `Email: ${abnetForm.email || 'N/A'}\n\n` +
      `Message/Additional Info:\n${abnetForm.message || 'None'}`
    );
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  const handleSundayRegister = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Sunday School Registration: ${sundayForm.studentName}`);
    const body = encodeURIComponent(
      `Student Full Name: ${sundayForm.studentName}\n` +
      `Age: ${sundayForm.age}\n` +
      `Parent/Guardian Name: ${sundayForm.parentName || 'N/A'}\n` +
      `Phone: ${sundayForm.phone}\n` +
      `Email: ${sundayForm.email || 'N/A'}\n\n` +
      `Message/Additional Info:\n${sundayForm.message || 'None'}`
    );
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  return (
    <section id="church-school" className={`cs-section ${isAm ? 'lang-am' : ''}`}>
      {/* Section header */}
      <Reveal className="cs-header">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{c.sectionTag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="cs-section-title" id="cs-section-title">{c.sectionTitle}</h2>
      </Reveal>

      {/* School sub-tabs switcher */}
      <Reveal className="school-toggle-container" delay={100} direction="up">
        <div className="school-toggle-bar">
          <button 
            type="button" 
            className={`school-toggle-btn ${subTab === 'abnet' ? 'active' : ''}`}
            onClick={() => setSubTab('abnet')}
          >
            {isAm ? 'የአብነት ትምህርት' : "Ye'abinet Timhirt"}
          </button>
          <button 
            type="button" 
            className={`school-toggle-btn ${subTab === 'sunday' ? 'active' : ''}`}
            onClick={() => setSubTab('sunday')}
          >
            {isAm ? 'የሰንበት ትምህርት ቤት' : 'Sunday School'}
          </button>
        </div>
      </Reveal>

      {subTab === 'abnet' && (
        /* ────────────────────────────────────────────────────────
           Abnet School Detailed Section
           ──────────────────────────────────────────────────────── */
        <div id="abnet-details" className="abnet-detail-container">
        <Reveal className="abnet-detail-card" direction="up">
          <div className="abnet-detail-grid">
            {/* Left Column: Intro & About the Abbot */}
            <div className="abnet-col">
              <span className="abnet-detail-subtitle">{isAm ? 'ስለ ባህላዊው ትምህርት ቤት' : 'About the Traditional School'}</span>
              <h2 className="abnet-detail-title">{isAm ? 'የአብነት ትምህርት (Ye\'abinet Timhirt)' : 'Ye\'abinet Timhirt'}</h2>
              <p className="abnet-detail-intro">
                {isAm 
                  ? "የአብነት ትምህርት ለትውልዱ ሃይማኖታዊ እና ባህላዊ የአስተሳሰብ ዘይቤዎችን፣ እሴቶችን እና ቅርሶችን ለማስተማር የታለመ ባህላዊ የቤተ ክርስቲያን ትምህርት ነው። በዚህም ምክንያት ትምህርቱ ተማሪዎች የኢ.ኦ.ተ.ቤ. ሐዋርያዊ ትምህርቶችን እንዲያውቁ፣ በመንፈሳዊ እንዲያድጉ እና የቤተ ክርስቲያኒቱ የወደፊት አገልጋዮች፣ ምሁራን እና መሪዎች እንዲሆኑ ይረዳቸዋል።"
                  : "Ye'abinet Timhirt is a traditional church education which was intended to teach religious and cultural modes of thoughts, values and heritages to the generation. As a result the teaching help learners to know the apostolic teachings of the EOTC, to grow spiritually and enable them to be the future servants, scholars and leaders of the church."}
              </p>

              {/* Abbot Bio Card */}
              <div className="abbot-card">
                <div className="abbot-avatar-ring">
                  <span className="abbot-avatar-monogram">YQ</span>
                </div>
                <div className="abbot-info">
                  <span className="abbot-tag">{isAm ? 'የአብነት ኃላፊ (መምህር)' : 'Ye\'abinet Timhirt Abbot'}</span>
                  <h4 className="abbot-name">{isAm ? 'የኔታ ቆሞስ አባ ጊሩም አየለ' : 'Yeneta Qomos Abba Girum Ayele'}</h4>
                  <p className="abbot-bio">
                    {isAm
                      ? "የካቴድራሉ የአብነት ትምህርት ኃላፊ (መምህር) የኔታ ቆሞስ አባ ጊሩም አየለ ናቸው። እርሳቸው በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የከፍተኛ ባህላዊ ትምህርት ቤት የድጓ እና የቅኔ ቤት (ቅኔ ቤት) ትምህርታቸውን ያጠናቀቁ መምህር ናቸው። የኔታ ጊሩም በሰዋስወ ብርሃን ቅዱስ ጳውሎስ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ቲዎሎጂካል ኮሌጅ በአዲስ ኪዳን ትርጓሜ የዲፕሎማ መርሃ ግብር አጠናቀዋል።"
                      : "The Cathedral's Ye'abinet Timhirt abbot is Yeneta Qomos Abba Girum Ayele. He is an abbot who has completed his studies in the higher school of the traditional education of the Ethiopian Orthodox Church with the chant book (Degwa) and Poetry school (Qene Bet). Yeneta Girum also completed a diploma program in New testament interpretation from Sewasewe Birhan St. Paul Ethiopian Orthodox Tewahedo Church's Theological College."}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Box */}
            <div className="objectives-box" style={{ marginTop: '2rem' }}>
              <h4 className="section-small-title">{isAm ? 'የአብነት ትምህርት ቤት ፕሮፋይል' : 'Abnet School Profile'}</h4>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold-dark)', marginBottom: '0.5rem' }}>
                  {isAm ? 'ራዕይ (Vision)' : 'Vision'}
                </h5>
                <p className="abnet-detail-intro" style={{ fontSize: '0.95rem', margin: 0 }}>
                  {isAm 
                    ? 'የኢትዮጵያን ጥንታዊ ሥልጣኔ፣ ሃይማኖታዊ ትውፊት እና ብሔራዊ ማንነት ጠብቆ ከትውልድ ወደ ትውልድ የሚያስተላልፍ፣ ዓለም አቀፍ ይዘት ያለው ዕውቀትን በአገር በቀል ቋንቋና ፊደል የሚያቀርብ ግንባር ቀደም የምርምርና የትምህርት ማዕከል መሆን።' 
                    : 'To be a leading research and educational center that preserves Ethiopia\'s ancient civilization, religious traditions, and national identity, passing them down from generation to generation, and offering world-class knowledge in indigenous languages and alphabets.'}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold-dark)', marginBottom: '0.5rem' }}>
                  {isAm ? 'ተልዕኮ (Mission)' : 'Mission'}
                </h5>
                <p className="abnet-detail-intro" style={{ fontSize: '0.95rem', margin: 0 }}>
                  {isAm 
                    ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ጥንታዊ አስተምህሮ፣ ቋንቋ፣ ሥነ ጽሑፍ፣ ዜማ፣ ቅኔ እና ትርጓሜ መጻሕፍትን — በፊደልና ንባብ፣ በዜማ፣ በቅኔ እና በትርጓሜ ቤት አማካኝነት — ለሀገር ዜጎችና ለውጭ ሀገር ሊቃውንት በአደረጃጀት፣ በሥርዐት እና በታማኝነት ማስተማር።' 
                    : 'To faithfully and systematically teach the ancient doctrines, languages, literature, chants (Zema), poetry (Qene), and commentaries of the Ethiopian Orthodox Tewahedo Church—through reading, Zema, Qene, and commentary schools—to citizens and international scholars.'}
                </p>
              </div>

              <div>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold-dark)', marginBottom: '0.5rem' }}>
                  {isAm ? 'ዓላማ (Objectives)' : 'Objectives'}
                </h5>
                <ul className="objectives-list" style={{ marginTop: '0.5rem' }}>
                  <li>
                    <strong>{isAm ? 'ብሔራዊ ማንነትን መጠበቅ፦' : 'Preserving National Identity:'}</strong>{' '}
                    {isAm ? 'የኢትዮጵያን ጥንታዊ ሥነ ፊደል፣ ሥነ ዜማ፣ ሥነ ባሕልና ታሪክ ሳይቋረጥ ለሚቀጥለው ትውልድ ማስተላለፍ።' : 'Uninterruptedly passing down Ethiopia\'s ancient alphabet, chants, culture, and history to the next generation.'}
                  </li>
                  <li>
                    <strong>{isAm ? 'ዕውቀትን ማስፋፋት፦' : 'Expanding Knowledge:'}</strong>{' '}
                    {isAm ? 'ከፊደልና ንባብ ጀምሮ እስከ ትርጓሜ መጻሕፍት ድረስ ባሉ ደረጃዎች ሁሉ ሥርዓት ያለው ትምህርት መስጠት።' : 'Providing systematic education at all levels, from alphabet and reading to book commentaries.'}
                  </li>
                  <li>
                    <strong>{isAm ? 'ቤተ ክርስቲያንን ማገልገል፦' : 'Serving the Church:'}</strong>{' '}
                    {isAm ? 'ሀገርና ቤተ ክርስቲያን የሚፈልጓቸው ምሁራን፣ ካህናት፣ ዲያቆናትና መምህራን ማፍራት።' : 'Producing scholars, priests, deacons, and teachers needed by the country and the church.'}
                  </li>
                  <li>
                    <strong>{isAm ? 'ጠፍቶ የነበረ ዕውቀት መልሶ ማንሳት፦' : 'Reviving Lost Knowledge:'}</strong>{' '}
                    {isAm ? 'በተለይ የቁጥር ትምህርት ቤት (ሥነ ከዋክብት፣ ዘመን አቆጣጠር) እንዳይጠፋ ምሁራን ሰብስቦ ማደስ።' : 'Gathering scholars to restore and preserve endangered schools of knowledge, especially the school of numbers (astronomy, calendar).'}
                  </li>
                  <li>
                    <strong>{isAm ? 'ከዘመናዊ ትምህርት ጋር ማስተዋወቅ፦' : 'Introducing to Modern Education:'}</strong>{' '}
                    {isAm ? 'የአብነት ትምህርትን ዘመናዊ ሊቃውንትና ተቋማት ዘንድ ወክሎ ማቅረብ።' : 'Representing and presenting traditional education to modern scholars and institutions.'}
                  </li>
                </ul>
              </div>
            </div>

          {/* Right Column: Subjects & Schedule */}
            <div className="abnet-col">
              <span className="abnet-detail-subtitle">{isAm ? 'የትምህርት መርሃ ግብር' : 'Curriculum & Schedule'}</span>
              <h2 className="abnet-detail-title">{isAm ? 'ትምህርቶች እና መርሃ ግብር' : 'Subjects & Schedule'}</h2>
              
              <div className="subjects-list">
                <h4 className="section-small-title">{isAm ? 'የሚሰጡ የትምህርት ዓይነቶች' : 'Offered Subjects'}</h4>
                <div className="tags-grid">
                  {['Amharic alphabet', 'Geez language', 'Geez number', 'Ethics', 'Deaconate', 'Zema', 'Poetry (Qene)', 'New Testament commentary'].map((sub, idx) => (
                    <span key={idx} className="subject-tag">#{sub}</span>
                  ))}
                </div>
              </div>

              <div className="schedule-card">
                <h4 className="section-small-title">{isAm ? 'የክፍል ጊዜያት' : 'Class Schedule'}</h4>
                <p className="schedule-text">
                  {isAm 
                    ? "የአብነት ትምህርት በየኔታ አባ ጊሩም የሚሰጠው በየሳምንቱ ረቡዕ ከምሽቱ 12:00 – 2:00 ሰዓት (6 pm – 8 pm) እና ቅዳሜ ከቀኑ 9:00 – 12:00 ሰዓት (3 pm – 6 pm) ነው። በተጨማሪም ተማሪዎች ከሰኞ እስከ አርብ ባለው ጊዜ ከመምህሩ ጋር ቀጠሮ በመያዝ መማር ይችላሉ።"
                    : "The Abnet curriculum given by the Cathedral's Abnet teacher, Yeneta Abba Girum, is every Wednesday from 6 pm – 8 pm and Saturday from 3 pm – 6 pm. In addition, students can learn the lessons from the teacher by appointment from Monday to Friday."}
                </p>
                <p className="schedule-callout">
                  <strong>{isAm ? 'ማሳሰቢያ፦' : 'Note:'}</strong>{' '}
                  {isAm
                    ? "ልጆችዎን በተጠቀሰው የአብነት ሥርዓተ ትምህርት መርሃ ግብር መሠረት ወደ ቤተ ክርስቲያን በማምጣት ለልጆችዎ ትምህርት እንዲተባበሩ እናሳስባለን።"
                    : "We urge you to contribute to the education of your children by bringing them to church according to the mentioned Abnet curriculum schedule."}
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum Levels Detail Grid */}
          <div className="abnet-levels-detail-section">
            <h3 className="levels-section-title">{isAm ? 'የአብነት የትምህርት ደረጃዎች' : 'Ye\'abinet Curriculum Levels'}</h3>
            <div className="levels-grid-3">
              {/* Beginner */}
              <div className="level-card-detailed">
                <div className="level-card-header-det">
                  <span className="level-badge beginner">{isAm ? 'ደረጃ 1' : 'Level 1'}</span>
                  <h4>{isAm ? 'መሰረታዊ ደረጃ (Beginner)' : 'Beginner Level'}</h4>
                </div>
                <ul className="level-topics">
                  <li>{isAm ? 'የአማርኛ ፊደል' : 'Amharic alphabet'}</li>
                  <li>{isAm ? 'የግዕዝ ቁጥር' : 'Geez number'}</li>
                  <li>{isAm ? 'የአማርኛ ንባብ' : 'Amharic reading'}</li>
                  <li>{isAm ? 'የግዕዝ ንባብ' : 'Geez reading'}</li>
                  <li>{isAm ? 'የቤተ ክርስቲያን ሥነ-ምግባር' : 'Church ethics'}</li>
                </ul>
              </div>

              {/* Intermediate */}
              <div className="level-card-detailed">
                <div className="level-card-header-det">
                  <span className="level-badge intermediate">{isAm ? 'ደረጃ 2' : 'Level 2'}</span>
                  <h4>{isAm ? 'መካከለኛ ደረጃ (Intermediate)' : 'Intermediate Level'}</h4>
                </div>
                <ul className="level-topics">
                  <li>{isAm ? 'ግብረ ዲቁና' : 'Gibre Diquna'}</li>
                  <li>{isAm ? 'ግብረ ቅስና' : 'Gibre Qisina'}</li>
                </ul>
              </div>

              {/* Advanced */}
              <div className="level-card-detailed">
                <div className="level-card-header-det">
                  <span className="level-badge advanced">{isAm ? 'ደረጃ 3' : 'Level 3'}</span>
                  <h4>{isAm ? 'ከፍተኛ ደረጃ (Advanced)' : 'Advanced Level'}</h4>
                </div>
                <ul className="level-topics">
                  <li>{isAm ? 'ዜማ' : 'Zema'}</li>
                  <li>{isAm ? 'ቅኔ' : 'Qene'}</li>
                  <li>{isAm ? 'አቋቋም' : 'Aqwaqwam'}</li>
                  <li>{isAm ? 'ትርጓሜ' : 'Commentary'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div id="abnet-register" className="abnet-registration-form-section">
            <h3 className="register-section-title">{isAm ? 'ለአብነት ትምህርት ይመዝገቡ' : 'Register for Ye\'abinet Timhirt'}</h3>
            <p className="register-section-intro">
              {isAm
                ? 'እባክዎን ከታች ያለውን የልጅዎን ምዝገባ ቅጽ ይሙሉ:: ኃላፊው በቅርቡ ያነጋግርዎታል።'
                : 'Please fill out the registration form below. The administrator will contact you shortly.'}
            </p>

            <form onSubmit={handleAbnetRegister} className="abnet-form">
              <div className="form-row-2">
                <label className="form-field">
                  <span>{isAm ? 'የተማሪው ሙሉ ስም' : 'Student Full Name'} *</span>
                  <input type="text" required value={abnetForm.studentName} onChange={handleAbnetFormChange('studentName')} />
                </label>
                <label className="form-field">
                  <span>{isAm ? 'ዕድሜ' : 'Age'} *</span>
                  <input type="number" required value={abnetForm.age} onChange={handleAbnetFormChange('age')} />
                </label>
              </div>

              <div className="form-row-2">
                <label className="form-field">
                  <span>{isAm ? 'የወላጅ/አሳዳጊ ስም (ለልጆች)' : 'Parent/Guardian Name (for minors)'}</span>
                  <input type="text" value={abnetForm.parentName} onChange={handleAbnetFormChange('parentName')} />
                </label>
                <label className="form-field">
                  <span>{isAm ? 'ደረጃ' : 'Level'} *</span>
                  <select value={abnetForm.level} onChange={handleAbnetFormChange('level')}>
                    <option value="Beginner">{isAm ? 'መሰረታዊ ደረጃ (Beginner)' : 'Beginner Level'}</option>
                    <option value="Intermediate">{isAm ? 'መካከለኛ ደረጃ (Intermediate)' : 'Intermediate Level'}</option>
                    <option value="Advanced">{isAm ? 'ከፍተኛ ደረጃ (Advanced)' : 'Advanced Level'}</option>
                  </select>
                </label>
              </div>

              <div className="form-row-2">
                <label className="form-field">
                  <span>{isAm ? 'ስልክ' : 'Phone'} *</span>
                  <input type="tel" required value={abnetForm.phone} onChange={handleAbnetFormChange('phone')} />
                </label>
                <label className="form-field">
                  <span>{isAm ? 'ኢሜይል' : 'Email'}</span>
                  <input type="email" value={abnetForm.email} onChange={handleAbnetFormChange('email')} />
                </label>
              </div>

              <label className="form-field full-width">
                <span>{isAm ? 'መልእክት ወይም ተጨማሪ መረጃ' : 'Message or Additional Info'}</span>
                <textarea rows={4} value={abnetForm.message} onChange={handleAbnetFormChange('message')} />
              </label>

              <div className="form-actions">
                <button type="submit" className="cs-btn cs-btn-filled">{isAm ? 'ይመዝገቡ' : 'Submit Registration'}</button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
      )}

      {subTab === 'sunday' && (
        /* ────────────────────────────────────────────────────────
           Sunday School Detailed Section
           ──────────────────────────────────────────────────────── */
        <div id="sunday-details" className="sunday-detail-container" style={{ marginTop: '2rem' }}>
        <Reveal className="sunday-detail-card" direction="up">
          <div className="sunday-detail-grid">
            {/* Left Column: History */}
            <div className="abnet-col">
              <span className="abnet-detail-subtitle">{isAm ? 'የሰንበት ትምህርት ቤት ታሪክ' : 'Sunday School History'}</span>
              <h2 className="abnet-detail-title">{isAm ? 'የሰንበት ትምህርት ቤት ታሪካዊ አመጣጥ' : 'History of Sunday School'}</h2>
              <div className="sunday-detail-intro" style={{ fontSize: '0.98rem', lineHeight: '1.75' }}>
                {isAm ? (
                  <>
                    <p style={{ marginBottom: '1rem' }}>
                      በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የሰንበት ትምህርት ቤት ለወጣቶች መመሥረት የተጀመረው በ1928 ዓ.ም. (1936 G.C.) ነበር።
                      ቀደም ሲል በመንበረ ጸባኦት ቅድስት ሥላሴ ካቴድራል ትምህርት ቤት ሃይማኖታዊ ትምህርታቸውን ይከታተሉ የነበሩ ወጣት ምዕመናን
                      ለመጀመሪያ ጊዜ 'ማኅደረ ሥላሴ ማኅበር' (ለወንዶች ብቻ) የተባለውን ማኅበር አቋቋሙ። ከጥቂት ዓመታት በኋላ ግን ለሴት ወጣቶችም
                      የራሳቸውን ማኅበር ማቋቋም አስፈላጊ ሆኖ በመገኘቱ 'ኪርስተስ ማኅበር' ተመሠረተ።
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      እነዚህ ማኅበራት መንፈሳዊ ግንዛቤያቸውና ሥነ ምግባራቸው እያደገ ሲመጣ የቤተ ክርስቲያን መዝሙራትን መማር ጀምረው ከቅዱስ ቁርባን በኋላ
                      በካቴድራሉ መዘመር ጀመሩ። ይህም ለቤተ ክርስቲያኑ አገልጋዮች ትልቅ ደስታን በመፍጠሩ ማኅበራቱ እንዲበረታቱ ተደረገ። በ1931 ዓ.ም.
                      (1939 G.C.) ዝነኛውና ታሪካዊው 'ተምሮ ማስተማር' የሰንበት ትምህርት ቤት ማኅበር ተመሠረተ።
                    </p>
                    <p>
                      በወቅቱ የቅድስት ሥላሴ ካቴድራል የበላይ ጠባቂ በነበሩት በብፁዕ ወቅዱስ አቡነ ቴዎፍሎስ ከፍተኛ ድጋፍና እንክብካቤ የሰንበት
                      ትምህርት ቤቶች በመላው አገሪቱ ተስፋፉ። በ1966 ዓ.ም. በነበረው አብዮትና በደርግ ዘመን ተፅዕኖዎች መካከል፣ በቅዱስ ሲኖዶስ ብልህ ውሳኔ
                      ማኅበራቱ ተዋህደው በአንድ ማዕከላዊ አስተዳደር ሥር 'የሰንበት ትምህርት ቤት' ተብለው ተሰየሙ፣ ይህም እስከ ዛሬ ድረስ የቀጠለ መዋቅር ነው።
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ marginBottom: '1rem' }}>
                      The history of Sunday schools for youth in the Ethiopian Orthodox Tewahedo Church began in 1936 at the Holy Trinity Cathedral.
                      Young followers who previously attended religious education in the cathedral school established the "Trinity Association" (initially for male youth).
                      A few years later, the cathedral administration recognized the need for female youth to have their own space, leading to the creation
                      of the "Kirstos Association" for prayer and preaching.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      As members grew in spiritual discipline, they learned and began singing traditional spiritual hymns in the church after Holy Communion.
                      This beautiful milestone delighted the clergy, who provided encouragement and support. By 1939, the landmark Sunday school 
                      known as "Temero Mastemar" (Learn and Teach) was founded, serving as a pioneer for youth education.
                    </p>
                    <p>
                      With the active support of His Holiness Abune Tewofilos (then administrator of Holy Trinity Cathedral), these associations expanded
                      rapidly to other major churches, monasteries, and provinces. During the revolution and Derg regime in the 1970s, to preserve
                      their legal status and safety, the Holy Synod officially unified and renamed these spiritual associations to "Sunday School",
                      establishing the organized central department that oversees them to this day.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Objectives & Schedule */}
            <div className="abnet-col">
              <span className="abnet-detail-subtitle">{isAm ? 'ዓላማዎች' : 'Core Focus'}</span>
              <h2 className="abnet-detail-title">{isAm ? 'ዋና ዋና ዓላማዎች' : 'Key Objectives'}</h2>
              
              <div className="objectives-box">
                <h4 className="section-small-title">{isAm ? 'የሰንበት ትምህርት ቤት ተልዕኮ' : 'Sunday School Mission'}</h4>
                <ul className="objectives-list">
                  {isAm ? (
                    <>
                      <li>የክርስትናን ዶክትሪን መሰረታዊ ዓላማዎችን መማር እና መስበክ።</li>
                      <li>የረድኤት እና የበጎ አድራጎት ተግባራትን ማከናወን።</li>
                      <li>የክርስትና ባህላዊና መንፈሳዊ ቅርሶችን መጠበቅ።</li>
                      <li>ወጣት የሴትና የወንድ አገልጋዮች ያለምንም ፍርሃት ማኅበረሰቡን እንዲያገለግሉና እንዲሰብኩ ስልጠናዎችን መስጠት።</li>
                    </>
                  ) : (
                    <>
                      <li>To learn, study, and preach the fundamental doctrines of Christian faith.</li>
                      <li>To carry out humanitarian, charitable, and community support activities.</li>
                      <li>To preserve and cherish the rich national and spiritual heritages of Christian culture.</li>
                      <li>To facilitate and equip youth (both male and female) to provide spiritual service and preach to the community with confidence.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="schedule-card" style={{ marginTop: '2rem' }}>
                <h4 className="section-small-title">{isAm ? 'ማሳሰቢያ' : 'General Reminder'}</h4>
                <p className="schedule-text" style={{ fontSize: '0.95rem' }}>
                  {isAm
                    ? "የሰንበት ትምህርት ቤት ለህፃናት፣ ለወጣቶች እና ለቤተሰቦች በሙሉ ክፍት ነው። በሰንበት መርሃ ግብሮች ላይ በመገኘት በመንፈሳዊ ይድረሱ።"
                    : "Our Sunday School program nurtures the next generation through biblical studies, traditional values, and spiritual fellowship tailored for children, youth, and families."}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div id="sunday-register" className="abnet-registration-form-section">
            <h3 className="register-section-title">{isAm ? 'ለሰንበት ትምህርት ቤት ይመዝገቡ' : 'Register for Sunday School'}</h3>
            <p className="register-section-intro">
              {isAm
                ? 'እባክዎን ከታች ያለውን የልጅዎን ወይም የእርስዎን ምዝገባ ቅጽ ይሙሉ:: በቅርቡ እናገኝዎታለን።'
                : 'Please fill out the registration form below. We will get in touch with you shortly.'}
            </p>

            <form onSubmit={handleSundayRegister} className="abnet-form">
              <div className="form-row-2">
                <label className="form-field">
                  <span>{isAm ? 'ሙሉ ስም' : 'Full Name'} *</span>
                  <input type="text" required value={sundayForm.studentName} onChange={handleSundayFormChange('studentName')} />
                </label>
                <label className="form-field">
                  <span>{isAm ? 'ዕድሜ' : 'Age'} *</span>
                  <input type="number" required value={sundayForm.age} onChange={handleSundayFormChange('age')} />
                </label>
              </div>

              <div className="form-row-2">
                <label className="form-field">
                  <span>{isAm ? 'የወላጅ/አሳዳጊ ስም (ለልጆች)' : 'Parent/Guardian Name (for minors)'}</span>
                  <input type="text" value={sundayForm.parentName} onChange={handleSundayFormChange('parentName')} />
                </label>
                <label className="form-field">
                  <span>{isAm ? 'ስልክ' : 'Phone'} *</span>
                  <input type="tel" required value={sundayForm.phone} onChange={handleSundayFormChange('phone')} />
                </label>
              </div>

              <div className="form-field">
                <span>{isAm ? 'ኢሜይል' : 'Email'}</span>
                <input type="email" value={sundayForm.email} onChange={handleSundayFormChange('email')} />
              </div>

              <label className="form-field full-width">
                <span>{isAm ? 'መልእክት ወይም ተጨማሪ መረጃ' : 'Message or Additional Info'}</span>
                <textarea rows={4} value={sundayForm.message} onChange={handleSundayFormChange('message')} />
              </label>

              <div className="form-actions">
                <button type="submit" className="cs-btn cs-btn-filled">{isAm ? 'ይመዝገቡ' : 'Submit Registration'}</button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
      )}

      {/* Bottom ornament */}
      <Reveal className="services-bottom-divider" delay={400} style={{ marginTop: '2rem' }}>
        <span className="divider-line dark"></span>
        <DiamondOrnament />
        <span className="divider-line dark"></span>
      </Reveal>
    </section>
  );
}
