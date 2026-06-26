import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';
import PageHero from './PageHero';

export default function Donate({ lang }) {
  const { content } = useContent();
  const c = content.donate[lang] || content.donate.en;
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const isAm = lang === 'am';
  const heroTitle = isAm ? 'ቤተክርስቲያናችንን ይደግፉ' : 'Support Our Sanctuary';
  const heroSubtitle = isAm ? 'በአይነት፣ በገንዘብ እና በሃሳብ የድርሻዎን በመወጣት የበረከቱ ተካፋይ ይሁኑ' : 'Join hands with us to build, sustain, and grow our spiritual sanctuary.';

  return (
    <div className="donate-container-wrapper">
      <PageHero title={heroTitle} subtitle={heroSubtitle} />
      
      <section id="donate" className="donate-section" style={{ paddingTop: '4rem' }}>


      {/* Donation Methods Grid */}
      <div className="donate-grid" id="donate-grid">
        {c.methods.map((method, index) => (
          <Reveal key={method.id} className="donate-card" id={`donate-card-${method.id}`} delay={index * 120}>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="copy-icon" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{c.copiedText}</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon" aria-hidden="true">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{lang === 'am' ? 'ሒሳብ ቍጥር ገልብጥ' : 'Copy Account Info'}</span>
                </>
              )}
            </button>
          </Reveal>
        ))}
      </div>
    </section>
    </div>
  );
}
