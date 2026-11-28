import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react'
import { Star } from '@/components/brand'
import { Button, ButtonLink, Field, Input, Select, Textarea } from '@/components/ui'
import { STAGE, TRACKS, WORKSHOPS } from '@/data/program'
import type { EntryPoint, Track } from '@/data/types'
import { cn } from '@/lib/cn'
import { scrollToY } from '@/lib/SmoothScroll'
import { useStore } from '@/store/AppStore'
import PageHero from './PageHero'

/**
 * One registration form per way in. The الإلهام form follows «نموذج التسجيل في حاضنة سدم»:
 * eligibility is checked first, and nothing is saved for a team that does not meet it.
 * The two open-seat forms ask for proof of what the stage expects (a tested prototype, a working product).
 */

const STEPS: Record<Track, string[]> = {
  ilham: ['الأهلية', 'بياناتك', 'الفريق', 'فكرتك', 'الإقرارات'],
  'tamkeen-seat': ['الأهلية', 'بياناتك', 'الفريق', 'نموذجك الأولي', 'الإقرارات'],
  'intilaq-seat': ['الأهلية', 'بياناتك', 'الفريق', 'منتجك', 'الإقرارات'],
}

const ELIGIBILITY = [
  { id: 'student', label: 'طالبة في الجامعة' },
  { id: 'staff', label: 'منسوبة للجامعة', hint: 'موظفة، عضو هيئة تدريس، باحثة' },
  { id: 'founder', label: 'مؤسِّسة', hint: 'عضو نسائي من خارج الجامعة' },
  { id: 'cofounder', label: 'شريكة مؤسِّسة', hint: 'عضو نسائي من خارج الجامعة' },
  { id: 'none', label: 'لا شيء مما سبق' },
]

const STANDINGS = ['طالبة', 'خريجة', 'عضو هيئة تدريس', 'باحثة', 'موظفة', 'من خارج الجامعة']
const STAFF = ['عضو هيئة تدريس', 'باحثة', 'موظفة']
const LEVELS = ['بكالوريوس', 'ماجستير', 'دكتوراه']
const TEAM_ROLES = ['قيادة', 'بحث', 'تصميم', 'تقنية', 'أخرى']
const EVIDENCE = ['عشتها بنفسي', 'لاحظتها حولي', 'من بحث أو بيانات', 'سمعتها من آخرين']
const ORIGINS = ['مخرج بحثي', 'مشروع تخرج', 'فكرة جديدة', 'مشروع قائم']
const MATURITY = ['خاطرة', 'دُرست جزئيًا', 'نموذج أولي']
const BACKGROUND = ['لا يوجد', 'حضور فعاليات', 'مسابقات', 'مشروع قائم']
const HEARD = ['إعلان', 'بريد جامعي', 'زميلة', 'فعالية']
const REGISTERED = ['نعم', 'قيد التسجيل', 'لا']
const ACKS = [
  'أقرّ بصحة المعلومات.',
  'أوافق على التواصل معي بالبريد والجوال بخصوص الحاضنة فقط.',
  'أعلم أن اتفاقية المشاركة والسرية تُوقَّع عند القبول.',
]

interface Member {
  name: string
  email: string
  standing: string
  role: string
}

interface F {
  eligibility: string[]
  leadName: string
  phone: string
  email: string
  standing: string
  college: string
  level: string
  uniId: string
  gradYear: string
  mode: '' | 'solo' | 'team'
  teamName: string
  role: string
  members: Member[]
  problem: string
  affected: string
  evidence: string[]
  prior: string
  idea: string
  origin: string
  maturity: string
  product: string
  link: string
  users: string
  learned: string
  pilot: boolean
  model: string
  registered: string
  interview: '' | 'yes' | 'no'
  background: string[]
  heard: string[]
  attended: string[]
  ack: boolean[]
}

const empty: F = {
  eligibility: [],
  leadName: '',
  phone: '',
  email: '',
  standing: '',
  college: '',
  level: '',
  uniId: '',
  gradYear: '',
  mode: '',
  teamName: '',
  role: '',
  members: [],
  problem: '',
  affected: '',
  evidence: [],
  prior: '',
  idea: '',
  origin: '',
  maturity: '',
  product: '',
  link: '',
  users: '',
  learned: '',
  pilot: false,
  model: '',
  registered: '',
  interview: '',
  background: [],
  heard: [],
  attended: [],
  ack: [false, false, false],
}

