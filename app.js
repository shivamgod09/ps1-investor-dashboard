/* ================================================================
   InvestorOS — app.js
   Full interactive logic: charts, navigation, data, UI
   ================================================================ */

'use strict';

/* ─── GLOBAL COLOR PALETTE ─── */
const COLORS = {
  purple: '#7C6EFA',
  teal:   '#00D4AA',
  blue:   '#4A9EFF',
  pink:   '#FF6B9D',
  orange: '#FF9F43',
  red:    '#FF5B5B',
  yellow: '#FFD700',
  green:  '#2ECC71',
};

Chart.defaults.color = '#8B92A9';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = "'Inter', sans-serif";

/* ─── NAVIGATION ─── */
function initNav() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  const pageTitle = document.getElementById('page-title');

  const titles = {
    dashboard:          'Executive Dashboard',
    'growth-metrics':   'Growth Metrics',
    'investor-reporting':'Investor Reporting',
    'board-deck':       'Board Deck Builder',
    fundraising:        'Fundraising Readiness',
    scenario:           'Scenario Planning',
    crm:                'CRM Analytics',
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = item.dataset.section;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(s => s.classList.remove('active'));
      const target = document.getElementById(`section-${sec}`);
      if (target) {
        target.classList.add('active');
        // lazy-init section charts
        if (sec === 'growth-metrics' && !window._growthInit) initGrowthCharts();
        if (sec === 'scenario'       && !window._scenarioInit) initScenario();
        if (sec === 'crm'            && !window._crmInit) initCRM();
        if (sec === 'fundraising'    && !window._fundraisingInit) initFundraising();
        if (sec === 'board-deck'     && !window._deckInit) initDeck();
        if (sec === 'investor-reporting' && !window._invInit) initInvestorReporting();
      }

      if (pageTitle) pageTitle.textContent = titles[sec] || '';

      // mobile close
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  // Mobile toggle
  const toggle = document.getElementById('menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  // Period buttons
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Export button
  document.getElementById('export-btn')?.addEventListener('click', () => showToast('📊 Report exported successfully'));
}

/* ─── SPARKLINES ─── */
function makeSparkline(id, data, color) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: color,
        borderWidth: 2,
        fill: true,
        backgroundColor: (ctx2) => {
          const g = ctx2.chart.ctx.createLinearGradient(0, 0, 0, 36);
          g.addColorStop(0, color + '44');
          g.addColorStop(1, 'transparent');
          return g;
        },
        tension: 0.4,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      animation: { duration: 1000 },
    }
  });
}

function initSparklines() {
  makeSparkline('spark-arr',      [2.1,2.4,2.7,3.1,3.5,3.9,4.3,4.82], COLORS.purple);
  makeSparkline('spark-ndr',      [104,106,108,109,110,111,112,114],   COLORS.teal);
  makeSparkline('spark-logo',     [18,22,27,31,33,38,41,47],           COLORS.blue);
  makeSparkline('spark-churn',    [3.2,2.9,2.7,2.5,2.4,2.2,2.0,1.8],  COLORS.orange);
  makeSparkline('spark-ltvcac',   [3.1,3.4,3.8,4.1,4.4,4.7,5.0,5.2],  COLORS.green);
  makeSparkline('spark-pipeline', [98,112,130,148,165,182,200,218],    COLORS.pink);
}

/* ─── ARR CHART ─── */
function initARRChart() {
  const ctx = document.getElementById('arrChart');
  if (!ctx) return;
  const labels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'New ARR',
          data: [180,210,240,260,290,320,340,370,390,420,450,490],
          backgroundColor: COLORS.purple + 'BB',
          borderRadius: 5,
          stack: 'arr',
        },
        {
          label: 'Expansion',
          data: [60,70,80,90,100,110,115,130,140,150,155,165],
          backgroundColor: COLORS.teal + 'BB',
          borderRadius: 5,
          stack: 'arr',
        },
        {
          label: 'Churn',
          data: [-20,-25,-22,-28,-30,-25,-28,-32,-30,-35,-38,-40],
          backgroundColor: COLORS.red + 'BB',
          borderRadius: 5,
          stack: 'arr',
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
      scales: {
        x: { grid: { display: false }, stacked: true },
        y: { stacked: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => `$${v}K` } }
      }
    }
  });
}

