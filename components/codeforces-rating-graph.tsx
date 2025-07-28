"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Calendar } from "lucide-react"

interface RatingChange {
  contestId: number
  contestName: string
  rank: number
  oldRating: number
  newRating: number
  ratingUpdateTimeSeconds: number
}

interface CodeforcesRatingGraphProps {
  handle: string
  isDarkMode: boolean
}

export default function CodeforcesRatingGraph({ handle, isDarkMode }: CodeforcesRatingGraphProps) {
  const [ratingChanges, setRatingChanges] = useState<RatingChange[]>([])
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
    
    const fetchRatingHistory = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/codeforces?endpoint=user.rating&handle=${handle}`)
        const data = await response.json()

        console.log('Rating history response:', data) // Debug log

        if (data.status !== "OK") {
          throw new Error(data.comment || "Failed to fetch rating history")
        }

        if (!data.result || !Array.isArray(data.result)) {
          throw new Error("Invalid rating history data format")
        }

        setRatingChanges(data.result)
        setLastUpdated(new Date())
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch rating history")
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }

    if (handle && mounted) {
      fetchRatingHistory()
      
      // Set up auto-refresh every 5 minutes
      const refreshInterval = setInterval(fetchRatingHistory, 5 * 60 * 1000)
      
      // Cleanup interval on unmount
      return () => clearInterval(refreshInterval)
    }
  }, [handle, mounted])

  const getRatingColor = (rating: number) => {
    if (rating >= 3000) return "#FF0000" // Red
    if (rating >= 2600) return "#FF8C00" // Dark Orange
    if (rating >= 2400) return "#FFA500" // Orange
    if (rating >= 2200) return "#FFD700" // Gold
    if (rating >= 1900) return "#9370DB" // Medium Purple
    if (rating >= 1600) return "#0000FF" // Blue
    if (rating >= 1400) return "#00CED1" // Dark Turquoise
    if (rating >= 1200) return "#008000" // Green
    return "#808080" // Gray
  }

  const getRatingStrokeColor = (rating: number) => {
    if (rating >= 3000) return "#CC0000"
    if (rating >= 2600) return "#CC7000"
    if (rating >= 2400) return "#CC8400"
    if (rating >= 2200) return "#CCAD00"
    if (rating >= 1900) return "#7659B0"
    if (rating >= 1600) return "#0000CC"
    if (rating >= 1400) return "#00A5A7"
    if (rating >= 1200) return "#006600"
    return "#666666"
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
        <p>Error loading rating history: {error}</p>
      </div>
    )
  }

  if (ratingChanges.length === 0) {
    return (
      <Card className={`backdrop-blur-sm ${
        isDarkMode 
          ? "bg-white/5 border-white/10" 
          : "bg-gray-800/5 border-gray-800/10"
      }`}>
        <CardContent className="p-6">
          <div className="text-center">
            <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Rating Progression
            </h4>
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>No rating history available yet</p>
              <p className="text-sm mt-2">Participate in rated contests to see your rating progression here!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for the graph
  const graphData = ratingChanges.map((change, index) => ({
    x: index,
    y: change.newRating,
    contestName: change.contestName,
    date: mounted ? new Date(change.ratingUpdateTimeSeconds * 1000).toLocaleDateString() : '',
    color: getRatingColor(change.newRating)
  }))

  // Calculate graph dimensions
  const width = 800
  const height = 400
  const padding = 40
  const graphWidth = width - 2 * padding
  const graphHeight = height - 2 * padding

  // Find min and max ratings for scaling
  const minRating = Math.min(...graphData.map(d => d.y)) - 100
  const maxRating = Math.max(...graphData.map(d => d.y)) + 100
  const ratingRange = maxRating - minRating

  // Create SVG path for the line
  const createPath = () => {
    if (graphData.length === 0) return ""
    
    const points = graphData.map((point, index) => {
      const x = padding + (index / (graphData.length - 1)) * graphWidth
      const y = padding + graphHeight - ((point.y - minRating) / ratingRange) * graphHeight
      return `${x},${y}`
    })
    
    return `M ${points.join(" L ")}`
  }

  const path = createPath()

  return (
    <Card className={`backdrop-blur-sm ${
      isDarkMode 
        ? "bg-white/5 border-white/10" 
        : "bg-gray-800/5 border-gray-800/10"
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Rating Progression
          </h4>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {ratingChanges.length} contests
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg width={width} height={height} className="mx-auto">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding + (i / 4) * graphHeight
              const rating = maxRating - (i / 4) * ratingRange
              return (
                <g key={i}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke={isDarkMode ? "#374151" : "#E5E7EB"}
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    fill={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  >
                    {Math.round(rating)}
                  </text>
                </g>
              )
            })}

            {/* Rating line */}
            <path
              d={path}
              stroke={isDarkMode ? "#60A5FA" : "#3B82F6"}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {graphData.map((point, index) => {
              const x = padding + (index / (graphData.length - 1)) * graphWidth
              const y = padding + graphHeight - ((point.y - minRating) / ratingRange) * graphHeight
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={point.color}
                    stroke={getRatingStrokeColor(point.y)}
                    strokeWidth="2"
                  />
                  <title>
                    {point.contestName} - Rating: {point.y} ({point.date})
                  </title>
                </g>
              )
            })}

            {/* Axes */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={height - padding}
              stroke={isDarkMode ? "#6B7280" : "#9CA3AF"}
              strokeWidth="2"
            />
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke={isDarkMode ? "#6B7280" : "#9CA3AF"}
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#008000" }}></div>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>1200+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00CED1" }}></div>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>1400+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#0000FF" }}></div>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>1600+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#9370DB" }}></div>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>1900+</span>
          </div>
        </div>

        {/* Recent contests */}
        <div className="mt-6">
          <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Contests
          </h5>
          <div className="space-y-2">
            {ratingChanges.slice(-5).reverse().map((change, index) => (
              <div key={change.contestId} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {change.contestName}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {mounted ? new Date(change.ratingUpdateTimeSeconds * 1000).toLocaleDateString() : ''} • Rank: #{change.rank}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${change.newRating > change.oldRating ? 'text-green-500' : change.newRating < change.oldRating ? 'text-red-500' : 'text-gray-500'}`}>
                    {change.newRating > change.oldRating ? '+' : ''}{change.newRating - change.oldRating}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {change.newRating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 