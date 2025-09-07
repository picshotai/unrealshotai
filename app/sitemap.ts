import { MetadataRoute } from 'next'
import { defaultSEO } from '@/config/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = defaultSEO.siteUrl
  const currentDate = new Date()

  // Static public pages only (no protected routes)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    // Note: Protected pages like /dashboard, /buy-credits, /settings, /account
    // are intentionally excluded from sitemap as they require authentication
    // and should not be indexed by search engines
  ]

  // TODO: Add dynamic pages here when needed
  // Example: blog posts, product pages, user profiles, etc.
  // const dynamicPages = await getDynamicPages()

  return [...staticPages]
}

// Helper function for future dynamic content
// async function getDynamicPages() {
//   // Fetch dynamic content from your database/CMS
//   // Example:
//   // const posts = await getBlogPosts()
//   // return posts.map(post => ({
//   //   url: `${seoConfig.siteUrl}/blog/${post.slug}`,
//   //   lastModified: new Date(post.updatedAt),
//   //   changeFrequency: 'weekly' as const,
//   //   priority: 0.6,
//   // }))
//   return []
// }