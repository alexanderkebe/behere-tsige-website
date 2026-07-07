import { getPublishedArticles } from '@/lib/data/articles';
import ArticlesView from '@/screens/ArticlesView';

export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  return <ArticlesView articles={articles} />;
}
