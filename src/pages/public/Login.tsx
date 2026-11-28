import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo, PnuLogo, Star } from '@/components/brand'
import { ROLE_DESCRIPTION, ROLE_LABEL } from '@/data/program'
import { DEMO_USERS } from '@/data/seed'
import type { Role } from '@/data/types'
import { ROLE_ICON } from '@/layouts/nav'
import { useStore } from '@/store/AppStore'
import cover from '@/assets/brand/cover-background-stars.webp'

const ORDER: Role[] = ['participant', 'mentor', 'expert', 'judge', 'admin']

export default function Login() {
  const { state, actions } = useStore()
  const navigate = useNavigate()

  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-[#03050a] text-white">
      <img src={cover} alt="" aria-hidden width={2000} height={1125} fetchPriority="high" className="absolute inset-0 -z-10 size-full object-cover object-left" />
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <Link to="/" aria-label="العودة إلى الصفحة الرئيسية" className="flex items-center gap-3 sm:gap-4">
          <Logo variant="white" className="h-10" />
          <span className="h-8 w-px bg-white/20" aria-hidden />
          <PnuLogo className="h-8 sm:h-9" />
        </Link>
        <Link to="/" className="text-sm text-white/70 hover:text-white">
          الموقع العام
        </Link>
      </header>

      <main id="main" className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="text-4xl leading-tight font-bold md:text-5xl">منصة سُدُم</h1>
          <p className="mt-4 max-w-[38ch] text-lg text-white/70">اختاري دورًا لتجربة المنصة.</p>
          <p className="mt-8 flex max-w-[42ch] gap-3 rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/75">
            <Star className="mt-0.5 size-4 shrink-0" color="#3E84BE" />
            نسخة تجريبية بلا كلمات مرور. يمكنك تبديل الدور من أعلى الصفحة.
          </p>
        </div>

        <ul className="flex flex-col gap-2" aria-label="الدخول بصفة">
          {ORDER.map((role) => {
            const person = state.people.find((p) => p.id === DEMO_USERS[role])
            const Icon = ROLE_ICON[role]
            return (
              <li key={role}>
                <button
                  type="button"
                  onClick={() => {
                    actions.signIn(DEMO_USERS[role])
                    navigate(`/app/${role}`)
                  }}
                  className="group flex w-full items-center gap-4 rounded-xl bg-white p-4 text-start text-navy shadow-raised transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-tint-blue"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-tint-blue text-blue-ink">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-bold">{ROLE_LABEL[role]}</span>
                      <span className="text-sm text-slate">{person?.name}</span>
                    </span>
                    <span className="block text-sm text-slate">{ROLE_DESCRIPTION[role]}</span>
                  </span>
                  <ArrowLeft className="size-5 shrink-0 text-slate transition-transform duration-200 group-hover:-translate-x-1" aria-hidden />
                </button>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
