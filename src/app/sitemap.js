import { site } from '@/data/site';

export default function sitemap() {
  return [{ url: site.url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }];
}
