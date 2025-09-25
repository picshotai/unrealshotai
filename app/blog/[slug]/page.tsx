import { getPostBySlug, getAllPosts } from "../../lib/api"
import BlogPost from "../../components/BlogPost"
import type { Metadata } from "next"
import Script from "next/script"

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug)
  const ogImageUrl = post.featuredImage?.node.sourceUrl || "https://www.unrealshot.com/content/screenshot.png"

  return {
    title: `${post.title} | Unrealshot AI Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.node.name],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      url: `https://www.unrealshot.com/blog/${params.slug}`,
      siteName: "Unrealshot AI",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  }
  } catch (error) {
    console.error('Error generating metadata for blog post:', error)
    return {
      title: 'Blog Post | Unrealshot AI Blog',
      description: 'AI-generated professional headshots and profile photos',
    }
  }
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getPostBySlug(params.slug)
    const allPosts = await getAllPosts()

  const currentIndex = allPosts.edges.findIndex(({ node }) => node.slug === params.slug)

  const previousPost = currentIndex < allPosts.edges.length - 1 ? allPosts.edges[currentIndex + 1].node : undefined
  const nextPost = currentIndex > 0 ? allPosts.edges[currentIndex - 1].node : undefined

  const relatedPosts = allPosts.edges
    .filter(
      ({ node }) =>
        node.slug !== params.slug &&
        node.categories.edges.some(({ node: category }) =>
          post.categories.edges.some(({ node: postCategory }) => postCategory.slug === category.slug),
        ),
    )
    .slice(0, 5)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.featuredImage?.node.sourceUrl || "https://www.unrealshot.com/content/screenshot.png",
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      "@type": "Person",
      name: post.author.node.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Unrealshot AI",
      logo: {
        "@type": "ImageObject",
        url: "https://www.unrealshot.com/favicon.ico",
      },
    },
    description: post.excerpt,
    url: `https://www.unrealshot.com/blog/${params.slug}`,
  }

  return (
    <>
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <BlogPost post={post} relatedPosts={relatedPosts} previousPost={previousPost} nextPost={nextPost} />
      </div>
    </>
  )
  } catch (error) {
    console.error('Error loading blog post:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600">Sorry, this blog post could not be loaded.</p>
        </div>
      </div>
    )
  }
}

export async function generateStaticParams() {
  try {
    const postsResponse = await getAllPosts()
    return postsResponse.edges.map(({ node }) => ({
      slug: node.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return [] // Return empty array to prevent build failure
  }
}

