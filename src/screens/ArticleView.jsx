'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Eye, Share2, Link2, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Comments from '@/components/articles/Comments';
import { FacebookIcon, TelegramIcon, WhatsAppIcon } from '@/components/Icons';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/dates';
import { useArticleLike } from '@/hooks/useArticleLike';
import '@/styles/articles.css';
import '@/styles/article-comments.css';

/** Compact icon-only share row: native share, Telegram, WhatsApp, Facebook, copy. */
function ShareBar({ title, lang }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const enc = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const shareLabel = lang === 'am' ? 'ያጋሩ' : 'Share';

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
    <div className="article-share" role="group" aria-label={shareLabel}>
      <span className="article-share-label">{shareLabel}</span>
      <button type="button" className="share-icon-btn" onClick={nativeShare} aria-label={shareLabel} title={shareLabel}>
        <Share2 size={17} strokeWidth={1.8} />
      </button>
      <a
        className="share-icon-btn share-telegram"
        href={`https://t.me/share/url?url=${enc}&text=${encTitle}`}
        target="_blank" rel="noopener noreferrer" aria-label="Telegram" title="Telegram"
      >
        <TelegramIcon style={{ width: 17, height: 17 }} />
      </a>
      <a
        className="share-icon-btn share-whatsapp"
        href={`https://wa.me/?text=${encTitle}%20${enc}`}
        target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"
      >
        <WhatsAppIcon style={{ width: 17, height: 17 }} />
      </a>
      <a
        className="share-icon-btn share-facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`}
        target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"
      >
        <FacebookIcon style={{ width: 17, height: 17 }} />
      </a>
      <button
        type="button"
        className={`share-icon-btn ${copied ? 'share-copied' : ''}`}
        onClick={copy}
        aria-label={lang === 'am' ? 'ሊንክ ይቅዱ' : 'Copy link'}
        title={copied ? (lang === 'am' ? 'ተቀድቷል!' : 'Copied!') : (lang === 'am' ? 'ሊንክ ይቅዱ' : 'Copy link')}
      >
        {copied ? <Check size={17} strokeWidth={2.2} /> : <Link2 size={17} strokeWidth={1.8} />}
      </button>
    </div>
  );
}

export default function ArticleView({ article }) {
  const { lang } = useLanguage();
  const isAm = lang === 'am';
  const supabase = useMemo(() => createClient(), []);
  const { likes, liked, toggle } = useArticleLike(article.id, article.likes_count || 0);
  const [views, setViews] = useState(article.views_count || 0);

  // Count this read once per browser session (survives strict-mode remounts).
  useEffect(() => {
    if (!article?.id) return;
    const key = `viewed_${article.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      /* storage unavailable — still record the view */
    }
    supabase
      .rpc('record_article_view', { target_article_id: article.id })
      .then(({ data, error }) => {
        if (!error && typeof data === 'number') setViews(data);
      });
  }, [article?.id, supabase]);

  const title = isAm ? article.title_am || article.title_en : article.title_en;
  const body = isAm ? article.body_am || article.body_en : article.body_en;
  const date = formatDate(article.published_at, lang);
  const paragraphs = (body || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const wordCount = (body || '').split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));
  const readTime = isAm ? `${readMinutes} ደቂቃ ንባብ` : `${readMinutes} min read`;

  return (
    <main className="site-page article-detail">
      <article className="article-detail-inner">
        <Link href="/articles" className="article-back">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          {isAm ? 'ወደ ጽሑፎች' : 'Back to articles'}
        </Link>

        {article.tags?.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tg) => <span key={tg} className="article-tag">{tg}</span>)}
          </div>
        )}

        <h1 className="article-detail-title">{title}</h1>

        <div className="article-detail-meta">
          <div className="article-detail-author">
            {article.author?.photo_url ? (
              <img src={article.author.photo_url} alt="" className="article-author-photo article-author-photo-lg" />
            ) : (
              <span className="article-author-initial article-author-initial-lg" aria-hidden="true">
                {(article.author?.name || '·').charAt(0)}
              </span>
            )}
            <div className="article-detail-author-text">
              <span className="article-author-name">{article.author?.name}</span>
              {date && <span className="article-date">{date}</span>}
            </div>
          </div>
          <div className="article-detail-meta-right">
            <span className="stat" title={isAm ? 'እይታዎች' : 'Views'}>
              <Eye size={16} strokeWidth={1.8} aria-hidden="true" /> {views}
            </span>
            <span className="article-read-time">{readTime}</span>
          </div>
        </div>

        {article.cover_url && <img src={article.cover_url} alt="" className="article-detail-cover" />}

        <div className="article-detail-body">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="article-detail-actions">
          <div className="article-detail-actions-left">
            <button
              type="button"
              onClick={toggle}
              className={`btn-like ${liked ? 'liked' : ''}`}
              aria-pressed={liked}
            >
              <Heart size={17} strokeWidth={1.8} aria-hidden="true" />
              <span>{likes}</span>
              <span className="btn-like-label">{isAm ? 'ወደድኩት' : 'Like'}</span>
            </button>
            <span className="stat" title={isAm ? 'አስተያየቶች' : 'Comments'}>
              <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" /> {article.comments_count || 0}
            </span>
          </div>
          <ShareBar title={title} lang={lang} />
        </div>

        <Comments articleId={article.id} lang={lang} />
      </article>
    </main>
  );
}
