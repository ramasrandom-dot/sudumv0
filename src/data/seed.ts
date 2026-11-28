/**
 * Sample data for the clickable prototype. Every person, team, application and score
 * here is fictional and exists only to demonstrate the platform.
 */
import { CRITERIA, WORKSHOPS } from './program'
import type {
  Application,
  Escalation,
  JudgingEvent,
  Milestone,
  Nomination,
  Person,
  Score,
  Session,
  Slot,
  Team,
  Workshop,
} from './types'

export const people: Person[] = [
  { id: 'p-noura', name: 'نورة الشهري', role: 'participant', title: 'قائدة فريق رفيقة', teamId: 't1', org: 'كلية علوم الحاسب والمعلومات' },
  { id: 'm-haifa', name: 'د. هيفاء العتيبي', role: 'mentor', title: 'مرشدة في الابتكار والتفكير التصميمي', org: 'مستشارة ابتكار مستقلة', areas: ['الابتكار والتفكير التصميمي', 'الإرشاد وتوجيه رائدات الأعمال'] },
  { id: 'm-sara', name: 'أ. سارة القحطاني', role: 'mentor', title: 'مرشدة في تطوير المنتجات الرقمية', org: 'مديرة منتج', areas: ['تطوير المنتجات والتطبيقات الرقمية', 'استقطاب العملاء واختبار المنتجات'] },
  { id: 'm-reem', name: 'م. ريم الدوسري', role: 'mentor', title: 'مرشدة في تجربة المستخدم', org: 'مصممة تجربة مستخدم', areas: ['تجربة المستخدم وتصميم الواجهات (UI/UX)'] },
  { id: 'm-abdullah', name: 'أ. عبدالله الحربي', role: 'mentor', title: 'مرشد في نماذج العمل والتسعير', org: 'مستشار أعمال', areas: ['بناء نماذج العمل وتحديد الأسعار', 'المبيعات والتفاوض'] },
  { id: 'm-mona', name: 'د. منى الزهراني', role: 'mentor', title: 'مرشدة في قطاع الصحة', org: 'طبيبة وباحثة', areas: ['الخبرة في قطاعات الصحة والتعليم والتقنية المالية والتجارة الإلكترونية والاستدامة'] },
  { id: 'e-khalid', name: 'أ. خالد المطيري', role: 'expert', title: 'خبير تأسيس الشركات والعقود', org: 'محامٍ ومستشار قانوني', areas: ['تأسيس الشركات وإجراءات التسجيل', 'العقود واتفاقيات الشراكة وحقوق المؤسسين'] },
  { id: 'e-dana', name: 'أ. دانة الشمري', role: 'expert', title: 'خبيرة النماذج المالية', org: 'محللة مالية', areas: ['التخطيط المالي وإعداد الميزانيات', 'التسعير وحساب التكاليف والأرباح'] },
  { id: 'e-faisal', name: 'م. فيصل العنزي', role: 'expert', title: 'خبير الذكاء الاصطناعي والبناء بدون كود', org: 'مهندس برمجيات', areas: ['الذكاء الاصطناعي والتقنيات الحديثة', 'تطوير المنتجات والتطبيقات الرقمية'] },
  { id: 'e-nouf', name: 'أ. نوف الغامدي', role: 'expert', title: 'خبيرة الهوية والعلامة التجارية', org: 'مديرة إبداعية', areas: ['بناء الهوية والعلامة التجارية', 'التسويق الرقمي وتنمية المشاريع'] },
  { id: 'e-yasser', name: 'د. ياسر البقمي', role: 'expert', title: 'خبير الاستثمار الجريء', org: 'شريك في صندوق استثماري', areas: ['الاستثمار الجريء وتقييم الشركات الناشئة', 'الاستعداد للجولات الاستثمارية'] },
  { id: 'j-amal', name: 'د. أمل الرشيد', role: 'judge', title: 'محكّمة: ريادة الأعمال والابتكار', org: 'أكاديمية ومستشارة' },
  { id: 'j-majed', name: 'أ. ماجد السالم', role: 'judge', title: 'محكّم: الاستثمار', org: 'مستثمر ملائكي' },
  { id: 'j-hind', name: 'أ. هند التميمي', role: 'judge', title: 'محكّمة: المنتجات الرقمية', org: 'مديرة منتجات' },
  { id: 'j-rana', name: 'أ. رنا العمري', role: 'judge', title: 'محكّمة: التسويق والنمو', org: 'مديرة تسويق' },
  { id: 'j-tareq', name: 'أ. طارق الجهني', role: 'judge', title: 'محكّم: التقنية المالية', org: 'مؤسس شركة ناشئة' },
  { id: 'a-maha', name: 'أ. مها الخالدي', role: 'admin', title: 'مديرة البرنامج', org: 'مركز الابتكار وريادة الأعمال' },
]

