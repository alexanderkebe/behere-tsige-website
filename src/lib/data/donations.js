import { createPublicClient } from '../supabase/public';

/**
 * Fetches all donation projects from the database, ordered by creation date.
 */
const MOCK_PROJECTS = [
  // Parish (parish)
  {
    id: 'mock-p1',
    category: 'parish',
    title_en: 'Iconography & Wall Painting Restoration',
    title_am: 'የቅድስት ሥዕላትና የግድግዳ ቅብ ዕድሳት',
    description_en: 'Preserving the historic spiritual wall paintings and sacred iconography inside our cathedral.',
    description_am: 'በካቴድራላችን ውስጥ የሚገኙትን ታሪካዊና መንፈሳዊ የግድግዳ ቅዱሳት ሥዕላትን የመጠገንና የመጠበቅ ሥራ።',
    raised_amount: 150000,
    goal_amount: 500000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/restoration/800/600'
  },
  {
    id: 'mock-p2',
    category: 'parish',
    title_en: 'Cathedral Audio & Sound System Upgrade',
    title_am: 'የድምፅ መሣሪያዎችና የድምፅ ሥርዓት ማሻሻያ',
    description_en: 'Upgrading the internal and external sound systems to ensure clear transmission of liturgies and sermons.',
    description_am: 'ቅዳሴና ትምህርተ ወንጌል በግልጽ እንዲሰማ የውስጥና የውጭ የድምፅ ማጉያዎችን የማሻሻልና አዲስ የመግዛት ሥራ።',
    raised_amount: 85000,
    goal_amount: 300000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/audio/800/600'
  },
  {
    id: 'mock-p3',
    category: 'parish',
    title_en: 'Purchase of Holy Vessels and Vestments',
    title_am: 'የቅዱሳት ንዋያተ ቅድሳትና አልባሳት ግዢ',
    description_en: 'Acquiring new liturgical vestments for priests and sacred vessels for the celebration of the Holy Eucharist.',
    description_am: 'ለቀሳውስትና ለዲያቆናት መገልገያ የሚሆኑ የአገልግሎት አልባሳትና የቅዳሴ ንዋያተ ቅድሳት ግዢ።',
    raised_amount: 45000,
    goal_amount: 150000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/vessel/800/600'
  },

  // Sunday School (sunday_school)
  {
    id: 'mock-ss1',
    category: 'sunday_school',
    title_en: 'Youth Choir Instruments & Uniforms',
    title_am: 'የክራር፣ የከበሮና የመዘምራን አልባሳት ድጋፍ',
    description_en: 'Providing spiritual instruments (drums, harps) and liturgical uniforms for our growing youth choir.',
    description_am: 'ለሰንበት ትምህርት ቤት መዘምራን አገልግሎት የሚሆኑ የዝማሬ መሣሪያዎች (ከበሮ፣ በገና) እና ወጥ አልባሳት ዝግጅት።',
    raised_amount: 60000,
    goal_amount: 200000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/choir/800/600'
  },
  {
    id: 'mock-ss2',
    category: 'sunday_school',
    title_en: 'Spiritual Book & Library Development',
    title_am: 'የቤተ መጻሕፍት ማደራጃና የመጻሕፍት ግዢ',
    description_en: 'Expanding our Sunday School library with reference theological books and study materials for children.',
    description_am: 'ለሕፃናትና ለወጣቶች መማሪያ የሚሆኑ የሃይማኖት መጻሕፍትን በመግዛት የሰንበት ትምህርት ቤቱን ቤተ መጻሕፍት ማደራጀት።',
    raised_amount: 32000,
    goal_amount: 100000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/library/800/600'
  },
  {
    id: 'mock-ss3',
    category: 'sunday_school',
    title_en: 'Spiritual Seminars & Pilgrimages',
    title_am: 'መንፈሳዊ ጉባኤያትና የነጋዲያን ጉዞዎች',
    description_en: 'Supporting theological training seminars, youth retreats, and educational pilgrimages to historic monasteries.',
    description_am: 'ለወጣቶች የሚዘጋጁ የመጽሐፍ ቅዱስ ሴሚናሮችን፣ መንፈሳዊ ኮርሶችንና ወደ ታሪካዊ ገዳማት የሚደረጉ ጉዞዎችን መደገፍ።',
    raised_amount: 25000,
    goal_amount: 80000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/pilgrimage/800/600'
  },

  // Abnet School (abnet)
  {
    id: 'mock-ab1',
    category: 'abnet',
    title_en: 'Traditional Parchment & Ink Making Class',
    title_am: 'የብራናና የቀለም ቀመር ዝግጅት መማሪያ',
    description_en: 'Funding tools and raw materials for students learning the ancient art of writing scripture on traditional parchment.',
    description_am: 'የጥንቱን የብራና መጻሕፍት አጻጻፍና የቀለም ቀመር ጥበብ ለሚማሩ የአብነት ተማሪዎች የመማሪያ መሣሪያዎች ግዢ።',
    raised_amount: 40000,
    goal_amount: 120000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/parchment/800/600'
  },
  {
    id: 'mock-ab2',
    category: 'abnet',
    title_en: 'Abnet Student Housing & Dormitory Repairs',
    title_am: 'የአብነት ተማሪዎች ማረፊያ (የተማሪዎች ቤት) ዕድሳት',
    description_en: 'Renovating student cottages (Gojo-bets) and dormitories to provide a safe, dry shelter during winter months.',
    description_am: 'የአብነት ተማሪዎች በክረምት ወራት ከዝናብና ከብርድ ተጠልለው የሚማሩበትን የጎጆ ቤቶች ዕድሳት።',
    raised_amount: 90000,
    goal_amount: 250000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/dorm/800/600'
  },
  {
    id: 'mock-ab3',
    category: 'abnet',
    title_en: 'Daily Bread & Stipends for Students',
    title_am: 'የአብነት ተማሪዎች ዕለታዊ ቀለብና የኪስ መደገፊያ',
    description_en: 'Providing regular meals and basic stipends to ensure students can focus fully on memorizing traditional chants and hymns.',
    description_am: 'የቅኔ፣ የዜማና የትርጓሜ ተማሪዎች ትምህርታቸውን ብቻ ትኩረት እንዲሰጡ ዕለታዊ ቀለብና መሠረታዊ ፍላጎቶችን ማሟላት።',
    raised_amount: 110000,
    goal_amount: 300000,
    currency: 'ETB',
    cover_url: 'https://picsum.photos/seed/bread/800/600'
  }
];

/**
 * Fetches all donation projects from the database, ordered by creation date.
 */
export async function getDonationProjects() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('donation_projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching donation projects:', error);
    // Pad anyway using mocks if Supabase is offline
    const fallback = [];
    const categories = ['parish', 'sunday_school', 'abnet'];
    categories.forEach(cat => {
      fallback.push(...MOCK_PROJECTS.filter(p => p.category === cat));
    });
    return fallback;
  }

  const combined = [...(data || [])];
  const categories = ['parish', 'sunday_school', 'abnet'];
  categories.forEach(cat => {
    const existingCount = combined.filter(p => p.category === cat).length;
    if (existingCount < 3) {
      const mocksToAdd = MOCK_PROJECTS.filter(p => p.category === cat).slice(0, 3 - existingCount);
      combined.push(...mocksToAdd);
    }
  });

  return combined;
}

/**
 * Fetches all bank accounts from the database, ordered by display order.
 */
export async function getBankAccounts() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching bank accounts:', error);
    return [];
  }
  return data;
}
