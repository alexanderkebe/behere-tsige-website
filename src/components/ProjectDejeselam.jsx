import React, { useState, useEffect } from 'react';
import Reveal from './Reveal';
import { useLanguage } from '../context/LanguageContext';
import { DiamondOrnament } from './Icons';

const MONTH_NAMES = {
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  am: [
    'ጥር / ጃንዋሪ',
    'የካቲት / ፌብሩዋሪ',
    'መጋቢት / ማርች',
    'ሚያዝያ / ኤፕሪል',
    'ግንቦት / ሜይ',
    'ሰኔ / ጁን',
    'ሐምሌ / ጁላይ',
    'ነሐሴ / ኦገስት',
    'መስከረም / ሴፕቴምበር',
    'ጥቅምት / ኦክቶበር',
    'ኅዳር / ኖቬምበር',
    'ታኅሣሥ / ዲሴምበር'
  ]
};

const WEEKDAYS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  am: ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ']
};

export default function ProjectDejeselam() {
  const { lang } = useLanguage();
  const isAm = lang === 'am' || lang === 'gez';

  const [selectedDayObj, setSelectedDayObj] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', isMonthly: false });
  const [bookings, setBookings] = useState({});

  const now = new Date();

  // Helper to generate date strings
  const relDate = (monthOffset, day) => {
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, day);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Seed mock bookings relative to current dates
  useEffect(() => {
    const initialBookings = {
      [relDate(0, 5)]: [
        { name: 'Kassa Tekle', phone: '+251911223344', message: 'In memory of my parents', isMonthly: true },
        { name: 'Selamawit Girma', phone: '+251912345678', message: 'Blessings for the family', isMonthly: false }
      ],
      [relDate(0, 12)]: [
        { name: 'Anonymous', phone: '+251900000000', message: 'Prayers for health', isMonthly: false },
        { name: 'Abraha Yosef', phone: '+251911998877', message: 'For our children', isMonthly: true },
        { name: 'Martha Hailu', phone: '+251922334455', message: 'Thanksgiving', isMonthly: false }
      ],
      [relDate(0, 19)]: [
        { name: 'Yared Shimelis', phone: '+251944556677', message: 'For the church', isMonthly: false }
      ],
      [relDate(1, 10)]: [
        { name: 'Anonymous', phone: '+251900000000', message: 'Sponsoring a meal', isMonthly: true }
      ],
      [relDate(1, 20)]: [
        { name: 'Daniel Kebede', phone: '+251911224466', message: 'May God keep us', isMonthly: false },
        { name: 'Anonymous', phone: '+251900000000', message: 'Feeding the needy', isMonthly: false }
      ],
      [relDate(2, 15)]: [
        { name: 'Tewodros Assefa', phone: '+251911554433', message: 'Blessings', isMonthly: true },
        { name: 'Anonymous', phone: '+251900000000', message: 'In honor of St. Mary', isMonthly: true },
        { name: 'Genet Bekele', phone: '+251912887766', message: 'Sponsoring', isMonthly: false }
      ]
    };
    setBookings(initialBookings);
  }, []);

  // Generate list of 3 months starting from the current month
  const months = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      name: isAm ? MONTH_NAMES.am[d.getMonth()] : MONTH_NAMES.en[d.getMonth()]
    });
  }

  // Generate days grid for a specific month
  const getDaysInMonthGrid = (year, month) => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const days = [];

    // Empty cells at start of month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, key: `empty-${i}` });
    }

    // Actual calendar days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        key: `day-${d}`,
        dateStr
      });
    }

    return days;
  };

  const handleDayClick = (dayObj) => {
    if (!dayObj.day) return;
    setSelectedDayObj(dayObj);
    setIsFormOpen(true);
  };

  const handleFormChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedDayObj) return;

    const newBooking = {
      name: formData.name,
      phone: formData.phone,
      message: formData.message || (isAm ? 'የዕለት ማዕድ መባዕ' : 'Sponsoring meals'),
      isMonthly: formData.isMonthly
    };

    const targetDay = selectedDayObj.day;
    const targetDateStr = selectedDayObj.dateStr;

    setBookings((prev) => {
      const updated = { ...prev };

      if (formData.isMonthly) {
        // Set sponsorship on this day index across all 3 months
        months.forEach((m) => {
          const dateStr = `${m.year}-${String(m.month + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
          const isValidDate = new Date(m.year, m.month, targetDay).getDate() === targetDay;

          if (isValidDate) {
            if (!updated[dateStr]) updated[dateStr] = [];
            if (updated[dateStr].length < 3) {
              updated[dateStr] = [...updated[dateStr], { ...newBooking, isMonthly: true }];
            }
          }
        });
      } else {
        // One-time booking
        if (!updated[targetDateStr]) updated[targetDateStr] = [];
        if (updated[targetDateStr].length < 3) {
          updated[targetDateStr] = [...updated[targetDateStr], newBooking];
        }
      }

      return updated;
    });

    setFormData({ name: '', phone: '', message: '', isMonthly: false });
    setIsFormOpen(false);
    setSelectedDayObj(null);
    alert(isAm ? 'የተሳትፎ ጥያቄዎ በተሳካ ሁኔታ ተልኳል! እናመሰግናለን።' : 'Your sponsorship has been successfully submitted. Thank you and God bless you!');
  };

  const getDaySponsors = (dateStr) => bookings[dateStr] || [];

  const getInitials = (name) => {
    if (!name || name === 'Anonymous' || name === 'ስም-አልባ') return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getDayStatusClass = (dateStr) => {
    const count = getDaySponsors(dateStr).length;
    if (count === 0) return 'available';
    if (count >= 3) return 'fully-sponsored';
    return 'partially-sponsored';
  };

  const getDayStatusText = (dateStr) => {
    const count = getDaySponsors(dateStr).length;
    if (count === 0) return isAm ? 'ክፍት ቀን' : 'Available';
    if (count >= 3) return isAm ? 'ተይዟል' : 'Sponsors Met';
    return isAm ? `${count}/3 ተይዟል` : `${count}/3 Sponsors`;
  };

  const title = isAm ? 'ፕሮጀክት ደጀሰላም (ማቴዎስ 25)' : 'Project Dejeselam (Matthew 25)';
  const description = isAm
    ? '«ተርቤ አብልታችሁኛልና...» (ማቴ. 25፥35)። ይህ ፕሮጀክት በቤተ ክርስቲያን ደጃፍ ለሚገኙ የተቸገሩ ወገኖች በየዕለቱ ማዕድ የማጋራት መንፈሳዊ አገልግሎት ነው። ከታች ባለው ካላንደር ላይ በመምረጥ የእርስዎን የበረከት ቀን ያስመዝግቡ።'
    : '“For I was hungry and you gave me food...” (Matthew 25:35). Project Dejeselam is a daily spiritual service dedicated to feeding the needy at the gates of the church. Select an available date below to sponsor a day and share in this blessing.';

  return (
    <section id="project-dejeselam" className="services-section">
      <Reveal className="services-heading">
        <h2 className="services-title">{title}</h2>
      </Reveal>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <Reveal delay={100} direction="up">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '3.5rem', maxWidth: '800px', margin: '0 auto 3.5rem' }}>
            {description}
          </p>
        </Reveal>

        <Reveal delay={200} direction="up">
          <div className="dejeselam-calendar-container">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700' }}>
              {isAm ? 'የዕለት ማዕድ መጋቢዎች መርሐግብር' : 'Sponsorship Calendar Grid'}
            </h3>

            <div className="calendar-legend">
              <span className="legend-item">
                <span className="legend-box available"></span> 
                {isAm ? 'ክፍት ቀን' : 'Available (0/3 slots)'}
              </span>
              <span className="legend-item">
                <span className="legend-box partially"></span> 
                {isAm ? 'በከፊል የተያዘ (1-2 ስፖንሰሮች)' : 'Partially Sponsored (1-2 slots)'}
              </span>
              <span className="legend-item">
                <span className="legend-box fully"></span> 
                {isAm ? 'የተያዘ ቀን' : 'Fully Sponsored (3/3 slots)'}
              </span>
            </div>

            {/* Horizontally Scrollable Month Grids */}
            <div className="dejeselam-months-scroll-container">
              {months.map((m) => {
                const dayGrid = getDaysInMonthGrid(m.year, m.month);
                return (
                  <div key={`${m.year}-${m.month}`} className="dejeselam-month-card">
                    <div className="dejeselam-month-header">
                      <span className="dejeselam-month-title">{m.name} {m.year}</span>
                    </div>

                    <div className="dejeselam-weekdays-grid">
                      {isAm 
                        ? WEEKDAYS.am.map((d) => <span key={d}>{d}</span>)
                        : WEEKDAYS.en.map((d) => <span key={d}>{d}</span>)}
                    </div>

                    <div className="dejeselam-days-grid">
                      {dayGrid.map((dayObj) => {
                        if (!dayObj.day) {
                          return <div key={dayObj.key} className="dejeselam-day-btn empty" />;
                        }

                        const status = getDayStatusClass(dayObj.dateStr);
                        const sponsors = getDaySponsors(dayObj.dateStr);
                        const isSelected = selectedDayObj?.dateStr === dayObj.dateStr;

                        return (
                          <button
                            key={dayObj.key}
                            type="button"
                            onClick={() => handleDayClick(dayObj)}
                            className={`dejeselam-day-btn ${status} ${isSelected ? 'selected' : ''}`}
                            aria-label={`Day ${dayObj.day}`}
                          >
                            <span className="dejeselam-day-number">{dayObj.day}</span>
                            
                            {/* Slots Indicators (3 dots) */}
                            <div className="dejeselam-slot-dots">
                              <span className={`dejeselam-slot-dot ${sponsors.length >= 1 ? 'filled' : ''}`}></span>
                              <span className={`dejeselam-slot-dot ${sponsors.length >= 2 ? 'filled' : ''}`}></span>
                              <span className={`dejeselam-slot-dot ${sponsors.length >= 3 ? 'filled' : ''}`}></span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Selected Day Details & Booking Drawer Panel */}
        {selectedDayObj && (
          <Reveal delay={50} direction="up">
            <div className="dejeselam-details-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(15, 27, 61, 0.08)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--navy)', fontSize: '1.4rem', fontWeight: '700' }}>
                  {isAm 
                    ? `${selectedDayObj.day} ቀን መጋቢዎች መረጃ` 
                    : `Sponsorship for Day ${selectedDayObj.day}`}
                </h3>
                <button 
                  type="button" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#999' }} 
                  onClick={() => { setSelectedDayObj(null); setIsFormOpen(false); }}
                >
                  &times;
                </button>
              </div>

              {/* Progress Bar Slot Occupancy */}
              <div className="dejeselam-progress-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', color: 'var(--navy)' }}>
                  <span>{isAm ? 'ማዕድ ማጋራት ሁኔታ' : 'Sponsorship Slots Progress'}</span>
                  <span>{getDayStatusText(selectedDayObj.dateStr)}</span>
                </div>
                <div className="dejeselam-progress-bar-bg">
                  <div 
                    className="dejeselam-progress-bar-fill" 
                    style={{ width: `${(getDaySponsors(selectedDayObj.dateStr).length / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* List of Existing Sponsors */}
              <h4 style={{ color: 'var(--navy)', fontWeight: '600', fontSize: '1rem', marginBottom: '0.75rem' }}>
                {isAm ? 'የዕለቱ መጋቢዎች (በረከት ተካፋዮች)' : 'Sponsors on this Day'}
              </h4>

              {getDaySponsors(selectedDayObj.dateStr).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {isAm ? 'ይህ ቀን ክፍት ነው! የመጀመርያው ስፖንሰር በመሆን የበረከቱ ተካፋይ ይሁኑ።' : 'No sponsors yet. Be the first to sponsor a slot!'}
                </p>
              ) : (
                <div className="dejeselam-sponsors-list">
                  {getDaySponsors(selectedDayObj.dateStr).map((b, idx) => (
                    <div key={idx} className="dejeselam-sponsor-item">
                      <div className="dejeselam-sponsor-avatar">
                        {getInitials(b.name)}
                      </div>
                      <div className="dejeselam-sponsor-info">
                        <h4>
                          <span>{b.name}</span>
                          <span className="dejeselam-sponsor-badge">
                            {b.isMonthly ? (isAm ? 'ወርሃዊ ቋሚ' : 'Monthly') : (isAm ? 'አንድ ጊዜ' : 'One-Time')}
                          </span>
                        </h4>
                        <p>“ {b.message} ”</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Booking Form (Only show if slots < 3) */}
              {getDaySponsors(selectedDayObj.dateStr).length < 3 ? (
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(15, 27, 61, 0.08)', paddingTop: '1.5rem' }}>
                  <h4 style={{ color: 'var(--navy)', fontWeight: '600', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    {isAm ? 'የበረከት ተካፋይ ለመሆን ይመዝገቡ' : 'Sponsor a Slot'}
                  </h4>

                  <form onSubmit={handleBookingSubmit} className="booking-form" style={{ gap: '1.25rem' }}>
                    <div className="form-row-2">
                      <label className="form-field">
                        <span>{isAm ? 'ሙሉ ስም' : 'Full Name'} *</span>
                        <input type="text" required value={formData.name} onChange={handleFormChange('name')} />
                      </label>
                      <label className="form-field">
                        <span>{isAm ? 'ስልክ ቁጥር' : 'Phone Number'} *</span>
                        <input type="tel" required value={formData.phone} onChange={handleFormChange('phone')} />
                      </label>
                    </div>

                    <label className="form-field full-width">
                      <span>{isAm ? 'የምስጋና፣ የመታሰቢያ ወይም የጸሎት መልእክት' : 'Prayer Request / Message (Optional)'}</span>
                      <textarea rows={2} value={formData.message} onChange={handleFormChange('message')} placeholder={isAm ? 'ለምሳሌ ፦ ለቤተሰቦቼ በረከት እንዲሆንልኝ...' : 'e.g. In memory of loved ones...'} />
                    </label>

                    {/* Monthly option */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0 1rem 0' }}>
                      <input 
                        type="checkbox" 
                        id="monthlyCheckbox" 
                        checked={formData.isMonthly} 
                        onChange={handleFormChange('isMonthly')} 
                        style={{ width: '18px', height: '18px', accentColor: 'var(--navy)', cursor: 'pointer' }}
                      />
                      <label htmlFor="monthlyCheckbox" style={{ fontSize: '0.92rem', color: 'var(--navy)', fontWeight: '600', cursor: 'pointer' }}>
                        {isAm ? 'ለዚህ ዕለት በየወሩ በቋሚነት ማዕድ አጋራለሁ (Keep my day monthly)' : 'Keep my day monthly (Recurring monthly sponsorship)'}
                      </label>
                    </div>

                    <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button 
                        type="button" 
                        className="cs-btn" 
                        style={{ background: 'rgba(15, 27, 61, 0.05)', color: 'var(--navy)' }} 
                        onClick={() => { setSelectedDayObj(null); setIsFormOpen(false); }}
                      >
                        {isAm ? 'ሰርዝ' : 'Cancel'}
                      </button>
                      <button type="submit" className="cs-btn cs-btn-filled">
                        {isAm ? 'አረጋግጥ' : 'Confirm Sponsorship'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ marginTop: '2rem', background: 'rgba(15, 27, 61, 0.03)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px dashed rgba(15, 27, 61, 0.1)' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: 'var(--navy)', fontSize: '0.95rem' }}>
                    🌟 {isAm 
                      ? 'ይህ ቀን ሙሉ በሙሉ ተይዟል። እባክዎን ሌላ ክፍት ቀን ይምረጡ።' 
                      : 'All slots for this day are fully sponsored! Please choose another open date.'}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
