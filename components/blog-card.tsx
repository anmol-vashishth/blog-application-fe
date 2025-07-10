import Link from "next/link"
import type { Blog } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

interface BlogCardProps {
  blog: Blog
}

export default function BlogCard({ blog }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link href={`/blog/${blog._id}`} className="hover:text-blue-600">
            {blog.title}
          </Link>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {blog.createdBy?.name}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(blog.createdAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-3">{blog.body.substring(0, 150)}...</p>
      </CardContent>
    </Card>
  )
}
