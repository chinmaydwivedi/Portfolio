"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

interface RatingChange {
  contestId: number
  contestName: string
  rank: number
  oldRating: number
  newRating: number
  ratingUpdateTimeSeconds: number
}

const getRatingColor = (rating: number) => {
  if (rating >= 2400) return "#FF6B6B"
  if (rating >= 2200) return "#FFD93D"
  if (rating >= 1900) return "#A78BFA"
  if (rating >= 1600) return "#60A5FA"
  if (rating >= 1400) return "#22D3EE"
  if (rating >= 1200) return "#34D399"
  return "#9CA3AF"
}

export default function CodeforcesRatingGraph({ handle }: { handle: string }) {
  const [ratingChanges, setRatingChanges] = useState<RatingChange[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !handle) return

    const fetchRating = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/codeforces?endpoint=user.rating&handle=${handle}`)
        const data = await res.json()

        if (data.status !== "OK") throw new Error(data.comment || "Failed")
        if (!Array.isArray(data.result)) throw new Error("Invalid data")

        setRatingChanges(data.result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed")
      } finally {
        setLoading(false)
      }
    }

    fetchRating()
  }, [handle, mounted])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || ratingChanges.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <h4 className="font-semibold mb-2">Rating Progression</h4>
        <p className="text-sm text-muted-foreground">
          {error || "No rating history yet. Participate in rated contests to see progress."}
        </p>
      </div>
    )
  }

  const width = 800
  const height = 350
  const pad = 50
  const gw = width - 2 * pad
  const gh = height - 2 * pad

  const ratings = ratingChanges.map((c) => c.newRating)
  const minR = Math.min(...ratings) - 100
  const maxR = Math.max(...ratings) + 100
  const range = maxR - minR

  const points = ratingChanges.map((c, i) => ({
    x: pad + (i / (ratingChanges.length - 1)) * gw,
    y: pad + gh - ((c.newRating - minR) / range) * gh,
    rating: c.newRating,
    name: c.contestName,
    date: mounted ? new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString() : "",
    color: getRatingColor(c.newRating),
  }))

  const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`
  const areaD = `${pathD} L ${points[points.length - 1].x},${pad + gh} L ${points[0].x},${pad + gh} Z`

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Rating Progression</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-primary" />
          {ratingChanges.length} contests
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[800px] mx-auto">
          {[0, 1, 2, 3, 4].map((i) => {
            const y = pad + (i / 4) * gh
            const val = maxR - (i / 4) * range
            return (
              <g key={i}>
                <line x1={pad} y1={y} x2={width - pad} y2={y} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4,4" />
                <text x={pad - 8} y={y + 4} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize="11" fontFamily="monospace">
                  {Math.round(val)}
                </text>
              </g>
            )
          })}

          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={areaD} fill="url(#areaGrad)" />
          <path d={pathD} stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill={p.color} stroke="hsl(var(--card))" strokeWidth="2" />
              <title>{p.name} - {p.rating} ({p.date})</title>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-6">
        <h5 className="text-sm font-medium mb-3">Recent Contests</h5>
        <div className="space-y-2">
          {ratingChanges.slice(-5).reverse().map((c) => {
            const diff = c.newRating - c.oldRating
            return (
              <div key={c.contestId} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium line-clamp-1">{c.contestName}</p>
                  <p className="text-xs text-muted-foreground">
                    {mounted ? new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString() : ""} &middot; Rank #{c.rank}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className={`text-sm font-semibold ${diff > 0 ? "text-green-400" : diff < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                    {diff > 0 ? "+" : ""}{diff}
                  </p>
                  <p className="text-xs text-muted-foreground">{c.newRating}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
