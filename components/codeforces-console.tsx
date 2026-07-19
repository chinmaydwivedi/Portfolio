"use client"

import { useEffect, useMemo, useState } from "react"

const HANDLE = "chinmaylk99"

interface CodeforcesUser {
  handle: string
  firstName?: string
  lastName?: string
  country?: string
  city?: string
  organization?: string
  rating: number
  rank: string
  maxRating: number
  maxRank: string
}

interface RatingChange {
  contestId: number
  contestName: string
  handle: string
  rank: number
  ratingUpdateTimeSeconds: number
  oldRating: number
  newRating: number
}

interface ProfileResult {
  user: CodeforcesUser
  ratingChanges: RatingChange[]
  solvedSnapshot: number
}

interface ProfileResponse {
  status: "OK" | "FAILED"
  result?: ProfileResult
  comment?: string
}

const snapshot: ProfileResult = {
  user: {
    handle: HANDLE,
    firstName: "chinmay",
    lastName: "dwivedi",
    country: "India",
    city: "Bengaluru",
    organization: "PES University",
    rating: 1054,
    rank: "newbie",
    maxRating: 1106,
    maxRank: "newbie",
  },
  solvedSnapshot: 305,
  ratingChanges: [
    { contestId: 2091, contestName: "Codeforces Round 1013 (Div. 3)", handle: HANDLE, rank: 18820, ratingUpdateTimeSeconds: 1742921400, oldRating: 0, newRating: 388 },
    { contestId: 2113, contestName: "Codeforces Round 1031 (Div. 2)", handle: HANDLE, rank: 7277, ratingUpdateTimeSeconds: 1749985500, oldRating: 388, newRating: 670 },
    { contestId: 2123, contestName: "Codeforces Round 1034 (Div. 3)", handle: HANDLE, rank: 22634, ratingUpdateTimeSeconds: 1751388600, oldRating: 670, newRating: 792 },
    { contestId: 2126, contestName: "Codeforces Round 1037 (Div. 3)", handle: HANDLE, rank: 22438, ratingUpdateTimeSeconds: 1752771000, oldRating: 792, newRating: 841 },
    { contestId: 2122, contestName: "Order Capital Round 1 (Codeforces Round 1038, Div. 1 + Div. 2)", handle: HANDLE, rank: 12102, ratingUpdateTimeSeconds: 1752943800, oldRating: 841, newRating: 846 },
    { contestId: 2125, contestName: "Educational Codeforces Round 181 (Rated for Div. 2)", handle: HANDLE, rank: 17380, ratingUpdateTimeSeconds: 1753202100, oldRating: 846, newRating: 796 },
    { contestId: 2131, contestName: "Codeforces Round 1042 (Div. 3)", handle: HANDLE, rank: 19980, ratingUpdateTimeSeconds: 1754844600, oldRating: 796, newRating: 760 },
    { contestId: 2132, contestName: "Codeforces Round 1043 (Div. 3)", handle: HANDLE, rank: 13867, ratingUpdateTimeSeconds: 1755795000, oldRating: 760, newRating: 837 },
    { contestId: 2133, contestName: "Codeforces Round 1044 (Div. 2)", handle: HANDLE, rank: 17272, ratingUpdateTimeSeconds: 1756053300, oldRating: 837, newRating: 788 },
    { contestId: 2137, contestName: "Codeforces Round 1047 (Div. 3)", handle: HANDLE, rank: 6967, ratingUpdateTimeSeconds: 1757263800, oldRating: 788, newRating: 929 },
    { contestId: 2148, contestName: "Codeforces Round 1050 (Div. 4)", handle: HANDLE, rank: 7008, ratingUpdateTimeSeconds: 1757782200, oldRating: 929, newRating: 982 },
    { contestId: 2162, contestName: "Codeforces Round 1059 (Div. 3)", handle: HANDLE, rank: 16740, ratingUpdateTimeSeconds: 1760719800, oldRating: 982, newRating: 932 },
    { contestId: 2167, contestName: "Codeforces Round 1062 (Div. 4)", handle: HANDLE, rank: 4987, ratingUpdateTimeSeconds: 1761670200, oldRating: 932, newRating: 1043 },
    { contestId: 2179, contestName: "Codeforces Round 1071 (Div. 3)", handle: HANDLE, rank: 13510, ratingUpdateTimeSeconds: 1766510100, oldRating: 1043, newRating: 1027 },
    { contestId: 2185, contestName: "Codeforces Round 1074 (Div. 4)", handle: HANDLE, rank: 4783, ratingUpdateTimeSeconds: 1768755000, oldRating: 1027, newRating: 1106 },
    { contestId: 2193, contestName: "Codeforces Round 1076 (Div. 3)", handle: HANDLE, rank: 16720, ratingUpdateTimeSeconds: 1769359800, oldRating: 1106, newRating: 1058 },
    { contestId: 2218, contestName: "Codeforces Round 1090 (Div. 4)", handle: HANDLE, rank: 5632, ratingUpdateTimeSeconds: 1775321400, oldRating: 1058, newRating: 1099 },
    { contestId: 2244, contestName: "Codeforces Round 1109 (Div. 3)", handle: HANDLE, rank: 12934, ratingUpdateTimeSeconds: 1784047800, oldRating: 1099, newRating: 1054 },
  ],
}

