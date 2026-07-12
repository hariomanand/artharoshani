// Class 11 — "Indian Economic Development" + "Statistics for Economics"
// Full chapter map. Seeded chapters carry complete notes; others are
// structured stubs (status:'soon') ready to be filled from the same schema.

const soon = (id, number, title, summary) => ({ id, number, title, summary, status: 'soon', lessons: [], keyTerms: [], questions: [] });

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
        soon('c11-ied-ch2', 2, 'Indian Economy 1950–1990', 'Planning, the goals of five year plans, agriculture and industry.'),
        soon('c11-ied-ch3', 3, 'Liberalisation, Privatisation & Globalisation: An Appraisal', 'The 1991 reforms (LPG) and their assessment.'),
        soon('c11-ied-ch4', 4, 'Human Capital Formation in India', 'Education, health and investment in people.'),
        soon('c11-ied-ch5', 5, 'Rural Development', 'Credit, marketing, diversification and organic farming.'),
        soon('c11-ied-ch6', 6, 'Employment: Growth, Informalisation & Related Issues', 'Workforce, unemployment and informal sector.'),
        soon('c11-ied-ch7', 7, 'Environment & Sustainable Development', 'Environment as a resource and the path to sustainability.'),
        soon('c11-ied-ch8', 8, 'Comparative Development Experiences of India & its Neighbours', 'India, China and Pakistan compared.'),
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
