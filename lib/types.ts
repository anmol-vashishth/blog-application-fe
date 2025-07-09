export interface User {
  id: string
  name: string
  email: string
  designation?: string
  createdAt: string
  updatedAt: string
}

export interface Blog {
  _id: string
  title: string
  body: string
  createdBy: User
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  comment: string
  author: User
  blogId: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  data: User
  token: string
}

export interface BlogResponse {
  data: Blog[]
  meta: {
    count: number
    page: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
}
