export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image VARCHAR(1000),
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_slug VARCHAR(500) REFERENCES blog_posts(slug) ON DELETE CASCADE,
  author_name VARCHAR(200) NOT NULL,
  author_email VARCHAR(300),
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(300) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
`

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: number
  post_slug: string
  author_name: string
  author_email: string | null
  content: string
  approved: boolean
  created_at: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}
