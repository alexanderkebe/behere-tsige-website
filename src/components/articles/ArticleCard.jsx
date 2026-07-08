'use client';

import Link from 'next/link';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { DiamondOrnament } from '@/components/Icons';
import { formatDate } from '@/lib/dates';
import { useArticleLike } from '@/hooks/useArticleLike';

export default function ArticleCard({ article, lang }) {
  const title = lang === 'am' ? article.title_am || article.title_en : article.title_en;
  const excerpt = lang === 'am' ? article.excerpt_am || article.excerpt_en : article.excerpt_en;
  const authorName = lang === 'am' ? article.author?.name_am || article.author?.name : article.author?.name;
  const date = formatDate(article.published_at, lang, { year: 'numeric', month: 'short', day: 'numeric' });
  const { likes, liked, toggle } = useArticleLike(article.id, article.likes_count || 0);

  return (
    <article className="article-card">
      <Link href={`/articles/${article.slug}`} className="article-card-link">
        <div className="article-card-cover">
          {article.cover_url ? (
            <img src={article.cover_url} alt="" loading="lazy" />
          ) : (
            <div className="article-card-cover-fallback">
              <DiamondOrnament />
            </div>
          )}
          {article.tags?.length > 0 && (
            <div className="article-card-tags">
              {article.tags.slice(0, 2).map((t) => (
                <span key={t} className="article-tag article-tag-overlay">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="article-card-body">
          <h3 className="article-card-title">{title}</h3>
          {excerpt && <p className="article-card-excerpt">{excerpt}</p>}

          <div className="article-card-meta">
            {article.author?.photo_url ? (
              <img src={article.author.photo_url} alt="" className="article-author-photo" />
            ) : (
              <span className="article-author-initial" aria-hidden="true">
                {(article.author?.name || '·').charAt(0)}
              </span>
            )}
            <div className="article-card-meta-text">
              <span className="article-author-name">{authorName}</span>
              {date && <span className="article-date">{date}</span>}
            </div>
          </div>
        </div>
      </Link>

      <div className="article-card-footer">
        <div className="article-card-stats">
          <span className="stat" title={lang === 'am' ? 'እይታዎች' : 'Views'}>
            <Eye size={16} strokeWidth={1.8} aria-hidden="true" />
            {article.views_count || 0}
          </span>
          <span className="stat" title={lang === 'am' ? 'አስተያየቶች' : 'Comments'}>
            <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />
            {article.comments_count || 0}
          </span>
        </div>
        <button
          type="button"
          className={`card-like-btn ${liked ? 'liked' : ''}`}
          onClick={toggle}
          aria-pressed={liked}
          aria-label={lang === 'am' ? 'ወደድኩት' : 'Like this article'}
        >
          <Heart size={16} strokeWidth={1.8} aria-hidden="true" />
          {likes}
        </button>
      </div>
    </article>
  );
}
