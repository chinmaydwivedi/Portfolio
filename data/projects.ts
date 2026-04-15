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
      "University Competitive Programming Leaderboard tracking progress across Codeforces, LeetCode, AtCoder, and CodeChef. Compete with peers and rise through the ranks.",
    longDescription:
      "A full-stack competitive programming leaderboard platform built for universities. Features multi-platform tracking, university leaderboards, activity heatmaps, and CP rankings. Built with Next.js, TypeScript, and modern web technologies.",
    image: "/cpboard.png",
    technologies: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Vercel"],
    liveUrl: "https://cpboard-three.vercel.app",
    repoUrl: "https://github.com/chinmaydwivedi/cpboard",
    featured: true,
    category: "web",
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