/* ─── REVENUE MIX ─── */
function initRevMixChart() {
  const ctx = document.getElementById('revMixChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Enterprise', 'Mid-Market', 'SMB', 'Professional Svcs'],
      datasets: [{
        data: [48, 29, 15, 8],
        backgroundColor: [COLORS.purple, COLORS.teal, COLORS.blue, COLORS.orange],
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, boxWidth: 10, font: { size: 11 } } },
      }
    }
  });
}

/* ─── GROWTH CHARTS ─── */
function initGrowthCharts() {
  window._growthInit = true;

  // MRR Waterfall
  const ctx1 = document.getElementById('mrrWaterfallChart');
  if (ctx1) {
    const labels = ['Jan','Feb','Mar','Apr','May','Jun'];
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'New MRR', data: [38,42,46,52,58,65], backgroundColor: COLORS.purple + 'CC', borderRadius: 5 },
          { label: 'Expansion', data: [12,14,16,18,19,21], backgroundColor: COLORS.teal + 'CC', borderRadius: 5 },
          { label: 'Contraction', data: [-4,-5,-4,-6,-5,-6], backgroundColor: COLORS.orange + 'CC', borderRadius: 5 },
          { label: 'Churn', data: [-6,-7,-6,-8,-8,-9], backgroundColor: COLORS.red + 'CC', borderRadius: 5 },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => `$${v}K` } }
        }
      }
    });
  }

  // CAC vs LTV
  const ctx2 = document.getElementById('cacLtvChart');
  if (ctx2) {
    const labels = ['Q1 25','Q2 25','Q3 25','Q4 25','Q1 26','Q2 26'];
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'LTV',
            data: [14200, 15400, 16100, 17600, 18900, 19968],
            borderColor: COLORS.teal,
            backgroundColor: COLORS.teal + '22',
            fill: true, tension: 0.4, pointRadius: 4,
          },
          {
            label: 'CAC',
            data: [5200, 4900, 4600, 4300, 4100, 3840],
            borderColor: COLORS.orange,
            backgroundColor: COLORS.orange + '22',
            fill: true, tension: 0.4, pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => `$${(v/1000).toFixed(0)}K` } }
        }
      }
    });
  }

  // Cohort table
  buildCohortTable();

  // Pipeline chart
  const ctx3 = document.getElementById('pipelineChart');
  if (ctx3) {
    const stages = ['Prospecting','Discovery','Demo','Proposal','Negotiation','Closed Won'];
    const counts = [24, 18, 14, 9, 6, 5];
    const values = [1800,1400,1100,850,600,380];
    new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: stages,
        datasets: [
          {
            label: 'Deal Count',
            data: counts,
            backgroundColor: COLORS.purple + 'BB',
            borderRadius: 5,
            yAxisID: 'y1',
          },
          {
            label: 'Value ($K)',
            data: values,
            backgroundColor: COLORS.teal + '44',
            borderRadius: 5,
            type: 'line',
            borderColor: COLORS.teal,
            tension: 0.4,
            yAxisID: 'y2',
            fill: false,
            pointRadius: 5,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false } },
          y1: { type: 'linear', position: 'left', grid: { color: 'rgba(255,255,255,0.04)' } },
          y2: { type: 'linear', position: 'right', grid: { display: false }, ticks: { callback: v => `$${v}K` } }
        }
      }
    });
  }

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      const target = document.getElementById(`tab-${btn.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });
}

/* ─── COHORT TABLE ─── */
function buildCohortTable() {
  const table = document.getElementById('cohort-table');
  if (!table) return;

  const cohorts = ['Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25','Jul 25','Aug 25'];
  const months  = ['M0','M1','M2','M3','M4','M5','M6','M7'];
  const baseData = [
    [100, 94, 91, 89, 87, 86, 85, 84],
    [100, 93, 90, 88, 86, 85, 83],
    [100, 95, 92, 90, 88, 87],
    [100, 94, 91, 89, 88],
    [100, 96, 93, 91],
    [100, 95, 92],
    [100, 95],
    [100],
  ];

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Cohort</th>' + months.map(m => `<th>${m}</th>`).join('') + '</tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  cohorts.forEach((c, i) => {
    const tr = document.createElement('tr');
    let row = `<td style="text-align:left;font-weight:600;white-space:nowrap">${c}</td>`;
    months.forEach((_, j) => {
      const val = baseData[i][j];
      if (val === undefined) { row += '<td>—</td>'; return; }
      const hue = val >= 90 ? `rgba(0,212,170,${(val-80)/40})` :
                  val >= 80 ? `rgba(255,159,67,${(val-70)/40})` :
                              `rgba(255,91,91,${(val-60)/40})`;
      row += `<td style="background:${hue};color:${val >= 85 ? '#fff' : '#ccc'}">${val}%</td>`;
    });
    tr.innerHTML = row;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

/* ─── INVESTOR REPORTING ─── */
const INVESTORS = [
  { name: 'Sequoia Capital', stage: 'Series A Lead', color: '#7C6EFA', initials: 'SC', status: 'active' },
  { name: 'Andreessen Horowitz', stage: 'Series A Follow', color: '#4A9EFF', initials: 'A16', status: 'active' },
  { name: 'Tiger Global', stage: 'Series B Prospect', color: '#00D4AA', initials: 'TG', status: 'pending' },
  { name: 'Accel Partners', stage: 'Series A Follow', color: '#FF9F43', initials: 'AC', status: 'active' },
  { name: 'Lightspeed', stage: 'Seed Investor', color: '#FF6B9D', initials: 'LS', status: 'active' },
  { name: 'Bessemer Ventures', stage: 'Series B Prospect', color: '#2ECC71', initials: 'BV', status: 'pending' },
  { name: 'Index Ventures', stage: 'Series A Follow', color: '#FFD700', initials: 'IV', status: 'active' },
];

function initInvestorReporting() {
  window._invInit = true;
  renderInvestorList(INVESTORS);

  const search = document.getElementById('investor-search');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase();
      renderInvestorList(INVESTORS.filter(inv => inv.name.toLowerCase().includes(q)));
    });
  }

  document.getElementById('generate-report-btn')?.addEventListener('click', () => {
    const type = document.getElementById('report-type').value;
    const period = document.getElementById('report-period').value;
    const narrative = document.getElementById('report-narrative').value || 'We continued to execute strongly across all key metrics…';
    generateReportPreview(type, period, narrative);
  });

  document.getElementById('preview-btn')?.addEventListener('click', () => {
    const type = document.getElementById('report-type').value;
    const period = document.getElementById('report-period').value;
    const narrative = document.getElementById('report-narrative').value || '...';
    generateReportPreview(type, period, narrative);
  });

  document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('report-modal').style.display = 'none';
  });
  document.getElementById('modal-cancel')?.addEventListener('click', () => {
    document.getElementById('report-modal').style.display = 'none';
  });
  document.getElementById('modal-send')?.addEventListener('click', () => {
    document.getElementById('report-modal').style.display = 'none';
    showToast('✉️ Report sent to all 7 investors successfully!');
  });
}

function renderInvestorList(investors) {
  const list = document.getElementById('investor-list');
  if (!list) return;
  list.innerHTML = '';
  investors.forEach(inv => {
    const li = document.createElement('li');
    li.className = 'investor-item';
    li.innerHTML = `
      <div class="inv-avatar" style="background:${inv.color}22;color:${inv.color};border:1px solid ${inv.color}44">${inv.initials}</div>
      <div>
        <div class="inv-name">${inv.name}</div>
        <div class="inv-stage">${inv.stage}</div>
      </div>
      <div class="inv-status"><div class="inv-dot ${inv.status}"></div></div>
    `;
    list.appendChild(li);
  });
}

function generateReportPreview(type, period, narrative) {
  const modal = document.getElementById('report-modal');
  const body  = document.getElementById('modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="border-bottom:1px solid rgba(255,255,255,0.07);padding-bottom:16px;margin-bottom:16px">
      <div style="font-size:1.1rem;font-weight:700;color:#F0F2FF;margin-bottom:4px">${type} — ${period}</div>
      <div style="font-size:0.75rem;color:#8B92A9">From: Growth Office &nbsp;·&nbsp; To: All Investors</div>
    </div>
    <p style="margin-bottom:14px">${narrative}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0">
      ${[
        ['ARR', '$4.82M', '+18.4% MoM'],
        ['NDR', '114%', '+3pp QoQ'],
        ['New Logos', '47', '+12 vs LM'],
        ['Rule of 40', '58', 'Target >40 ✓'],
      ].map(([l,v,c]) => `
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px">
          <div style="font-size:0.72rem;color:#8B92A9;margin-bottom:4px">${l}</div>
          <div style="font-size:1.15rem;font-weight:700;color:#F0F2FF">${v}</div>
          <div style="font-size:0.72rem;color:#00D4AA">${c}</div>
        </div>
      `).join('')}
    </div>
    <p style="font-size:0.82rem;color:#8B92A9;margin-top:16px">
      <strong style="color:#F0F2FF">Next Steps:</strong> Schedule Q3 planning call · Series B roadshow preparation · Data room opening in July 2026.
    </p>
  `;

  modal.style.display = 'flex';
}

