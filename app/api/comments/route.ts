import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const postSlug = searchParams.get("post_slug")

    if (!postSlug) {
      return NextResponse.json(
        { error: "post_slug is required" },
        { status: 400 }
      )
    }

    const sql = getDb()
    const comments = await sql`
      SELECT id, post_slug, author_name, content, created_at
      FROM comments
      WHERE post_slug = ${postSlug} AND approved = true
      ORDER BY created_at DESC
    `

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Comments GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { post_slug, author_name, author_email, content } = body

    if (!post_slug || !author_name || !content) {
      return NextResponse.json(
        { error: "post_slug, author_name, and content are required" },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Comment is too long (max 2000 characters)" },
        { status: 400 }
      )
    }

    const sql = getDb()
    const result = await sql`
      INSERT INTO comments (post_slug, author_name, author_email, content)
      VALUES (${post_slug}, ${author_name}, ${author_email || null}, ${content})
      RETURNING id, post_slug, author_name, content, created_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Comments POST error:", error)
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    )
  }
}