/** The demo user for each role on the sign-in screen. */
export const DEMO_USERS = {
  participant: 'p-noura',
  mentor: 'm-haifa',
  expert: 'e-faisal',
  judge: 'j-amal',
  admin: 'a-maha',
} as const

const members = (lead: string, a: string, b: string) => [
  { name: lead, role: 'قائدة الفريق · المنتج' },
  { name: a, role: 'التطوير' },
  { name: b, role: 'التصميم وتجربة المستخدم' },
]

const tamkeen: Omit<Team, 'stage' | 'status'>[] = [
  { id: 't1', name: 'رفيقة', idea: 'متابعة رقمية للحوامل بين زيارات العيادة، بتذكيرات وقياسات تشاركها الأم مع طبيبتها.', sector: 'الصحة', entry: 'student', members: members('نورة الشهري', 'جود العتيبي', 'لين الحربي'), mentorId: 'm-haifa', joinedVia: 'advanced', metrics: { users: 14, interviews: 32 }, charter: 'نجتمع كل أحد وأربعاء، ونتخذ القرار بالتوافق ثم بصوت قائدة الفريق. كل عضوة تملك مسارها وتسلّم في موعدها.' },
  { id: 't2', name: 'سِراج', idea: 'مساعد ذكي يحوّل المقررات إلى بطاقات مراجعة واختبارات قصيرة تفاعلية.', sector: 'التعليم', entry: 'student', members: members('رهف القرني', 'شهد المالكي', 'غلا الزهراني'), mentorId: 'm-haifa', joinedVia: 'advanced', metrics: { users: 41, interviews: 25 } },
  { id: 't3', name: 'حصّالة', idea: 'ادخار جماعي ذكي للطالبات بأهداف مشتركة وتنبيهات إنفاق.', sector: 'التقنية المالية', entry: 'student', members: members('أروى السبيعي', 'ريما القحطاني', 'دانة العنزي'), mentorId: 'm-abdullah', joinedVia: 'advanced', metrics: { users: 22, interviews: 18 } },
  { id: 't4', name: 'غرسة', idea: 'أصص ذكية تقيس رطوبة التربة وتنبّه عبر الجوال، لتقليل هدر المياه في المنازل.', sector: 'الاستدامة', entry: 'research', members: members('د. عبير الحمدان', 'أسيل الشمري', 'مها الرويلي'), mentorId: 'm-sara', joinedVia: 'advanced', metrics: { users: 9, interviews: 20 } },
  { id: 't5', name: 'مَشغَل', idea: 'سوق إلكتروني للأسر المنتجة مع إدارة الطلبات والتوصيل.', sector: 'التجارة الإلكترونية', entry: 'founder', members: members('هيا الدوسري', 'عهود الحربي', 'سلمى الغامدي'), mentorId: 'm-abdullah', joinedVia: 'advanced', metrics: { users: 63, interviews: 15, revenue: 4200 } },
  { id: 't6', name: 'أثر', idea: 'قياس البصمة الكربونية للمنشآت الصغيرة بتقارير شهرية مبسطة.', sector: 'الاستدامة', entry: 'research', members: members('د. ليلى الفهد', 'نوف العتيبي', 'بشاير القرشي'), mentorId: 'm-sara', joinedVia: 'advanced', metrics: { users: 6, interviews: 14 } },
  { id: 't7', name: 'لَبِنة', idea: 'منصة تطابق طالبات العمارة مع مشاريع تصميم داخلي صغيرة.', sector: 'الخدمات', entry: 'student', members: members('جنى المطيري', 'رزان الزهراني', 'ميار السهلي'), mentorId: 'm-reem', joinedVia: 'advanced', metrics: { users: 27, interviews: 21 } },
  { id: 't8', name: 'شفاء', idea: 'تذكير بالأدوية لكبار السن مع متابعة يشارك فيها أفراد الأسرة.', sector: 'الصحة', entry: 'student', members: members('العنود البقمي', 'وجدان الحربي', 'تالا الشهري'), mentorId: 'm-mona', joinedVia: 'advanced', metrics: { users: 18, interviews: 29 } },
  { id: 't9', name: 'مِداد', idea: 'تقييم آلي للكتابة باللغة العربية يساعد المعلمات على التصحيح والتغذية الراجعة.', sector: 'التعليم', entry: 'research', members: members('د. سمر الأحمدي', 'هتون العمري', 'رغد القحطاني'), mentorId: 'm-haifa', joinedVia: 'advanced', metrics: { users: 12, interviews: 16 } },
  { id: 't10', name: 'سَلّة', idea: 'تقليل هدر الطعام بربط المطاعم بالجمعيات قبل نهاية اليوم.', sector: 'الاستدامة', entry: 'student', members: members('شوق العنزي', 'رنيم الدوسري', 'ألين السبيعي'), mentorId: 'm-reem', joinedVia: 'advanced', metrics: { users: 11, interviews: 23 } },
  { id: 't11', name: 'دار', idea: 'إدارة عقود السكن ودفعات الإيجار للطالبات المغتربات.', sector: 'التقنية المالية', entry: 'founder', members: members('منيرة الجهني', 'ريوف العتيبي', 'آلاء الحارثي'), mentorId: 'm-abdullah', joinedVia: 'open-seat', metrics: { users: 35, interviews: 12, revenue: 1800 } },
  { id: 't12', name: 'نَسيج', idea: 'علامة أزياء محتشمة بخامات معاد تدويرها وبيع مباشر عبر الإنترنت.', sector: 'التجارة الإلكترونية', entry: 'founder', members: members('لمى الراشد', 'حلا المطيري', 'سارة الخثلان'), mentorId: 'm-sara', joinedVia: 'open-seat', metrics: { users: 120, interviews: 10, revenue: 9600 } },
  { id: 't13', name: 'بوصلة', idea: 'إرشاد مهني بالذكاء الاصطناعي لطالبات السنة الأخيرة.', sector: 'التعليم', entry: 'student', members: members('ديما الشمري', 'جواهر الحربي', 'نجد القحطاني'), mentorId: 'm-haifa', joinedVia: 'open-seat', metrics: { users: 8, interviews: 19 } },
  { id: 't14', name: 'مِجهر', idea: 'تحليل صور الفحوص المخبرية لاكتشاف فقر الدم مبكرًا.', sector: 'الصحة', entry: 'research', members: members('د. أريج السديري', 'نجلاء الحربي', 'روان العتيبي'), mentorId: 'm-mona', joinedVia: 'open-seat', metrics: { users: 3, interviews: 11 } },
  { id: 't15', name: 'قافلة', idea: 'تنظيم رحلات التطوع الجامعي من التسجيل حتى توثيق الساعات.', sector: 'الخدمات', entry: 'founder', members: members('فاطمة الزهراني', 'أمل الشهري', 'ريناد المالكي'), mentorId: 'm-reem', joinedVia: 'open-seat', metrics: { users: 2, interviews: 7 } },
]

