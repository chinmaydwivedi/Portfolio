export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  technologies: string[]
  liveUrl: string
  repoUrl: string
  featured: boolean
  category: "web" | "ml" | "systems" | "tools"
}

export const projects: Project[] = [
  {
    id: "cpboard",
    title: "CPBoard",
    description:
      "A verified multi-university CP platform with four provider lanes, ownership challenges, unified rankings, contest alerts, practice recommendations, and a hardened scheduled-sync pipeline.",
    longDescription:
      "A full-stack competitive programming leaderboard platform built for universities. Features multi-platform tracking, university leaderboards, activity heatmaps, and CP rankings. Built with Next.js, TypeScript, and modern web technologies.",
    image: "/cpboard.png",
    technologies: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma", "NextAuth"],
    liveUrl: "https://cpboard-three.vercel.app",
    repoUrl: "https://github.com/chinmaydwivedi/cpboard",
    featured: true,
    category: "web",
  },
  {
    id: "kubedataguard",
    title: "KubeDataGuard",
    description: "An evidence-first data consistency SLO engine and Go operator that checks Postgres-derived views across Kafka, OpenSearch, Redis, and ClickHouse, then produces durable counterexamples and controlled repairs.",
    image: "/kubedataguard.svg",
    technologies: ["Python", "Go", "Kubernetes", "Kafka", "PostgreSQL"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/KubeDataGuard",
    featured: true,
    category: "systems",
  },
  {
    id: "skipthat",
    title: "Skipthat",
    description: "A privacy-first Manifest V3 extension that filters YouTube locally by keyword, phrase, topic, schedule, and focus timer—with blocklist and allow-only modes and zero tracking.",
    image: "/placeholder.svg",
    technologies: ["JavaScript", "Chrome MV3", "Local Storage", "CSP"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/skipthat",
    featured: true,
    category: "tools",
  },
  {
    id: "snippex",
    title: "Snippex",
    description: "A competitive-programming template archive that exports snippets as raw code, VS Code snippet JSON, or Sublime Text XML.",
    image: "/snippex.svg",
    technologies: ["TypeScript", "React 19", "Vite", "Vercel"],
    liveUrl: "https://snippex-navy.vercel.app",
    repoUrl: "https://github.com/chinmaydwivedi/snippex",
    featured: true,
    category: "tools",
  },
  {
    id: "parking-detection",
    title: "Parking Detection System",
    description:
      "A computer vision application that uses machine learning to detect and monitor parking spaces in real-time. Analyzes video feeds to determine parking availability.",
    image: "/parking-detection.png",
    technologies: ["Python", "OpenCV", "Computer Vision", "Machine Learning"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/Parking-detection",
    featured: false,
    category: "ml",
  },
  {
    id: "gesture-game",
    title: "Gesture Control Game",
    description:
      "An interactive game using gesture recognition to control gameplay. Leverages computer vision and machine learning for real-time gesture detection on macOS.",
    image: "/gesture-game.png",
    technologies: ["Python", "OpenCV", "Machine Learning"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/gesture-GAMEcontrol",
    featured: false,
    category: "ml",
  },
  {
    id: "lanowake",
    title: "LANoWake",
    description:
      "A Wake-on-LAN utility that sends magic packets to remotely power on PCs over the internet or local network. Cross-platform support for Windows and Linux.",
    image: "/wake-on-lan.png",
    technologies: ["C", "Networking", "UDP", "Systems Programming"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/WAKEoLAN",
    featured: false,
    category: "systems",
  },
  {
    id: "algorithm-visualizer",
    title: "Algorithm Visualizer",
    description:
      "A web-based tool for visualizing sorting and pathfinding algorithms. Interactive visualizations for Bubble Sort, Quick Sort, Dijkstra's, A* Search, and more.",
    image: "/algorithm-visualizer.png",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/algorithm-visualizer",
    featured: false,
    category: "web",
  },
  {
    id: "matrix-encryption",
    title: "Matrix Encryption",
    description:
      "A novel cryptographic authentication system using evolving login schemes based on linear matrix transformations over GF(257). Implements SHA-256 for secure code generation.",
    image: "/matrix-encryption.png",
    technologies: ["C++", "JavaScript", "Cryptography", "SHA-256"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/matrix-encryption",
    featured: false,
    category: "systems",
  },
]
