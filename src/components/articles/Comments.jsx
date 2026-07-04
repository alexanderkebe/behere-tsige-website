'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import '@/styles/article-comments.css';

const T = {
  en: {
    title: 'Comments',
    empty: 'Be the first to share your thoughts.',
    name: 'Your name',
    message: 'Write a comment…',
    replyMessage: 'Write a reply…',
    post: 'Post Comment',
    reply: 'Reply',
    cancel: 'Cancel',
    posting: 'Posting…',
    error: 'Could not post your comment. Please try again.',
    loading: 'Loading comments…',
    pending: 'Thank you! Your comment was received and will appear once it is approved.',
  },
  am: {
    title: 'አስተያየቶች',
    empty: 'ሐሳብዎን በማካፈል የመጀመሪያ ይሁኑ።',
    name: 'ስምዎ',
    message: 'አስተያየት ይጻፉ…',
    replyMessage: 'ምላሽ ይጻፉ…',
    post: 'አስተያየት ይለጥፉ',
    reply: 'መልስ',
    cancel: 'ይቅር',
    posting: 'በመላክ ላይ…',
    error: 'አስተያየትዎን መለጠፍ አልተቻለም። እባክዎ እንደገና ይሞክሩ።',
    loading: 'አስተያየቶች በመጫን ላይ…',
    pending: 'እናመሰግናለን! አስተያየትዎ ደርሶናል፤ ከጸደቀ በኋላ ይታያል።',
  },
};

function timeAgo(iso, lang) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const units = [
    [31536000, lang === 'am' ? 'ዓመት' : 'y'],
    [2592000, lang === 'am' ? 'ወር' : 'mo'],
    [86400, lang === 'am' ? 'ቀን' : 'd'],
    [3600, lang === 'am' ? 'ሰዓት' : 'h'],
    [60, lang === 'am' ? 'ደቂቃ' : 'm'],
  ];
  for (const [secs, label] of units) {
    if (s >= secs) {
      const n = Math.floor(s / secs);
      return lang === 'am' ? `ከ${n} ${label} በፊት` : `${n}${label} ago`;
    }
  }
  return lang === 'am' ? 'አሁን' : 'just now';
}

function CommentForm({ t, onSubmit, placeholder, autoFocus, onCancel }) {
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !body.trim() || busy) return;
    setBusy(true);
    setError('');
    const ok = await onSubmit(name.trim(), body.trim());
    setBusy(false);
    if (ok) {
      setBody('');
      if (onCancel) onCancel();
    } else {
      setError(t.error);
    }
  };

  return (
    <form className="comment-form" onSubmit={submit}>
      <input
        className="comment-input comment-input-name"
        placeholder={t.name}
        value={name}
        maxLength={80}
        required
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="comment-input comment-input-body"
        placeholder={placeholder}
        value={body}
        maxLength={2000}
        required
        rows={3}
        autoFocus={autoFocus}
        onChange={(e) => setBody(e.target.value)}
      />
      {error && <p className="comment-error">{error}</p>}
      <div className="comment-form-actions">
        {onCancel && (
          <button type="button" className="btn-comment-cancel" onClick={onCancel}>
            {t.cancel}
          </button>
        )}
        <button type="submit" className="btn-comment-post" disabled={busy}>
          {busy ? t.posting : t.post}
        </button>
      </div>
    </form>
  );
}

function CommentNode({ comment, t, lang, onReply, depth }) {
  const [replying, setReplying] = useState(false);
  const name = comment.guest_name || (lang === 'am' ? 'እንግዳ' : 'Guest');

  return (
    <li className="comment-item">
      <div className="comment-card">
        <div className="comment-head">
          <span className="comment-avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
          <span className="comment-name">{name}</span>
          <span className="comment-time">{timeAgo(comment.created_at, lang)}</span>
        </div>
        <p className="comment-body">{comment.body}</p>
        <button className="btn-comment-reply" onClick={() => setReplying((r) => !r)}>
          {replying ? t.cancel : t.reply}
        </button>
        {replying && (
          <CommentForm
            t={t}
            placeholder={t.replyMessage}
            autoFocus
            onCancel={() => setReplying(false)}
            onSubmit={(name2, body) => onReply(comment.id, name2, body)}
          />
        )}
      </div>
      {comment.children.length > 0 && (
        <ul className={`comment-children ${depth >= 4 ? 'comment-children-flat' : ''}`}>
          {comment.children.map((child) => (
            <CommentNode key={child.id} comment={child} t={t} lang={lang} onReply={onReply} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Comments({ articleId, lang }) {
  const t = T[lang] || T.en;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('article_comments')
      .select('id, parent_comment_id, guest_name, body, created_at')
      .eq('article_id', articleId)
      .eq('status', 'visible')
      .order('created_at', { ascending: true });
    if (!error) setComments(data || []);
    setLoading(false);
  }, [supabase, articleId]);

  useEffect(() => {
    load();
  }, [load]);

  // New comments start as 'pending' (moderated), so they won't be in the
  // reloaded list — show a "waiting for approval" note instead.
  const post = async (parentId, name, body) => {
    const { error } = await supabase.from('article_comments').insert({
      article_id: articleId,
      parent_comment_id: parentId,
      guest_name: name,
      body,
    });
    if (error) return false;
    setAwaitingApproval(true);
    return true;
  };

  // Assemble the flat rows into a nested tree via parent_comment_id.
  const tree = useMemo(() => {
    const byId = new Map(comments.map((c) => [c.id, { ...c, children: [] }]));
    const roots = [];
    for (const c of byId.values()) {
      if (c.parent_comment_id && byId.has(c.parent_comment_id)) {
        byId.get(c.parent_comment_id).children.push(c);
      } else {
        roots.push(c);
      }
    }
    return roots;
  }, [comments]);

  return (
    <section className="article-comments" aria-label={t.title}>
      <h2 className="comments-title">
        {t.title}
        {comments.length > 0 && <span className="comments-count">{comments.length}</span>}
      </h2>

      <CommentForm t={t} placeholder={t.message} onSubmit={(name, body) => post(null, name, body)} />

      {awaitingApproval && <p className="comments-hint comments-hint-pending">{t.pending}</p>}

      {loading ? (
        <p className="comments-hint">{t.loading}</p>
      ) : tree.length === 0 ? (
        <p className="comments-hint">{t.empty}</p>
      ) : (
        <ul className="comments-list">
          {tree.map((c) => (
            <CommentNode key={c.id} comment={c} t={t} lang={lang} onReply={post} depth={0} />
          ))}
        </ul>
      )}
    </section>
  );
}
