/** Default site content — edited via /admin and stored in data/content.json */
const defaultContent = {
  hero: {
    en: {
      bubble: 'Welcome to Behere Tsige',
      title: 'Mekane Selam St. Mary',
      description:
        '“Let no foreigner who has joined himself to the Lord say, ‘The Lord will surely separate me from His people.’” — Isaiah 56:3',
    },
    am: {
      bubble: 'እንኳን ወደ ብሔረ ጽጌ',
      title: 'መካነ ሰላም ቅድስት ድንግል ማርያም',
      welcome: 'በደህና መጡ',
      description:
        '“ከእግዚአብሔር ጋር የተባበረ መጻተኛ፦ ‘እግዚአብሔር ከሕዝቡ ለይቶ ይለየኛል’ አይበል።” — ኢሳይያስ 56፥3',
    },
  },
  about: {
    en: {
      tag: 'Our Heritage',
      heading: 'About Us & History',
      body1:
        'Bihere Tsige Mekane Selam Kidist Dengel Mariam Church stands as a beacon of Ethiopian Orthodox Tewahedo faith. Established over five decades ago, our parish has been a spiritual home for thousands of faithful believers.',
      body2:
        'The name "Bihere Tsige" (Land of Grace) reflects our mission to be a place where God\'s grace flows abundantly. Our church preserves the ancient traditions of the Ethiopian Orthodox Tewahedo Church while nurturing the spiritual growth of our community.',
      learnMore: 'Learn More',
      galleryTitle: 'Parish Life Gallery',
    },
    am: {
      tag: 'ታሪካችን',
      heading: 'ስለ እኛ እና ታሪካችን',
      body1:
        'ብሔረ ጽጌ መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት ምሰሶ ሆና ትቆማለች። ከሃምሳ ዓመት በፊት የተቋቋመ ደብራችን ለሺዎች ምዕመናን መንፈሳዊ ቤት ሆኖ አገልግሏል።',
      body2:
        '"ብሔረ ጽጌ" (የጸጋ ምድር) የሚለው ስም የእግዚአብሔር ጸጋ በብዛት የሚፈስበት ስፍራ ለመሆን ያለንን ተልዕኮ ያንጸባርቃል። ቤተ ክርስቲያናችን የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ጥንታዊ ወጎችን እየጠበቀ ማኅበረሰባችንን መንፈሳዊ እድገት ያሳድጋል።',
      learnMore: 'ተጨማሪ ይወቁ',
      galleryTitle: 'የደብራችን ሕይወት ምስሎች',
    },
    gallery: [
      {
        src: '/assets/about-1.jpg.png',
        en: 'Our faithful parish community gathering in prayer and celebration.',
        am: 'ምዕመናን በጸሎት እና በዓላት ላይ በአንድነት ሲሳተፉ።',
      },
      {
        src: '/assets/about-2.jpg.png',
        en: 'Inside the sanctuary, reflecting ancient Orthodox iconography.',
        am: 'በቅድስት ሥላሴ ሥዕላት ያጌጠው የቤተ መቅደሱ ውስጣዊ እይታ።',
      },
      {
        src: '/assets/about-3.jpg.png',
        en: 'Celebrating traditional Ethiopian Orthodox liturgical ceremonies.',
        am: 'ጥንታዊ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ሥርዓተ አምልኮ።',
      },
      {
        src: '/assets/about-4.jpg.png',
        en: 'Parish members and children participating in spiritual services.',
        am: 'የደብሩ ምዕመናንና ሕፃናት በሰንበት መርሃ ግብር ሲሳተፉ።',
      },
    ],
  },
  services: {
    en: {
      title: 'OUR SERVICES',
      worship: { title: 'WORSHIP', description: 'Experience the joy of worship and connect with God.' },
      teaching: { title: 'TEACHING', description: 'Growing in faith through the Word of God.' },
      serving: { title: 'SERVING', description: 'Serving our community with love and compassion.' },
      fellowship: { title: 'FELLOWSHIP', description: 'Building relationships and growing together.' },
    },
    am: {
      title: 'አገልግሎቶቻችን',
      worship: { title: 'አምልኮ', description: 'የአምልኮን ደስታ ይለማመዱ እና ከእግዚአብሔር ጋር ይገናኙ።' },
      teaching: { title: 'ትምህርት', description: 'በእግዚአብሔር ቃል በኩል በእምነት ማደግ።' },
      serving: { title: 'ማኅበረሰብ አገልግሎት', description: 'ማኅበረሰባችንን በፍቅር እና በራኅራኄ ማገልገል።' },
      fellowship: { title: 'ኅብረት', description: 'ግንኙነቶችን መገንባት እና አብሮ ማደግ።' },
    },
  },
  churchSchool: {
    en: {
      sectionTag: 'Serve at Your Parish',
      sectionTitle: 'Church Education',
      abnet: {
        title: 'Traditional Church School',
        subtitle: 'Abnet School',
        intro: 'Preserving our sacred traditions by providing comprehensive religious education for all ages.',
        join: 'Join Now',
      },
      sundaySchool: {
        title: 'Sunday School',
        subtitle: 'Youth & Family',
        intro:
          'Nurturing the next generation through biblical studies, cultural values, and spiritual fellowship tailored for children, youth, and families.',
        join: 'Join Now',
      },
      abnetLevels: {
        nibab: { title: 'Nibab (Reading)', desc: "Learning Ge'ez alphabet and basic prayers." },
        kidase: { title: 'Kidase (Liturgy)', desc: 'Studying liturgical rites and sacred meanings.' },
        zema: { title: 'Zema (Hymns)', desc: 'Learning ancient church hymns and sacred melodies.' },
        kine: { title: 'Kine (Poetry)', desc: 'Advanced study of religious poetry and spiritual expression.' },
      },
      sundaySchoolLevels: {
        bible: { title: 'Bible Study', desc: 'Systematic study of scriptures and teachings.' },
        hymns: { title: 'Spiritual Hymns', desc: 'Learning traditional spiritual songs and chants.' },
        liturgical: { title: 'Liturgical Education', desc: 'Understanding church sacraments, rituals, and prayers.' },
        ethics: { title: 'Christian Life & Ethics', desc: 'Practical guidance on Christian values, family, and community service.' },
      },
    },
    am: {
      sectionTag: 'በደብርዎ ያገልግሉ',
      sectionTitle: 'ባህላዊ የቤተ ክርስቲያን ትምህርት ቤት',
      abnet: {
        title: 'የአቢነት ትምህርት',
        subtitle: 'ባህላዊ ትምህርት ቤት',
        intro: 'ለሁሉም ዕድሜ አጠቃላይ ሃይማኖታዊ ትምህርትን በማቅረብ ቅዱስ ወጎቻችንን እንጠብቃለን።',
        join: 'ይቀላቀሉ',
      },
      sundaySchool: {
        title: 'የሰንበት ትምህርት ቤት',
        subtitle: 'ወጣቶች እና ቤተሰብ',
        intro: 'ለልጆች፣ ወጣቶች እና ቤተሰቦች የተዘጋጀ የመጽሐፍ ቅዱስ ጥናት፣ ባህላዊ እሴቶች እና መንፈሳዊ ኅብረት።',
        join: 'ይቀላቀሉ',
      },
      abnetLevels: {
        nibab: { title: 'ንባብ', desc: 'የግእዝ ፊደል ማንበብ እና መሰረታዊ ጸሎቶችን መማር።' },
        kidase: { title: 'ቅዳሴ', desc: 'የቅዳሴ ሥርዓት እና ቅዱስ ትርጉሞቹን ማጥናት።' },
        zema: { title: 'ዜማ', desc: 'የቤተ ክርስቲያንን ጥንታዊ መዝሙሮች እና ቅዱስ ዜማዎችን መማር።' },
        kine: { title: 'ቅኔ', desc: 'የሃይማኖታዊ ግጥሞች እና የመንፈሳዊ ገለጻ የላቀ ጥናት።' },
      },
      sundaySchoolLevels: {
        bible: { title: 'መጽሐፍ ቅዱስ ጥናት', desc: 'የመጽሐፍ ቅዱስ ቃላትንና አስተምህሮዎችን በጥልቀት ማጥናት።' },
        hymns: { title: 'የመዝሙር ትምህርት', desc: 'የበዓላት እና የክብረ በዓላት መዝሙራትን መማር።' },
        liturgical: { title: 'የሥርዓተ አምልኮ ትምህርት', desc: 'የቤተ ክርስቲያንን ሥርዓትና የጸሎት መርሃ ግብር ማጥናት።' },
        ethics: { title: 'ክርስቲያናዊ ሥነ-ምግባር', desc: 'በክርስቲያናዊ ሥነ-ምግባርና ፍቅር ማኅበረሰቡን ማገልገል።' },
      },
    },
  },
  news: {
    en: {
      sectionTag: 'Message & Blessings',
      sectionTitle: 'From Our Father',
      fatherTitle: 'Melake Genet Memhir Habtewold Tegegn',
      fatherRole: 'Head Priest',
      fatherMessage:
        '"May the grace of the Holy Trinity — Father, Son, and Holy Spirit — be upon all of you. Our church continues to grow in faith and love, serving as a beacon of hope for our community. Let us walk together in the light of our Lord."',
      newsTitle: 'Articles',
      news: [
        {
          id: 'news-1',
          date: 'May 2026',
          title: 'Community Outreach Program',
          excerpt:
            'Our parish launches a new community outreach program to support families in need through food donations and spiritual guidance.',
        },
        {
          id: 'news-2',
          date: 'April 2026',
          title: 'Youth Fellowship Revival',
          excerpt:
            'A new youth fellowship program has been established, bringing young members together for Bible study, cultural activities, and spiritual growth.',
        },
        {
          id: 'news-3',
          date: 'March 2026',
          title: 'Church Renovation Complete',
          excerpt:
            'The renovation of our prayer hall has been completed, featuring traditional Ethiopian Orthodox iconography and improved seating for our growing congregation.',
        },
      ],
    },
    am: {
      sectionTag: 'መልእክት እና ቡራኬ',
      sectionTitle: 'ከአባታችን',
      fatherTitle: 'መልዓከ ገነት መምህር ሃብተወልድ ተገኝ',
      fatherRole: 'ዋና ካህን',
      fatherMessage:
        '"የቅድስት ሥላሴ — አብ፣ ወልድ እና መንፈስ ቅዱስ — ጸጋ በሁላችሁ ላይ ይሁን። ቤተ ክርስቲያናችን በእምነት እና በፍቅር ማደጉን ቀጥሏል፣ ለማኅበረሰባችን የተስፋ ምሰሶ ሆኖ በማገልገል። በጌታችን ብርሃን አብረን እንጓዝ።"',
      newsTitle: 'ከሊቃውንት መጣጥፍ',
      news: [
        {
          id: 'news-1',
          date: 'ግንቦት 2018',
          title: 'የማኅበረሰብ ተደራሽነት ፕሮግራም',
          excerpt: 'ደብራችን ችግረኞችን ለመርዳት የምግብ ልገሳ እና መንፈሳዊ ምክር አገልግሎት አዲስ ፕሮግራም ጀምሯል።',
        },
        {
          id: 'news-2',
          date: 'ሚያዝያ 2018',
          title: 'የወጣቶች ኅብረት ታድሷል',
          excerpt:
            'አዲስ የወጣቶች ኅብረት ፕሮግራም ተቋቁሞ ወጣቶችን ለመጽሐፍ ቅዱስ ጥናት፣ ባህላዊ ተግባራት እና መንፈሳዊ ዕድገት ያሰባስባል።',
        },
        {
          id: 'news-3',
          date: 'መጋቢት 2018',
          title: 'የቤተ ክርስቲያን ዕድሳት ተጠናቀቀ',
          excerpt: 'የጸሎት አዳራሻችን ዕድሳት ተጠናቅቋል፣ ባህላዊ የኢትዮጵያ ኦርቶዶክስ ሥዕላትና ለዕድገታችን የተሻለ መቀመጫ ይዟል።',
        },
      ],
    },
  },
  events: {
    en: {
      sectionTag: 'Parish Events',
      sectionTitle: 'Annual Parish Celebrations',
      intro: 'We celebrate the sacred feast days of our Lady Saint Virgin Mary throughout the year.',
      learnMore: 'Learn More',
      mainFeastBadge: 'Main Feast',
      events: [
        {
          id: 'event-1',
          title: 'ኅዳር ጽጌ (Hidar Tsige)',
          date: 'November 30 (ኅዳር 21)',
          description:
            'The main annual parish feast celebrating Our Lady Mary, Land of Grace (Bihere Tsige). Includes liturgical services, spiritual poetry (Qene), and a colorful procession.',
          isMain: true,
        },
        {
          id: 'event-2',
          title: 'ግንቦት ልደታ (Ginbot Lidet)',
          date: 'May 9 (ግንቦት 1)',
          description:
            'Celebrating the birth of the Blessed Virgin Mary, Mother of God. A day filled with special divine liturgy and spiritual fellowship.',
          isMain: false,
        },
        {
          id: 'event-3',
          title: 'ነሐሴ ማርያም (Nehase Mariam)',
          date: 'August 22 (ነሐሴ 16)',
          description:
            'Dormition and Assumption of the Blessed Virgin Mary. Marks the culmination of the 16-day Filseta Fasting with sacred liturgy.',
          isMain: false,
        },
      ],
    },
    am: {
      sectionTag: 'የደብር በዓላት',
      sectionTitle: 'ዓመታዊ የደብር በዓላት',
      intro: 'በዓመቱ ውስጥ የእመቤታችን ቅድስት ድንግል ማርያም ቅዱስ በዓላትን በደመቀ ሁኔታ እናከብራለን።',
      learnMore: 'ተጨማሪ ይወቁ',
      mainFeastBadge: 'ዋና በዓል',
      events: [
        {
          id: 'event-1',
          title: 'ኅዳር ጽጌ',
          date: 'ኅዳር 21 (November 30)',
          description:
            'የደብራችን ዋና ዓመታዊ በዓል። እመቤታችን ቅድስት ድንግል ማርያምን በብሔረ ጽጌ ስም የምናስብበት፣ በዝማሬ፣ በቅኔ እና በታላቅ መንፈሳዊ ሥነ-ሥርዓት የሚከበር ታላቅ በዓል።',
          isMain: true,
        },
        {
          id: 'event-2',
          title: 'ግንቦት ልደታ',
          date: 'ግንቦት 1 (May 9)',
          description: 'የእመቤታችን የቅድስት ድንግል ማርያም ልደት በታላቅ መንፈሳዊ ጉባኤ እና በቅዳሴ ጸሎት የሚከበርበት የተቀደሰ ዕለት።',
          isMain: false,
        },
        {
          id: 'event-3',
          title: 'ነሐሴ ማርያም',
          date: 'ነሐሴ 16 (August 22)',
          description: 'የእመቤታችን የቅድስት ድንግል ማርያም ትንሣኤና ዕርገት (ፍልሰታ በዓል ፍጻሜ) በጸሎትና በቅዱስ ቍርባን የምናከብርበት ዕለት።',
          isMain: false,
        },
      ],
    },
  },
  donate: {
    en: {
      sectionTag: 'Generosity & Support',
      sectionTitle: 'Support Our Ministry',
      intro:
        'Your generous donations support our parish, traditional school, Sunday school, and local community outreach programs. Every contribution helps preserve our sacred heritage.',
      copiedText: 'Copied!',
      zelleNote: 'Note: Please write your name and purpose of donation in the Zelle memo.',
      methods: [
        {
          id: 'cbe',
          bankName: 'Commercial Bank of Ethiopia (CBE)',
          accountName: 'Bihere Tsige Kidist Dengel Mariam Church',
          accountNumber: '1000123456789',
          type: 'Bank Transfer',
          icon: '🏦',
        },
        {
          id: 'abyssinia',
          bankName: 'Bank of Abyssinia',
          accountName: 'Bihere Tsige Kidist Dengel Mariam Church',
          accountNumber: '987654321',
          type: 'Bank Transfer',
          icon: '🏦',
        },
        {
          id: 'zelle',
          bankName: 'Zelle (US / International)',
          accountName: 'Bihere Tsige Church',
          accountNumber: 'donate@beheretsige.org',
          type: 'Mobile/Zelle Transfer',
          icon: '📱',
        },
      ],
    },
    am: {
      sectionTag: 'ልገሳ እና ድጋፍ',
      sectionTitle: 'አገልግሎታችንን ይደግፉ',
      intro:
        'የእርስዎ ልግስና የደብራችንን አገልግሎት፣ የአቢነትና ሰንበት ትምህርት ቤቶችን፣ እንዲሁም የማኅበረሰብ ተደራሽነት ሥራዎችን ለመደገፍ ይውላል። እያንዳንዱ ድጋፍ የተቀደሰውን ሃይማኖታዊ ቅርሳችንን ለመጠበቅ ይረዳል።',
      copiedText: 'ተገልብጧል!',
      zelleNote: 'ማሳሰቢያ፡ እባክዎን በZelle ሜሞ ላይ ስምዎን እና የልገሳውን ዓላማ ይጥቀሱ።',
      methods: [
        {
          id: 'cbe',
          bankName: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
          accountName: 'ብሔረ ጽጌ ቅድስት ድንግል ማርያም ቤተክርስቲያን',
          accountNumber: '1000123456789',
          type: 'የባንክ ሒሳብ ማስተላለፊያ',
          icon: '🏦',
        },
        {
          id: 'abyssinia',
          bankName: 'አቢሲኒያ ባንክ',
          accountName: 'ብሔረ ጽጌ ቅድስት ድንግል ማርያም ቤተክርስቲያን',
          accountNumber: '987654321',
          type: 'የባንክ ሒሳብ ማስተላለፊያ',
          icon: '🏦',
        },
        {
          id: 'zelle',
          bankName: 'Zelle (ለአሜሪካ/ዓለም አቀፍ)',
          accountName: 'Bihere Tsige Church',
          accountNumber: 'donate@beheretsige.org',
          type: 'በሞባይል/Zelle መላኪያ',
          icon: '📱',
        },
      ],
    },
  },
  media: {
    en: {
      sectionTag: 'Watch & Listen',
      sectionTitle: 'Media & Sermons',
      intro: 'Watch divine liturgies, sermons, and spiritual programs from our parish, and follow us for the latest uploads.',
      viewAll: 'Visit our YouTube Channel',
    },
    am: {
      sectionTag: 'ይመልከቱ እና ያዳምጡ',
      sectionTitle: 'ሚዲያ እና ስብከት',
      intro: 'የቅዳሴ ሥርዓት፣ ስብከቶች እና መንፈሳዊ ፕሮግራሞችን ከደብራችን ይመልከቱ፣ አዳዲስ ይዘቶችን ለማግኘት ይከተሉን።',
      viewAll: 'የዩቱብ ቻናላችንን ይጎብኙ',
    },
    channelUrl: 'https://youtube.com/@BehereTsigeMekaneSelamStMary',
    items: [
      {
        id: 'media-1',
        thumb: '/assets/about-1.jpg.png',
        href: 'https://youtube.com/@BehereTsigeMekaneSelamStMary',
        en: { type: 'Video', title: 'Sunday Divine Liturgy (Kidase)' },
        am: { type: 'ቪዲዮ', title: 'የእሑድ ቅዳሴ' },
      },
      {
        id: 'media-2',
        thumb: '/assets/about-3.jpg.png',
        href: 'https://youtube.com/@BehereTsigeMekaneSelamStMary',
        en: { type: 'Video', title: 'Feast of Hidar Tsige Celebration' },
        am: { type: 'ቪዲዮ', title: 'የኅዳር ጽጌ በዓል አከባበር' },
      },
      {
        id: 'media-3',
        thumb: '/assets/about-4.jpg.png',
        href: 'https://youtube.com/@BehereTsigeMekaneSelamStMary',
        en: { type: 'Video', title: 'Spiritual Teaching & Sermon' },
        am: { type: 'ቪዲዮ', title: 'መንፈሳዊ ትምህርትና ስብከት' },
      },
    ],
  },
  contact: {
    en: {
      sectionTag: 'Get In Touch',
      sectionTitle: 'Contact Us',
      intro: 'We would love to hear from you. Reach out with questions, prayer requests, or to learn more about our parish.',
      infoHeading: 'Reach Us',
      addressLabel: 'Address',
      address: 'Bihere Tsige Road, Gullele, Addis Ababa, Ethiopia',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      hoursLabel: 'Office Hours',
      hours: 'Monday – Saturday: 8:00 AM – 5:00 PM',
      formHeading: 'Send Us a Message',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      emailFieldLabel: 'Email Address',
      emailPlaceholder: 'you@example.com',
      messageLabel: 'Your Message',
      messagePlaceholder: 'How can we help you?',
      sendLabel: 'Send Message',
    },
    am: {
      sectionTag: 'ያግኙን',
      sectionTitle: 'ያግኙን',
      intro: 'ከእርስዎ መስማት እንወዳለን። ማንኛውም ጥያቄ፣ የጸሎት ጥያቄ ካለዎት ወይም ስለ ደብራችን የበለጠ ለማወቅ ያግኙን።',
      infoHeading: 'ያግኙን',
      addressLabel: 'አድራሻ',
      address: 'የብሔረ ጽጌ መንገድ፣ ጉለሌ፣ አዲስ አበባ፣ ኢትዮጵያ',
      phoneLabel: 'ስልክ',
      emailLabel: 'ኢሜይል',
      hoursLabel: 'የቢሮ ሰዓታት',
      hours: 'ከሰኞ – ቅዳሜ፡ ከጠዋቱ 2:00 – ከቀኑ 11:00',
      formHeading: 'መልእክት ይላኩልን',
      nameLabel: 'ሙሉ ስም',
      namePlaceholder: 'ስምዎ',
      emailFieldLabel: 'ኢሜይል አድራሻ',
      emailPlaceholder: 'you@example.com',
      messageLabel: 'መልእክትዎ',
      messagePlaceholder: 'እንዴት ልንረዳዎት እንችላለን?',
      sendLabel: 'መልእክት ላክ',
    },
    phone: '+251 11 320 1234',
    email: 'info@beheretsigestmary.org',
    mapQuery: 'Gullele, Addis Ababa, Ethiopia',
  },
  footer: {
    en: {
      description:
        'Preserving the ancient traditions of the Ethiopian Orthodox Tewahedo Church while nurturing the spiritual growth of our community and providing a beacon of hope and grace.',
      colServices: 'Service Hours',
      colContact: 'Contact Us',
      colLinks: 'Quick Links',
      sundayKidase: 'Sunday Divine Liturgy (Kidase) - 5:00 AM',
      saturdayKidase: 'Saturday Kidase - 6:00 AM',
      weekdayKidase: 'Weekday Liturgy - 6:00 AM',
      address: 'Bihere Tsige Road, Gullele, Addis Ababa, Ethiopia',
      phone: 'Phone: +251 11 320 1234',
      email: 'Email: info@beheretsigestmary.org',
      copyright: '© 2026 Bihere Tsige Mekane Selam Kidist Dengel Mariam Church. All rights reserved.',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'About Us', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Events', href: '#events' },
        { label: 'Media', href: '#media' },
        { label: 'Articles', href: '#articles' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'Donate', href: '#donate' },
      ],
    },
    am: {
      description:
        'የማኅበረሰባችንን መንፈሳዊ እድገት እያሳደገ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን ጥንታዊ እምነት፣ ሥርዓትና ታሪክ ይጠብቃል።',
      colServices: 'የአምልኮ ሰዓታት',
      colContact: 'ያግኙን',
      colLinks: 'ፈጣን አገናኞች',
      sundayKidase: 'የእሑድ ቅዳሴ - ከጧቱ 11:00 ሰዓት ጀምሮ',
      saturdayKidase: 'የቅዳሜ ቅዳሴ - ከጧቱ 12:00 ሰዓት ጀምሮ',
      weekdayKidase: 'የዕለታት ቅዳሴ - ከጧቱ 12:00 ሰዓት ጀምሮ',
      address: 'የብሔረ ጽጌ መንገድ፣ ጉለሌ፣ አዲስ አበባ፣ ኢትዮጵያ',
      phone: 'ስልክ፡ +251 11 320 1234',
      email: 'ኢሜይል፡ info@beheretsigestmary.org',
      copyright: '© 2026 ብሔረ ጽጌ መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን። መብቱ በሕግ የተጠበቀ ነው።',
      links: [
        { label: 'ዋና ገጽ', href: '#home' },
        { label: 'ስለ ብሔረ ጽጌ ማርያም', href: '#about' },
        { label: 'አገልግሎት', href: '#services' },
        { label: 'ቀጣይ ዝግጅቶች', href: '#events' },
        { label: 'ሚዲያ', href: '#media' },
        { label: 'ከሊቃውንት መጣጥፍ', href: '#articles' },
        { label: 'ያግኙን', href: '#contact' },
        { label: 'ይለግሱ', href: '#donate' },
      ],
    },
  },
  socials: [
    { id: 'social-youtube', label: 'YouTube', href: 'https://youtube.com/@BehereTsigeMekaneSelamStMary' },
    { id: 'social-facebook', label: 'Facebook', href: 'https://facebook.com/BehereTsigeMekaneSelamStMary' },
    { id: 'social-telegram', label: 'Telegram', href: 'https://t.me/BehereTsigeMekaneSelam' },
    { id: 'social-instagram', label: 'Instagram', href: 'https://instagram.com/behere.tsige.st.mary' },
    { id: 'social-tiktok', label: 'TikTok', href: 'https://tiktok.com/@beheretsige.st.mary' },
    { id: 'social-linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/beheretsige-st-mary' },
  ],
};

export default defaultContent;
