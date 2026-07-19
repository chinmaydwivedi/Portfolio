import Image from "next/image"
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Radio,
} from "lucide-react"
import AsciiRain from "@/components/ascii-rain"
import CodeforcesConsole from "@/components/codeforces-console"
import CommandConsole from "@/components/command-console"
import { personal } from "@/data/personal"
import { projects } from "@/data/projects"

const contributions = [
  {
    repo: "PrimeIntellect-ai/community-environments",
    pr: "#356",
    state: "OPEN",
    title: "VirtualBox codebase-search environment",
    detail: "630 search prompts, an environment loader, evaluator, model rollouts, and documentation across eight files.",
    href: "https://github.com/PrimeIntellect-ai/community-environments/pull/356",
  },
  {
    repo: "warpdotdev/warp",
    pr: "#12328",
    state: "MERGED",
    title: "Cancellable repository metadata walks",
    detail: "Abortable async traversal, stale-generation guards, duplicate-load coalescing, and 127 passing package tests.",
    href: "https://github.com/warpdotdev/warp/pull/12328",
  },
  {
    repo: "monkeytypegame/monkeytype",
    pr: "#7837",
    state: "MERGED",
    title: "Faster leaderboard counts and atomic PB writes",
    detail: "Replaced full leaderboard fetches with MongoDB counts, made personal-best updates atomic, and removed sensitive logs.",
    href: "https://github.com/monkeytypegame/monkeytype/pull/7837",
  },
]

const recentActivity = [
  { date: "JUL 19", repo: "cpboard", hash: "650c5eb", message: "Classify missing provider profiles safely", href: "https://github.com/chinmaydwivedi/cpboard/commit/650c5eb4" },
  { date: "JUL 19", repo: "cpboard", hash: "3b3e5f5", message: "Fix CodeQL URL parsing and log findings", href: "https://github.com/chinmaydwivedi/cpboard/commit/3b3e5f55" },
  { date: "JUL 19", repo: "cpboard", hash: "adc96b7", message: "Harden platform refresh and production security", href: "https://github.com/chinmaydwivedi/cpboard/commit/adc96b7f" },
  { date: "JUL 17", repo: "warpdotdev/warp", hash: "PR #12328", message: "Repository metadata cancellation fix merged", href: "https://github.com/warpdotdev/warp/pull/12328" },
  { date: "JUN 19", repo: "snippex", hash: "d74a9b2", message: "Ship and polish template archive exports", href: "https://github.com/chinmaydwivedi/snippex/commit/d74a9b25" },
  { date: "JUN 17", repo: "skipthat", hash: "480f087", message: "Build privacy-first YouTube filtering extension", href: "https://github.com/chinmaydwivedi/skipthat/commit/480f087c" },
  { date: "JUN 15", repo: "KubeDataGuard", hash: "0c5d2ea", message: "Verify the complete kind operator runtime path", href: "https://github.com/chinmaydwivedi/KubeDataGuard/commit/0c5d2ea5" },
]

const runMeta: Record<string, { status: string; signal: string; result: string; segments: number }> = {
  cpboard: { status: "DEPLOYED", signal: "4 provider lanes", result: "scheduled sync", segments: 8 },
  kubedataguard: { status: "VERIFIED", signal: "5 data stores", result: "closed loop", segments: 7 },
  skipthat: { status: "SHIPPED", signal: "local-only", result: "zero tracking", segments: 8 },
  snippex: { status: "LIVE", signal: "3 export formats", result: "browser ready", segments: 8 },
}

const capabilities = [
  ["LANGUAGES", "C++ · Python · TypeScript · Go · SQL"],
  ["SYSTEMS", "Kubernetes · Docker · Linux · Kafka"],
  ["DATA", "PostgreSQL · OpenSearch · Redis · ClickHouse"],
  ["WEB", "Next.js · React · FastAPI · Prisma"],
]

function ExternalArrow() {
  return <ArrowUpRight aria-hidden="true" />
}

