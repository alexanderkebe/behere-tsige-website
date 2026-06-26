'use client';

import Link from 'next/link';

export default function ArticleCard({ article, lang }) {
  const title = lang === 'am' ? article.title_am || article.title_en : article.title_en;
  const excerpt = lang === 'am' ? article.excerpt_am || article.excerpt_en : article.excerpt_en;
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : '';

  return (
    <Link href={`/articles/${article.slug}`} className="article-card">
      <div className="article-card-cover">
        {article.cover_url
          ? <img src={article.cover_url} alt="" loading="lazy" />
          : <div className="article-card-cover-fallback">✚</div>}
      </div>
      <div className="article-card-body">
        {article.tags?.length > 0 && (
          <div className="article-tags">
            {article.tags.slice(0, 3).map((t) => <span key={t} className="article-tag">#{t}</span>)}
          </div>
        )}
        <h3 className="article-card-title">{title}</h3>
        {excerpt && <p className="article-card-excerpt">{excerpt}</p>}
        <div className="article-card-meta">
          {article.author?.photo_url && (
            <img src={article.author.photo_url} alt="" className="article-author-photo" />
          )}
          <span className="article-author-name">{article.author?.name}</span>
          {date && <span className="article-date">· {date}</span>}
        </div>
      </div>
    </Link>
  );
}
