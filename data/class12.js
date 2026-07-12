// Class 12 — "Introductory Microeconomics" + "Introductory Macroeconomics"
// Full chapter map with seeded starter chapters; others are structured stubs.

const soon = (id, number, title, summary) => ({ id, number, title, summary, status: 'soon', lessons: [], keyTerms: [], questions: [] });

export default {
  id: 'class-12',
  grade: '12',
  title: 'Class 12 Economics',
  subtitle: 'Introductory Microeconomics · Introductory Macroeconomics',
  color: '#7c3aed',
  ncert: 'https://ncert.nic.in/textbook.php?leec1=0-6',
  subjects: [
    {
      id: 'c12-micro',
      title: 'Introductory Microeconomics',
      note: 'Consumer behaviour, production, costs and market forms.',
      color: '#7c3aed',
      chapters: [
        {
          id: 'c12-mic-ch1', number: 1, status: 'ready',
          title: 'Introduction to Microeconomics',
          summary: 'The central problems of an economy and the PPC.',
          lead: 'Every economy faces scarcity. This chapter introduces microeconomics and how the central problems — what, how and for whom to produce — are decided.',
          readingTime: '11 min',
          lessons: [
            {
              id: 'l1', title: 'Economy, Scarcity & Central Problems',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Microeconomics vs Macroeconomics', text: '<b>Microeconomics</b> studies individual units — a consumer, a firm, a single market. <b>Macroeconomics</b> studies the economy as a whole — national income, employment, general price level.' },
                { type: 'p', text: 'Resources are <b>scarce</b> and have alternative uses, so every society must choose. These choices give rise to three central problems.' },
                { type: 'flow', steps: [
                  { title: 'What to produce', text: 'Which goods and in what quantities, given limited resources.' },
                  { title: 'How to produce', text: 'Which technique — labour-intensive or capital-intensive.' },
                  { title: 'For whom to produce', text: 'How the output is distributed among people.' },
                ]},
              ]
            },
            {
              id: 'l2', title: 'Production Possibility Curve & Opportunity Cost',
              blocks: [
                { type: 'callout', variant: 'def', label: 'PPC / PPF', text: 'The Production Possibility Curve shows the combinations of two goods an economy can produce with full and efficient use of its given resources and technology.' },
                { type: 'callout', variant: 'exam', label: 'Opportunity Cost (MRT)', text: 'The PPC slopes downward and is concave because of <b>increasing opportunity cost</b>. The Marginal Rate of Transformation (MRT) = units of one good sacrificed for one more unit of the other.' },
                { type: 'formula', tex: 'MRT = ΔUnits of Good 1 sacrificed ÷ ΔUnits of Good 2 gained', note: 'The slope of the PPC; it rises as we move along the curve.' },
                { type: 'callout', variant: 'tip', label: 'Point positions', text: 'A point <b>on</b> the PPC = efficient; <b>inside</b> = under-utilised/inefficient resources; <b>outside</b> = unattainable with current resources.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'Scarcity', def: 'Excess of human wants over the means to satisfy them.' },
            { term: 'Opportunity Cost', def: 'The value of the next best alternative forgone when a choice is made.' },
            { term: 'PPC', def: 'A curve showing all maximum combinations of two goods an economy can produce with given resources.' },
            { term: 'MRT', def: 'Marginal Rate of Transformation — units of one good sacrificed per extra unit of another.' },
          ],
          questions: [
            { q: 'Microeconomics deals with:', options: ['national income', 'individual units like a firm', 'general price level', 'total employment'], answer: 1, marks: 1, source: 'practice', explain: 'Microeconomics studies individual economic units — a consumer, firm or market.' },
            { q: 'A point inside the PPC indicates:', options: ['efficient use', 'under-utilisation of resources', 'unattainable output', 'maximum growth'], answer: 1, marks: 1, source: 'practice', explain: 'Points inside the PPC mean resources are unemployed or inefficiently used.' },
            { q: 'The PPC is concave to the origin because of:', options: ['constant opportunity cost', 'increasing opportunity cost', 'zero opportunity cost', 'decreasing returns'], answer: 1, marks: 1, source: 'practice', explain: 'Increasing marginal opportunity cost (rising MRT) makes the PPC concave.' },
          ]
        },
        soon('c12-mic-ch2', 2, 'Theory of Consumer Behaviour', 'Utility, budget line and consumer equilibrium; demand.'),
        soon('c12-mic-ch3', 3, 'Production and Costs', 'Production function, returns to a factor, and cost curves.'),
        soon('c12-mic-ch4', 4, 'The Theory of the Firm under Perfect Competition', 'Revenue, supply and firm equilibrium.'),
        soon('c12-mic-ch5', 5, 'Market Equilibrium', 'Equilibrium price, shifts and effects of price ceilings/floors.'),
        soon('c12-mic-ch6', 6, 'Non-Competitive Markets', 'Monopoly, monopolistic competition and oligopoly.'),
      ]
    },
    {
      id: 'c12-macro',
      title: 'Introductory Macroeconomics',
      note: 'National income, money, income determination and the budget.',
      color: '#2563eb',
      chapters: [
        soon('c12-mac-ch1', 1, 'Introduction to Macroeconomics', 'Emergence, and the four sectors of an economy.'),
        {
          id: 'c12-mac-ch2', number: 2, status: 'ready',
          title: 'National Income Accounting',
          summary: 'Circular flow, GDP/GNP/NNP, and the three methods of measurement.',
          lead: 'How do we measure the total output of a nation? This chapter builds the aggregates of national income and the three ways to compute them.',
          readingTime: '14 min',
          lessons: [
            {
              id: 'l1', title: 'Circular Flow & Key Aggregates',
              blocks: [
                { type: 'callout', variant: 'def', label: 'Circular flow of income', text: 'In a simple economy, households supply factors to firms and receive incomes; they spend on goods produced by firms. Income flows in a circle — production = income = expenditure.' },
                { type: 'table', headers: ['Aggregate', 'Meaning'], rows: [
                  ['GDP', 'Market value of all final goods & services produced within domestic territory in a year.'],
                  ['GNP', 'GDP + Net Factor Income from Abroad (NFIA).'],
                  ['NNP', 'GNP − Depreciation.'],
                  ['NNP at FC', 'National Income = NNP at MP − Net Indirect Taxes.'],
                ]},
                { type: 'formula', tex: 'National Income (NNP at FC) = GDP + NFIA − Depreciation − Net Indirect Taxes', note: 'Net Indirect Taxes = Indirect Taxes − Subsidies.' },
              ]
            },
            {
              id: 'l2', title: 'Three Methods of Measuring National Income',
              blocks: [
                { type: 'flow', steps: [
                  { title: 'Value Added (Product) Method', text: 'Sum of gross value added by all producing units, avoiding double counting by using only value added.' },
                  { title: 'Income Method', text: 'Sum of factor incomes — compensation of employees + operating surplus (rent, interest, profit) + mixed income.' },
                  { title: 'Expenditure Method', text: 'GDP = C + I + G + (X − M): consumption + investment + government spending + net exports.' },
                ]},
                { type: 'callout', variant: 'exam', label: 'All three are equal', text: 'By definition, the value of output = incomes generated = expenditure incurred. So all three methods give the same national income.' },
                { type: 'callout', variant: 'warn', label: 'Real vs Nominal GDP', text: '<b>Nominal GDP</b> is measured at current prices; <b>Real GDP</b> at constant (base-year) prices. Real GDP removes the effect of price changes and is the true measure of growth. GDP Deflator = (Nominal ÷ Real) × 100.' },
              ]
            }
          ],
          keyTerms: [
            { term: 'GDP', def: 'Market value of all final goods and services produced within a country in a year.' },
            { term: 'NFIA', def: 'Net Factor Income from Abroad = factor income earned abroad − paid to abroad.' },
            { term: 'Depreciation', def: 'Fall in the value of fixed capital due to normal wear and tear.' },
            { term: 'GDP Deflator', def: 'Ratio of nominal to real GDP × 100 — a measure of the price level.' },
          ],
          questions: [
            { q: 'GNP = GDP + ?', options: ['Depreciation', 'Net Factor Income from Abroad', 'Net Indirect Taxes', 'Subsidies'], answer: 1, marks: 1, source: 'practice', explain: 'GNP = GDP + NFIA (net factor income from abroad).' },
            { q: 'Which method uses C + I + G + (X − M)?', options: ['Income method', 'Value added method', 'Expenditure method', 'Output method'], answer: 2, marks: 1, source: 'practice', explain: 'The expenditure method sums consumption, investment, government spending and net exports.' },
            { q: 'Real GDP is measured at:', options: ['current prices', 'constant (base-year) prices', 'factor cost only', 'world prices'], answer: 1, marks: 1, source: 'practice', explain: 'Real GDP uses constant base-year prices, removing the effect of inflation.' },
            { q: 'GDP Deflator equals:', options: ['Real ÷ Nominal × 100', 'Nominal ÷ Real × 100', 'Nominal − Real', 'Real × Nominal'], answer: 1, marks: 1, source: 'practice', explain: 'GDP Deflator = (Nominal GDP ÷ Real GDP) × 100.' },
          ]
        },
        soon('c12-mac-ch3', 3, 'Money and Banking', 'Functions of money, money supply, and the RBI’s role.'),
        soon('c12-mac-ch4', 4, 'Determination of Income and Employment', 'Aggregate demand/supply, multiplier and equilibrium.'),
        soon('c12-mac-ch5', 5, 'Government Budget and the Economy', 'Budget, receipts, expenditure and deficits.'),
        soon('c12-mac-ch6', 6, 'Open Economy Macroeconomics', 'Balance of payments and foreign exchange rate.'),
      ]
    }
  ]
};
