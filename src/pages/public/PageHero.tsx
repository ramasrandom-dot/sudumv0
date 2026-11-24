import type { ReactNode } from 'react'
import darkStars from '@/assets/brand/dark-background-stars-2.webp'

/** The dark opening band used by inner public pages. */
export default function PageHero({ title, lede, children }: { title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#03050a] text-white">
      <img src={darkStars} alt="" aria-hidden width={2000} height={1125} fetchPriority="high" className="absolute inset-0 -z-10 size-full object-cover object-left opacity-90" />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 md:pb-20 lg:px-10">
        <h1 className="max-w-[20ch] text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.2] font-bold">{title}</h1>
        {lede && <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-white/70 md:text-xl">{lede}</p>}
        {children}
      </div>
    </section>
  )
}
