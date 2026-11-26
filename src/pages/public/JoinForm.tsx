import { useState, type FormEvent } from 'react'
import { Star } from '@/components/brand'
import { Button, ButtonLink, Field, Input, Textarea } from '@/components/ui'
import { EXPERTISE } from '@/data/program'
import type { NominationKind } from '@/data/types'
import { useStore } from '@/store/AppStore'

/** The request to join as a mentor, expert or judge. The role is chosen before this form opens. */
export default function JoinForm({ kind }: { kind: NominationKind }) {
  const { actions } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [years, setYears] = useState(5)
  const [areas, setAreas] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const toggle = (a: string) => setAreas((xs) => (xs.includes(a) ? xs.filter((x) => x !== a) : [...xs, a]))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (name.trim().length < 3) errs.name = 'اكتب الاسم الكامل.'
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'البريد الإلكتروني غير صحيح.'
    if (!org.trim()) errs.org = 'اكتب جهة العمل أو المسمى المهني.'
    if (!areas.length) errs.areas = 'اختر مجالًا واحدًا على الأقل.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')?.focus())
      return
    }
    actions.submitNomination({ name, email, org, years, kind, areas, note })
    setDone(true)
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 shadow-card md:p-10" role="status">
        <Star className="size-10" color="#2086C2" />
        <h2 className="mt-5 text-2xl font-bold text-navy">وصل طلبك، شكرًا لك</h2>
        <p className="mt-3 text-slate">نتواصل معك قريبًا.</p>
        <div className="mt-6 rounded-xl bg-tint-blue px-4 py-3 text-sm text-navy">نسخة تجريبية: طلبك يظهر الآن عند «إدارة البرنامج».</div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/login">جرّب المنصة</ButtonLink>
          <ButtonLink to="/" variant="secondary">
            العودة للرئيسية
          </ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8 rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="الاسم الكامل" htmlFor="j-name" error={errors.name} required>
          <Input id="j-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
        </Field>
        <Field label="البريد الإلكتروني" htmlFor="j-email" error={errors.email} required>
          <Input id="j-email" name="email" type="email" dir="ltr" spellCheck={false} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
        </Field>
        <Field label="جهة العمل أو المسمى المهني" htmlFor="j-org" error={errors.org} required>
          <Input id="j-org" value={org} onChange={(e) => setOrg(e.target.value)} aria-invalid={!!errors.org} />
        </Field>
        <Field label="سنوات الخبرة" htmlFor="j-years">
          <Input id="j-years" type="number" min={0} max={50} value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} />
        </Field>
      </div>

      <fieldset>
        <legend className="text-lg font-bold text-navy">مجالات الخبرة</legend>
        <p className="mt-1 text-sm text-slate">اختر كل ما ينطبق عليك.</p>
        {errors.areas && (
          <p className="mt-2 text-sm text-danger" role="alert" tabIndex={-1}>
            {errors.areas}
          </p>
        )}
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {EXPERTISE.map((g) => (
            <div key={g.id}>
              <p className="flex items-center gap-2 text-sm font-bold text-navy">
                <Star className="size-3" color="#2086C2" />
                {g.title}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {g.fields.map((a) => (
                  <li key={a}>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm text-navy hover:bg-canvas">
                      <input type="checkbox" className="mt-1 size-4 shrink-0 accent-navy" checked={areas.includes(a)} onChange={() => toggle(a)} />
                      {a}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </fieldset>

      <Field label="نبذة قصيرة" htmlFor="j-note" hint="اختياري">
        <Textarea id="j-note" value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>

      <div className="flex justify-end border-t border-line pt-6">
        <Button type="submit" size="lg">
          إرسال الطلب
        </Button>
      </div>
    </form>
  )
}
