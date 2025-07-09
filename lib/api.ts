const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
// Remove the duplicate interface definitions at the top and keep only the imports
import type { User, Blog, Comment, AuthResponse, BlogResponse } from "./types"

class ApiClient {
  private getAuthHeaders() {
    if (typeof window === "undefined") return { "Content-Type": "application/json" }

    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `${token}` }),
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "An error occurred" }))
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Network error occurred")
    }
  }

  // Auth endpoints
  async signup(data: { name: string; email: string; password: string; designation?: string }) {
    return this.request<{ message: string; data: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async signin(data: { email: string; password: string }) {
    return this.request<AuthResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Blog endpoints
  async getBlogs(params: { limit?: number; page?: number; sort?: string; sortBy?: string } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString())
    })

    return this.request<BlogResponse>(`/blog?${searchParams}`)
  }

  async getBlog(id: string) {
    return this.request<{ data: Blog; comments: Comment[] }>(`/blog/${id}`)
  }

  async createBlog(data: { title: string; body: string }) {
    return this.request<{ message: string; data: Blog }>("/blog", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateBlog(id: string, data: { title?: string; body?: string }) {
    return this.request<{ message: string; data: Blog }>(`/blog/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteBlog(id: string) {
    return this.request<{ message: string }>(`/blog/${id}`, {
      method: "DELETE",
    })
  }

  // Comment endpoints
  async addComment(blogId: string, comment: string) {
    return this.request<{ message: string; data: Comment }>(`/blog/${blogId}/comment`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    })
  }

  async updateComment(commentId: string, content: string) {
    return this.request<{ message: string; data: Comment }>(`/blog/comment/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    })
  }

  async deleteComment(commentId: string) {
    return this.request<{ message: string }>(`/blog/comment/${commentId}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
