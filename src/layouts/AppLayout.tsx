import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, LogOut, Menu, RotateCcw, X } from 'lucide-react'
import { Logo } from '@/components/brand'
import { Avatar, ConfirmAction, Select, SkipLink, useToast } from '@/components/ui'
import { ROLE_LABEL, TODAY } from '@/data/program'
import { DEMO_USERS } from '@/data/seed'
import type { Role } from '@/data/types'
import { fmtDate } from '@/lib/dates'
import { cn } from '@/lib/cn'
import { useStore } from '@/store/AppStore'
import { NAV } from './nav'

function Sidebar({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const { me, actions } = useStore()
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-navy-deep text-white">
      <div className="flex h-16 items-center px-5">
        <Link to="/" aria-label="الموقع العام لسُدُم">
          <Logo variant="white" className="h-8" />
        </Link>
      </div>
      <p className="px-5 pb-2 pt-4 text-xs font-semibold text-white/45">{ROLE_LABEL[role]}</p>
      <nav aria-label="أقسام المنصة" className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-0.5">
          {NAV[role].map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] transition-colors duration-150',
                    isActive ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn('size-[18px] shrink-0', isActive ? 'text-[#7cc4ee]' : 'text-white/50')} aria-hidden />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {me && (
        <div className="m-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <Avatar name={me.name} tone="light" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{me.name}</p>
            <p className="truncate text-xs text-white/55">{me.title}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              actions.signOut()
              navigate('/login')
            }}
            className="rounded-lg p-2 text-white/55 hover:bg-white/10 hover:text-white"
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { me, actions } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  if (!me) return null
  return (
    <div style={{ top: 'env(safe-area-inset-top, 0px)' }} className="sticky z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        className="inline-flex size-10 items-center justify-center rounded-lg text-navy hover:bg-navy/5 lg:hidden"
        aria-label="فتح القائمة"
      >
        <Menu className="size-5" />
      </button>
      <p className="hidden items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate shadow-card sm:inline-flex">
        <CalendarDays className="size-4 text-blue" aria-hidden />
        <span>
          عرض تجريبي · <span className="tabular">{fmtDate(TODAY)}</span>
        </span>
      </p>
      <div className="ms-auto flex items-center gap-2">
        <label htmlFor="role-switch" className="hidden text-sm whitespace-nowrap text-slate md:block">
          تجربة المنصة بصفة
        </label>
        <Select
          id="role-switch"
          className="h-9 w-auto min-w-36 text-sm"
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
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm whitespace-nowrap text-slate hover:bg-navy/5 hover:text-navy"
              onClick={ask}
              title="إعادة ضبط البيانات التجريبية"
            >
              <RotateCcw className="size-4" aria-hidden />
              <span className="hidden xl:inline">إعادة الضبط</span>
            </button>
          )}
        </ConfirmAction>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const { me } = useStore()
  const [drawer, setDrawer] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (!drawer) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawer])

  if (!me) return <Navigate to="/login" replace />

  return (
    <div className="min-h-dvh bg-canvas">
      <SkipLink />
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 lg:block">
        <Sidebar role={me.role} />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-50 overscroll-contain lg:hidden" role="dialog" aria-modal="true" aria-label="القائمة">
          <button type="button" className="absolute inset-0 bg-navy/50" aria-label="إغلاق القائمة" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 w-72 max-w-[85vw] shadow-raised" style={{ animation: 'drawer-in 260ms var(--ease-out-expo)' }}>
            <Sidebar role={me.role} onNavigate={() => setDrawer(false)} />
            <button
              type="button"
              className="absolute top-3 left-3 rounded-lg p-2 text-white/70 hover:bg-white/10"
              aria-label="إغلاق القائمة"
              onClick={() => setDrawer(false)}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pr-64">
        <Topbar onMenu={() => setDrawer(true)} />
        <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 outline-none sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
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
