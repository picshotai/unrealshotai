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
  title: 'Your SaaS Platform - Powerful Tools for Modern Businesses',
  description: 'Transform your business with our comprehensive SaaS platform. Get access to powerful tools, analytics, and integrations that help you scale efficiently.',
  keywords: [
    'SaaS platform',
    'business tools',
    'productivity',
    'analytics',
    'automation',
    'cloud software',
    'business intelligence',
    'workflow management'
  ],
  author: 'Your Company Name',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com',
  siteName: 'Your SaaS Platform',
  locale: 'en_US',
  type: 'website',
  robots: 'index, follow',
  // Add your verification codes here
  googleSiteVerification: undefined,
  bingSiteVerification: undefined,
  yandexVerification: undefined,
};

// Social Media Configuration
export const socialConfig: SocialConfig = {
  twitter: {
    handle: '@yourhandle',
    site: '@yourhandle',
    cardType: 'summary_large_image',
  },
  facebook: {
    appId: undefined, // Add your Facebook App ID
    admins: undefined, // Add Facebook admin IDs
  },
  linkedin: {
    companyId: undefined, // Add your LinkedIn company ID
  },
  instagram: {
    handle: '@yourhandle',
  },
};

// Organization Schema for Structured Data
export const organizationSchema: OrganizationSchema = {
  '@type': 'Organization',
  name: 'Your Company Name',
  url: defaultSEO.siteUrl,
  logo: `${defaultSEO.siteUrl}/logo.png`,
  description: defaultSEO.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Business Street',
    addressLocality: 'Your City',
    addressRegion: 'Your State',
    postalCode: '12345',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    email: 'support@yourcompany.com',
  },
  sameAs: [
    'https://x.com/yourhandle',
    'https://linkedin.com/company/yourcompany',
    'https://facebook.com/yourcompany',
    'https://instagram.com/yourhandle',
  ],
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: defaultSEO.title,
    description: defaultSEO.description,
    keywords: defaultSEO.keywords,
  },
  login: {
    title: 'Sign In - Your SaaS Platform',
    description: 'Sign in to your account to access powerful business tools and analytics.',
    keywords: ['login', 'sign in', 'account access', 'user portal'],
  },
  dashboard: {
    title: 'Dashboard - Your SaaS Platform',
    description: 'Access your personalized dashboard with real-time analytics and business insights.',
    keywords: ['dashboard', 'analytics', 'business intelligence', 'insights'],
    robots: 'noindex, nofollow', // Private pages should not be indexed
  },
  pricing: {
    title: 'Pricing Plans - Your SaaS Platform',
    description: 'Choose the perfect plan for your business. Flexible pricing options with powerful features.',
    keywords: ['pricing', 'plans', 'subscription', 'business plans', 'cost'],
  },
  buyCredits: {
    title: 'Buy Credits - Your SaaS Platform',
    description: 'Purchase credits to unlock premium features and expand your usage limits.',
    keywords: ['buy credits', 'purchase', 'premium features', 'upgrade'],
  },
  account: {
    title: 'Account Settings - Your SaaS Platform',
    description: 'Manage your account settings, billing information, and preferences.',
    keywords: ['account', 'settings', 'profile', 'billing'],
    robots: 'noindex, nofollow',
  },
  reports: {
    title: 'Reports & Analytics - Your SaaS Platform',
    description: 'View detailed reports and analytics to track your business performance.',
    keywords: ['reports', 'analytics', 'performance', 'metrics'],
    robots: 'noindex, nofollow',
  },
  blog: {
    title: 'Blog - Modern React and Web Development',
    description: 'Modern React and web development tutorials, insights, and best practices.',
    keywords: ['blog', 'react', 'web development', 'tutorials', 'next.js', 'javascript', 'typescript', 'programming'],
  },
  blogPost: {
    title: '{title} - Blog',
    description: '{description}',
    keywords: ['blog', 'react', 'web development', 'tutorial'],
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
      '/reports/',
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