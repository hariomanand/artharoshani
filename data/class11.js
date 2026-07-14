// Class 11 — "Indian Economic Development" + "Statistics for Economics"
// Full chapter map. Seeded chapters carry complete notes; others are
// structured stubs (status:'soon') ready to be filled from the same schema.

const soon = (id, number, title, summary) => ({ id, number, title, summary, status: 'soon', lessons: [], keyTerms: [], questions: [] });

// Auto-scaling bar chart (tallest bar = full height; real values shown as labels)
const svgBar = (title, bars, unit = '') => {
  const max = Math.max(...bars.map(b => b.v));
  const n = bars.length;
  return `
<svg viewBox="0 0 340 200" role="img" aria-label="${title}">
  <line x1="40" y1="10" x2="40" y2="165" stroke="var(--line)" stroke-width="2"/>
  <line x1="40" y1="165" x2="330" y2="165" stroke="var(--line)" stroke-width="2"/>
  ${bars.map((b, i) => {
    const w = Math.min(52, 260 / n - 12);
    const x = 55 + i * (275 / n);
    const h = Math.max(6, (b.v / max) * 135);
    const y = 165 - h;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${b.c}"/>
      <text x="${x + w / 2}" y="${y - 6}" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--ink)">${b.v}${unit}</text>
      <text x="${x + w / 2}" y="182" text-anchor="middle" font-size="10.5" fill="var(--ink-soft)">${b.l}</text>`;
  }).join('')}
