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
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import StarryBackground from "@/components/starry-background"
import CodeforcesStats from "@/components/codeforces-stats"

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
}

interface Skill {
  name: string;
  darkColor: string;
  lightColor: string;
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
    image: "/gesture-game.png",
    technologies: ["Python", "OpenCV", "Machine Learning"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/gesture-GAMEcontrol",
    featured: true,
  },
  {
    title: "LANoWake (Wake-on-LAN Utility)",
    description: "A simple C program that sends a Wake-on-LAN (WoL) magic packet to remotely power on a PC over the internet or a local network. Includes error handling and supports both Windows and Linux.",
    image: "/wake-on-lan.png",
    technologies: ["C", "Networking", "UDP"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/WAKEoLAN",
    featured: true,
  },
  {
    title: "Algorithm Visualizer",
    description: "A web-based tool for visualizing various sorting and pathfinding algorithms. Features interactive visualizations for Bubble Sort, Quick Sort, Merge Sort, Dijkstra's Algorithm, A* Search, and more.",
    image: "/algorithm-visualizer.png",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "#",
    repoUrl: "https://github.com/chinmaydwivedi/algorithm-visualizer",
    featured: false,
  },
]

const skills: Skill[] = [
  { name: "C", darkColor: "text-orange-400", lightColor: "text-orange-600" },
  { name: "C++", darkColor: "text-blue-400", lightColor: "text-blue-600" },
  { name: "Express.js", darkColor: "text-yellow-400", lightColor: "text-yellow-600" },
  { name: "Node.js", darkColor: "text-purple-400", lightColor: "text-purple-600" },
  { name: "JavaScript", darkColor: "text-yellow-400", lightColor: "text-yellow-600" },
  { name: "TypeScript", darkColor: "text-blue-600", lightColor: "text-blue-700" },
  { name: "React.js", darkColor: "text-cyan-400", lightColor: "text-cyan-600" },
  { name: "Next.js", darkColor: "text-yellow-400", lightColor: "text-yellow-600" },
  { name: "Tailwind", darkColor: "text-cyan-300", lightColor: "text-cyan-600" },
  { name: "MySQL", darkColor: "text-blue-400", lightColor: "text-blue-600" },
  { name: "MongoDB", darkColor: "text-green-400", lightColor: "text-green-600" },
  { name: "Docker", darkColor: "text-blue-400", lightColor: "text-blue-600" },
  { name: "Git", darkColor: "text-red-400", lightColor: "text-red-600" },
]

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Force dark mode on initial load
  useEffect(() => {
    document.documentElement.classList.add("dark")
    console.log('Dark mode class added')
  }, [])

  // Theme management
  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem("theme")
    
    if (savedTheme === "light") {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
      console.log('Light mode set')
    } else {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
      console.log('Dark mode set')
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
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY)
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for fixed navigation
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
      
