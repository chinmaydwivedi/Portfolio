"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  MessageCircle,
  Send,
  Loader2,
  User,
} from "lucide-react"
import Navbar from "@/components/navbar"
import type { BlogPost, Comment } from "@/lib/schema"

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentForm, setCommentForm] = useState({
    author_name: "",
    author_email: "",
    content: "",
  })
  const [commentStatus, setCommentStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle")

  useEffect(() => {
    if (!slug) return

    Promise.all([
      fetch(`/api/blog?slug=${slug}`).then((r) => r.json()),
      fetch(`/api/comments?post_slug=${slug}`).then((r) => r.json()),
    ])
      .then(([postData, commentsData]) => {
        if (postData && !postData.error) setPost(postData)
        if (Array.isArray(commentsData)) setComments(commentsData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCommentStatus("sending")

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commentForm, post_slug: slug }),
      })

      if (res.ok) {
        const newComment = await res.json()
        setComments([newComment, ...comments])
        setCommentForm({ author_name: "", author_email: "", content: "" })
        setCommentStatus("sent")
        setTimeout(() => setCommentStatus("idle"), 3000)
      } else {
        setCommentStatus("error")
        setTimeout(() => setCommentStatus("idle"), 3000)
      }
    } catch {
      setCommentStatus("error")
      setTimeout(() => setCommentStatus("idle"), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This blog post doesn't exist or hasn't been published yet.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          <article>
            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
              />
            )}

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {estimateReadTime(post.content)} min read
              </span>
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose-custom">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Comments */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Comments ({comments.length})
            </h2>

            <form
              onSubmit={handleCommentSubmit}
              className="glass rounded-xl p-6 mb-8 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={commentForm.author_name}
                  onChange={(e) =>
                    setCommentForm({
                      ...commentForm,
                      author_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-transparent text-sm outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={commentForm.author_email}
                  onChange={(e) =>
                    setCommentForm({
                      ...commentForm,
                      author_email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-transparent text-sm outline-none transition-all"
                />
              </div>
              <textarea
                placeholder="Write a comment..."
                required
                rows={3}
                maxLength={2000}
                value={commentForm.content}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, content: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-transparent text-sm outline-none transition-all resize-none"
              />
              <button
                type="submit"
                disabled={commentStatus === "sending"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {commentStatus === "sending" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {commentStatus === "sent"
                  ? "Posted"
                  : commentStatus === "sending"
                    ? "Posting..."
                    : "Post Comment"}
              </button>
            </form>

            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to share your thoughts.
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {comment.author_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {comment.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
