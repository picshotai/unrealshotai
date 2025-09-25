import Image from "next/image"
import Link from "next/link"
import { parseISO, format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Post {
  id: string
  date: string
  title: string
  slug: string
  excerpt: string
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string | null
    } | null
  } | null
  categories: {
    edges: Array<{
      node: {
        name: string
        slug: string
      }
    }>
  } | null
}

interface BlogListProps {
  posts: Post[]
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.id}
          className="block transition-all duration-300 hover:-translate-y-1"
        >
          <Card className="overflow-hidden border-gray-200">
            <div className="relative h-48">
              {post.featuredImage?.node && (
                <Image
                  src={post.featuredImage.node.sourceUrl || "/placeholder.svg"}
                  alt={post.featuredImage.node.altText || post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
            <CardContent className="p-6">
              {post.categories?.edges && post.categories.edges.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.categories.edges.map(({ node }) => (
                    <Badge key={node.slug} variant="secondary">
                      {node.name}
                    </Badge>
                  ))}
                </div>
              )}
              <h2 className="text-xl font-bold mb-4 text-gray-900">{post.title}</h2>
              <div className="text-gray-600 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
              <div className="mt-4 text-sm text-gray-500">{format(parseISO(post.date), "MMMM d, yyyy")}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default BlogList