const exited: [string, string, string, string][] = [
  ['t16', 'ضياء', 'إضاءة ذكية للقاعات الدراسية توفّر الطاقة.', 'الاستدامة'],
  ['t17', 'ريشة', 'سوق للأعمال الفنية للطالبات.', 'التجارة الإلكترونية'],
  ['t18', 'مَرسى', 'حجز الملاعب والأنشطة الرياضية النسائية.', 'الخدمات'],
  ['t19', 'واحة', 'زراعة مائية منزلية بأطقم جاهزة.', 'الاستدامة'],
  ['t20', 'جسر', 'ربط الخريجات بفرص التدريب التعاوني.', 'التعليم'],
  ['t21', 'سنبلة', 'تغذية علاجية لمرضى السكري بوجبات مخصصة.', 'الصحة'],
  ['t22', 'قمرة', 'تأجير معدات التصوير بين الطالبات.', 'الخدمات'],
  ['t23', 'لؤلؤة', 'منتجات عناية بمكونات محلية.', 'التجارة الإلكترونية'],
  ['t24', 'مَعبر', 'ترجمة فورية بلغة الإشارة في الفصول.', 'التعليم'],
  ['t25', 'رواق', 'جولات افتراضية للمتاحف والمعارض.', 'التعليم'],
  ['t26', 'نخلة', 'تتبع جودة التمور من المزرعة للمستهلك.', 'التجارة الإلكترونية'],
  ['t27', 'صدى', 'بودكاست تعليمي بالذكاء الاصطناعي.', 'التعليم'],
  ['t28', 'أفق', 'تخطيط مالي شخصي للموظفات الجدد.', 'التقنية المالية'],
  ['t29', 'نجمة', 'تعلم البرمجة للفتيات بالألعاب.', 'التعليم'],
  ['t30', 'مِرآة', 'تجربة الأزياء افتراضيًا قبل الشراء.', 'التجارة الإلكترونية'],
]

