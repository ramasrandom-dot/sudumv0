import type { Criterion, EntryPoint, Role, StageId, Track } from './types'

/** The prototype runs on a fixed date: mid-Tamkeen of cohort 1. */
export const TODAY = '2027-06-15'

export interface Stage {
  id: StageId
  index: number
  name: string
  fullName: string
  /** solid stage colour */
  color: string
  /** text colour on the solid colour */
  on: string
  /** light tint background */
  tint: string
  /** readable text colour on white or the tint */
  ink: string
  weeks: number
  start: string
  end: string
  teams: number
  teamsLabel: string
  gate: string
  gateDate: string
  /** one line: what the stage does */
  summary: string
  /** one line: what a team leaves with */
  outcome: string
}

export const STAGES: Stage[] = [
  {
    id: 'ilham',
    index: 1,
    name: 'الإلهام',
    fullName: 'الإلهام',
    color: '#2086C2',
    on: '#FFFFFF',
    tint: '#DCE8FF',
    ink: '#17699B',
    weeks: 3,
    start: '2027-01-17',
    end: '2027-02-04',
    teams: 25,
    teamsLabel: '500 مسجّلة',
    gate: 'عرض الاختيار',
    gateDate: '2027-02-04',
    summary: 'فعاليات مفتوحة ومختبر أفكار لتكوين الفرق.',
    outcome: 'فكرة واضحة وفريق جاهز.',
  },
  {
    id: 'takween',
    index: 2,
    name: 'تكوين',
    fullName: 'تكوين',
    color: '#39B67E',
    on: '#0A0F3C',
    tint: '#D5FFDE',
    ink: '#1C7A50',
    weeks: 6,
    start: '2027-03-14',
    end: '2027-04-22',
    teams: 25,
    teamsLabel: '25 فريقًا',
    gate: 'يوم التحكيم',
    gateDate: '2027-04-22',
    summary: 'من الفكرة إلى نموذج أولي.',
    outcome: 'نموذج أولي جرّبه مستخدمون.',
  },
  {
    id: 'tamkeen',
    index: 3,
    name: 'تمكين',
    fullName: 'تمكين',
    color: '#00535C',
    on: '#FFFFFF',
    tint: '#D9ECEE',
    ink: '#00535C',
    weeks: 12,
    start: '2027-04-25',
    end: '2027-07-29',
    teams: 15,
    teamsLabel: '15 فريقًا',
    gate: 'يوم التحكيم',
    gateDate: '2027-07-29',
    summary: 'من النموذج الأولي إلى منتج يعمل.',
    outcome: 'منتج يعمل وله مستخدمون.',
  },
  {
    id: 'sanam',
    index: 4,
    name: 'سنام',
    fullName: 'سنام',
    color: '#090E3B',
    on: '#FFFFFF',
    tint: '#E3E4EE',
    ink: '#090E3B',
    weeks: 12,
    start: '2027-09-05',
    end: '2027-12-02',
    teams: 8,
    teamsLabel: '8 شركات',
    gate: 'يوم العروض الاستثماري',
    gateDate: '2027-12-02',
    summary: 'من المنتج إلى شركة.',
    outcome: 'شركة جاهزة لدخول المسرعة.',
  },
]

export const STAGE: Record<StageId, Stage> = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<
  StageId,
  Stage
>

export const nextStage = (id: StageId): StageId | undefined => STAGES[STAGE[id].index]?.id

/** Sanam is the fourth and last stage. Teams that finish it move on to the accelerator. */
export const AFTER_PROGRAM = 'المسرعة'

/** Where a team goes after a stage: the next stage's name, or the accelerator after Sanam. */
export const nextLabel = (id: StageId) => {
  const next = nextStage(id)
  return next ? STAGE[next].fullName : AFTER_PROGRAM
}

/** Calendar pauses shown on timelines. Ramadan 1448 dates are approximate. */
export const PAUSES = [
  { label: 'رمضان والعيد', title: 'رمضان وإجازة عيد الفطر', start: '2027-02-07', end: '2027-03-12', color: '#FF8A4C' },
  { label: 'الأضحى', title: 'إجازة عيد الأضحى', start: '2027-05-13', end: '2027-05-27', color: '#CFD0DC' },
  { label: 'الفاصل الصيفي', title: 'الفاصل الصيفي', start: '2027-07-30', end: '2027-09-04', color: '#DCE8FF' },
]

