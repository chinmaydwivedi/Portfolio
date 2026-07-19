import { NextRequest, NextResponse } from "next/server"

const CODEFORCES_API = "https://codeforces.com/api"
const CACHE_SECONDS = 60 * 60
const PROFILE_REQUEST_GAP_MS = 2_100
const ALLOWED_ENDPOINTS = new Set([
  "profile",
  "user.info",
  "user.rating",
  "user.status",
])

type CodeforcesResponse<T> =
  | { status: "OK"; result: T }
  | { status: "FAILED"; comment?: string }

const responseHeaders = {
  "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
  "X-Content-Type-Options": "nosniff",
}

function pause(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds))
}

async function fetchCodeforces<T>(
  endpoint: "user.info" | "user.rating" | "user.status",
  parameters: Record<string, string>,
): Promise<T> {
  const url = new URL(`${CODEFORCES_API}/${endpoint}`)

  for (const [key, value] of Object.entries(parameters)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "chinmaydwivedi.dev/portfolio",
    },
    next: { revalidate: CACHE_SECONDS },
  })

  if (!response.ok) {
    throw new Error("Codeforces upstream request failed")
  }

  const payload = (await response.json()) as CodeforcesResponse<T>

  if (payload.status !== "OK") {
    throw new Error(payload.comment ?? "Codeforces returned a failed response")
  }

  return payload.result
}

function failedResponse(comment: string, status: number) {
  return NextResponse.json(
    { status: "FAILED", comment },
    { status, headers: responseHeaders },
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const endpoint = searchParams.get("endpoint")
  const handle = searchParams.get("handle")?.trim()

  if (!endpoint || !ALLOWED_ENDPOINTS.has(endpoint)) {
    return failedResponse("Unsupported endpoint", 400)
  }

  if (!handle || !/^[A-Za-z0-9_.-]{3,24}$/.test(handle)) {
    return failedResponse("Invalid Codeforces handle", 400)
  }

  try {
    if (endpoint === "profile") {
      const users = await fetchCodeforces<unknown[]>("user.info", {
        handles: handle,
      })

      // Codeforces permits at most one API call every two seconds.
      await pause(PROFILE_REQUEST_GAP_MS)

      const ratingChanges = await fetchCodeforces<unknown[]>("user.rating", {
        handle,
      })

      return NextResponse.json(
        {
          status: "OK",
          result: {
            user: users[0] ?? null,
            ratingChanges,
            solvedSnapshot: 305,
          },
        },
        { headers: responseHeaders },
      )
    }

    if (endpoint === "user.info") {
      const result = await fetchCodeforces<unknown[]>("user.info", {
        handles: handle,
      })
      return NextResponse.json(
        { status: "OK", result },
        { headers: responseHeaders },
      )
    }

    if (endpoint === "user.rating") {
      const result = await fetchCodeforces<unknown[]>("user.rating", {
        handle,
      })
      return NextResponse.json(
        { status: "OK", result },
        { headers: responseHeaders },
      )
    }

    const requestedCount = Number(searchParams.get("count") ?? 1_000)
    const count = Number.isFinite(requestedCount)
      ? Math.min(Math.max(Math.trunc(requestedCount), 1), 10_000)
      : 1_000
    const result = await fetchCodeforces<unknown[]>("user.status", {
      handle,
      from: "1",
      count: String(count),
    })

    return NextResponse.json(
      { status: "OK", result },
      { headers: responseHeaders },
    )
  } catch {
    return failedResponse("Unable to reach the Codeforces API", 502)
  }
}
