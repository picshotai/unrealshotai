import { getAllPosts, searchPosts } from "../lib/api"
import BlogList from "../components/BlogList"
import Sidebar from "../components/Sidebar"
import SearchBar from "../components/SearchBar"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Unrealshot AI Blog",
  description: "Read our latest articles for personal and professional photography tips.",
  openGraph: {
    title: "Unrealshot AI Blog - Personal and Professional Photography Tips",
    description: "Read our latest articles for personal and professional photography tips.",
    type: "website",
    url: "https://www.unrealshot.com/blog",
  },
}

interface BlogPageProps {
  searchParams?: {
    page?: string
    search?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams?.page) || 1
  const searchQuery = searchParams?.search || ""
  const postsPerPage = 8

  try {
    const { edges: posts, pageInfo } = searchQuery
      ? await searchPosts(searchQuery, page, postsPerPage)
      : await getAllPosts(page, postsPerPage)

  return (
    <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Unrealshot AI Blog</h1>
      <SearchBar />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {posts.length > 0 ? (
            <>
              <BlogList posts={posts.map((edge) => edge.node)} />
              <div className="mt-12 flex justify-center gap-4">
                {page > 1 && (
                  <Link
                    href={`/blog?page=${page - 1}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Previous
                  </Link>
                )}
                {pageInfo.hasNextPage && (
                  <Link
                    href={`/blog?page=${page + 1}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Next
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">No posts found</h2>
              <p className="text-gray-600 mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return (
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Unrealshot AI Blog</h1>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Sorry, we're having trouble loading the blog posts right now.</p>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }
}