/* ─── BOARD DECK ─── */
const SLIDES = [
  { title: 'Company Overview',    icon: '🏢', content: 'cover' },
  { title: 'Q2 2026 Highlights',  icon: '⭐', content: 'highlights' },
  { title: 'Financial Summary',   icon: '💰', content: 'financials' },
  { title: 'ARR Growth & NDR',    icon: '📈', content: 'arr' },
  { title: 'Unit Economics',      icon: '⚖️', content: 'uniteco' },
  { title: 'Go-to-Market',        icon: '🎯', content: 'gtm' },
  { title: 'Fundraising Plan',    icon: '💼', content: 'fundraise' },
  { title: 'Asks & Next Steps',   icon: '✅', content: 'asks' },
];

const SLIDE_CONTENT = {
  cover: `
    <div style="text-align:center">
      <div style="font-size:3rem;margin-bottom:16px">🚀</div>
      <div style="font-family:'Outfit',sans-serif;font-size:2.4rem;font-weight:800;background:linear-gradient(135deg,#7C6EFA,#4A9EFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Board Meeting</div>
      <div style="font-size:1.1rem;color:#8B92A9;margin-top:8px">Q2 2026 · June 15, 2026</div>
      <div style="margin-top:28px;display:inline-block;background:rgba(124,110,250,0.12);border:1px solid rgba(124,110,250,0.25);padding:8px 20px;border-radius:99px;color:#7C6EFA;font-size:0.82rem;font-weight:600">CONFIDENTIAL</div>
    </div>
  `,
  highlights: `
    <div>
      <div style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:20px;color:#F0F2FF">⭐ Q2 2026 Highlights</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        ${[
          ['ARR hit $4.82M','↑18.4% MoM','#7C6EFA'],
          ['NDR expanded to 114%','Best quarter ever','#00D4AA'],
          ['47 new logos signed','Enterprise mix growing','#4A9EFF'],
          ['Rule of 40 = 58','Efficiency at scale','#FF9F43'],
        ].map(([t,s,c]) => `
          <div style="background:${c}14;border:1px solid ${c}33;border-radius:10px;padding:14px">
            <div style="font-weight:600;font-size:0.88rem;color:#F0F2FF">${t}</div>
            <div style="font-size:0.75rem;color:#8B92A9;margin-top:4px">${s}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `,
  financials: `
    <div>
      <div style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:20px;color:#F0F2FF">💰 Financial Summary</div>
      <table style="width:100%;border-collapse:collapse;font-size:0.82rem">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1)">
            <th style="text-align:left;padding:8px;color:#8B92A9">Metric</th>
            <th style="text-align:right;padding:8px;color:#8B92A9">Q2 2026</th>
            <th style="text-align:right;padding:8px;color:#8B92A9">Q1 2026</th>
            <th style="text-align:right;padding:8px;color:#8B92A9">vs Plan</th>
          </tr>
        </thead>
        <tbody>
          ${[
            ['ARR','$4.82M','$4.07M','✓ +8%'],
            ['MRR','$401K','$339K','✓ +10%'],
            ['Gross Margin','72%','70%','✓ On plan'],
            ['NDR','114%','111%','✓ +3pp'],
            ['CAC','$3,840','$4,180','✓ -8%'],
          ].map(([m,q2,q1,v]) => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
              <td style="padding:10px 8px;color:#F0F2FF;font-weight:500">${m}</td>
              <td style="padding:10px 8px;text-align:right;color:#F0F2FF;font-weight:600">${q2}</td>
              <td style="padding:10px 8px;text-align:right;color:#8B92A9">${q1}</td>
              <td style="padding:10px 8px;text-align:right;color:#00D4AA;font-weight:600">${v}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `,
  arr: `
    <div>
      <div style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:20px;color:#F0F2FF">📈 ARR Growth & NDR</div>
      <div style="display:flex;gap:24px;justify-content:center;margin-bottom:20px">
        ${[['$4.82M','ARR','#7C6EFA'],['114%','NDR','#00D4AA'],['18.4%','MoM Growth','#4A9EFF']].map(([v,l,c])=>`
          <div style="text-align:center;background:${c}14;border:1px solid ${c}30;padding:16px 28px;border-radius:14px">
            <div style="font-family:'Outfit',sans-serif;font-size:1.8rem;font-weight:800;color:${c}">${v}</div>
            <div style="font-size:0.75rem;color:#8B92A9;margin-top:4px">${l}</div>
          </div>
        `).join('')}
      </div>
      <p style="font-size:0.82rem;color:#8B92A9;text-align:center">NDR >110% indicates strong net expansion — existing customers growing faster than churn.</p>
    </div>
  `,
  uniteco: `
    <div>
      <div style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:20px;color:#F0F2FF">⚖️ Unit Economics</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        ${[
          ['LTV','$19,968','#00D4AA'],
          ['CAC','$3,840','#FF9F43'],
          ['LTV:CAC','5.2x','#7C6EFA'],
          ['Payback','11.5 mo','#4A9EFF'],
          ['Gross Margin','72%','#2ECC71'],
          ['Magic Number','1.2x','#FF6B9D'],
        ].map(([l,v,c])=>`
          <div style="background:${c}12;border:1px solid ${c}30;border-radius:10px;padding:14px;text-align:center">
            <div style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:800;color:${c}">${v}</div>
            <div style="font-size:0.73rem;color:#8B92A9;margin-top:4px">${l}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `,
  gtm: `
    <div>
      <div style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:20px;color:#F0F2FF">🎯 Go-to-Market Strategy</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${[
          ['Inbound','42%','Content-led organic + PLG motion','#7C6EFA'],
          ['Outbound','31%','Enterprise SDR team + ABM','#4A9EFF'],
          ['Partner Channel','18%','System integrators + ISV','#00D4AA'],
          ['PLG','9%','Free tier → paid conversion','#FF9F43'],
        ].map(([ch,pct,desc,c])=>`
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:14px">
            <div style="font-weight:700;color:${c};min-width:80px">${pct}</div>
            <div>
              <div style="font-size:0.84rem;font-weight:600;color:#F0F2FF">${ch}</div>
              <div style="font-size:0.74rem;color:#8B92A9">${desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `,
  fundraise: `
    <div>
      <div style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:20px;color:#F0F2FF">💼 Series B Fundraise</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div style="background:rgba(124,110,250,0.1);border:1px solid rgba(124,110,250,0.2);border-radius:12px;padding:16px">
          <div style="font-size:0.75rem;color:#8B92A9;margin-bottom:8px">Target Raise</div>
          <div style="font-family:'Outfit',sans-serif;font-size:2rem;font-weight:800;color:#7C6EFA">$25M</div>
          <div style="font-size:0.75rem;color:#8B92A9;margin-top:4px">Primary · 18-month runway extension</div>
        </div>
        <div>
          <div style="margin-bottom:10px"><div style="font-size:0.75rem;color:#8B92A9">Soft Committed</div><div style="font-size:1.2rem;font-weight:700;color:#00D4AA">$12M (48%)</div></div>
          <div style="margin-bottom:10px"><div style="font-size:0.75rem;color:#8B92A9">In Discussion</div><div style="font-size:1.2rem;font-weight:700;color:#FFD700">$8M (32%)</div></div>
          <div><div style="font-size:0.75rem;color:#8B92A9">Remaining Gap</div><div style="font-size:1.2rem;font-weight:700;color:#F0F2FF">$5M (20%)</div></div>
        </div>
      </div>
      <div style="height:8px;background:rgba(255,255,255,0.05);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:48%;background:linear-gradient(90deg,#00D4AA,#4A9EFF);border-radius:99px"></div>
      </div>
    </div>
  `,
  asks: `
    <div>
      <div style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:20px;color:#F0F2FF">✅ Asks & Next Steps</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${[
          ['Board Approval','Q3 sales headcount plan (12 AEs)','🟣'],
          ['Warm Intros','Tiger Global · Bessemer · General Catalyst','🔵'],
          ['Data Room Review','Legal package upload by June 30','🟢'],
          ['Series B Close','Target: September 2026','🟡'],
        ].map(([t,d,e])=>`
          <div style="display:flex;align-items:flex-start;gap:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px 14px">
            <div style="font-size:1.1rem">${e}</div>
            <div>
              <div style="font-size:0.86rem;font-weight:600;color:#F0F2FF">${t}</div>
              <div style="font-size:0.76rem;color:#8B92A9;margin-top:2px">${d}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `,
};

let currentSlide = 0;

function initDeck() {
  window._deckInit = true;
  renderSlideList();
  renderSlide(0);

  document.getElementById('prev-slide')?.addEventListener('click', () => {
    if (currentSlide > 0) { currentSlide--; renderSlide(currentSlide); }
  });
  document.getElementById('next-slide')?.addEventListener('click', () => {
    if (currentSlide < SLIDES.length - 1) { currentSlide++; renderSlide(currentSlide); }
  });
  document.getElementById('export-deck-btn')?.addEventListener('click', () => {
    showToast('📁 Board deck exported as PDF (8 slides)');
  });
  document.getElementById('add-slide-btn')?.addEventListener('click', () => {
    showToast('✨ Slide added — edit content in the canvas');
  });
}

function renderSlideList() {
  const ul = document.getElementById('slides-ul');
  if (!ul) return;
  ul.innerHTML = '';
  SLIDES.forEach((slide, i) => {
    const li = document.createElement('li');
    li.className = `slide-item${i === 0 ? ' active' : ''}`;
    li.innerHTML = `<span class="slide-num">${i + 1}</span> ${slide.icon} ${slide.title}`;
    li.addEventListener('click', () => { currentSlide = i; renderSlide(i); });
    ul.appendChild(li);
  });
}

function renderSlide(index) {
  const canvas = document.getElementById('slide-canvas');
  const counter = document.getElementById('slide-counter');
  if (!canvas) return;

  document.querySelectorAll('.slide-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });

  const slide = SLIDES[index];
  canvas.innerHTML = SLIDE_CONTENT[slide.content] || `<div style="color:#8B92A9;text-align:center">${slide.title}</div>`;

  if (counter) counter.textContent = `${index + 1} / ${SLIDES.length}`;
}

/* ─── FUNDRAISING ─── */
const DATA_ROOM = [
  { cat: 'Financials',           items: 4, done: 4, color: COLORS.teal },
  { cat: 'Legal & Corporate',    items: 6, done: 4, color: COLORS.blue },
  { cat: 'Product & Tech',       items: 5, done: 5, color: COLORS.purple },
  { cat: 'Market & Competition', items: 3, done: 3, color: COLORS.orange },
  { cat: 'Team & Org Chart',     items: 3, done: 2, color: COLORS.pink },
  { cat: 'Customer References',  items: 4, done: 1, color: COLORS.red },
];

function initFundraising() {
  window._fundraisingInit = true;

  // Data room
  const container = document.getElementById('dataroom-categories');
  if (container) {
    container.innerHTML = '';
    DATA_ROOM.forEach(dr => {
      const pct = Math.round((dr.done / dr.items) * 100);
      const div = document.createElement('div');
      div.className = 'dr-category';
      div.innerHTML = `
        <div class="dr-cat-header">
          <span>${dr.cat}</span>
          <span class="dr-progress">${dr.done}/${dr.items} · ${pct}%</span>
        </div>
        <div class="dr-bar-wrap"><div class="dr-bar" style="width:0%;background:${dr.color}" data-w="${pct}%"></div></div>
      `;
      container.appendChild(div);
    });
    // Animate bars
    setTimeout(() => {
      container.querySelectorAll('.dr-bar').forEach(bar => {
        bar.style.width = bar.dataset.w;
      });
    }, 200);
  }

  // Raise donut
  const ctx = document.getElementById('raiseChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Committed','In Discussion','Remaining'],
        datasets: [{ data: [12, 8, 5], backgroundColor: [COLORS.teal, COLORS.yellow, '#2a2d3a'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } }
      }
    });
  }

  // Valuation calculator
  document.getElementById('calc-valuation')?.addEventListener('click', calcValuation);
  calcValuation();
}

