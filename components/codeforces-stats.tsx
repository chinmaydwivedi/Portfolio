"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Target, TrendingUp, Calendar } from "lucide-react"
import CodeforcesRatingGraph from "./codeforces-rating-graph"

interface CodeforcesUser {
  handle: string
  rating: number
  maxRating: number
  rank: string
  maxRank: string
  contribution: number
  friendOfCount: number
  titlePhoto: string
  avatar: string
  registrationTimeSeconds: number
  lastOnlineTimeSeconds: number
}

interface CodeforcesSubmission {
  id: number
  contestId: number
  creationTimeSeconds: number
  relativeTimeSeconds: number
  problem: {
    contestId: number
    index: string
    name: string
    type: string
    rating: number
    tags: string[]
  }
  author: {
    contestId: number
    members: Array<{ handle: string }>
    participantType: string
    ghost: boolean
    startTimeSeconds: number
  }
  programmingLanguage: string
  verdict: string
  testset: string
  passedTestCount: number
  timeConsumedMillis: number
  memoryConsumedBytes: number
}

interface Stats {
  user: CodeforcesUser
  submissions: CodeforcesSubmission[]
  totalProblems: number
  solvedProblems: number
  averageRating: number
  topRating: number
  recentActivity: number
}

const getRatingColor = (rating: number) => {
  if (rating >= 2400) return "text-red-400"
  if (rating >= 2200) return "text-yellow-400"
  if (rating >= 1900) return "text-purple-400"
  if (rating >= 1600) return "text-blue-400"
  if (rating >= 1400) return "text-cyan-400"
  if (rating >= 1200) return "text-green-400"
  return "text-muted-foreground"
}

export default function CodeforcesStats({ handle }: { handle: string }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !handle) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [userRes, subsRes] = await Promise.all([
          fetch(`/api/codeforces?endpoint=user.info&handle=${handle}`),
          fetch(`/api/codeforces?endpoint=user.status&handle=${handle}&count=1000`),
        ])

        const userData = await userRes.json()
        const subsData = await subsRes.json()

        if (userData.status !== "OK") throw new Error(userData.comment || "Failed to fetch user data")
        if (subsData.status !== "OK") throw new Error(subsData.comment || "Failed to fetch submissions")

        const user = userData.result[0]
        const submissions = subsData.result

        const solvedSet = new Set<string>()
        const ratings: number[] = []
        let total = 0

        submissions.forEach((sub: CodeforcesSubmission) => {
          if (sub.verdict === "OK") {
            const key = `${sub.problem.contestId}${sub.problem.index}`
            if (!solvedSet.has(key)) {
              solvedSet.add(key)
              if (sub.problem.rating) ratings.push(sub.problem.rating)
            }
          }
          total++
        })

        const avg = ratings.length > 0
          ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
          : 0

        const recent = submissions.filter((s: CodeforcesSubmission) =>
          s.creationTimeSeconds * 1000 > Date.now() - 30 * 86400000
        ).length

        setStats({
          user,
          submissions,
          totalProblems: total,
          solvedProblems: solvedSet.size,
          averageRating: avg,
          topRating: user.maxRating,
          recentActivity: recent,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [handle, mounted])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-4">
          <img
            src={stats.user.avatar}
            alt={stats.user.handle}
            className="w-14 h-14 rounded-full border-2 border-primary/30"
          />
          <div>
            <h3 className="text-lg font-bold">{stats.user.handle}</h3>
            <p className={`font-semibold capitalize ${getRatingColor(stats.user.rating)}`}>
              {stats.user.rank}
            </p>
            <p className="text-xs text-muted-foreground">
              Member since{" "}
              {mounted
                ? new Date(stats.user.registrationTimeSeconds * 1000).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: TrendingUp,
            value: stats.user.rating,
            label: "Current Rating",
            color: getRatingColor(stats.user.rating),
          },
          {
            icon: Trophy,
            value: stats.topRating,
            label: "Max Rating",
            color: getRatingColor(stats.topRating),
          },
          {
            icon: Target,
            value: stats.solvedProblems,
            label: "Solved",
            color: "text-green-400",
          },
          {
            icon: Calendar,
            value: stats.recentActivity,
            label: "30d Activity",
            color: "text-blue-400",
          },
        ].map(({ icon: Icon, value, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="glass rounded-xl p-4 text-center"
          >
            <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <CodeforcesRatingGraph handle={handle} />
      </motion.div>
    </div>
  )
}
