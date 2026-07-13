// ArthaRoshni — marketing/site content for the CFI-style redesign.
// Layout mirrors the uploaded design; copy is adapted to what the app really offers.

export const HOME_COURSES = [
  {
    cls: 'class-10', grade: '10', icon: '🌱', duration: '6h 30m', rating: 4.9,
    title: 'Development — Class 10 Economics',
    desc: 'Understand per-capita income, HDI, sustainable development and compare the goals of different communities through NCERT-aligned notes.',
    tags: ['Class 10', 'NCERT', 'Case Study'], grad: 'grad-teal',
  },
  {
    cls: 'class-10', grade: '10', icon: '🏭', duration: '5h 45m', rating: 4.8,
    title: 'Sectors of the Indian Economy',
    desc: 'Master primary, secondary and tertiary sectors, organised vs unorganised economy and the rise of services in India.',
    tags: ['Class 10', 'Diagram-based'], grad: 'grad-navy-mid',
  },
  {
    cls: 'class-10', grade: '10', icon: '💳', duration: '7h 10m', rating: 4.9,
    title: 'Money and Credit',
    desc: 'From barter to digital payments — money as a medium of exchange, formal & informal credit, SHGs and the RBI’s role.',
    tags: ['Class 10', 'Real-life Examples'], grad: 'grad-amber',
  },
  {
    cls: 'class-11', grade: '11', icon: '📈', duration: '6h 00m', rating: 4.8,
    title: 'Introduction to Microeconomics — Class 11',
    desc: 'Build a rock-solid foundation: scarcity, choice, PPF, demand–supply, elasticity and consumer behaviour with diagrams.',
    tags: ['Class 11', 'Foundations'], grad: 'grad-navy-deep',
  },
  {
    cls: 'class-11', grade: '11', icon: '🏛️', duration: '8h 20m', rating: 4.9,
    title: 'Indian Economy on the Eve of Independence',
    desc: 'Analyse the colonial legacy — agricultural stagnation, zamindari, de-industrialisation and the economy of 1947.',
    tags: ['Class 11 & 12', 'History'], grad: 'grad-violet',
  },
  {
    cls: 'class-11', grade: '11', icon: '📊', duration: '4h 50m', rating: 4.7,
    title: 'Statistics for Economics — Complete',
    desc: 'Measures of central tendency, dispersion, correlation, index numbers and presentation of data for boards.',
    tags: ['Class 11', 'Numerical'], grad: 'grad-teal',
  },
  {
    cls: 'class-12', grade: '12', icon: '🧮', duration: '7h 00m', rating: 4.9,
    title: 'National Income Accounting — Class 12',
    desc: 'GDP, GNP, NNP at factor cost & market price — value-added, income and expenditure methods, step by step.',
    tags: ['Class 12', 'Numerical'], grad: 'grad-navy-deep',
  },
  {
    cls: 'class-12', grade: '12', icon: '🏦', duration: '6h 40m', rating: 4.8,
    title: 'Money & Banking — Class 12 Macro',
    desc: 'Functions of money, money supply (M1), commercial banks, RBI credit creation and monetary policy instruments.',
    tags: ['Class 12', 'Concept-heavy'], grad: 'grad-navy-mid',
  },
  {
    cls: 'class-12', grade: '12', icon: '⚖️', duration: '5h 30m', rating: 4.8,
    title: 'Government Budget & Fiscal Policy',
    desc: 'Revenue & capital receipts and expenditure, fiscal deficit, and how the Union Budget shapes daily life.',
    tags: ['Class 12', 'Current Affairs'], grad: 'grad-rose',
  },
];

export const CERTS = [
  {
    code: 'ACE-10', grad: 'grad-amber',
    title: 'ArthaRoshni CBSE 10 Achiever',
    subtitle: 'Complete every Class 10 Economics chapter and pass all the chapter quizzes.',
    tags: ['Class 10', 'Board Exam', 'Notes + Quizzes'],
    href: '#/class/class-10',
    steps: ['Read all Class 10 chapters', 'Score 80%+ in every chapter quiz', 'Revise with bookmarks & key terms'],
  },
  {
    code: 'ACE-11', grad: 'grad-navy-mid',
    title: 'Statistics & Micro Foundations',
    subtitle: 'Dual path covering Statistics for Economics + Intro to Micro for Class 11.',
    tags: ['Class 11', 'NCERT', 'Numericals'],
    href: '#/class/class-11',
    steps: ['Finish the Class 11 statistics chapters', 'Master the micro foundations notes', 'Clear all Class 11 quizzes at 80%+'],
  },
  {
    code: 'ACE-12', grad: 'grad-navy-deep',
    title: 'Macro & IED Master',
    subtitle: 'National income, money & banking, the budget and India’s development journey.',
    tags: ['Class 12', 'Board Exam', 'Macro + IED'],
    href: '#/class/class-12',
    steps: ['Read every Class 12 macro & IED chapter', 'Practise national-income numericals', 'Clear all Class 12 quizzes at 80%+'],
  },
  {
    code: 'ACE-PRO', grad: 'grad-rose',
    title: 'Research & Labs Pro',
    subtitle: 'Go beyond the syllabus — Python, data analysis and econometrics through the 500-lab catalogue.',
    tags: ['Advanced', '500 Labs', 'Python & Data'],
    href: '#/catalogue',
    steps: ['Complete the Python Foundations track', 'Build 10+ labs from Data & Econometrics', 'Finish one capstone research lab'],
  },
];

