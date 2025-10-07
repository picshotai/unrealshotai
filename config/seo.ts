/**
 * SEO Configuration for Next.js Application
 * 
 * This file contains all SEO-related configurations that can be easily customized
 * by users of this boilerplate. All settings are centralized here for easy management.
 * 
 * To customize SEO for your application:
 * 1. Update the defaultSEO object with your brand information
 * 2. Modify social media handles and URLs
 * 3. Update the organization schema with your company details
 * 4. Customize page-specific SEO in the pageSEO object
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  siteUrl: string;
  siteName: string;
  locale: string;
  type: string;
  robots: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  yandexVerification?: string;
}

export interface SocialConfig {
  twitter: {
    handle: string;
    site: string;
    cardType: 'summary' | 'summary_large_image' | 'app' | 'player';
  };
  facebook: {
    appId?: string;
    admins?: string[];
  };
  linkedin: {
    companyId?: string;
  };
  instagram: {
    handle?: string;
  };
}

export interface OrganizationSchema {
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    '@type': string;
    telephone?: string;
    contactType?: string;
    email?: string;
  };
  sameAs?: string[];
}

// Default SEO Configuration
export const defaultSEO: SEOConfig = {
  title: 'The #1 Realistic AI Photoshoot Generator | Unrealshot AI',
  description: 'Get a complete, realistic AI photoshoot from your selfies. Includes professional AI headshots, creative portraits, and more. Hundreds of studio-quality photos for a fraction of the cost.',
  keywords: [
    'AI photoshoot generator',
    'AI headshot generator',
    'realistic AI photos',
    'AI photos from selfies',
    'professional AI photos',
    'AI photo generator',
    'AI portraits',
    'studio-quality AI',
    'LinkedIn headshot',
    'dating profile picture'
  ],  
    author: 'Unrealshot AI',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.unrealshot.com',
  siteName: 'Unrealshot AI',
  locale: 'en_US',
  type: 'website',
  robots: 'index, follow',
  // Add your verification codes here
  googleSiteVerification: 'YOUR_GOOGLE_VERIFICATION_CODE',
  bingSiteVerification: 'YOUR_BING_VERIFICATION_CODE',
  yandexVerification: undefined,
};

// Social Media Configuration
export const socialConfig: SocialConfig = {
  twitter: {
    handle: '@unrealshotai', // Replace with your actual Twitter handle
    site: '@unrealshotai', // Replace with your actual Twitter handle
    cardType: 'summary_large_image',
  },
  facebook: {
    appId: undefined, // Add your Facebook App ID if you have one
    admins: undefined,
  },
  linkedin: {
    companyId: undefined, // Add your LinkedIn company page ID if you have one
  },
  instagram: {
    handle: '@unrealshotai', // Replace with your actual Instagram handle
  },
};

// Organization Schema for Structured Data
export const organizationSchema: OrganizationSchema = {
  '@type': 'Organization',
  name: 'Unrealshot AI',
  url: defaultSEO.siteUrl,
  logo: `${defaultSEO.siteUrl}/logo.png`, // Ensure this path is correct
  description: defaultSEO.description,
  address: {
    '@type': 'PostalAddress',
    // It's better to omit address if you are a remote-first company
    // streetAddress: '123 Business Street',
    // addressLocality: 'Your City',
    // addressRegion: 'Your State',
    // postalCode: '12345',
    addressCountry: 'US', // Or your country of registration
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: undefined, // Optional: Add if you have a business phone
    contactType: 'customer service',
    email: 'support@unrealshot.com', // Replace with your support email
  },
  sameAs: [
    'https://x.com/unrealshotai', // Replace with your actual social links
    'https://linkedin.com/company/unrealshotai',
    'https://instagram.com/unrealshotai',
  ],
};
// --- Page-specific SEO configurations ---
// Tailored meta for each important page.

export const pageSEO = {
  home: {
    title: defaultSEO.title,
    description: defaultSEO.description,
    keywords: defaultSEO.keywords,
  },
  login: {
    title: 'Sign In - Unrealshot AI',
    description: 'Sign in to your Unrealshot account to access your AI photoshoots and create new ones.',
    keywords: ['login', 'sign in', 'unrealshot account', 'user portal'],
  },
  dashboard: {
    title: 'My Photoshoots - Unrealshot AI',
    description: 'Access your dashboard to view, download, and manage all your AI-generated photoshoots.',
    keywords: ['dashboard', 'my account', 'my photoshoots'],
    robots: 'noindex, nofollow', // Correctly kept private
  },
  pricing: {
    title: 'Pricing Plans - Unrealshot AI',
    description: 'Find the perfect plan for your AI photoshoot. Get a complete portfolio of stunning images for a fraction of the cost of a traditional studio.',
    keywords: ['pricing', 'plans', 'ai photoshoot cost', 'packages'],
  },
  buyCredits: { // Renamed from pricing page, assuming this is the one-time purchase page
    title: 'Start Your Photoshoot - Unrealshot AI',
    description: 'Choose your package and get started. Transform your selfies into a complete, professional AI photoshoot in minutes.',
    keywords: ['buy credits', 'start photoshoot', 'purchase', 'packages'],
  },
  account: {
    title: 'Account Settings - Unrealshot AI',
    description: 'Manage your Unrealshot account settings, view past orders, and update your information.',
    keywords: ['account', 'settings', 'profile', 'orders'],
    robots: 'noindex, nofollow',
  },
  // You don't have this page yet, but it's ready for the future
  reports: {
    title: 'My Photoshoots - Unrealshot AI',
    description: 'View and download all your past AI photoshoot results.',
    keywords: ['my photoshoots', 'results', 'downloads'],
    robots: 'noindex, nofollow',
  },
  blog: {
    title: 'The Studio - The Unrealshot AI Blog',
    description: 'Your definitive guide to mastering your digital identity. Expert tips, creative inspiration, and deep dives into the art of the perfect AI photoshoot.',
    keywords: ['blog', 'ai photoshoot', 'ai photography', 'digital identity', 'creative tips'],
  },
  blogPost: { // Dynamic template for blog posts
    title: '{title} - The Studio',
    description: '{description}',
    keywords: ['blog', 'ai photoshoot', 'guide', 'tutorial'],
  },
};
// Open Graph Image Configuration
export const openGraphImages = {
  default: {
    url: `${defaultSEO.siteUrl}/og-image.png`,
    width: 1200,
    height: 630,
    alt: defaultSEO.title,
  },
  logo: {
    url: `${defaultSEO.siteUrl}/logo.png`,
    width: 400,
    height: 400,
    alt: `${defaultSEO.siteName} Logo`,
  },
};

// Robots.txt Configuration
export const robotsConfig = {
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: [
      '/api/',
      '/dashboard/',
      '/account/',
      '/settings/',
      '/_next/',
      '/admin/',
    ],
  },
  sitemap: `${defaultSEO.siteUrl}/sitemap.xml`,
};

// Sitemap Configuration
export const sitemapConfig = {
  siteUrl: defaultSEO.siteUrl,
  generateRobotsTxt: true,
  exclude: [
    '/dashboard/*',
    '/account/*',
    '/reports/*',
    '/settings/*',
    '/api/*',
    '/auth/*',
    '/error',
    '/payment-success',
  ],
  additionalPaths: async () => {
    // Add dynamic paths here if needed
    return [];
  },
};

// JSON-LD Schema Templates
export const schemaTemplates = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultSEO.siteName,
    url: defaultSEO.siteUrl,
    description: defaultSEO.description,
    publisher: {
      '@type': 'Organization',
      name: organizationSchema.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${defaultSEO.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: defaultSEO.siteName,
    description: defaultSEO.description,
    url: defaultSEO.siteUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: organizationSchema,
  },
};

// SEO Utility Functions
export const seoUtils = {
  /**
   * Generate page title with site name
   */
  generateTitle: (pageTitle?: string): string => {
    if (!pageTitle) return defaultSEO.title;
    return `${pageTitle} | ${defaultSEO.siteName}`;
  },

  /**
   * Generate canonical URL
   */
  generateCanonicalUrl: (path: string): string => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${defaultSEO.siteUrl}${cleanPath}`;
  },

  /**
   * Generate Open Graph URL
   */
  generateOgUrl: (path: string): string => {
    return seoUtils.generateCanonicalUrl(path);
  },

  /**
   * Merge SEO config with page-specific overrides
   */
  mergeSEOConfig: (pageConfig: Partial<SEOConfig>): SEOConfig => {
    return { ...defaultSEO, ...pageConfig };
  },
};