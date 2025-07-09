"use client"

import { useState } from "react"
import type { Comment } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MessageCircle, Edit, Trash2, UserIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CommentSectionProps {
  blogId: string
  comments: Comment[]
  onCommentsUpdate: (comments: Comment[]) => void
}

export default function CommentSection({ blogId, comments, onCommentsUpdate }: CommentSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)
    try {
      const response = await apiClient.addComment(blogId, newComment)
      const updatedComments = [...comments, response.data]
      onCommentsUpdate(updatedComments)
      setNewComment("")
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await apiClient.updateComment(commentId, editContent)
      const updatedComments = comments.map((comment) => (comment.id === commentId ? response.data : comment))
      onCommentsUpdate(updatedComments)
      setEditingComment(null)
      setEditContent("")
      toast({
        title: "Success",
        description: "Comment updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update comment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await apiClient.deleteComment(commentId)
      const updatedComments = comments.filter((comment) => comment.id !== commentId)
      onCommentsUpdate(updatedComments)
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {user && (
        <Card>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim() || isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Comment"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                {user && user.id === comment.author.id && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingComment(comment.id)
                        setEditContent(comment.comment)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingComment(null)
                        setEditContent("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700">{comment.comment}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
      )}
    </div>
  )
}
