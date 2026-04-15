"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  FileText,
  ExternalLink,
  ChevronDown,
  Send,
  ArrowRight,
  MapPin,
  GraduationCap,
  Code2,
  Trophy,
  BookOpen,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import Navbar from "@/components/navbar"
import CodeforcesStats from "@/components/codeforces-stats"
import InteractiveGraph from "@/components/interactive-graph"
import { projects } from "@/data/projects"
import { skills, skillCategories } from "@/data/skills"
import { personal } from "@/data/personal"
import { trackEvent } from "@/components/posthog-provider"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function AnimatedSection({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode
  id?: string
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.section
      ref={ref}
      id={id}
      className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  )
}

export default function Portfolio() {
  const [activeSkillCategory, setActiveSkillCategory] = useState("All")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [contactStatus, setContactStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle")

  const filteredSkills =
    activeSkillCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeSkillCategory)

  const featuredProjects = projects.filter((p) => p.featured)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactStatus("sending")
    trackEvent("contact_form_submit", { email: contactForm.email })

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      })
      if (res.ok) {
        setContactStatus("sent")
        setContactForm({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setContactStatus("idle"), 4000)
      } else {
        setContactStatus("error")
        setTimeout(() => setContactStatus("idle"), 3000)
      }
    } catch {
      setContactStatus("error")
      setTimeout(() => setContactStatus("idle"), 3000)
    }
  }

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero */}
      <section
        id="home"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-16"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            className="grid lg:grid-cols-5 gap-12 items-center"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeUp} className="lg:col-span-3 space-y-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{personal.location}</span>
                <span className="mx-1 opacity-30">|</span>
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>{personal.university}</span>
              </div>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]"
                variants={fadeUp}
              >
                {personal.name.split(" ")[0]}{" "}
                <span className="gradient-text">
                  {personal.name.split(" ").slice(1).join(" ")}
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground font-medium"
                variants={fadeUp}
              >
                {personal.title}
              </motion.p>

              <motion.p
                className="text-lg text-muted-foreground/80 max-w-xl"
                variants={fadeUp}
              >
                {personal.tagline}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 pt-2"
                variants={fadeUp}
              >
                {[
                  {
                    icon: Mail,
                    href: `mailto:${personal.email}`,
                    label: "Email",
                  },
                  { icon: Github, href: personal.github, label: "GitHub" },
                  {
                    icon: Linkedin,
                    href: personal.linkedin,
                    label: "LinkedIn",
                  },
                  { icon: Twitter, href: personal.twitter, label: "Twitter" },
                  { icon: FileText, href: personal.resumeUrl, label: "CV" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="p-2.5 rounded-lg glass glass-hover transition-all"
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </motion.a>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4 pt-2"
                variants={fadeUp}
              >
                {personal.highlights.map((h) => (
                  <div key={h.label} className="text-center">
                    <p className="text-lg font-bold text-primary">{h.value}</p>
                    <p className="text-xs text-muted-foreground">{h.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="lg:col-span-2 hidden lg:block"
            >
              <div className="w-full h-[380px]">
                <InteractiveGraph />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.a
              href="#about"
              className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-xs">Scroll</span>
              <ChevronDown className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <AnimatedSection id="about">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="About Me" />
          <div className="space-y-4">
            {personal.about.map((paragraph, i) => (
              <motion.p
                key={i}
                className="text-muted-foreground leading-relaxed text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Codeforces */}
      <AnimatedSection id="codeforces">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Competitive Programming"
            subtitle="My journey on Codeforces"
          />
          <CodeforcesStats handle={personal.codeforcesHandle} />
        </div>
      </AnimatedSection>

      {/* Projects */}
      <AnimatedSection id="projects">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Featured Projects"
            subtitle="Things I've built recently"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <div className="glass rounded-xl overflow-hidden h-full hover:border-primary/30 transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={600}
                      height={340}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {project.liveUrl !== "#" && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        Source
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Skills */}
      <AnimatedSection id="skills">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="Skills"
            subtitle="Technologies I work with regularly"
          />

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {skillCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveSkillCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeSkillCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "glass glass-hover text-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            layout
          >
            {filteredSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className="px-4 py-2 rounded-full glass glass-hover text-sm font-medium text-foreground/80 cursor-default"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {skill.name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Blog Teaser */}
      <AnimatedSection id="blog-teaser">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading
            title="Blog"
            subtitle="Thoughts, tutorials, and deep dives"
          />
          <Link href="/blog">
            <motion.div
              className="glass glass-hover rounded-xl p-8 cursor-pointer group"
              whileHover={{ scale: 1.01 }}
            >
              <BookOpen className="w-10 h-10 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                I write about systems, competitive programming, and building
                software. Check out my latest posts.
              </p>
              <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                Read the blog
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.div>
          </Link>
        </div>
      </AnimatedSection>

      {/* Contact */}
      <AnimatedSection id="contact">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Get In Touch"
            subtitle="Have a project idea or just want to chat? Drop me a message."
          />

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: personal.email,
                    href: `mailto:${personal.email}`,
                  },
                  {
                    icon: Github,
                    label: "GitHub",
                    value: "chinmaydwivedi",
                    href: personal.github,
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    value: "Chinmay Dwivedi",
                    href: personal.linkedin,
                  },
                  {
                    icon: Twitter,
                    label: "Twitter",
                    value: "@chinmaydwivedii",
                    href: personal.twitter,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center gap-3 p-3 rounded-lg glass glass-hover transition-all group"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleContactSubmit}
              className="md:col-span-3 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg glass border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-transparent text-sm placeholder:text-muted-foreground/50 outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg glass border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-transparent text-sm placeholder:text-muted-foreground/50 outline-none transition-all"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg glass border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-transparent text-sm placeholder:text-muted-foreground/50 outline-none transition-all"
              />
              <textarea
                placeholder="Your message..."
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg glass border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-transparent text-sm placeholder:text-muted-foreground/50 outline-none transition-all resize-none"
              />
              <button
                type="submit"
                disabled={contactStatus === "sending"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {contactStatus === "sending" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : contactStatus === "sent" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Message Sent
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
              {contactStatus === "error" && (
                <p className="text-destructive text-sm text-center">
                  Failed to send. Please try again or email directly.
                </p>
              )}
            </form>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 className="w-4 h-4 text-primary" />
            <span>
              &copy; {new Date().getFullYear()} {personal.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: personal.github },
              { icon: Linkedin, href: personal.linkedin },
              { icon: Twitter, href: personal.twitter },
              { icon: Mail, href: `mailto:${personal.email}` },
            ].map(({ icon: Icon, href }) => (
              <a
                key={href}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
