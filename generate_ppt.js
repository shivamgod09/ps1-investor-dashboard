const pptxgen = require('pptxgenjs');

let pres = new pptxgen();

pres.author = 'InvestorOS Team';
pres.company = 'InvestorOS';
pres.revision = '1';
pres.subject = 'InvestorOS Presentation';
pres.title = 'InvestorOS - 5 Minute Pitch';

// Slide 1: Title Slide
let slide1 = pres.addSlide();
slide1.background = { color: "0F172A" }; // Dark theme from CSS
slide1.addText('InvestorOS', { x: 1, y: 1.5, w: '80%', fontSize: 48, bold: true, color: 'FFFFFF', align: 'center' });
slide1.addText('Investor & Growth Office Platform', { x: 1, y: 2.5, w: '80%', fontSize: 24, color: '94A3B8', align: 'center' });
slide1.addText('Automate investor relations, board reporting, and growth metrics.', { x: 1, y: 3.2, w: '80%', fontSize: 18, color: 'CBD5E1', align: 'center' });

// Slide 2: The Problem
let slide2 = pres.addSlide();
slide2.addText('The Problem', { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: '0F172A' });
slide2.addText([
    { text: 'Founders spend too much time on manual reporting instead of building.', options: { bullet: true } },
    { text: 'Data is fragmented across multiple tools (CRM, financial software, spreadsheets).', options: { bullet: true } },
    { text: 'Board decks and investor updates lack consistency and real-time data.', options: { bullet: true } },
    { text: 'Fundraising readiness is often an afterthought, causing delays when capital is needed.', options: { bullet: true } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: '334155', lineSpacing: 36 });

// Slide 3: The Solution
let slide3 = pres.addSlide();
slide3.addText('The Solution: InvestorOS', { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: '0F172A' });
slide3.addText([
    { text: 'A single source of truth for your growth metrics and investor relations.', options: { bullet: true } },
    { text: 'Automated Dashboards: Instantly visualize ARR, churn, and cash runway.', options: { bullet: true } },
    { text: 'One-Click Board Decks: Generate professional board reports in minutes.', options: { bullet: true } },
    { text: 'Fundraising Readiness: Keep your data room and scenario models always up to date.', options: { bullet: true } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: '334155', lineSpacing: 36 });

// Slide 4: Key Features
let slide4 = pres.addSlide();
slide4.addText('Key Features', { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: '0F172A' });

slide4.addText('Dashboard & Growth Metrics', { x: 0.5, y: 1.5, w: '40%', fontSize: 22, bold: true, color: '2563EB' });
slide4.addText('Track real-time financial health and user growth.', { x: 0.5, y: 2.0, w: '40%', fontSize: 16, color: '475569' });

slide4.addText('Investor Reporting', { x: 5.0, y: 1.5, w: '40%', fontSize: 22, bold: true, color: '2563EB' });
slide4.addText('Send automated, professional updates to your stakeholders.', { x: 5.0, y: 2.0, w: '40%', fontSize: 16, color: '475569' });

slide4.addText('Board Deck Builder', { x: 0.5, y: 3.2, w: '40%', fontSize: 22, bold: true, color: '2563EB' });
slide4.addText('Drag and drop financial charts straight into your deck.', { x: 0.5, y: 3.7, w: '40%', fontSize: 16, color: '475569' });

slide4.addText('Scenario Modeling', { x: 5.0, y: 3.2, w: '40%', fontSize: 22, bold: true, color: '2563EB' });
slide4.addText('Forecast runway under different market conditions.', { x: 5.0, y: 3.7, w: '40%', fontSize: 16, color: '475569' });


// Slide 5: Value Proposition & Impact
let slide5 = pres.addSlide();
slide5.addText('Why InvestorOS?', { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color: '0F172A' });
slide5.addText([
    { text: 'Save Time: Cut reporting time by over 70%.', options: { bullet: { type: 'number' } } },
    { text: 'Impress Investors: Deliver crisp, accurate, and timely data.', options: { bullet: { type: 'number' } } },
    { text: 'Make Better Decisions: Access real-time growth metrics at your fingertips.', options: { bullet: { type: 'number' } } },
    { text: 'Raise Faster: Be fundamentally prepared for your next funding round.', options: { bullet: { type: 'number' } } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 22, color: '334155', lineSpacing: 40 });

// Slide 6: Q&A / Conclusion
let slide6 = pres.addSlide();
slide6.background = { color: "0F172A" };
slide6.addText('Thank You', { x: 1, y: 2.0, w: '80%', fontSize: 48, bold: true, color: 'FFFFFF', align: 'center' });
slide6.addText('Questions?', { x: 1, y: 3.0, w: '80%', fontSize: 24, color: '94A3B8', align: 'center' });

pres.writeFile({ fileName: 'InvestorOS_Presentation.pptx' }).then(fileName => {
    console.log(`Created file: ${fileName}`);
});
