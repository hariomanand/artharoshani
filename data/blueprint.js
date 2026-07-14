// India's Economic Blueprint — interactive special page content.
// Source: "The Economic Blueprint of India — From Colonial Stagnation to
// Global Emergence: An 8-Chapter Architecture" (uploaded deck, 13 slides).
// Maps to CBSE Class 11/12 Indian Economic Development chapters.

export const BLUEPRINT = {
  title: 'The Economic Blueprint of India',
  subtitle: 'From Colonial Stagnation to Global Emergence — an 8-chapter architecture',
  heroStats: [
    { value: 1, prefix: '<', suffix: '%', label: 'GDP growth under colonial rule', decimals: 0 },
    { value: 1991, label: 'The year of the systemic pivot', plain: true },
    { value: 50, prefix: '>', suffix: '%', label: 'Services share of GDP today' },
    { value: 5, prefix: '$', suffix: 'T', label: 'The economy India is building toward' },
  ],
};

export const BP_CHAPTERS = [
  {
    id: 'colonial-baseline', num: 1, icon: 'bank', color: '#f97316',
    era: 'Pre-1947', short: 'Colonial Baseline',
    title: 'The Colonial Baseline',
    tagline: 'A structurally stagnant economy engineered to serve another country.',
    node: { x: 659, y: 449, city: 'Kolkata', note: 'Capital of British India till 1911' },
    facts: [
      { icon: 'trendUp', k: 'GDP growth', v: '< 1% a year', d: 'Aggregate output barely moved for decades — the textbook definition of stagnation.' },
      { icon: 'factory', k: 'Industry', v: 'Low & extractive', d: 'Indigenous handicrafts collapsed; modern industry was tiny and foreign-owned.' },
      { icon: 'globe', k: 'Trade', v: 'Raw materials out', d: 'Exports were raw materials; imports were expensive finished goods — a deficit by design.' },
      { icon: 'users', k: 'Workforce', v: '85% agrarian', d: 'The overwhelming majority depended on a starving farm sector.' },
    ],
    drain: {
      title: 'The Drain of Wealth',
      sub: 'The two-fold motive of colonial exploitation',
      out: 'Raw materials exported', back: 'Expensive finished goods imported',
      result: 'Deindustrialisation: collapse of indigenous handicraft industries and massive unemployment.',
    },
    cycle: {
      title: 'The Vicious Cycle of Stagnation',
      steps: [
        { t: 'Zamindari system', d: 'Profit accrues to zamindars, not cultivators.' },
        { t: 'No capital investment', d: 'Agriculture starved of resources.' },
        { t: 'Low productivity', d: 'Stagnant crop yields.' },
        { t: 'Poverty & vulnerability', d: 'Cultivators remain dependent.' },
      ],
    },
    timeline: [
      { y: '1850', t: 'Railways introduced' },
      { y: '1869', t: 'Suez Canal opened' },
    ],
    timelineNote: 'The Infrastructure Motive — not built for public amenity, but to mobilise the army and draw raw materials from the countryside to ports for the British home country.',
  },
  {
    id: 'planning-era', num: 2, icon: 'wheat', color: '#22c55e',
    era: '1947–1990', short: 'Planning Era',
    title: 'The Foundations of Independence',
    tagline: 'Five-Year Plans, a mixed economy and the Green Revolution.',
    node: { x: 376, y: 221, city: 'Punjab', note: 'Heartland of the Green Revolution' },
    goals: {
      title: 'The Planning Era (1950–1990)', center: 'Mixed Economy Framework',
      items: [
        { icon: 'trendUp', t: 'Growth', d: 'Expanding the capacity to produce goods and services.' },
        { icon: 'gears', t: 'Modernisation', d: 'Adopting new technology and driving changes in social outlook.' },
        { icon: 'flag', t: 'Self-reliance', d: 'Avoiding imports of goods that could be produced domestically, to protect sovereignty.' },
        { icon: 'users', t: 'Equity', d: 'Ensuring benefits reach the poor; standard of living rises for all.' },
      ],
    },
    facts: [
      { icon: 'checkSquare', k: 'Planned economy', v: 'Five-Year Plans', d: 'FYPs introduced; state-led industrialisation through PSUs.' },
      { icon: 'factory', k: 'Strategy', v: 'Import substitution', d: 'Heavy industry base built behind protective walls.' },
      { icon: 'wheat', k: 'Food security', v: 'Green Revolution', d: 'From ship-to-mouth dependence to national self-sufficiency in food grains.' },
      { icon: 'gradcap', k: 'Institutions', v: 'Built from zero', d: 'IITs, universities and research institutions established.' },
    ],
    formula: {
      title: 'Engineering the Green Revolution',
      inputs: ['HYV Seeds', 'Fertilizers & Pesticides', 'Reliable Irrigation', 'Low-Interest Govt Loans'],
      output: 'Marketed Surplus',
      outputDef: 'The portion of agricultural produce sold by farmers in the market, leading to relative price declines for food.',
      result: 'Breaking permanent agricultural stagnation and achieving national self-sufficiency in food grains.',
    },
  },
  {
    id: 'reforms-1991', num: 3, icon: 'chain', color: '#f5b301',
    era: '1991', short: '1991 Pivot',
    title: 'The 1991 Inflection Point',
    tagline: 'Crisis, a $7 billion loan, and the L-P-G reforms that rewired India.',
    node: { x: 381, y: 290, labelBelow: true, city: 'New Delhi', note: 'The New Economic Policy is announced' },
    crisis: 'Driven by a balance of payments crisis, India secured a $7 billion loan from the World Bank/IMF — triggering the New Economic Policy.',
    lpg: [
      { icon: 'chain', t: 'Liberalisation', d: 'Deregulating the industrial sector, removing restrictive licensing, and opening the financial sector.' },
      { icon: 'handshake', t: 'Privatisation', d: 'Disinvestment of Public Sector Undertakings (PSUs), granting managerial autonomy (Maharatnas, Navratnas).' },
      { icon: 'globe', t: 'Globalisation', d: 'Integrating with the world economy, removing trade barriers, joining the WTO (1995), and fueling the outsourcing boom.' },
    ],
    versus: {
      before: { title: 'Pre-1991', items: ['License Raj (bureaucracy)', 'Closed economy', 'High tariffs'] },
      after: { title: 'Post-1991', items: ['Market reforms', 'Global integration', 'Private sector growth'] },
    },
  },
  {
    id: 'growth-pillars', num: 4, icon: 'pillar', color: '#38bdf8',
    era: 'Post-1991', short: 'Growth Pillars',
    title: 'Structural Pillars & Growth Drivers',
    tagline: 'Infrastructure, digital rails, manufacturing and a services superpower.',
    node: { x: 251, y: 555, city: 'Mumbai', note: 'Financial capital' },
    pillars: [
      { icon: 'road', t: 'Infrastructure', stat: '>30 km/day', d: 'National highway network expansion, urban transport (metros), logistics & connectivity.' },
      { icon: 'chip', t: 'Digital economy', stat: 'Billions of transactions monthly', d: 'Digital Public Infrastructure (UPI, Aadhaar), internet penetration growth, FinTech revolution, startup ecosystem.' },
      { icon: 'factory', t: 'Manufacturing', stat: 'Make in India', d: 'PLI schemes and defence production driving the industrial push.' },
      { icon: 'trendUp', t: 'Services (IT & innovation)', stat: '>50% of GDP', d: 'Global Capability Centers, IT services export boom, skill development.' },
    ],
    demography: {
      title: 'Demographic Dividend & Human Capital',
      stat: '~28 years', statLabel: 'Median age of India',
      items: ['Working-age population growth', 'Education & skilling initiatives', 'Healthcare access improvement', 'Innovation & research'],
    },
  },
  {
    id: 'human-capital', num: 5, icon: 'gradcap', color: '#a78bfa',
    era: 'Chapter 5', short: 'Human Capital',
    title: 'The Foundations of Human Capital',
    tagline: 'Education and health — the core sources of a productive nation.',
    node: { x: 381, y: 730, city: 'Bengaluru', note: 'India’s talent & tech hub' },
    venn: { a: 'Education', b: 'Health', caption: 'The core sources of human capital.' },
    compare: [
      { t: 'Human Capital', accent: '#f5b301', d: 'Treats human beings as a means to an end. Focuses on increasing economic productivity (e.g., an unhealthy worker is less productive).' },
      { t: 'Human Development', accent: '#22c55e', d: 'Treats human beings as an end in themselves. Focuses on overall well-being and freedom (e.g., health and education have intrinsic value, regardless of productivity).' },
    ],
    facts: [
      { icon: 'gradcap', k: 'Education access', v: 'Widening', d: 'Enrolment has climbed, but the skill gap remains the challenge to close.' },
      { icon: 'heart', k: 'Health outcomes', v: 'Improving', d: 'Life expectancy and schooling improve; per-capita income still lags peers.' },
    ],
  },
  {
    id: 'rural-lifeline', num: 6, icon: 'wheat', color: '#34d399',
    era: 'Chapter 6', short: 'Rural India',
    title: 'The Rural Lifeline',
    tagline: 'Credit, cooperatives and the quiet revolution of Self-Help Groups.',
    node: { x: 407, y: 599, city: 'Hyderabad', note: 'SHG movement stronghold' },
    flow: {
      apex: { t: 'NABARD', d: 'Apex body for rural credit' },
      mid: [{ t: 'Formal Banking Sector' }, { t: 'Cooperative Banks' }],
      out: { t: 'SHGs (Self-Help Groups)', d: 'Micro-credit empowerment' },
      crossed: { t: 'Informal Moneylenders', d: 'Predatory lending — bypassed' },
    },
    alt: 'Alternative strategies: expanding agricultural marketing cooperatives and shifting toward sustainable organic farming.',
    facts: [
      { icon: 'bank', k: 'Rural credit', v: 'Formalised', d: 'NABARD channels credit through banks and cooperatives instead of moneylenders.' },
      { icon: 'users', k: 'Empowerment', v: 'SHGs', d: 'Micro-credit groups put finance in the hands of rural women.' },
    ],
  },
  {
    id: 'employment', num: 7, icon: 'users', color: '#fb7185',
    era: 'Chapter 7', short: 'Employment',
    title: 'The Paradox of Jobless Growth',
    tagline: 'GDP grew — but did the people? Work, informality and sustainability.',
    node: { x: 446, y: 722, labelBelow: true, city: 'Chennai', note: 'Manufacturing & services corridor' },
    paradox: {
      title: 'Workforce participation numbers obscure the reality of where and how people are working.',
      gdpLabel: 'Total GDP growth (post-reform era)',
      empLabel: 'Formal employment growth',
      informal: 'The informal sector — the vast majority of the workforce participates here, lacking social security and formal labor protections.',
    },
    carrying: {
      title: 'The Carrying Capacity',
      sub: 'Sustainable development means satisfying present needs without compromising the biocapacity of future generations.',
      circles: ['Economic Capacity', 'Social Needs', 'Biocapacity (Environmental Functions)'],
      breach: 'Global warming & resource depletion — a breach of the environmental boundary.',
    },
    facts: [
      { icon: 'users', k: 'Micro reality', v: 'Informal work', d: 'Macro-economic growth does not automatically equal micro-economic development.' },
      { icon: 'leaf', k: 'Sustainability', v: 'Climate action', d: 'Environment, resource management and climate action set the limits of growth.' },
    ],
  },
  {
    id: 'global-emergence', num: 8, icon: 'globe', color: '#67e8f9',
    era: 'Future horizon', short: 'Global Emergence',
    title: 'The Global Emergence',
    tagline: 'Comparative development — and the road to an economic powerhouse.',
    node: { x: 239, y: 444, city: 'GIFT City', note: 'India’s global finance gateway' },
    compare3: {
      title: 'The Global Radar: Comparative Development',
      cols: ['India', 'China', 'Pakistan'],
      rows: [
        { k: 'Growth path', v: ['Market-led reforms (1991), democratic framework.', 'State-led structural reforms (1978), massive manufacturing scale.', 'Mixed economy, intermittent reforms, political volatility.'] },
        { k: 'Sectoral shift', v: ['Unique leap directly from agriculture to services/IT.', 'Traditional transition from agriculture to dominant manufacturing.', 'Slower transition, high reliance on agriculture.'] },
        { k: 'Human Development Index', v: ['Improving life expectancy & schooling; challenges in per-capita income.', 'Highest HDI of the three; strong health and income metrics.', 'Struggling HDI metrics; lower educational attainment.'] },
      ],
    },
    drivers: {
      title: 'Key drivers of the future trajectory',
      items: ['Sustainable Development Goals (SDGs)', 'Green energy transition (solar, hydrogen)', 'Advanced technology leadership (AI, space)', 'Strategic global partnerships'],
      result: 'Projected GDP: towards $5 trillion and beyond.',
    },
  },
];

export const bpChapterById = id => BP_CHAPTERS.find(c => c.id === id);
