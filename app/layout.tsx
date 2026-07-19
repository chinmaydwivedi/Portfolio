import type { Metadata } from "next"
import { Space_Mono } from "next/font/google"
import "./globals.css"
import { PostHogProvider } from "@/components/posthog-provider"

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Chinmay Dwivedi | Systems-minded Software Engineer",
  description:
    "Chinmay Dwivedi builds developer tools, RL evaluation environments, and reliable distributed systems. Open-source contributor to Warp, Prime Intellect, and Monkeytype.",
  keywords: [
    "Chinmay Dwivedi",
    "Software Developer",
    "Portfolio",
    "Competitive Programming",
    "Open Source",
  ],
  openGraph: {
    title: "Chinmay Dwivedi | Software Developer",
    description: "Building impactful software & solving real-world problems",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${mono.variable}`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
