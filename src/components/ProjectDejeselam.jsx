import React, { useState } from 'react';
import Reveal from './Reveal';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectDejeselam() {
  const { lang } = useLanguage();
  
  // State for the calendar
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  // For demonstration, mock a list of "covered" days in the current month (1-30/31)
  // Let's assume current month has 30 days and days 5, 12, 19, 25 are covered.
  const [coveredDays, setCoveredDays] = useState([5, 12, 19, 25]);
  const daysInMonth = 30; // Hardcoded for mockup, ideally this would use Date logic

  const handleDayClick = (day) => {
    if (coveredDays.includes(day)) return; // Can't book a covered day
    setSelectedDate(day);
    setIsFormOpen(true);
  };

  const handleFormChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate) return;

    // In a real app, we would send this data to Supabase.
    // For now, immediately mark the day as covered locally.
    setCoveredDays((prev) => [...prev, selectedDate]);
    setIsFormOpen(false);
    setSelectedDate(null);
    setFormData({ name: '', phone: '', message: '' });
    alert(lang === 'am' ? 'የተሳትፎ ጥያቄዎ በተሳካ ሁኔታ ተልኳል! እናመሰግናለን።' : 'Your booking has been successfully submitted. Thank you and God bless you!');
  };

  const title = lang === 'am' ? 'ፕሮጀክት ደጀሰላም (ማቴዎስ 25)' : 'Project Dejeselam (Matthew 25)';
  const description = lang === 'am' 
    ? '«ተርቤ አብልታችሁኛልና...» (ማቴ. 25፥35)። ይህ ፕሮጀክት በቤተ ክርስቲያን ደጃፍ ለሚገኙ የተቸገሩ ወገኖች በየዕለቱ ማዕድ የማጋራት መንፈሳዊ አገልግሎት ነው። ከታች ባለው ካላንደር ላይ በመምረጥ የእርስዎን የበረከት ቀን ያስመዝግቡ።'
    : '“For I was hungry and you gave me food...” (Matthew 25:35). Project Dejeselam is a daily spiritual service dedicated to feeding the needy at the gates of the church. Select an available date below to sponsor a day and share in this blessing.';

  return (
    <section id="project-dejeselam" className="services-section">
      <Reveal className="services-heading">
        <h2 className="services-title">{title}</h2>
      </Reveal>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <Reveal delay={100} direction="up">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            {description}
          </p>
        </Reveal>

        <Reveal delay={200} direction="up">
          <div className="dejeselam-calendar-container">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              {lang === 'am' ? 'የዚህ ወር የዕለት ማዕድ መርሃ ግብር' : 'This Month\'s Feeding Schedule'}
            </h3>
            
            <div className="calendar-legend">
              <span className="legend-item"><span className="legend-box available"></span> {lang === 'am' ? 'ክፍት ቀን (ለመሳተፍ)' : 'Available'}</span>
              <span className="legend-item"><span className="legend-box covered"></span> {lang === 'am' ? 'የተያዘ ቀን' : 'Covered'}</span>
            </div>

            <div className="calendar-grid">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isCovered = coveredDays.includes(day);
                const isSelected = selectedDate === day;
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    disabled={isCovered}
                    className={`calendar-day ${isCovered ? 'covered' : 'available'} ${isSelected ? 'selected' : ''}`}
                    aria-label={`Day ${day}`}
                  >
                    <span className="day-number">{day}</span>
                    <span className="day-status">
                      {isCovered ? (lang === 'am' ? 'ተይዟል' : 'Covered') : (lang === 'am' ? 'ይሳተፉ' : 'Book')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {isFormOpen && (
          <Reveal delay={100} direction="up">
            <div className="dejeselam-booking-form-section">
              <h3 className="form-title">
                {lang === 'am' 
                  ? `ለቀን ${selectedDate} ማዕድ መርሐግብር ያስመዝግቡ` 
                  : `Sponsor Meals for Day ${selectedDate}`}
              </h3>
              <p className="form-intro">
                {lang === 'am'
                  ? 'እባክዎን ከታች ያለውን ቅጽ ይሙሉ:: ኃላፊው በቅርቡ ያነጋግርዎታል።'
                  : 'Please fill out the form below. Our coordinator will contact you shortly to arrange the details.'}
              </p>

              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-row-2">
                  <label className="form-field">
                    <span>{lang === 'am' ? 'ሙሉ ስም' : 'Full Name'} *</span>
                    <input type="text" required value={formData.name} onChange={handleFormChange('name')} />
                  </label>
                  <label className="form-field">
                    <span>{lang === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'} *</span>
                    <input type="tel" required value={formData.phone} onChange={handleFormChange('phone')} />
                  </label>
                </div>

                <label className="form-field full-width">
                  <span>{lang === 'am' ? 'መልእክት ወይም ተጨማሪ መረጃ (አማራጭ)' : 'Message / Additional Info (Optional)'}</span>
                  <textarea rows={3} value={formData.message} onChange={handleFormChange('message')} />
                </label>

                <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button type="button" className="cs-btn" style={{ background: '#eee', color: '#333' }} onClick={() => setIsFormOpen(false)}>
                    {lang === 'am' ? 'ሰርዝ' : 'Cancel'}
                  </button>
                  <button type="submit" className="cs-btn cs-btn-filled">
                    {lang === 'am' ? 'አረጋግጥ' : 'Confirm Booking'}
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
