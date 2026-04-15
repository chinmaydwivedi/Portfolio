"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  color: string
}

const COLORS = [
  "rgba(20, 184, 166, 0.6)",
  "rgba(20, 184, 166, 0.35)",
  "rgba(56, 189, 248, 0.4)",
  "rgba(99, 102, 241, 0.35)",
  "rgba(167, 139, 250, 0.3)",
]

export default function InteractiveGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animFrameRef = useRef<number>(0)
  const [hovered, setHovered] = useState(false)

  const initNodes = useCallback((w: number, h: number) => {
    const count = Math.min(60, Math.floor((w * h) / 8000))
    const nodes: Node[] = []
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 3
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: r,
        baseRadius: r,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }
    return nodes
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      nodesRef.current = initNodes(rect.width, rect.height)
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const nodes = nodesRef.current
      const connectionDist = 120
      const mouseDist = 160

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]

        // Mouse interaction: attract gently
        const dmx = mx - a.x
        const dmy = my - a.y
        const dm = Math.sqrt(dmx * dmx + dmy * dmy)
        if (dm < mouseDist && dm > 1) {
          const force = (1 - dm / mouseDist) * 0.02
          a.vx += dmx * force
          a.vy += dmy * force
          a.radius = a.baseRadius + (1 - dm / mouseDist) * 3
        } else {
          a.radius += (a.baseRadius - a.radius) * 0.1
        }

        // Damping
        a.vx *= 0.995
        a.vy *= 0.995

        // Move
        a.x += a.vx
        a.y += a.vy

        // Bounce off edges softly
        if (a.x < 0) { a.x = 0; a.vx *= -0.5 }
        if (a.x > w) { a.x = w; a.vx *= -0.5 }
        if (a.y < 0) { a.y = 0; a.vy *= -0.5 }
        if (a.y > h) { a.y = h; a.vy *= -0.5 }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.25
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(20, 184, 166, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }

        // Mouse connection lines
        if (dm < mouseDist && dm > 1) {
          const alpha = (1 - dm / mouseDist) * 0.4
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mx, my)
          ctx.strokeStyle = `rgba(20, 184, 166, ${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2)
        ctx.fillStyle = a.color
        ctx.fill()
      }

      // Mouse cursor glow
      if (mx > 0 && my > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 80)
        grad.addColorStop(0, "rgba(20, 184, 166, 0.08)")
        grad.addColorStop(1, "rgba(20, 184, 166, 0)")
        ctx.beginPath()
        ctx.arc(mx, my, 80, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [initNodes])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 }
    setHovered(false)
  }, [])

  return (
    <motion.div
      className="relative w-full h-full rounded-2xl overflow-hidden glass"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect()
          if (!rect || !e.touches[0]) return
          mouseRef.current = {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          }
        }}
        onTouchEnd={() => {
          mouseRef.current = { x: -1000, y: -1000 }
        }}
      />
      <div className="absolute bottom-3 left-3 pointer-events-none">
        <motion.span
          className="text-[10px] text-muted-foreground/40 font-mono"
          animate={{ opacity: hovered ? 0 : 0.6 }}
        >
          hover to interact
        </motion.span>
      </div>
    </motion.div>
  )
}
