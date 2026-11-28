import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import SmoothScroll, { scrollToTop } from '@/lib/SmoothScroll'
import { Logo, PnuLogo } from '@/components/brand'
import { ButtonLink, SkipLink } from '@/components/ui'
import { HELP_EMAIL } from '@/data/program'
import { cn } from '@/lib/cn'

const links = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/program', label: 'المراحل' },
  { to: '/mentors', label: 'المرشدون والخبراء' },
  { to: '/apply', label: 'التقديم' },
]

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  // The mobile menu is open only on the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (fn: (v: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300',
        scrolled || open ? 'bg-navy-900/95 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3 sm:gap-4" aria-label="سُدُم: الصفحة الرئيسية">
          <Logo variant="white" className="h-9 sm:h-10" />
          <span className="h-8 w-px bg-white/20" aria-hidden />
          <PnuLogo className="h-8 sm:h-9" />
        </Link>

        <nav aria-label="الرئيسية" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors',
                  isActive ? 'text-white' : 'text-white/70 hover:text-white',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink to="/login" variant="light" size="md" className="max-sm:hidden">
            دخول المنصة
          </ButtonLink>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="القائمة" className="border-t border-white/10 px-4 pb-6 md:hidden">
          <ul className="flex flex-col py-2">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    cn('block rounded-lg px-2 py-3 text-lg', isActive ? 'font-semibold text-white' : 'text-white/75')
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ButtonLink to="/login" variant="light" size="lg" className="w-full">
            دخول المنصة
          </ButtonLink>
        </nav>
      )}
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <div className="flex flex-wrap items-center gap-6">
            <Logo variant="white" className="h-11" />
            <span className="h-10 w-px bg-white/15" aria-hidden />
            <PnuLogo className="h-11" />
          </div>
          <p className="mt-6 max-w-[42ch] text-white/70">هنا تتشكّل الأفكار، وتتلاقى المواهب والفرص، لتولد مشاريع تصنع أثرها.</p>
          <p className="mt-4 text-white/85">
            {HELP_EMAIL ? (
              <a className="hover:text-white hover:underline" href={`mailto:${HELP_EMAIL}`} dir="ltr">
                {HELP_EMAIL}
              </a>
            ) : (
              'بريد المساعدة: يُضاف قريبًا'
            )}
          </p>
        </div>
        <nav aria-label="روابط الموقع" className="md:col-span-2 md:justify-self-end">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 md:flex-col">
            <li><Link className="text-white/85 hover:text-white" to="/program">المراحل</Link></li>
            <li><Link className="text-white/85 hover:text-white" to="/mentors">المرشدون والخبراء</Link></li>
            <li><Link className="text-white/85 hover:text-white" to="/apply">التقديم</Link></li>
            <li><Link className="text-white/85 hover:text-white" to="/login">دخول المنصة</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-white/55 sm:px-6 lg:px-10">
          <p>مركز الابتكار وريادة الأعمال | جامعة الأميرة نورة بنت عبدالرحمن</p>
          <p>نسخة تجريبية · البيانات افتراضية</p>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      scrollToTop()
      return
    }
    // Scroll to an in-page section, e.g. /program#workshops.
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80)
    return () => clearTimeout(t)
  }, [pathname, hash])

  return (
    <SmoothScroll>
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="bg-canvas outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </SmoothScroll>
  )
}
