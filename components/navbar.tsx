"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const links = [["/#about", "ABOUT"], ["/#oss", "OSS"], ["/#projects", "WORK"], ["/#skills", "STACK"], ["/#contact", "CONTACT"]]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 18); addEventListener("scroll", fn, { passive: true }); return () => removeEventListener("scroll", fn) }, [])
  return <nav className={scrolled ? "nav scrolled" : "nav"}><div className="shell nav-inner">
    <Link className="brand" href="/"><span>CD</span><i>_</i></Link>
    <div className={open ? "nav-links open" : "nav-links"}>{links.map(([href, label], i) => <Link href={href} key={href} onClick={() => setOpen(false)}><small>0{i + 1}.</small>{label}</Link>)}</div>
    <a className="nav-cta" href="mailto:chinmaydhardwivedi@gmail.com"><span /> AVAILABLE FOR WORK</a>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
  </div></nav>
}