export const teams: Team[] = [
  ...tamkeen.map((t) => ({ ...t, stage: 'tamkeen' as const, status: 'active' as const })),
  ...exited.map(([id, name, idea, sector], i) => ({
    id,
    name,
    idea,
    sector,
    entry: (['student', 'research', 'founder'] as const)[i % 3],
    stage: 'takween' as const,
    status: 'exited' as const,
    joinedVia: 'advanced' as const,
    members: members(['ريم', 'هند', 'سارا', 'جود', 'نوال'][i % 5] + ' ' + ['العتيبي', 'الحربي', 'القحطاني'][i % 3], 'عضوة', 'عضوة'),
  })),
]

const TAMKEEN_MILESTONES: [number, string, string][] = [
  [1, 'تحديد النسخة الأولى من المنتج (MVP)', '2027-05-01'],
  [3, 'نموذج العمل: العملاء والإيرادات', '2027-05-15'],
  [4, 'نسخة أولى تعمل من المنتج', '2027-06-05'],
  [6, 'الهوية: الاسم والشعار', '2027-06-17'],
  [8, 'تجربة المنتج مع 20 مستخدمًا', '2027-07-01'],
  [9, 'متابعة الأرقام وتحديد السعر', '2027-07-10'],
  [12, 'عرض المنتج ليوم التحكيم', '2027-07-24'],
]

const statusFor = (teamIndex: number, m: number): Milestone['status'] => {
  if (m <= 1) return 'approved'
  if (m === 2) return teamIndex % 5 === 4 ? 'changes' : 'approved'
  if (m === 3) return teamIndex % 3 === 0 ? 'submitted' : teamIndex % 4 === 1 ? 'todo' : 'approved'
  return 'todo'
}

export const milestones: Milestone[] = tamkeen.flatMap((t, ti) =>
  TAMKEEN_MILESTONES.map(([week, title, due], mi) => {
    const status = t.id === 't1' ? (mi < 3 ? 'approved' : mi === 3 ? 'submitted' : 'todo') : statusFor(ti, mi)
    const m: Milestone = { id: `${t.id}-m${mi + 1}`, teamId: t.id, stage: 'tamkeen', week, title, due, status }
    if (status !== 'todo') {
      m.submission = {
        link: `https://drive.example.com/${t.id}/m${mi + 1}`,
        note: mi === 3 && t.id === 't1' ? 'أرفقنا ثلاثة بدائل للاسم والشعار، واخترنا «رفيقة» بعد اختبار مع 8 أمهات.' : 'تم التسليم وفق القالب.',
        at: due,
      }
    }
    if (status === 'approved') m.feedback = 'معتمد. عمل متقن.'
    if (status === 'changes') m.feedback = 'النسخة لا تغطي رحلة التسجيل كاملة. أكملوها ثم أعيدوا التسليم.'
    return m
  }),
)

const expertFor: Record<string, string> = {
  'بناء المنتج بالذكاء الاصطناعي وبدون برمجة': 'e-faisal',
  'الهوية والعلامة التجارية': 'e-nouf',
  'الأرقام والتسعير': 'e-dana',
  'تأسيس الشركة واتفاق المؤسِّسات': 'e-khalid',
  'النموذج المالي': 'e-dana',
  'الاستعداد للاستثمار': 'e-yasser',
  'العرض أمام المستثمرين': 'e-yasser',
  'بناء نموذج أولي سريع': 'e-faisal',
  'من البحث العلمي إلى منتج في السوق': 'e-khalid',
}

const tamkeenIds = tamkeen.map((t) => t.id)
export const workshops: Workshop[] = WORKSHOPS.map((w, i) => ({
  id: `w${i + 1}`,
  ...w,
  expertId: expertFor[w.title],
  attended:
    w.stage === 'tamkeen' && w.date < '2027-06-15'
      ? tamkeenIds.filter((_, ti) => (ti + i) % 7 !== 0)
      : undefined,
}))

