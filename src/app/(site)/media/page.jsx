import { getMediaLinks } from '@/lib/data/media';
import MediaView from '@/screens/MediaView';

export const revalidate = 60;

export default async function MediaPage() {
  const mediaLinks = await getMediaLinks();
  return <MediaView initialMediaLinks={mediaLinks} />;
}
