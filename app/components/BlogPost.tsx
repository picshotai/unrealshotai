import Image from "next/image"
import Link from "next/link"
import { parseISO, format } from "date-fns"
import type { Post } from "../types/wordpress"
import { Breadcrumb } from "@/components/Breadcrumb"
import { GenerateHeadshotCTA } from "@/components/GenerateHeadshotCTA"
import { SocialShare } from "@/components/SocialShare"
import { RelatedPosts } from "@/components/RelatedPosts"
import { ContentParser } from "@/components/ContentParser"

interface BlogPostProps {
  post: Post
  relatedPosts?: Array<{
    node: Post
  }>
  previousPost?: Post
  nextPost?: Post
}

const BlogPost: React.FC<BlogPostProps> = ({ post, relatedPosts, previousPost, nextPost }) => {
  const date = parseISO(post.date)
  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <article className="lg:col-span-2">
        <Breadcrumb title={post.title} />

        <div className="bg-white rounded-lg overflow-hidden">
          {post.featuredImage && (
            <div className="relative w-full pb-[66.67%] mb-6">
              <Image
                src={post.featuredImage.node.sourceUrl || "/placeholder.svg"}
                alt={post.featuredImage.node.altText || post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-lg"
              />
            </div>
          )}
            <GenerateHeadshotCTA />

          <div className="py-4 md:px-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-4 text-lg font-semibold">
                {getInitial(post.author.node.name)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author.node.name}</p>
                <time dateTime={post.date} className="text-sm text-gray-600">
                  {format(date, "MMMM dd, yyyy")}
                </time>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">{post.title}</h1>

            <SocialShare url={`https://www.unrealshot.com/blog/${post.slug}`} title={post.title} />

            <ContentParser content={post.content} />


            <div className="flex flex-wrap gap-2 mb-8">
              {post.categories.edges.map(({ node: category }) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-semibold hover:bg-indigo-200 transition-colors duration-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {(previousPost || nextPost) && (
              <div className="border-t border-gray-200 pt-8 mt-8 grid grid-cols-2 gap-4">
                {previousPost && (
                  <Link href={`/blog/${previousPost.slug}`} className="group text-left">
                    <div className="text-sm text-gray-500">Previous Post</div>
                    <div className="text-lg font-medium group-hover:text-indigo-600 transition-colors duration-200">
                      {previousPost.title}
                    </div>
                  </Link>
                )}
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`} className="group text-right">
                    <div className="text-sm text-gray-500">Next Post</div>
                    <div className="text-lg font-medium group-hover:text-indigo-600 transition-colors duration-200">
                      {nextPost.title}
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      <aside className="lg:col-span-1">
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="sticky top-24">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </aside>
    </div>
  )
}

export default BlogPost

