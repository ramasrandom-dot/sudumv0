import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let current: Lenis | null = null

/** Jump to the top of the page, through Lenis when it is running. */
// eslint-disable-next-line react-refresh/only-export-components
export const scrollToTop = () => {
  if (current) current.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger
 * animations stay in sync. Skipped entirely when the visitor prefers reduced motion.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ autoRaf: false })
    current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      current = null
    }
  }, [])

  return <>{children}</>
}
