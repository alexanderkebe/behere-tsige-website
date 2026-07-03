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
    const articles = (data || []).map(normalize);
    for (let i = 0; i < Math.min(2, articles.length); i++) {
      if (!articles[i].cover_url) {
        articles[i].cover_url = `https://picsum.photos/seed/${articles[i].id}/800/600`;
      }
    }
    return articles;
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
    if (data) {
      const art = normalize(data);
      if (!art.cover_url) {
        art.cover_url = `https://picsum.photos/seed/${art.id}/800/600`;
      }
      return art;
    }
    return null;
  } catch (e) {
    console.error('getArticleBySlug:', e?.message || e);
    return null;
  }
}
