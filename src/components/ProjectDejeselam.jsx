import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Reveal from './Reveal';
import { useLanguage } from '../context/LanguageContext';
import { DiamondOrnament } from './Icons';
import { createClient } from '../lib/supabase/client';
import { MEAL_PRICE, ETHIOPIAN_MONTHS, getEthiopianDate, EOTC_FEASTS } from '../lib/dejeselam';

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

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 to 11
  const [selectedDayObj, setSelectedDayObj] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', freq: 'one_time', meals: '10' });
  const [bookings, setBookings] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const now = new Date();

  // Load real sponsorships (12-month window) from the dejeselam_public view.
  const loadBookings = useCallback(async () => {
    const from = new Date();
    from.setDate(1);
    const to = new Date(from.getFullYear(), from.getMonth() + 12, 0);
    const fmt = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('dejeselam_public')
      .select('sponsor_date, sponsor_name, message, frequency, meals')
      .gte('sponsor_date', fmt(from))
      .lte('sponsor_date', fmt(to))
      .order('created_at', { ascending: true });

    if (error) return;
    const grouped = {};
    for (const row of data || []) {
      const key = row.sponsor_date;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({
        name: row.sponsor_name,
        message: row.message,
        freq: row.frequency,
        meals: row.meals,
      });
    }
    setBookings(grouped);
  }, [supabase]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Generate list of 12 months starting from current month
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      name: isAm ? MONTH_NAMES.am[d.getMonth()] : MONTH_NAMES.en[d.getMonth()]
    });
  }

  const activeMonth = months[currentMonthIndex];

  // Helper to calculate capacity & slots based on EOTC Feast Days
  const getDayDetails = (dateStr) => {
    const parts = dateStr.split('-');
    const gDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const ethioDate = getEthiopianDate(gDate);
    const feast = EOTC_FEASTS[ethioDate.day];
    const isFeast = feast !== undefined;

    return {
      ethioDate,
      feastName: feast ? (isAm ? feast.am : feast.en) : null,
      isFeast,
      capacity: isFeast ? 400 : 200
    };
  };

  // Generate days grid for a specific month
  const getDaysInMonthGrid = (year, month) => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, key: `empty-${i}` });
    }

    // Days in month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        key: `day-${d}`,
        dateStr,
        ...getDayDetails(dateStr)
      });
    }

    return days;
  };

  const getDaySponsors = (dateStr) => bookings[dateStr] || [];

  const getMealsSponsoredSum = (dateStr) => {
    const sponsors = getDaySponsors(dateStr);
    return sponsors.reduce((sum, s) => sum + Number(s.meals || 0), 0);
  };

  const handleDayClick = (dayObj) => {
    if (!dayObj.day) return;
    const currentMeals = getMealsSponsoredSum(dayObj.dateStr);
    const remaining = Math.max(0, dayObj.capacity - currentMeals);

    setSelectedDayObj(dayObj);
    setIsFormOpen(true);
    setFormData({
      name: '',
      phone: '',
      message: '',
      freq: 'one_time',
      meals: remaining > 0 ? String(Math.min(10, remaining)) : '0'
    });
  };

  const handleFormChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDayObj || submitting) return;

    const mealsToBook = Number(formData.meals || 0);
    if (mealsToBook <= 0) return;

    const currentMeals = getMealsSponsoredSum(selectedDayObj.dateStr);
    const remaining = Math.max(0, selectedDayObj.capacity - currentMeals);

    if (mealsToBook > remaining) {
      alert(isAm
        ? `እባክዎን ከቀረው የምግብ መጠን (${remaining}) እኩል ወይም ያነሰ ያስገቡ።`
        : `Please enter a meal count less than or equal to the remaining meals needed (${remaining}).`);
      return;
    }

    // One DB row per covered date; recurring bookings share a group id.
    const groupId =
      typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : null;
    const base = {
      group_id: groupId,
      sponsor_name: formData.name,
      phone: formData.phone,
      message: formData.message || (isAm ? 'የዕለት ማዕድ መባዕ' : 'Sponsoring meals'),
      frequency: formData.freq,
    };

    const targetDay = selectedDayObj.day;
    const monthsToBook =
      formData.freq === 'year_round' ? months : formData.freq === 'monthly' ? months.slice(0, 3) : null;

    const rows = [];
    if (monthsToBook) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (const m of monthsToBook) {
        const isValidDate = new Date(m.year, m.month, targetDay).getDate() === targetDay;
        if (!isValidDate) continue;
        if (new Date(m.year, m.month, targetDay) < today) continue;
        const dateStr = `${m.year}-${String(m.month + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
        const details = getDayDetails(dateStr);
        const currentTotal = getMealsSponsoredSum(dateStr);
        const rem = Math.max(0, details.capacity - currentTotal);
        if (rem > 0) rows.push({ ...base, sponsor_date: dateStr, meals: Math.min(mealsToBook, rem) });
      }
    } else {
      rows.push({ ...base, sponsor_date: selectedDayObj.dateStr, meals: mealsToBook });
    }

    if (rows.length === 0) return;

    setSubmitting(true);
    const { error } = await supabase.from('dejeselam_sponsorships').insert(rows);
    setSubmitting(false);

    if (error) {
      alert(isAm
        ? 'ይቅርታ፣ ጥያቄዎን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
        : 'Sorry, your sponsorship could not be submitted. Please try again.');
      return;
    }

    await loadBookings();
    setFormData({ name: '', phone: '', message: '', freq: 'one_time', meals: '10' });
    setIsFormOpen(false);
    setSelectedDayObj(null);
    alert(isAm ? 'የተሳትፎ ጥያቄዎ በተሳካ ሁኔታ ተልኳል! እናመሰግናለን።' : 'Your sponsorship has been successfully submitted. Thank you and God bless you!');
  };

  const getInitials = (name) => {
    if (!name || name === 'Anonymous' || name === 'ስም-አልባ') return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getDayStatusClass = (dateStr, capacity) => {
    const sponsored = getMealsSponsoredSum(dateStr);
    if (sponsored === 0) return 'available';
    if (sponsored >= capacity) return 'fully-sponsored';
    return 'partially-sponsored';
  };

  const getDayStatusText = (dateStr, capacity) => {
    const sponsored = getMealsSponsoredSum(dateStr);
    if (sponsored === 0) return isAm ? 'ክፍት ቀን' : 'Available';
    if (sponsored >= capacity) return isAm ? 'ተይዟል (ሙሉ)' : 'Covered';
    return isAm ? `${sponsored}/${capacity} ምግቦች` : `${sponsored}/${capacity} Meals`;
  };

  const activeMonthGrid = getDaysInMonthGrid(activeMonth.year, activeMonth.month);

  const title = isAm ? 'ፕሮጀክት ደጀሰላም (ማቴዎስ 25)' : 'Project Dejeselam (Matthew 25)';
  const description = isAm
    ? '«ተርቤ አብልታችሁኛልና...» (ማቴ. 25፥35)። ይህ ፕሮጀክት በቤተ ክርስቲያን ደጃፍ ለሚገኙ የተቸገሩ ወገኖች በየዕለቱ ማዕድ የማጋራት መንፈሳዊ አገልግሎት ነው። ከታች ባለው ካላንደር ላይ በመምረጥ የእርስዎን የበረከት ቀን ያስመዝግቡ።'
    : '“For I was hungry and you gave me food...” (Matthew 25:35). Project Dejeselam is a daily spiritual service dedicated to feeding the needy at the gates of the church. Select an available date below to sponsor a day and share in this blessing.';

  const currentMeals = selectedDayObj ? getMealsSponsoredSum(selectedDayObj.dateStr) : 0;
  const remainingMeals = selectedDayObj ? Math.max(0, selectedDayObj.capacity - currentMeals) : 0;
  const getMultiplier = (freq) => {
    if (freq === 'monthly') return 3;
    if (freq === 'year_round') return 12;
    return 1;
  };
  const multiplier = getMultiplier(formData.freq);
  const totalCost = Number(formData.meals || 0) * MEAL_PRICE * multiplier;

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
          <div className="dejeselam-calendar-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
            {/* Legend */}
            <div className="calendar-legend" style={{ marginBottom: '1.5rem' }}>
              <span className="legend-item">
                <span className="legend-box available"></span> 
                {isAm ? 'ክፍት ቀን' : 'Available'}
              </span>
              <span className="legend-item">
                <span className="legend-box partially"></span> 
                {isAm ? 'በከፊል የተደገፈ' : 'Partially Sponsored'}
              </span>
              <span className="legend-item">
                <span className="legend-box fully"></span> 
                {isAm ? 'ሙሉ በሙሉ የተደገፈ' : 'Fully Covered'}
              </span>
            </div>

            {/* Single Calendar View with Month Navigation */}
            <div className="dejeselam-single-month-wrapper">
              <div className="dejeselam-month-header">
                <button 
                  type="button" 
                  className="dejeselam-nav-btn" 
                  disabled={currentMonthIndex === 0} 
                  aria-label="Previous Month"
                  onClick={() => setCurrentMonthIndex(prev => prev - 1)}
                >
                  &larr;
                </button>
                <span className="dejeselam-month-title">{activeMonth.name} {activeMonth.year}</span>
                <button 
                  type="button" 
                  className="dejeselam-nav-btn" 
                  disabled={currentMonthIndex === months.length - 1} 
                  aria-label="Next Month"
                  onClick={() => setCurrentMonthIndex(prev => prev + 1)}
                >
                  &rarr;
                </button>
              </div>

              <div className="dejeselam-weekdays-grid">
                {isAm 
                  ? WEEKDAYS.am.map((d) => <span key={d}>{d}</span>)
                  : WEEKDAYS.en.map((d) => <span key={d}>{d}</span>)}
              </div>

              <div className="dejeselam-days-grid">
                {activeMonthGrid.map((dayObj) => {
                  if (!dayObj.day) {
                    return <div key={dayObj.key} className="dejeselam-day-btn empty" />;
                  }

                  const totalMeals = getMealsSponsoredSum(dayObj.dateStr);
                  const status = getDayStatusClass(dayObj.dateStr, dayObj.capacity);
                  const isSelected = selectedDayObj?.dateStr === dayObj.dateStr;
                  const progressPercent = Math.min(100, (totalMeals / dayObj.capacity) * 100);

                  return (
                    <button
                      key={dayObj.key}
                      type="button"
                      onClick={() => handleDayClick(dayObj)}
                      className={`dejeselam-day-btn ${status} ${isSelected ? 'selected' : ''} ${dayObj.isFeast ? 'is-feast' : ''}`}
                      aria-label={`Day ${dayObj.day}`}
                    >
                      <span className="dejeselam-day-number">{dayObj.day}</span>
                      
                      {/* EOTC Monthly Feast Indicator Dot */}
                      {dayObj.isFeast && <span className="dejeselam-feast-indicator" title={dayObj.feastName}></span>}
                      
                      {/* Dynamic bottom-edge progress bar (Liquid Gauge) */}
                      {totalMeals > 0 && (
                        <div 
                          className="dejeselam-day-progress-bar" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Day Details & Booking Drawer Panel */}
        {selectedDayObj && (
          <Reveal delay={50} direction="up">
            <div className="dejeselam-details-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(15, 27, 61, 0.08)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--navy)', fontSize: '1.35rem', fontWeight: '700' }}>
                  {isAm 
                    ? `${selectedDayObj.day} ቀን (${activeMonth.name.split(' ')[0]})` 
                    : `Details for ${activeMonth.name} ${selectedDayObj.day}`}
                </h3>
                <button 
                  type="button" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#999' }} 
                  onClick={() => { setSelectedDayObj(null); setIsFormOpen(false); }}
                >
                  &times;
                </button>
              </div>

              {/* Gregorian and Ethiopian date translation detail */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <span className="dejeselam-sponsor-badge" style={{ background: 'rgba(15,27,61,0.05)', color: 'var(--navy)', fontSize: '0.82rem' }}>
                  📅 {isAm ? 'የኢትዮጵያ ቀን ቆጠራ ፦ ' : 'Ethiopian Calendar: '} 
                  {ETHIOPIAN_MONTHS[isAm ? 'am' : 'en'][selectedDayObj.ethioDate.month - 1]} {selectedDayObj.ethioDate.day}
                </span>
                {selectedDayObj.isFeast && (
                  <span className="dejeselam-sponsor-badge" style={{ background: 'rgba(197, 160, 68, 0.15)', color: 'var(--gold-dark)', fontSize: '0.82rem', fontWeight: '700' }}>
                    🌟 {selectedDayObj.feastName}
                  </span>
                )}
              </div>

              {/* Progress & Dynamic Capacity details */}
              <div className="dejeselam-progress-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', color: 'var(--navy)' }}>
                  <span>
                    {isAm ? 'የዕለቱ ግብ ፦ ' : 'Meal Goal: '} 
                    <strong style={{ color: 'var(--gold-dark)' }}>{selectedDayObj.capacity} {isAm ? 'ምግቦች' : 'Meals'}</strong>
                  </span>
                  <span>{getDayStatusText(selectedDayObj.dateStr, selectedDayObj.capacity)}</span>
                </div>
                <div className="dejeselam-progress-bar-bg">
                  <div 
                    className="dejeselam-progress-bar-fill" 
                    style={{ width: `${Math.min(100, (currentMeals / selectedDayObj.capacity) * 100)}%` }}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {selectedDayObj.isFeast 
                    ? (isAm ? '※ የዕለቱ ወርሃዊ በዓል ስለሆነ ማዕድ በእጥፍ (400 ምግቦች) አድጓል።' : '* EOTC Monthly Feast Day: Meal capacity is doubled (400 meals).') 
                    : (isAm ? '※ መደበኛ ቀን ፦ 200 ምግቦች ዒላማ።' : '* Ordinary Day: 200 meals capacity target.')}
                </span>
              </div>

              {/* List of Existing Sponsors */}
              <h4 style={{ color: 'var(--navy)', fontWeight: '600', fontSize: '0.98rem', marginBottom: '0.75rem' }}>
                {isAm ? 'የዕለቱ መጋቢዎች' : 'Sponsors on this Day'}
              </h4>

              {getDaySponsors(selectedDayObj.dateStr).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  {isAm ? 'ይህ ቀን ክፍት ነው! የመጀመርያው ስፖንሰር በመሆን የበረከቱ ተካፋይ ይሁኑ።' : 'No sponsors yet. Be the first to sponsor meals!'}
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
                          <span>{b.name} ({b.meals} {isAm ? 'ምግቦች' : 'Meals'})</span>
                          <span className="dejeselam-sponsor-badge">
                            {b.freq === 'year_round' ? (isAm ? 'ዓመታዊ ቋሚ' : 'Year-Round') : b.freq === 'monthly' ? (isAm ? 'ወርሃዊ ቋሚ' : 'Monthly') : (isAm ? 'አንድ ጊዜ' : 'One-Time')}
                          </span>
                        </h4>
                        <p>“ {b.message} ”</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Booking Form (Only show if slots are available) */}
              {currentMeals < selectedDayObj.capacity ? (
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(15, 27, 61, 0.08)', paddingTop: '1.5rem' }}>
                  <h4 style={{ color: 'var(--navy)', fontWeight: '600', fontSize: '1.05rem', marginBottom: '1rem' }}>
                    {isAm ? 'የበረከት ተካፋይ ለመሆን ይመዝገቡ' : 'Sponsor Meals'}
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

                    <div className="form-row-2">
                      <label className="form-field">
                        <span>{isAm ? 'ለማቅረብ ያሰቡት የምግብ ብዛት' : 'Number of Meals to Sponsor'} *</span>
                        <input 
                          type="number" 
                          required 
                          min={1} 
                          max={remainingMeals} 
                          value={formData.meals} 
                          onChange={handleFormChange('meals')} 
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                          {isAm ? `ከ1 እስከ ${remainingMeals} ምግቦች ማቅረብ ይችላሉ` : `Enter between 1 and ${remainingMeals} meals`}
                        </span>
                      </label>

                      {/* Dynamic Cost Calculator */}
                      <div className="form-field" style={{ justifyContent: 'center' }}>
                        <span>
                          {isAm ? 'የአንዱ ምግብ ዋጋ ፦ 170 ብር' : 'Price per meal: 170 Birr'}
                          {multiplier > 1 && (isAm ? ` (${multiplier} ወራት)` : ` (${multiplier} months)`)}
                        </span>
                        <div className="dejeselam-cost-badge">
                          💵 {isAm ? 'ጠቅላላ ዋጋ ፦ ' : 'Total: '} {totalCost.toLocaleString()} {isAm ? 'ብር' : 'Birr'}
                        </div>
                      </div>
                    </div>

                    <label className="form-field full-width">
                      <span>{isAm ? 'የምስጋና፣ የመታሰቢያ ወይም የጸሎት መልእክት' : 'Prayer Request / Message (Optional)'}</span>
                      <textarea rows={2} value={formData.message} onChange={handleFormChange('message')} placeholder={isAm ? 'ለምሳሌ ፦ ለቤተሰቦቼ በረከት እንዲሆንልኝ...' : 'e.g. In memory of loved ones...'} />
                    </label>

                    {/* Sponsorship Frequency Type Selection */}
                    <div className="form-field full-width">
                      <span style={{ fontSize: '0.88rem', color: 'var(--navy)', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                        {isAm ? 'የማዕድ ማጋራት ዓይነት' : 'Sponsorship Type'}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <input 
                            type="radio" 
                            name="freq" 
                            value="one_time" 
                            checked={formData.freq === 'one_time'} 
                            onChange={handleFormChange('freq')} 
                            style={{ cursor: 'pointer', accentColor: 'var(--navy)' }}
                          />
                          {isAm ? 'ለዚህ ዕለት ብቻ (One-time)' : 'Just for this specific date'}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <input 
                            type="radio" 
                            name="freq" 
                            value="monthly" 
                            checked={formData.freq === 'monthly'} 
                            onChange={handleFormChange('freq')} 
                            style={{ cursor: 'pointer', accentColor: 'var(--navy)' }}
                          />
                          {isAm ? 'ለሚቀጥሉት 3 ወራት በየወሩ (Sponsor this date index for 3 months)' : 'Keep my day monthly (Recurring for 3 months)'}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--gold-dark)' }}>
                          <input 
                            type="radio" 
                            name="freq" 
                            value="year_round" 
                            checked={formData.freq === 'year_round'} 
                            onChange={handleFormChange('freq')} 
                            style={{ cursor: 'pointer', accentColor: 'var(--navy)' }}
                          />
                          {isAm ? 'በዓመት በየወሩ በቋሚነት (Year-Round Commemoration - All 12 months)' : 'Year-Round Commemoration (Sponsor this day every month for the entire year)'}
                        </label>
                      </div>
                    </div>

                    <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button 
                        type="button" 
                        className="cs-btn" 
                        style={{ background: 'rgba(15, 27, 61, 0.05)', color: 'var(--navy)' }} 
                        onClick={() => { setSelectedDayObj(null); setIsFormOpen(false); }}
                      >
                        {isAm ? 'ሰርዝ' : 'Cancel'}
                      </button>
                      <button type="submit" className="cs-btn cs-btn-filled" disabled={submitting}>
                        {submitting
                          ? (isAm ? 'በመላክ ላይ…' : 'Submitting…')
                          : (isAm ? 'አረጋግጥ' : 'Confirm Sponsorship')}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ marginTop: '2rem', background: 'rgba(15, 27, 61, 0.03)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', border: '1px dashed rgba(15, 27, 61, 0.1)' }}>
                  <p style={{ margin: 0, fontWeight: '700', color: 'var(--navy)', fontSize: '0.95rem' }}>
                    🌟 {isAm 
                      ? 'ይህ ቀን ሙሉ በሙሉ ተደግፏል። እባክዎን ሌላ ክፍት ቀን ይምረጡ።' 
                      : 'All meals for this day are fully sponsored! Please choose another open date.'}
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
