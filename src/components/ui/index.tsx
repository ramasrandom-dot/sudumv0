import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { CheckCircle2, X } from 'lucide-react'
import { cn, initials } from '@/lib/cn'

/* ───────────── Buttons ───────────── */

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'light' | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-[#1a2160] active:bg-navy-900',
  accent: 'bg-blue-ink text-white hover:bg-[#125a86]',
  secondary: 'bg-white text-navy border border-line-strong hover:border-navy/40 hover:bg-[#fafafc]',
  ghost: 'text-navy hover:bg-navy/5',
  danger: 'bg-white text-danger border border-danger/30 hover:bg-danger-tint',
  light: 'bg-white text-navy hover:bg-tint-blue',
  'outline-light': 'text-white border border-white/35 hover:bg-white/10 hover:border-white/60',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-[0.9375rem] gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2 rounded-xl',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra?: string) =>
  cn(
    'inline-flex items-center justify-center font-semibold whitespace-nowrap select-none',
    'transition-[background-color,border-color,color,transform] duration-200 active:translate-y-px',
    'disabled:opacity-45 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    extra,
  )

export function Button({
  variant,
  size,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={buttonClass(variant, size, className)} {...rest} />
}

export function ButtonLink({ variant, size, className, ...rest }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />
}

/* ───────────── Surfaces ───────────── */

export function Card({
  className,
  children,
  as: Tag = 'section',
}: {
  className?: string
  children: ReactNode
  as?: 'section' | 'div' | 'article' | 'li'
}) {
  return <Tag className={cn('rounded-xl border border-line bg-white shadow-card', className)}>{children}</Tag>
}

export function CardHeader({ title, action, sub }: { title: ReactNode; action?: ReactNode; sub?: ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-base font-bold text-navy">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-slate">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export function PageHeader({ title, lede, actions }: { title: ReactNode; lede?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {lede && <p className="mt-1 max-w-[65ch] text-slate">{lede}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <p className="font-semibold text-navy">{title}</p>
      {children && <p className="mt-1 max-w-[46ch] text-sm text-slate">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/* ───────────── Badges ───────────── */

type Tone = 'neutral' | 'blue' | 'green' | 'teal' | 'navy' | 'warn' | 'danger' | 'orange'

const tones: Record<Tone, string> = {
  neutral: 'bg-[#ececf1] text-slate',
  blue: 'bg-tint-blue text-blue-ink',
  green: 'bg-tint-mint text-green-ink',
  teal: 'bg-tint-teal text-teal',
  navy: 'bg-navy text-white',
  warn: 'bg-warn-tint text-warn',
  danger: 'bg-danger-tint text-danger',
  orange: 'bg-[#ffe7da] text-orange-ink',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ───────────── Forms ───────────── */

const control =
  'w-full rounded-lg border border-line-strong bg-white px-3 text-navy placeholder:text-slate/70 ' +
  'transition-[border-color,box-shadow] duration-150 hover:border-navy/35 ' +
  'focus:border-blue focus:outline-none focus:ring-3 focus:ring-blue/15 ' +
  'aria-[invalid=true]:border-danger disabled:bg-canvas disabled:text-slate'

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  required,
}: {
  label: ReactNode
  hint?: ReactNode
  error?: string
  children: ReactNode
  htmlFor?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-navy">
        {label}
        {required && <span className="ms-1 text-danger" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-slate">{hint}</p>
      )}
    </div>
  )
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, 'h-11', className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, 'min-h-28 py-2.5 leading-relaxed', className)} {...rest} />
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(control, 'h-11 cursor-pointer pe-3', className)} {...rest}>
      {children}
    </select>
  )
}

/** A labelled field that wires the id for you. */
export function useFieldId() {
  return useId()
}

/* ───────────── People ───────────── */

export function Avatar({ name, size = 'md', tone = 'navy' }: { name: string; size?: 'sm' | 'md' | 'lg'; tone?: 'navy' | 'light' }) {
  const s = { sm: 'size-7 text-[0.7rem]', md: 'size-9 text-xs', lg: 'size-12 text-sm' }[size]
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold',
        tone === 'navy' ? 'bg-tint-blue text-navy' : 'bg-white/12 text-white',
        s,
      )}
    >
      {initials(name)}
    </span>
  )
}

/* ───────────── Progress ───────────── */

export function Progress({ value, color = '#0A0F3C', label }: { value: number; color?: string; label: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6e6ee]"
    >
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${v}%`, background: color }} />
    </div>
  )
}

/* ───────────── Tabs (segmented) ───────────── */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: ReactNode; count?: number }[]
  label: string
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-[#e8e8ee] p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          type="button"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors duration-150',
            value === o.value ? 'bg-white text-navy shadow-card' : 'text-slate hover:text-navy',
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="tabular text-xs opacity-70">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

/* ───────────── Toast ───────────── */

const ToastContext = createContext<(message: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string }[]>([])
  const push = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setItems((xs) => [...xs, { id, message }])
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3600)
  }, [])
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl bg-navy px-4 py-3 text-sm text-white shadow-raised"
            style={{ animation: 'toast-in 240ms var(--ease-out-expo)' }}
          >
            <CheckCircle2 className="size-4 text-green" aria-hidden />
            <span>{t.message}</span>
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))}
              className="rounded p-0.5 text-white/60 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext)

/* ───────────── Key/value ───────────── */

export function Meta({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-slate">{label}</dt>
      <dd className="font-semibold text-navy">{children}</dd>
    </div>
  )
}
