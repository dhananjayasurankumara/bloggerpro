import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://bloggerpro.com';

  const staticRoutes = [
    '',
    '/blog',
    '/community',
    '/pricing',
    '/shop',
    '/about',
    '/disclaimer',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  try {
    // Fetch all articles
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { category: true }
    });

    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.category.slug}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Fetch all categories
    const categories = await prisma.category.findMany();
    const categoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/blog/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Fetch all forum topics
    const topics = await prisma.forumTopic.findMany();
    const topicUrls = topics.map((topic) => ({
      url: `${baseUrl}/community/topic/${topic.id}`,
      lastModified: topic.createdAt,
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...postUrls, ...categoryUrls, ...topicUrls];
  } catch (error) {
    console.error("[SITEMAP_ERROR] Failed to fetch dynamic routes:", error);
    return staticRoutes;
  }
}
