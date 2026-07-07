'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Optimistic like state for an article, shared by the article cards and the
 * opened article view. The liked flag persists per browser in localStorage;
 * the count is kept authoritative by the toggle_article_like RPC's return.
 */
export function useArticleLike(articleId, initialCount = 0) {
  const supabase = useMemo(() => createClient(), []);
  const [likes, setLikes] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try {
      setLiked(!!localStorage.getItem(`liked_${articleId}`));
    } catch {
      /* storage unavailable */
    }
  }, [articleId]);

  const toggle = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    try {
      localStorage.setItem(`liked_${articleId}`, nextLiked ? 'true' : '');
    } catch {
      /* storage unavailable */
    }

    try {
      const { data, error } = await supabase.rpc('toggle_article_like', {
        target_article_id: articleId,
        increment_like: nextLiked,
      });
      if (error) throw error;
      if (typeof data === 'number') setLikes(data);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert if the request failed
      setLiked(!nextLiked);
      setLikes((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
      try {
        localStorage.setItem(`liked_${articleId}`, nextLiked ? '' : 'true');
      } catch {
        /* storage unavailable */
      }
    }
  };

  return { likes, liked, toggle };
}
