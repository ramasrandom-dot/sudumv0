import LogoLoop, { type LogoItem } from '@/components/reactbits/LogoLoop/LogoLoop'
import { Star } from '@/components/brand'
import { PARTNERS, PARTNER_SLOTS } from '@/data/partners'

const HEIGHT = 48

const logos: LogoItem[] = [
  ...PARTNERS.map((p): LogoItem => {
    const width = Math.round(HEIGHT * p.ratio)
    return p.tint
      ? {
          ariaLabel: p.name,
          title: p.name,
          node: (
            <span
              role="img"
              aria-label={p.name}
              className="block bg-navy"
              style={{
                width,
                height: HEIGHT,
                maskImage: `url("${p.logo}")`,
                WebkitMaskImage: `url("${p.logo}")`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
          ),
        }
      : { src: p.logo, alt: p.name, title: p.name, width, height: HEIGHT }
  }),
  // Placeholder slots until real partner logos arrive.
  ...Array.from({ length: Math.max(0, PARTNER_SLOTS - PARTNERS.length) }, (): LogoItem => ({
    ariaLabel: 'شعار شريك',
    node: (
      <span
        className="flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-5 text-sm font-medium whitespace-nowrap text-slate"
        style={{ height: HEIGHT }}
      >
        <Star className="size-3.5" color="#3E84BE" />
        شعار شريك
      </span>
    ),
  })),
]

/** A moving bar of partner logos, directly under the hero. */
export default function Partners() {
  return (
    <section className="border-b border-line bg-white" aria-labelledby="partners-title">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-7 sm:px-6 md:gap-10 lg:px-10">
        <h2 id="partners-title" className="shrink-0 text-sm font-semibold text-slate">
          شركاؤنا
        </h2>
        {/* The loop measures and moves in physical pixels, so it runs left-to-right internally. */}
        <div dir="ltr" className="min-w-0 flex-1">
          <LogoLoop
            logos={logos}
            speed={50}
            direction="right"
            logoHeight={HEIGHT}
            gap={40}
            pauseOnHover
            draggable={false}
            intro={false}
            fadeOut
            ariaLabel="شعارات الشركاء"
          />
        </div>
      </div>
    </section>
  )
}
