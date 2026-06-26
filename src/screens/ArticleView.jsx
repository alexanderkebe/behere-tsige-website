'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import '@/styles/articles.css';

export default function ArticleView({ article }) {
  const { lang } = useLanguage();
  const title = lang === 'am' ? article.title_am || article.title_en : article.title_en;
  const body = lang === 'am' ? article.body_am || article.body_en : article.body_en;
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';
  const paragraphs = (body || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <main className="site-page article-detail">
      <article className="article-detail-inner">
        <Link href="/articles" className="article-back">← {lang === 'am' ? 'ወደ ጽሑፎች' : 'Back to articles'}</Link>

        {article.tags?.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tg) => <span key={tg} className="article-tag">#{tg}</span>)}
          </div>
        )}

        <h1 className="article-detail-title">{title}</h1>

        <div className="article-detail-meta">
          {article.author?.photo_url && (
            <img src={article.author.photo_url} alt="" className="article-author-photo" />
          )}
          <span className="article-author-name">{article.author?.name}</span>
          {date && <span className="article-date">· {date}</span>}
        </div>

        {article.cover_url && <img src={article.cover_url} alt="" className="article-detail-cover" />}

        <div className="article-detail-body">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </article>
    </main>
  );
}