</svg>`;
};

export default {
  id: 'class-11',
  grade: '11',
  title: 'Class 11 Economics',
  subtitle: 'Indian Economic Development · Statistics for Economics',
  color: '#0d9488',
  ncert: 'https://ncert.nic.in/textbook.php?keec1=0-8',
  subjects: [
    {
      id: 'c11-ied',
      title: 'Indian Economic Development',
      note: 'Development policies, economic reforms and current challenges of India.',
      color: '#0d9488',
      chapters: [
        {
          id: 'c11-ied-ch1', number: 1, status: 'ready',
          title: 'Indian Economy on the Eve of Independence',
          summary: 'The state of India’s economy under colonial rule in 1947.',
          lead: 'British colonial policies transformed India into a supplier of raw materials and a market for finished goods. This chapter reviews agriculture, industry and foreign trade at independence.',
          readingTime: '13 min',
          lessons: [
            {
              id: 'l1', title: 'Low Level of Economic Development under Colonial Rule',
              blocks: [
                { type: 'p', text: 'The sole purpose of British colonial rule was to reduce India to a <b>supplier of raw materials</b> for Britain’s industries and a <b>market</b> for its finished goods. No serious attempt was made to estimate India’s national income.' },
                { type: 'callout', variant: 'exam', label: 'National income estimates', text: 'Among pre-independence estimators, <b>V.K.R.V. Rao</b>’s estimates were the most significant. India’s growth of aggregate real output was less than 2% per year during the first half of the 20th century.' },
              ]
            },
            {
              id: 'l2', title: 'Agriculture, Industry & Foreign Trade',
              blocks: [
                { type: 'flow', steps: [
                  { title: 'Stagnant Agriculture', text: 'Low productivity due to the zamindari system, lack of investment, and forced commercialisation of crops.' },
                  { title: 'De-industrialisation', text: 'The decline of handicrafts without a rise of modern industry — creating unemployment and turning India into an importer of manufactures.' },
                  { title: 'Colonial Foreign Trade', text: 'India became an exporter of primary products and importer of finished goods; the export surplus drained wealth to Britain.' },
                ]},
                { type: 'callout', variant: 'def', label: 'Demographic condition', text: 'Before 1921, India was in the first stage of demographic transition. Literacy was under 16%, life expectancy was only about 32 years, and infant mortality was very high (about 218 per 1,000).' },
                { type: 'callout', variant: 'tip', label: 'Some unintended positives', text: 'The British built railways, ports and a telegraph network — mainly to serve colonial interests, but these later became part of India’s infrastructure.' },
              ]
            },
            {
              id: 'l3', title: 'The Mentor’s Lens: How the Wealth Drained Away',
              blocks: [
                { type: 'callout', variant: 'def', label: 'The milk analogy', text: 'Imagine a household where a powerful neighbour walks in every morning and takes away all the milk from the family’s cows — leaving nothing for the children, and using it to make expensive sweets for his own profit elsewhere. That was the <b>Drain of Wealth</b>: India’s raw materials and gold fed Britain’s industries while India kept no surplus to grow.' },
                { type: 'p', text: 'Under the <b>Zamindari system</b>, the farmer was a tenant on his own ancestral land. He paid a high <i>lagaan</i> whether the monsoon came or failed. Because the zamindar took everything, nothing was left for better seeds or a well — only a cycle of debt and hunger.' },
                { type: 'h', text: 'The stagnation loop' },
                { type: 'flow', steps: [
                  { title: 'Colonial policy', text: 'Extraction of resources and high land revenue.' },
                  { title: 'Low investment', text: 'Farmers and local businesses kept no surplus cash.' },
                  { title: 'Obsolete technology', text: 'No money for modern tools, seeds or fertilisers.' },
                  { title: 'Low productivity', text: 'The land produced less and less over time.' },
                  { title: 'Mass poverty', text: 'The final, heartbreaking result for the Indian people.' },
                ]},
                { type: 'callout', variant: 'exam', label: 'The numbers to remember', text: 'In the first half of the 20th century, aggregate real output grew at <b>less than 2% a year</b> — and <b>per capita output at about 0.5%</b>. Two hundred years of rule left literacy under 16% and life expectancy near 32 years. Draw the drain-of-wealth diagram once — resources flowing out, nothing flowing back — and you will never forget it.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'De-industrialisation', def: 'The systematic decline of India’s handicraft industries without a corresponding rise of modern industry.' },
            { term: 'Drain of Wealth', def: 'The export surplus that flowed to Britain without an equivalent return to India.' },
            { term: 'Commercialisation of Agriculture', def: 'Production of crops for the market/export rather than for self-consumption.' },
            { term: 'Demographic Transition', def: 'The shift in birth and death rates as an economy develops.' },
          ],
          questions: [
            { q: 'The most significant pre-independence national income estimate was by:', options: ['Dadabhai Naoroji', 'V.K.R.V. Rao', 'R.C. Desai', 'William Digby'], answer: 1, marks: 1, source: 'practice', explain: 'V.K.R.V. Rao’s estimates during 1931–1951 were considered the most significant.' },
            { q: 'Under British rule India mainly became a supplier of:', options: ['finished goods', 'raw materials', 'machinery', 'capital'], answer: 1, marks: 1, source: 'practice', explain: 'Colonial policy made India a supplier of raw materials and a market for British finished goods.' },
            { q: 'The decline of handicrafts without a rise of modern industry is called:', options: ['Commercialisation', 'De-industrialisation', 'Liberalisation', 'Globalisation'], answer: 1, marks: 1, source: 'practice', explain: 'This process is known as de-industrialisation.' },
          ]
        },
        /* ---------------------------------------------------------- CH 2 */
        {
          id: 'c11-ied-ch2', number: 2, status: 'ready',
          title: 'Indian Economy 1950–1990',
          summary: 'Planning, the goals of five year plans, agriculture and industry.',
          lead: 'After independence, India chose planned development. This chapter covers the goals of the Five Year Plans, the Green Revolution, and the policy of import substitution.',
          readingTime: '14 min',
          lessons: [
            {
              id: 'l1', title: 'The Era of Planning',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Planning — the family budget analogy', text: 'Think of a family sitting together after a long struggle to make a 20-year budget: how much to save for bricks this year, how much for cement the next. India’s <b>Five Year Plans</b> were that national budget — building the country’s “house” from scratch after 200 years of neglect.' },
                { type: 'h', text: 'The four goals of the plans' },
                { type: 'flow', steps: [
                  { title: 'Growth', text: 'Increase the country’s capacity to produce — a larger GDP.' },
                  { title: 'Modernisation', text: 'Adopt new technology, and modern social outlooks like equal rights for women.' },
                  { title: 'Self-reliance', text: 'Reduce dependence on foreign food and foreign capital — a nation that feeds itself.' },
                  { title: 'Equity', text: 'Ensure benefits reach the poorest — growth is meaningless if only the landlord gets richer.' },
                ]},
                { type: 'callout', variant: 'tip', label: 'Equity, humanised', text: '“Equity” was the promise that a small farmer in a Bihar village has the same right to food and opportunity as a wealthy businessman in a city — that no one would be left behind.' },
              ]
            },
            {
              id: 'l2', title: 'The Green Revolution & Industry',
              blocks: [
                { type: 'p', text: 'Imagine a farmer in the 1960s who always feared the next drought. With <b>High Yielding Variety (HYV) seeds</b>, assured irrigation, and fertilisers, his harvest was suddenly so large that he did not just fill his family’s bellies — he had a <b>marketable surplus</b> to sell. India moved from a “begging bowl” to feeding itself.' },
                { type: 'figure', title: 'Foodgrain production', caption: 'India’s foodgrain production, million tonnes (approx.). The Green Revolution years transformed the curve.', svg: svgBar('Foodgrain production', [
                  { l: '1950–51', v: 51, c: '#94a3b8' }, { l: '1960–61', v: 82, c: '#64748b' }, { l: '1970–71', v: 108, c: '#0d9488' }, { l: '1990–91', v: 176, c: '#16a34a' }
                ]) },
                { type: 'table', headers: ['Self-reliance goal', 'Actual outcome'], rows: [
                  ['End dependence on foreign food aid', 'Food self-sufficiency achieved by the 1970s'],
                  ['Modernise farming methods', 'Wide adoption of HYV seeds and irrigation (first in wheat, then rice)'],
                  ['Land to the actual tillers', 'Mixed: land ceiling and tenancy reforms succeeded in Kerala & West Bengal, lagged elsewhere'],
                ]},
                { type: 'callout', variant: 'warn', label: 'The other side', text: 'The Green Revolution risked widening the gap between rich and poor farmers — HYV inputs were costly. And industry grew behind high protective walls: the <b>permit-licence raj</b> and import substitution built capacity but bred inefficiency, setting the stage for 1991.' },
                { type: 'callout', variant: 'exam', label: 'Import substitution', text: 'Producing at home what would otherwise be imported, protected by tariffs and quotas — the inward-looking trade strategy of 1950–1990.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Five Year Plans', def: 'India’s planned development documents setting goals of growth, modernisation, self-reliance and equity.' },
            { term: 'Green Revolution', def: 'The large rise in foodgrain output from HYV seeds, irrigation and fertilisers, beginning in the mid-1960s.' },
            { term: 'Marketable Surplus', def: 'The part of farm produce sold in the market after the farmer’s own consumption.' },
            { term: 'Import Substitution', def: 'Replacing imports with domestic production behind protective barriers.' },
          ],
          questions: [
            { q: 'Which of these was NOT a goal of India’s Five Year Plans?', options: ['Growth', 'Equity', 'Privatisation', 'Self-reliance'], answer: 2, marks: 1, source: 'practice', explain: 'The four plan goals were growth, modernisation, self-reliance and equity. Privatisation came with the 1991 reforms.' },
            { q: 'The Green Revolution first raised the output of:', options: ['Rice', 'Wheat', 'Cotton', 'Jute'], answer: 1, marks: 1, source: 'practice', explain: 'HYV adoption came first and strongest in wheat (Punjab, Haryana, western UP).' },
            { q: 'Produce sold in the market after self-consumption is called:', options: ['Subsistence output', 'Marketable surplus', 'Procurement', 'Buffer stock'], answer: 1, marks: 1, source: 'practice', explain: 'Marketable surplus = output minus the farmer’s own consumption.' },
          ]
        },
        /* ---------------------------------------------------------- CH 3 */
        {
          id: 'c11-ied-ch3', number: 3, status: 'ready',
          title: 'Liberalisation, Privatisation & Globalisation: An Appraisal',
          summary: 'The 1991 reforms (LPG) and their assessment.',
          lead: 'A foreign-exchange crisis in 1991 forced India to open its economy. This chapter explains the LPG reforms and weighs their results.',
          readingTime: '13 min',
          lessons: [
            {
              id: 'l1', title: '1991: The Cage Opens',
              blocks: [
                { type: 'callout', variant: 'def', label: 'The caged bird', text: 'Before 1991 the Indian economy was like a bird in a small cage — “safe” from the hawks outside, but never learning to fly. In 1991 the door opened. The bird had to compete, but it finally had the sky.' },
                { type: 'callout', variant: 'exam', label: 'The trigger', text: 'By mid-1991 foreign exchange reserves had fallen so low they could barely pay for <b>two weeks of imports</b>. India borrowed from the IMF and World Bank and, in return, launched the New Economic Policy.' },
                { type: 'flow', steps: [
                  { title: 'Liberalisation', text: 'End of the licence raj — industrial licensing abolished for most industries; markets, not permits, decide.' },
                  { title: 'Privatisation', text: 'Government stake in public sector companies sold (disinvestment) to improve efficiency.' },
                  { title: 'Globalisation', text: 'Trade barriers cut, the rupee devalued, foreign investment welcomed — India joined world markets.' },
                ]},
                { type: 'p', text: 'In your microeconomics lessons you will meet Adam Smith’s <b>“invisible hand”</b> — prices settling where demand meets supply. Before 1991 the government’s <i>visible</i> hand fixed prices, licences and quantities. The reforms let market prices work again in most sectors, while the State kept its role in health, education and safety nets.' },
              ]
            },
            {
              id: 'l2', title: 'An Appraisal — Did LPG Work?',
              blocks: [
                { type: 'figure', title: 'GDP growth by period', caption: 'India’s average annual GDP growth (%, approx.) — from the pre-reform “Hindu rate” to the post-reform acceleration.', svg: svgBar('GDP growth', [
                  { l: '1950–80', v: 3.5, c: '#94a3b8' }, { l: '1980s', v: 5.6, c: '#64748b' }, { l: '1990s', v: 5.8, c: '#0d9488' }, { l: '2000s', v: 7.3, c: '#16a34a' }
                ], '%') },
                { type: 'table', headers: ['Wins 🌱', 'Worries ⚠️'], rows: [
                  ['Faster GDP growth; services & IT boom', 'Agriculture’s growth slowed — where most Indians work'],
                  ['Foreign exchange crisis never returned; large reserves', 'Jobless growth — employment lagged output'],
                  ['Consumers gained choice and quality', 'Disinvestment proceeds sometimes used to cover deficits, not build assets'],
                ]},
                { type: 'callout', variant: 'warn', label: 'The Bihar angle', text: 'Reform gains clustered where infrastructure and skills already existed. States like Bihar, starting with weaker roads, power and schooling, gained more slowly — a reminder that markets need public facilities to deliver for everyone.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Liberalisation', def: 'Removing licences, permits and restrictions so market forces allocate resources.' },
            { term: 'Privatisation', def: 'Transfer of ownership or management of public sector enterprises to private hands; disinvestment is the sale of PSU equity.' },
            { term: 'Globalisation', def: 'Integration of the national economy with the world through trade, investment and technology.' },
            { term: 'New Economic Policy 1991', def: 'The reform package of stabilisation plus structural (LPG) measures launched in 1991.' },
          ],
          questions: [
            { q: 'In 1991, India’s forex reserves could finance imports for barely:', options: ['two years', 'six months', 'two weeks', 'two days'], answer: 2, marks: 1, source: 'practice', explain: 'Reserves had dropped to about two weeks of import cover — the immediate trigger of reforms.' },
            { q: 'The sale of government equity in PSUs is called:', options: ['Liberalisation', 'Disinvestment', 'Devaluation', 'Demonetisation'], answer: 1, marks: 1, source: 'practice', explain: 'Disinvestment = selling part of the government’s shareholding in public sector enterprises.' },
            { q: 'The pre-reform slow growth of ~3.5% is nicknamed the:', options: ['Nehru rate', 'Hindu rate of growth', 'Licence rate', 'Plan rate'], answer: 1, marks: 1, source: 'practice', explain: 'Economist Raj Krishna called India’s persistent ~3.5% growth the “Hindu rate of growth”.' },
          ]
        },
        /* ---------------------------------------------------------- CH 4 */
        {
          id: 'c11-ied-ch4', number: 4, status: 'ready',
          title: 'Human Capital Formation in India',
          summary: 'Education, health and investment in people.',
          lead: 'People become an economy’s most productive asset when society invests in their education, health and skills. This chapter explains how human capital is formed.',
          readingTime: '12 min',
          lessons: [
            {
              id: 'l1', title: 'Value Addition — In People',
              blocks: [
                { type: 'callout', variant: 'def', label: 'The raw-material analogy', text: 'An uneducated person is like raw iron — strong potential, untapped. Education and health are the <b>value addition</b> that turn raw potential into a “finished product”: a skilled farmer, nurse, teacher or engineer who adds value to the nation.' },
                { type: 'h', text: 'Sources of human capital' },
                { type: 'list', items: [
                  '<b>Education</b> — the most powerful investment: it raises earning power for a lifetime.',
                  '<b>Health</b> — a sick worker cannot produce; health spending is investment, not charity.',
                  '<b>On-the-job training</b> — skills learned at work raise productivity.',
                  '<b>Migration</b> — moving where your skills earn the most (a cost now, higher earnings later).',
                  '<b>Information</b> — knowing where jobs, prices and opportunities are.',
                ]},
                { type: 'table', headers: ['Physical capital', 'Human capital'], rows: [
                  ['Machines, buildings — can be sold', 'Skills, health — inseparable from the person'],
                  ['Depreciates with use', 'Grows with use and experience'],
                  ['Owner benefits', 'Person, family and society all benefit (external benefits)'],
                ]},
              ]
            },
            {
              id: 'l2', title: 'Why One Educated Girl Changes Three Generations',
              blocks: [
                { type: 'callout', variant: 'tip', label: 'Impact focus', text: 'Invest in the education of a girl from a village in rural Bihar and she does not just get a job — she educates her children, improves her family’s health, and inspires other girls. <b>One educated girl can change the economic destiny of three generations.</b>' },
                { type: 'p', text: 'India’s human capital effort runs through institutions like NCERT, UGC and AICTE in education, and ICMR in health. Government spending matters because education and health create <b>external benefits</b> that markets under-supply — my vaccination protects you too.' },
                { type: 'callout', variant: 'warn', label: 'Human capital vs human development', text: '<b>Human capital</b> treats education and health as means to productivity. <b>Human development</b> treats them as ends in themselves — every person has a right to literacy and a healthy life, productive or not. Both ideas matter; do not confuse them in the exam.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Human Capital', def: 'The stock of skill, education and health embodied in people that raises productivity.' },
            { term: 'Human Capital Formation', def: 'Adding to that stock — through education, health, training, migration and information.' },
            { term: 'External Benefits', def: 'Gains that spill over to others beyond the person who invests (e.g., vaccination, literacy).' },
            { term: 'Human Development', def: 'Education and health valued as ends in themselves, not just means to output.' },
          ],
          questions: [
            { q: 'Which is NOT a source of human capital formation?', options: ['Education', 'Health expenditure', 'Buying machinery', 'Migration'], answer: 2, marks: 1, source: 'practice', explain: 'Machinery is physical capital. Human capital forms via education, health, training, migration and information.' },
            { q: 'Human capital differs from physical capital because it:', options: ['can be sold in the market', 'is inseparable from its owner', 'depreciates faster', 'needs no investment'], answer: 1, marks: 1, source: 'practice', explain: 'Skills and health cannot be separated from the person, unlike a machine.' },
            { q: 'Education and health create benefits for society beyond the individual. These are:', options: ['private benefits', 'external benefits', 'transfer payments', 'subsidies'], answer: 1, marks: 1, source: 'practice', explain: 'External (spillover) benefits justify public spending on education and health.' },
          ]
        },
        /* ---------------------------------------------------------- CH 5 */
        {
          id: 'c11-ied-ch5', number: 5, status: 'ready',
          title: 'Rural Development',
          summary: 'Credit, marketing, diversification and organic farming.',
          lead: 'Real development for a state like Bihar must begin in its villages. This chapter covers rural credit, agricultural marketing, diversification and sustainable farming.',
          readingTime: '13 min',
          lessons: [
            {
              id: 'l1', title: 'The Bridge of Credit',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Credit — the bridge', text: 'For a farmer, credit is the <b>bridge between a dream and a harvest</b>. Without a fair loan at sowing time, he turns to the moneylender — whose interest can swallow the whole crop. Rural development starts with <b>institutional credit</b>: banks that help, not hurt.' },
                { type: 'callout', variant: 'exam', label: 'Bihar’s reality', text: 'About <b>three-fourths (~76%) of Bihar’s population depends on agriculture</b> — with low credit access and recurring floods. This is why rural credit, storage and roads decide Bihar’s future more than anything else.' },
                { type: 'table', headers: ['', 'Institutional (banks, cooperatives, RRBs)', 'Moneylender'], rows: [
                  ['Interest', 'Regulated, lower', 'Often 3–5% per month'],
                  ['Collateral', 'Needed (SHGs are the exception)', '“Flexible” — your land, your labour, your future'],
                  ['If crop fails', 'Rescheduling possible', 'Debt-trap begins'],
                ]},
                { type: 'h', text: 'The three pillars of rural development' },
                { type: 'flow', steps: [
                  { title: 'Credit', text: 'Fair loans through cooperatives, Regional Rural Banks and SHGs.' },
                  { title: 'Marketing', text: 'Fair prices — regulated mandis, storage, transport, MSP — so middlemen don’t take the farmer’s margin.' },
                  { title: 'Non-farm jobs', text: 'Livestock, fisheries, food processing and handicrafts, so a family survives even a failed monsoon.' },
                ]},
              ]
            },
            {
              id: 'l2', title: 'Diversification & the Organic Path',
              blocks: [
                { type: 'p', text: 'Diversification means not betting everything on rice and wheat. The neighbour who adds a small dairy or poultry unit beside his fields still has milk and egg income when the rains fail. Livestock, horticulture (litchi, banana, makhana) and fisheries are Bihar’s natural strengths.' },
                { type: 'callout', variant: 'tip', label: 'Operation Flood', text: 'Dairy cooperatives (the White Revolution) showed the model: collect, process and market milk collectively, and rural incomes rise without anyone leaving the village.' },
                { type: 'callout', variant: 'warn', label: 'Organic farming', text: 'Chemical-heavy farming kills soil health for one big harvest. <b>Organic farming</b> — composting, crop rotation — costs less in inputs, earns premium prices, and keeps the land fertile for your grandchildren. Its challenge: lower initial yields and weak certification/marketing infrastructure.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Rural Development', def: 'Comprehensive improvement of village economies: credit, marketing, infrastructure, non-farm jobs.' },
            { term: 'Agricultural Marketing', def: 'Assembling, storing, transporting, grading and selling farm produce.' },
            { term: 'Diversification', def: 'Shifting from single-crop dependence to varied crops and non-farm livelihoods.' },
            { term: 'Organic Farming', def: 'Chemical-free cultivation that restores soil health and earns premium prices.' },
          ],
          questions: [
            { q: 'Roughly what share of Bihar’s population depends on agriculture?', options: ['One-fourth', 'Half', 'Three-fourths', 'Almost none'], answer: 2, marks: 1, source: 'practice', explain: 'About 76% — which is why rural development is Bihar’s central economic question.' },
            { q: 'Which is NOT one of the three pillars of rural development discussed?', options: ['Credit', 'Marketing', 'Non-farm employment', 'Import substitution'], answer: 3, marks: 1, source: 'practice', explain: 'The pillars are credit, marketing and non-farm activities. Import substitution is a trade policy.' },
            { q: 'Operation Flood is associated with:', options: ['Irrigation', 'Milk cooperatives', 'Flood control', 'Fisheries'], answer: 1, marks: 1, source: 'practice', explain: 'Operation Flood built the national network of dairy cooperatives — the White Revolution.' },
          ]
        },
        /* ---------------------------------------------------------- CH 6 */
        {
          id: 'c11-ied-ch6', number: 6, status: 'ready',
          title: 'Employment: Growth, Informalisation & Related Issues',
          summary: 'Workforce, unemployment and informal sector.',
          lead: 'Who counts as a worker, why most Indian jobs are informal, and what “jobless growth” means for a young state like Bihar.',
          readingTime: '12 min',
          lessons: [
            {
              id: 'l1', title: 'A Tale of Two Brothers',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Formal vs informal', text: 'Two brothers in the same market: one works in the <b>Railways</b> — fixed salary, pension, medical leave (formal sector). The other runs a tea stall — earns only on days he works, no protection, can lose his spot any time (informal sector). India’s challenge: move more workers into the security of the first kind.' },
                { type: 'table', headers: ['Worker type', 'Description', 'Local example'], rows: [
                  ['Self-employed', 'Owns and operates a business', 'The village grocery shop owner'],
                  ['Casual wage labourer', 'Hired by the day or task', 'A construction worker at a Patna site'],
                  ['Regular salaried', 'Permanent job with benefits', 'A government school teacher'],
                ]},
                { type: 'figure', title: 'How India works', caption: 'Share of India’s workforce by type (%, PLFS 2017–18, approx.). Self-employment dominates — most Indians create their own job.', svg: svgBar('Workforce composition', [
                  { l: 'Self-employed', v: 52, c: '#0d9488' }, { l: 'Casual', v: 25, c: '#f59e0b' }, { l: 'Regular', v: 23, c: '#2563eb' }
                ], '%') },
              ]
            },
            {
              id: 'l2', title: 'Informalisation & Jobless Growth',
              blocks: [
                { type: 'callout', variant: 'warn', label: 'Informalisation', text: 'A worrying trend: even as the economy grows, most <b>new</b> jobs are informal. The worker who lost his sugar-mill job and now sells vegetables from a cart is still “employed” — but his life is far more fragile. Over 90% of India’s workers are informal.' },
                { type: 'p', text: '<b>Jobless growth</b> means GDP rising much faster than employment. Machines and software raise output per worker — good for productivity, hard on job-seekers. For Bihar, whose young population is its greatest asset, the answer lies in labour-intensive sectors: food processing, construction, textiles, tourism and services.' },
                { type: 'callout', variant: 'exam', label: 'Who is a worker?', text: 'Anyone engaged in an economic activity that adds to GDP — including the self-employed and unpaid family helpers. The <b>worker-population ratio</b> = (workers ÷ population) × 100 measures how many people actually work.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Worker-Population Ratio', def: 'Workers as a percentage of total population — a measure of employment.' },
            { term: 'Informalisation', def: 'The rising share of informal, unprotected jobs in total employment.' },
            { term: 'Jobless Growth', def: 'GDP growth without a matching growth in employment.' },
            { term: 'Casual Worker', def: 'A worker hired by the day or task, with no job security or benefits.' },
          ],
          questions: [
            { q: 'The largest category of Indian workers is:', options: ['Regular salaried', 'Casual labour', 'Self-employed', 'Government employees'], answer: 2, marks: 1, source: 'practice', explain: 'Just over half of Indian workers are self-employed (PLFS 2017–18: ~52%).' },
            { q: 'GDP rising much faster than employment is called:', options: ['Informalisation', 'Jobless growth', 'Disguised unemployment', 'Casualisation'], answer: 1, marks: 1, source: 'practice', explain: 'Jobless growth = output grows, jobs don’t keep pace.' },
            { q: 'A construction worker hired by the day is a:', options: ['Regular worker', 'Self-employed worker', 'Casual wage labourer', 'Formal worker'], answer: 2, marks: 1, source: 'practice', explain: 'Day/task-based hiring with no security = casual wage labour.' },
          ]
        },
        /* ---------------------------------------------------------- CH 7 */
        {
          id: 'c11-ied-ch7', number: 7, status: 'ready',
          title: 'Environment & Sustainable Development',
          summary: 'Environment as a resource and the path to sustainability.',
          lead: 'The environment is the savings account our ancestors left us. This chapter explains its functions, why it is under stress, and how development can be made sustainable.',
          readingTime: '11 min',
          lessons: [
            {
              id: 'l1', title: 'The Savings Account Analogy',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Live off the interest', text: 'Our environment is a <b>savings account</b> left by our ancestors. Withdraw all the capital today — every forest, every aquifer — and your children inherit a zero balance. <b>Sustainable development means living off the interest (renewable flows) while keeping the capital intact.</b>' },
                { type: 'h', text: 'Four functions of the environment' },
                { type: 'flow', steps: [
                  { title: 'Supplies resources', text: 'Renewable (sunlight, water) and non-renewable (coal, oil).' },
                  { title: 'Assimilates waste', text: 'Absorbs and recycles what we discard — up to a limit.' },
                  { title: 'Sustains life', text: 'Air, water, soil — the genetic and biodiversity base.' },
                  { title: 'Aesthetic services', text: 'Rivers, forests and landscapes that make life worth living.' },
                ]},
                { type: 'callout', variant: 'warn', label: 'When we cross the limit', text: 'Trouble begins when extraction outruns regeneration and waste outruns absorption — the <b>carrying capacity</b> is breached. Result: global warming, ozone depletion, dying rivers. Development that destroys its own base is a loan the next generation must repay.' },
              ]
            },
            {
              id: 'l2', title: 'A Sustainable Path for Bihar',
              blocks: [
                { type: 'list', items: [
                  '<b>Solar power</b> — Bihar’s abundant sunlight can run irrigation pumps instead of diesel, cutting both cost and fumes.',
                  '<b>Organic farming</b> — composting and crop rotation keep soil alive instead of burning it out for one harvest.',
                  '<b>Flood-wise development</b> — embankment maintenance, drainage and early-warning systems that work with the Kosi, not against it.',
                  '<b>Mini-hydel & biogas</b> — small, local, renewable energy for villages.',
                ]},
                { type: 'callout', variant: 'exam', label: 'Brundtland definition', text: '<b>Sustainable development</b> is development that meets the needs of the present generation <b>without compromising the ability of future generations</b> to meet their own needs (Our Common Future, 1987).' },
                { type: 'callout', variant: 'tip', label: 'In your village', text: 'Sustainability is not an abstract global debate. It is whether the hand-pump still finds water in May, whether the soil needs more urea every year, and whether the litchi orchard blooms on time. Watch these signs.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Carrying Capacity', def: 'The limit up to which the environment can supply resources and absorb waste.' },
            { term: 'Sustainable Development', def: 'Meeting present needs without compromising future generations (Brundtland, 1987).' },
            { term: 'Renewable Resources', def: 'Resources that regenerate — sunlight, wind, water — if not over-exploited.' },
            { term: 'Absorptive Capacity', def: 'The environment’s ability to assimilate waste and degradation.' },
          ],
          questions: [
            { q: 'The Brundtland Commission report defined:', options: ['GDP', 'Sustainable development', 'Human capital', 'Globalisation'], answer: 1, marks: 1, source: 'practice', explain: '“Our Common Future” (1987) gave the classic definition of sustainable development.' },
            { q: 'The environment’s limit to supply resources and absorb waste is its:', options: ['GDP', 'Carrying capacity', 'Interest rate', 'Surplus'], answer: 1, marks: 1, source: 'practice', explain: 'Crossing the carrying capacity causes environmental crisis.' },
            { q: 'Which is a sustainable energy strategy for Bihar’s farms?', options: ['More diesel pumps', 'Solar irrigation pumps', 'Burning crop residue', 'Deeper borewells everywhere'], answer: 1, marks: 1, source: 'practice', explain: 'Solar pumps use Bihar’s abundant sunlight, cutting diesel costs and emissions.' },
          ]
        },
        /* ---------------------------------------------------------- CH 8 */
        {
          id: 'c11-ied-ch8', number: 8, status: 'ready',
          title: 'Comparative Development Experiences of India & its Neighbours',
          summary: 'India, China and Pakistan compared.',
          lead: 'Three neighbours started their modern journeys together (1947–49) but chose different paths. This chapter compares their strategies and scorecards.',
          readingTime: '12 min',
          lessons: [
            {
              id: 'l1', title: 'The Long-Distance Race',
              blocks: [
                { type: 'p', text: 'Think of India, China and Pakistan as three runners who started a long-distance race at almost the same time — India (1947), Pakistan (1947), the People’s Republic of China (1949). Each chose a different path: India mixed planning with democracy; China took the command route, then opened up in <b>1978</b>; Pakistan alternated between military and civilian, reforming in <b>1988</b>.' },
                { type: 'table', headers: ['', 'India', 'China', 'Pakistan'], rows: [
                  ['Reforms began', '1991', '1978', '1988'],
                  ['Engine', 'Services & IT', 'Manufacturing exports', 'Early agriculture, remittances'],
                  ['Signature policy', 'Democratic planning', 'One-child norm (1979), SEZs', 'Green Revolution, nationalisation cycles'],
                ]},
                { type: 'figure', title: 'Income per person', caption: 'GNI per capita, PPP US$ thousand (approx., 2019). China pulled far ahead after 1978; India and Pakistan followed different curves.', svg: svgBar('Income per capita', [
                  { l: 'China', v: 16.8, c: '#dc2626' }, { l: 'India', v: 7.0, c: '#0d9488' }, { l: 'Pakistan', v: 4.9, c: '#16a34a' }
                ], 'k') },
              ]
            },
            {
              id: 'l2', title: 'Scorecard: Successes & Challenges',
              blocks: [
                { type: 'callout', variant: 'exam', label: 'Key data points', text: '<b>China</b>: near-10% growth for decades lifted <b>800 million+</b> people out of poverty. <b>India</b>: steady growth led by services, but roughly <b>21%</b> still lived below the official poverty line (2011–12). <b>Pakistan</b>: fast growth in the 1960s, then instability, high debt and dependence on aid.' },
                { type: 'flow', steps: [
                  { title: 'India', text: 'Success: high-tech services, democratic resilience. Challenge: creating enough factory jobs for its young millions.' },
                  { title: 'China', text: 'Success: global manufacturing dominance, massive poverty reduction. Challenge: pollution, ageing population, limited political freedom.' },
                  { title: 'Pakistan', text: 'Success: early agricultural gains. Challenge: political instability, debt, slow human development.' },
                ]},
                { type: 'callout', variant: 'tip', label: 'The lesson for us', text: 'Growth needs both markets <b>and</b> capable public institutions. China built human capital (health, literacy) <i>before</i> reforming; that is why its reforms exploded into growth. The same lesson applies within India — and to Bihar most of all.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Special Economic Zones (SEZs)', def: 'Areas with liberal trade and investment rules used by China to attract foreign manufacturing.' },
            { term: 'One-Child Policy', def: 'China’s 1979 population-control norm; slowed growth of population but caused ageing.' },
            { term: 'Great Leap Forward', def: 'China’s 1958 mass-industrialisation campaign that ended in famine — a warning about command excess.' },
            { term: 'Remittances', def: 'Money sent home by workers abroad — a key support of Pakistan’s economy.' },
          ],
          questions: [
            { q: 'China began its economic reforms in:', options: ['1947', '1978', '1988', '1991'], answer: 1, marks: 1, source: 'practice', explain: 'Deng Xiaoping’s reforms of 1978 opened Chinese agriculture, then industry, to market incentives.' },
            { q: 'Which country’s growth has been led mainly by services?', options: ['China', 'Pakistan', 'India', 'All three equally'], answer: 2, marks: 1, source: 'practice', explain: 'India’s post-reform growth is unusually service-led (IT, finance, telecom).' },
            { q: 'China introduced the one-child policy in:', options: ['1949', '1958', '1979', '1991'], answer: 2, marks: 1, source: 'practice', explain: 'The one-child norm dates to 1979 — it slowed population growth but created an ageing challenge.' },
          ]
        },
      ]
    },
    {
      id: 'c11-sfe',
      title: 'Statistics for Economics',
      note: 'Tools to collect, organise, present and analyse economic data.',
      color: '#2563eb',
      chapters: [
        {
          id: 'c11-sfe-ch1', number: 1, status: 'ready',
          title: 'Introduction to Statistics',
          summary: 'What statistics is, why economists use it, and its scope & limitations.',
          lead: 'Statistics gives economists tools to turn numbers into meaning. This chapter explains the meaning, importance and limitations of statistics in economics.',
          readingTime: '9 min',
          lessons: [
            {
              id: 'l1', title: 'Meaning & Importance of Statistics',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Statistics (two senses)', text: 'In the <b>plural</b> sense, statistics means numerical facts (data). In the <b>singular</b> sense, it means the methods of collecting, organising, presenting, analysing and interpreting data.' },
                { type: 'p', text: 'Economics studies how scarce resources are used to satisfy unlimited wants. Statistics helps by giving quantitative facts — on consumption, production, prices, income — so economic problems can be understood and compared.' },
                { type: 'flow', steps: [
                  { title: 'Collection', text: 'Gathering data from primary or secondary sources.' },
                  { title: 'Organisation', text: 'Arranging raw data into classes and tables.' },
                  { title: 'Presentation', text: 'Showing data through tables, diagrams and graphs.' },
                  { title: 'Analysis & Interpretation', text: 'Using averages, correlation and index numbers to draw conclusions.' },
                ]},
                { type: 'callout', variant: 'warn', label: 'Limitations', text: 'Statistics studies only <b>quantitative</b> aggregates, not individual items or qualities (like honesty). Statistical results are true only on average, and can be misused if data is faulty.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Data', def: 'Facts and figures collected for a definite purpose.' },
            { term: 'Statistics (singular)', def: 'The science of collecting, organising, presenting, analysing and interpreting data.' },
            { term: 'Quantitative Data', def: 'Information expressed in numbers that can be measured.' },
          ],
          questions: [
            { q: 'In the plural sense, statistics refers to:', options: ['methods', 'numerical facts (data)', 'graphs', 'theories'], answer: 1, marks: 1, source: 'practice', explain: 'Plural sense = the data (numerical facts) themselves; singular sense = the methods.' },
            { q: 'Statistics studies:', options: ['qualitative data only', 'individual items', 'quantitative aggregates', 'opinions only'], answer: 2, marks: 1, source: 'practice', explain: 'Statistics deals with aggregates of quantitative facts, not single items or qualities.' },
          ]
        },
        soon('c11-sfe-ch2', 2, 'Collection of Data', 'Primary vs secondary data, census vs sampling, and sources.'),
        soon('c11-sfe-ch3', 3, 'Organisation of Data', 'Classification, variables and frequency distribution.'),
        soon('c11-sfe-ch4', 4, 'Presentation of Data', 'Tables, bar diagrams, pie charts, histograms and ogives.'),
        soon('c11-sfe-ch5', 5, 'Measures of Central Tendency', 'Mean, median and mode.'),
        soon('c11-sfe-ch6', 6, 'Correlation', 'Karl Pearson and Spearman’s rank correlation.'),
        soon('c11-sfe-ch7', 7, 'Index Numbers', 'Price, quantity and value index numbers; CPI & WPI.'),
        soon('c11-sfe-ch8', 8, 'Use of Statistical Tools', 'Applying tools to a real project.'),
      ]
    }
  ]
};
