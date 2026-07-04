/**
 * Shared Project Dejeselam calendar logic — used by the public sponsorship
 * calendar and the admin manager so capacities and feast days always agree.
 */

export const MEAL_PRICE = 170; // birr per meal

export const ETHIOPIAN_MONTHS = {
  en: ['Meskerem', 'Tekemt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 'Megabit', 'Miazia', 'Genbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'],
  am: ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'],
};

// EOTC monthly feast days (Ethiopian calendar day-of-month)
export const EOTC_FEASTS = {
  1: { en: 'Lideta Maryam (Birthday of St. Mary)', am: 'ልደታ ለማርያም (የእመቤታችን ልደት)' },
  9: { en: 'St. Thomas (ቅዱስ ቶማስ)', am: 'ቅዱስ ቶማስ' },
  12: { en: 'St. Michael (ቅዱስ ሚካኤል)', am: 'ቅዱስ ሚካኤል' },
  19: { en: 'St. Gabriel (ቅዱስ ገብርኤል)', am: 'ቅዱስ ገብርኤል' },
  21: { en: 'Dengel Mariam (St. Mary / ማርያም)', am: 'ቅድስት ድንግል ማርያም (ማርያም)' },
  27: { en: 'Medhane Alem (Savior of the World)', am: 'መድኃኔዓለም (የዓለም መድኃኒት)' },
  29: { en: 'Beale Wold (Feast of God the Son)', am: 'በዓለ ወልድ' },
};

/** Gregorian Date → Ethiopian {day, month, year}. */
export function getEthiopianDate(gregorianDate) {
  const jd = Math.floor(gregorianDate.getTime() / 86400000) + 2440588; // Julian Date
  const r = (jd - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const ethioYear = 4 * Math.floor((jd - 1723856) / 1461) + Math.floor(r / 365) - (Math.floor(r / 1460) === 1 ? 1 : 0);
  const ethioMonth = Math.floor(n / 30) + 1;
  const ethioDay = (n % 30) + 1;
  return { day: ethioDay, month: ethioMonth, year: ethioYear };
}

/** Feast + capacity details for a 'YYYY-MM-DD' date string. */
export function getDayDetails(dateStr, lang = 'en') {
  const [y, m, d] = dateStr.split('-').map(Number);
  const ethioDate = getEthiopianDate(new Date(y, m - 1, d));
  const feast = EOTC_FEASTS[ethioDate.day];
  return {
    ethioDate,
    feastName: feast ? feast[lang === 'am' ? 'am' : 'en'] : null,
    isFeast: feast !== undefined,
    capacity: feast ? 400 : 200,
  };
}

/** Format a Date as the 'YYYY-MM-DD' key used across the feature. */
export function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
