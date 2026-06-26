import { createClient } from '../supabase/server';

const SELECT = '*, author:authors(id,name,photo_url), articles_tags(tag:tags(id,tag))';

function normalize(a) {
  return { ...a, tags: (a.articles_tags || []).map((t) => t.tag?.tag).filter(Boolean) };
}

/** Published articles, newest first. */
export async function getPublishedArticles() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false });
    if (error) throw error;
    return (data || []).map(normalize);
  } catch (e) {
    console.error('getPublishedArticles:', e?.message || e);
    return [];
  }
}

/** A single published article by slug, or null. */
export async function getArticleBySlug(slug) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(SELECT)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    return data ? normalize(data) : null;
  } catch (e) {
    console.error('getArticleBySlug:', e?.message || e);
    return null;
  }
}