export const ENTRY_POINTS: Record<EntryPoint, { label: string; detail: string }> = {
  student: { label: 'طالبات', detail: 'فكرة أو مشروع تخرج.' },
  research: { label: 'باحثات', detail: 'بحث علمي يمكن تحويله إلى منتج.' },
  founder: { label: 'رائدات أعمال', detail: 'منتج قائم يبحث عن النمو.' },
}

export const TRACKS: Record<Track, { label: string; detail: string }> = {
  ilham: { label: 'الإلهام', detail: 'لديكِ فكرة أو مشروع تخرج.' },
  'tamkeen-seat': { label: 'مقعد مفتوح في تمكين', detail: 'لديكِ نموذج أولي مجرَّب.' },
  'sanam-seat': { label: 'مقعد مفتوح في سنام', detail: 'لديكِ منتج يعمل وله مستخدمون.' },
}

export interface WorkshopDef {
  stage: StageId
  week: number
  title: string
  date: string
}

/** The 23 workshops. Titles are plain-language versions of the official «عناوين الورش» list. */
export const WORKSHOPS: WorkshopDef[] = [
  { stage: 'ilham', week: 1, title: 'اكتشاف المشكلات من حولك', date: '2027-01-18' },
  { stage: 'ilham', week: 1, title: 'صياغة المشكلة بوضوح', date: '2027-01-20' },
  { stage: 'ilham', week: 1, title: 'من البحث العلمي إلى مشروع', date: '2027-01-21' },
  { stage: 'ilham', week: 2, title: 'مختبر الأفكار: طوّري فكرتك', date: '2027-01-26' },
  { stage: 'ilham', week: 2, title: 'بناء الفريق وتوزيع الأدوار', date: '2027-01-27' },
  { stage: 'ilham', week: 3, title: 'اعرضي فكرتك في دقيقتين', date: '2027-02-01' },
  { stage: 'takween', week: 1, title: 'التفكير التصميمي', date: '2027-03-15' },
  { stage: 'takween', week: 2, title: 'التحقق من المشكلة', date: '2027-03-22' },
  { stage: 'takween', week: 3, title: 'اختبار الفكرة بأقل تكلفة', date: '2027-03-29' },
  { stage: 'takween', week: 4, title: 'بناء نموذج أولي سريع', date: '2027-04-05' },
  { stage: 'takween', week: 5, title: 'تجربة النموذج مع المستخدمين', date: '2027-04-12' },
  { stage: 'takween', week: 6, title: 'فن عرض الفكرة', date: '2027-04-19' },
  { stage: 'tamkeen', week: 1, title: 'تحديد النسخة الأولى من المنتج (MVP)', date: '2027-04-27' },
  { stage: 'tamkeen', week: 2, title: 'بناء المنتج بالذكاء الاصطناعي وبدون برمجة', date: '2027-05-04' },
  { stage: 'tamkeen', week: 3, title: 'نموذج العمل التجاري', date: '2027-05-11' },
  { stage: 'tamkeen', week: 5, title: 'الهوية والعلامة التجارية', date: '2027-06-08' },
  { stage: 'tamkeen', week: 9, title: 'الأرقام والتسعير', date: '2027-07-06' },
  { stage: 'tamkeen', week: 12, title: 'عرض المنتج بعد التجربة', date: '2027-07-27' },
  { stage: 'sanam', week: 1, title: 'تأسيس الشركة واتفاق المؤسِّسات', date: '2027-09-06' },
  { stage: 'sanam', week: 3, title: 'دخول السوق والمبيعات', date: '2027-09-20' },
  { stage: 'sanam', week: 5, title: 'النموذج المالي', date: '2027-10-04' },
  { stage: 'sanam', week: 8, title: 'الاستعداد للاستثمار', date: '2027-10-25' },
  { stage: 'sanam', week: 11, title: 'العرض أمام المستثمرين', date: '2027-11-15' },
]

