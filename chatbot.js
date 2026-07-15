/* ================================================================
   InvestorOS — chatbot.js
   Investor-grade AI chatbot with rich knowledge base
   ================================================================ */

'use strict';

/* ─── KNOWLEDGE BASE ─────────────────────────────────────────── */
const KB = [
  /* ── ARR & REVENUE ── */
  {
    keys: ['arr','annual recurring revenue','revenue','mrr','monthly recurring revenue','top line','revenue growth'],
    answer: (q) => ({
      text: `Our <strong>Annual Recurring Revenue (ARR)</strong> stands at <strong>$4.82M</strong> as of Q2 2026, growing at <strong>18.4% month-over-month</strong> — an annualised pace of ~220%. MRR is <strong>$401K</strong>, up 15.3% month-over-month.<br><br>
Key drivers of ARR growth:<br>
• <strong>New logo acquisition</strong> — 47 new customers signed MTD<br>
• <strong>Expansion revenue</strong> — NDR of 114% means existing customers expand faster than churn<br>
• <strong>Enterprise mix shift</strong> — Enterprise now 48% of ARR vs 35% a year ago`,
      pills: [
        { label: 'ARR $4.82M', cls: 'green' },
        { label: 'MoM +18.4%', cls: 'green' },
        { label: 'MRR $401K', cls: '' },
        { label: 'NDR 114%', cls: 'green' },
      ]
    })
  },

  /* ── NDR / RETENTION ── */
  {
    keys: ['ndr','net dollar retention','retention','churn','gross retention','logo retention','expand','expansion'],
    answer: () => ({
      text: `<strong>Net Dollar Retention (NDR)</strong> is <strong>114%</strong> — up 3pp this quarter, and our best quarter ever.<br><br>
What this means for investors:<br>
• Every $1 of ARR from a year-ago cohort is worth <strong>$1.14</strong> today<br>
• Even with <strong>zero new customer acquisition</strong>, we still grow<br>
• Gross logo churn: <strong>1.8%</strong> monthly (well below 2% target)<br>
• Gross revenue retention: <strong>~96%</strong><br><br>
NDR >110% is a gold-standard benchmark for SaaS. It significantly de-risks our growth story for investors.`,
      pills: [
        { label: 'NDR 114%', cls: 'green' },
        { label: 'Churn 1.8%', cls: 'green' },
        { label: 'Gross Retention 96%', cls: 'green' },
      ]
    })
  },

  /* ── UNIT ECONOMICS ── */
  {
    keys: ['unit economics','ltv','cac','payback','ltv cac','lifetime value','customer acquisition cost','magic number','saas metrics'],
    answer: () => ({
      text: `Our unit economics are <strong>best-in-class</strong> for a SaaS company at our stage:<br><br>
• <strong>LTV</strong>: $19,968 — based on avg revenue per account × gross margin ÷ churn<br>
• <strong>CAC</strong>: $3,840 — blended, including all S&M spend<br>
• <strong>LTV:CAC</strong>: <strong>5.2x</strong> (industry benchmark is 3x; we're 73% above)<br>
• <strong>CAC Payback</strong>: 11.5 months (target &lt;18 months ✓)<br>
• <strong>Gross Margin</strong>: 72% (+2pp QoQ)<br>
• <strong>Magic Number</strong>: 1.2x (strong sales efficiency)<br><br>
The improving CAC (-8% QoQ) combined with rising LTV is a compounding efficiency flywheel.`,
      pills: [
        { label: 'LTV $19,968', cls: 'green' },
        { label: 'CAC $3,840', cls: 'green' },
        { label: 'LTV:CAC 5.2x', cls: 'green' },
        { label: 'Payback 11.5mo', cls: 'green' },
      ]
    })
  },

  /* ── SERIES B FUNDRAISE ── */
  {
    keys: ['series b','fundraise','fundraising','raise','capital','investment','round','term sheet','closing','investors','lead investor'],
    answer: () => ({
      text: `We are actively raising a <strong>Series B round of $25M</strong>, targeting close by <strong>September 2026</strong>.<br><br>
<strong>Current raise status:</strong><br>
• <strong>$12M</strong> — Soft committed (48%)<br>
• <strong>$8M</strong> — In active discussion (32%)<br>
• <strong>$5M</strong> — Remaining gap (20%)<br><br>
<strong>Use of proceeds:</strong><br>
• 45% → Sales & Marketing (12 new AE hires)<br>
• 25% → Product & Engineering<br>
• 20% → Customer Success & Ops<br>
• 10% → G&A and working capital<br><br>
This round will extend runway to <strong>24+ months</strong> and position us for a Series C or profitability path by 2028.`,
      pills: [
        { label: 'Target $25M', cls: '' },
        { label: 'Committed $12M', cls: 'green' },
        { label: 'In Discussion $8M', cls: 'yellow' },
        { label: 'Close Sept 2026', cls: '' },
      ]
    })
  },

  /* ── VALUATION ── */
  {
    keys: ['valuation','enterprise value','ev','multiple','arr multiple','post money','pre money','worth','price'],
    answer: () => ({
      text: `Based on our financial model, the <strong>estimated enterprise value</strong> is <strong>~$57–69M</strong> (pre-money).<br><br>
<strong>Valuation methodology:</strong><br>
• <strong>Revenue Multiple</strong>: 12x forward ARR (~$5.8M projected)<br>
• <strong>Quality adjustment</strong>: +premium for NDR 114%, Rule of 40 = 58, and 72% gross margin<br>
• <strong>Comparable transactions</strong>: Series B SaaS at 120%+ growth trades at 10–15x ARR<br><br>
<strong>Comparable benchmarks:</strong><br>
• Median Series B SaaS multiple (2025–26): 8–12x ARR<br>
• Premium tier (NDR >110%, R40 >40): 12–18x ARR<br>
• Our positioning: <strong>top quartile</strong> across all metrics`,
      pills: [
        { label: 'EV ~$58M', cls: 'green' },
        { label: '12x ARR Multiple', cls: '' },
        { label: 'Rule of 40: 58', cls: 'green' },
      ]
    })
  },

  /* ── RULE OF 40 ── */
  {
    keys: ['rule of 40','r40','rule of forty','efficiency','profitable','profitability'],
    answer: () => ({
      text: `Our <strong>Rule of 40 score is 58</strong>, significantly exceeding the benchmark of 40.<br><br>
<strong>Calculation:</strong><br>
• ARR Growth Rate (YoY): ~220%<br>
• FCF Margin: -162% (investing aggressively in growth)<br>
• Rule of 40 = 220% + (-162%) = <strong>~58</strong> on a trailing basis<br><br>
A Rule of 40 score above 40 indicates a company is <strong>balancing growth and profitability efficiently</strong>. At 58, we are in the top decile of SaaS companies at our ARR stage.<br><br>
As we scale, gross margin expansion (currently 72%, targeting 78% by FY27) will drive the score higher without sacrificing growth.`,
      pills: [
        { label: 'Rule of 40: 58', cls: 'green' },
        { label: 'Top Decile SaaS', cls: 'green' },
        { label: 'Gross Margin 72%', cls: '' },
      ]
    })
  },

  /* ── GO-TO-MARKET ── */
  {
    keys: ['gtm','go to market','go-to-market','sales','marketing','pipeline','distribution','channel','inbound','outbound','plg','product led'],
    answer: () => ({
      text: `Our GTM motion is a <strong>multi-channel, product-led hybrid</strong> built for efficient enterprise acquisition:<br><br>
• <strong>Inbound (42%)</strong> — Content-led SEO, thought leadership, and PLG free tier driving organic demand<br>
• <strong>Outbound (31%)</strong> — Enterprise SDR team with Account-Based Marketing targeting Fortune 500<br>
• <strong>Partner Channel (18%)</strong> — System integrators, ISVs, and consulting firm referrals<br>
• <strong>PLG (9%)</strong> — Free-to-paid conversion, avg 18% conversion to paid within 90 days<br><br>
<strong>Pipeline metrics:</strong><br>
• Total pipeline: $6.2M (+28% QoQ)<br>
• Weighted pipeline: $2.8M (3.2x coverage)<br>
• Win rate: 34% (+4pp vs last quarter)<br>
• Avg deal size: $48K (enterprise mix increasing)`,
      pills: [
        { label: 'Pipeline $6.2M', cls: 'green' },
        { label: 'Win Rate 34%', cls: 'green' },
        { label: 'Avg Deal $48K', cls: '' },
        { label: '3.2x Coverage', cls: 'green' },
      ]
    })
  },

  /* ── BURN / RUNWAY ── */
  {
    keys: ['burn','runway','cash','months','how long','expenses','opex','spend','cash flow','fcf'],
    answer: () => ({
      text: `<strong>Cash & Runway details:</strong><br><br>
• <strong>Current cash position</strong>: ~$8.4M<br>
• <strong>Monthly net burn</strong>: ~$620K (declining as revenue scales)<br>
• <strong>Current runway</strong>: ~13.5 months at current burn<br>
• <strong>Post Series B runway</strong>: 24+ months ($25M raise + reduced burn through efficiency)<br><br>
<strong>Burn trajectory:</strong><br>
• Burn is primarily driven by S&M (45%) and R&D (30%)<br>
• Gross margin at 72% means each new dollar of ARR contributes $0.72 toward covering costs<br>
• We project <strong>FCF breakeven by Q3 2028</strong> without additional capital (base case)<br><br>
The Series B fully funds our path to operational scale without requiring another raise.`,
      pills: [
        { label: 'Cash $8.4M', cls: '' },
        { label: 'Burn $620K/mo', cls: 'yellow' },
        { label: 'Runway 13.5mo', cls: 'yellow' },
        { label: 'Post-B: 24mo', cls: 'green' },
      ]
    })
  },

  /* ── CUSTOMERS ── */
  {
    keys: ['customer','customers','clients','accounts','logos','key accounts','top customer','enterprise','stripe','shopify','references'],
    answer: () => ({
      text: `We serve <strong>284 active accounts</strong> across enterprise, mid-market, and SMB segments.<br><br>
<strong>Top accounts by ARR:</strong><br>
• 🏢 Stripe Inc. — $142K ARR | Health: Good | NPS: 72<br>
• 🛍️ Shopify — $118K ARR | Health: Good | NPS: 68<br>
• 📝 Notion Labs — $84K ARR | Health: Good | NPS: 81<br>
• 🎨 Figma — $76K ARR | Health: Medium | NPS: 54<br>
• ⚡ Linear — $61K ARR | Health: Good | NPS: 78<br><br>
<strong>Segment mix:</strong><br>
• Enterprise: 48% of ARR (5 accounts = $550K+)<br>
• Mid-Market: 37% of ARR<br>
• SMB: 15% of ARR<br><br>
No single customer exceeds <strong>3% of total ARR</strong> — healthy diversification.`,
      pills: [
        { label: '284 Accounts', cls: 'green' },
        { label: 'Enterprise 48% ARR', cls: 'green' },
        { label: 'No Concentration Risk', cls: 'green' },
      ]
    })
  },

  /* ── COMPETITION ── */
  {
    keys: ['competition','competitor','competitive','moat','differentiation','why you','versus','vs','market','landscape','alternative'],
    answer: () => ({
      text: `<strong>Competitive positioning & moat:</strong><br><br>
We compete in the <strong>B2B SaaS / AI-enabled business intelligence</strong> category. Key differentiators:<br><br>
• <strong>Data integration depth</strong> — native connectors to 80+ CRM, finance, and delivery systems (vs avg 20 for competitors)<br>
• <strong>AI-native reporting</strong> — automated narrative generation and anomaly detection in investor reports<br>
• <strong>Time-to-value</strong> — customers go live in avg <strong>4 days</strong> vs 3–6 weeks for incumbents<br>
• <strong>Pricing</strong> — consumption-based model aligns with customer value; 40% cheaper than enterprise alternatives<br><br>
<strong>Competitive landscape:</strong><br>
• Legacy BI tools (Tableau, Looker): complex, slow to deploy, not investor-specific<br>
• Point solutions: narrow scope, poor data integration<br>
• <strong>Our advantage</strong>: full-stack investor relations + growth ops platform with AI layer`,
      pills: [
        { label: '80+ Integrations', cls: 'green' },
        { label: '4-Day Time to Value', cls: 'green' },
        { label: 'AI-Native', cls: '' },
      ]
    })
  },

  /* ── TEAM ── */
  {
    keys: ['team','founder','ceo','cto','leadership','management','org','headcount','employees','hire','hiring'],
    answer: () => ({
      text: `<strong>Team overview:</strong><br><br>
• <strong>Total headcount</strong>: 38 FTEs (planning to reach 60 post Series B)<br>
• Distributed across Engineering (45%), GTM (35%), G&A (20%)<br><br>
<strong>Leadership:</strong><br>
• <strong>CEO</strong> — ex-McKinsey, 2x founder, previously scaled a SaaS co to $30M ARR<br>
• <strong>CTO</strong> — ex-Google, 15 years ML & data infrastructure<br>
• <strong>CFO</strong> — ex-Goldman Sachs, led 3 Series B/C raises<br>
• <strong>VP Sales</strong> — ex-Salesforce, built enterprise GTM from $0–$25M ARR<br><br>
<strong>Key Series B hires planned:</strong><br>
• 12 Account Executives (enterprise-focused)<br>
• 4 Customer Success Managers<br>
• 3 ML Engineers<br><br>
Team has <strong>deep domain expertise</strong> across finance, AI, and go-to-market.`,
      pills: [
        { label: '38 FTEs', cls: '' },
        { label: 'Scaling to 60', cls: '' },
        { label: 'Ex-McKinsey / Google / GS', cls: 'green' },
      ]
    })
  },

  /* ── MARKET SIZE ── */
  {
    keys: ['market','tam','sam','som','market size','opportunity','addressable','total addressable market'],
    answer: () => ({
      text: `<strong>Market opportunity:</strong><br><br>
• <strong>TAM</strong> (Total Addressable Market): <strong>$42B</strong> — global investor relations, BI, and growth analytics software<br>
• <strong>SAM</strong> (Serviceable Addressable Market): <strong>$8.4B</strong> — SaaS companies with $1M–$500M ARR needing automated investor reporting<br>
• <strong>SOM</strong> (Serviceable Obtainable Market): <strong>$840M</strong> — 10% SAM capture over 5 years (conservative)<br><br>
<strong>Market tailwinds:</strong><br>
• 23,000+ VC-backed SaaS companies globally — all need investor reporting<br>
• AI adoption in finance teams growing 38% YoY<br>
• Regulatory push for standardised reporting increasing demand<br>
• Shift from quarterly to monthly board reporting cadences<br><br>
We are a <strong>category creator</strong> — no direct competitor addresses the full investor-ops workflow.`,
      pills: [
        { label: 'TAM $42B', cls: 'green' },
        { label: 'SAM $8.4B', cls: '' },
        { label: 'SOM $840M', cls: '' },
      ]
    })
  },

  /* ── PRODUCT ── */
  {
    keys: ['product','features','platform','dashboard','technology','tech stack','roadmap','feature','what do you do','how does it work'],
    answer: () => ({
      text: `<strong>Product overview:</strong><br><br>
InvestorOS is a <strong>full-stack investor relations and growth operations platform</strong>. Core modules:<br><br>
• 📊 <strong>Growth Metrics Engine</strong> — Real-time ARR, NDR, cohort analysis, pipeline velocity<br>
• 📝 <strong>Auto-Report Generator</strong> — AI-written investor updates, board memos, and quarterly letters<br>
• 🎞️ <strong>Board Deck Builder</strong> — Slide-by-slide auto-generated presentations from live data<br>
• 💰 <strong>Fundraising Suite</strong> — Valuation modeller, data room tracker, raise CRM<br>
• 📈 <strong>Scenario Planner</strong> — 5-year financial models with bull/base/bear scenarios<br>
• 🤝 <strong>CRM Analytics</strong> — Pipeline health, deal velocity, customer intelligence<br><br>
<strong>Technology stack:</strong> React, Node.js, PostgreSQL, Python ML backend, AWS infrastructure. <strong>SOC 2 Type II certified</strong>.`,
      pills: [
        { label: 'SOC 2 Type II', cls: 'green' },
        { label: '6 Core Modules', cls: '' },
        { label: 'AI-Powered', cls: 'green' },
      ]
    })
  },

  /* ── GROSS MARGIN ── */
  {
    keys: ['gross margin','margin','cogs','cost of revenue','70','72','75','infrastructure cost'],
    answer: () => ({
      text: `<strong>Gross margin is 72%</strong>, up 2pp quarter-over-quarter.<br><br>
<strong>COGS breakdown:</strong><br>
• Cloud infrastructure (AWS): 11%<br>
• Customer Success & onboarding: 9%<br>
• Third-party APIs & data: 5%<br>
• Support & professional services: 3%<br><br>
<strong>Margin expansion roadmap:</strong><br>
• Target 75% by end of FY2026 — driven by infrastructure optimisation<br>
• Target 80% by FY2028 — through AI automation of CS workflows<br>
• Comparable SaaS at scale: 75–85% gross margin<br><br>
Each 1pp of gross margin improvement at $10M ARR = ~$100K additional contribution.`,
      pills: [
        { label: 'GM 72%', cls: 'green' },
        { label: 'Target 75% FY26', cls: '' },
        { label: 'Target 80% FY28', cls: '' },
      ]
    })
  },

  /* ── DATA ROOM ── */
  {
    keys: ['data room','due diligence','diligence','documents','legal','cap table','financial model','vdr'],
    answer: () => ({
      text: `Our <strong>data room is 84% complete</strong> and will be fully open to credentialed investors by <strong>July 1, 2026</strong>.<br><br>
<strong>Data room status:</strong><br>
✅ Financials (4/4) — 3-statement model, ARR bridge, cohort analysis, unit economics<br>
✅ Product & Tech (5/5) — Architecture docs, security audit, roadmap<br>
✅ Market & Competition (3/3) — TAM analysis, competitive matrix<br>
⏳ Legal & Corporate (4/6) — Cap table ready; IP assignments in review<br>
⏳ Team & Org Chart (2/3) — Employment agreements pending<br>
⚠️ Customer References (1/4) — Reaching out to top 3 accounts<br><br>
Access can be granted immediately upon execution of NDA. Contact growth-office@investoros.io to request access.`,
      pills: [
        { label: 'Data Room 84%', cls: 'yellow' },
        { label: 'Full Open July 1', cls: '' },
        { label: 'NDA Required', cls: '' },
      ]
    })
  },

  /* ── PIPELINE ── */
  {
    keys: ['pipeline','deals','opportunity','opportunities','sales cycle','win rate','close','deal','weighted'],
    answer: () => ({
      text: `<strong>Sales pipeline overview:</strong><br><br>
• <strong>Total pipeline</strong>: $6.2M TCV (+28% QoQ)<br>
• <strong>Weighted pipeline</strong>: $2.8M (applying stage probabilities)<br>
• <strong>Pipeline coverage</strong>: 3.2x — strong buffer vs $870K Q3 quota<br>
• <strong>Win rate</strong>: 34% (+4pp vs last quarter)<br>
• <strong>Avg sales cycle</strong>: 38 days (↓6 days vs Q1)<br>
• <strong>Avg deal size</strong>: $48K (+18% YoY as enterprise mix grows)<br><br>
<strong>Stage breakdown:</strong><br>
• Prospecting: 24 deals ($1.8M)<br>
• Discovery/Demo: 32 deals ($2.5M)<br>
• Proposal/Negotiation: 15 deals ($1.45M)<br>
• Near-close: 5 deals ($380K)`,
      pills: [
        { label: 'Pipeline $6.2M', cls: 'green' },
        { label: '3.2x Coverage', cls: 'green' },
        { label: 'Win Rate 34%', cls: 'green' },
      ]
    })
  },

  /* ── INVESTOR RELATIONS ── */
  {
    keys: ['board','board meeting','investor update','reporting','communication','update','reporting cadence','equity','shareholder'],
    answer: () => ({
      text: `<strong>Investor relations & board reporting cadence:</strong><br><br>
• <strong>Monthly Investor Update</strong> — auto-generated by InvestorOS AI, sent by the 5th of each month<br>
• <strong>Quarterly Board Meeting</strong> — full board deck + detailed financials<br>
• <strong>Milestone Announcements</strong> — real-time via investor portal<br><br>
<strong>Current investor roster:</strong><br>
• Sequoia Capital — Series A Lead<br>
• Andreessen Horowitz — Series A Follow<br>
• Accel Partners — Series A Follow<br>
• Lightspeed — Seed Investor<br>
• Index Ventures — Series A Follow<br><br>
<strong>Series B prospects in active discussion:</strong><br>
Tiger Global, Bessemer Ventures, General Catalyst, Coatue Management`,
      pills: [
        { label: 'Monthly Updates', cls: 'green' },
        { label: 'Quarterly Board', cls: '' },
        { label: '5 Active Investors', cls: '' },
      ]
    })
  },

  /* ── PROJECTIONS / FORECAST ── */
  {
    keys: ['forecast','projection','projections','2027','2028','2029','2030','growth plan','plan','target','goal','future'],
    answer: () => ({
      text: `<strong>5-Year Revenue Projections (Base Case):</strong><br><br>
• <strong>2026</strong>: $6.4M ARR (+33% from current run rate)<br>
• <strong>2027</strong>: $14.1M ARR (+120% YoY)<br>
• <strong>2028</strong>: $25.4M ARR (+80% YoY)<br>
• <strong>2029</strong>: $40.6M ARR (+60% YoY)<br>
• <strong>2030</strong>: $60.9M ARR (+50% YoY)<br><br>
<strong>Key assumptions (base case):</strong><br>
• NDR remains above 110%<br>
• Gross margin expands to 78% by 2027<br>
• Net new ARR per AE: $800K annually at scale<br>
• S&M efficiency improving as brand compounds<br><br>
<strong>Bull case</strong> (stronger enterprise penetration): $75M ARR by 2030<br>
<strong>Bear case</strong> (macro headwinds): $38M ARR by 2030`,
      pills: [
        { label: '$14M ARR 2027', cls: 'green' },
        { label: '$60M ARR 2030', cls: '' },
        { label: 'Base Case', cls: '' },
      ]
    })
  },

  /* ── SECURITY / COMPLIANCE ── */
  {
    keys: ['security','soc2','soc 2','gdpr','compliance','data privacy','privacy','iso','secure','encryption'],
    answer: () => ({
      text: `<strong>Security & Compliance posture:</strong><br><br>
• ✅ <strong>SOC 2 Type II certified</strong> (as of January 2026)<br>
• ✅ <strong>GDPR compliant</strong> — EU data residency options available<br>
• ✅ <strong>ISO 27001</strong> — in audit process, expected certification Q4 2026<br>
• ✅ <strong>Encryption</strong>: AES-256 at rest, TLS 1.3 in transit<br>
• ✅ <strong>SSO & MFA</strong> supported (Okta, Azure AD)<br>
• ✅ <strong>Annual penetration testing</strong> by third-party (most recent: April 2026 — zero critical findings)<br><br>
All customer data is logically isolated. We operate on <strong>AWS us-east-1 and eu-west-1</strong> with 99.97% uptime SLA.`,
      pills: [
        { label: 'SOC 2 Type II', cls: 'green' },
        { label: 'GDPR Compliant', cls: 'green' },
        { label: '99.97% Uptime', cls: 'green' },
      ]
    })
  },

  /* ── SCENARIO PLANNING ── */
  {
    keys: ['scenario','bull','bear','base case','sensitivity','dcf','discounted cash flow','model','financial model'],
    answer: () => ({
      text: `We model three scenarios to stress-test our projections:<br><br>
<strong>🐂 Bull Case</strong> (20% probability):<br>
• Growth Rate: 180% YoY | Margin: 78% | NDR: 120%<br>
• ARR 2028: $42M | EV at exit: ~$500M<br><br>
<strong>📊 Base Case</strong> (60% probability):<br>
• Growth Rate: 120% YoY | Margin: 72% | NDR: 114%<br>
• ARR 2028: $25M | EV at exit: ~$280M<br><br>
<strong>🐻 Bear Case</strong> (20% probability):<br>
• Growth Rate: 70% YoY | Margin: 62% | NDR: 104%<br>
• ARR 2028: $14M | EV at exit: ~$140M<br><br>
Our <strong>DCF sensitivity analysis</strong> shows EV ranges from $48M to $120M+ depending on terminal growth rate and margin assumptions. Even the bear case supports a >3x return on Series B investment.`,
      pills: [
        { label: 'Base: $25M ARR 2028', cls: 'green' },
        { label: 'Bull: $42M ARR 2028', cls: 'green' },
        { label: 'Bear: $14M ARR 2028', cls: 'yellow' },
      ]
    })
  },

  /* ── CAP TABLE ── */
  {
    keys: ['cap table','captable','ownership','equity','dilution','shares','vesting','esop','option pool','founders'],
    answer: () => ({
      text: `<strong>Cap Table Summary (Pre Series B):</strong><br><br>
• <strong>Founders</strong>: 42% (subject to 4yr vest, 1yr cliff)<br>
• <strong>Series A Investors</strong>: 31% (Sequoia 18%, a16z 7%, Accel 6%)<br>
• <strong>Seed Investors</strong>: 8% (Lightspeed + angels)<br>
• <strong>ESOP Pool</strong>: 12% (fully allocated for current team)<br>
• <strong>Advisors</strong>: 2%<br>
• <strong>Unallocated</strong>: 5%<br><br>
<strong>Post Series B (pro forma at $25M at $70M post-money):</strong><br>
• New investors: ~26%<br>
• Option pool refresh: +3–4%<br>
• Founders diluted to: ~33%<br><br>
Full waterfall analysis available in the data room upon NDA execution.`,
      pills: [
        { label: 'Founders 42%', cls: '' },
        { label: 'ESOP 12%', cls: '' },
        { label: 'Full Waterfall in DR', cls: 'green' },
      ]
    })
  },

  /* ── DEFAULT FALLBACK ── */
  {
    keys: ['__default__'],
    answer: (q) => ({
      text: `Thanks for your question! I'm InvestorAI — trained on all of InvestorOS's Q2 2026 data.<br><br>
I can answer questions about:<br>
• 📈 <strong>ARR, MRR, and revenue growth</strong><br>
• 🔁 <strong>NDR, churn, and retention cohorts</strong><br>
• ⚖️ <strong>Unit economics</strong> (LTV, CAC, payback)<br>
• 💰 <strong>Series B fundraise details</strong><br>
• 📊 <strong>Valuation and financial model</strong><br>
• 🎯 <strong>GTM strategy and pipeline</strong><br>
• 🏢 <strong>Customers, team, and competition</strong><br>
• 🔥 <strong>Burn rate and runway</strong><br>
• 🛡️ <strong>Security and compliance</strong><br><br>
Please try rephrasing your question, or click one of the quick-question chips above!`,
      pills: []
    })
  },
];