export const sessions: Session[] = [
  { id: 's1', teamId: 't1', hostId: 'm-haifa', kind: 'mentoring', date: '2027-06-01', time: '10:00', topic: 'مراجعة النسخة الأولى من المنتج', status: 'done', notes: 'النسخة تعمل. التركيز التالي: اختيار اسم وهوية واضحة قبل تجربة المنتج.' },
  { id: 's2', teamId: 't1', hostId: 'm-haifa', kind: 'mentoring', date: '2027-06-08', time: '10:00', topic: 'الاسم والهوية', status: 'done', notes: 'اتفقنا على اختبار ثلاثة أسماء مع الأمهات وتسليم الهوية قبل 17 يونيو.' },
  { id: 's3', teamId: 't1', hostId: 'm-haifa', kind: 'mentoring', date: '2027-06-22', time: '10:00', topic: 'خطة تجربة المنتج', status: 'scheduled' },
  { id: 's4', teamId: 't2', hostId: 'm-haifa', kind: 'mentoring', date: '2027-06-16', time: '12:00', topic: 'مقاييس الاحتفاظ بالمستخدمات', status: 'scheduled' },
  { id: 's5', teamId: 't9', hostId: 'm-haifa', kind: 'mentoring', date: '2027-06-09', time: '13:00', topic: 'تسعير الاشتراك للمدارس', status: 'done', notes: 'نبدأ بتجربة مجانية لمدرستين ثم تسعير لكل معلمة.' },
  { id: 's6', teamId: 't13', hostId: 'm-haifa', kind: 'mentoring', date: '2027-06-17', time: '11:00', topic: 'تحديد النسخة الأولى (MVP)', status: 'scheduled' },
  { id: 's7', teamId: 't1', hostId: 'e-dana', kind: 'clinic', date: '2027-06-20', time: '14:00', topic: 'تكلفة الاشتراك الشهري للعيادات', status: 'requested' },
  { id: 's8', teamId: 't5', hostId: 'e-faisal', kind: 'clinic', date: '2027-06-18', time: '13:00', topic: 'ربط الطلبات بخدمة التوصيل دون كود', status: 'requested' },
  { id: 's9', teamId: 't12', hostId: 'e-faisal', kind: 'clinic', date: '2027-06-10', time: '12:00', topic: 'أتمتة إدارة المخزون', status: 'done', notes: 'ربطنا المتجر بجدول مخزون مع تنبيهات نفاد.' },
  { id: 's10', teamId: 't14', hostId: 'e-faisal', kind: 'clinic', date: '2027-06-21', time: '10:00', topic: 'نموذج تصنيف الصور: خيارات بلا خوادم', status: 'requested' },
  { id: 's11', teamId: 't11', hostId: 'e-khalid', kind: 'clinic', date: '2027-06-19', time: '11:00', topic: 'صياغة عقد الخدمة مع ملاك السكن', status: 'scheduled' },
  { id: 's12', teamId: 't2', hostId: 'e-faisal', kind: 'clinic', date: '2027-06-23', time: '11:00', topic: 'أتمتة تقارير الاستخدام الأسبوعية', status: 'scheduled' },
]

export const slots: Slot[] = [
  { id: 'h1', hostId: 'm-haifa', date: '2027-06-16', time: '09:00' },
  { id: 'h2', hostId: 'm-haifa', date: '2027-06-16', time: '09:30', bookedBy: 't13' },
  { id: 'h3', hostId: 'm-haifa', date: '2027-06-18', time: '13:00' },
  { id: 'h4', hostId: 'm-haifa', date: '2027-06-23', time: '09:00' },
  { id: 'h5', hostId: 'm-haifa', date: '2027-06-23', time: '09:30' },
]

