import { TODAY } from '@/data/program'

const parse = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00`)

const dayMonth = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long' })
const full = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })
const weekday = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { weekday: 'long' })
const monthName = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { month: 'long' })

export const fmtDay = (iso: string) => dayMonth.format(parse(iso))
export const fmtDate = (iso: string) => full.format(parse(iso))
export const fmtWeekday = (iso: string) => weekday.format(parse(iso))
export const fmtMonth = (month: number) => monthName.format(new Date(2027, month, 15))

export const daysBetween = (from: string, to: string) =>
  Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000)

export const daysFromToday = (iso: string) => daysBetween(TODAY, iso)

/** Saudi working week: Sunday–Thursday. */
export const addWorkingDays = (iso: string, n: number) => {
  const d = parse(iso)
  let left = n
  while (left > 0) {
    d.setDate(d.getDate() + 1)
    const day = d.getDay()
    if (day !== 5 && day !== 6) left--
  }
  return d.toISOString().slice(0, 10)
}

export const isPast = (iso: string) => iso.slice(0, 10) < TODAY
export const isToday = (iso: string) => iso.slice(0, 10) === TODAY

export const relativeDays = (iso: string) => {
  const n = daysFromToday(iso)
  if (n === 0) return 'اليوم'
  if (n === 1) return 'غدًا'
  if (n === -1) return 'أمس'
  if (n > 0) return n <= 10 ? `بعد ${n} أيام` : `بعد ${n} يومًا`
  return -n <= 10 ? `قبل ${-n} أيام` : `قبل ${-n} يومًا`
}

/** Position of a date within the 2027 calendar year, 0–1. */
export const yearFraction = (iso: string) => {
  const start = new Date('2027-01-01T00:00:00').getTime()
  const end = new Date('2028-01-01T00:00:00').getTime()
  return (parse(iso).getTime() - start) / (end - start)
}
