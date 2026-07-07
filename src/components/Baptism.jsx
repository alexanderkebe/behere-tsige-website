import React, { useState } from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Baptism() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('childhood');

  // Childhood Baptism Form state
  const [childForm, setChildForm] = useState({
    parentNames: '',
    childName: '',
    childAge: '',
    childGender: 'boy',
    phone: '',
    email: '',
    proposedDate: '',
    message: ''
  });

  // Salvation / Subae Form state
  const [salvationForm, setSalvationForm] = useState({
    name: '',
    phone: '',
    email: '',
    startDate: '',
    duration: '7',
    lodging: 'no',
    message: ''
  });

  // Qeder Form state
  const [qederForm, setQederForm] = useState({
    name: '',
    phone: '',
    email: '',
    reason: 'denied_faith',
    message: ''
  });

  const handleChildSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Childhood Baptism Request: ${childForm.childName}`);
    const body = encodeURIComponent(
      `Parent's Names: ${childForm.parentNames}\nChild's Name: ${childForm.childName}\nAge: ${childForm.childAge}\nGender: ${childForm.childGender}\nPhone: ${childForm.phone}\nEmail: ${childForm.email}\nProposed Date: ${childForm.proposedDate}\n\nMessage/Notes:\n${childForm.message}`
    );
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  const handleSalvationSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Salvation Baptism / Subae Request: ${salvationForm.name}`);
    const body = encodeURIComponent(
      `Name: ${salvationForm.name}\nPhone: ${salvationForm.phone}\nEmail: ${salvationForm.email}\nPreferred Start Date: ${salvationForm.startDate}\nDuration (Days): ${salvationForm.duration}\nLodging Required: ${salvationForm.lodging}\n\nMessage/Health Needs:\n${salvationForm.message}`
    );
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  const handleQederSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Qeder Baptism Request: ${qederForm.name}`);
    const body = encodeURIComponent(
      `Name: ${qederForm.name}\nPhone: ${qederForm.phone}\nEmail: ${qederForm.email}\nReason/Context: ${qederForm.reason}\n\nMessage/Details:\n${qederForm.message}`
    );
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  const isAm = lang === 'am';

  return (
    <section id="baptism" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{isAm ? 'ምስጢረ ጥምቀት' : 'Sacrament of Baptism'}</h2>
      </Reveal>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
        
        {/* Scripture Quote */}
        <Reveal direction="up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <blockquote className="scripture-blockquote">
            {isAm 
              ? "«እውነት እውነት እልሃለሁ፥ ሰው ከውኃና ከመንፈስ ካልተወለደ በቀር ወደ እግዚአብሔር መንግሥት ሊገባ አይችልም» (ዮሐንስ ፫፥፭)።"
              : '"Truly, truly, I say to you, unless one is born of water and the Spirit, he cannot enter the kingdom of God" (John 3:5).'}
          </blockquote>
        </Reveal>

        {/* Sub-tabs menu */}
        <Reveal direction="up" as="div" className="baptism-tabs-wrapper">
          <div className="baptism-tabs">
            <button 
              type="button"
              className={`baptism-tab-btn ${activeTab === 'childhood' ? 'active' : ''}`}
              onClick={() => setActiveTab('childhood')}
            >
              {isAm ? 'የልጅነት ጥምቀት /ክርስትና/' : 'Childhood Baptism'}
            </button>
            <button 
              type="button"
              className={`baptism-tab-btn ${activeTab === 'salvation' ? 'active' : ''}`}
              onClick={() => setActiveTab('salvation')}
            >
              {isAm ? 'የድኅነት ጥምቀት /በጸበል/' : 'Salvation Baptism'}
            </button>
            <button 
              type="button"
              className={`baptism-tab-btn ${activeTab === 'qeder' ? 'active' : ''}`}
              onClick={() => setActiveTab('qeder')}
            >
              {isAm ? 'የቄደር ጥምቀት' : 'Qeder Baptism'}
            </button>
          </div>
        </Reveal>

        {/* Tab 1: Childhood Baptism */}
        {activeTab === 'childhood' && (
          <Reveal direction="up" as="div" className="baptism-tab-content">
            <div className="baptism-info-card">
              <p className="baptism-tab-desc">
                {isAm 
                  ? 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ሥርዓት መሠረት፥ ሕፃናት ወንዶች በተወለዱ በ፵ (40) ቀናቸው፥ ሴቶች ደግሞ በተወለዱ በ፹ (80) ቀናቸው የልጅነት ጥምቀትን (ክርስትና) ይፈጽማሉ። ይህም ሕፃናቱ የእግዚአብሔር ልጆች ሆነው በቅድስና እና በቤተክርስቲያን ጥላ ሥር እንዲያድጉ ያደርጋቸዋል።' 
                  : 'In the Ethiopian Orthodox Tewahedo Church, newborn infants are baptized to receive adoption by grace and entry into the body of Christ. According to biblical covenant, baby boys are christened on their 40th day, and baby girls on their 80th day after birth.'}
              </p>
            </div>

            <div className="form-container-card">
              <h3 className="form-card-title">
                {isAm ? 'የልጅነት ጥምቀት ማስፈቀጃ ቅጽ' : 'Childhood Baptism Request Form'}
              </h3>
              
              <form onSubmit={handleChildSubmit} className="services-form">
                <label className="form-label-field">
                  <span>{isAm ? 'የወላጆች ስም' : 'Parents\' Names'} *</span>
                  <input 
                    type="text" 
                    required 
                    value={childForm.parentNames} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, parentNames: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'የሕፃኑ ስም' : 'Child\'s Full Name'} *</span>
                  <input 
                    type="text" 
                    required 
                    value={childForm.childName} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, childName: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'የሕፃኑ ዕድሜ (ቀናት/ወራት)' : 'Child\'s Age (Days/Months)'} *</span>
                  <input 
                    type="text" 
                    required 
                    value={childForm.childAge} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, childAge: e.target.value }))} 
                    className="form-input-field" 
                    placeholder="e.g. 40 days"
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ጾታ' : 'Gender'} *</span>
                  <select 
                    value={childForm.childGender} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, childGender: e.target.value }))} 
                    className="form-select-field"
                  >
                    <option value="boy">{isAm ? 'ወንድ' : 'Boy (40th Day)'}</option>
                    <option value="girl">{isAm ? 'ሴት' : 'Girl (80th Day)'}</option>
                  </select>
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ስልክ' : 'Phone'} *</span>
                  <input 
                    type="tel" 
                    required 
                    value={childForm.phone} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, phone: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'የጥምቀት ቀን ምርጫ' : 'Proposed Baptism Date'} *</span>
                  <input 
                    type="date" 
                    required 
                    value={childForm.proposedDate} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, proposedDate: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ኢሜይል (አማራጭ)' : 'Email (Optional)'}</span>
                  <input 
                    type="email" 
                    value={childForm.email} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, email: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field form-full-width">
                  <span>{isAm ? 'ተጨማሪ መልእክት' : 'Additional Message / Notes'}</span>
                  <textarea 
                    rows={3} 
                    value={childForm.message} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, message: e.target.value }))} 
                    className="form-textarea-field" 
                  />
                </label>

                <div className="form-full-width" style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button type="submit" className="form-submit-btn">
                    {isAm ? 'የጥምቀት ጥያቄ ላክ' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        )}

        {/* Tab 2: Salvation / Healing Baptism */}
        {activeTab === 'salvation' && (
          <Reveal direction="up" as="div" className="baptism-tab-content">
            <div className="baptism-info-card">
              <p className="baptism-tab-desc">
                {isAm 
                  ? 'የድኅነት ጥምቀት (የአማኑኤል ጸበል ቦታ) ለመንፈሳዊና አካላዊ ፈውስ፥ እንዲሁም ለበረከትና ለዕፎይታ የሚደረግ ጸበል ነው። በደብራችን የሚገኘው የቅዱስ አማኑኤል ጸበል ቦታ ምእመናን መንፈሳዊ ድኅነትና ፈውስን የሚያገኙበት የተቀደሰ ስፍራ ነው።' 
                  : 'Salvation and healing baptism through Holy Water (Tsebel) is a source of spiritual and physical deliverance. The Saint Emmanuel Holy Water site at our parish is dedicated to those seeking healing, spiritual restoration, and renewal.'}
              </p>
              
              <div className="baptism-location-box">
                <h4 className="baptism-location-title">{isAm ? 'የአገልግሎቱ ቦታ' : 'Emmanuel Holy Water Site Location'}</h4>
                <p className="baptism-location-text">
                  {isAm 
                    ? 'የቅዱስ አማኑኤል ጸበል ቦታ ከቤተክርስቲያኑ በታችኛው ሸለቆ አጠገብ ባለው ጸጥተኛና ለጸሎት ምቹ በሆነው አረንጓዴ ስፍራ ይገኛል።' 
                    : 'The Saint Emmanuel Holy Water Site is located on the serene lower grounds of the parish, adjacent to the green valley, providing a quiet space for prayer and healing.'}
                </p>
              </div>
            </div>

            <div className="form-container-card">
              <h3 className="form-card-title">
                {isAm ? 'የድኅነት ጥምቀት እና የሱባኤ መመዝገቢያ ቅጽ' : 'Salvation Baptism & Subae Request Form'}
              </h3>
              
              <form onSubmit={handleSalvationSubmit} className="services-form">
                <label className="form-label-field">
                  <span>{isAm ? 'ሙሉ ስም' : 'Full Name'} *</span>
                  <input 
                    type="text" 
                    required 
                    value={salvationForm.name} 
                    onChange={(e) => setSalvationForm(prev => ({ ...prev, name: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ስልክ' : 'Phone'} *</span>
                  <input 
                    type="tel" 
                    required 
                    value={salvationForm.phone} 
                    onChange={(e) => setSalvationForm(prev => ({ ...prev, phone: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'የሱባኤ መግቢያ ቀን' : 'Preferred Start Date'} *</span>
                  <input 
                    type="date" 
                    required 
                    value={salvationForm.startDate} 
                    onChange={(e) => setSalvationForm(prev => ({ ...prev, startDate: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'የቆይታ ጊዜ (ቀናት)' : 'Duration of Stay (Days)'} *</span>
                  <select 
                    value={salvationForm.duration} 
                    onChange={(e) => setSalvationForm(prev => ({ ...prev, duration: e.target.value }))} 
                    className="form-select-field"
                  >
                    <option value="3">{isAm ? '3 ቀናት' : '3 Days'}</option>
                    <option value="7">{isAm ? '7 ቀናት (አንድ ሱባኤ)' : '7 Days (One Subae)'}</option>
                    <option value="14">{isAm ? '14 ቀናት (ሁለት ሱባኤ)' : '14 Days (Two Subaes)'}</option>
                    <option value="custom">{isAm ? 'ሌላ' : 'Other'}</option>
                  </select>
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ማረፊያ / ሎጅንግ ያስፈልጋል?' : 'Lodging / Accommodation Required?'} *</span>
                  <select 
                    value={salvationForm.lodging} 
                    onChange={(e) => setSalvationForm(prev => ({ ...prev, lodging: e.target.value }))} 
                    className="form-select-field"
                  >
                    <option value="no">{isAm ? 'አያስፈልግም (በየቀኑ ይመላለሳሉ)' : 'No (Day Visit Only)'}</option>
                    <option value="yes">{isAm ? 'አዎ (በደብሩ ማረፊያ ይቆያሉ)' : 'Yes (Stay at Parish Lodging)'}</option>
                  </select>
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ኢሜይል (አማራጭ)' : 'Email (Optional)'}</span>
                  <input 
                    type="email" 
                    value={salvationForm.email} 
                    onChange={(e) => setSalvationForm(prev => ({ ...prev, email: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field form-full-width">
                  <span>{isAm ? 'የፈውስ ፍላጎት / ተጨማሪ ማሳሰቢያ' : 'Spiritual/Health Needs or Message'} *</span>
                  <textarea 
                    required 
                    rows={4} 
                    value={salvationForm.message} 
                    onChange={(e) => setSalvationForm(prev => ({ ...prev, message: e.target.value }))} 
                    className="form-textarea-field" 
                    placeholder={isAm ? 'እባክዎ የመጡበትን ዓላማ ወይም የፈውስ ፍላጎት በአጭሩ ይግለጹ...' : 'Please describe your request, spiritual or health goals for this Subae...'}
                  />
                </label>

                <div className="form-full-width" style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button type="submit" className="form-submit-btn">
                    {isAm ? 'የሱባኤ ጥያቄ ላክ' : 'Submit Subae Request'}
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        )}

        {/* Tab 3: Qeder Baptism */}
        {activeTab === 'qeder' && (
          <Reveal direction="up" as="div" className="baptism-tab-content">
            <div className="baptism-info-card">
              <p className="baptism-tab-desc">
                {isAm 
                  ? 'የቄደር ጥምቀት የንስሐና የመመለሻ ጥምቀት ነው። እምነታቸውን ክደው ለነበሩና ወደ ኦርቶዶክስ እምነታቸው ለተመለሱ፥ ወይም ለጣዖት የተሠዋ /በሌሎች አማልክት የተባረከ/ ምግብ ለበሉ፥ ወይም የተከለከለ ሥጋ ለተመገቡ ሰዎች የሚደረግ የንጽሕና እና የዕርቅ ሥርዓት ነው።' 
                  : 'Qeder Baptism is a sacramental service of repentance and restoration. It is intended for individuals who have previously denied their Orthodox faith and wish to return, or those who have eaten food blessed by other gods (sacrificed to idols) or consumed forbidden meats, cleansing them spiritually as they rejoin the church communion.'}
              </p>
            </div>

            <div className="form-container-card">
              <h3 className="form-card-title">
                {isAm ? 'የቄደር ጥምቀት ምዝገባ ቅጽ' : 'Qeder Baptism Registration Form'}
              </h3>
              
              <form onSubmit={handleQederSubmit} className="services-form">
                <label className="form-label-field">
                  <span>{isAm ? 'ሙሉ ስም' : 'Full Name'} *</span>
                  <input 
                    type="text" 
                    required 
                    value={qederForm.name} 
                    onChange={(e) => setQederForm(prev => ({ ...prev, name: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ስልክ' : 'Phone'} *</span>
                  <input 
                    type="tel" 
                    required 
                    value={qederForm.phone} 
                    onChange={(e) => setQederForm(prev => ({ ...prev, phone: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ምክንያት' : 'Reason / Context'} *</span>
                  <select 
                    value={qederForm.reason} 
                    onChange={(e) => setQederForm(prev => ({ ...prev, reason: e.target.value }))} 
                    className="form-select-field"
                  >
                    <option value="denied_faith">{isAm ? 'ከእምነት ውጪ መሆን / መካድ' : 'Denied Faith and Returning'}</option>
                    <option value="idol_food">{isAm ? 'ለጣዖት የተሠዋ / በሌላ እምነት የተባረከ ምግብ መብላት' : 'Ate Food Blessed by Other Gods'}</option>
                    <option value="forbidden_meat">{isAm ? 'የተከለከለ ሥጋ መብላት' : 'Ate Forbidden Meat'}</option>
                    <option value="other">{isAm ? 'ሌላ ምክንያት' : 'Other Repentance Reason'}</option>
                  </select>
                </label>

                <label className="form-label-field">
                  <span>{isAm ? 'ኢሜይል (አማራጭ)' : 'Email (Optional)'}</span>
                  <input 
                    type="email" 
                    value={qederForm.email} 
                    onChange={(e) => setQederForm(prev => ({ ...prev, email: e.target.value }))} 
                    className="form-input-field" 
                  />
                </label>

                <label className="form-label-field form-full-width">
                  <span>{isAm ? 'ተጨማሪ ዝርዝር / የንስሐ አባት አስተያየት' : 'Additional Message / Detail'} *</span>
                  <textarea 
                    required 
                    rows={4} 
                    value={qederForm.message} 
                    onChange={(e) => setQederForm(prev => ({ ...prev, message: e.target.value }))} 
                    className="form-textarea-field" 
                    placeholder={isAm ? 'እባክዎ የመመለስ ሁኔታዎን ወይም ፍላጎትዎን በአጭሩ ይግለጹ...' : 'Please share any additional details or notes on your return...'}
                  />
                </label>

                <div className="form-full-width" style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button type="submit" className="form-submit-btn">
                    {isAm ? 'የቄደር ጥምቀት ጥያቄ ላክ' : 'Submit Qeder Request'}
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
}