export const events: JudgingEvent[] = [
  { id: 'g1', title: 'مقابلات الفرق', date: '2027-02-11', stage: 'ilham', capacity: 25, judgeIds: ['j-amal', 'j-majed', 'j-hind'], teamIds: teams.map((t) => t.id), published: true, advancedIds: teams.map((t) => t.id) },
  { id: 'g2', title: 'يوم التحكيم: ختام تكوين', date: '2027-04-22', stage: 'takween', capacity: 10, judgeIds: ['j-amal', 'j-majed', 'j-hind'], teamIds: teams.filter((t) => t.joinedVia === 'advanced').map((t) => t.id), published: true, advancedIds: tamkeenIds.slice(0, 10) },
  { id: 'g3', title: 'يوم التحكيم: ختام تمكين', date: '2027-07-29', stage: 'tamkeen', capacity: 5, judgeIds: ['j-amal', 'j-rana', 'j-tareq'], teamIds: tamkeenIds, published: false },
  { id: 'g4', title: 'يوم العروض الاستثماري', date: '2027-12-02', stage: 'intilaq', capacity: 8, judgeIds: ['j-majed', 'j-tareq', 'j-hind'], teamIds: [], published: false },
]

/** Deterministic pseudo-random scores: advanced teams score higher. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const STRONG_COMMENTS = [
  'مشكلة واضحة ومثبتة بمقابلات، والنموذج الأولي مقنع. ركّزوا الآن على نموذج الإيراد.',
  'اختبار المستخدمين جادّ ومنهجي. العرض ممتاز، ويحتاج الحجم السوقي إلى أرقام أدق.',
  'فريق متكامل الأدوار ونموذج أولي يعمل. أنصح بتضييق الشريحة الأولى قبل البناء.',
]
const WEAK_COMMENTS = [
  'فكرة واعدة، لكن التحقق من المشكلة ما زال محدودًا والنموذج الأولي لم يُختبر كفاية.',
  'الحل يسبق المشكلة: نحتاج أدلة أكثر من المستخدمين قبل الانتقال للبناء.',
  'العرض واضح، لكن الفريق يحتاج دورًا تقنيًا لتنفيذ المنتج في المدة المحددة.',
]

const g2Teams = events[1].teamIds
export const scores: Score[] = g2Teams.flatMap((teamId, ti) =>
  events[1].judgeIds.map((judgeId, ji) => {
    const strong = ti < 10
    const values = Object.fromEntries(
      CRITERIA.map((c, ci) => [c.id, Math.min(5, Math.max(1, Math.round((strong ? 3.6 : 2.4) + rand(ti * 31 + ji * 7 + ci) * 1.6)))]),
    )
    return {
      id: `sc-g2-${teamId}-${judgeId}`,
      eventId: 'g2',
      teamId,
      judgeId,
      values,
      comment: (strong ? STRONG_COMMENTS : WEAK_COMMENTS)[(ti + ji) % 3],
      at: '2027-04-22',
    }
  }),
)

/** The demo judge has already pre-scored two teams for the upcoming gate. */
scores.push(
  { id: 'sc-g3-t5-j-amal', eventId: 'g3', teamId: 't5', judgeId: 'j-amal', values: { problem: 5, solution: 4, business: 5, team: 4, pitch: 4 }, comment: 'إيراد فعلي ونمو واضح. أوصي بتأهله.', at: '2027-06-14' },
  { id: 'sc-g3-t12-j-amal', eventId: 'g3', teamId: 't12', judgeId: 'j-amal', values: { problem: 4, solution: 4, business: 5, team: 4, pitch: 3 }, comment: 'مبيعات قوية، والعرض يحتاج تركيزًا أكبر على الأثر.', at: '2027-06-14' },
)

