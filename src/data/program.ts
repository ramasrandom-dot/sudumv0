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
  summary: string
  outcome: string
  offers: string[]
  steps: string
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
    teamsLabel: '500 مسجّلة · 25 فريقًا متأهلًا',
    gate: 'عرض الاختيار',
    gateDate: '2027-02-04',
    summary: 'تفتح باب المسار للجميع، وتحوّل الاهتمام إلى أفكار وفرق جاهزة للدخول في «تكوين».',
    outcome: '25 فريقًا متأهلًا بفكرة مؤطَّرة وميثاق عمل، من 80 مشاركة في مختبر الأفكار.',
    offers: [
      'أسبوع فعاليات مفتوح لخمسمئة حاضرة، يبدأ بمعرض مشاريع المعمل في يومه الأول.',
      'فرز بمقابلات من 10 دقائق ولجنة تقييم خارجية.',
      'مختبر أفكار من ثلاثة أيام لبناء الفرق وعرض الاختيار.',
    ],
    steps: 'نستكشف · نؤطّر · نبني الفريق',
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
    summary: 'يحوّل الفكرة أو مشروع التخرج إلى نموذج أولي اختبره مستخدمون حقيقيون.',
    outcome: 'نموذج أولي مُختبَر مع 5 مستخدمين، وفهم أولي لنموذج العمل والهوية، وعرض من 3 دقائق.',
    offers: [
      '6 ورش أسبوعية تطبيقية، مع احتضان طوال المسار.',
      '4 جولات إرشاد وساعات مكتبية أسبوعية.',
      '4 معالم يعتمدها المرشد وتنتهي بيوم التحكيم.',
    ],
    steps: 'نفهم · نتحقق ونبني · نختبر ونعرض',
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
    teamsLabel: '15 فريقًا · 10 متأهلة و5 مقاعد مفتوحة',
    gate: 'يوم التحكيم',
    gateDate: '2027-07-29',
    summary: 'يبني أصغر منتج قابل للاستخدام ويُطلقه على مستخدمين حقيقيين، ويطبّق نموذج العمل والهوية.',
    outcome: 'منتج يعمل، ونموذج عمل وهوية مطبَّقان، و20 مستخدمًا أو تجربة ميدانية منفّذة، ولوحة مؤشرات حية.',
    offers: [
      '6 ورش: أربع أساسية واثنتان تطبيقيتان للنموذج والهوية، وعيادات عند الحاجة.',
      'مرشد مرافق بجلسة أسبوعية ثابتة، مع احتضان طوال المسار.',
      'تجربة ميدانية داخل الجامعة أو خارجها.',
    ],
    steps: 'نحدد النطاق · نبني · نقيس · نعرض',
  },
  {
    id: 'sanam',
    index: 4,
    name: 'سنام',
    fullName: 'مسرعة سنام',
    color: '#090E3B',
    on: '#FFFFFF',
    tint: '#E3E4EE',
    ink: '#090E3B',
    weeks: 12,
    start: '2027-09-05',
    end: '2027-12-02',
    teams: 8,
    teamsLabel: '8 شركات · 5 متأهلة و3 مقاعد مفتوحة',
    gate: 'يوم العروض الاستثماري',
    gateDate: '2027-12-02',
    summary: 'مسرّعة تحوّل المنتج إلى شركة مسجّلة لها عملاء وجاهزية استثمارية.',
    outcome: 'كيان مسجّل، وعميل أو تجربة مدفوعة، وعرض استثماري جاهز.',
    offers: [
      '5 ورش أساسية وعيادات قانونية ومالية وتسويقية، مع احتضان طوال المسار.',
      'مرشد رئيسي بجلسة أسبوعية: العمود الفقري للمسار.',
      'ساعات إرشادية قبل يوم العروض على المستثمرين.',
    ],
    steps: 'نؤسّس · نبيع · نحسب · نستعد · نعرض',
  },
]

export const STAGE: Record<StageId, Stage> = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<
  StageId,
  Stage
>

export const nextStage = (id: StageId): StageId | undefined => STAGES[STAGE[id].index]?.id

/** Calendar pauses shown on timelines. Ramadan 1448 dates are approximate. */
export const PAUSES = [
  { label: 'رمضان والعيد', title: 'رمضان وإجازة عيد الفطر', start: '2027-02-07', end: '2027-03-12', color: '#FF8A4C' },
  { label: 'الأضحى', title: 'إجازة عيد الأضحى: أسبوعان', start: '2027-05-13', end: '2027-05-27', color: '#CFD0DC' },
  { label: 'الفاصل الصيفي', title: 'الفاصل الصيفي: بناء خط المستثمرين وتأمين التمويل', start: '2027-07-30', end: '2027-09-04', color: '#DCE8FF' },
]

export const ENTRY_POINTS: Record<EntryPoint, { label: string; who: string; detail: string }> = {
  research: {
    label: 'أبحاث ومخرجات بحثية',
    who: 'أعضاء هيئة التدريس والباحثات',
    detail: 'مخرجات بحثية قابلة للتحويل إلى منتج أو خدمة، عبر نقل التقنية.',
  },
  student: {
    label: 'مشاريع طلابية واعدة',
    who: 'الطالبات وطالبات الدراسات العليا',
    detail: 'أفكار ومشاريع تخرج تبحث عن طريقها إلى مستخدمين حقيقيين.',
  },
  founder: {
    label: 'رائدات أعمال بمنتج قائم',
    who: 'رائدات الأعمال والمنشآت الناشئة',
    detail: 'مشاريع قائمة لديها منتج أولي وتبحث عن النمو والاستثمار.',
  },
}