const chart = {
  width: 900,
  height: 320,
  left: 64,
  right: 24,
  top: 28,
  bottom: 52,
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(timestamp * 1000))
}

function RatingGraph({ changes }: { changes: RatingChange[] }) {
  const plot = useMemo(() => {
    const width = chart.width - chart.left - chart.right
    const height = chart.height - chart.top - chart.bottom
    const timestamps = changes.map((change) => change.ratingUpdateTimeSeconds)
    const ratings = changes.map((change) => change.newRating)
    const minTime = Math.min(...timestamps)
    const maxTime = Math.max(...timestamps)
    const minRating = Math.floor((Math.min(...ratings) - 80) / 100) * 100
    const maxRating = Math.ceil((Math.max(...ratings) + 80) / 100) * 100
    const timeSpan = Math.max(maxTime - minTime, 1)
    const ratingSpan = Math.max(maxRating - minRating, 1)

    const points = changes.map((change) => ({
      ...change,
      x: chart.left + ((change.ratingUpdateTimeSeconds - minTime) / timeSpan) * width,
      y: chart.top + ((maxRating - change.newRating) / ratingSpan) * height,
    }))

    const yTicks = Array.from(
      { length: (maxRating - minRating) / 200 + 1 },
      (_, index) => minRating + index * 200,
    )
    const xTicks = [0, Math.floor((changes.length - 1) / 2), changes.length - 1]

    return {
      points,
      yTicks,
      xTicks,
      minRating,
      maxRating,
      height,
      path: points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "),
    }
  }, [changes])

  return (
    <div className="cf-chart-shell">
      <svg
        className="cf-chart"
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        role="img"
        aria-labelledby="cf-chart-title cf-chart-description"
      >
        <title id="cf-chart-title">Codeforces rating history</title>
        <desc id="cf-chart-description">
          Rating across {changes.length} rated contests, from {changes[0].newRating} to {changes.at(-1)?.newRating}, with a peak of {Math.max(...changes.map((change) => change.newRating))}.
        </desc>

        {plot.yTicks.map((rating) => {
          const y = chart.top + ((plot.maxRating - rating) / (plot.maxRating - plot.minRating)) * plot.height
          return (
            <g className="cf-chart-grid" key={rating}>
              <line x1={chart.left} x2={chart.width - chart.right} y1={y} y2={y} stroke="currentColor" />
              <text className="cf-chart-axis-label" x={chart.left - 12} y={y + 4} textAnchor="end" fill="currentColor">
                {rating}
              </text>
            </g>
          )
        })}

        {plot.xTicks.map((index) => {
          const point = plot.points[index]
          return (
            <text
              className="cf-chart-axis-label"
              key={`${point.contestId}-date`}
              x={point.x}
              y={chart.height - 18}
              textAnchor={index === 0 ? "start" : index === changes.length - 1 ? "end" : "middle"}
              fill="currentColor"
            >
              {formatDate(point.ratingUpdateTimeSeconds)}
            </text>
          )
        })}

        <path className="cf-chart-line" d={plot.path} fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />

        {plot.points.map((point) => (
          <a
            className="cf-chart-point-link"
            href={`https://codeforces.com/contest/${point.contestId}`}
            target="_blank"
            rel="noreferrer"
            key={point.contestId}
            aria-label={`${point.contestName}: rating ${point.newRating}, rank ${point.rank}`}
          >
            <circle className="cf-chart-point" cx={point.x} cy={point.y} r="5" fill="currentColor" tabIndex={0}>
              <title>{`${formatDate(point.ratingUpdateTimeSeconds)} · ${point.contestName} · rating ${point.newRating} · rank ${point.rank}`}</title>
            </circle>
          </a>
        ))}
      </svg>
    </div>
  )
}

