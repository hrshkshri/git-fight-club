import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://git-fight-club.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://git-fight-club.vercel.app/battle',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];
}