export const TRACKS: Record<Track, { label: string; detail: string }> = {
  ilham: { label: 'الإلهام', detail: 'لديكِ فكرة أو مشروع تخرج وتبحثين عن فريق وطريق.' },
  'tamkeen-seat': { label: 'مقعد مفتوح في تمكين', detail: 'لديكِ نموذج أولي مُختبَر وتريدين بناء الـ MVP.' },
  'sanam-seat': { label: 'مقعد مفتوح في مسرعة سنام', detail: 'لديكِ منتج يعمل ومستخدمون وتستعدين للتأسيس والاستثمار.' },
}

export interface WorkshopDef {
  stage: StageId
  week: number
  verb: string
  title: string
  date: string
}

/** The 23 workshop titles, word for word from «عناوين الورش». */
export const WORKSHOPS: WorkshopDef[] = [
  { stage: 'ilham', week: 1, verb: 'نستكشف', title: 'اكتشاف المشكلات من حولك', date: '2027-01-18' },
  { stage: 'ilham', week: 1, verb: 'نؤطّر', title: 'إعادة تأطير المشكلة: «كيف يمكننا أن…؟»', date: '2027-01-20' },
  { stage: 'ilham', week: 1, verb: 'ننقل المعرفة', title: 'ريادة الأعمال الأكاديمية ونقل التقنية', date: '2027-01-21' },
  { stage: 'ilham', week: 2, verb: 'نبتكر', title: 'مختبر الأفكار: من الفكرة الفردية إلى المفهوم', date: '2027-01-26' },
  { stage: 'ilham', week: 2, verb: 'نبني الفريق', title: 'بناء الفريق: الأدوار المتكاملة وميثاق العمل', date: '2027-01-27' },
  { stage: 'ilham', week: 3, verb: 'نعرض', title: 'اعرضي فكرتك في دقيقتين', date: '2027-02-01' },
  { stage: 'takween', week: 1, verb: 'نفهم', title: 'التفكير التصميمي: من التحدي إلى الفرصة', date: '2027-03-15' },
  { stage: 'takween', week: 2, verb: 'نفهم', title: 'التحقق من المشكلة', date: '2027-03-22' },
  { stage: 'takween', week: 3, verb: 'نتحقق', title: 'إثبات المفهوم: أرخص اختبار ممكن', date: '2027-03-29' },
  { stage: 'takween', week: 4, verb: 'نبني', title: 'النمذجة السريعة', date: '2027-04-05' },
  { stage: 'takween', week: 5, verb: 'نختبر', title: 'اختبار قابلية الاستخدام', date: '2027-04-12' },
  { stage: 'takween', week: 6, verb: 'نعرض', title: 'فن عرض الفكرة (Pitch Craft)', date: '2027-04-19' },
  { stage: 'tamkeen', week: 1, verb: 'نحدد النطاق', title: 'نطاق المنتج الأدنى القابل للتطبيق (MVP)', date: '2027-04-27' },
  { stage: 'tamkeen', week: 2, verb: 'نبني', title: 'البناء السريع بالذكاء الاصطناعي وبدون كود', date: '2027-05-04' },
  { stage: 'tamkeen', week: 3, verb: 'نموذج العمل', title: 'نموذج العمل التجاري: تطبيق عملي', date: '2027-05-11' },
  { stage: 'tamkeen', week: 5, verb: 'الهوية', title: 'الهوية والعلامة التجارية: تطبيق عملي', date: '2027-06-08' },
  { stage: 'tamkeen', week: 9, verb: 'نقيس', title: 'القياس ووحدة الاقتصاد: المؤشرات والتسعير', date: '2027-07-06' },
  { stage: 'tamkeen', week: 12, verb: 'نعرض', title: 'من التجربة الميدانية إلى عرض المنتج', date: '2027-07-27' },
  { stage: 'sanam', week: 1, verb: 'نؤسّس', title: 'من منتج إلى شركة: التأسيس والحوكمة واتفاقية المؤسسين', date: '2027-09-06' },
  { stage: 'sanam', week: 3, verb: 'نبيع', title: 'الذهاب إلى السوق: القنوات والمبيعات ودورة الصفقة', date: '2027-09-20' },
  { stage: 'sanam', week: 5, verb: 'نحسب', title: 'النموذج المالي ووحدة الاقتصاد', date: '2027-10-04' },
  { stage: 'sanam', week: 8, verb: 'نستعد', title: 'جاهزية الاستثمار: التقييم وهيكل الجولة والعناية الواجبة', date: '2027-10-25' },
  { stage: 'sanam', week: 11, verb: 'نعرض', title: 'العرض الاستثماري وبروفة الأسئلة الصعبة', date: '2027-11-15' },
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
  participant: 'تابعي رحلة فريقك، وسلّمي المعالم، واحجزي جلسات الإرشاد.',
  mentor: 'تابع فرقك، واعتمد المعالم، وسجّل جلسات الإرشاد.',
  expert: 'ورشك القادمة، وطلبات العيادات من الفرق.',
  judge: 'أيام التحكيم، وملفات الفرق، وبطاقة التقييم الموحدة.',
  admin: 'المؤشرات، والقبول، وبوابات العبور، والتصعيد.',
}

export const ESCALATION_LEVELS = {
  1: { label: 'تشغيلي', days: 3, owner: 'فريق إدارة البرنامج' },
  2: { label: 'فني', days: 5, owner: 'مدير البرنامج' },
  3: { label: 'استراتيجي', days: 7, owner: 'اللجنة التوجيهية' },
} as const

export const SECTORS = ['الصحة', 'التعليم', 'التقنية المالية', 'التجارة الإلكترونية', 'الاستدامة', 'الخدمات']
