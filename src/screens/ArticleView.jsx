'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Comments from '@/components/articles/Comments';
import '@/styles/articles.css';
import '@/styles/article-comments.css';

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

function ShareBar({ title, lang }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const enc = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const t = {
    share: lang === 'am' ? 'ያጋሩ' : 'Share',
    copy: lang === 'am' ? 'ሊንክ ይቅዱ' : 'Copy Link',
    copied: lang === 'am' ? 'ተቀድቷል!' : 'Copied!',
  };

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const nativeShare = () => {
    if (navigator.share) navigator.share({ title, url }).catch(() => {});
    else copy();
  };

  return (
    <div className="article-share">
      <span className="article-share-label">{t.share}</span>
      <button className="btn-share" onClick={nativeShare}><ShareIcon /> {t.share}</button>
      <a className="btn-share" href={`https://t.me/share/url?url=${enc}&text=${encTitle}`} target="_blank" rel="noopener noreferrer">Telegram</a>
      <a className="btn-share" href={`https://wa.me/?text=${encTitle}%20${enc}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <a className="btn-share" href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer">Facebook</a>
      <button className="btn-share" onClick={copy}><LinkIcon /> {copied ? t.copied : t.copy}</button>
    </div>
  );
}

export default function ArticleView({ article }) {
  const { lang } = useLanguage();
  const [likes, setLikes] = useState(article.likes_count || 0);
  const [liked, setLiked] = useState(false);
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

        <div className="article-detail-actions">
          <button onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }} className={`btn-like ${liked ? 'liked' : ''}`}>
            {liked ? '❤️' : '🤍'} {likes} {lang === 'am' ? 'ወደድኩት' : 'Like'}
          </button>
          <div className="article-detail-stats">
            <span className="stat">💬 {article.comments_count || 0}</span>
            <span className="stat">👁️ {article.views_count || 0}</span>
          </div>
        </div>

        <ShareBar title={title} lang={lang} />

        <Comments articleId={article.id} lang={lang} />
      </article>
    </main>
  );
}
