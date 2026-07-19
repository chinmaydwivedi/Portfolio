"use client"

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  ArrowUpRight, Check, ChevronRight, Circle, Copy, Github,
  Linkedin, Mail, MapPin, Terminal, X,
} from "lucide-react"
import { personal } from "@/data/personal"
import { projects } from "@/data/projects"
import AsciiRain from "@/components/ascii-rain"

type Command = "home" | "help" | "about" | "activity" | "oss" | "work" | "skills" | "contact" | "resume" | "clear" | "unknown"
type HistoryItem = { id: number; input: string; command: Command }

const commands = [
  ["about", "the human behind the terminal"],
  ["activity", "recent commits and shipped changes"],
  ["oss", "latest open-source contributions"],
  ["work", "selected engineering projects"],
  ["skills", "languages, systems & tools"],
  ["contact", "links and ways to say hello"],
  ["resume", "open résumé in a new tab"],
  ["clear", "clear command history"],
] as const

const contributions = [
  {
    repo: "PrimeIntellect-ai/community-environments",
    pr: "#356",
    state: "OPEN",
    title: "VirtualBox codebase search",
    detail: "+863 lines across 8 files: 630 code-search prompts, environment loader, evaluator, model rollouts, and documentation.",
    href: "https://github.com/PrimeIntellect-ai/community-environments/pull/356",
  },
  {
    repo: "warpdotdev/warp",
    pr: "#12328",
    state: "MERGED",
    title: "Cancel repo metadata tree walks on teardown",
    detail: "Merged lifecycle fix spanning 12 files: abortable async tree walks, stale-generation guards, duplicate-load coalescing, and 127 passing package tests.",
    href: "https://github.com/warpdotdev/warp/pull/12328",
  },
  {
    repo: "monkeytypegame/monkeytype",
    pr: "#7837",
    state: "MERGED",
    title: "Optimize leaderboard counts and PB/log updates",
    detail: "Replaced full leaderboard fetches with MongoDB $count, made personal-best writes atomic, and removed sensitive debug logging.",
    href: "https://github.com/monkeytypegame/monkeytype/pull/7837",
  },
  {
    repo: "lakshasri/veridex-onchain-leaderboard",
    pr: "#1",
    state: "MERGED",
    title: "Add organizer score-correction flow",
    detail: "Added Solidity score correction before finalization, synchronized weighted totals, emitted auditable events, and wired the flow through React and Hardhat tests.",
    href: "https://github.com/lakshasri/veridex-onchain-leaderboard/pull/1",
  },
]

const recentActivity = [
  { date: "JUL 19", repo: "cpboard", hash: "650c5eb", message: "Classify missing provider profiles safely", detail: "Durable backoff for renamed/deleted accounts while preserving genuine provider-outage failures.", href: "https://github.com/chinmaydwivedi/cpboard/commit/650c5eb4" },
  { date: "JUL 19", repo: "cpboard", hash: "3b3e5f5", message: "Fix CodeQL URL and log findings", detail: "Exact HTTPS hosts, bounded parsed identifiers, fixed-format logs, and safer preview deployment rules.", href: "https://github.com/chinmaydwivedi/cpboard/commit/3b3e5f55" },
  { date: "JUL 19", repo: "cpboard", hash: "adc96b7", message: "Harden platform refresh and production security", detail: "Reliability and security pass over the multi-provider scheduled refresh pipeline.", href: "https://github.com/chinmaydwivedi/cpboard/commit/adc96b7f" },
  { date: "JUL 17", repo: "warpdotdev/warp", hash: "PR #12328", message: "Repo metadata cancellation fix merged", detail: "Async traversal cancellation, generation fencing, and concurrent directory-load coalescing.", href: "https://github.com/warpdotdev/warp/pull/12328" },
  { date: "JUN 19", repo: "snippex", hash: "d74a9b2", message: "Ship and polish competitive-programming template archive", detail: "Copy snippets as raw code, VS Code JSON, or Sublime Text XML.", href: "https://github.com/chinmaydwivedi/snippex/commit/d74a9b25" },
  { date: "JUN 17", repo: "skipthat", hash: "480f087", message: "Build privacy-first YouTube filtering extension", detail: "Local rules, focus timers, schedules, allow-only mode, and no accounts or tracking.", href: "https://github.com/chinmaydwivedi/skipthat/commit/480f087c" },
  { date: "JUN 15", repo: "KubeDataGuard", hash: "0c5d2ea", message: "Verify full kind operator runtime path", detail: "Closed-loop data SLO checks across Postgres, Kafka, OpenSearch, Redis, and ClickHouse.", href: "https://github.com/chinmaydwivedi/KubeDataGuard/commit/0c5d2ea5" },
]

