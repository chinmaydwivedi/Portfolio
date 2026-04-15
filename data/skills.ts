export interface Skill {
  name: string
  category: string
}

export const skillCategories = [
  "All",
  "Languages",
  "Frameworks",
  "Tools",
  "Databases",
  "Cloud",
] as const

export const skills: Skill[] = [
  { name: "C", category: "Languages" },
  { name: "C++", category: "Languages" },
  { name: "Python", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "TypeScript", category: "Languages" },
  { name: "SQL", category: "Languages" },
  { name: "HTML/CSS", category: "Languages" },
  { name: "React.js", category: "Frameworks" },
  { name: "Next.js", category: "Frameworks" },
  { name: "Node.js", category: "Frameworks" },
  { name: "Express.js", category: "Frameworks" },
  { name: "FastAPI", category: "Frameworks" },
  { name: "Tailwind CSS", category: "Frameworks" },
  { name: "OpenCV", category: "Tools" },
  { name: "Git", category: "Tools" },
  { name: "Docker", category: "Tools" },
  { name: "VS Code", category: "Tools" },
  { name: "Linux", category: "Tools" },
  { name: "PostgreSQL", category: "Databases" },
  { name: "MongoDB", category: "Databases" },
  { name: "MySQL", category: "Databases" },
  { name: "Redis", category: "Databases" },
  { name: "Vercel", category: "Cloud" },
  { name: "AWS", category: "Cloud" },
  { name: "Cloudflare", category: "Cloud" },
]
