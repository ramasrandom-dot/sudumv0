import { useEffect, useState, type FormEvent } from 'react'
import { ImagePlus } from 'lucide-react'
import { Star } from '@/components/brand'
import { Button, ButtonLink, Field, Input, Textarea } from '@/components/ui'
import { EXPERTISE, ROLE_COLOR, ROLE_LABEL } from '@/data/program'
import type { NominationKind } from '@/data/types'
import { cn } from '@/lib/cn'
import { useStore } from '@/store/AppStore'
import ProfileCard from './ProfileCard'

const MAX_AREAS = 3
const MAX_BIO = 200

/**
 * One form for mentors, experts and judges. It asks for exactly what the profile card shows,
 * and the card beside it fills in as you type.
 */
export default function JoinForm({ kind }: { kind: NominationKind }) {
  const { actions } = useStore()
  const tone = ROLE_COLOR[kind]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [org, setOrg] = useState('')
  const [years, setYears] = useState(5)
  const [areas, setAreas] = useState<string[]>([])
  const [bio, setBio] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [photo, setPhoto] = useState<string>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo)
  }, [photo])

  const toggle = (a: string) => setAreas((xs) => (xs.includes(a) ? xs.filter((x) => x !== a) : xs.length < MAX_AREAS ? [...xs, a] : xs))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (name.trim().length < 3) errs.name = 'اكتب الاسم الكامل.'
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'البريد الإلكتروني غير صحيح.'
    if (!title.trim()) errs.title = 'اكتب المسمى الوظيفي.'
    if (!org.trim()) errs.org = 'اكتب جهة العمل.'
    if (!areas.length) errs.areas = 'اختر مجالًا واحدًا على الأقل.'
    if (bio.trim().length < 20) errs.bio = 'اكتب نبذة من جملة أو جملتين.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')?.focus())
      return
    }
    actions.submitNomination({ name: name.trim(), email: email.trim(), title: title.trim(), org: org.trim(), years, kind, areas, note: bio.trim() })
    setDone(true)
  }

  const profile = {
    name: name.trim() || 'الاسم الكامل',
    title: title.trim() || 'المسمى الوظيفي',
    org: org.trim() || 'الجهة',
    areas: areas.length ? areas : ['مجال الخبرة'],
    bio: bio.trim() || 'نبذتك القصيرة تظهر هنا.',
    photo,
  }

  if (done) {
    return (
      <div className="mx-auto grid max-w-4xl gap-8 rounded-2xl border border-line bg-white p-8 shadow-card md:grid-cols-[1fr_17rem] md:p-10" role="status">
        <div>
          <Star className="size-10" color={tone.color} />
          <h2 className="mt-5 text-2xl font-bold text-navy">وصل طلبك، شكرًا لك</h2>
          <p className="mt-3 text-slate">بعد الاعتماد يظهر ملفك هكذا في صفحة الشبكة.</p>
          <div className="mt-6 rounded-xl bg-tint-blue px-4 py-3 text-sm text-navy">نسخة تجريبية: طلبك يظهر الآن عند «إدارة البرنامج».</div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/login">جرّب المنصة</ButtonLink>
            <ButtonLink to="/" variant="secondary">
              العودة للرئيسية
            </ButtonLink>
          </div>
        </div>
        <ProfileCard kind={kind} profile={profile} />
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_19rem] lg:items-start">
      <form onSubmit={submit} noValidate className="flex flex-col gap-8 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <p className="flex items-center gap-2 px-6 py-3 text-sm font-bold md:px-8" style={{ background: tone.color, color: tone.on }}>
          <Star className="size-4" />
          ملف {ROLE_LABEL[kind]}
        </p>

        <div className="flex flex-col gap-8 px-6 pb-6 md:px-8 md:pb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span aria-hidden className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full" style={{ background: tone.tint, color: tone.ink }}>
              {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <ImagePlus className="size-7" />}
            </span>
            <div>
              <label htmlFor="j-photo" className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-line-strong bg-white px-4 text-[0.9375rem] font-semibold text-navy hover:border-navy/40 has-focus-visible:ring-3 has-focus-visible:ring-blue/30">
                {photo ? 'تغيير الصورة' : 'إضافة صورة شخصية'}
                <input
                  id="j-photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setPhoto(URL.createObjectURL(file))
                  }}
                />
              </label>
              <p className="mt-1 text-sm text-slate">اختياري. صورة مربعة واضحة للوجه.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="الاسم الكامل" htmlFor="j-name" error={errors.name} required>
              <Input id="j-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
            </Field>
            <Field label="البريد الإلكتروني" htmlFor="j-email" error={errors.email} hint="للتواصل فقط، ولا يظهر في الملف" required>
              <Input id="j-email" name="email" type="email" dir="ltr" spellCheck={false} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
            </Field>
            <Field label="المسمى الوظيفي" htmlFor="j-title" error={errors.title} required>
              <Input id="j-title" autoComplete="organization-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={!!errors.title} />
            </Field>
            <Field label="الجهة" htmlFor="j-org" error={errors.org} required>
              <Input id="j-org" autoComplete="organization" value={org} onChange={(e) => setOrg(e.target.value)} aria-invalid={!!errors.org} />
            </Field>
            <Field label="سنوات الخبرة" htmlFor="j-years">
              <Input id="j-years" type="number" min={0} max={50} value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} />
            </Field>
            <Field label="رابط لينكدإن" htmlFor="j-linkedin" hint="اختياري">
              <Input id="j-linkedin" type="url" dir="ltr" spellCheck={false} placeholder="https://linkedin.com/in/" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </Field>
          </div>

          <Field label="نبذة قصيرة" htmlFor="j-bio" error={errors.bio} hint="جملة أو جملتان عن خبرتك، تظهر في ملفك." required>
            <Textarea id="j-bio" className="min-h-24" maxLength={MAX_BIO} value={bio} onChange={(e) => setBio(e.target.value)} aria-invalid={!!errors.bio} />
            <p dir="ltr" className="tabular -mt-0.5 text-left text-xs text-slate" aria-hidden>
              {bio.length} / {MAX_BIO}
            </p>
          </Field>

          <fieldset>
            <legend className="text-lg font-bold text-navy">مجالات الخبرة</legend>
            <p className="mt-1 text-sm text-slate">
              اختر حتى {MAX_AREAS} مجالات. <span className="tabular">({areas.length} من {MAX_AREAS})</span>
            </p>
            {errors.areas && (
              <p className="mt-2 text-sm text-danger" role="alert" tabIndex={-1}>
                {errors.areas}
              </p>
            )}
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {EXPERTISE.map((g) => (
                <div key={g.id}>
                  <p className="flex items-center gap-2 text-sm font-bold text-navy">
                    <Star className="size-3" color={tone.color} />
                    {g.title}
                  </p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {g.fields.map((a) => {
                      const checked = areas.includes(a)
                      const full = !checked && areas.length >= MAX_AREAS
                      return (
                        <li key={a}>
                          <label className={cn('flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm text-navy', full ? 'opacity-50' : 'cursor-pointer hover:bg-canvas')}>
                            <input type="checkbox" className="mt-1 size-4 shrink-0 accent-teal" checked={checked} disabled={full} onChange={() => toggle(a)} />
                            {a}
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-end border-t border-line pt-6">
            <Button type="submit" size="lg">
              إرسال الطلب
            </Button>
          </div>
        </div>
      </form>

      <aside className="lg:sticky lg:top-24" aria-label="معاينة الملف">
        <p className="mb-3 text-sm font-bold text-navy">هكذا يظهر ملفك</p>
        <ProfileCard kind={kind} profile={profile} muted={!name.trim()} />
      </aside>
    </div>
  )
}
