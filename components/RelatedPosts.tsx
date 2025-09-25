import Image from "next/image"
import Link from "next/link"
import type { Post } from "../app/types/wordpress"

interface RelatedPostsProps {
  posts: Array<{
    node: Post
  }>
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Related Articles</h3>
      {posts.map(({ node: post }) => (
        <Link key={post.id} href={`/blog/${post.slug}`} className="flex items-start space-x-4 group">
          {post.featuredImage && (
            <div className="relative w-36 h-24 flex-shrink-0">
              <Image
                src={post.featuredImage.node.sourceUrl || "/placeholder.svg"}
                alt={post.featuredImage.node.altText || post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <h3 className="text-sm font-medium group-hover:text-blue-600 transition-colors">{post.title}</h3>
        </Link>
      ))}
    </div>
  )
}

