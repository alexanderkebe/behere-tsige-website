'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ArticleCard from '@/components/articles/ArticleCard';
import '@/styles/articles.css';

const T = {
  en: { tag: 'Articles', title: 'From the Parish', intro: 'Reflections, teachings, and news from our community.', more: 'Read more articles', less: 'Show less', empty: 'Articles will appear here soon.', search: 'Search articles…' },
  am: { tag: 'ጽሑፎች', title: 'ከደብሩ', intro: 'ከማኅበረሰባችን ነጸብራቆች፣ ትምህርቶች እና ዜናዎች።', more: 'ተጨማሪ ጽሑፎች', less: 'ይዝጉ', empty: 'ጽሑፎች በቅርቡ ይታያሉ።', search: 'ጽሑፎችን ይፈልጉ…' },
};

const INITIAL = 7;

export default function ArticlesView({ articles = [] }) {
  const { lang } = useLanguage();
  const t = T[lang] || T.en;
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = !q
    ? articles
    : articles.filter((a) =>
        [a.title_en, a.title_am, a.excerpt_en, a.excerpt_am, ...(a.tags || [])]
          .filter(Boolean)
          .some((s) => s.toLowerCase().includes(q))
      );

  const visible = showAll || q ? filtered : filtered.slice(0, INITIAL);

  return (
    <main className="site-page articles-page">
      <section className="articles-section">
        <header className="articles-head">
          <span className="articles-tag">{t.tag}</span>
          <h1 className="articles-title">{t.title}</h1>
          <p className="articles-intro">{t.intro}</p>
          <input
            className="articles-search"
            placeholder={t.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </header>

        {filtered.length === 0 ? (
          <p className="articles-empty">{t.empty}</p>
        ) : (
          <div className="articles-grid">
            {visible.map((a) => <ArticleCard key={a.id} article={a} lang={lang} />)}
          </div>
        )}

        {!q && filtered.length > INITIAL && (
          <div className="articles-more">
            <button className="btn-articles-more" onClick={() => setShowAll((s) => !s)}>
              {showAll ? t.less : t.more}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
