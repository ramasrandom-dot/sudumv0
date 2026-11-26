import { useEffect } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, RotateCcw } from 'lucide-react'
import { Logo } from '@/components/brand'
import { ConfirmAction, Select, SkipLink, useToast } from '@/components/ui'
import { ROLE_LABEL, TODAY } from '@/data/program'
import { DEMO_USERS } from '@/data/seed'
import type { Role } from '@/data/types'
import { fmtDate } from '@/lib/dates'
import { cn } from '@/lib/cn'
import { useStore } from '@/store/AppStore'
import { NAV } from './nav'

const iconButton =
  'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-slate transition-colors hover:bg-navy/5 hover:text-navy'

/**
 * The platform shell: one light top bar with a few pill tabs on desktop,
 * and an app-style tab bar at the bottom on phones.
 */
export default function AppLayout() {
  const { me, actions } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (!me) return <Navigate to="/login" replace />
  const items = NAV[me.role]

  return (
    <div className="min-h-dvh bg-canvas pb-20 lg:pb-0">
      <SkipLink />

      <header
        className="sticky z-30 border-b border-line bg-white/90 backdrop-blur-md"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" aria-label="الموقع العام لسُدُم" className="shrink-0">
            <Logo className="h-9" />
          </Link>

          <nav aria-label="أقسام المنصة" className="mx-auto hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-150',
                    isActive ? 'bg-navy text-white' : 'text-slate hover:bg-navy/5 hover:text-navy',
                  )
                }
              >
                <item.icon className="size-[18px]" aria-hidden />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            <label htmlFor="role-switch" className="sr-only">
              تجربة المنصة بصفة
            </label>
            <Select
              id="role-switch"
              className="h-10 w-auto min-w-32 rounded-full text-sm font-semibold"
              value={me.role}
              onChange={(e) => {
                const role = e.target.value as Role
                actions.signIn(DEMO_USERS[role])
                navigate(`/app/${role}`)
              }}
            >
              {(Object.keys(DEMO_USERS) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </Select>
            <ConfirmAction
              className="absolute top-full left-4 mt-2 shadow-raised"
              question="إعادة البيانات التجريبية؟ تُحذف تغييراتك."
              confirmLabel="إعادة الضبط"
              onConfirm={() => {
                actions.resetDemo()
                toast('أُعيدت البيانات التجريبية إلى حالتها الأصلية')
              }}
            >
              {(ask) => (
                <button type="button" className={iconButton} onClick={ask} title="إعادة ضبط البيانات التجريبية" aria-label="إعادة ضبط البيانات التجريبية">
                  <RotateCcw className="size-4" aria-hidden />
                </button>
              )}
            </ConfirmAction>
            <button
              type="button"
              className={iconButton}
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
              onClick={() => {
                actions.signOut()
                navigate('/login')
              }}
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-6 outline-none sm:px-6 lg:py-10">
        <Outlet />
      </main>
      <p className="mx-auto max-w-6xl px-4 pb-6 text-center text-xs text-slate sm:px-6">
        عرض تجريبي · <span className="tabular">{fmtDate(TODAY)}</span> · البيانات افتراضية
      </p>

      <nav
        aria-label="أقسام المنصة"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="flex overflow-x-auto">
          {items.map((item) => (
            <li key={item.to} className="min-w-[4.25rem] flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn('flex h-16 flex-col items-center justify-center gap-0.5 px-1 text-xs font-semibold whitespace-nowrap', isActive ? 'text-navy' : 'text-slate')
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={cn('grid h-8 w-12 place-items-center rounded-full transition-colors duration-150', isActive && 'bg-tint-blue text-blue-ink')}>
                      <item.icon className="size-5" aria-hidden />
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

/** Guards a role's section: unknown users go to sign-in, other roles go home. */
export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { me } = useStore()
  if (!me) return <Navigate to="/login" replace />
  if (me.role !== role) return <Navigate to={`/app/${me.role}`} replace />
  return <>{children}</>
}
