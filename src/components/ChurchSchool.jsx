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
              <span className="abnet-detail-subtitle">{isAm ? 'ስለ ጥንታዊው ጉባኤ ቤት' : 'What is an Abinet School?'}</span>
              <h2 className="abnet-detail-title">{isAm ? 'ስለ አብነት ትምህርት' : 'About Ye\'abinet Timhirt'}</h2>
              <div className="abnet-detail-intro" style={{ fontSize: '0.98rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
                {isAm ? (
                  <p style={{ margin: 0 }}>የአብነት ትምህርት ቤት ማለት ከአባት የተገኘ ከአበው የተወረሰ ከጥንት የነበረ ፣ የማንነት መግለጫ በራስ ቋንቋ ， በራስ ፊደል ， በራስ ስርዓት ትምህርት የሚሰጥ ከትውልድ ወደ ትውል የተላለፈ ትምህርት የሚሰጥበት ትምህርት ቤት ማለት ነው ፡፡ የአንድን ህዝብ የአንድን ሃገር ጥበብና እውቀት ለዚያ ህዝብና ለዚያች ሀገር ዜጐች የሚያስተምሩበት ትምህርት ቤት ማለት ነው ፡፡ የአብነት ትምህርት ቤት በልማድ “ የቆሎ ትምህርት ቤት በመባል በህዝባችን ዘንድ ይታወቃል ፡፡ አንዳንድ ሰዎች ደግሞ “ የቄስ ትምህርት ቤት “ አንዳንዶች ደግሞ “ የቤተክህነት ትምህርት ቤት “ ይሎታል” የሀይማኖት ቤት አባቶች የጥንታዊ ስልጣኔ መነሻወች  እና የዘመናዊ ትምህርትም መሰረቶች ናቸው ፡፡ ያም ሆነ ይህ ትክክለኛው ስያሜ “ የአብነት ት/ቤት ነው፡፡</p>
                ) : (
                  <>
                    <p style={{ marginBottom: '0.8rem' }}>An Abinet School is a traditional Ethiopian ecclesiastical school that has been passed down from generation to generation. It preserves a heritage inherited from our forefathers and ancestors, maintaining an ancient system of education that reflects the identity of the Ethiopian people. Instruction is given in the nation's own language, using its own script and according to its own long-established educational tradition.</p>
                    <p style={{ marginBottom: '0.8rem' }}>An Abinet School is an institution where the wisdom, knowledge, culture, and intellectual heritage of a people and their country are taught to succeeding generations. It has played a vital role in preserving Ethiopia's religious, literary, linguistic, and cultural legacy throughout history.</p>
                    <p style={{ marginBottom: '0.8rem' }}>Traditionally, Abinet Schools are commonly known among the Ethiopian people as "Qolo Schools" (Schools of Traditional Learning). Some also refer to them as "Priests' Schools" or "Ecclesiastical Schools." However, the historically accurate and proper name is "Abinet School."</p>
                    <p style={{ margin: 0 }}>The fathers of the Church were the pioneers of Ethiopia's ancient civilization and laid the foundations for both traditional and, ultimately, modern education. For this reason, the Abinet School remains one of the most important institutions for preserving the country's spiritual, intellectual, and cultural heritage.</p>
                  </>
                )}
              </div>

              {/* Abbot Bio Card */}
              <div className="abbot-card">
                <div className="abbot-avatar-ring">
                  <span className="abbot-avatar-monogram">YQ</span>
                </div>
                <div className="abbot-info">
                  <span className="abbot-tag">{isAm ? 'የኔታ' : 'Ye\'abinet Timhirt Abbot'}</span>
                  <h4 className="abbot-name">{isAm ? 'የኔታ ቆሞስ አባ ጊሩም አየለ' : 'Yeneta Qomos Abba Girum Ayele'}</h4>
                  <p className="abbot-bio">
                    {isAm
                      ? "የደብሩ የአብነት ትምህርት መምህር የኔታ ቆሞስ አባ ጊሩም አየለ በቤተክርስቲያናችን ከፍተኛ የአብነት ትምህርት ክፍል (በተለይም በአብያተ ጉባኤያት ቅኔ፣ በገናና መጻሕፍት) ትምህርታቸውን ያጠናቀቁ ታላቅ ሊቅ ናቸው። በተጨማሪም በቅዱስ ጳውሎስ ከፍተኛ ቲኦሎጂካል ኮሌጅ በዲፕሎማ መርሃ ግብር ተመርቀዋል።"
                      : "The Cathedral's Ye'abinet Timhirt abbot is Yeneta Qomos Abba Girum Ayele. He is an abbot who has completed his studies in the higher school of the traditional education of the Ethiopian Orthodox Church with the chant book (Degwa) and Poetry school (Qene Bet). Yeneta Girum also completed a diploma program in New testament interpretation from Sewasewe Birhan St. Paul Ethiopian Orthodox Tewahedo Church's Theological College."}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Box */}
            <div className="objectives-box" style={{ marginTop: '2rem' }}>
              <h4 className="section-small-title">{isAm ? 'የአብነት ትምህርት ቤት መገለጫ' : 'Abnet School Profile'}</h4>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold-dark)', marginBottom: '0.5rem' }}>
                  {isAm ? 'ራዕይ (Vision)' : 'Vision'}
                </h5>
                <p className="abnet-detail-intro" style={{ fontSize: '0.95rem', margin: 0 }}>
                  {isAm 
                    ? 'የኢትዮጵያን ጥንታዊ ፊደል፣ ያሬዳዊ ዜማ፣ ሥርዓትና ብሔራዊ ማንነትን ጠብቆ በማቆየት ከትውልድ ወደ ትውልድ የሚያስተላልፍ፣ እንዲሁም በአገር በቀል ቋንቋዎችና ፊደላት የላቀ ዕውቀት የሚሰጥ ግንባር ቀደም የምርምርና የትምህርት ማዕከል መሆን።' 
                    : 'To be a leading research and educational center that preserves Ethiopia\'s ancient civilization, religious traditions, and national identity, passing them down from generation to generation, and offering world-class knowledge in indigenous languages and alphabets.'}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold-dark)', marginBottom: '0.5rem' }}>
                  {isAm ? 'ተልእኮ (Mission)' : 'Mission'}
                </h5>
                <p className="abnet-detail-intro" style={{ fontSize: '0.95rem', margin: 0 }}>
                  {isAm 
                    ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን ጥንታዊ ዶግማ (ሃይማኖታዊ አስተምህሮ)፣ ቋንቋዎች፣ ሥነ ጽሑፍ፣ ያሬዳዊ ዜማ፣ ቅኔ፣ ሥርዓተ አምልኮና መጻሕፍት ትርጓሜ (አንድምታ) ለዜጎችና ለዓለም አቀፍ ምሁራን በታማኝነትና በሥርዓት ማስተማር።' 
                    : 'To faithfully and systematically teach the ancient doctrines, languages, literature, chants (Zema), poetry (Qene), and commentaries of the Ethiopian Orthodox Tewahedo Church—through reading, Zema, Qene, and commentary schools—to citizens and international scholars.'}
                </p>
              </div>

              <div>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold-dark)', marginBottom: '0.5rem' }}>
                  {isAm ? 'ዓላማዎች (Objectives)' : 'Objectives'}
                </h5>
                <ul className="objectives-list" style={{ marginTop: '0.5rem' }}>
                  <li>
                    <strong>{isAm ? 'ብሔራዊ ማንነትን ማስጠበቅ፦' : 'Preserving National Identity:'}</strong>{' '}
                    {isAm ? 'የኢትዮጵያን ጥንታዊ ፊደላት፣ ያሬዳዊ ዜማዎችን፣ ባህልንና ታሪክን ሳይቋረጥ ለሚቀጥለው ትውልድ ማስተላለፍ።' : 'Uninterruptedly passing down Ethiopia\'s ancient alphabet, chants, culture, and history to the next generation.'}
                  </li>
                  <li>
                    <strong>{isAm ? 'ዕውቀትን ማስፋፋት፦' : 'Expanding Knowledge:'}</strong>{' '}
                    {isAm ? 'ከፊደል መቁጠርና ከንባብ ጀምሮ እስከ መጻሕፍት ትርጓሜ (አንድምታ) ድረስ ያለውን ትምህርት በሥርዓት መስጠት።' : 'Providing systematic education at all levels, from alphabet and reading to book commentaries.'}
                  </li>
                  <li>
                    <strong>{isAm ? 'ቤተክርስቲያንን ማገልገል፦' : 'Serving the Church:'}</strong>{' '}
                    {isAm ? 'ለአገርና ለቤተክርስቲያን የሚያስፈልጉ ሊቃውንትን፣ ካህናትን፣ ዲያቆናትንና መምህራንን ማፍራት።' : 'Producing scholars, priests, deacons, and teachers needed by the country and the church.'}
                  </li>
                  <li>
                    <strong>{isAm ? 'የጠፉ ዕውቀቶችን ማደስ፦' : 'Reviving Lost Knowledge:'}</strong>{' '}
                    {isAm ? 'ለአደጋ የተጋለጡ የዕውቀት ዘርፎችን፣ በተለይም የቁጥር ትምህርት (ባሕረ ሐሳብ)፣ የኮከብ ቆጠራ (አስትሮኖሚ) እና የዘመን አቆጣጠር ዕውቀቶችን ለመመለስና ለመጠበቅ ሊቃውንትን ማሰባሰብ።' : 'Gathering scholars to restore and preserve endangered schools of knowledge, especially the school of numbers (astronomy, calendar).'}
                  </li>
                  <li>
                    <strong>{isAm ? 'ከዘመናዊው ትምህርት ጋር ማስተዋወቅ፦' : 'Introducing to Modern Education:'}</strong>{' '}
                    {isAm ? 'የአብነት (የባህል) ትምህርትን ለዘመናዊ ምሁራንና ለምርምር ማኅበረሰቡ ማቅረብና ማስተዋወቅ።' : 'Representing and presenting traditional education to modern scholars and institutions.'}
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Subjects & Schedule */}
            <div className="abnet-col">
              <span className="abnet-detail-subtitle">{isAm ? 'ሥርዓተ ትምህርትና የጊዜ ሰሌዳ' : 'Curriculum & Schedule'}</span>
              <h2 className="abnet-detail-title">{isAm ? 'የትምህርት መርሃ ግብር' : 'Subjects & Schedule'}</h2>
              
              <div className="subjects-list">
                <h4 className="section-small-title">{isAm ? 'የሚሰጡ የትምህርት ዓይነቶች (Offered Subjects)' : 'Offered Subjects'}</h4>
                <div className="tags-grid">
                  {(isAm 
                    ? ['የአማርኛ ፊደል', 'የግዕዝ ቋንቋ', 'የግዕዝ ቁጥር', 'ክርስቲያናዊ ሥነ ምግባር (ግብረ ገብነት)', 'የዲቁና ሥርዓት ትምህርት (ግብረ ዲቁና)', 'ያሬዳዊ ዜማ', 'ቅኔ', 'የሐዲስ ኪዳን ትርጓሜ (አንድምታ)']
                    : ['Amharic alphabet', 'Geez language', 'Geez number', 'Ethics', 'Deaconate', 'Zema', 'Poetry (Qene)', 'New Testament commentary']
                  ).map((sub, idx) => (
                    <span key={idx} className="subject-tag">#{sub}</span>
                  ))}
                </div>
              </div>

              <div className="schedule-card">
                <h4 className="section-small-title">{isAm ? 'የክፍል መርሃ ግብር' : 'Class Schedule'}</h4>
                <p className="schedule-text">
                  {isAm 
                    ? "የካቴድራሉ የአብነት መምህር የኔታ አባ ጊሩም የሚሰጡት የአብነት ትምህርት በየሳምንቱ ረቡዕ ከሰዓት በኋላ እስከ ምሽቱ ፪ ሰዓት (8:00 PM)፣ ቅዳሜ ደግሞ ከሰዓት በኋላ እስከ ምሽቱ ፲፪ ሰዓት (6:00 PM) ይሰጣል። በተጨማሪም ተማሪዎች ከሰኞ እስከ አርብ ባሉት ቀናት ከመምህሩ ጋር ቀጠሮ በመያዝ ትምህርቱን በግል መከታተል ይችላሉ።"
                    : "The Abnet curriculum given by the Cathedral's Abnet teacher, Yeneta Abba Girum, is every Wednesday from 6 pm – 8 pm and Saturday from 3 pm – 6 pm. In addition, students can learn the lessons from the teacher by appointment from Monday to Friday."}
                </p>
                <p className="schedule-callout">
                  <strong>{isAm ? 'ማሳሰቢያ፦' : 'Note:'}</strong>{' '}
                  {isAm
                    ? "ልጆችዎን ወደ ቤተክርስቲያን በማምጣትና በግብረ-ገብነት (ክርስቲያናዊ ሥነ-ምግባር) ሥርዓተ-ትምህርት ኮትኩቶ በማሳደግ ረገድ የድርሻዎን እንዲወጡ አጥብቀን እናሳስባለን።"
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
                  <span className="level-badge beginner">{isAm ? 'ደረጃ ፩' : 'Level 1'}</span>
                  <h4>{isAm ? 'የመጀመሪያ ደረጃ' : 'Beginner Level'}</h4>
                </div>
                <ul className="level-topics">
                  <li>{isAm ? 'የአማርኛ ፊደል' : 'Amharic alphabet'}</li>
                  <li>{isAm ? 'የግዕዝ ቁጥር' : 'Geez number'}</li>
                  <li>{isAm ? 'የአማርኛ ንባብ' : 'Amharic reading'}</li>
                  <li>{isAm ? 'የግዕዝ ንባብ' : 'Geez reading'}</li>
                  <li>{isAm ? 'የቤተክርስቲያን ሥርዓቶች' : 'Church rituals'}</li>
                </ul>
              </div>

              {/* Intermediate */}
              <div className="level-card-detailed">
                <div className="level-card-header-det">
                  <span className="level-badge intermediate">{isAm ? 'ደረጃ ፪' : 'Level 2'}</span>
                  <h4>{isAm ? 'መካከለኛ ደረጃ' : 'Intermediate Level'}</h4>
                </div>
                <ul className="level-topics">
                  <li>{isAm ? 'ግብረ ዲቁና እና ጾመ ድጓ (ጾመ ጽጌ/ቅዳሴ)' : 'Gibre Diquna & Fasting Chant (Degwa/Kidase)'}</li>
                </ul>
              </div>

              {/* Advanced */}
              <div className="level-card-detailed">
                <div className="level-card-header-det">
                  <span className="level-badge advanced">{isAm ? 'ደረጃ ፫' : 'Level 3'}</span>
                  <h4>{isAm ? 'ከፍተኛ ደረጃ' : 'Advanced Level'}</h4>
                </div>
                <ul className="level-topics">
                  <li>{isAm ? 'መጻሕፍት ትርጓሜ (አንድምታ)' : 'Books Commentaries (Andemta)'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div id="abnet-register" className="abnet-registration-form-section">
            <h3 className="register-section-title">{isAm ? 'ለአብነት ትምህርት ይመዝገቡ' : 'Register for Ye\'abinet Timhirt'}</h3>
            <p className="register-section-intro">
              {isAm
                ? 'እባክዎን ከዚህ በታች ያለውን የምዝገባ ቅጽ ይሙሉ፤ የቤተክርስቲያኑ አስተዳደር በቅርቡ ያነጋግርዎታል።'
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
              <h2 className="abnet-detail-title">{isAm ? 'የሰንበት ትምህርት ቤት ታሪክ' : 'History of Sunday School'}</h2>
              <div className="sunday-detail-intro" style={{ fontSize: '0.98rem', lineHeight: '1.75' }}>
                {isAm ? (
                  <>
                    <p style={{ marginBottom: '1rem' }}>
                      በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን የወጣቶች ሰንበት ትምህርት ቤት አገልግሎት በይፋ መመሥረት የጀመረው በመንበረ ጸባዖት ቅድስት ሥላሴ ካቴድራል ነው። ቀደም ሲል በካቴድራሉ የሃይማኖት ትምህርታቸውን ይከታተሉ የነበሩ ወጣቶች 'የሥላሴ ማኅበር' የተባለውን (መጀመሪያ ላይ ለወንዶች ብቻ የተቋቋመ) መንፈሳዊ ማኅበር መሠረቱ። ከጥቂት ዓመታት በኋላ፣ የካቴድራሉ አስተዳደር ለሴት ወጣቶችም የራሳቸው መድረክ እንደሚያስፈልግ በመገንዘብ ለጸሎትና ለስብከት የሚያገለግለውን 'ማኅበረ ቀርሜል' የተባለውን የሴቶች መንፈሳዊ ማኅበር አቋቋመ።
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      የማኅበሩ አባላት በሃይማኖታዊ ሥነ ምግባርና በሥርዓት እየታነጹ ሲመጡ፣ የቤተክርስቲያንን ያሬዳዊ መዝሙራት በመማር ከቅዱስ ቁርባን በኋላ በቤተክርስቲያን መዘመር ጀመሩ። ይህ ድንቅና ታሪካዊ ክንውን ቀሳውስቱንና አገልጋዮቹን እጅግ ያስደሰተ በመሆኑ አስፈላጊውን ማበረታቻና ድጋፍ አደረጉላቸው። በዚህም ሳቢያ በ፲፱፻፴፱ ዓ.ም. ለወጣቶች ትምህርት በምሳሌነትና በአቅኚነት የሚያገለግለው ታዋቂው 'ተምሮ ማስተማር' ሰንበት ትምህርት ቤት ተመሠረተ።
                    </p>
                    <p>
                      በወቅቱ የካቴድራሉ አስተዳዳሪ በነበሩት በሊቀ ሥልጣናት አባ መልዕክቱ (በኋላም ብፁዕ ወቅዱስ አቡነ ቴዎፍሎስ፣ የኢትዮጵያ ሁለተኛው ፓትርያርክ) ንቁ ተሳትፎና ድጋፍ እነዚህ ማኅበራት ወደ ሌሎች ታላላቅ አብያተ ክርስቲያናት፣ ገዳማትና ክፍላተ ሀገራት በከፍተኛ ፍጥነት ተስፋፉ። በ፲፱፻፸ዎቹ በነበረው አብዮትና በደርግ አገዛዝ ወቅት፣ ማኅበራቱ ሕጋዊ ሕልውናቸውንና ደኅንነታቸውን ለመጠበቅ ሲባል ቅዱስ ሲኖዶስ እነዚህን መንፈሳዊ ማኅበራት በአንድነት አዋሕዶ ስማቸውን 'ሰንበት ትምህርት ቤት' በማለት ሰየማቸው፤ እስከ ዛሬ ድረስም እነርሱን በበላይነት የሚመራውን የተደራጀ ማዕከላዊ የሰንበት ትምህርት ቤቶች ማደራጃ መምሪያን መሠረተ።
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ marginBottom: '1rem' }}>
                      The Sunday schools for youth in the Ethiopian Orthodox Tewahedo Church began officially at the Holy Trinity Cathedral. Young followers who previously attended religious education in the cathedral school established the "Trinity Association" (initially for male youth). A few years later, the cathedral administration recognized the need for female youth to have their own space, leading to the creation of the "Kermor Association" for prayer and preaching.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      As members grew in spiritual discipline, they learned and began singing traditional spiritual hymns in the church after Holy Communion; this beautiful milestone delighted the clergy, who provided encouragement and support. By 1939, the landmark Sunday school known as "Temero Mastemar" (Learn and Teach) was founded, serving as a pioneer for youth education.
                    </p>
                    <p>
                      With the active support of His Holiness Abune Tewofilos (then administrator of Holy Trinity Cathedral), these associations expanded rapidly to other major churches, monasteries, and provinces. During the revolution and Derg regime in the 1970s, to preserve their legal status and safety, the Holy Synod officially unified and renamed these spiritual associations to Sunday School, establishing the organized central department that oversees them to this day.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Objectives & Schedule */}
            <div className="abnet-col">
              <span className="abnet-detail-subtitle">{isAm ? 'ዋና ትኩረት' : 'Core Focus'}</span>
              <h2 className="abnet-detail-title">{isAm ? 'የሰንበት ትምህርት ቤት ተልዕኮ / ዋና ዋና ዓላማዎች' : 'Sunday School Mission'}</h2>
              
              <div className="objectives-box">
                <h4 className="section-small-title">{isAm ? 'የሰንበት ትምህርት ቤት ተልዕኮ / ዋና ዋና ዓላማዎች' : 'Sunday School Mission'}</h4>
                <ul className="objectives-list">
                  {isAm ? (
                    <>
                      <li>የክርስትና እምነት መሠረታዊ መርሆችን (ትምህርተ ሃይማኖትን) መማር፣ ማጥናትና መስበክ።</li>
                      <li>ሰብአዊ፣ የበጎ አድራጎትና የማኅበረሰብ አገልግሎት ተግባራትን ማከናወን።</li>
                      <li>ቅድሞ የነበረውን የክርስትና ባህል ብሔራዊና መንፈሳዊ ቅርሶችን መጠበቅና መንከባከብ።</li>
                      <li>ወጣቶች (ወንዶችም ሴቶችም) ያለምንም ፍርሃት መንፈሳዊ አገልግሎት እንዲያበረክቱና ማኅበረሰቡን በሙሉ እምነትና ብቃት እንዲያስተምሩ ማዘጋጀትና ማብቃት።</li>
                    </>
                  ) : (
                    <>
                      <li>To learn, study, and preach the fundamental doctrines of Christian faith.</li>
                      <li>To carry out humanitarian, charitable, and community activities.</li>
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
                    ? "የሰንበት ትምህርት ቤት መርሃ ግብራችን ለወጣቶች፣ ለሕፃናትና ለቤተሰቦች በተዘጋጁ የመጽሐፍ ቅዱስ ጥናቶች፣ በተግባራዊ የሕይወት ትምህርቶችና በመንፈሳዊ አንድነት ቀጣዩን ትውልድ በሃይማኖትና በሥነ ምግባር ኮትኩቶ ያሳድጋል።"
                    : "Our Sunday School program nurtures the next generation through biblical studies, life application, and spiritual fellowship tailored for youth, children, and families."}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div id="sunday-register" className="abnet-registration-form-section">
            <h3 className="register-section-title">{isAm ? 'ለሰንበት ትምህርት ቤት ይመዝገቡ' : 'Register for Sunday School'}</h3>
            <p className="register-section-intro">
              {isAm
                ? 'እባክዎን ከዚህ በታች ያለውን የምዝገባ ቅጽ ይሙሉ፤ በቅርቡ እናገኝዎታለን።'
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
                  <span>{isAm ? 'የወላጅ/የአሳዳጊ ስም (ለሕፃናት)' : 'Parent/Guardian Name (for minors)'}</span>
                  <input type="text" value={sundayForm.parentName} onChange={handleSundayFormChange('parentName')} />
                </label>
                <label className="form-field">
                  <span>{isAm ? 'ስልክ ቁጥር' : 'Phone'} *</span>
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
                <button type="submit" className="cs-btn cs-btn-filled">{isAm ? 'ምዝገባውን ላክ' : 'Submit Registration'}</button>
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
