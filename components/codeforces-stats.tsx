"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, TrendingUp, Calendar, Award } from "lucide-react"
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
    members: Array<{
      handle: string
    }>
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

interface CodeforcesStats {
  user: CodeforcesUser
  submissions: CodeforcesSubmission[]
  totalProblems: number
  solvedProblems: number
  averageRating: number
  topRating: number
  recentActivity: number
}

interface CodeforcesStatsProps {
  handle: string
  isDarkMode: boolean
}

export default function CodeforcesStats({ handle, isDarkMode }: CodeforcesStatsProps) {
  const [stats, setStats] = useState<CodeforcesStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const fetchCodeforcesData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Add cache busting parameter to ensure fresh data
        const timestamp = Date.now()
        
        // Fetch user info through our API route
        const userResponse = await fetch(`/api/codeforces?endpoint=user.info&handle=${handle}`)
        const userData = await userResponse.json()

        if (userData.status !== "OK") {
          throw new Error(userData.comment || "Failed to fetch user data")
        }

        const user = userData.result[0]

        // Fetch user submissions through our API route
        const submissionsResponse = await fetch(`/api/codeforces?endpoint=user.status&handle=${handle}&count=1000`)
        const submissionsData = await submissionsResponse.json()

        if (submissionsData.status !== "OK") {
          throw new Error(submissionsData.comment || "Failed to fetch submissions")
        }

        const submissions = submissionsData.result

        // Calculate statistics
        const solvedProblems = new Set()
        const problemRatings: number[] = []
        let totalProblems = 0

        submissions.forEach((submission: CodeforcesSubmission) => {
          if (submission.verdict === "OK") {
            const problemKey = `${submission.problem.contestId}${submission.problem.index}`
            if (!solvedProblems.has(problemKey)) {
              solvedProblems.add(problemKey)
              if (submission.problem.rating) {
                problemRatings.push(submission.problem.rating)
              }
            }
          }
          totalProblems++
        })

        const averageRating = problemRatings.length > 0 
          ? Math.round(problemRatings.reduce((a, b) => a + b, 0) / problemRatings.length)
          : 0

        const recentActivity = submissions.filter((sub: CodeforcesSubmission) => {
          const submissionTime = sub.creationTimeSeconds * 1000
          const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
          return submissionTime > thirtyDaysAgo
        }).length

        setStats({
          user,
          submissions,
          totalProblems,
          solvedProblems: solvedProblems.size,
          averageRating,
          topRating: user.maxRating,
          recentActivity
        })
        setLastUpdated(new Date())
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch Codeforces data")
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }

    if (handle && mounted) {
      fetchCodeforcesData()
      
      // Set up auto-refresh every 5 minutes
      const refreshInterval = setInterval(fetchCodeforcesData, 5 * 60 * 1000)
      
      // Cleanup interval on unmount
      return () => clearInterval(refreshInterval)
    }
  }, [handle, mounted])

  const handleManualRefresh = async () => {
    setRefreshing(true)
    try {
      const timestamp = Date.now()
      
      // Fetch user info through our API route
      const userResponse = await fetch(`/api/codeforces?endpoint=user.info&handle=${handle}`)
      const userData = await userResponse.json()

      if (userData.status !== "OK") {
        throw new Error(userData.comment || "Failed to fetch user data")
      }

      const user = userData.result[0]

      // Fetch user submissions through our API route
      const submissionsResponse = await fetch(`/api/codeforces?endpoint=user.status&handle=${handle}&count=1000`)
      const submissionsData = await submissionsResponse.json()

      if (submissionsData.status !== "OK") {
        throw new Error(submissionsData.comment || "Failed to fetch submissions")
      }

      const submissions = submissionsData.result

      // Calculate statistics
      const solvedProblems = new Set()
      const problemRatings: number[] = []
      let totalProblems = 0

      submissions.forEach((submission: CodeforcesSubmission) => {
        if (submission.verdict === "OK") {
          const problemKey = `${submission.problem.contestId}${submission.problem.index}`
          if (!solvedProblems.has(problemKey)) {
            solvedProblems.add(problemKey)
            if (submission.problem.rating) {
              problemRatings.push(submission.problem.rating)
            }
          }
        }
        totalProblems++
      })

      const averageRating = problemRatings.length > 0 
        ? Math.round(problemRatings.reduce((a, b) => a + b, 0) / problemRatings.length)
        : 0

      const recentActivity = submissions.filter((sub: CodeforcesSubmission) => {
        const submissionTime = sub.creationTimeSeconds * 1000
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        return submissionTime > thirtyDaysAgo
      }).length

      setStats({
        user,
        submissions,
        totalProblems,
        solvedProblems: solvedProblems.size,
        averageRating,
        topRating: user.maxRating,
        recentActivity
      })
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data")
    } finally {
      setRefreshing(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 3000) return "text-red-500"
    if (rating >= 2600) return "text-red-400"
    if (rating >= 2400) return "text-orange-500"
    if (rating >= 2200) return "text-yellow-500"
    if (rating >= 1900) return "text-purple-500"
    if (rating >= 1600) return "text-blue-500"
    if (rating >= 1400) return "text-cyan-500"
    if (rating >= 1200) return "text-green-500"
    return "text-gray-500"
  }

  const getRankColor = (rank: string) => {
    if (rank.includes("legendary")) return "text-red-500"
    if (rank.includes("international")) return "text-orange-500"
    if (rank.includes("master")) return "text-yellow-500"
    if (rank.includes("candidate")) return "text-purple-500"
    if (rank.includes("expert")) return "text-blue-500"
    if (rank.includes("specialist")) return "text-cyan-500"
    if (rank.includes("pupil")) return "text-green-500"
    return "text-gray-500"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDarkMode ? 'border-white' : 'border-gray-900'}`}></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
        <p>Error loading Codeforces data: {error}</p>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className={`backdrop-blur-sm ${
          isDarkMode 
            ? "bg-white/5 border-white/10" 
            : "bg-gray-800/5 border-gray-800/10"
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last updated: {mounted && lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                </span>
                {refreshing && (
                  <div className={`animate-spin rounded-full h-3 w-3 border-b-2 ${isDarkMode ? 'border-white' : 'border-gray-900'}`}></div>
                )}
              </div>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 disabled:opacity-50" 
                    : "bg-gray-800/10 text-gray-700 hover:text-gray-900 hover:bg-gray-800/20 disabled:opacity-50"
                }`}
                title="Refresh data"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <img 
                src={stats.user.avatar} 
                alt={stats.user.handle}
                className="w-16 h-16 rounded-full border-2 border-cyan-300/50"
              />
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.user.handle}
                </h3>
                <p className={`text-lg font-semibold ${getRankColor(stats.user.rank)}`}>
                  {stats.user.rank}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Member since {mounted ? new Date(stats.user.registrationTimeSeconds * 1000).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className={`backdrop-blur-sm ${
            isDarkMode 
              ? "bg-white/5 border-white/10" 
              : "bg-gray-800/5 border-gray-800/10"
          }`}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className={`w-6 h-6 ${getRatingColor(stats.user.rating)}`} />
              </div>
              <p className={`text-2xl font-bold ${getRatingColor(stats.user.rating)}`}>
                {stats.user.rating}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Current Rating
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={`backdrop-blur-sm ${
            isDarkMode 
              ? "bg-white/5 border-white/10" 
              : "bg-gray-800/5 border-gray-800/10"
          }`}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className={`w-6 h-6 ${getRatingColor(stats.topRating)}`} />
              </div>
              <p className={`text-2xl font-bold ${getRatingColor(stats.topRating)}`}>
                {stats.topRating}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Max Rating
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className={`backdrop-blur-sm ${
            isDarkMode 
              ? "bg-white/5 border-white/10" 
              : "bg-gray-800/5 border-gray-800/10"
          }`}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-500">
                {stats.solvedProblems}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Problems Solved
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className={`backdrop-blur-sm ${
            isDarkMode 
              ? "bg-white/5 border-white/10" 
              : "bg-gray-800/5 border-gray-800/10"
          }`}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-500">
                {stats.recentActivity}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Recent Activity (30d)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Rating Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <CodeforcesRatingGraph handle={handle} isDarkMode={isDarkMode} />
      </motion.div>
    </div>
  )
} 