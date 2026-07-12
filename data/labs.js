// Technical Economics Labs — catalog.
// Grounded in facilities that real higher-ed economics departments run:
//  • Econometrics computing labs (UC Berkeley EML; UNM) — Stata, R, EViews, Gretl
//  • Experimental & Behavioral labs (UCSB EBEL, UC Berkeley XLab) — oTree, z-Tree
//  • Text-as-data / sentiment (Economic Policy Uncertainty; central-bank tone;
//    Loughran–McDonald finance dictionary; lexicon-based economic sentiment)
//  • Python / data-science for economics; spatial (GIS); computational/ABM.
//
// Each lab has: overview, what real universities do, the toolkit, guided steps,
// and an optional interactive in-browser `tool` (runs client-side, zero cost).

export const LABS = [
  {
    id: 'econometrics', icon: '📈', color: '#2563eb',
    title: 'Econometrics Lab',
    tagline: 'Run real regressions — estimate relationships in economic data.',
    level: 'Class 11–12 · UG',
    tool: 'regression',
    about: 'Econometrics turns economic theory into measurable relationships. In a university econometrics lab (e.g. UC Berkeley’s Econometrics Laboratory) students estimate models like demand curves, Okun’s law, or the Phillips curve from real data using Ordinary Least Squares (OLS).',
    university: 'UC Berkeley Econometrics Laboratory (EML); University of New Mexico Econ computing lab (Stata, R Studio, WinRATS).',
    toolkit: ['Stata', 'R / RStudio', 'EViews', 'Gretl (free)', 'Python + statsmodels'],
    steps: [
      { title: 'State a hypothesis', text: 'e.g. “Higher advertising raises sales.” Identify the dependent (Y) and independent (X) variable.' },
      { title: 'Enter / import data', text: 'Type paired observations of X and Y below, or import a CSV in Stata/R.' },
      { title: 'Fit OLS', text: 'Estimate Y = a + bX. The slope b measures the marginal effect of X on Y.' },
      { title: 'Read diagnostics', text: 'R² shows fit; check the sign & size of b against theory.' },
    ],
    resources: [
      { label: 'Open regression starter in Google Colab (free)', href: 'https://colab.research.google.com/#create=true' },
      { label: 'Download Gretl (free econometrics)', href: 'https://gretl.sourceforge.net/' },
    ],
  },
  {
    id: 'python-econ', icon: '🐍', color: '#0d9488',
    title: 'Python for Economics Lab',
    tagline: 'Analyse economic data with pandas, NumPy & statsmodels.',
    level: 'Class 12 · UG',
    tool: 'compound',
    about: 'Python has become a first-class tool for economic analysis — free, powerful, and industry-standard. This lab shows how to load data, compute growth rates, and model economic quantities. Everything runs free in Google Colab (no install).',
    university: 'Widely taught as “Python/Data Science for Economists” (QuantEcon by Sargent & Stachurski; NYU, ANU).',
    toolkit: ['Python 3', 'pandas', 'NumPy', 'matplotlib', 'statsmodels', 'Google Colab (free)'],
    steps: [
      { title: 'Open a free notebook', text: 'Use Google Colab — no installation, runs in the browser.' },
      { title: 'Load data', text: 'df = pd.read_csv("gdp.csv") — bring in GDP, prices, or your own series.' },
      { title: 'Compute indicators', text: 'Growth rate, per-capita values, real vs nominal, CAGR.' },
      { title: 'Visualise', text: 'df.plot() — turn numbers into charts for your project.' },
    ],
    code: `import pandas as pd\n\n# GDP (₹ lakh crore) by year\ndf = pd.DataFrame({\n    "year": [2019, 2020, 2021, 2022, 2023],\n    "gdp":  [201, 198, 234, 269, 296],\n})\n\n# Year-on-year growth (%)\ndf["growth_%"] = df["gdp"].pct_change() * 100\nprint(df)`,
    resources: [
      { label: 'Open Python econ notebook in Colab (free)', href: 'https://colab.research.google.com/#create=true' },
      { label: 'QuantEcon — Python for economists (free)', href: 'https://python.quantecon.org/' },
    ],
  },
  {
    id: 'data-viz', icon: '📊', color: '#7c3aed',
    title: 'Data Visualization & Market Simulator',
    tagline: 'Drag the sliders — watch supply, demand & equilibrium move.',
    level: 'Class 11–12',
    tool: 'market',
    about: 'A picture beats a table. This lab lets you manipulate a market model interactively: change demand and supply and instantly see the new equilibrium price and quantity — the core of microeconomics.',
    university: 'Interactive market/CGE visualisation is standard in UG micro teaching labs and in tools like the “Economics Network” simulations.',
    toolkit: ['Interactive SVG model', 'Desmos', 'Excel / Google Sheets', 'matplotlib / plotly'],
    steps: [
      { title: 'Set demand', text: 'Move the demand slider — a rise shifts the curve right (more wanted at each price).' },
      { title: 'Set supply', text: 'Move the supply slider — a rise shifts the curve right (more offered).' },
      { title: 'Find equilibrium', text: 'Where the curves cross = the market-clearing price & quantity.' },
      { title: 'Interpret', text: 'Observe how shocks (a good harvest, a tax) change P* and Q*.' },
    ],
    resources: [
      { label: 'Desmos graphing calculator (free)', href: 'https://www.desmos.com/calculator' },
    ],
  },
  {
    id: 'sentiment', icon: '🗣️', color: '#dc2626',
    title: 'Economic Sentiment Analysis Lab',
    tagline: 'Paste an RBI/Budget statement — measure its tone with text-as-data.',
    level: 'Class 12 · UG',
    tool: 'sentiment',
    about: '“Text-as-data” is a fast-growing field in economics. Researchers measure the tone of central-bank statements, budget speeches and news to build indicators like the Economic Policy Uncertainty index. This lab runs a lexicon-based sentiment analyzer (inspired by the Loughran–McDonald finance dictionary) right in your browser.',
    university: 'Text-as-data / NLP is used in economics research to gauge central-bank communication tone and economic uncertainty (Baker–Bloom–Davis EPU; Loughran–McDonald).',
    toolkit: ['Lexicon-based scoring (in-browser)', 'Python + NLTK / VADER', 'Loughran–McDonald dictionary', 'spaCy / transformers'],
    steps: [
      { title: 'Get text', text: 'Copy a paragraph from an RBI policy statement, Union Budget speech, or business news.' },
      { title: 'Score it', text: 'The analyzer counts positive vs negative economic words and gives a net tone.' },
      { title: 'Interpret', text: 'A positive score = optimistic/hawkish-growth tone; negative = cautious/pessimistic.' },
      { title: 'Go further', text: 'In Python, use VADER or a finance dictionary for large corpora of documents.' },
    ],
    resources: [
      { label: 'Loughran–McDonald finance dictionary', href: 'https://sraf.nd.edu/loughranmcdonald-master-dictionary/' },
      { label: 'Economic Policy Uncertainty Index', href: 'https://www.policyuncertainty.com/' },
    ],
  },
  {
    id: 'behavioral', icon: '🧠', color: '#b45309',
    title: 'Experimental & Behavioral Economics Lab',
    tagline: 'Play classic economic games and see how real people decide.',
    level: 'Class 12 · UG',
    tool: 'game',
    about: 'Behavioral economics tests how people actually behave versus the “rational” prediction. University experimental labs (UCSB’s EBEL, Berkeley’s XLab) run games like the Ultimatum Game, Public Goods and Prisoner’s Dilemma using software such as oTree and z-Tree.',
    university: 'UC Santa Barbara Experimental & Behavioral Economics Laboratory (EBEL); UC Berkeley Experimental Social Science Lab (XLab).',
    toolkit: ['oTree (free, Python)', 'z-Tree', 'Interactive game (in-browser)'],
    steps: [
      { title: 'Pick a game', text: 'Start with the Ultimatum Game — a proposer splits ₹100 with a responder.' },
      { title: 'Make an offer', text: 'Choose how much to offer. Rational theory says offer the minimum.' },
      { title: 'See the outcome', text: 'Real responders often reject unfair offers — evidence of fairness preferences.' },
      { title: 'Reflect', text: 'Behavioral evidence challenges the pure “homo economicus” model.' },
    ],
    resources: [
      { label: 'oTree — build economics experiments (free)', href: 'https://www.otree.org/' },
    ],
  },
  {
    id: 'timeseries', icon: '💹', color: '#16a34a',
    title: 'Financial & Time-Series Lab',
    tagline: 'Compute returns, moving averages & volatility on a price series.',
    level: 'Class 12 · UG',
    tool: 'timeseries',
    about: 'Financial economics studies prices over time. This lab computes simple returns, a moving average trend, and volatility (standard deviation of returns) — the building blocks of quantitative finance.',
    university: 'Standard in finance/quant labs and “Financial Econometrics” courses (ARIMA, GARCH volatility modelling).',
    toolkit: ['Python + pandas', 'R + quantmod', 'Excel', 'In-browser calculator'],
    steps: [
      { title: 'Enter prices', text: 'Paste a series of closing prices (e.g. a stock or index).' },
      { title: 'Compute returns', text: 'Return = (Pₜ − Pₜ₋₁) / Pₜ₋₁.' },
      { title: 'Trend & risk', text: 'Moving average shows the trend; volatility measures risk.' },
      { title: 'Model', text: 'Extend with ARIMA/GARCH in R or Python for forecasting.' },
    ],
    resources: [
      { label: 'Yahoo Finance — free price data', href: 'https://finance.yahoo.com/' },
    ],
  },
  {
    id: 'spatial', icon: '🗺️', color: '#0891b2',
    title: 'Spatial & GIS Economics Lab',
    tagline: 'Map economic data — regional inequality, trade & development.',
    level: 'UG',
    tool: null,
    about: 'Spatial economics studies where activity happens — regional development, urban economics and trade gravity. GIS labs map indicators like district-level poverty or night-lights as a proxy for GDP.',
    university: 'Spatial/urban economics labs use QGIS and GeoData; night-lights are a well-known GDP proxy in development economics.',
    toolkit: ['QGIS (free)', 'GeoDa (free)', 'Python + GeoPandas', 'kepler.gl'],
    steps: [
      { title: 'Get spatial data', text: 'District/state shapefiles + an indicator (income, literacy).' },
      { title: 'Join & map', text: 'Attach the indicator to the map in QGIS/GeoDa.' },
      { title: 'Find clusters', text: 'Spatial autocorrelation (Moran’s I) reveals rich/poor clusters.' },
      { title: 'Interpret', text: 'Explain regional inequality and convergence.' },
    ],
    resources: [
      { label: 'QGIS — free desktop GIS', href: 'https://qgis.org/' },
      { label: 'GeoDa — free spatial analysis', href: 'https://geodacenter.github.io/' },
    ],
  },
];

export const labById = id => LABS.find(l => l.id === id);