/** The five expertise areas, word for word from «مجالات المرشدين والخبراء». */
export const EXPERTISE: { id: string; title: string; fields: string[] }[] = [
  {
    id: 'tech',
    title: 'الابتكار والتقنية',
    fields: [
      'الابتكار والتفكير التصميمي',
      'تجربة المستخدم وتصميم الواجهات (UI/UX)',
      'تطوير المنتجات والتطبيقات الرقمية',
      'الذكاء الاصطناعي والتقنيات الحديثة',
      'تحليل البيانات والأتمتة',
      'الأمن السيبراني',
    ],
  },
  {
    id: 'business',
    title: 'ريادة الأعمال وتطوير الأعمال',
    fields: [
      'بناء نماذج العمل وتحديد الأسعار',
      'التسويق الرقمي وتنمية المشاريع',
      'المبيعات والتفاوض',
      'بناء الهوية والعلامة التجارية',
      'الشراكات والتوسع في الأسواق',
      'استقطاب العملاء واختبار المنتجات',
    ],
  },
  {
    id: 'finance',
    title: 'التمويل والاستثمار',
    fields: [
      'التخطيط المالي وإعداد الميزانيات',
      'التسعير وحساب التكاليف والأرباح',
      'الاستثمار الجريء وتقييم الشركات الناشئة',
      'مصادر التمويل والمنح والدعم الحكومي',
      'الاستعداد للجولات الاستثمارية',
    ],
  },
  {
    id: 'legal',
    title: 'التأسيس والجوانب القانونية',
    fields: [
      'تأسيس الشركات وإجراءات التسجيل',
      'حوكمة الشركات وتنظيم أعمالها',
      'العقود واتفاقيات الشراكة وحقوق المؤسسين',
      'الملكية الفكرية وبراءات الاختراع',
      'الأنظمة والامتثال',
    ],
  },
  {
    id: 'sector',
    title: 'الخبرات القطاعية والمهارات',
    fields: [
      'الخبرة في قطاعات الصحة والتعليم والتقنية المالية والتجارة الإلكترونية والاستدامة',
      'الإرشاد وتوجيه رائدات الأعمال',
      'إعداد العروض التقديمية والاستثمارية',
      'مهارات العرض والإلقاء والتواصل',
    ],
  },
]

/** The standard scorecard used at every gate. Scores are 1–5 per criterion. */
export const CRITERIA: Criterion[] = [
  { id: 'problem', label: 'المشكلة والتحقق منها', hint: 'هل المشكلة حقيقية ومؤكدة بأدلة من المستخدمين؟', weight: 25 },
  { id: 'solution', label: 'الحل والمنتج', hint: 'هل الحل يعالج المشكلة، وما مستوى نضج النموذج أو المنتج؟', weight: 25 },
  { id: 'business', label: 'نموذج العمل والسوق', hint: 'هل يوجد عميل واضح ومصدر إيراد ومؤشرات قابلة للقياس؟', weight: 20 },
  { id: 'team', label: 'الفريق والتنفيذ', hint: 'هل يملك الفريق الأدوار والقدرة على التنفيذ في الوقت المحدد؟', weight: 15 },
  { id: 'pitch', label: 'العرض والتواصل', hint: 'هل العرض واضح ومقنع وفي الوقت المحدد؟', weight: 15 },
]

export const ROLE_LABEL: Record<Role, string> = {
  participant: 'رائدة أعمال',
  mentor: 'مرشد/ة',
  expert: 'خبير/ة',
  judge: 'محكّم/ة',
  admin: 'إدارة البرنامج',
}

export const ROLE_DESCRIPTION: Record<Role, string> = {
  participant: 'مهام فريقك وجلسات الإرشاد.',
  mentor: 'فرقك واعتماد المهام.',
  expert: 'ورشك وطلبات الاستشارات.',
  judge: 'تقييم الفرق في أيام التحكيم.',
  admin: 'متابعة البرنامج كاملًا.',
}

export const ESCALATION_LEVELS = {
  1: { label: 'تشغيلي', days: 3, owner: 'فريق إدارة البرنامج' },
  2: { label: 'فني', days: 5, owner: 'مدير البرنامج' },
  3: { label: 'استراتيجي', days: 7, owner: 'اللجنة التوجيهية' },
} as const

export const SECTORS = ['الصحة', 'التعليم', 'التقنية المالية', 'التجارة الإلكترونية', 'الاستدامة', 'الخدمات']