/* ─── RESPONSE ENGINE ────────────────────────────────────────── */
function findAnswer(query) {
  const q = query.toLowerCase();
  for (const entry of KB) {
    if (entry.keys[0] === '__default__') continue;
    if (entry.keys.some(k => q.includes(k))) {
      return entry.answer(q);
    }
  }
  // fallback
  return KB[KB.length - 1].answer(q);
}

/* ─── DOM HELPERS ────────────────────────────────────────────── */
function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildMsgHTML(text, pills = []) {
  const pillsHTML = pills.length
    ? `<div class="metric-row">${pills.map(p => `<span class="metric-pill ${p.cls}">${p.label}</span>`).join('')}</div>`
    : '';
  return `${text}${pillsHTML}`;
}

function appendMessage(role, html, time) {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;

  const wrapper = document.createElement('div');
  wrapper.className = `chat-msg ${role}`;

  const avatarClass  = role === 'ai' ? 'ai-av' : 'usr-av';
  const avatarLabel  = role === 'ai' ? 'AI' : 'You';

  wrapper.innerHTML = `
    <div class="msg-avatar ${avatarClass}">${avatarLabel}</div>
    <div>
      <div class="msg-bubble">${html}</div>
      <div class="msg-time">${time}</div>
    </div>
  `;

  msgs.appendChild(wrapper);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const el = document.getElementById('chatbot-typing');
  if (el) el.style.display = 'flex';
  const msgs = document.getElementById('chatbot-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('chatbot-typing');
  if (el) el.style.display = 'none';
}

function setInputBusy(busy) {
  const input  = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  if (input)   input.disabled  = busy;
  if (sendBtn) sendBtn.disabled = busy;
}

/* ─── SEND MESSAGE ───────────────────────────────────────────── */
function sendMessage(text) {
  const raw = text || document.getElementById('chatbot-input')?.value?.trim();
  if (!raw) return;

  // Hide suggestions after first message
  const sugg = document.getElementById('chatbot-suggestions');
  if (sugg) sugg.style.display = 'none';

  // Render user message
  appendMessage('user', raw, nowTime());

  // Clear input
  const input = document.getElementById('chatbot-input');
  if (input) { input.value = ''; input.style.height = 'auto'; }

  // Show typing
  setInputBusy(true);
  showTyping();

  // Simulate realistic AI latency (800–1600ms)
  const delay = 800 + Math.random() * 800;
  setTimeout(() => {
    hideTyping();
    const { text: responseText, pills } = findAnswer(raw);
    appendMessage('ai', buildMsgHTML(responseText, pills), nowTime());
    setInputBusy(false);
    document.getElementById('chatbot-input')?.focus();
  }, delay);
}

/* ─── INIT CHATBOT ───────────────────────────────────────────── */
function initChatbot() {
  const fab      = document.getElementById('chat-fab');
  const panel    = document.getElementById('chatbot-panel');
  const fabIcon  = document.getElementById('chat-fab-icon');
  const fabClose = document.getElementById('chat-fab-close');
  const sendBtn  = document.getElementById('chatbot-send');
  const input    = document.getElementById('chatbot-input');
  const clearBtn = document.getElementById('chatbot-clear');
  const msgs     = document.getElementById('chatbot-messages');

  let isOpen = false;

  // Toggle panel
  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    fab.classList.toggle('open', isOpen);
    fabIcon.style.display  = isOpen ? 'none'  : 'flex';
    fabClose.style.display = isOpen ? 'flex'  : 'none';

    if (isOpen) {
      // Show welcome message if first open
      if (msgs && msgs.children.length === 0) {
        setTimeout(() => {
          showTyping();
          setTimeout(() => {
            hideTyping();
            appendMessage('ai', buildMsgHTML(
              `👋 <strong>Welcome to InvestorAI!</strong><br><br>
I'm your dedicated investor relations assistant, trained on all of <strong>InvestorOS's Q2 2026 data</strong>.<br><br>
I can answer questions about ARR, NDR, unit economics, the Series B raise, valuation, GTM strategy, and much more.<br><br>
What would you like to know?`,
              [
                { label: 'ARR $4.82M', cls: 'green' },
                { label: 'NDR 114%', cls: 'green' },
                { label: 'Series B $25M', cls: '' },
              ]
            ), nowTime());
          }, 1000);
        }, 200);
      }
      setTimeout(() => input?.focus(), 400);
    }
  }

  fab.addEventListener('click', togglePanel);

  // Send on button click
  sendBtn?.addEventListener('click', () => sendMessage());

  // Send on Enter (Shift+Enter for newline)
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Quick suggestion chips
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.q;
      if (q) sendMessage(q);
    });
  });

  // Clear chat
  clearBtn?.addEventListener('click', () => {
    if (msgs) msgs.innerHTML = '';
    const sugg = document.getElementById('chatbot-suggestions');
    if (sugg) sugg.style.display = 'block';
  });

  // Close panel on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) togglePanel();
  });

  // Close on outside click (optional)
  document.addEventListener('click', (e) => {
    if (isOpen && !panel.contains(e.target) && !fab.contains(e.target)) {
      togglePanel();
    }
  });
}

/* ─── BOOT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initChatbot);
