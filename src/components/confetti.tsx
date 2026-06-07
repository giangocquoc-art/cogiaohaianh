'use client'

import { useEffect, useRef } from 'react'

interface ConfettiProps {
  score: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'circle' | 'rect' | 'star'
  opacity: number
}

const CHILD_FRIENDLY_COLORS = [
  '#FF6B6B', // red
  '#FF9F43', // orange
  '#FECA57', // yellow
  '#48C774', // green
  '#FF78C4', // pink
  '#54A0FF', // blue
  '#FF6348', // tomato
  '#7BED9F', // light green
  '#FFA8D8', // light pink
  '#FFD93D', // gold
]

export function Confetti({ score }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // Determine intensity based on score
    const particleCount = score >= 9 ? 200 : score >= 8 ? 120 : 80
    const duration = score >= 9 ? 5000 : 4000

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        color: CHILD_FRIENDLY_COLORS[Math.floor(Math.random() * CHILD_FRIENDLY_COLORS.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: (['circle', 'rect', 'star'] as const)[Math.floor(Math.random() * 3)],
        opacity: 1,
      })
    }

    const startTime = Date.now()

    const drawStar = (x: number, y: number, size: number, ctx: CanvasRenderingContext2D) => {
      const spikes = 5
      const outerRadius = size
      const innerRadius = size * 0.4
      let rot = (Math.PI / 2) * 3
      const step = Math.PI / spikes

      ctx.beginPath()
      ctx.moveTo(x, y - outerRadius)
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(
          x + Math.cos(rot) * outerRadius,
          y + Math.sin(rot) * outerRadius
        )
        rot += step
        ctx.lineTo(
          x + Math.cos(rot) * innerRadius,
          y + Math.sin(rot) * innerRadius
        )
        rot += step
      }
      ctx.lineTo(x, y - outerRadius)
      ctx.closePath()
      ctx.fill()
    }

    const animate = () => {
      const elapsed = Date.now() - startTime

      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        cancelAnimationFrame(animationRef.current)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Fade out in last second
      const fadeStart = duration - 1000
      const globalOpacity = elapsed > fadeStart ? 1 - (elapsed - fadeStart) / 1000 : 1

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05 // gravity
        p.vx *= 0.99 // air resistance
        p.rotation += p.rotationSpeed
        p.opacity = globalOpacity

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          drawStar(0, 0, p.size / 2, ctx)
        }

        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', updateSize)
    }
  }, [score])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      aria-hidden="true"
    />
  )
}
