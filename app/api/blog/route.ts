import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import type { BlogPost } from "@/lib/schema"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")
    const all = searchParams.get("all")
    const sql = getDb()

    if (slug) {
      const posts = await sql`
        SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1
      `
      if (posts.length === 0) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }
      return NextResponse.json(posts[0])
    }

    const showAll = all === "true"
    const posts = showAll
      ? await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`
      : await sql`SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC`

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Blog GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password")
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, excerpt, content, cover_image, tags, published } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      )
    }

    const sql = getDb()
    const result = await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, tags, published)
      VALUES (${title}, ${slug}, ${excerpt || null}, ${content}, ${cover_image || null}, ${tags || []}, ${published || false})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    if (error?.message?.includes("duplicate key")) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      )
    }
    console.error("Blog POST error:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password")
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, slug, excerpt, content, cover_image, tags, published } =
      body

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      )
    }

    const sql = getDb()
    const result = await sql`
      UPDATE blog_posts
      SET title = ${title}, slug = ${slug}, excerpt = ${excerpt || null},
          content = ${content}, cover_image = ${cover_image || null},
          tags = ${tags || []}, published = ${published || false},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Blog PUT error:", error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password")
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      )
    }

    const sql = getDb()
    await sql`DELETE FROM blog_posts WHERE id = ${parseInt(id)}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Blog DELETE error:", error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
