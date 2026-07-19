"use client"

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"

type CommandResult = {
  raw: string
  output: string
  error?: boolean
}

const shortcuts = ["help", "whoami", "ls work", "gh pr list", "cf profile", "git log"]

const destinations: Record<string, { target: string; output: string }> = {
  home: { target: "top", output: "returned to /home" },
  "cd ~": { target: "top", output: "returned to /home" },
  about: { target: "about", output: "opened /about/operator-profile" },
  whoami: { target: "about", output: "chinmay dwivedi — systems engineer + oss contributor" },
  work: { target: "work", output: "listed 4 active engineering runs" },
  projects: { target: "work", output: "listed 4 active engineering runs" },
  ls: { target: "work", output: "listed 4 active engineering runs" },
  "ls work": { target: "work", output: "listed 4 active engineering runs" },
  "ls projects": { target: "work", output: "listed 4 active engineering runs" },
  oss: { target: "oss", output: "fetched 3 upstream pull requests" },
  "gh pr list": { target: "oss", output: "fetched 3 upstream pull requests" },
  cf: { target: "codeforces", output: "loaded codeforces://chinmaylk99" },
  codeforces: { target: "codeforces", output: "loaded codeforces://chinmaylk99" },
  "cf profile": { target: "codeforces", output: "loaded codeforces://chinmaylk99" },
  rating: { target: "codeforces", output: "rendered 18-contest rating history" },
  log: { target: "log", output: "opened recent git history" },
  activity: { target: "log", output: "opened recent git history" },
  "git log": { target: "log", output: "opened recent git history" },
  skills: { target: "skills", output: "read ./working-set.json" },
  "cat skills.json": { target: "skills", output: "read ./working-set.json" },
  contact: { target: "contact", output: "opened a secure contact channel" },
  mail: { target: "contact", output: "opened a secure contact channel" },
}

const helpText = "commands: whoami · ls work · gh pr list · cf profile · git log · skills · contact · resume · clear"

export default function CommandConsole({ resumeUrl }: { resumeUrl: string }) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<CommandResult[]>([])
  const [recall, setRecall] = useState<string[]>([])
  const [recallIndex, setRecallIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const consoleRef = useRef<HTMLDivElement>(null)

  const focusConsole = () => {
    consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    window.setTimeout(() => inputRef.current?.focus(), 280)
  }

  useEffect(() => {
    const openConsole = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "/" || (event.target as HTMLElement).closest("input, textarea, select")) return
      event.preventDefault()
      focusConsole()
    }

    window.addEventListener("keydown", openConsole)
    return () => window.removeEventListener("keydown", openConsole)
  }, [])

  const execute = (rawCommand: string) => {
    const normalized = rawCommand.trim().toLowerCase().replace(/\s+/g, " ")
    if (!normalized) return

    setRecall((current) => [...current, rawCommand])
    setRecallIndex(-1)
    setInput("")

    if (normalized === "clear") {
      setHistory([])
      return
    }

    if (normalized === "help" || normalized === "--help") {
      setHistory((current) => [...current.slice(-2), { raw: rawCommand, output: helpText }])
      return
    }

    if (normalized === "resume" || normalized === "cv" || normalized === "open resume.pdf") {
      setHistory((current) => [...current.slice(-2), { raw: rawCommand, output: "opening resume.pdf in a new tab" }])
      window.open(resumeUrl, "_blank", "noopener,noreferrer")
      return
    }

    const destination = destinations[normalized]
    if (!destination) {
      setHistory((current) => [...current.slice(-2), { raw: rawCommand, output: `command not found: ${normalized} — run help`, error: true }])
      return
    }

    setHistory((current) => [...current.slice(-2), { raw: rawCommand, output: destination.output }])
    window.setTimeout(() => {
      document.getElementById(destination.target)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 80)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    execute(input)
  }

  const handleKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    if (recall.length === 0) return

    if (event.key === "ArrowUp") {
      const nextIndex = recallIndex < 0 ? recall.length - 1 : Math.max(0, recallIndex - 1)
      setRecallIndex(nextIndex)
      setInput(recall[nextIndex])
      return
    }

    const nextIndex = recallIndex < 0 ? -1 : recallIndex + 1
    if (nextIndex >= recall.length) {
      setRecallIndex(-1)
      setInput("")
    } else {
      setRecallIndex(nextIndex)
      setInput(recall[nextIndex])
    }
  }

  return <>
    <div className="command-console" ref={consoleRef} onClick={() => inputRef.current?.focus()}>
      <div className="console-head">
        <span>PORTFOLIO.SHELL / INTERACTIVE</span>
        <span><i /> READY</span>
      </div>
      <div className="console-history" aria-live="polite">
        {history.length === 0 ? (
          <p className="console-system"><span>system</span> session initialized — type <button type="button" onClick={(event) => { event.stopPropagation(); execute("help") }}>help</button></p>
        ) : history.map((entry, index) => (
          <div className={entry.error ? "console-entry error" : "console-entry"} key={`${entry.raw}-${index}`}>
            <p><span>chinmay@portfolio:~$</span> {entry.raw}</p>
            <output>↳ {entry.output}</output>
          </div>
        ))}
      </div>
      <form className="console-prompt" onSubmit={submit}>
        <label htmlFor="portfolio-command"><b>chinmay</b><i>@</i><strong>portfolio</strong>:~$</label>
        <input
          id="portfolio-command"
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeys}
          placeholder="enter a command"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit">RUN ↵</button>
      </form>
      <div className="console-shortcuts" aria-label="Command shortcuts">
        {shortcuts.map((shortcut) => <button type="button" key={shortcut} onClick={(event) => { event.stopPropagation(); execute(shortcut) }}>{shortcut}</button>)}
      </div>
    </div>
    <button className="console-recall" type="button" onClick={focusConsole} aria-label="Open portfolio command line" aria-keyshortcuts="/">
      <span>$</span> CLI_<kbd>/</kbd>
    </button>
  </>
}