function calcValuation() {
  const arr      = parseFloat(document.getElementById('val-arr').value)      || 4.82;
  const multiple = parseFloat(document.getElementById('val-multiple').value) || 12;
  const growth   = parseFloat(document.getElementById('val-growth').value)   || 120;
  const margin   = parseFloat(document.getElementById('val-margin').value)   || 72;

  // Simple forward ARR based multiple with quality adjustment
  const qualityAdj = ((growth / 100) * 0.3) + ((margin / 100) * 0.2) + 0.5;
  const ev = arr * multiple * qualityAdj;
  const lo = ev * 0.8, hi = ev * 1.2;

  const resVal  = document.getElementById('val-result-value');
  const resRange = document.getElementById('val-result-range');
  if (resVal)   resVal.textContent   = `$${ev.toFixed(1)}M`;
  if (resRange) resRange.textContent = `Range: $${lo.toFixed(0)}M – $${hi.toFixed(0)}M (±20%)`;
}

/* ─── SCENARIO PLANNING ─── */
let scenarioChartInst = null;

const SCENARIOS = {
  base: { growth: 120, margin: 72, efficiency: 120, churn: 18 },
  bull: { growth: 180, margin: 78, efficiency: 160, churn: 12 },
  bear: { growth: 70,  margin: 62, efficiency: 80,  churn: 32 },
};

