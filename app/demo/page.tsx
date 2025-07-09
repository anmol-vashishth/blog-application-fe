"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function DemoPage() {
  const [demoData, setDemoData] = useState({
    email: "demo@example.com",
    password: "demo123",
    blogTitle: "My First Blog Post",
    blogContent: "This is a sample blog post content. You can write about anything you want here!",
  })
  const { toast } = useToast()

  const handleDemoAction = (action: string) => {
    toast({
      title: "Demo Mode",
      description: `This would ${action} in a real application with your API`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog App Demo</h1>
        <p className="text-gray-600">
          This is a demonstration of the blog application. In a real environment, you would configure your API URL.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Demo</CardTitle>
            <CardDescription>Test the signin/signup functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="demo-email">Email</Label>
              <Input
                id="demo-email"
                type="email"
                value={demoData.email}
                onChange={(e) => setDemoData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="demo-password">Password</Label>
              <Input
                id="demo-password"
                type="password"
                value={demoData.password}
                onChange={(e) => setDemoData((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleDemoAction("sign in")} className="flex-1">
                Demo Sign In
              </Button>
              <Button onClick={() => handleDemoAction("sign up")} variant="outline" className="flex-1">
                Demo Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog Creation Demo</CardTitle>
            <CardDescription>Test the blog creation functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="demo-title">Blog Title</Label>
              <Input
                id="demo-title"
                value={demoData.blogTitle}
                onChange={(e) => setDemoData((prev) => ({ ...prev, blogTitle: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="demo-content">Blog Content</Label>
              <Textarea
                id="demo-content"
                value={demoData.blogContent}
                onChange={(e) => setDemoData((prev) => ({ ...prev, blogContent: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={() => handleDemoAction("create blog post")} className="w-full">
              Demo Create Blog
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>How to configure the application with your API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Environment Configuration</h3>
              <p className="text-sm text-gray-600 mb-2">
                Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root:
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">NEXT_PUBLIC_API_URL=http://43.204.47.186</div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. API Integration</h3>
              <p className="text-sm text-gray-600">
                The application is configured to work with your provided API endpoints:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1">
                <li>
                  Authentication: <code>/auth/signin</code>, <code>/auth/signup</code>
                </li>
                <li>
                  Blog Management: <code>/blog</code> (GET, POST, PATCH, DELETE)
                </li>
                <li>
                  Comments: <code>/blog/:id/comment</code>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Features Available</h3>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>User authentication with JWT tokens</li>
                <li>Create, read, update, delete blog posts</li>
                <li>Comment system with full CRUD operations</li>
                <li>Responsive design with Tailwind CSS</li>
                <li>Protected routes and authorization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
