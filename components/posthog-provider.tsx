"use client"

import posthog from "posthog-js"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (key && key !== "phc_your_posthog_key_here") {
      posthog.init(key, {
        api_host: host || "https://us.i.posthog.com",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        persistence: "localStorage+cookie",
      })
    }
  }, [])

  return <>{children}</>
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    posthog.capture(event, properties)
  }
}