function initScenario() {
  window._scenarioInit = true;

  const sliders = {
    growth:     document.getElementById('growth-slider'),
    margin:     document.getElementById('margin-slider'),
    efficiency: document.getElementById('efficiency-slider'),
    churn:      document.getElementById('churn-slider'),
  };
  const labels = {
    growth:     document.getElementById('growth-label'),
    margin:     document.getElementById('margin-label'),
    efficiency: document.getElementById('efficiency-label'),
    churn:      document.getElementById('churn-label'),
  };

  function fmt(key, val) {
    if (key === 'efficiency') return `${(val/100).toFixed(1)}x`;
    if (key === 'churn')      return `${(val/10).toFixed(1)}%`;
    return `${val}%`;
  }

  Object.keys(sliders).forEach(key => {
    if (!sliders[key]) return;
    sliders[key].addEventListener('input', () => {
      labels[key].textContent = fmt(key, sliders[key].value);
      buildScenarioChart();
    });
  });

  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const s = SCENARIOS[btn.dataset.scenario];
      if (sliders.growth)     { sliders.growth.value     = s.growth;     labels.growth.textContent     = fmt('growth', s.growth); }
      if (sliders.margin)     { sliders.margin.value     = s.margin;     labels.margin.textContent     = fmt('margin', s.margin); }
      if (sliders.efficiency) { sliders.efficiency.value = s.efficiency; labels.efficiency.textContent = fmt('efficiency', s.efficiency); }
      if (sliders.churn)      { sliders.churn.value      = s.churn;      labels.churn.textContent      = fmt('churn', s.churn); }
      buildScenarioChart();
    });
  });

  buildScenarioChart();
  buildDCFTable();
}