export const applications: Application[] = [
  { id: 'ap1', at: '2027-06-02', track: 'intilaq-seat', entry: 'founder', leadName: 'شادن العتيبي', email: 'shaden@example.com', phone: '0500000001', college: 'خريجة كلية إدارة الأعمال', teamName: 'وِرد', teamSize: 4, problem: 'صعوبة إدارة الحجوزات في المراكز الصحية الصغيرة.', idea: 'نظام حجز ومتابعة للمراكز الصغيرة. لدينا 6 مراكز مشتركة بإيراد شهري.', status: 'interview' },
  { id: 'ap2', at: '2027-06-05', track: 'intilaq-seat', entry: 'founder', leadName: 'مشاعل الحربي', email: 'mashael@example.com', phone: '0500000002', college: 'رائدة أعمال', teamName: 'قِطاف', teamSize: 3, problem: 'المزارع الصغيرة لا تصل للمستهلك مباشرة.', idea: 'منصة اشتراك أسبوعي لسلال الخضار من المزارع المحلية.', status: 'new' },
  { id: 'ap3', at: '2027-06-09', track: 'intilaq-seat', entry: 'research', leadName: 'د. وفاء الشهري', email: 'wafa@example.com', phone: '0500000003', college: 'كلية الصيدلة', teamName: 'تركيب', teamSize: 3, problem: 'غياب بدائل محلية لمستحضرات طبية جلدية.', idea: 'مستحضر مرخّص مبني على براءة اختراع للفريق، مع تجربة بيع في صيدليتين.', status: 'new' },
  { id: 'ap4', at: '2027-06-11', track: 'ilham', entry: 'student', leadName: 'رغد المطيري', email: 'raghad@example.com', phone: '0500000004', college: 'كلية التصاميم والفنون', teamName: '', teamSize: 1, problem: 'صعوبة إيجاد أزياء مناسبة لذوات الإعاقة الحركية.', idea: 'تصاميم تكيفية سهلة الارتداء.', status: 'new' },
  { id: 'ap5', at: '2027-06-12', track: 'ilham', entry: 'student', leadName: 'لجين القحطاني', email: 'lujain@example.com', phone: '0500000005', college: 'كلية علوم الحاسب والمعلومات', teamName: 'نَفَس', teamSize: 2, problem: 'مرضى الربو لا يتتبعون محفزات النوبات.', idea: 'تطبيق يربط جودة الهواء بالأعراض اليومية.', status: 'new' },
  { id: 'ap6', at: '2027-05-30', track: 'intilaq-seat', entry: 'founder', leadName: 'أسماء الدوسري', email: 'asma@example.com', phone: '0500000006', college: 'رائدة أعمال', teamName: 'منصّة رُكن', teamSize: 2, problem: 'المساحات التجارية الصغيرة شاغرة معظم الوقت.', idea: 'تأجير بالساعة للمساحات التجارية الصغيرة.', status: 'declined', note: 'المنتج في مرحلة الفكرة، يُنصح بالتقديم على الإلهام 2028.' },
]

export const nominations: Nomination[] = [
  { id: 'n1', at: '2027-06-07', name: 'أ. غادة الرميح', email: 'ghada@example.com', org: 'مستشارة تسويق رقمي', years: 9, kind: 'mentor', areas: ['التسويق الرقمي وتنمية المشاريع', 'استقطاب العملاء واختبار المنتجات'], note: 'أرشدت 12 مشروعًا ناشئًا في برامج سابقة.', status: 'new' },
  { id: 'n2', at: '2027-06-10', name: 'م. سلطان العسيري', email: 'sultan@example.com', org: 'مهندس أمن سيبراني', years: 11, kind: 'expert', areas: ['الأمن السيبراني', 'الأنظمة والامتثال'], note: 'متاح لاستشارات الامتثال وحماية البيانات.', status: 'new' },
  { id: 'n3', at: '2027-06-13', name: 'أ. بدور الفايز', email: 'badour@example.com', org: 'مستثمرة ملائكية', years: 7, kind: 'judge', areas: ['الاستثمار الجريء وتقييم الشركات الناشئة'], note: 'ترغب في المشاركة بيوم العروض الاستثماري.', status: 'new' },
]

export const escalations: Escalation[] = [
  { id: 'x1', at: '2027-06-14', level: 1, title: 'اعتذار مرشد عن جلسة الأسبوع 6', detail: 'اعتذر أ. عبدالله الحربي عن جلسات الثلاثاء لظرف طارئ. تحتاج فرق حصّالة ومشغل ودار إلى بديل.', raisedBy: 'a-maha', status: 'open' },
  { id: 'x2', at: '2027-06-08', level: 2, title: 'تأخر فريق قافلة في بدء تجربة المنتج', detail: 'لم يحصل الفريق على موافقة الجهة المستضيفة للتجربة، والموعد يقترب.', teamId: 't15', raisedBy: 'm-reem', status: 'open' },
  { id: 'x3', at: '2027-06-03', level: 1, title: 'نقص تجهيزات قاعة ورشة الهوية', detail: 'الشاشة الثانية غير متاحة.', raisedBy: 'a-maha', status: 'resolved', resolution: 'نُقلت الورشة إلى قاعة الابتكار 2.' },
  { id: 'x4', at: '2027-05-10', level: 3, title: 'تعديل الجدول بسبب إجازة عيد الأضحى', detail: 'تمديد تمكين أسبوعين ليشمل الإجازة دون المساس بيوم التحكيم.', raisedBy: 'a-maha', status: 'resolved', resolution: 'اعتمدت اللجنة التوجيهية التعديل في 12 مايو.' },
]