export const CLASS_FEATURES = {
  'class-10': {
    heading: 'Class 10 Economics',
    tagline: 'Foundation Economics — aligned to the CBSE syllabus and the NCERT textbook, chapter by chapter.',
    bullets: [
      { title: 'NCERT-exact explanations', desc: 'Every chapter broken into bite-sized lessons matching the textbook flow.' },
      { title: 'Infographics & diagrams', desc: 'Visual notes, tables and connector diagrams for full-mark answers.' },
      { title: 'Chapter quizzes', desc: 'Instant-feedback practice for every ready chapter, with scores saved on your device.' },
    ],
  },
  'class-11': {
    heading: 'Class 11 Economics',
    tagline: 'Statistics for Economics + Intro to Microeconomics — built for CBSE and school internals.',
    bullets: [
      { title: 'Statistics made visual', desc: 'Mean, median, mode, correlation & index numbers with step-by-step sums.' },
      { title: 'Microeconomic intuition', desc: 'Demand, supply, elasticity & producer behaviour through real examples.' },
      { title: 'Key terms for every chapter', desc: 'Definition banks so no term in the paper catches you off guard.' },
    ],
  },
  'class-12': {
    heading: 'Class 12 Economics',
    tagline: 'Macro + Indian Economic Development — the two papers that decide your board score.',
    bullets: [
      { title: 'Numerical mastery', desc: 'National income, money multiplier and budget sums, solved step by step.' },
      { title: 'IED timeline', desc: '1947 → 1991 → today — a clear story of India’s economic journey.' },
      { title: 'Concept-first macro', desc: 'Money & banking, budget and balance of payments explained without jargon.' },
    ],
  },
};

// NOTE: placeholder marketing voices from the uploaded design —
// replace with real student feedback as it arrives.
export const TESTIMONIALS = [
  {
    name: 'Aarav Kumar', role: 'Class 12, Patna',
    score: 'Macro numericals, mastered',
    quote: 'ArthaRoshni made national-income numericals feel easy. I practised the solved sums until I could walk into any test fully confident.',
  },
  {
    name: 'Priya Singh', role: 'Class 10, Gaya',
    score: 'Loves the visual notes',
    quote: 'The diagrams and infographics are gold — I replicated them in my answer sheets and my teacher was genuinely surprised!',
  },
  {
    name: 'Rohan Verma', role: 'Class 11, Ranchi',
    score: 'Statistics, finally clear',
    quote: 'I started with the Class 11 statistics chapters and moved on to the Python labs. The labs alone are worth more than any coaching.',
  },
  {
    name: 'Sneha Gupta', role: 'Economics Teacher, Muzaffarpur',
    score: 'Recommends it to her class',
    quote: 'I point every student in my class to ArthaRoshni. The NCERT alignment is exact — it saves me hours of explanation.',
  },
];

export const PLATFORM_FEATURES = [
  { icon: '📖', title: 'Visual chapter notes', desc: 'Every chapter explained with infographics, tables and connector diagrams — not walls of text.' },
  { icon: '🔬', title: '500 technical labs', desc: 'Econometrics, Python, NLP and behavioral experiments — the skills top universities teach, free in your browser.' },
  { icon: '📝', title: 'Board-pattern quizzes', desc: 'Chapter-wise practice with instant feedback and a real-PYQ import slot, scores tracked on your device.' },
  { icon: '📴', title: 'Works fully offline', desc: 'Install it like an app and study even on low-network days — built for tier-2 and tier-3 cities.' },
  { icon: '📄', title: '500-lab PDF catalogue', desc: 'The complete lab curriculum as a printable, shareable PDF — download it once, keep it forever.' },
  { icon: '💛', title: 'Free, forever', desc: 'No fees, no login walls, no ads inside lessons. Cost should never be a barrier to world-class learning.' },
];

export const CAREERS = [
  { icon: '📈', title: 'Economist', desc: 'Research policy, analyse data, advise governments and think tanks.' },
  { icon: '📊', title: 'Data Analyst', desc: 'Turn Statistics + Economics into insights for top Indian firms.' },
  { icon: '🏦', title: 'Banking Officer', desc: 'SBI PO, RBI Grade B — economics is the single biggest edge.' },
  { icon: '🎓', title: 'Civil Services (UPSC)', desc: 'Optional subject, essay and GS-3 — all benefit from strong economics.' },
  { icon: '📰', title: 'Financial Journalist', desc: 'Explain the Union Budget, RBI policy and markets to millions of readers.' },
  { icon: '🏅', title: 'CUET / College Admissions', desc: 'Delhi University, Ashoka, SRCC — economics opens the best UG colleges.' },
];

export const TEACHERS = [
  { name: 'Macro & IED', subject: 'National income to LPG reforms', emoji: '🏦' },
  { name: 'Micro & Statistics', subject: 'Demand, supply & data handling', emoji: '📈' },
  { name: 'Indian Economy', subject: '1947 → today, the full story', emoji: '🏛️' },
  { name: 'Board Strategy', subject: 'Answer writing & marking scheme', emoji: '🎯' },
  { name: 'Python & Data', subject: 'Code-first economics labs', emoji: '🐍' },
  { name: 'Diagrams & Cases', subject: 'Full-mark visual answers', emoji: '✏️' },
];

export const SOURCES = [
  'NCERT', 'CBSE', 'RBI', 'Economic Survey', 'Union Budget', 'PIB', 'NITI Aayog', 'World Bank',
];
