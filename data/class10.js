// Class 10 — Economics: "Understanding Economic Development"
// Original study notes, infographics, flow diagrams and practice questions
// aligned to the NCERT chapter sequence. Not a reproduction of NCERT text.

const svgBar = (title, bars, cap) => `
<svg viewBox="0 0 340 200" role="img" aria-label="${title}">
  <line x1="40" y1="10" x2="40" y2="165" stroke="var(--line)" stroke-width="2"/>
  <line x1="40" y1="165" x2="330" y2="165" stroke="var(--line)" stroke-width="2"/>
  ${bars.map((b, i) => {
    const x = 60 + i * 70; const h = b.v * 1.4; const y = 165 - h;
    return `<rect x="${x}" y="${y}" width="44" height="${h}" rx="6" fill="${b.c}"/>
      <text x="${x + 22}" y="${y - 6}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${b.v}</text>
      <text x="${x + 22}" y="182" text-anchor="middle" font-size="11" fill="var(--ink-soft)">${b.l}</text>`;
  }).join('')}
</svg>`;

export default {
  id: 'class-10',
  grade: '10',
  title: 'Class 10 Economics',
  subtitle: 'Understanding Economic Development',
  color: '#2563eb',
  ncert: 'https://ncert.nic.in/textbook.php?jess1=0-5',
  subjects: [
    {
      id: 'c10-ued',
      title: 'Understanding Economic Development',
      note: 'The Economics unit of Class 10 Social Science (5 chapters).',
      color: '#2563eb',
      chapters: [
        /* ---------------------------------------------------------- CH 1 */
        {
          id: 'c10-ch1', number: 1, status: 'ready',
          title: 'Development',
          summary: 'What development means to different people, and how we measure it.',
          lead: 'Different people have different development goals — and often what is development for one may be destruction for another. This chapter builds the idea of measuring a country’s progress beyond just income.',
          readingTime: '12 min',
          lessons: [
            {
              id: 'l1', title: 'What Development Promises — Different Goals',
              blocks: [
                { type: 'p', text: 'People have different <b>developmental goals</b>. A landless labourer wants more days of work and better wages; a rich farmer wants higher prices for crops; a girl expects the same freedom her brother gets. So different persons can have different, even conflicting, notions of development.' },
                { type: 'callout', variant: 'def', label: 'Key idea', text: 'What may be development for one person may not be development for another. It may even be destructive for the other. Example: a dam gives electricity to cities but submerges the land of tribal families.' },
                { type: 'h', text: 'Income and more than income' },
                { type: 'p', text: 'People look at a mix of goals. Along with income, people also seek equal treatment, freedom, security, and respect. These are <b>non-material goals</b> — they matter as much as money.' },
                { type: 'list', items: [
                  'More <b>income</b> — one of the most important goals.',
                  'Equal treatment, freedom and security.',
                  'Respect of others and a pollution-free environment.',
                  'Job security and friends/family.'
                ]},
              ]
            },
            {
              id: 'l2', title: 'Income and Other Goals — Measuring Development',
              blocks: [
                { type: 'p', text: 'To compare countries, their <b>total income</b> is not a useful measure because countries have different populations. Comparing total income will not tell us what an average person earns.' },
                { type: 'formula', tex: 'Per Capita Income = National Income ÷ Population', note: 'Also called “average income” — the World Bank’s main criterion to classify countries.' },
                { type: 'callout', variant: 'exam', label: 'CBSE favourite', text: 'World Bank (2019): countries with per capita income of US$49,300 per year and above are “rich”; those with US$2,500 or less are “low-income”. India falls in the low-middle income group.' },
                { type: 'figure', title: 'Average income comparison', caption: 'Two countries can have the same average income but very unequal distribution.', svg: svgBar('Average income', [
                  { l: 'Country A', v: 100, c: 'var(--c10)' }, { l: 'Country B', v: 100, c: 'var(--accent)' }
                ]) },
                { type: 'h', text: 'Why average income hides inequality' },
                { type: 'table', headers: ['', 'Country A (₹)', 'Country B (₹)'], rows: [
                  ['Citizen I', '9,500', '5,000'], ['Citizen II', '10,500', '5,000'], ['Citizen III', '9,800', '15,000'],
                  ['Average', '10,000', '10,000']
                ]},
                { type: 'callout', variant: 'tip', label: 'Takeaway', text: 'Both countries have the same average income, but in Country A income is more equally shared. So averages hide disparities — we must look at distribution too.' },
              ]
            },
            {
              id: 'l3', title: 'Public Facilities & Sustainability',
              blocks: [
                { type: 'p', text: 'Money in your pocket cannot buy all the goods and services you need. Many things are best provided <b>collectively</b> — clean environment, unpolluted water, safety from diseases. These are <b>public facilities</b>.' },
                { type: 'callout', variant: 'def', label: 'Example: Kerala vs Punjab', text: 'Kerala has a lower per capita income than Punjab but a lower Infant Mortality Rate and higher literacy — because of better public facilities (health, education). So income alone is not enough.' },
                { type: 'h', text: 'The Human Development Index (HDI)' },
                { type: 'flow', steps: [
                  { title: 'Health', text: 'Measured by life expectancy at birth.' },
                  { title: 'Education', text: 'Measured by mean & expected years of schooling.' },
                  { title: 'Income', text: 'Measured by per capita income (in PPP, US$).' },
                  { title: 'HDI Rank', text: 'The UNDP combines the three into one index and ranks countries.' },
                ]},
                { type: 'callout', variant: 'warn', label: 'Sustainability', text: 'Development must be <b>sustainable</b> — the resource base must not be destroyed for future generations. Groundwater over-use and non-renewable resources (like crude oil) are warning signs.' },
              ]
            },
            {
              id: 'l4', title: 'A Bihar Lens: Two Lives, One State',
              blocks: [
                { type: 'p', text: 'Development is the realisation of human aspirations — a process that expands our freedoms and capabilities. But because our starting points differ, our goals differ. Compare two people of the same state:' },
                { type: 'table', headers: ['', 'Landless labourer (Araria)', 'Software professional (Patna)'], rows: [
                  ['Development means…', 'Guaranteed days of work and a wage that arrives on time', 'Reliable internet, global clients, faster city commutes'],
                  ['Biggest worry', 'A leaking school roof; work drying up after the floods', 'Power cuts and a two-hour commute'],
                  ['Shared goals', 'Security, respect and freedom — the non-material goals', 'Security, respect and freedom — the same goals'],
                ]},
                { type: 'h', text: 'Where does Bihar stand? (latest available data)' },
                { type: 'table', headers: ['Indicator', 'Bihar', 'India'], rows: [
                  ['Per capita income (2022–23, approx.)', '₹60,337', '≈ ₹1.5–1.7 lakh'],
                  ['Literacy rate', '61.8% (Census 2011)', '74% (2011) · ≈77.7% (NSO 2017)'],
                  ['Infant Mortality Rate (SRS 2020)', '≈27 per 1,000', '≈28 per 1,000'],
                ]},
                { type: 'figure', title: 'Literacy comparison', caption: 'Literacy rate (%): Bihar vs India (Census 2011). Closing this gap is the surest route to higher human development.', svg: svgBar('Literacy rate', [
                  { l: 'Bihar', v: 62, c: 'var(--c10)' }, { l: 'India', v: 74, c: 'var(--accent)' }
                ]) },
                { type: 'callout', variant: 'exam', label: 'Why does Bihar’s income lag?', text: 'Not because its people work less — but because <b>public facilities</b> (schools, hospitals, irrigation, roads) determine how productive work can be. Kerala’s story shows that strong public facilities lift human development even before income catches up. Notice that Bihar’s IMR is now close to the national average — proof that focused public health effort works.' },
                { type: 'callout', variant: 'tip', label: 'Beyond income', text: 'A regular wage matters, but so does the peace of mind that a job won’t vanish tomorrow, a workplace free of discrimination, and the freedom to make life choices. Development counts all of these.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Per Capita Income', def: 'Total income of a country divided by its total population.' },
            { term: 'Infant Mortality Rate (IMR)', def: 'Number of children who die before age 1 per 1,000 live births.' },
            { term: 'Literacy Rate', def: 'Proportion of the literate population in the 7-and-above age group.' },
            { term: 'Sustainable Development', def: 'Development that meets present needs without harming the ability of future generations to meet theirs.' },
          ],
          questions: [
            { q: 'The most common attribute used to compare development of countries is:', options: ['Total population', 'Per capita income', 'Total exports', 'Number of factories'], answer: 1, marks: 1, source: 'practice',
              explain: 'The World Bank uses average income (per capita income) as the main criterion to classify countries.' },
            { q: 'Which state is often cited as having good human development despite lower per capita income than Punjab?', options: ['Bihar', 'Kerala', 'Gujarat', 'Haryana'], answer: 1, marks: 1, source: 'practice',
              explain: 'Kerala has better public facilities (health, education), giving it a low IMR and high literacy despite lower income.' },
            { q: 'Life expectancy at birth in the HDI measures which dimension?', options: ['Income', 'Health', 'Education', 'Equality'], answer: 1, marks: 1, source: 'practice',
              explain: 'HDI uses life expectancy for health, years of schooling for education, and per capita income for standard of living.' },
            { q: '“Development of one may be destruction for another.” Explain with an example. (3 marks)', options: ['Understand the model answer →', 'View', 'Reveal', 'Show'], answer: 0, marks: 3, source: 'practice', type: 'subjective',
              explain: 'A dam built for hydroelectricity provides power and irrigation to cities and farmers (development), but it submerges forests and the homes/land of tribal communities (destruction). Thus the same project is development for some and destruction for others.' },
          ]
        },
        /* ---------------------------------------------------------- CH 2 */
        {
          id: 'c10-ch2', number: 2, status: 'ready',
          title: 'Sectors of the Indian Economy',
          summary: 'Primary, secondary & tertiary sectors; organised vs unorganised; public vs private.',
          lead: 'Economic activities are grouped into sectors on different bases. This chapter explains how output and employment are shared across these sectors in India.',
          readingTime: '14 min',
          lessons: [
            {
              id: 'l1', title: 'Three Sectors of the Economy',
              blocks: [
                { type: 'flow', steps: [
                  { title: 'Primary Sector', text: 'Produces goods by exploiting natural resources — agriculture, mining, fishing, forestry. Also called the agriculture & related sector.' },
                  { title: 'Secondary Sector', text: 'Transforms natural products into other forms through manufacturing — the industrial sector.' },
                  { title: 'Tertiary Sector', text: 'Provides services that support the other two — transport, banking, trade, education. Also called the service sector.' },
                ]},
                { type: 'callout', variant: 'def', label: 'GDP', text: 'The value of all <b>final goods and services</b> produced within a country during a year is its Gross Domestic Product (GDP). It shows how big the economy is.' },
                { type: 'figure', title: 'Rising share of tertiary sector', caption: 'Over time, the tertiary (service) sector has become the largest producer in India’s GDP.', svg: svgBar('Sector share in GDP', [
                  { l: 'Primary', v: 20, c: '#16a34a' }, { l: 'Secondary', v: 30, c: '#2563eb' }, { l: 'Tertiary', v: 54, c: '#0d9488' }
                ]) },
              ]
            },
            {
              id: 'l2', title: 'Rising Tertiary Sector & Underemployment',
              blocks: [
                { type: 'h', text: 'Why the service sector is growing' },
                { type: 'list', items: [
                  'Basic services like hospitals, schools, banks, and administration are needed by any country.',
                  'Development of agriculture and industry creates demand for transport, trade and storage.',
                  'Rising incomes create demand for tourism, shopping, private schools, IT.',
                ]},
                { type: 'callout', variant: 'warn', label: 'Disguised / hidden unemployment', text: 'In agriculture, more people work on a field than are actually needed. If some are removed, output stays the same. They appear employed but their contribution is nearly zero — this is <b>disguised unemployment</b> (underemployment).' },
                { type: 'callout', variant: 'tip', label: 'MGNREGA 2005', text: 'The Mahatma Gandhi National Rural Employment Guarantee Act promises 100 days of guaranteed wage employment a year to rural households, tackling underemployment. This is the “Right to Work”.' },
              ]
            },
            {
              id: 'l3', title: 'Organised vs Unorganised, Public vs Private',
              blocks: [
                { type: 'table', headers: ['Basis', 'Organised', 'Unorganised'], rows: [
                  ['Registration', 'Registered by govt, follows rules', 'Small, scattered, outside govt control'],
                  ['Job security', 'Regular, secure, paid leave', 'Low-paid, no security, no leave'],
                  ['Terms', 'Fixed hours, extra pay for overtime', 'No formal terms of employment'],
                ]},
                { type: 'p', text: 'Activities are also classified by <b>who owns assets</b>: the <b>public sector</b> (owned by government — Railways, post office) and the <b>private sector</b> (owned by individuals/companies — TISCO, Reliance).' },
                { type: 'callout', variant: 'exam', label: 'Why we need the public sector', text: 'Some activities need heavy spending that the private sector will not do (roads, dams), or must be provided at low cost (health, education). Government has a responsibility beyond profit.' },
              ]
            },
            {
              id: 'l4', title: 'A Bihar Lens: The Hands that Build',
              blocks: [
                { type: 'flow', steps: [
                  { title: 'Primary — the foundation', text: 'Harvesting <b>makhana</b> (fox nuts) in the wetlands of Darbhanga — Bihar grows most of India’s makhana, and “Mithila Makhana” earned a GI tag in 2022.' },
                  { title: 'Secondary — the transformer', text: 'A rice mill in Buxar turning paddy into polished rice; a dal mill; a litchi-juice unit in Muzaffarpur.' },
                  { title: 'Tertiary — the facilitator', text: 'A bank officer in a Patna branch, a truck driver on NH-19, a technician repairing phones in the local market.' },
                ]},
                { type: 'h', text: 'Interdependence: the journey of a grain' },
                { type: 'flow', steps: [
                  { title: 'Primary', text: 'A farmer in Rohtas grows wheat.' },
                  { title: 'Secondary', text: 'A biscuit factory buys the wheat and turns it into packaged biscuits.' },
                  { title: 'Tertiary', text: 'A transport truck carries the biscuits to a retail shop in Gaya — while a bank provides the credit that keeps the factory’s machines running.' },
                ]},
                { type: 'callout', variant: 'warn', label: 'A day in the unorganised sector', text: 'Santosh, a daily-wage construction worker in Patna, stands at the Labour Chowk by 6 AM. If it rains and the site floods — as it often does — there is no work that day. No paid leave, no health insurance, and no guarantee of a fair wage when too many labourers turn up for too few jobs. This is the unorganised sector’s harsh reality for crores of workers.' },
                { type: 'h', text: 'Creating employment in rural Bihar' },
                { type: 'list', items: [
                  '<b>Irrigation & cheap credit</b> — help farmers move beyond one uncertain monsoon crop.',
                  '<b>Cold storage</b> — Muzaffarpur’s Shahi Litchi (GI tag, 2018) rots within days; storage and processing keep its value in Bihar.',
                  '<b>Local agro-industry</b> — dal mills, honey collection centres and makhana processing units create jobs where people live, reducing distress migration.',
                ]},
                { type: 'callout', variant: 'tip', label: 'Value addition stays home', text: 'When makhana is roasted, packed and branded inside Bihar instead of being sold raw, the secondary and tertiary income stays with Bihari workers — that is how sectors grow together.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'GDP', def: 'Total value of final goods and services produced within a country in a year.' },
            { term: 'Disguised Unemployment', def: 'When more people are employed in a job than are actually required.' },
            { term: 'Organised Sector', def: 'Enterprises registered by the government where terms of employment are regular and secure.' },
            { term: 'MGNREGA 2005', def: 'Act guaranteeing 100 days of wage employment a year to rural households.' },
          ],
          questions: [
            { q: 'Which sector transforms natural products into finished goods?', options: ['Primary', 'Secondary', 'Tertiary', 'Public'], answer: 1, marks: 1, source: 'practice', explain: 'The secondary sector manufactures goods from raw materials — the industrial sector.' },
            { q: 'GDP is the value of all ______ produced in a country in a year.', options: ['intermediate goods', 'final goods and services', 'exported goods', 'agricultural goods'], answer: 1, marks: 1, source: 'practice', explain: 'GDP counts only final goods and services to avoid double counting.' },
            { q: 'MGNREGA guarantees how many days of employment per year?', options: ['50', '75', '100', '150'], answer: 2, marks: 1, source: 'practice', explain: 'MGNREGA 2005 guarantees 100 days of wage employment to rural households.' },
            { q: 'Underemployment is also called:', options: ['Seasonal unemployment', 'Disguised unemployment', 'Structural unemployment', 'Open unemployment'], answer: 1, marks: 1, source: 'practice', explain: 'Disguised/hidden unemployment: people appear employed but their marginal contribution is zero.' },
          ]
        },
        /* ---------------------------------------------------------- CH 3 */
        {
          id: 'c10-ch3', number: 3, status: 'ready',
          title: 'Money and Credit',
          summary: 'Money as a medium of exchange, modern currency, and the two sides of credit.',
          lead: 'Money removes the need for a double coincidence of wants. This chapter covers how banks and credit work, and why terms of credit matter to the poor.',
          readingTime: '13 min',
          lessons: [
            {
              id: 'l1', title: 'Money as a Medium of Exchange',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Double coincidence of wants', text: 'In barter, both parties must want what the other has at the same time. Money removes this problem by acting as a <b>medium of exchange</b>.' },
                { type: 'p', text: 'Modern currency (rupees) is accepted because it is <b>authorised by the government</b>. In India, the Reserve Bank of India (RBI) issues currency notes on behalf of the central government.' },
                { type: 'flow', steps: [
                  { title: 'Deposit', text: 'People deposit surplus money with banks, which pay interest.' },
                  { title: 'Bank keeps a fraction', text: 'Banks keep only a small part (about 15%) as cash reserve.' },
                  { title: 'Lend the rest', text: 'The major portion is used to give loans to borrowers.' },
                  { title: 'Earn the difference', text: 'The gap between interest charged on loans and paid on deposits is the bank’s income.' },
                ]},
              ]
            },
            {
              id: 'l2', title: 'Two Sides of Credit & Terms of Credit',
              blocks: [
                { type: 'p', text: 'Credit (loan) can push a borrower into a better situation or trap them in debt. The outcome depends on the risks and support available.' },
                { type: 'callout', variant: 'tip', label: 'Credit that helps', text: 'Festival season: a shoe manufacturer takes credit, produces more, sells at a profit, and repays the loan. Credit helped increase earnings.' },
                { type: 'callout', variant: 'warn', label: 'Debt-trap', text: 'A farmer takes a loan for crops; the crop fails due to pests. He cannot repay and must sell part of his land — worse off than before. This is a debt-trap.' },
                { type: 'callout', variant: 'exam', label: 'Terms of Credit', text: 'Every loan has: interest rate, collateral, documentation, and mode of repayment. <b>Collateral</b> is an asset the borrower owns (land, building) used as a guarantee until the loan is repaid.' },
              ]
            },
            {
              id: 'l3', title: 'Formal vs Informal Sources & SHGs',
              blocks: [
                { type: 'table', headers: ['', 'Formal sources', 'Informal sources'], rows: [
                  ['Examples', 'Banks & cooperatives', 'Moneylenders, traders, relatives'],
                  ['Supervision', 'Supervised by RBI', 'No one supervises'],
                  ['Interest', 'Lower interest rate', 'Very high interest rate'],
                ]},
                { type: 'callout', variant: 'tip', label: 'Self-Help Groups (SHGs)', text: 'SHGs of 15–20 members pool savings and give small loans to members. After a year or two, banks lend to the group. They provide credit to the poor <b>without collateral</b> and free them from moneylenders.' },
              ]
            },
            {
              id: 'l4', title: 'A Bihar Lens: Chandu’s Goat & JEEViKA’s Women',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Chandu and the stubborn goat', text: 'Chandu the shoemaker spent three days stitching fine leather mojris, but he needs a goat for his daughter’s wedding feast. Lakhan has a goat — a stubborn one that has already chewed through his fence — but Lakhan doesn’t want shoes; he wants a new plough! Chandu is left holding shoes, Lakhan is wrestling a goat, and no trade happens. This failed <b>double coincidence of wants</b> is exactly why money exists: it is the universal intermediate every seller accepts.' },
                { type: 'h', text: 'Terms of credit, close to home' },
                { type: 'list', items: [
                  '<b>Interest rate</b> — the “price” of borrowing.',
                  '<b>Collateral</b> — an asset pledged as guarantee: farmland in Madhubani, jewellery, livestock.',
                  '<b>Documentation</b> — proof of identity and income (why so many poor borrowers get pushed to moneylenders).',
                  '<b>Mode of repayment</b> — lump sum after harvest, or monthly instalments.',
                ]},
                { type: 'callout', variant: 'tip', label: 'JEEViKA — Bihar’s SHG revolution', text: 'Bihar’s rural livelihoods mission <b>JEEViKA</b> has organised over <b>one crore rural women</b> into lakhs of SHGs. Members pool small savings (₹25–100 a month) and lend to each other <b>without collateral</b> — bypassing the security that banks demand. The weekly meetings have become platforms where women discuss not just loans, but health, schooling and dowry.' },
                { type: 'callout', variant: 'warn', label: 'Why formal credit matters here', text: 'In flood-prone districts, a failed crop plus a moneylender charging 5% <b>per month</b> is a ready-made debt-trap. Cheap, supervised, formal credit is not a luxury for Bihar — it is the difference between recovery and ruin.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Double Coincidence of Wants', def: 'When both parties in a barter agree to sell and buy each other’s goods.' },
            { term: 'Collateral', def: 'An asset the borrower owns and uses as a guarantee to a lender until the loan is repaid.' },
            { term: 'Terms of Credit', def: 'Interest rate, collateral, documentation and mode of repayment that together make up a loan.' },
            { term: 'SHG', def: 'Self-Help Group — a small savings and credit group, usually of rural women.' },
          ],
          questions: [
            { q: 'Money solves the problem of:', options: ['Inflation', 'Double coincidence of wants', 'Unemployment', 'Poverty'], answer: 1, marks: 1, source: 'practice', explain: 'As a medium of exchange, money removes the need for a double coincidence of wants in barter.' },
            { q: 'Currency notes in India are issued by:', options: ['SBI', 'Ministry of Finance', 'RBI', 'NITI Aayog'], answer: 2, marks: 1, source: 'practice', explain: 'The Reserve Bank of India issues currency on behalf of the central government.' },
            { q: 'An asset used as a guarantee for a loan is called:', options: ['Interest', 'Collateral', 'Deposit', 'Premium'], answer: 1, marks: 1, source: 'practice', explain: 'Collateral is security against a loan, e.g., land, building or livestock.' },
            { q: 'SHGs help the poor mainly because they provide loans:', options: ['at zero interest', 'without collateral', 'only for farming', 'from the RBI directly'], answer: 1, marks: 1, source: 'practice', explain: 'SHGs give small loans without collateral, freeing members from moneylenders.' },
          ]
        },
        /* ---------------------------------------------------------- CH 4 */
        {
          id: 'c10-ch4', number: 4, status: 'ready',
          title: 'Globalisation and the Indian Economy',
          summary: 'MNCs, foreign trade, liberalisation, and the impact of globalisation.',
          lead: 'The world is becoming more interconnected. This chapter explains how MNCs and trade integrate markets, and how Indian producers and consumers are affected.',
          readingTime: '13 min',
          lessons: [
            {
              id: 'l1', title: 'MNCs and the Spread of Production',
              blocks: [
                { type: 'callout', variant: 'def', label: 'MNC', text: 'A Multinational Corporation owns or controls production in more than one country. It sets up production where it is cheap and close to markets.' },
                { type: 'flow', steps: [
                  { title: 'Choose a location', text: 'MNCs set up near markets, with cheap labour and other resources.' },
                  { title: 'Invest (FDI)', text: 'They invest money to buy assets like land, buildings and machines — Foreign Direct Investment.' },
                  { title: 'Partner or acquire', text: 'They join local companies, buy them up, or place orders with them.' },
                  { title: 'Spread production', text: 'Production gets spread across countries and interlinked.' },
                ]},
              ]
            },
            {
              id: 'l2', title: 'Foreign Trade, Liberalisation & WTO',
              blocks: [
                { type: 'p', text: 'Foreign trade connects markets of different countries and gives producers and buyers a wider choice. <b>Globalisation</b> is the rapid integration of countries through trade and investment.' },
                { type: 'callout', variant: 'def', label: 'Trade barrier & liberalisation', text: 'A tax on imports is a <b>trade barrier</b>. Removing such barriers is <b>liberalisation</b>. Since 1991 India removed many barriers to open its economy.' },
                { type: 'callout', variant: 'exam', label: 'WTO', text: 'The World Trade Organisation aims to liberalise international trade. Though it says all countries should remove barriers, in practice developed countries have kept some of their own — an unfair aspect of trade.' },
                { type: 'callout', variant: 'tip', label: 'Fair globalisation', text: 'Government can help by protecting workers’ interests, supporting small producers, and negotiating fairer WTO rules so benefits are shared.' },
              ]
            },
            {
              id: 'l3', title: 'A Bihar Lens: Globalisation on Station Road',
              blocks: [
                { type: 'p', text: 'One smartphone shows how an MNC spreads production: designed in California, chips made in Taiwan, assembled in one country and supported by call centres in India — each stage placed where costs are lowest and skills are available. That is <b>profit-seeking location choice</b>, and it is why production today is spread across the globe.' },
                { type: 'h', text: 'Impact on a Bihar shopkeeper' },
                { type: 'table', headers: ['Gains 🌱', 'Pressures ⚠️'], rows: [
                  ['Access to global brands and better technology on the shelf', 'Local manufacturers of simple electronics struggle to compete'],
                  ['Lower prices thanks to efficient global supply chains', 'Pressure on wages to match mass-produced imports'],
                  ['New services — couriers, mobile recharge, e-commerce pickup points', 'Small traders squeezed between online platforms and big retail'],
                ]},
                { type: 'callout', variant: 'exam', label: 'Market insight (link to economics ahead)', text: 'When an MNC enters a local market, <b>market supply increases</b> — the supply curve shifts right, so the price consumers pay tends to fall. Good for the Bihar consumer; hard on the local firm that cannot match the MNC’s scale. You will study this formally as supply, demand and equilibrium in Classes 11–12.' },
                { type: 'callout', variant: 'tip', label: 'What helps local producers compete', text: 'Reliable electricity, all-weather roads, cheap credit and skill training — the same public facilities from Chapter 1 — decide whether a Hajipur banana-chips unit can stand up to a multinational snack brand.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'MNC', def: 'A company that owns or controls production in more than one country.' },
            { term: 'FDI', def: 'Foreign Direct Investment — money invested by MNCs to buy assets and set up production abroad.' },
            { term: 'Liberalisation', def: 'Removing barriers or restrictions set by the government on trade.' },
            { term: 'WTO', def: 'World Trade Organisation — a body that aims to liberalise international trade.' },
          ],
          questions: [
            { q: 'An MNC is a company that:', options: ['exports only', 'owns production in more than one country', 'is owned by the government', 'trades in shares'], answer: 1, marks: 1, source: 'practice', explain: 'MNCs own or control production in multiple countries.' },
            { q: 'Removing government-set trade barriers is called:', options: ['Privatisation', 'Liberalisation', 'Globalisation', 'Nationalisation'], answer: 1, marks: 1, source: 'practice', explain: 'Liberalisation is the removal of restrictions/barriers on trade and investment.' },
            { q: 'Investment made by MNCs is called:', options: ['GDP', 'FDI', 'IMR', 'GST'], answer: 1, marks: 1, source: 'practice', explain: 'Foreign Direct Investment (FDI) is money invested to buy assets and set up production.' },
          ]
        },
        /* ---------------------------------------------------------- CH 5 */
        {
          id: 'c10-ch5', number: 5, status: 'ready',
          title: 'Consumer Rights',
          summary: 'Consumer exploitation, the rights of a consumer, and the COPRA framework.',
          lead: 'Consumers often stand in a weak position in the marketplace. This chapter explains consumer rights and the movement that protects them.',
          readingTime: '12 min',
          lessons: [
            {
              id: 'l1', title: 'Consumer Exploitation & the Movement',
              blocks: [
                { type: 'p', text: 'Individual consumers often find themselves in a weak position. Whenever there is a complaint about a good or service, the seller tries to shift responsibility to the buyer. The consumer movement arose to protect and promote consumer interests.' },
                { type: 'callout', variant: 'exam', label: 'COPRA 1986', text: 'The Consumer Protection Act (COPRA) 1986 set up a three-tier judicial machinery (District, State, National) to redress consumer disputes. India observes <b>24 December</b> as National Consumers’ Day.' },
              ]
            },
            {
              id: 'l2', title: 'Consumer Rights & Logos',
              blocks: [
                { type: 'flow', steps: [
                  { title: 'Right to Safety', text: 'Protection against goods/services hazardous to life and health.' },
                  { title: 'Right to be Informed', text: 'Details of price, quantity, ingredients, expiry, etc.' },
                  { title: 'Right to Choose', text: 'Access to a variety of goods at competitive prices.' },
                  { title: 'Right to Seek Redressal', text: 'Right to complain and get compensation against unfair practices.' },
                  { title: 'Right to Represent', text: 'To be heard in consumer courts and form consumer groups.' },
                ]},
                { type: 'callout', variant: 'tip', label: 'Standardisation logos', text: '<b>ISI</b> marks industrial goods, <b>Agmark</b> certifies agricultural products, and <b>Hallmark</b> certifies the purity of gold. They assure quality.' },
                { type: 'callout', variant: 'warn', label: 'Right to Information (RTI) 2005', text: 'The RTI Act ensures citizens can get information about the functioning of government departments, strengthening the consumer’s hand.' },
              ]
            },
            {
              id: 'l3', title: 'A Bihar Lens: Using Your Rights',
              blocks: [
                { type: 'p', text: 'Exploitation in the bazaar is rarely dramatic — it is an under-weighed sack of grain, adulterated mustard oil, a price above MRP charged “because of the season”. Your rights exist precisely for these everyday moments.' },
                { type: 'h', text: 'The six consumer rights' },
                { type: 'list', ordered: true, items: [
                  '<b>Right to Safety</b> — a new electric iron should not give you a shock.',
                  '<b>Right to be Informed</b> — MRP, weight, ingredients, expiry date must be visible.',
                  '<b>Right to Choose</b> — no shopkeeper can force one brand of tea on you.',
                  '<b>Right to be Heard</b> — your complaint must be acknowledged.',
                  '<b>Right to Seek Redressal</b> — a faulty product deserves a refund or replacement.',
                  '<b>Right to Consumer Education</b> — the right to become an informed buyer.',
                ]},
                { type: 'callout', variant: 'tip', label: 'RTI in action — Muzaffarpur', text: 'A student hasn’t received her state scholarship. She files an RTI: “What is the status of my application? Which officer is responsible for the delay?” The moment a named officer must answer in writing, files start moving. Information is power — use it.' },
                { type: 'flow', steps: [
                  { title: 'District Commission', text: 'Complaints up to ₹50 lakh — your first stop for local disputes.' },
                  { title: 'State Commission', text: 'Claims from ₹50 lakh to ₹2 crore, and appeals from the District level.' },
                  { title: 'National Commission', text: 'Claims above ₹2 crore — the country’s apex consumer court.' },
                ]},
                { type: 'callout', variant: 'exam', label: 'Update: CPA 2019', text: 'The <b>Consumer Protection Act 2019</b> has replaced COPRA 1986. It keeps the three-tier system (with the higher money limits above), adds rules for <b>e-commerce</b> sellers, allows complaints to be filed from where the <b>consumer</b> lives, and created a Central Consumer Protection Authority (CCPA). For history questions, COPRA 1986 remains the landmark that started it all.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'COPRA 1986', def: 'Consumer Protection Act that created a three-tier redressal system.' },
            { term: 'ISI / Agmark / Hallmark', def: 'Certification logos for industrial goods, agricultural products and gold purity.' },
            { term: 'National Consumers’ Day', def: '24 December, marking the enactment of COPRA in India.' },
            { term: 'RTI 2005', def: 'Right to Information Act enabling citizens to seek information from public authorities.' },
          ],
          questions: [
            { q: 'COPRA was enacted in the year:', options: ['1986', '1991', '2005', '1947'], answer: 0, marks: 1, source: 'practice', explain: 'The Consumer Protection Act (COPRA) was passed in 1986.' },
            { q: 'The logo that certifies purity of gold is:', options: ['ISI', 'Agmark', 'Hallmark', 'ISO'], answer: 2, marks: 1, source: 'practice', explain: 'Hallmark certifies the purity of gold jewellery.' },
            { q: 'National Consumers’ Day in India is observed on:', options: ['15 March', '24 December', '2 October', '26 January'], answer: 1, marks: 1, source: 'practice', explain: 'India observes 24 December as National Consumers’ Day (COPRA enactment).' },
            { q: 'The right that lets a consumer complain and claim compensation is the Right to:', options: ['Safety', 'Choose', 'Seek Redressal', 'Be Informed'], answer: 2, marks: 1, source: 'practice', explain: 'The Right to Seek Redressal covers complaints and compensation against unfair practices.' },
          ]
        },
      ]
    }
  ]
};
