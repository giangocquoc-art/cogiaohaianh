'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Hook that detects when an element scrolls into view using IntersectionObserver.
 * Once visible, stays visible (no re-hide on scroll out).
 *
 * @param threshold - Visibility threshold (0.1 = 10% visible triggers)
 * @returns [ref, isVisible] - Ref to attach to element, boolean indicating visibility
 */
export function useScrollReveal(threshold: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element) // Stop observing once visible
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold])

  return { ref, isVisible }
}