type Errors = Record<string, string>

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v)
const isLink = (v: string) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+\S*$/.test(v.trim())

const validate = (door: Track, step: number, f: F): Errors => {
  const e: Errors = {}
  if (step === 0 && !f.eligibility.length) e.eligibility = 'اختاري خيارًا واحدًا على الأقل.'
  if (step === 1) {
    if (f.leadName.trim().length < 3) e.leadName = 'اكتبي اسمك الكامل.'
    if (!/^05\d{8}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'رقم الجوال يبدأ بـ 05 ويتكوّن من 10 أرقام.'
    if (!isEmail(f.email)) e.email = 'البريد الإلكتروني غير صحيح، مثال: name@pnu.edu.sa'
    if (!f.standing) e.standing = 'اختاري صفتك.'
    if (!f.college.trim()) e.college = f.standing === 'من خارج الجامعة' ? 'اكتبي جهتك.' : 'اكتبي الكلية أو الإدارة.'
    if (f.standing === 'طالبة' && !f.level) e.level = 'اختاري المرحلة الدراسية.'
    if ((f.standing === 'طالبة' || STAFF.includes(f.standing)) && !/^\d{4,12}$/.test(f.uniId.trim())) e.uniId = 'اكتبي الرقم بالأرقام فقط.'
    if (f.standing === 'خريجة' && !/^(19|20)\d{2}$/.test(f.gradYear.trim())) e.gradYear = 'اكتبي سنة التخرج، مثال: 2025'
  }
  if (step === 2) {
    if (!f.mode) e.mode = 'اختاري طريقة التقديم.'
    if (door !== 'ilham' && !f.teamName.trim()) e.teamName = 'اكتبي اسم المشروع.'
    if (f.mode === 'team') {
      if (!f.role) e.role = 'اختاري دورك في الفريق.'
      f.members.forEach((m, i) => {
        if (m.name.trim().length < 3) e[`m${i}name`] = 'اكتبي اسم العضو.'
        if (!isEmail(m.email)) e[`m${i}email`] = 'البريد غير صحيح.'
        if (!m.standing) e[`m${i}standing`] = 'اختاري الصفة.'
        if (!m.role) e[`m${i}role`] = 'اختاري الدور.'
      })
    }
  }
  if (step === 3) {
    if (f.problem.trim().length < 15) e.problem = 'صفي المشكلة في جملة على الأقل.'
    if (door === 'ilham') {
      if (f.affected.trim().length < 5) e.affected = 'اكتبي من يتأثر بالمشكلة.'
      if (!f.evidence.length) e.evidence = 'اختاري خيارًا واحدًا على الأقل.'
      if (!f.origin) e.origin = 'اختاري أصل الفكرة.'
      if (!f.maturity) e.maturity = 'اختاري مرحلة الفكرة.'
    } else {
      if (f.product.trim().length < 15) e.product = door === 'tamkeen-seat' ? 'صفي النموذج الأولي في جملة على الأقل.' : 'صفي المنتج في جملة على الأقل.'
      if (!isLink(f.link)) e.link = 'اكتبي رابطًا صحيحًا، مثال: https://example.com'
      const users = Number(f.users)
      if (f.users.trim() === '' || Number.isNaN(users) || users < 0) e.users = 'اكتبي العدد بالأرقام.'
      else if (door === 'tamkeen-seat' && users < 5) e.users = 'الحد الأدنى 5 مستخدمين جرّبوا النموذج.'
      else if (door === 'intilaq-seat' && users < 20 && !f.pilot) e.users = 'الحد الأدنى 20 مستخدمًا، أو تجربة ميدانية.'
      if (door === 'tamkeen-seat' && f.learned.trim().length < 10) e.learned = 'اكتبي أهم ما تعلمتِه من التجربة.'
      if (door === 'intilaq-seat') {
        if (f.model.trim().length < 10) e.model = 'اكتبي كيف يحقق المشروع دخله.'
        if (!f.registered) e.registered = 'اختاري حالة التسجيل.'
      }
    }
  }
  if (step === 4) {
    if (!f.interview) e.interview = 'اختاري نعم أو لا.'
    if (f.ack.some((a) => !a)) e.ack = 'الإقرارات الثلاثة مطلوبة لإرسال الطلب.'
  }
  return e
}

const entryOf = (standing: string): EntryPoint => (standing === 'طالبة' || standing === 'خريجة' ? 'student' : standing === 'عضو هيئة تدريس' || standing === 'باحثة' ? 'research' : 'founder')

/* ───────────── Small form parts ───────────── */

function Choice({
  type,
  name,
  checked,
  onChange,
  label,
  hint,
  invalid,
}: {
  type: 'radio' | 'checkbox'
  name: string
  checked: boolean
  onChange: () => void
  label: string
  hint?: string
  invalid?: boolean
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
        checked ? 'border-teal bg-tint-teal/60' : 'border-line-strong hover:border-teal/50',
      )}
    >
      <input type={type} name={name} className="mt-1 size-4 shrink-0 accent-teal" checked={checked} onChange={onChange} aria-invalid={invalid || undefined} />
      <span>
        <span className="block font-medium text-navy">{label}</span>
        {hint && <span className="block text-sm text-slate">{hint}</span>}
      </span>
    </label>
  )
}