export default function Portfolio() {
  const featuredProjects = projects.filter((project) => project.featured)

  return (
    <main className="portfolio-site" id="top">
      <AsciiRain />
      <div className="noise-layer" aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Chinmay Dwivedi — back to top">
          <span>CHINMAY</span>
          <span>DWIVEDI</span>
        </a>
        <p className="header-descriptor">PORTFOLIO CLI<br />SESSION ONLINE</p>
        <nav aria-label="Primary navigation">
          <a href="#work">./WORK</a>
          <a href="#oss">./OSS</a>
          <a href="#codeforces">./CF</a>
          <a href="#log">./LOG</a>
          <a href="#contact">./CONTACT</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse-dot" /> $ WHOAMI --LOCATION=BENGALURU</p>
          <h1 id="hero-title">Systems that<br />stay correct<br /><em>under pressure.</em></h1>
          <p className="hero-intro">
            I&apos;m Chinmay Dwivedi—a systems-minded software engineer building developer tools,
            RL evaluation environments, and reliable distributed systems.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#work">RUN: LS ./WORK <ArrowDownRight /></a>
            <a className="text-action" href={personal.resumeUrl} target="_blank" rel="noreferrer"><Download /> $ OPEN RÉSUMÉ.PDF</a>
          </div>
          <CommandConsole resumeUrl={personal.resumeUrl} />
        </div>

        <figure className="telemetry-monitor">
          <div className="monitor-head">
            <span><Radio /> REMOTE SENSING // LIVE</span>
            <span>34.0522° N / SIGNAL 97%</span>
          </div>
          <div className="monitor-image">
            <Image
              src="/telemetry-ocean.png"
              alt="Retro oceanographic telemetry display with spectral graphs and orbital plots"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            <div className="monitor-reticle" aria-hidden="true"><span /><span /></div>
          </div>
          <figcaption>
            <div><span>problems_solved</span><strong>500+</strong></div>
            <div><span>students_mentored</span><strong>50+</strong></div>
            <div><span>public_repos</span><strong>14</strong></div>
            <div><span>rl_eval_prompts</span><strong>630</strong></div>
          </figcaption>
        </figure>
      </section>

      <div className="signal-tape" aria-label="Areas of focus">
        <div>
          <span>OPEN SOURCE</span><i>✣</i><span>DISTRIBUTED SYSTEMS</span><i>✣</i>
          <span>AGENT ENVIRONMENTS</span><i>✣</i><span>DEVELOPER TOOLS</span><i>✣</i>
          <span>OPEN SOURCE</span><i>✣</i><span>DISTRIBUTED SYSTEMS</span><i>✣</i>
          <span>AGENT ENVIRONMENTS</span><i>✣</i><span>DEVELOPER TOOLS</span><i>✣</i>
        </div>
      </div>

      <section className="overview section-grid" id="about" aria-label="Profile overview">
        <fieldset className="story-panel offset-panel">
          <legend>whoami</legend>
          <p className="panel-index">01 / ABOUT</p>
          <h2>Engineering where systems, agents, and people meet.</h2>
          <p>
            I&apos;m a Computer Science undergraduate at PES University, graduating in 2027. My best work
            lives between infrastructure, agent evaluation, and developer experience: places where
            correctness has to survive contact with real users and messy systems.
          </p>
          <p>
            I contribute upstream at Prime Intellect and have shipped production fixes to Warp and
            Monkeytype. As a GDG campus mentor, I&apos;ve also helped 50+ students turn ideas into working software.
          </p>
          <div className="operator-meta">
            <span><MapPin /> BENGALURU, IN</span>
            <span><span className="pulse-dot" /> AVAILABLE FOR INTERESTING WORK</span>
          </div>
        </fieldset>

        <fieldset className="compute-panel offset-panel">
          <legend>runtime status</legend>
          <div className="network-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <span className="orbit-node node-one" />
            <span className="orbit-node node-two" />
            <span className="orbit-node node-three" />
            <strong>01<br />10</strong>
          </div>
          <div className="vector-readout">
            <p><span>PRIMARY MODE</span><b>BUILD + VERIFY</b></p>
            <p><span>ACTIVE DOMAIN</span><b>RELIABLE SYSTEMS</b></p>
            <p><span>NETWORK STATE</span><b className="mint">CONTRIBUTING</b></p>
          </div>
        </fieldset>
      </section>

      <section className="codeforces-section content-section" id="codeforces" aria-labelledby="codeforces-title">
        <div className="section-heading compact">
          <div><p className="eyebrow">02 / $ CF PROFILE CHINMAYLK99</p><h2 id="codeforces-title">Competitive signal</h2></div>
          <p>Live profile telemetry and the complete rated-contest trajectory from the official Codeforces API.</p>
        </div>
        <CodeforcesConsole handle={personal.codeforcesHandle} />
      </section>

      <section className="content-section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <div><p className="eyebrow">03 / $ LS ./SELECTED-WORK</p><h2 id="work-title">Active engineering runs</h2></div>
          <p>Four systems selected for their technical depth, shipped state, and real-world feedback loops.</p>
        </div>
        <div className="filter-row" aria-label="Static project filters">
          <span className="selected">ALL 04</span><span>DEPLOYED 02</span><span>TOOLS 02</span>
          <i>ORDER: RECENTLY UPDATED</i>
        </div>

        <div className="runs-grid">
          {featuredProjects.map((project, index) => {
            const meta = runMeta[project.id]
            return (
              <article className="run-card" key={project.id}>
                <div className="run-topline">
                  <span>RUN {String(index + 1).padStart(2, "0")}</span>
                  <span className="run-status"><i /> {meta.status}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="run-metrics">
                  <span><b>{meta.signal}</b><small>scope</small></span>
                  <span><b>{meta.result}</b><small>result</small></span>
                  <span><b>{project.category}</b><small>type</small></span>
                </div>
                <div className="pipeline-label"><span>PIPELINE EVIDENCE</span><span>{meta.status}</span></div>
                <div className="segmented-bar" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, segment) => <span className={segment < meta.segments ? "on" : ""} key={segment} />)}
                </div>
                <div className="run-footer">
                  <div>{project.technologies.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <div>
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} source on GitHub`}><Github /></a>
                    {project.liveUrl !== "#" && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} live site`}><ExternalArrow /></a>}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="oss-zone" id="oss" aria-labelledby="oss-title">
        <div className="oss-intro">
          <p className="eyebrow">04 / $ GH PR LIST --RECENT</p>
          <h2 id="oss-title">Open-source work,<br /><em>in public.</em></h2>
          <p>Production fixes, agent environments, performance work, and auditable contracts sent upstream.</p>
          <a href={`${personal.github}?tab=pull-requests`} target="_blank" rel="noreferrer">VIEW GITHUB PROFILE <ExternalArrow /></a>
        </div>
        <div className="contribution-table">
          <div className="contribution-head"><span>INDEX / REPOSITORY</span><span>CHANGESET</span><span>STATE</span></div>
          {contributions.map((item, index) => (
            <a href={item.href} target="_blank" rel="noreferrer" className="contribution-row" key={item.href}>
              <div className="contribution-repo"><span>{String(index + 1).padStart(2, "0")}</span><code>{item.repo}</code></div>
              <div><h3>{item.title}</h3><p>{item.detail}</p></div>
              <div className="contribution-state"><span className={item.state.toLowerCase()}>{item.state}</span><b>{item.pr}</b><ExternalArrow /></div>
            </a>
          ))}
        </div>
      </section>

      <section className="log-section content-section" id="log" aria-labelledby="log-title">
        <div className="section-heading compact">
          <div><p className="eyebrow">05 / $ GIT LOG --RECENT</p><h2 id="log-title">Recent commits &amp; merges</h2></div>
          <p>Verified from public GitHub history. The newest signal is listed first.</p>
        </div>
        <div className="activity-table">
          <div className="activity-head"><span>DATE</span><span>REPOSITORY</span><span>HASH</span><span>MESSAGE</span><span /></div>
          {recentActivity.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={`${item.repo}-${item.hash}`}>
              <span>{item.date}</span><code>{item.repo}</code><b>{item.hash}</b><strong>{item.message}</strong><ExternalArrow />
            </a>
          ))}
        </div>
      </section>

      <section className="toolkit-section section-grid" id="skills" aria-label="Technical toolkit">
        <fieldset className="toolkit-panel offset-panel">
          <legend>cat skills.json</legend>
          {capabilities.map(([group, tools]) => (
            <div className="capability-row" key={group}><span>{group}</span><p>{tools}</p></div>
          ))}
        </fieldset>
        <div className="principles-panel">
          <p className="eyebrow">OPERATING PRINCIPLES</p>
          <ol>
            <li><span>01</span>Make failure states observable.</li>
            <li><span>02</span>Prefer evidence over assumptions.</li>
            <li><span>03</span>Ship the smallest correct system.</li>
            <li><span>04</span>Leave the codebase easier to change.</li>
          </ol>
        </div>
      </section>

      <footer className="contact-section" id="contact">
        <div className="contact-orbit" aria-hidden="true"><span /><span /><span /></div>
        <p className="eyebrow"><span className="pulse-dot" /> $ MAIL --NEW / CHANNEL OPEN</p>
        <h2>Start a<br /><em>transmission.</em></h2>
        <p className="contact-copy">Have an ambitious systems problem, an open-source idea, or a role where careful engineering matters? Send a signal.</p>
        <div className="contact-actions">
          <a className="primary-action light" href={`mailto:${personal.email}`}><Mail /> {personal.email}</a>
          <a href={personal.github} target="_blank" rel="noreferrer"><Github /> GITHUB <ExternalArrow /></a>
          <a href={personal.linkedin} target="_blank" rel="noreferrer"><Linkedin /> LINKEDIN <ExternalArrow /></a>
        </div>
        <div className="footer-line">
          <span>CHINMAY DHAR DWIVEDI © 2026</span>
          <span>DESIGNED AS A LIVING SYSTEM</span>
          <a href="#top">RETURN TO ORIGIN ↑</a>
        </div>
      </footer>
    </main>
  )
}
