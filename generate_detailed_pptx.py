"""
InvestorOS — Detailed Workflow & Industry Applications PowerPoint Generator
Generates a highly detailed, professional 11-slide .pptx file
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
import os

# ─── COLORS ───
BG_DARK     = RGBColor(0x0A, 0x0B, 0x0F)
BG_SURFACE  = RGBColor(0x13, 0x15, 0x1E)
BG_CARD     = RGBColor(0x1C, 0x20, 0x2B)
PURPLE      = RGBColor(0x7C, 0x6E, 0xFA)
TEAL        = RGBColor(0x00, 0xD4, 0xAA)
BLUE        = RGBColor(0x4A, 0x9E, 0xFF)
PINK        = RGBColor(0xFF, 0x6B, 0x9D)
ORANGE      = RGBColor(0xFF, 0x9F, 0x43)
RED         = RGBColor(0xFF, 0x5B, 0x5B)
GREEN       = RGBColor(0x2E, 0xCC, 0x71)
WHITE       = RGBColor(0xF0, 0xF2, 0xFF)
MUTED       = RGBColor(0x8B, 0x92, 0xA9)
DIM         = RGBColor(0x4A, 0x50, 0x68)
CARD_BORDER = RGBColor(0x2A, 0x2E, 0x3A)

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)

SLIDE_W = prs.slide_width
SLIDE_H = prs.slide_height

# ─── HELPERS ───

def set_bg(slide, color=BG_DARK):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_rect(slide, left, top, width, height, fill_color=None, border_color=None, border_width=Pt(1)):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.background()
    if fill_color:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = border_width
    else:
        shape.line.fill.background()
    return shape

def add_text(slide, left, top, width, height, text, font_size=14, color=WHITE, bold=False, align=PP_ALIGN.LEFT, font_name='Calibri'):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = align
    return txBox

def add_bullet_list(slide, left, top, width, height, items, font_size=13, color=MUTED, bold_color=WHITE):
    """items: list of (bullet_color, text_parts) where text_parts = [(text, is_bold), ...]"""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, (bullet_color, text_parts) in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.space_after = Pt(8)
        p.line_spacing = Pt(18)
        
        # Bullet marker
        run = p.add_run()
        run.text = "●  "
        run.font.size = Pt(9)
        run.font.color.rgb = bullet_color
        run.font.name = 'Calibri'
        
        # Text parts
        for (txt, is_bold) in text_parts:
            run = p.add_run()
            run.text = txt
            run.font.size = Pt(font_size)
            run.font.color.rgb = bold_color if is_bold else color
            run.font.bold = is_bold
            run.font.name = 'Calibri'
    return txBox

def add_pill(slide, left, top, text, bg_color, text_color, width=None):
    w = width or Inches(1.6)
    h = Inches(0.35)
    shape = add_rect(slide, left, top, w, h, fill_color=bg_color, border_color=text_color, border_width=Pt(0.75))
    shape.text_frame.word_wrap = False
    p = shape.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run = p.add_run()
    run.text = text
    run.font.size = Pt(9)
    run.font.color.rgb = text_color
    run.font.bold = True
    run.font.name = 'Calibri'
    return shape

def add_details_card(slide, left, top, width, height, icon, title, bullets):
    """Draws a card containing a header and bullet items"""
    card = add_rect(slide, left, top, width, height, fill_color=BG_CARD, border_color=CARD_BORDER)
    
    # Header
    add_text(slide, left + Inches(0.2), top + Inches(0.15), Inches(0.5), Inches(0.4), icon, font_size=20)
    add_text(slide, left + Inches(0.7), top + Inches(0.18), width - Inches(0.9), Inches(0.4), title, font_size=14, color=WHITE, bold=True)
    
    # Divider line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left + Inches(0.2), top + Inches(0.65), width - Inches(0.4), Pt(1))
    div.fill.solid()
    div.fill.fore_color.rgb = CARD_BORDER
    div.line.fill.background()
    
    # Bullet points
    add_bullet_list(slide, left + Inches(0.2), top + Inches(0.8), width - Inches(0.4), height - Inches(0.9), bullets, font_size=11)
    return card

def slide_number_tag(slide, num, total=11):
    add_text(slide, Inches(0.5), Inches(0.25), Inches(2), Inches(0.3),
             f"SLIDE {num:02d} / {total}", font_size=8, color=DIM, bold=True)
    add_text(slide, SLIDE_W - Inches(3.5), Inches(0.25), Inches(3), Inches(0.3),
             "InvestorOS  ·  Workflow & Industry Deep Dive", font_size=10, color=PURPLE, bold=True, align=PP_ALIGN.RIGHT)


# ═══════════════════════════════════════════════
#   SLIDE 1 — TITLE (RE-DESIGNED)
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)

# Title Logo
logo_box = add_rect(slide, Inches(5.9), Inches(1.6), Inches(1.5), Inches(1.5), fill_color=PURPLE)
add_text(slide, Inches(5.9), Inches(1.8), Inches(1.5), Inches(1.2), "📈", font_size=44, align=PP_ALIGN.CENTER)

# Titles
add_text(slide, Inches(1.5), Inches(3.4), Inches(10.3), Inches(0.9),
         "InvestorOS Architecture & Industry Impact", font_size=44, color=WHITE, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, Inches(1.5), Inches(4.3), Inches(10.3), Inches(0.8),
         "A Technical Deep Dive into Growth Metrics Ingestion, AI Synthesis,\nand Enterprise Industry Use Cases",
         font_size=16, color=MUTED, align=PP_ALIGN.CENTER)

# Footer Info
add_text(slide, Inches(1.5), Inches(6.0), Inches(10.3), Inches(0.5),
         "SYSTEM WORKFLOW  ·  DATA PIPELINES  ·  COMMERCIAL VALUE MODELING",
         font_size=11, color=PURPLE, bold=True, align=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════
#   SLIDE 2 — THE INDUSTRY CONTEXT
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 2)

add_text(slide, Inches(0.8), Inches(0.9), Inches(10), Inches(0.7),
         "The Broken Investor Relations Loop", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(11.5), Inches(0.5),
         "Growth companies leak institutional value because of manual reporting friction and non-standard data modeling.",
         font_size=14, color=MUTED)

# 2 Columns: The Friction vs The Solution Core
col_w = Inches(5.5)
col_h = Inches(4.2)

# Column 1: The Status Quo (Red highlights)
add_rect(slide, Inches(0.8), Inches(2.4), col_w, col_h, fill_color=BG_CARD, border_color=CARD_BORDER)
add_text(slide, Inches(1.1), Inches(2.6), col_w - Inches(0.6), Inches(0.4), "The Current Friction", font_size=16, color=RED, bold=True)
friction_bullets = [
    (RED, [("20+ Hours Wasted:", True), (" Finance team manually aggregates files from QuickBooks, Salesforce, and Stripe every month.", False)]),
    (RED, [("Formulas Drift & Errors:", True), (" Custom sheets suffer from broken formulas, non-standard ARR/MRR bridges, and bad cohort calculations.", False)]),
    (RED, [("Fundraising Lag:", True), (" Setting up VDRs, updating cap tables, and performing valuation analysis takes weeks, causing deal momentum loss.", False)]),
]
add_bullet_list(slide, Inches(1.1), Inches(3.2), col_w - Inches(0.6), Inches(3.2), friction_bullets, font_size=11)

# Column 2: The InvestorOS Target (Teal/Green highlights)
add_rect(slide, Inches(7.0), Inches(2.4), col_w, col_h, fill_color=BG_CARD, border_color=CARD_BORDER)
add_text(slide, Inches(7.3), Inches(2.6), col_w - Inches(0.6), Inches(0.4), "The Automated Target State", font_size=16, color=TEAL, bold=True)
target_bullets = [
    (TEAL, [("Real-Time Data Ingestion:", True), (" Read API connections to live billing and pipeline endpoints, eliminating copy-paste work.", False)]),
    (TEAL, [("Standardized Calculation:", True), (" Institutional-grade mathematical libraries compute cohort matrices and LTV/CAC correctly.", False)]),
    (TEAL, [("On-Demand Readiness:", True), (" Always-open virtual data rooms (VDR) and interactive AI chatbots remove round friction completely.", False)]),
]
add_bullet_list(slide, Inches(7.3), Inches(3.2), col_w - Inches(0.6), Inches(3.2), target_bullets, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 3 — SYSTEM WORKFLOW: DATA INGESTION
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 3)

add_text(slide, Inches(0.8), Inches(0.9), Inches(10), Inches(0.7),
         "Workflow Step 1 & 2: Ingestion & ETL", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(11.5), Inches(0.5),
         "How raw transactional events are extracted, cleaned, and unified into an investor-grade reporting layer.",
         font_size=14, color=MUTED)

# 3 Horizontal blocks explaining data flow
block_w = Inches(3.6)
block_h = Inches(4.3)
start_x = Inches(0.8)
block_gap = Inches(0.4)

block_data = [
    ("1. API Extraction", "🔗 Ingestion Layer", [
        (PURPLE, [("Multi-Source Pull:", True), (" Queries live endpoints from Stripe (recurring bills), Salesforce (sales pipeline), and QuickBooks (OpEx).", False)]),
        (MUTED, [("Raw Event Logging:", True), (" Raw JSON transactions, refunds, new signups, and customer churn events are captured in real-time.", False)]),
    ]),
    ("2. ETL & Normalization", "⚙️ Processing Layer", [
        (BLUE, [("Deduplication:", True), (" Resolves multi-entry client entities across systems into a single customer ID map.", False)]),
        (MUTED, [("Event Serialization:", True), (" Transforms unstructured ledger items into clean time-series delta events (expansion, churn, contract).", False)]),
    ]),
    ("3. Unified Ingestion Schema", "🎯 Standardized Output", [
        (TEAL, [("Golden Record:", True), (" Standardizes database rows into: Customer ID, Event Date, Net Delta ARR, Lifecycle Stage, Segment.", False)]),
        (MUTED, [("Audit Ready Log:", True), (" Stores records in a read-only historical ledger that matches banking deposits exactly.", False)]),
    ]),
]

for i, (heading, subtitle, bullets) in enumerate(block_data):
    x = start_x + i * (block_w + block_gap)
    card = add_rect(slide, x, Inches(2.3), block_w, block_h, fill_color=BG_CARD, border_color=CARD_BORDER)
    add_text(slide, x + Inches(0.2), Inches(2.5), block_w - Inches(0.4), Inches(0.4), heading, font_size=15, color=WHITE, bold=True)
    add_text(slide, x + Inches(0.2), Inches(2.9), block_w - Inches(0.4), Inches(0.3), subtitle, font_size=11, color=PURPLE, bold=True)
    
    # Divider line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(0.2), Inches(3.25), block_w - Inches(0.4), Pt(1))
    div.fill.solid()
    div.fill.fore_color.rgb = CARD_BORDER
    div.line.fill.background()
    
    add_bullet_list(slide, x + Inches(0.2), Inches(3.4), block_w - Inches(0.4), block_h - Inches(1.3), bullets, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 4 — SYSTEM WORKFLOW: METRICS ENGINE
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 4)

add_text(slide, Inches(0.8), Inches(0.9), Inches(10), Inches(0.7),
         "Workflow Step 3: Core Calculations & Analytics", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(11.5), Inches(0.5),
         "The standardized schema feeds mathematical engines to calculate key metrics dynamically.",
         font_size=14, color=MUTED)

# 2 Columns: Mathematical Modules
col_w = Inches(5.5)
col_h = Inches(4.3)

# Col 1: ARR/MRR & Cohort Retention
add_rect(slide, Inches(0.8), Inches(2.3), col_w, col_h, fill_color=BG_CARD, border_color=CARD_BORDER)
add_text(slide, Inches(1.1), Inches(2.5), col_w - Inches(0.6), Inches(0.4), "MRR Bridges & Cohort Engines", font_size=16, color=WHITE, bold=True)
engine_bullets_1 = [
    (PURPLE, [("Waterfall Model Engine:", True), (" Segregates delta monthly recurring revenue (MRR) into: New, Expansion, Contraction, and Churn.", False)]),
    (MUTED, [("SaaS Cohort Heatmaps:", True), (" Calculates monthly cohort cohorts (e.g. M0 to M12 retention). Flags anomalies when cohorts drop below 90%.", False)]),
    (MUTED, [("Net Dollar Retention (NDR):", True), (" Evaluates: (Beginning ARR + Expansion - Churn - Contraction) / Beginning ARR. Standardized mathematically.", False)]),
]
add_bullet_list(slide, Inches(1.1), Inches(3.1), col_w - Inches(0.6), Inches(3.2), engine_bullets_1, font_size=11)

# Col 2: Unit Economics & DCF Calculator
add_rect(slide, Inches(7.0), Inches(2.3), col_w, col_h, fill_color=BG_CARD, border_color=CARD_BORDER)
add_text(slide, Inches(7.3), Inches(2.5), col_w - Inches(0.6), Inches(0.4), "Unit Economics & Financial Projections", font_size=16, color=WHITE, bold=True)
engine_bullets_2 = [
    (TEAL, [("LTV/CAC Calculator:", True), (" Merges average customer spend, gross margins, and churn coefficients to compute True Customer Lifetime Value.", False)]),
    (MUTED, [("Sales Pipeline Velocity:", True), (" Tracks: (Active Opps x Avg Win Rate x Avg Deal Size) / Days in Cycle. Projects incoming ARR.", False)]),
    (MUTED, [("Dynamic Scenario Engine:", True), (" Models bull/base/bear cash flows. Applies weighted growth rates and margin inputs to run instant 5-year forecasts.", False)]),
]
add_bullet_list(slide, Inches(7.3), Inches(3.1), col_w - Inches(0.6), Inches(3.2), engine_bullets_2, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 5 — SYSTEM WORKFLOW: AI SYNTHESIS
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 5)

add_text(slide, Inches(0.8), Inches(0.9), Inches(10), Inches(0.7),
         "Workflow Step 4 & 5: AI Synthesis & RAG", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(11.5), Inches(0.5),
         "Generating written commentary and context-aware investor Q&A from live dashboard metrics.",
         font_size=14, color=MUTED)

# 2 Columns
col_w = Inches(5.5)
col_h = Inches(4.3)

# Col 1: Update Generation
add_rect(slide, Inches(0.8), Inches(2.3), col_w, col_h, fill_color=BG_CARD, border_color=CARD_BORDER)
add_text(slide, Inches(1.1), Inches(2.5), col_w - Inches(0.6), Inches(0.4), "Automated Update Generation", font_size=16, color=WHITE, bold=True)
gen_bullets = [
    (PURPLE, [("Auto-Composer:", True), (" Scans metrics database and structures highlights. Auto-writes bullet lists (e.g. ARR growth, logo counts).", False)]),
    (MUTED, [("Narrative Synthesis:", True), (" Translates pure metrics into professional paragraphs, matching the founder/CFO's communication style.", False)]),
    (MUTED, [("Quarterly Board memos:", True), (" Compiles standard templates including EBITDA bridges, net expansion, and next actions automatically.", False)]),
]
add_bullet_list(slide, Inches(1.1), Inches(3.1), col_w - Inches(0.6), Inches(3.2), gen_bullets, font_size=11)

# Col 2: Chatbot RAG Pipeline
add_rect(slide, Inches(7.0), Inches(2.3), col_w, col_h, fill_color=BG_CARD, border_color=CARD_BORDER)
add_text(slide, Inches(7.3), Inches(2.5), col_w - Inches(0.6), Inches(0.4), "RAG (Retrieval-Augmented Generation)", font_size=16, color=WHITE, bold=True)
rag_bullets = [
    (TEAL, [("Knowledge Vector Database:", True), (" Encodes financial facts, compliance docs, and GTM plans into searchable vector embeddings.", False)]),
    (MUTED, [("Context-Aware Retrieval:", True), (" When an investor queries the bot, it retrieves matching quantitative metrics from the database.", False)]),
    (MUTED, [("Structured Formatting:", True), (" Returns precise textual answers accompanied by targeted metric pills (e.g., LTV:CAC, churn %).", False)]),
]
add_bullet_list(slide, Inches(7.3), Inches(3.1), col_w - Inches(0.6), Inches(3.2), rag_bullets, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 6 — INDUSTRY USE: VC STARTUPS
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 6)

add_text(slide, Inches(0.8), Inches(0.9), Inches(10), Inches(0.7),
         "Industry Use: VC-Backed Startups (Series A/B)", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(11.5), Inches(0.5),
         "How high-growth founders prepare data rooms, run scenario planning, and raise capital efficiently.",
         font_size=14, color=MUTED)

# 3 Column features
card_w = Inches(3.6)
card_h = Inches(4.3)
card_gap = Inches(0.4)
start_x = Inches(0.8)

startup_data = [
    ("⚡ Accelerating Time to Term Sheet", Inches(2.3), [
        (PURPLE, [("Always-Open Data Room:", True), (" Auto-maintains financials, metrics, and contracts so due diligence begins immediately.", False)]),
        (MUTED, [("Round Progress Tracking:", True), (" Tracks soft commitments, discussions, and remaining round targets in real-time.", False)]),
    ]),
    ("📊 Dynamic Capital Allocation", Inches(2.3), [
        (BLUE, [("Opex & Headcount Sliders:", True), (" Lets founders simulate how new capital affects runway, burn, and growth velocity.", False)]),
        (MUTED, [("Rule of 40 Optimization:", True), (" Monitors balance between growth and cash burn to maximize pre-money valuation.", False)]),
    ]),
    ("✉️ Auto-Reporting Cadence", Inches(2.3), [
        (TEAL, [("Institutional Trust:", True), (" Sending professional reports by the 5th of each month increases transparency.", False)]),
        (MUTED, [("Investor Sentiment Logs:", True), (" Keeps a record of investor file access and query patterns to gauge round momentum.", False)]),
    ]),
]

for i, (title, y, bullets) in enumerate(startup_data):
    x = start_x + i * (card_w + card_gap)
    card = add_rect(slide, x, y, card_w, card_h, fill_color=BG_CARD, border_color=CARD_BORDER)
    add_text(slide, x + Inches(0.2), y + Inches(0.3), card_w - Inches(0.4), Inches(0.7), title, font_size=14, color=WHITE, bold=True)
    
    # Divider line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(0.2), y + Inches(1.05), card_w - Inches(0.4), Pt(1))
    div.fill.solid()
    div.fill.fore_color.rgb = CARD_BORDER
    div.line.fill.background()
    
    add_bullet_list(slide, x + Inches(0.2), y + Inches(1.2), card_w - Inches(0.4), card_h - Inches(1.4), bullets, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 7 — INDUSTRY USE: PRIVATE EQUITY
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 7)

add_text(slide, Inches(0.8), Inches(0.9), Inches(10), Inches(0.7),
         "Industry Use: Private Equity Portfolio Rollups", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(11.5), Inches(0.5),
         "PE firms leverage unified growth systems to standardize reporting across dozens of acquisition assets.",
         font_size=14, color=MUTED)

# 3 Column features
pe_data = [
    ("🏢 Portfolio Standardization", Inches(2.3), [
        (PURPLE, [("Cross-Asset Analytics:", True), (" Operating partners look at a single dashboard instead of parsing varying Excel models.", False)]),
        (MUTED, [("Uniform SaaS GAAP Metrics:", True), (" Enforces exact calculation metrics (e.g. churn vs contraction) across different firms.", False)]),
    ]),
    ("📈 Valuation Rollup Support", Inches(2.3), [
        (BLUE, [("Comparable Exit Models:", True), (" Consolidates EBITDA and ARR multiples across the portfolio to model rollup exit returns.", False)]),
        (MUTED, [("DCF Sensitivity Engine:", True), (" Stresstests discount rates and margin improvements across multi-asset rollups.", False)]),
    ]),
    ("📊 Performance Benchmarking", Inches(2.3), [
        (TEAL, [("Internal League Tables:", True), (" Ranks portfolio companies based on metrics like LTV:CAC, Magic Number, and Rule of 40.", False)]),
        (MUTED, [("Anomaly Risk Flags:", True), (" Automatically flags assets experiencing declining cohort retention or slowing win rates.", False)]),
    ]),
]

for i, (title, y, bullets) in enumerate(pe_data):
    x = start_x + i * (card_w + card_gap)
    card = add_rect(slide, x, y, card_w, card_h, fill_color=BG_CARD, border_color=CARD_BORDER)
    add_text(slide, x + Inches(0.2), y + Inches(0.3), card_w - Inches(0.4), Inches(0.7), title, font_size=14, color=WHITE, bold=True)
    
    # Divider line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(0.2), y + Inches(1.05), card_w - Inches(0.4), Pt(1))
    div.fill.solid()
    div.fill.fore_color.rgb = CARD_BORDER
    div.line.fill.background()
    
    add_bullet_list(slide, x + Inches(0.2), y + Inches(1.2), card_w - Inches(0.4), card_h - Inches(1.4), bullets, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 8 — INDUSTRY USE: CFO / ADVISORS
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 8)

add_text(slide, Inches(0.8), Inches(0.9), Inches(10), Inches(0.7),
         "Industry Use: Fractional CFOs & Consulting Firms", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(11.5), Inches(0.5),
         "Fractional CFO firms utilize automated reporting layers to serve 10x more clients with higher margins.",
         font_size=14, color=MUTED)

# 3 Column features
cfo_data = [
    ("⚙️ Scalable Advisory Ops", Inches(2.3), [
        (PURPLE, [("CFO Operating Leverage:", True), (" Automates basic chart building so advisors spend client meetings on high-value strategy.", False)]),
        (MUTED, [("Multi-Tenant Control:", True), (" Enables switching between multiple client company profiles via one platform dashboard.", False)]),
    ]),
    ("📑 Automated Board Deliverables", Inches(2.3), [
        (BLUE, [("Push-Button Memos:", True), (" Generates complete draft board letters, needing only minimal CFO polish before publication.", False)]),
        (MUTED, [("Institutional Branding:", True), (" Auto-formats presentations and pitch materials to institutional VC/PE standards.", False)]),
    ]),
    ("🤝 Client Pitch Support", Inches(2.3), [
        (TEAL, [("Data Room Creation:", True), (" Organizes financials, contracts, and GTM metrics, preparing clients for exit events.", False)]),
        (MUTED, [("Scenario Modeling Workshops:", True), (" CFO runs interactive projections live with founders using growth and margin sliders.", False)]),
    ]),
]

for i, (title, y, bullets) in enumerate(cfo_data):
    x = start_x + i * (card_w + card_gap)
    card = add_rect(slide, x, y, card_w, card_h, fill_color=BG_CARD, border_color=CARD_BORDER)
    add_text(slide, x + Inches(0.2), y + Inches(0.3), card_w - Inches(0.4), Inches(0.7), title, font_size=14, color=WHITE, bold=True)
    
    # Divider line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(0.2), y + Inches(1.05), card_w - Inches(0.4), Pt(1))
    div.fill.solid()
    div.fill.fore_color.rgb = CARD_BORDER
    div.line.fill.background()
    
    add_bullet_list(slide, x + Inches(0.2), y + Inches(1.2), card_w - Inches(0.4), card_h - Inches(1.4), bullets, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 9 — ROI & INDUSTRY IMPACT
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 9)

add_text(slide, Inches(0.5), Inches(0.9), Inches(12.3), Inches(0.7),
         "Measurable Industry ROI & Business Impact", font_size=36, color=PURPLE, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, Inches(1.5), Inches(1.6), Inches(10.3), Inches(0.5),
         "How automation translates directly to time savings, cost reduction, and capital efficiency.",
         font_size=14, color=MUTED, align=PP_ALIGN.CENTER)

# 3 Big Metrics
metric_w = Inches(3.6)
metric_h = Inches(3.8)
metric_gap = Inches(0.4)
metric_start = Inches(0.8)

metrics = [
    ("80% Time Reduction", "In Board Deck & Update Prep", [
        (PURPLE, [("Manual to Automated:", True), (" Shrugs monthly reporting cycle down from 20+ hours of data gathering to 5-10 minutes.", False)]),
        (MUTED, [("Lower Finance OPEX:", True), (" Startups avoid hiring additional accounting analysts purely for data manipulation.", False)]),
    ], PURPLE),
    ("Zero Calculation Error", "Standardized Financial Logic", [
        (TEAL, [("Eliminating Formula Risks:", True), (" Retains calculation rules in secure codebase, replacing human-built spreadsheets.", False)]),
        (MUTED, [("Audit Ready Trail:", True), (" Transactions map 1:1 to billing ledger, eliminating reconciliation disputes.", False)]),
    ], TEAL),
    ("Accelerated Funding", "Due Diligence Momentum", [
        (BLUE, [("Weeks to Days:", True), (" Data rooms are kept 80%+ complete at all times. Decreases investor diligence wait times.", False)]),
        (MUTED, [("Institutional Image:", True), (" Polished presentations and smart AI chatbots reflect strong operational maturity.", False)]),
    ], BLUE),
]

for i, (value, sub, bullets, val_col) in enumerate(metrics):
    x = metric_start + i * (metric_w + metric_gap)
    y = Inches(2.4)
    card = add_rect(slide, x, y, metric_w, metric_h, fill_color=BG_CARD, border_color=CARD_BORDER)
    add_text(slide, x, y + Inches(0.3), metric_w, Inches(0.5), value, font_size=24, color=val_col, bold=True, align=PP_ALIGN.CENTER)
    add_text(slide, x, y + Inches(0.85), metric_w, Inches(0.35), sub, font_size=11, color=WHITE, bold=True, align=PP_ALIGN.CENTER)
    
    # Divider line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(0.2), y + Inches(1.3), metric_w - Inches(0.4), Pt(1))
    div.fill.solid()
    div.fill.fore_color.rgb = CARD_BORDER
    div.line.fill.background()
    
    add_bullet_list(slide, x + Inches(0.2), y + Inches(1.45), metric_w - Inches(0.4), metric_h - Inches(1.5), bullets, font_size=10.5)


# ═══════════════════════════════════════════════
#   SLIDE 10 — TECHNICAL SECURITY & ARCHITECTURE
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 10)

add_text(slide, Inches(0.8), Inches(0.9), Inches(10), Inches(0.7),
         "Enterprise Architecture & Compliance Posture", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(11.5), Inches(0.5),
         "Ensuring institutional-grade data privacy, API security, and reliability for financial pipelines.",
         font_size=14, color=MUTED)

# 2 Columns: Architecture vs Security
col_w = Inches(5.5)
col_h = Inches(4.3)

# Column 1: Tech Stack & Architecture
add_rect(slide, Inches(0.8), Inches(2.3), col_w, col_h, fill_color=BG_CARD, border_color=CARD_BORDER)
add_text(slide, Inches(1.1), Inches(2.5), col_w - Inches(0.6), Inches(0.4), "Modern Stack Architecture", font_size=16, color=WHITE, bold=True)
arch_bullets = [
    (PURPLE, [("Decoupled Frontend/Backend:", True), (" Responsive frontend built on HTML5/CSS3/Vanilla JS connects to a high-throughput metrics engine.", False)]),
    (MUTED, [("High-Performance Analytics:", True), (" Utilizes Chart.js for canvas rendering, offering zero latency on dynamic zoom and dashboard metrics.", False)]),
    (MUTED, [("Vector Embeddings & NLP:", True), (" Chatbot is powered by lightweight client-side lexical maps and context retrieval rules.", False)]),
]
add_bullet_list(slide, Inches(1.1), Inches(3.1), col_w - Inches(0.6), Inches(3.2), arch_bullets, font_size=11)

# Column 2: Security & Governance
add_rect(slide, Inches(7.0), Inches(2.3), col_w, col_h, fill_color=BG_CARD, border_color=CARD_BORDER)
add_text(slide, Inches(7.3), Inches(2.5), col_w - Inches(0.6), Inches(0.4), "Security & Compliance Governance", font_size=16, color=WHITE, bold=True)
sec_bullets = [
    (TEAL, [("SOC 2 Type II Alignment:", True), (" Employs strict logical database separation to isolate company transactional datasets.", False)]),
    (MUTED, [("Secure API Interfacing:", True), (" Utilizes OAuth 2.0 authorization codes and API key rotation protocols for Stripe and Salesforce connection.", False)]),
    (MUTED, [("Restricted Access Control:", True), (" Configured with role-based dashboard access, granting custom rights to founders, CFOs, and prospective investors.", False)]),
]
add_bullet_list(slide, Inches(7.3), Inches(3.1), col_w - Inches(0.6), Inches(3.2), sec_bullets, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 11 — SUMMARY & Q&A
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)

add_text(slide, Inches(2.5), Inches(1.0), Inches(8.3), Inches(0.8),
         "🎯", font_size=48, align=PP_ALIGN.CENTER)
add_text(slide, Inches(2.5), Inches(1.9), Inches(8.3), Inches(0.8),
         "Summary & Discussion", font_size=48, color=PURPLE, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, Inches(1.5), Inches(2.9), Inches(10.3), Inches(1.0),
         "InvestorOS replaces manual spreadsheet-based reporting with a unified, live, AI-powered growth office.\nWe reduce preparation loops, eliminate math logic drift, and build operational trust with investors.",
         font_size=14, color=MUTED, align=PP_ALIGN.CENTER)

# Pills
pills_data = [
    ("📊 Data Ingestion Pipeline", RGBColor(0x1E, 0x18, 0x3A), PURPLE),
    ("🧮 Standarized SaaS Math", RGBColor(0x0E, 0x2E, 0x24), TEAL),
    ("🤖 AI RAG Chatbot Integration", RGBColor(0x12, 0x24, 0x3A), BLUE),
    ("💼 Institutional Readiness", RGBColor(0x3A, 0x28, 0x10), ORANGE),
]

pill_y = Inches(4.3)
pill_w = Inches(2.7)
total_pills_w = 4 * pill_w.inches + 3 * 0.2
pill_start = Inches((13.333 - total_pills_w) / 2)
for i, (txt, bg, tc) in enumerate(pills_data):
    x = Emu(pill_start + Inches(i * (pill_w.inches + 0.2)))
    add_pill(slide, x, pill_y, txt, bg, tc, pill_w)

# Q&A line
add_text(slide, Inches(3), Inches(5.4), Inches(7.3), Inches(0.5),
         "💡 Questions? Let's discuss the workflow or business impact.      📁 Live demo open",
         font_size=12, color=DIM, align=PP_ALIGN.CENTER)

# Branding footer
add_text(slide, Inches(4.5), Inches(6.2), Inches(4.3), Inches(0.5),
         "InvestorOS  ·  Corporate & Venture Operations  ·  Q2 2026",
         font_size=10, color=DIM, align=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════
#   SAVE
# ═══════════════════════════════════════════════
output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "InvestorOS_Detailed_Presentation.pptx")
prs.save(output_path)
print(f"Presentation saved to: {output_path}")