      setActiveSection(sectionId)
      setIsMenuOpen(false)
    }
  }

  console.log('Current isDarkMode state:', isDarkMode)
  
  return (
    <div className="min-h-screen transition-colors duration-300 relative w-full">
      <StarryBackground isDarkMode={isDarkMode} />
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? isDarkMode ? "bg-black/20 backdrop-blur-md shadow-sm" : "bg-white/20 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
            <motion.div 
              className="cursor-pointer relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("home")}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl font-bold tracking-wider relative z-10 italic">
                <motion.span 
                  className={`bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent ${
                    isDarkMode ? 'drop-shadow-lg' : 'drop-shadow-md'
                  }`}
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  C
                </motion.span>
                <motion.span 
                  className={`bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 bg-clip-text text-transparent ${
                    isDarkMode ? 'drop-shadow-lg' : 'drop-shadow-md'
                  }`}
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  D
                </motion.span>
              </div>
              
              {/* Glowing background effect */}
              <motion.div 
                className={`absolute -inset-2 bg-gradient-to-r from-gray-200/20 via-white/20 to-gray-300/20 rounded-lg blur-md -z-10 ${
                  isDarkMode ? 'opacity-40' : 'opacity-30'
                }`}
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              

            </motion.div>
  
              {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "about", label: "About", icon: User },
                { id: "skills", label: "Skills", icon: Briefcase },
                { id: "codeforces", label: "Codeforces", icon: Trophy },
                { id: "projects", label: "Projects", icon: FolderOpen },
                { id: "contact", label: "Contact", icon: MessageCircle },
              ].map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === id
                      ? isDarkMode ? "bg-white/20 text-white" : "bg-gray-800/20 text-gray-900"
                      : isDarkMode ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-700 hover:text-gray-900 hover:bg-gray-800/10"
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
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20" 
                    : "bg-gray-800/10 text-gray-700 hover:text-gray-900 hover:bg-gray-800/20"
                }`}
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
              className={`md:hidden backdrop-blur-md border-t ${
                isDarkMode 
                  ? "bg-black/20 border-white/10" 
                  : "bg-white/20 border-gray-800/10"
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-2 space-y-2">
                {[
                  { id: "home", label: "Home", icon: Home },
                  { id: "about", label: "About", icon: User },
                  { id: "skills", label: "Skills", icon: Briefcase },
                  { id: "codeforces", label: "Codeforces", icon: Trophy },
                  { id: "projects", label: "Projects", icon: FolderOpen },
                  { id: "contact", label: "Contact", icon: MessageCircle },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-lg transition-colors ${
                      isDarkMode 
                        ? "hover:bg-white/10 text-white" 
                        : "hover:bg-gray-800/10 text-gray-900"
                    }`}
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
      <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-start lg:items-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="space-y-6 text-left">
              <motion.h1
                className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight my-6 whitespace-nowrap mt-8 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                variants={fadeInUp}
              >
                Chinmay Dwivedi
              </motion.h1>
              <motion.p className={`text-xl sm:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} variants={fadeInUp}>
                Software Developer
              </motion.p>
              <motion.p className={`text-lg max-w-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} variants={fadeInUp}>
                Passionate about creating innovative solutions and building impactful software applications.
              </motion.p>

              <motion.div className="flex space-x-4 justify-start" variants={fadeInUp}>
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
                    className={`p-3 rounded-lg transition-colors ${
                      isDarkMode 
                        ? "bg-white/10 hover:bg-white/20" 
                        : "bg-gray-800/10 hover:bg-gray-800/20"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={label}
                  >
                    <Icon className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
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
              className={`flex flex-col items-center space-y-2 transition-colors ${
                isDarkMode 
                  ? "text-gray-400 hover:text-gray-300" 
                  : "text-gray-600 hover:text-gray-700"
              }`}
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
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>About Me</h2>
            <div className={`prose prose-lg mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                className={`flex items-center space-x-2 ${
                  isDarkMode 
                    ? "border-white/20 text-white hover:bg-white/10" 
                    : "border-gray-800/20 text-gray-900 hover:bg-gray-800/10"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>More About Me</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Skills
            </h2>
            <p className={`text-lg text-center mb-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Here are some of the technologies I have been working with recently.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 max-w-6xl mx-auto px-4">
              {skills.map((skill, index) => (
                                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`px-4 py-3 rounded-full border border-cyan-300/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                      isDarkMode 
                        ? "bg-white/5 hover:bg-white/10 shadow-lg hover:shadow-xl" 
                        : "bg-gray-800/5 hover:bg-gray-800/10 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isDarkMode ? skill.darkColor : skill.lightColor} tracking-wide`}>
                      {skill.name}
                    </span>
                  </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Codeforces Section */}
      <section id="codeforces" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Competitive Programming
            </h2>
            <p className={`text-lg text-center mb-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              My journey in competitive programming on Codeforces
            </p>
            <CodeforcesStats handle="chinmaylk99" isDarkMode={isDarkMode} />
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
                  <Card className={`overflow-hidden h-full hover:shadow-xl transition-all duration-300 backdrop-blur-sm ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10" 
                      : "bg-gray-800/5 border-gray-800/10"
                  }`}>
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
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                      <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className={`text-xs ${
                            isDarkMode 
                              ? "bg-white/10 text-gray-300" 
                              : "bg-gray-800/10 text-gray-700"
                          }`}>
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
                          className={`${
                            isDarkMode 
                              ? "border-white/20 text-white hover:bg-white/10" 
                              : "border-gray-800/20 text-gray-900 hover:bg-gray-800/10"
                          }`}
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
            <h2 className={`text-3xl sm:text-4xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Let's Connect</h2>
            <p className={`text-xl mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Interested in collaborating, have a project idea, or just want to chat about tech? Reach out to me anytime!
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Mail, label: "Email", value: "chinmaydhardwivedi@gmail.com", href: "mailto:chinmaydhardwivedi@gmail.com" },
                { icon: Github, label: "GitHub", value: "chinmaydwivedi", href: "https://github.com/chinmaydwivedi" },
                { icon: Linkedin, label: "LinkedIn", value: "Chinmay D. Dwivedi", href: "https://www.linkedin.com/in/chinmay-dhar-dwivedi-955768286/" },
                { icon: Twitter, label: "Twitter", value: "chinmaydwivedii", href: "https://x.com/chinmaydwivedii" },
              ].map(({ icon: Icon, label, value, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  className={`flex flex-col items-center p-6 rounded-lg transition-colors group h-full backdrop-blur-sm ${
                    isDarkMode 
                      ? "bg-white/5 hover:bg-white/10" 
                      : "bg-gray-800/5 hover:bg-gray-800/10"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className={`w-8 h-8 mb-3 transition-colors ${
                    isDarkMode 
                      ? "text-gray-300 group-hover:text-white" 
                      : "text-gray-700 group-hover:text-gray-900"
                  }`} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</h3>
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
      <footer className={`py-8 px-4 sm:px-6 lg:px-8 backdrop-blur-md ${
        isDarkMode 
          ? "bg-black/20 text-white" 
          : "bg-white/20 text-gray-900"
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            © 2025 Chinmay D. Dwivedi. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}


