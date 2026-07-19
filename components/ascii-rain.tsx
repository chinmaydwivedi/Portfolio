"use client"

import { useEffect, useRef } from "react"

const glyphs = "01{}[]<>/\\|*+=$#@"
const phosphors = ["rgba(103, 223, 255, .48)", "rgba(255, 107, 214, .42)", "rgba(255, 174, 98, .42)"]

export default function AsciiRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const cell = 15
    let columns = 0
    let drops: number[] = []
    let frame = 0
    let previous = 0

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      columns = Math.ceil(width / cell)
      drops = Array.from({ length: columns }, () => -Math.random() * height)
      context.clearRect(0, 0, width, height)
    }

    const paint = (time: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (time - previous > 75) {
        context.fillStyle = "rgba(2, 4, 10, 0.16)"
        context.fillRect(0, 0, width, height)
        context.font = "10px var(--font-mono), monospace"
        context.textAlign = "center"

        for (let index = 0; index < columns; index += 1) {
          if (Math.random() > 0.72) continue
          const glyph = glyphs[Math.floor(Math.random() * glyphs.length)]
          const lead = Math.random() > 0.9
          context.fillStyle = lead ? "rgba(232, 248, 255, .82)" : phosphors[Math.floor(Math.random() * phosphors.length)]
          context.fillText(glyph, index * cell + cell / 2, drops[index])
          drops[index] += cell
          if (drops[index] > height + Math.random() * 240) drops[index] = -Math.random() * 180
        }
        previous = time
      }
      if (!reduceMotion.matches) frame = requestAnimationFrame(paint)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    frame = requestAnimationFrame(paint)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={canvasRef} className="ascii-rain" aria-hidden="true" />
}