function Chips({ label, options, value, onChange, error, single }: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void; error?: string; single?: boolean }) {
  const toggle = (o: string) => onChange(single ? [o] : value.includes(o) ? value.filter((x) => x !== o) : [...value, o])
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-navy">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o)
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              aria-invalid={!!error || undefined}
              onClick={() => toggle(o)}
              className={cn(
                'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                on ? 'border-teal bg-teal text-white' : 'border-line-strong bg-white text-navy hover:border-teal/50',
              )}
            >
              {on && <Check className="size-4" aria-hidden />}
              {o}
            </button>
          )
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function Counted({ id, value, onChange, max, invalid, short }: { id: string; value: string; onChange: (v: string) => void; max: number; invalid?: boolean; short?: boolean }) {
  return (
    <div>
      <Textarea id={id} maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} className={short ? 'min-h-20' : undefined} />
      <p dir="ltr" className="tabular mt-1 text-left text-xs text-slate" aria-hidden>
        {value.length} / {max}
      </p>
    </div>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
        <Star className="size-4 text-green" />
        {title}
      </h3>
      {children}
    </div>
  )
}

/* ───────────── The form ───────────── */

export default function StageApplication({ door }: { door: Track }) {
  const { actions } = useStore()
  const card = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [f, setF] = useState<F>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'form' | 'blocked' | 'done'>('form')

  const track = TRACKS[door]
  const stage = STAGE[track.stage]
  const steps = STEPS[door]
  const isStaff = STAFF.includes(f.standing)

  const set = <K extends keyof F>(k: K, v: F[K]) => {
    setF((x) => ({ ...x, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }
  const setMember = (i: number, k: keyof Member, v: string) => {
    setF((x) => ({ ...x, members: x.members.map((m, j) => (j === i ? { ...m, [k]: v } : m)) }))
    if (errors[`m${i}${k}`]) setErrors((e) => ({ ...e, [`m${i}${k}`]: '' }))
  }

  const toTop = () => {
    requestAnimationFrame(() => {
      if (card.current) scrollToY(card.current.getBoundingClientRect().top + window.scrollY - 96, 0.5)
    })
  }

  // «لا شيء مما سبق» stands alone: choosing it clears the rest, and the reverse.
  const toggleEligibility = (id: string) => {
    const has = f.eligibility.includes(id)
    const next = id === 'none' ? (has ? [] : ['none']) : has ? f.eligibility.filter((x) => x !== id) : [...f.eligibility.filter((x) => x !== 'none'), id]
    set('eligibility', next)
  }

  const go = (e?: FormEvent) => {
    e?.preventDefault()
    const errs = validate(door, step, f)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    if (step === 0 && f.eligibility.includes('none')) {
      setState('blocked')
      toTop()
      return
    }
    if (step < steps.length - 1) {
      setStep(step + 1)
      toTop()
      return
    }
    const eligibility = ELIGIBILITY.filter((x) => f.eligibility.includes(x.id)).map((x) => x.label)
    const details = [
      { label: 'الأهلية', value: eligibility.join('، ') },
      { label: 'الصفة', value: [f.standing, f.level, f.gradYear && `خريجة ${f.gradYear}`].filter(Boolean).join(' · ') },
      { label: f.standing === 'طالبة' ? 'الرقم الجامعي' : 'الرقم الوظيفي', value: f.uniId },
      { label: 'طريقة التقديم', value: f.mode === 'team' ? `بفريق من ${1 + f.members.length}` : 'فردية' },
      { label: 'أعضاء الفريق', value: f.members.map((m) => `${m.name} (${m.standing}، ${m.role})`).join('، ') },
      { label: 'من يتأثر بالمشكلة', value: f.affected },
      { label: 'كيف عُرفت المشكلة', value: f.evidence.join('، ') },
      { label: 'حلول سابقة، ولماذا الآن', value: f.prior },
      { label: 'أصل الفكرة', value: f.origin },
      { label: 'مرحلة الفكرة', value: f.maturity },
      { label: door === 'tamkeen-seat' ? 'رابط النموذج الأولي' : 'رابط المنتج', value: door === 'ilham' ? '' : f.link },
      { label: door === 'tamkeen-seat' ? 'عدد من جرّبوا النموذج' : 'عدد المستخدمين', value: door === 'ilham' ? '' : f.users + (f.pilot ? ' · تجربة ميدانية' : '') },
      { label: 'أهم ما تعلّمه الفريق من التجربة', value: f.learned },
      { label: 'مصدر الدخل', value: f.model },
      { label: 'الشركة مسجّلة', value: f.registered },
      { label: 'الحضور للمقابلة', value: f.interview === 'yes' ? 'نعم' : 'لا' },
      { label: 'مشاركات ريادية سابقة', value: f.background.join('، ') },
      { label: 'كيف عرفت بالحاضنة', value: f.heard.join('، ') },
      { label: 'الفعاليات التي حضرتها', value: f.attended.join('، ') },
    ].filter((d) => d.value)
    actions.submitApplication({
      track: door,
      entry: entryOf(f.standing),
      leadName: f.leadName.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      college: f.college.trim(),
      teamName: f.teamName.trim(),
      teamSize: f.mode === 'team' ? 1 + f.members.length : 1,
      problem: f.problem.trim(),
      idea: (door === 'ilham' ? f.idea : f.product).trim(),
      details,
    })
    setState('done')
    toTop()
  }

  const lede = door === 'ilham' ? 'يفتح يوم 24 ديسمبر ويغلق يوم 4 فبراير. يأخذ نحو 7 دقائق.' : `${track.seats}، والتقديم ${stage.registration.window}.`

  return (
    <>
      <PageHero title={track.door} lede={lede}>
        <Link to="/apply?as=participant" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
          <ArrowRight className="size-4" aria-hidden />
          تغيير المرحلة
        </Link>
      </PageHero>
      <section className="bg-canvas">
        <div ref={card} className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
          {state === 'done' && (
            <div className="rounded-2xl border border-line bg-white p-8 shadow-card md:p-10" role="status">
              <Star className="size-10 text-green" />
              <h2 className="mt-5 text-2xl font-bold text-navy">استلمنا طلبك، {f.leadName.trim().split(' ')[0]}</h2>
              <p className="mt-3 text-slate">
                تصلك نسخة من إجاباتك على <span className="font-medium text-navy" dir="ltr">{f.email}</span>.
              </p>
              <p className="mt-2 text-navy">
                {door === 'ilham' ? 'مقابلات الفرق من 7 إلى 11 فبراير، وتُعلن فرق تكوين يوم 14 فبراير.' : `نرد عليكِ قبل بداية مرحلة ${stage.name}.`}
              </p>
              {f.mode === 'team' && <p className="mt-2 text-slate">تصل كل عضو في فريقك رسالة لتأكيد الانضمام قبل اعتماد الطلب.</p>}
              <div className="mt-6 rounded-xl bg-tint-blue px-4 py-3 text-sm text-navy">نسخة تجريبية: طلبك يظهر الآن عند «إدارة البرنامج».</div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/login">جرّبي المنصة</ButtonLink>
                <ButtonLink to="/" variant="secondary">
                  العودة للرئيسية
                </ButtonLink>
              </div>
            </div>
          )}

          {state === 'blocked' && (
            <div className="rounded-2xl border border-line bg-white p-8 shadow-card md:p-10" role="alert">
              <h2 className="text-2xl font-bold text-navy">لا يستوفي فريقك شرط الأهلية</h2>
              <p className="mt-3 max-w-[52ch] text-lg leading-loose text-slate">نعتذر، لا يستوفي فريقك شرط الأهلية الحالي للحاضنة. يمكنك إضافة عضوة طالبة أو منسوبة إلى الفريق ثم العودة للتقديم.</p>
              <p className="mt-4 text-sm text-slate">لم يُحفظ أي من بياناتك.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    setF(empty)
                    setState('form')
                  }}
                >
                  العودة للتقديم
                </Button>
                <ButtonLink to="/" variant="secondary">
                  العودة للرئيسية
                </ButtonLink>
              </div>
            </div>
          )}

          {state === 'form' && (
            <form onSubmit={go} noValidate className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 text-sm md:px-8" style={{ background: stage.color, color: stage.on }}>
                <p className="flex items-center gap-2 font-bold">
                  <Star className="size-4" />
                  مرحلة {stage.name}
                </p>
                <p className="tabular opacity-90">
                  الخطوة {step + 1} من {steps.length}
                </p>
              </div>
              <ol className="flex border-b border-line" aria-label="خطوات التسجيل">
                {steps.map((label, i) => (
                  <li
                    key={label}
                    aria-current={i === step ? 'step' : undefined}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-2 border-b-2 px-1 py-4 text-sm',
                      i === step ? 'border-teal font-bold text-navy' : i < step ? 'border-transparent text-green-ink' : 'border-transparent text-slate',
                    )}
                  >
                    {i < step ? <Check className="size-4" aria-hidden /> : <span className="tabular">{i + 1}</span>}
                    <span className="hidden sm:inline">{label}</span>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-8 p-6 md:p-8">
                {step === 0 && (
                  <fieldset>
                    <legend className="text-xl font-bold text-navy">هل يضم فريقك، أو أنتِ إن تقدمتِ فردية، أيًّا مما يلي؟</legend>
                    <p className="mt-2 text-slate">يمكن اختيار أكثر من خيار. ويُسمح بوجود الرجال في الفريق.</p>
                    <div className="mt-5 grid gap-3">
                      {ELIGIBILITY.map((o) => (
                        <Choice
                          key={o.id}
                          type="checkbox"
                          name="eligibility"
                          checked={f.eligibility.includes(o.id)}
                          onChange={() => toggleEligibility(o.id)}
                          label={o.label}
                          hint={o.hint}
                          invalid={!!errors.eligibility}
                        />
                      ))}
                    </div>
                    {errors.eligibility && (
                      <p className="mt-3 text-sm text-danger" role="alert">
                        {errors.eligibility}
                      </p>
                    )}
                    <p className="mt-4 rounded-xl bg-canvas px-4 py-3 text-sm text-slate">المؤسِّسة أو الشريكة المؤسِّسة: صاحبة الفكرة، أو من لها حصة مستقبلية في المشروع.</p>
                  </fieldset>
                )}

                {step === 1 && (
                  <>
                    <Group title="بياناتك">
                      <Field label="الاسم الكامل" htmlFor="a-name" error={errors.leadName} hint="كما تودين ظهوره في الشهادات والمراسلات" required>
                        <Input id="a-name" autoComplete="name" value={f.leadName} onChange={(e) => set('leadName', e.target.value)} aria-invalid={!!errors.leadName} />
                      </Field>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="رقم الجوال" htmlFor="a-phone" error={errors.phone} required>
                          <Input id="a-phone" type="tel" dir="ltr" inputMode="numeric" autoComplete="tel" placeholder="05XXXXXXXX" value={f.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} />
                        </Field>
                        <Field label="البريد الإلكتروني" htmlFor="a-email" error={errors.email} hint="البريد الجامعي للطالبات والمنسوبات" required>
                          <Input id="a-email" type="email" dir="ltr" spellCheck={false} autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} />
                        </Field>
                      </div>
                    </Group>
                    <Group title="صفتك">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="الصفة" htmlFor="a-standing" error={errors.standing} required>
                          <Select id="a-standing" value={f.standing} onChange={(e) => set('standing', e.target.value)} aria-invalid={!!errors.standing}>
                            <option value="">اختاري…</option>
                            {STANDINGS.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </Select>
                        </Field>
                        <Field label={f.standing === 'من خارج الجامعة' ? 'الجهة' : 'الكلية أو الإدارة'} htmlFor="a-college" error={errors.college} required>
                          <Input id="a-college" value={f.college} onChange={(e) => set('college', e.target.value)} aria-invalid={!!errors.college} />
                        </Field>
                        {f.standing === 'طالبة' && (
                          <Field label="المرحلة الدراسية" htmlFor="a-level" error={errors.level} required>
                            <Select id="a-level" value={f.level} onChange={(e) => set('level', e.target.value)} aria-invalid={!!errors.level}>
                              <option value="">اختاري…</option>
                              {LEVELS.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </Select>
                          </Field>
                        )}
                        {(f.standing === 'طالبة' || isStaff) && (
                          <Field label={isStaff ? 'الرقم الوظيفي' : 'الرقم الجامعي'} htmlFor="a-uni" error={errors.uniId} hint="للتحقق من الانتساب" required>
                            <Input id="a-uni" dir="ltr" inputMode="numeric" value={f.uniId} onChange={(e) => set('uniId', e.target.value)} aria-invalid={!!errors.uniId} />
                          </Field>
                        )}
                        {f.standing === 'خريجة' && (
                          <Field label="سنة التخرج" htmlFor="a-grad" error={errors.gradYear} required>
                            <Input id="a-grad" dir="ltr" inputMode="numeric" placeholder="2025" value={f.gradYear} onChange={(e) => set('gradYear', e.target.value)} aria-invalid={!!errors.gradYear} />
                          </Field>
                        )}
                      </div>
                    </Group>
                  </>
                )}

                {step === 2 && (
                  <>
                    <fieldset>
                      <legend className="text-xl font-bold text-navy">هل تتقدمين فردية أم بفريق؟</legend>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Choice type="radio" name="mode" checked={f.mode === 'solo'} onChange={() => set('mode', 'solo')} label="فردية" hint={door === 'ilham' ? 'تتشكّل لكِ فرق في الورش.' : 'أنتِ المؤسِّسة الوحيدة.'} invalid={!!errors.mode} />
                        <Choice
                          type="radio"
                          name="mode"
                          checked={f.mode === 'team'}
                          onChange={() => setF((x) => ({ ...x, mode: 'team', members: x.members.length ? x.members : [{ name: '', email: '', standing: '', role: '' }] }))}
                          label="بفريق"
                          hint="من 2 إلى 5 أعضاء."
                          invalid={!!errors.mode}
                        />
                      </div>
                      {errors.mode && (
                        <p className="mt-2 text-sm text-danger" role="alert">
                          {errors.mode}
                        </p>
                      )}
                    </fieldset>

                    <Field label={door === 'ilham' ? 'اسم الفريق أو المشروع' : 'اسم المشروع'} htmlFor="a-team" error={errors.teamName} hint={door === 'ilham' ? 'اختياري' : undefined} required={door !== 'ilham'}>
                      <Input id="a-team" value={f.teamName} onChange={(e) => set('teamName', e.target.value)} aria-invalid={!!errors.teamName} />
                    </Field>

                    {f.mode === 'team' && (
                      <Group title="أعضاء الفريق">
                        <Field label="دورك في الفريق" htmlFor="a-role" error={errors.role} required>
                          <Select id="a-role" value={f.role} onChange={(e) => set('role', e.target.value)} aria-invalid={!!errors.role}>
                            <option value="">اختاري…</option>
                            {TEAM_ROLES.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </Select>
                        </Field>
                        <ul className="flex flex-col gap-4">
                          {f.members.map((m, i) => (
                            <li key={i} className="rounded-xl border border-line-strong p-4">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-navy">العضو {i + 2}</p>
                                {f.members.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => setF((x) => ({ ...x, members: x.members.filter((_, j) => j !== i) }))}
                                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-danger hover:bg-danger-tint"
                                  >
                                    <Trash2 className="size-4" aria-hidden />
                                    حذف
                                  </button>
                                )}
                              </div>
                              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                                <Field label="الاسم" htmlFor={`m${i}-name`} error={errors[`m${i}name`]} required>
                                  <Input id={`m${i}-name`} value={m.name} onChange={(e) => setMember(i, 'name', e.target.value)} aria-invalid={!!errors[`m${i}name`]} />
                                </Field>
                                <Field label="البريد الإلكتروني" htmlFor={`m${i}-email`} error={errors[`m${i}email`]} required>
                                  <Input id={`m${i}-email`} type="email" dir="ltr" spellCheck={false} value={m.email} onChange={(e) => setMember(i, 'email', e.target.value)} aria-invalid={!!errors[`m${i}email`]} />
                                </Field>
                                <Field label="الصفة" htmlFor={`m${i}-standing`} error={errors[`m${i}standing`]} required>
                                  <Select id={`m${i}-standing`} value={m.standing} onChange={(e) => setMember(i, 'standing', e.target.value)} aria-invalid={!!errors[`m${i}standing`]}>
                                    <option value="">اختاري…</option>
                                    {['طالب/ة', 'خريج/ة', 'عضو هيئة تدريس', 'باحث/ة', 'موظف/ة', 'من خارج الجامعة'].map((s) => (
                                      <option key={s}>{s}</option>
                                    ))}
                                  </Select>
                                </Field>
                                <Field label="الدور في الفريق" htmlFor={`m${i}-role`} error={errors[`m${i}role`]} required>
                                  <Select id={`m${i}-role`} value={m.role} onChange={(e) => setMember(i, 'role', e.target.value)} aria-invalid={!!errors[`m${i}role`]}>
                                    <option value="">اختاري…</option>
                                    {TEAM_ROLES.map((s) => (
                                      <option key={s}>{s}</option>
                                    ))}
                                  </Select>
                                </Field>
                              </div>
                            </li>
                          ))}
                        </ul>
                        {f.members.length < 4 && (
                          <Button variant="secondary" className="self-start" onClick={() => setF((x) => ({ ...x, members: [...x.members, { name: '', email: '', standing: '', role: '' }] }))}>
                            <Plus className="size-4" aria-hidden />
                            إضافة عضو
                          </Button>
                        )}
                      </Group>
                    )}
                  </>
                )}

                {step === 3 && door === 'ilham' && (
                  <>
                    <Field label="المشكلة التي تريدين حلها" htmlFor="a-problem" error={errors.problem} hint="صفي المشكلة دون ذكر الحل." required>
                      <Counted id="a-problem" max={600} value={f.problem} onChange={(v) => set('problem', v)} invalid={!!errors.problem} />
                    </Field>
                    <Field label="من يتأثر بالمشكلة؟" htmlFor="a-affected" error={errors.affected} hint="من هم، وأين يعيشون المشكلة." required>
                      <Counted id="a-affected" short max={300} value={f.affected} onChange={(v) => set('affected', v)} invalid={!!errors.affected} />
                    </Field>
                    <Chips label="كيف عرفتِ أنها مشكلة؟ *" options={EVIDENCE} value={f.evidence} onChange={(v) => set('evidence', v)} error={errors.evidence} />
                    <Field label="هل جُرّبت حلول لهذه المشكلة من قبل؟ ولماذا الآن؟" htmlFor="a-prior" hint="اختياري">
                      <Counted id="a-prior" short max={300} value={f.prior} onChange={(v) => set('prior', v)} />
                    </Field>
                    <Field label="فكرتك في جملة" htmlFor="a-idea" hint="اختياري، فالمعيار وضوح المشكلة.">
                      <Counted id="a-idea" short max={200} value={f.idea} onChange={(v) => set('idea', v)} />
                    </Field>
                    <Chips single label="أصل الفكرة *" options={ORIGINS} value={f.origin ? [f.origin] : []} onChange={(v) => set('origin', v[0] ?? '')} error={errors.origin} />
                    <Chips single label="مرحلة الفكرة *" options={MATURITY} value={f.maturity ? [f.maturity] : []} onChange={(v) => set('maturity', v[0] ?? '')} error={errors.maturity} />
                  </>
                )}

                {step === 3 && door !== 'ilham' && (
                  <>
                    <Field label="المشكلة التي يحلّها مشروعك" htmlFor="a-problem" error={errors.problem} required>
                      <Counted id="a-problem" max={600} value={f.problem} onChange={(v) => set('problem', v)} invalid={!!errors.problem} />
                    </Field>
                    <Field label={door === 'tamkeen-seat' ? 'وصف النموذج الأولي' : 'وصف المنتج'} htmlFor="a-product" error={errors.product} required>
                      <Counted id="a-product" short max={300} value={f.product} onChange={(v) => set('product', v)} invalid={!!errors.product} />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
                      <Field label={door === 'tamkeen-seat' ? 'رابط النموذج الأولي' : 'رابط المنتج'} htmlFor="a-link" error={errors.link} required>
                        <Input id="a-link" type="url" dir="ltr" spellCheck={false} placeholder="https://" value={f.link} onChange={(e) => set('link', e.target.value)} aria-invalid={!!errors.link} />
                      </Field>
                      <Field label={door === 'tamkeen-seat' ? 'عدد من جرّبوه' : 'عدد المستخدمين'} htmlFor="a-users" error={errors.users} required>
                        <Input id="a-users" dir="ltr" inputMode="numeric" value={f.users} onChange={(e) => set('users', e.target.value)} aria-invalid={!!errors.users} />
                      </Field>
                    </div>
                    {door === 'tamkeen-seat' && (
                      <Field label="أهم ما تعلمتِه من تجربة المستخدمين" htmlFor="a-learned" error={errors.learned} required>
                        <Counted id="a-learned" short max={300} value={f.learned} onChange={(v) => set('learned', v)} invalid={!!errors.learned} />
                      </Field>
                    )}
                    {door === 'intilaq-seat' && (
                      <>
                        <Choice type="checkbox" name="pilot" checked={f.pilot} onChange={() => set('pilot', !f.pilot)} label="أجرينا تجربة ميدانية" hint="تكفي بدل 20 مستخدمًا." />
                        <Field label="كيف يحقق المشروع دخله؟" htmlFor="a-model" error={errors.model} required>
                          <Counted id="a-model" short max={300} value={f.model} onChange={(v) => set('model', v)} invalid={!!errors.model} />
                        </Field>
                        <Chips single label="هل الشركة مسجّلة؟ *" options={REGISTERED} value={f.registered ? [f.registered] : []} onChange={(v) => set('registered', v[0] ?? '')} error={errors.registered} />
                      </>
                    )}
                  </>
                )}

                {step === 4 && (
                  <>
                    <fieldset>
                      <legend className="text-lg font-bold text-navy">{door === 'ilham' ? 'هل تستطيعين حضور مقابلة حضورية بين 7 و11 فبراير؟' : 'هل تستطيعين حضور مقابلة حضورية قبل بداية المرحلة؟'}</legend>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Choice type="radio" name="interview" checked={f.interview === 'yes'} onChange={() => set('interview', 'yes')} label="نعم" invalid={!!errors.interview} />
                        <Choice type="radio" name="interview" checked={f.interview === 'no'} onChange={() => set('interview', 'no')} label="لا" invalid={!!errors.interview} />
                      </div>
                      {errors.interview && (
                        <p className="mt-2 text-sm text-danger" role="alert">
                          {errors.interview}
                        </p>
                      )}
                    </fieldset>

                    <details className="group rounded-xl border border-line-strong">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-navy [&::-webkit-details-marker]:hidden">
                        أسئلة اختيارية، لا تدخل في التقييم
                        <Plus className="size-5 shrink-0 text-blue transition-transform group-open:rotate-45" aria-hidden />
                      </summary>
                      <div className="flex flex-col gap-6 border-t border-line px-4 py-5">
                        <Chips label="مشاركات ريادية سابقة" options={BACKGROUND} value={f.background} onChange={(v) => set('background', v)} />
                        <Chips label="كيف عرفتِ بالحاضنة؟" options={HEARD} value={f.heard} onChange={(v) => set('heard', v)} />
                        {door === 'ilham' && (
                          <Chips label="الفعاليات التي حضرتِها" options={WORKSHOPS.filter((w) => w.stage === 'ilham').map((w) => w.title)} value={f.attended} onChange={(v) => set('attended', v)} />
                        )}
                      </div>
                    </details>

                    <fieldset>
                      <legend className="text-lg font-bold text-navy">الإقرارات</legend>
                      <div className="mt-4 grid gap-3">
                        {ACKS.map((a, i) => (
                          <Choice
                            key={a}
                            type="checkbox"
                            name={`ack${i}`}
                            checked={f.ack[i]}
                            onChange={() => set('ack', f.ack.map((v, j) => (j === i ? !v : v)))}
                            label={a}
                            invalid={!!errors.ack && !f.ack[i]}
                          />
                        ))}
                      </div>
                      {errors.ack && (
                        <p className="mt-2 text-sm text-danger" role="alert">
                          {errors.ack}
                        </p>
                      )}
                    </fieldset>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4 md:px-8">
                {step > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep(step - 1)
                      toTop()
                    }}
                  >
                    <ArrowRight className="size-4" aria-hidden />
                    السابق
                  </Button>
                ) : (
                  <Link to="/program" className="text-sm font-semibold text-blue-ink hover:underline">
                    تعرّفي على المراحل
                  </Link>
                )}
                <Button type="submit">
                  {step < steps.length - 1 ? 'التالي' : 'إرسال الطلب'}
                  {step < steps.length - 1 && <ArrowLeft className="size-4" aria-hidden />}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
