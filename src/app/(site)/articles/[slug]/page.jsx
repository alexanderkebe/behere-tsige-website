import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/data/articles';
import ArticleView from '@/screens/ArticleView';

export const revalidate = 60;

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}
