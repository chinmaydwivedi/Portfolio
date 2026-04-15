"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Lock,
  FileText,
  Loader2,
  CheckCircle2,
  X,
  Pencil,
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import type { BlogPost } from "@/lib/schema"

export default function BlogAdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState("")

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    tags: "",
    published: false,
  })

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/blog?all=true", {
        headers: { "x-admin-password": password },
      })
      const data = await res.json()
      if (Array.isArray(data)) setPosts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async () => {
    const res = await fetch("/api/blog?all=true", {
      headers: { "x-admin-password": password },
    })
    if (res.ok) {
      setAuthenticated(true)
      const data = await res.json()
      if (Array.isArray(data)) setPosts(data)
    } else {
      setStatus("Invalid password")
      setTimeout(() => setStatus(""), 2000)
    }
  }

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

  const startNew = () => {
    setIsNew(true)
    setEditing(null)
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      tags: "",
      published: false,
    })
  }

  const startEdit = (post: BlogPost) => {
    setIsNew(false)
    setEditing(post)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      cover_image: post.cover_image || "",
      tags: post.tags?.join(", ") || "",
      published: post.published,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        ...(editing ? { id: editing.id } : {}),
      }

      const method = isNew ? "POST" : "PUT"
      const res = await fetch("/api/blog", {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatus("Saved successfully")
        setEditing(null)
        setIsNew(false)
        fetchPosts()
      } else {
        const err = await res.json()
        setStatus(err.error || "Failed to save")
      }
    } catch {
      setStatus("Error saving post")
    } finally {
      setSaving(false)
      setTimeout(() => setStatus(""), 3000)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post permanently?")) return

    try {
      await fetch(`/api/blog?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      })
      fetchPosts()
    } catch {
      setStatus("Failed to delete")
      setTimeout(() => setStatus(""), 3000)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-8 text-center"
          >
            <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Blog Admin</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your admin password to manage posts.
            </p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:border-primary/50 bg-transparent text-sm outline-none mb-4"
            />
            <button
              onClick={handleAuth}
              className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
            >
              Sign In
            </button>
            {status && (
              <p className="text-destructive text-sm mt-3">{status}</p>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

  const showEditor = isNew || editing

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Blog Admin</h1>
          </div>
          {!showEditor && (
            <button
              onClick={startNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          )}
        </div>

        {status && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
            {status}
          </div>
        )}

        {showEditor ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {isNew ? "New Post" : "Edit Post"}
              </h2>
              <button
                onClick={() => {
                  setEditing(null)
                  setIsNew(false)
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Post title"
              value={form.title}
              onChange={(e) => {
                setForm({
                  ...form,
                  title: e.target.value,
                  slug: isNew ? generateSlug(e.target.value) : form.slug,
                })
              }}
              className="w-full px-4 py-3 rounded-lg border border-border/50 focus:border-primary/50 bg-transparent text-lg font-semibold outline-none"
            />

            <input
              type="text"
              placeholder="slug-url"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:border-primary/50 bg-transparent text-sm font-mono outline-none"
            />

            <input
              type="text"
              placeholder="Short excerpt"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:border-primary/50 bg-transparent text-sm outline-none"
            />

            <input
              type="text"
              placeholder="Cover image URL (optional)"
              value={form.cover_image}
              onChange={(e) =>
                setForm({ ...form, cover_image: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:border-primary/50 bg-transparent text-sm outline-none"
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:border-primary/50 bg-transparent text-sm outline-none"
            />

            <textarea
              placeholder="Write your post in Markdown..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={20}
              className="w-full px-4 py-3 rounded-lg border border-border/50 focus:border-primary/50 bg-transparent text-sm font-mono outline-none resize-y"
            />

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm({ ...form, published: e.target.checked })
                  }
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">
                  {form.published ? "Published" : "Draft"}
                </span>
              </label>

              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.slug || !form.content}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No posts yet. Create your first post.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{post.title}</h3>
                    {post.published ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                        <Eye className="w-3 h-3" />
                        Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs">
                        <EyeOff className="w-3 h-3" />
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    /{post.slug} &middot;{" "}
                    {new Date(post.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(post)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