const skillGroups = [
  ["languages", ["C++", "Python", "TypeScript", "JavaScript", "Go", "SQL"]],
  ["frontend", ["Next.js", "React", "Tailwind CSS"]],
  ["backend", ["Node.js", "FastAPI", "Prisma", "NextAuth.js"]],
  ["systems", ["Kubernetes", "Docker", "Linux", "Kafka / Redpanda"]],
  ["data", ["PostgreSQL", "OpenSearch", "Redis", "ClickHouse"]],
] as const

function Prompt({ muted = false }: { muted?: boolean }) {
  return <span className={muted ? "cli-prompt muted" : "cli-prompt"}><b>chinmay</b><i>@</i><strong>portfolio</strong><span>:~$</span></span>
}

function HomeOutput({ run }: { run: (command: string) => void }) {
  return <div className="home-output">
    <div className="cli-hero">
      <div>
        <p className="boot-line"><Check /> session initialized · Bengaluru, India</p>
        <pre className="ascii-name" aria-label="Chinmay Dwivedi">{` ██████╗██████╗
██╔════╝██╔══██╗
██║     ██║  ██║
██║     ██║  ██║
╚██████╗██████╔╝
 ╚═════╝╚═════╝`}</pre>
        <h1>Chinmay Dhar Dwivedi<span className="block-cursor" /></h1>
        <p className="role">systems-minded software engineer <span>×</span> open-source contributor</p>
        <p className="intro">I build developer tools, RL evaluation environments, and reliable data systems. Currently studying CSE at PES University and contributing to production open source.</p>
        <div className="hero-meta">
          <span><MapPin /> Bengaluru, IN</span><span className="online"><Circle /> available for interesting work</span>
        </div>
      </div>
      <div className="profile-pane">
        <div className="profile-image"><Image src="/telemetry-ocean.png" alt="Retro oceanographic telemetry with spectral and orbital plots" fill priority /></div>
        <div className="profile-data">
          <p><span>problems_solved</span><b>500+</b></p>
          <p><span>students_mentored</span><b>50+</b></p>
          <p><span>public_repos</span><b>14</b></p>
          <p><span>rl_eval_prompts</span><b>630</b></p>
        </div>
      </div>
    </div>
    <p className="hint">Type a command below or choose a shortcut:</p>
    <div className="command-pills">{commands.slice(0, 6).map(([cmd]) => <button key={cmd} onClick={() => run(cmd)}><ChevronRight /> {cmd}</button>)}</div>
  </div>
}

function HelpOutput({ run }: { run: (command: string) => void }) {
  return <div className="command-output"><p className="output-title">AVAILABLE COMMANDS</p><div className="help-table">
    {commands.map(([cmd, description]) => <button key={cmd} onClick={() => run(cmd)}><code>{cmd}</code><span>{description}</span></button>)}
  </div><p className="output-note">tip: press <kbd>↑</kbd> to recall your last command</p></div>
}

function AboutOutput() {
  return <div className="command-output about-output"><p className="output-title">ABOUT.MD</p>
    <p><span className="line-number">01</span> I&apos;m a Computer Science undergraduate at <b>PES University</b>, graduating in 2027.</p>
    <p><span className="line-number">02</span> My favorite problems live at the intersection of <b>systems, infrastructure, agents, and developer experience.</b></p>
    <p><span className="line-number">03</span> At <b>Prime Intellect</b>, I build training-ready codebase-search environments for LLM agents; most recently I also shipped a repository lifecycle fix to <b>Warp</b>.</p>
    <p><span className="line-number">04</span> As a <b>GDG campus mentor</b>, I&apos;ve helped 50+ students with Git, DSA, and project engineering.</p>
    <p><span className="line-number">05</span> Away from shipping, I sharpen my reasoning through competitive programming—500+ verified problems and counting.</p>
  </div>
}

