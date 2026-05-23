import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';

const CONTENT = {
  en: {
    sectionTag: 'Generosity & Support',
    sectionTitle: 'Support Our Ministry',
    intro: 'Your generous donations support our parish, traditional school, Sunday school, and local community outreach programs. Every contribution helps preserve our sacred heritage.',
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
    intro: 'የእርስዎ ልግስና የደብራችንን አገልግሎት፣ የአቢነትና ሰንበት ትምህርት ቤቶችን፣ እንዲሁም የማኅበረሰብ ተደራሽነት ሥራዎችን ለመደገፍ ይውላል። እያንዳንዱ ድጋፍ የተቀደሰውን ሃይማኖታዊ ቅርሳችንን ለመጠበቅ ይረዳል።',
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
};

export default function Donate({ lang }) {
  const c = CONTENT[lang] || CONTENT.en;
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section id="donate" className="donate-section">
      {/* Section header */}
      <div className="donate-header">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{c.sectionTag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="donate-section-title" id="donate-section-title">{c.sectionTitle}</h2>
        <p className="donate-intro">{c.intro}</p>
      </div>

      {/* Donation Methods Grid */}
      <div className="donate-grid" id="donate-grid">
        {c.methods.map((method) => (
          <div key={method.id} className="donate-card" id={`donate-card-${method.id}`}>
            <div className="donate-card-top">
              <span className="donate-card-icon">{method.icon}</span>
              <span className="donate-card-type">{method.type}</span>
            </div>
            
            <h3 className="donate-bank-name">{method.bankName}</h3>
            
            <div className="donate-details">
              <div className="donate-detail-row">
                <span className="donate-label">{lang === 'am' ? 'የሒሳብ ስም፡' : 'Account Name:'}</span>
                <span className="donate-value">{method.accountName}</span>
              </div>
              
              <div className="donate-detail-row donate-account-row">
                <span className="donate-label">{method.id === 'zelle' ? (lang === 'am' ? 'ኢሜይል፡' : 'Email:') : (lang === 'am' ? 'የሒሳብ ቍጥር፡' : 'Account Number:')}</span>
                <span className="donate-value account-num">{method.accountNumber}</span>
              </div>
            </div>

            {method.id === 'zelle' && (
              <p className="donate-zelle-note">{c.zelleNote}</p>
            )}

            <button
              onClick={() => handleCopy(method.accountNumber, method.id)}
              className={`btn-copy-account ${copiedId === method.id ? 'copied' : ''}`}
            >
              {copiedId === method.id ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="copy-icon">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{c.copiedText}</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{lang === 'am' ? 'ሒሳብ ቍጥር ገልብጥ' : 'Copy Account Info'}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
