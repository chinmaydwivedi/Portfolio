"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  Search,
} from "lucide-react"
import Navbar from "@/components/navbar"
import type { BlogPost } from "@/lib/schema"

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])))

  const filtered = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !selectedTag || p.tags?.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Thoughts on systems, competitive programming, and building
              software.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-transparent text-sm outline-none transition-all"
              />
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  !selectedTag
                    ? "bg-primary text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              {posts.length === 0
                ? "No posts yet"
                : "No posts match your search"}
            </p>
            <p className="text-muted-foreground/60 text-sm">
              {posts.length === 0
                ? "Blog posts will appear here once published."
                : "Try a different search term or tag."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <article className="group glass glass-hover rounded-xl p-6 transition-all duration-300 hover:border-primary/30">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {post.cover_image && (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full sm:w-48 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {estimateReadTime(post.content)} min read
                          </span>
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 hidden sm:block mt-1" />
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