export default function CodeforcesConsole({ handle = HANDLE }: { handle?: string }) {
  const [profile, setProfile] = useState<ProfileResult>(snapshot)
  const [source, setSource] = useState<"loading" | "live" | "snapshot">("loading")

  useEffect(() => {
    const controller = new AbortController()
    setSource("loading")

    async function loadProfile() {
      try {
        const response = await fetch(
          `/api/codeforces?endpoint=profile&handle=${encodeURIComponent(handle)}`,
          { signal: controller.signal },
        )
        const payload = (await response.json()) as ProfileResponse

        if (
          !response.ok ||
          payload.status !== "OK" ||
          !payload.result?.user ||
          !Array.isArray(payload.result.ratingChanges) ||
          payload.result.ratingChanges.length === 0
        ) {
          throw new Error(payload.comment ?? "Codeforces profile unavailable")
        }

        setProfile({
          ...payload.result,
          solvedSnapshot: Number.isFinite(payload.result.solvedSnapshot)
            ? payload.result.solvedSnapshot
            : snapshot.solvedSnapshot,
        })
        setSource("live")
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setSource("snapshot")
      }
    }

    loadProfile()
    return () => controller.abort()
  }, [handle])

  const recentChanges = profile.ratingChanges.slice(-5).reverse()
  const contestCount = profile.ratingChanges.length

  return (
    <section className="cf-console" aria-labelledby="cf-console-title">
      <header className="cf-console-header">
        <div className="cf-console-heading">
          <p className="cf-command-line" aria-hidden="true">
            <span className="cf-command-prompt">$</span> codeforces inspect {handle} --rating-history
          </p>
          <h3 className="cf-console-title" id="cf-console-title">{profile.user.handle}</h3>
          <p className="cf-console-subtitle">
            Verified public contest history from Codeforces. No profile image loaded.
          </p>
        </div>
        <a className="cf-profile-link" href={`https://codeforces.com/profile/${handle}`} target="_blank" rel="noreferrer">
          codeforces.com/{handle} <span className="cf-profile-link-arrow" aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="cf-fetch-state" role="status" aria-live="polite">
        <span className="cf-fetch-label">FETCHING PROFILE...</span>
        <span className={`cf-fetch-value cf-fetch-value-${source}`}>
          {source === "loading" ? "SYNCING" : source === "live" ? "LIVE" : "VERIFIED SNAPSHOT"}
        </span>
      </div>

      <dl className="cf-stats-grid">
        <div className="cf-stat">
          <dt className="cf-stat-label">CURRENT_RATING</dt>
          <dd className="cf-stat-value">{profile.user.rating}</dd>
        </div>
        <div className="cf-stat">
          <dt className="cf-stat-label">RANK</dt>
          <dd className="cf-stat-value cf-stat-value-rank">{profile.user.rank}</dd>
        </div>
        <div className="cf-stat">
          <dt className="cf-stat-label">MAX_RATING</dt>
          <dd className="cf-stat-value">{profile.user.maxRating}</dd>
        </div>
        <div className="cf-stat">
          <dt className="cf-stat-label">RATED_CONTESTS</dt>
          <dd className="cf-stat-value">{contestCount}</dd>
        </div>
        <div className="cf-stat">
          <dt className="cf-stat-label">PROBLEMS_SOLVED</dt>
          <dd className="cf-stat-value">{profile.solvedSnapshot}</dd>
        </div>
      </dl>

      <div className="cf-graph-panel">
        <div className="cf-panel-heading">
          <span className="cf-panel-title">RATING_TRAJECTORY</span>
          <span className="cf-panel-meta">PEAK {profile.user.maxRating}</span>
        </div>
        <RatingGraph changes={profile.ratingChanges} />
      </div>

      <div className="cf-contests-panel">
        <div className="cf-panel-heading">
          <span className="cf-panel-title">RECENT_RATED_CONTESTS</span>
          <span className="cf-panel-meta">LAST 5</span>
        </div>
        <div className="cf-contest-table" role="table" aria-label="Five most recent rated Codeforces contests">
          <div className="cf-contest-row cf-contest-row-header" role="row">
            <span className="cf-contest-cell cf-contest-date" role="columnheader">DATE</span>
            <span className="cf-contest-cell cf-contest-name" role="columnheader">CONTEST</span>
            <span className="cf-contest-cell cf-contest-rank" role="columnheader">RANK</span>
            <span className="cf-contest-cell cf-contest-delta" role="columnheader">DELTA</span>
            <span className="cf-contest-cell cf-contest-rating" role="columnheader">RATING</span>
          </div>
          {recentChanges.map((change) => {
            const delta = change.newRating - change.oldRating
            return (
              <a
                className="cf-contest-row cf-contest-row-data"
                href={`https://codeforces.com/contest/${change.contestId}`}
                target="_blank"
                rel="noreferrer"
                role="row"
                key={change.contestId}
              >
                <span className="cf-contest-cell cf-contest-date" role="cell">{formatDate(change.ratingUpdateTimeSeconds)}</span>
                <span className="cf-contest-cell cf-contest-name" role="cell">{change.contestName}</span>
                <span className="cf-contest-cell cf-contest-rank" role="cell">#{change.rank}</span>
                <span className={`cf-contest-cell cf-contest-delta cf-contest-delta-${delta >= 0 ? "up" : "down"}`} role="cell">
                  {delta >= 0 ? "+" : ""}{delta}
                </span>
                <span className="cf-contest-cell cf-contest-rating" role="cell">{change.newRating}</span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