function ActivityOutput() {
  return <div className="command-output"><p className="output-title">GIT LOG --AUTHOR=CHINMAY --RECENT</p><div className="activity-list">
    {recentActivity.map(item => <a href={item.href} target="_blank" rel="noreferrer" key={`${item.repo}-${item.hash}`}>
      <span className="activity-date">{item.date}</span><span className="activity-node" />
      <div><div className="activity-meta"><code>{item.repo}</code><b>{item.hash}</b></div><h3>{item.message}</h3><p>{item.detail}</p></div><ArrowUpRight />
    </a>)}
  </div></div>
}

function OssOutput() {
  return <div className="command-output"><p className="output-title">FETCHING RECENT PULL REQUESTS... <span className="success">DONE</span></p><div className="pr-list">
    {contributions.map(item => <a href={item.href} target="_blank" rel="noreferrer" key={item.href}>
      <div className="pr-head"><span className={item.state.toLowerCase()}>{item.state}</span><code>{item.repo}</code><b>{item.pr}</b><ArrowUpRight /></div>
      <h3>{item.title}</h3><p>{item.detail}</p>
    </a>)}
  </div></div>
}

function WorkOutput() {
  return <div className="command-output"><p className="output-title">LS ./SELECTED-WORK</p><div className="cli-projects">
    {projects.filter(project => project.featured).map((project, i) => <article key={project.id}>
      <div className="file-head"><span>{String(i + 1).padStart(2, "0")}</span><code>drwxr-xr-x</code><a href={project.repoUrl} target="_blank"><Github /></a></div>
      <h3>./{project.title.toLowerCase().replaceAll(" ", "-")}</h3><p>{project.description}</p>
      <div className="tech-list">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
      <div className="file-links"><a href={project.repoUrl} target="_blank">source ↗</a>{project.liveUrl !== "#" && <a href={project.liveUrl} target="_blank">live ↗</a>}</div>
    </article>)}
  </div></div>
}

function SkillsOutput() {
  return <div className="command-output"><p className="output-title">CAT TOOLKIT.JSON</p><div className="json-output"><span>{"{"}</span>
    {skillGroups.map(([group, skills], index) => <p key={group}><i>&quot;{group}&quot;</i>: [ {skills.map((skill, i) => <span key={skill}>&quot;{skill}&quot;{i < skills.length - 1 ? ", " : ""}</span>)} ]{index < skillGroups.length - 1 ? "," : ""}</p>)}
    <span>{"}"}</span></div>
  </div>
}

