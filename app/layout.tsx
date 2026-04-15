import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PostHogProvider } from "@/components/posthog-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Chinmay Dwivedi | Software Developer",
  description:
    "Portfolio of Chinmay Dwivedi — Software Developer, Competitive Programmer, and Open Source Contributor. Building impactful software solutions.",
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
      <body className={`${inter.variable} font-sans antialiased noise-bg`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
