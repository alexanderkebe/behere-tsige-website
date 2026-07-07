/**
 * Locale-aware date/time formatting. Amharic uses the ETHIOPIAN calendar
 * (ዓ.ም. years, ሐምሌ/መስከረም months), not a translated Gregorian date.
 *
 * NOTE: the calendar identifier is 'ethiopic' — 'ethiopian' is not a valid
 * BCP-47 tag and makes Intl throw (the bug that silently disabled Ethiopian
 * dates before).
 */

const AMHARIC_ETHIOPIC = 'am-ET-u-ca-ethiopic';

export function dateLocale(lang) {
  return lang === 'am' ? AMHARIC_ETHIOPIC : 'en-US';
}

/** Formats a date string for display; returns '' when missing/invalid. */
export function formatDate(dateStr, lang, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString(dateLocale(lang), options);
  } catch {
    return String(dateStr);
  }
}

/** { month, day } pieces for calendar badges, in the right calendar system. */
export function calendarParts(dateStr, lang) {
  if (!dateStr) return { month: '', day: '' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { month: '', day: '' };
    const locale = dateLocale(lang);
    return {
      month: d.toLocaleDateString(locale, { month: 'short' }).replace('.', ''),
      day: d.toLocaleDateString(locale, { day: 'numeric' }),
    };
  } catch {
    return { month: '', day: '' };
  }
}

/** "HH:MM[:SS]" → localized 12-hour time (ጠዋት/ከሰዓት in Amharic). */
export function formatTime(timeStr, lang) {
  if (!timeStr) return '';
  try {
    const parts = String(timeStr).split(':');
    if (parts.length < 2) return timeStr;
    const hour = Number(parts[0]);
    const min = parts[1];
    if (isNaN(hour)) return timeStr;
    const isAm = lang === 'am';
    const ampm = hour >= 12 ? (isAm ? 'ከሰዓት' : 'PM') : (isAm ? 'ጠዋት' : 'AM');
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${min} ${ampm}`;
  } catch {
    return timeStr;
  }
}
