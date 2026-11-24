import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Star } from '@/components/brand'
import { Button, ButtonLink, Field, Input, Select, Textarea } from '@/components/ui'
import { ENTRY_POINTS, TRACKS } from '@/data/program'
import type { EntryPoint, Track } from '@/data/types'
import { cn } from '@/lib/cn'
import { useStore } from '@/store/AppStore'
import PageHero from './PageHero'

const STEPS = ['المسار', 'بياناتك', 'الفكرة', 'المراجعة']

interface FormState {
  track: Track | ''
  entry: EntryPoint | ''
  leadName: string
  email: string
  phone: string
  college: string
  teamName: string
  teamSize: number
  problem: string
  idea: string
}

const empty: FormState = {
  track: '',
  entry: '',
  leadName: '',
  email: '',
  phone: '',
  college: '',
  teamName: '',
  teamSize: 1,
  problem: '',
  idea: '',
}

type Errors = Partial<Record<keyof FormState, string>>

const validate = (step: number, f: FormState): Errors => {
  const e: Errors = {}
  if (step === 0) {
    if (!f.track) e.track = 'اختاري المسار المناسب لمرحلة مشروعك.'
    if (!f.entry) e.entry = 'اختاري نقطة الدخول.'
  }
  if (step === 1) {
    if (f.leadName.trim().length < 3) e.leadName = 'اكتبي اسمك الكامل.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'البريد الإلكتروني غير صحيح، مثال: name@pnu.edu.sa'
    if (!/^05\d{8}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'رقم الجوال يبدأ بـ 05 ويتكوّن من 10 أرقام.'
    if (!f.college.trim()) e.college = 'اكتبي الكلية أو الجهة.'
  }
  if (step === 2) {
    if (f.problem.trim().length < 15) e.problem = 'صفي المشكلة في جملة أو جملتين على الأقل.'
    if (f.idea.trim().length < 15) e.idea = 'صفي فكرتك أو منتجك في جملة أو جملتين على الأقل.'
  }
  return e
}

export default function Apply() {
  const { actions } = useStore()
  const [step, setStep] = useState(0)
  const [f, setF] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF((x) => ({ ...x, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const next = (e?: FormEvent) => {
    e?.preventDefault()
    const errs = validate(step, f)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]')
      first?.focus()
      return
    }
    if (step < 3) setStep(step + 1)
    else {
      actions.submitApplication({ ...f, track: f.track as Track, entry: f.entry as EntryPoint })
      setDone(true)
    }
  }

  return (
    <>
      <PageHero
        title="سجّلي اهتمامك في سُدُم"
        lede="أربع خطوات قصيرة. نراجع كل طلب خلال أسبوع، ونتواصل معكِ بموعد مقابلة الفرز (10 دقائق) أو بالمرحلة الأنسب لمشروعك."
      />
      <section className="bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
          {done ? (
            <div className="rounded-xl border border-line bg-white p-8 shadow-card md:p-10" role="status">
              <Star className="size-10" color="#39B67E" />
              <h2 className="mt-5 text-2xl font-bold text-navy">استلمنا طلبك، {f.leadName.split(' ')[0]}</h2>
              <p className="mt-3 text-slate">
                سيصلك بريد على <span className="font-semibold text-navy" dir="ltr">{f.email}</span> خلال أسبوع بالخطوة التالية.
              </p>
              <div className="mt-6 rounded-lg bg-tint-blue px-4 py-3 text-sm text-navy">
                هذه نسخة تجريبية: ادخلي المنصة بصفة «إدارة البرنامج» لتري طلبك في قائمة الطلبات الجديدة.
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/login">جرّبي المنصة</ButtonLink>
                <ButtonLink to="/" variant="secondary">
                  العودة للرئيسية
                </ButtonLink>
              </div>
            </div>
          ) : (
            <form onSubmit={next} noValidate className="rounded-xl border border-line bg-white shadow-card">
              <ol className="flex border-b border-line" aria-label="خطوات التقديم">
                {STEPS.map((label, i) => (
                  <li
                    key={label}
                    aria-current={i === step ? 'step' : undefined}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-2 border-b-2 px-2 py-4 text-sm',
                      i === step ? 'border-navy font-bold text-navy' : i < step ? 'border-transparent text-green-ink' : 'border-transparent text-slate',
                    )}
                  >
                    {i < step ? <Check className="size-4" aria-hidden /> : <span className="tabular">{i + 1}</span>}
                    <span className="hidden sm:inline">{label}</span>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-6 p-6 md:p-8">
                {step === 0 && (
                  <>
                    <fieldset>
                      <legend className="text-lg font-bold text-navy">في أي مرحلة مشروعك؟</legend>
                      <div className="mt-4 grid gap-3" role="radiogroup">
                        {(Object.keys(TRACKS) as Track[]).map((t) => (
                          <label
                            key={t}
                            className={cn(
                              'flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors',
                              f.track === t ? 'border-navy bg-tint-blue/50' : 'border-line-strong hover:border-navy/40',
                            )}
                          >
                            <input
                              type="radio"
                              name="track"
                              className="mt-1 size-4 accent-navy"
                              checked={f.track === t}
                              onChange={() => set('track', t)}
                              aria-invalid={!!errors.track}
                            />
                            <span>
                              <span className="block font-semibold text-navy">{TRACKS[t].label}</span>
                              <span className="block text-sm text-slate">{TRACKS[t].detail}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.track && <p className="mt-2 text-sm text-danger" role="alert">{errors.track}</p>}
                    </fieldset>
                    <Field label="نقطة الدخول" htmlFor="entry" error={errors.entry} required>
                      <Select id="entry" value={f.entry} onChange={(e) => set('entry', e.target.value as EntryPoint)} aria-invalid={!!errors.entry}>
                        <option value="">اختاري…</option>
                        {(Object.keys(ENTRY_POINTS) as EntryPoint[]).map((k) => (
                          <option key={k} value={k}>
                            {ENTRY_POINTS[k].label}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field label="الاسم الكامل" htmlFor="name" error={errors.leadName} required>
                      <Input id="name" autoComplete="name" value={f.leadName} onChange={(e) => set('leadName', e.target.value)} aria-invalid={!!errors.leadName} />
                    </Field>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="البريد الإلكتروني" htmlFor="email" error={errors.email} required>
                        <Input id="email" name="email" type="email" dir="ltr" spellCheck={false} autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} />
                      </Field>
                      <Field label="رقم الجوال" htmlFor="phone" error={errors.phone} required>
                        <Input id="phone" type="tel" dir="ltr" inputMode="numeric" autoComplete="tel" placeholder="05XXXXXXXX" value={f.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} />
                      </Field>
                    </div>
                    <Field label="الكلية أو الجهة" htmlFor="college" error={errors.college} hint="مثال: كلية علوم الحاسب والمعلومات، أو اسم منشأتك" required>
                      <Input id="college" value={f.college} onChange={(e) => set('college', e.target.value)} aria-invalid={!!errors.college} />
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="grid gap-6 sm:grid-cols-[1fr_10rem]">
                      <Field label="اسم الفريق أو المشروع" htmlFor="team" hint="اتركيه فارغًا إن لم يكن لديكِ فريق بعد">
                        <Input id="team" value={f.teamName} onChange={(e) => set('teamName', e.target.value)} />
                      </Field>
                      <Field label="عدد أعضاء الفريق" htmlFor="size">
                        <Input id="size" type="number" min={1} max={6} value={f.teamSize} onChange={(e) => set('teamSize', Number(e.target.value) || 1)} />
                      </Field>
                    </div>
                    <Field label="ما المشكلة التي تحلّينها؟ ولمن؟" htmlFor="problem" error={errors.problem} required>
                      <Textarea id="problem" value={f.problem} onChange={(e) => set('problem', e.target.value)} aria-invalid={!!errors.problem} />
                    </Field>
                    <Field label="ما فكرتك أو منتجك؟ وأين وصلتِ؟" htmlFor="idea" error={errors.idea} required>
                      <Textarea id="idea" value={f.idea} onChange={(e) => set('idea', e.target.value)} aria-invalid={!!errors.idea} />
                    </Field>
                  </>
                )}

                {step === 3 && (
                  <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    {[
                      ['المسار', f.track ? TRACKS[f.track].label : ''],
                      ['نقطة الدخول', f.entry ? ENTRY_POINTS[f.entry].label : ''],
                      ['الاسم', f.leadName],
                      ['البريد', f.email],
                      ['الجوال', f.phone],
                      ['الكلية أو الجهة', f.college],
                      ['الفريق', f.teamName ? `${f.teamName} · ${f.teamSize} أعضاء` : 'بدون فريق بعد'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-sm text-slate">{k}</dt>
                        <dd className="font-semibold text-navy">{v}</dd>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <dt className="text-sm text-slate">المشكلة</dt>
                      <dd className="text-navy">{f.problem}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm text-slate">الفكرة</dt>
                      <dd className="text-navy">{f.idea}</dd>
                    </div>
                  </dl>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4 md:px-8">
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    <ArrowRight className="size-4" aria-hidden />
                    السابق
                  </Button>
                ) : (
                  <Link to="/program" className="text-sm font-semibold text-blue-ink hover:underline">
                    لم تقرري بعد؟ تعرّفي على المراحل
                  </Link>
                )}
                <Button type="submit">
                  {step < 3 ? 'التالي' : 'إرسال الطلب'}
                  {step < 3 && <ArrowLeft className="size-4" aria-hidden />}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