function buildScenarioChart() {
  const ctx = document.getElementById('scenarioChart');
  if (!ctx) return;

  const growthSlider = document.getElementById('growth-slider');
  const g = growthSlider ? parseFloat(growthSlider.value) / 100 : 1.2;

  const years = ['2026','2027','2028','2029','2030'];
  let base = 4.82;
  const baseData = years.map(() => { base *= (1 + g); return +base.toFixed(2); });

  const bullData = [6.5, 11.4, 19.2, 31.4, 49.8];
  const bearData = [5.8,  8.4, 11.9, 16.3, 21.9];

  if (scenarioChartInst) scenarioChartInst.destroy();
  scenarioChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        { label: 'Base Case', data: baseData, borderColor: COLORS.purple, backgroundColor: COLORS.purple + '20', fill: true, tension: 0.4, pointRadius: 5 },
        { label: 'Bull Case', data: bullData, borderColor: COLORS.teal,   backgroundColor: COLORS.teal + '14',   fill: true, tension: 0.4, pointRadius: 5, borderDash: [] },
        { label: 'Bear Case', data: bearData, borderColor: COLORS.red,    backgroundColor: COLORS.red + '10',    fill: true, tension: 0.4, pointRadius: 5, borderDash: [5,5] },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => `$${v}M` } }
      }
    }
  });
}

