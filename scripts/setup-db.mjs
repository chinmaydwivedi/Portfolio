import { neon } from "@neondatabase/serverless"

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required.")
  console.error("Set it in your .env.local file or pass it directly:")
  console.error("  DATABASE_URL=postgresql://... node scripts/setup-db.mjs")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function setup() {
  console.log("Setting up database tables...\n")

  try {
    const test = await sql`SELECT current_database() as db, current_user as usr`
    console.log("Connected to:", test[0].db, "as", test[0].usr)
  } catch (err) {
    console.error("Connection failed:", err.message)
    process.exit(1)
  }

  console.log("\nCreating tables...")

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image VARCHAR(1000),
      tags TEXT[] DEFAULT ARRAY[]::TEXT[],
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  console.log("  OK: blog_posts")

  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_slug VARCHAR(500),
      author_name VARCHAR(200) NOT NULL,
      author_email VARCHAR(300),
      content TEXT NOT NULL,
      approved BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  console.log("  OK: comments")

  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(300) NOT NULL,
      subject VARCHAR(500),
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  console.log("  OK: contact_messages")

  console.log("\nVerifying tables...")
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `
  console.log("  Tables:", tables.map(t => t.table_name).join(", "))

  console.log("\nInserting sample blog post...")
  const content = `# Welcome to My Blog

This is my first post on the new portfolio site. I'll be writing about:

- **Systems Programming** — low-level adventures in C/C++
- **Competitive Programming** — problem-solving strategies and contest reflections
- **Web Development** — building modern full-stack applications
- **Open Source** — contributions and learnings from the community

## What to Expect

I plan to share deep dives into interesting problems, tutorials on tools I use, and reflections on my journey as a developer.

Stay tuned for more posts!

---

*Thanks for reading. Feel free to leave a comment below.*`

  await sql`
    INSERT INTO blog_posts (title, slug, excerpt, content, tags, published)
    VALUES (
      'Welcome to My Blog',
      'welcome',
      'First post on my new portfolio blog. Excited to share thoughts on systems, competitive programming, and building software.',
      ${content},
      ${["welcome", "introduction"]},
      true
    )
    ON CONFLICT (slug) DO NOTHING
  `
  console.log("  OK: sample post inserted")

  console.log("\nDone! Database is ready.")
}

setup().catch(err => {
  console.error("Setup failed:", err)
  process.exit(1)
})