function ContactOutput() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${personal.email}`
    }
  }
  return <div className="command-output contact-output"><p className="output-title">CONNECTIONS</p><h2>Let&apos;s build something that matters.</h2><p>Interested in systems, OSS, developer tools, or ambitious engineering problems? My inbox is open.</p>
    <div className="contact-links">
      <div className="contact-email-row"><a href={`mailto:${personal.email}`}><Mail /><span>{personal.email}</span></a><button type="button" onClick={copyEmail}>{copied ? <Check /> : <Copy />} {copied ? "copied" : "copy"}</button></div>
      <a href={personal.github} target="_blank" rel="noreferrer"><Github /><span>github.com/chinmaydwivedi</span><ArrowUpRight /></a>
      <a href={personal.linkedin} target="_blank" rel="noreferrer"><Linkedin /><span>linkedin.com/in/chinmaydwivedii</span><ArrowUpRight /></a>
    </div>
  </div>
}

function Output({ command, input, run }: { command: Command; input: string; run: (command: string) => void }) {
  if (command === "home") return <HomeOutput run={run} />
  if (command === "help") return <HelpOutput run={run} />
  if (command === "about") return <AboutOutput />
  if (command === "activity") return <ActivityOutput />
  if (command === "oss") return <OssOutput />
  if (command === "work") return <WorkOutput />
  if (command === "skills") return <SkillsOutput />
  if (command === "contact") return <ContactOutput />
  if (command === "resume") return <div className="command-output inline-output"><span className="success">✓</span> opening <a href={personal.resumeUrl} target="_blank">chinmay-dwivedi-resume.pdf ↗</a></div>
  return <div className="command-output error-output">zsh: command not found: <b>{input}</b><br />Run <button onClick={() => run("help")}>help</button> to see available commands.</div>
}

export default function Portfolio() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [input, setInput] = useState("")
  const [lastCommand, setLastCommand] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const run = (raw: string) => {
    const value = raw.trim().toLowerCase()
    if (!value) return
    if (value === "clear") { setHistory([]); setInput(""); return }
    const aliases: Record<string, Command> = { home: "home", help: "help", "--help": "help", about: "about", whoami: "about", activity: "activity", recent: "activity", commits: "activity", log: "activity", oss: "oss", contributions: "oss", work: "work", projects: "work", ls: "work", skills: "skills", stack: "skills", contact: "contact", email: "contact", resume: "resume", cv: "resume" }
    const command = aliases[value] || "unknown"
    const id = Date.now()
    setHistory(items => [...items, { id, input: raw, command }])
    setLastCommand(raw); setInput("")
    if (command === "resume") window.open(personal.resumeUrl, "_blank", "noopener,noreferrer")
    setTimeout(() => document.getElementById(`command-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
  }

  const submit = (event: FormEvent) => { event.preventDefault(); run(input) }
  useEffect(() => { inputRef.current?.focus() }, [])

  const focusPrompt = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button, input")) return
    inputRef.current?.focus({ preventScroll: true })
  }

  return <main className="cli-site" onClick={focusPrompt}>
    <div className="terminal-window">
      <header className="terminal-titlebar">
        <div className="window-controls"><span /><span /><span /></div>
        <div className="window-title"><Terminal /> chinmay@portfolio: ~</div>
        <div className="title-status"><i /> ONLINE</div>
      </header>
      <div className="terminal-tabs"><div className="active"><Terminal /> portfolio <X /></div><button aria-label="New terminal">+</button><span>⌘ K &nbsp; command palette</span></div>
      <div className="terminal-content">
        <aside>
          <div className="explorer-head">EXPLORER <span>•••</span></div>
          <p>PORTFOLIO</p>
          <button onClick={() => run("home")}><ChevronRight /> <span className="file-icon ts">TS</span> home.tsx</button>
          <button onClick={() => run("about")}><ChevronRight /> <span className="file-icon md">M↓</span> about.md</button>
          <button onClick={() => run("activity")}><ChevronRight /> <span className="file-icon log">≡</span> activity.log</button>
          <button onClick={() => run("oss")}><ChevronRight /> <span className="file-icon git">⑂</span> oss.log</button>
          <button onClick={() => run("work")}><ChevronRight /> <span className="file-icon js">JS</span> work.json</button>
          <button onClick={() => run("skills")}><ChevronRight /> <span className="file-icon json">{`{}`}</span> skills.json</button>
          <button onClick={() => run("contact")}><ChevronRight /> <span className="file-icon sh">$</span> contact.sh</button>
          <div className="aside-socials"><a href={personal.github} target="_blank"><Github /> GitHub</a><a href={personal.linkedin} target="_blank"><Linkedin /> LinkedIn</a></div>
        </aside>
        <section className="terminal-main">
          <AsciiRain />
          <div className="terminal-scroll">
            <div className="boot-sequence"><span>Last login: {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} on ttys001</span><span>portfolio-cli v2.0.0</span></div>
            <HomeOutput run={run} />
            {history.map(item => <div className="history-item" id={`command-${item.id}`} key={item.id}>
              <div className="entered-command"><Prompt muted /> {item.input}</div>
              <Output command={item.command} input={item.input} run={run} />
            </div>)}
            <form className="command-line" onSubmit={submit}>
              <Prompt /><input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "ArrowUp") { event.preventDefault(); setInput(lastCommand) } }} aria-label="Terminal command" autoComplete="off" spellCheck={false} /><span className="input-cursor" />
            </form>
          </div>
        </section>
      </div>
      <footer className="terminal-statusbar"><div><span>⎇ main*</span><span>↻</span><span>ⓧ 0</span><span>△ 0</span></div><div><span>Ln 1, Col 1</span><span>UTF-8</span><span>{`{}`} TypeScript React</span><span>◉ Go Live</span></div></footer>
    </div>
  </main>
}