function buildDCFTable() {
  const wrap = document.getElementById('dcf-table-wrap');
  if (!wrap) return;

  const growthRates = [80, 100, 120, 140, 160];
  const margins = [60, 65, 70, 75, 80];

  let html = '<table class="dcf-table"><thead><tr><th>Margin \\ Growth</th>';
  growthRates.forEach(g => { html += `<th>${g}%</th>`; });
  html += '</tr></thead><tbody>';

  margins.forEach(m => {
    html += `<tr><td style="font-weight:600;color:#8B92A9">${m}% margin</td>`;
    growthRates.forEach(g => {
      const ev = (4.82 * (g / 100) * 10 * (m / 70)).toFixed(0);
      const col = ev > 80 ? 'rgba(0,212,170,0.2)' : ev > 50 ? 'rgba(124,110,250,0.15)' : 'rgba(255,91,91,0.15)';
      const textCol = ev > 80 ? '#00D4AA' : ev > 50 ? '#7C6EFA' : '#FF5B5B';
      html += `<td style="background:${col};color:${textCol};font-weight:600">$${ev}M</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  wrap.innerHTML = html;
}

/* ─── CRM ─── */
const ACCOUNTS = [
  { name: 'Stripe Inc.',         arr: '$142K', segment: 'Enterprise',  health: 'Good',    nps: 72, expansion: '$38K',  csm: 'Sarah L.' },
  { name: 'Shopify',             arr: '$118K', segment: 'Enterprise',  health: 'Good',    nps: 68, expansion: '$22K',  csm: 'James K.' },
  { name: 'Notion Labs',         arr: '$84K',  segment: 'Mid-Market',  health: 'Good',    nps: 81, expansion: '$18K',  csm: 'Priya M.' },
  { name: 'Figma',               arr: '$76K',  segment: 'Mid-Market',  health: 'Medium',  nps: 54, expansion: '$14K',  csm: 'Alex T.' },
  { name: 'Linear',              arr: '$61K',  segment: 'Mid-Market',  health: 'Good',    nps: 78, expansion: '$20K',  csm: 'Sarah L.' },
  { name: 'Retool',              arr: '$53K',  segment: 'SMB',         health: 'Medium',  nps: 49, expansion: '$8K',   csm: 'James K.' },
  { name: 'Vercel',              arr: '$48K',  segment: 'Mid-Market',  health: 'At Risk', nps: 28, expansion: '$0',    csm: 'Priya M.' },
  { name: 'Supabase',            arr: '$39K',  segment: 'SMB',         health: 'Good',    nps: 74, expansion: '$12K',  csm: 'Alex T.' },
];

function initCRM() {
  window._crmInit = true;
  renderAccountsTable(ACCOUNTS);

  document.getElementById('account-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    renderAccountsTable(ACCOUNTS.filter(a => a.name.toLowerCase().includes(q) || a.segment.toLowerCase().includes(q)));
  });

  // Deal velocity by source
  const ctx1 = document.getElementById('crmSourceChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [
          { label: 'Inbound',  data: [120,138,155,172,190,210], backgroundColor: COLORS.purple + 'BB', borderRadius: 5, stack: 's' },
          { label: 'Outbound', data: [90,102,115,128,140,155],  backgroundColor: COLORS.blue + 'BB',   borderRadius: 5, stack: 's' },
          { label: 'Partner',  data: [40,48,55,62,70,78],       backgroundColor: COLORS.teal + 'BB',   borderRadius: 5, stack: 's' },
          { label: 'PLG',      data: [15,20,24,28,32,38],       backgroundColor: COLORS.orange + 'BB', borderRadius: 5, stack: 's' },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false }, stacked: true },
          y: { stacked: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => `$${v}K` } }
        }
      }
    });
  }

  // Win/Loss by segment
  const ctx2 = document.getElementById('winLossChart');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Enterprise','Mid-Market','SMB'],
        datasets: [
          { label: 'Won',  data: [42, 35, 28], backgroundColor: COLORS.teal + 'CC', borderRadius: 5 },
          { label: 'Lost', data: [18, 22, 34], backgroundColor: COLORS.red + 'CC',  borderRadius: 5 },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' } }
        }
      }
    });
  }
}

function renderAccountsTable(accounts) {
  const tbody = document.getElementById('accounts-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  accounts.forEach(acc => {
    const hClass = acc.health === 'Good' ? 'health-good' : acc.health === 'Medium' ? 'health-medium' : 'health-at-risk';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:600">${acc.name}</td>
      <td style="color:#7C6EFA;font-weight:600">${acc.arr}</td>
      <td>${acc.segment}</td>
      <td><span class="health-badge ${hClass}">${acc.health}</span></td>
      <td>${acc.nps}</td>
      <td style="color:#00D4AA;font-weight:600">${acc.expansion}</td>
      <td style="color:#8B92A9">${acc.csm}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ─── TOAST ─── */
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

/* ─── BOOT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSparklines();
  initARRChart();
  initRevMixChart();
});
