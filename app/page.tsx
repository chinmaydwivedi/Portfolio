"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  User,
  Briefcase,
  FolderOpen,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  Mail,
  Github,
  Linkedin,
  Twitter,
  FileText,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  logo: string;
  current: boolean;
  highlighted?: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const projects: Project[] = [
  {
    title: "Gesture Control Game (For MAC)",
    description: "A fun and interactive game that uses gesture recognition to control gameplay. Leverages computer vision and machine learning techniques to recognize and respond to gestures in real-time.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Python", "OpenCV", "Machine Learning"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/gesture-GAMEcontrol",
    featured: true,
  },
  {
    title: "LANoWake (Wake-on-LAN Utility)",
    description: "A simple C program that sends a Wake-on-LAN (WoL) magic packet to remotely power on a PC over the internet or a local network. Includes error handling and supports both Windows and Linux.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["C", "Networking", "UDP"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/WAKEoLAN",
    featured: true,
  },
  {
    title: "Algorithm Visualizer",
    description: "A web-based tool for visualizing various sorting and pathfinding algorithms. Features interactive visualizations for Bubble Sort, Quick Sort, Merge Sort, Dijkstra's Algorithm, A* Search, and more.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/algorithm-visualizer",
    featured: false,
  },
]

const experiences: Experience[] = [
  // Experiences will be added later
]

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Theme management
  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800/20"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div className="text-xl font-bold text-gray-900 dark:text-white" whileHover={{ scale: 1.05 }}>
              Chinmay Dhar Dwivedi
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "about", label: "About", icon: User },
                { id: "experience", label: "Experience", icon: Briefcase },
                { id: "projects", label: "Projects", icon: FolderOpen },
                { id: "contact", label: "Contact", icon: MessageCircle },
              ].map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === id
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </motion.button>
              ))}

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-2 space-y-2">
                {[
                  { id: "home", label: "Home", icon: Home },
                  { id: "about", label: "About", icon: User },
                  { id: "experience", label: "Experience", icon: Briefcase },
                  { id: "projects", label: "Projects", icon: FolderOpen },
                  { id: "contact", label: "Contact", icon: MessageCircle },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white"
                variants={fadeInUp}
              >
                Chinmay Dhar Dwivedi
              </motion.h1>
              <motion.p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300" variants={fadeInUp}>
                Software Developer
              </motion.p>
              <motion.p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl" variants={fadeInUp}>
                Passionate about creating innovative solutions and building impactful software applications.
              </motion.p>

              <motion.div className="flex space-x-4" variants={fadeInUp}>
                {[
                  { icon: Mail, href: "mailto:your.email@example.com", label: "Email" },
                  { icon: Github, href: "https://github.com/chinmaydwivedi", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/chinmay-dhar-dwivedi-955768286/", label: "LinkedIn" },
                  { icon: Twitter, href: "https://x.com/chinmaydwivedii", label: "Twitter" },
                  { icon: FileText, href: "#", label: "CV" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-end">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/profile.png"
                  alt="Chinmay D. Dwivedi"
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-2xl dark:shadow-gray-900/50"
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.button
              onClick={() => scrollToSection("about")}
              className="flex flex-col items-center space-y-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <span className="text-sm">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">About Me</h2>
            <div className="prose prose-lg mx-auto text-gray-600 dark:text-gray-300 dark:prose-invert">
              <p>
                I am a software developer passionate about creating innovative solutions and building impactful applications.
                My focus is on delivering high-quality, user-friendly software that solves real-world problems.
              </p>
              <p>
                With a strong foundation in modern web technologies and a keen eye for detail, I strive to create
                applications that are both functional and aesthetically pleasing. I believe in writing clean, maintainable
                code and following best practices in software development.
              </p>
              <p>
                When I'm not coding, I enjoy learning about new technologies, contributing to open-source projects,
                and sharing knowledge with the developer community.
              </p>
            </div>

            <motion.div className="flex justify-center mt-8" whileHover={{ scale: 1.05 }}>
              <Button
                variant="outline"
                className="flex items-center space-x-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <FileText className="w-4 h-4" />
                <span>More About Me</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Work Experience
            </h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className={`p-6 dark:bg-gray-800 dark:border-gray-700 ${
                      exp.highlighted ? "ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50/50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{exp.logo}</div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.company}</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300">{exp.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</p>
                          <Badge variant={exp.current ? "default" : "secondary"} className="mt-1">
                            {exp.location}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="overflow-hidden h-full hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                    <div className="relative overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {project.featured && <Badge className="absolute top-4 left-4">Featured</Badge>}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-4">
                        <Button size="sm" asChild>
                          <Link href={project.liveUrl} className="flex items-center space-x-2">
                            <ExternalLink className="w-4 h-4" />
                            <span>Live Demo</span>
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <Link href={project.repoUrl} className="flex items-center space-x-2">
                            <Github className="w-4 h-4" />
                            <span>Code</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 dark:text-white">Let's Connect</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Interested in collaborating, have a project idea, or just want to chat about tech? Reach out to me anytime!
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Mail, label: "Email", value: "chinmaydhardwivedi@gmail.com", href: "mailto:chinmaydhardwivedi@gmail.com" },
                { icon: Github, label: "GitHub", value: "@chinmaydwivedi", href: "https://github.com/chinmaydwivedi" },
                { icon: Linkedin, label: "LinkedIn", value: "Chinmay D. Dwivedi", href: "https://www.linkedin.com/in/chinmay-dhar-dwivedi-955768286/" },
                { icon: Twitter, label: "Twitter", value: "@chinmaydwivedii", href: "https://x.com/chinmaydwivedii" },
              ].map(({ icon: Icon, label, value, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-8 h-8 mb-3 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">{label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap text-center w-full max-w-full overflow-x-auto">{value}</p>
                </motion.a>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button size="lg" className="px-8 py-3" asChild>
                <a href="mailto:chinmaydwivedi.official@gmail.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Get In Touch
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-500">
            © 2025 Chinmay D. Dwivedi. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}
