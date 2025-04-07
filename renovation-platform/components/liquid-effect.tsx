"use client"

import { useEffect } from "react"
import { useThemeContext } from "./theme-provider"

export function LiquidEffect() {
  const { isVividMode } = useThemeContext()

  useEffect(() => {
    if (!isVividMode) return

    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".card")

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
          const xPercent = Math.round((x / rect.width) * 100)
          const yPercent = Math.round((y / rect.height) * 100)
          card.style.setProperty("--x", `${xPercent}%`)
          card.style.setProperty("--y", `${yPercent}%`)
        }
      })
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isVividMode])

  return null
}

