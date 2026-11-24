import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitText from '@/components/reactbits/SplitText/SplitText'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function App() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    },
    { scope: container },
  )

  return (
    <div ref={container} className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="flex h-screen items-center justify-center px-4">
        <SplitText
          text="Lenis + GSAP + React Bits"
          tag="h1"
          className="text-center text-4xl font-semibold md:text-7xl"
          splitType="chars"
          delay={40}
          trigger="load"
        />
      </section>

      {['Smooth scroll by Lenis', 'Scroll animations by GSAP', 'Components by React Bits'].map((t) => (
        <section key={t} className="flex h-screen items-center justify-center px-4">
          <h2 className="reveal text-3xl font-medium text-neutral-300 md:text-5xl">{t}</h2>
        </section>
      ))}
    </div>
  )
}
