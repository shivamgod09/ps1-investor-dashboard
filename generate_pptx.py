"""
InvestorOS — PowerPoint Presentation Generator
Generates a professional 10-slide .pptx file
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
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


def add_rect(slide, left, top, width, height, fill_color=None, border_color=None, border_width=Pt(1), radius=None):
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


def add_rich_text(slide, left, top, width, height, runs, font_size=14, align=PP_ALIGN.LEFT, line_spacing=1.4):
    """runs is list of tuples: (text, color, bold, font_size_override)"""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    if line_spacing:
        p.line_spacing = Pt(int(font_size * line_spacing))
    for i, (text, color, bold, fs_override) in enumerate(runs):
        if i == 0:
            run = p.runs[0] if p.runs else p.add_run()
            run.text = text
        else:
            run = p.add_run()
            run.text = text
        run.font.size = Pt(fs_override or font_size)
        run.font.color.rgb = color
        run.font.bold = bold
        run.font.name = 'Calibri'
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
        p.line_spacing = Pt(20)
        # Bullet marker
        run = p.add_run()
        run.text = "●  "
        run.font.size = Pt(8)
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
    shape.text_frame.margin_top = Pt(2)
    shape.text_frame.margin_bottom = Pt(2)
    return shape


def add_feature_card(slide, left, top, width, height, icon, title, desc):
    card = add_rect(slide, left, top, width, height, fill_color=BG_CARD, border_color=CARD_BORDER)
    add_text(slide, left + Inches(0.25), top + Inches(0.2), Inches(1), Inches(0.5), icon, font_size=28, align=PP_ALIGN.LEFT)
    add_text(slide, left + Inches(0.25), top + Inches(0.65), width - Inches(0.5), Inches(0.35), title, font_size=14, color=WHITE, bold=True)
    add_text(slide, left + Inches(0.25), top + Inches(1.0), width - Inches(0.5), height - Inches(1.2), desc, font_size=10, color=MUTED)
    return card


def add_kpi_card(slide, left, top, width, height, value, label, sublabel, value_color=PURPLE):
    card = add_rect(slide, left, top, width, height, fill_color=BG_CARD, border_color=CARD_BORDER)
    add_text(slide, left, top + Inches(0.25), width, Inches(0.6), value, font_size=32, color=value_color, bold=True, align=PP_ALIGN.CENTER, font_name='Calibri')
    add_text(slide, left, top + Inches(0.85), width, Inches(0.3), label, font_size=12, color=WHITE, bold=True, align=PP_ALIGN.CENTER)
    add_text(slide, left, top + Inches(1.15), width, Inches(0.25), sublabel, font_size=9, color=MUTED, align=PP_ALIGN.CENTER)
    return card


def slide_number_tag(slide, num, total=10):
    add_text(slide, Inches(0.5), Inches(0.25), Inches(2), Inches(0.3),
             f"SLIDE {num:02d} / {total}", font_size=8, color=DIM, bold=True)
    add_text(slide, SLIDE_W - Inches(2), Inches(0.25), Inches(1.5), Inches(0.3),
             "InvestorOS", font_size=11, color=PURPLE, bold=True, align=PP_ALIGN.RIGHT)


# ═══════════════════════════════════════════════
#   SLIDE 1 — TITLE
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
set_bg(slide)

# Accent glow circle
glow = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(5.4), Inches(1.2), Inches(2.5), Inches(2.5))
glow.fill.solid()
glow.fill.fore_color.rgb = RGBColor(0x7C, 0x6E, 0xFA)
glow.fill.fore_color.brightness = 0.0
glow.line.fill.background()
# Make it semi-transparent via setting alpha isn't directly supported, so we overlay

# Logo box
logo_box = add_rect(slide, Inches(5.9), Inches(1.6), Inches(1.5), Inches(1.5), fill_color=PURPLE)
add_text(slide, Inches(5.9), Inches(1.8), Inches(1.5), Inches(1.2), "📈", font_size=44, align=PP_ALIGN.CENTER)

# Title
add_text(slide, Inches(2.5), Inches(3.4), Inches(8.3), Inches(0.9),
         "InvestorOS", font_size=52, color=PURPLE, bold=True, align=PP_ALIGN.CENTER, font_name='Calibri')

# Subtitle
add_text(slide, Inches(2), Inches(4.3), Inches(9.3), Inches(0.8),
         "Investor & Growth Office: Fundraising Ops,\nGrowth Metrics & Investor Reporting Automation",
         font_size=18, color=MUTED, align=PP_ALIGN.CENTER)

# Meta pills
add_pill(slide, Inches(3.5), Inches(5.5), "📋  Project 4", BG_CARD, DIM, Inches(1.5))
add_pill(slide, Inches(5.3), Inches(5.5), "👤  Growth Office", BG_CARD, DIM, Inches(1.8))
add_pill(slide, Inches(7.4), Inches(5.5), "📅  Q2 2026", BG_CARD, DIM, Inches(1.5))


# ═══════════════════════════════════════════════
#   SLIDE 2 — THE PROBLEM
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 2)

add_text(slide, Inches(0.8), Inches(0.9), Inches(8), Inches(0.7),
         "The Problem", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(10), Inches(0.5),
         "Investor relations at growth-stage companies is fragmented, manual, and error-prone.",
         font_size=14, color=MUTED)

card_w = Inches(3.7)
card_h = Inches(3.3)
card_y = Inches(2.5)
gap = Inches(0.35)
start_x = Inches(0.8)

cards = [
    ("📊", "Scattered Data",
     "Revenue metrics live across CRM, finance tools, and spreadsheets. There's no single source of truth for board reporting. Teams waste hours reconciling data from Stripe, Salesforce, and QuickBooks."),
    ("⏳", "Manual Reporting",
     "Finance teams spend 20+ hours per month manually preparing investor updates, board decks, and quarterly letters. This is time taken away from actually growing the business."),
    ("🔮", "No Scenario Modelling",
     "Fundraising readiness is guesswork. No repeatable DCF models, valuation frameworks, or scenario analysis tools. Companies scramble every time they need to raise."),
]

for i, (icon, title, desc) in enumerate(cards):
    x = start_x + i * (card_w + gap)
    add_feature_card(slide, x, card_y, card_w, card_h, icon, title, desc)


# ═══════════════════════════════════════════════
#   SLIDE 3 — OUR SOLUTION
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 3)

add_text(slide, Inches(0.8), Inches(0.9), Inches(8), Inches(0.7),
         "Our Solution", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(10), Inches(0.5),
         "A unified, investor-grade platform that automates growth metrics, board reporting, and fundraising operations.",
         font_size=14, color=MUTED)

solutions = [
    ("📈", "Real-Time Growth Dashboard",
     "ARR, NDR, LTV/CAC, pipeline velocity, cohort analysis — all live, all in one view. No more spreadsheets. Executive-grade visualizations updated in real-time."),
    ("🤖", "AI-Powered Reporting",
     "Auto-generate investor updates, board memos, and pitch decks from live data. AI chatbot answers any investor query instantly with data-backed responses."),
    ("💰", "Fundraise Readiness Suite",
     "Valuation models (DCF + comparables), data room tracker, raise CRM, and scenario planning — everything to go from thinking about raising to closing the round."),
]

for i, (icon, title, desc) in enumerate(solutions):
    x = start_x + i * (card_w + gap)
    add_feature_card(slide, x, card_y, card_w, card_h, icon, title, desc)


# ═══════════════════════════════════════════════
#   SLIDE 4 — WORKFLOW
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 4)

add_text(slide, Inches(0.8), Inches(0.9), Inches(11.5), Inches(0.7),
         "System Workflow", font_size=36, color=PURPLE, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, Inches(1.5), Inches(1.6), Inches(10), Inches(0.5),
         "End-to-end data flow from source systems to investor-grade outputs",
         font_size=14, color=MUTED, align=PP_ALIGN.CENTER)

# Workflow steps
steps = [
    ("🔗", "Data Sources", "CRM · Finance · Billing", RGBColor(0x25, 0x1E, 0x42)),
    ("⚙️", "ETL Engine", "Clean · Transform · Unify", RGBColor(0x16, 0x2A, 0x42)),
    ("📊", "Metrics Layer", "ARR · NDR · LTV · Cohorts", RGBColor(0x0E, 0x33, 0x2A)),
    ("🤖", "AI Engine", "Reports · Chatbot · Alerts", RGBColor(0x3A, 0x28, 0x10)),
    ("📤", "Investor Output", "Decks · Updates · Data Room", RGBColor(0x3A, 0x18, 0x28)),
]

step_w = Inches(1.9)
step_h = Inches(2.6)
step_y = Inches(2.6)
total_steps_w = 5 * step_w.inches + 4 * 0.5
start_sx = Inches((13.333 - total_steps_w) / 2)

for i, (icon, label, sub, bg_col) in enumerate(steps):
    x = Emu(start_sx + Inches(i * (step_w.inches + 0.5)))
    # Card
    card = add_rect(slide, x, step_y, step_w, step_h, fill_color=bg_col, border_color=CARD_BORDER)
    # Icon
    add_text(slide, x, step_y + Inches(0.3), step_w, Inches(0.6), icon, font_size=32, align=PP_ALIGN.CENTER)
    # Label
    add_text(slide, x, step_y + Inches(1.1), step_w, Inches(0.35), label, font_size=13, color=WHITE, bold=True, align=PP_ALIGN.CENTER)
    # Sub
    add_text(slide, x, step_y + Inches(1.5), step_w, Inches(0.35), sub, font_size=9, color=MUTED, align=PP_ALIGN.CENTER)
    # Arrow (except last)
    if i < 4:
        arrow_x = Emu(x + step_w + Inches(0.08))
        add_text(slide, arrow_x, step_y + Inches(0.8), Inches(0.35), Inches(0.5), "→", font_size=22, color=DIM, align=PP_ALIGN.CENTER)

# Bottom pills
add_pill(slide, Inches(2.5), Inches(5.8), "⏱  Minutes not days", RGBColor(0x1E, 0x18, 0x3A), PURPLE, Inches(2))
add_pill(slide, Inches(5.0), Inches(5.8), "🎯  Single source of truth", RGBColor(0x0E, 0x2E, 0x24), TEAL, Inches(2.3))
add_pill(slide, Inches(7.8), Inches(5.8), "🔄  Auto-refresh live data", RGBColor(0x12, 0x24, 0x3A), BLUE, Inches(2.2))


# ═══════════════════════════════════════════════
#   SLIDE 5 — CORE MODULES
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 5)

add_text(slide, Inches(0.8), Inches(0.9), Inches(8), Inches(0.7),
         "Core Modules", font_size=36, color=PURPLE, bold=True)

modules = [
    ("📊", "Executive Dashboard", "6 KPIs with sparklines, ARR bridge chart, revenue mix donut, and live investor activity feed."),
    ("📈", "Growth Metrics", "SaaS metrics (Rule of 40, payback), MRR waterfall, cohort retention heatmap, pipeline analytics."),
    ("📝", "Investor Reporting", "Auto-compose and send investor updates, board memos, quarterly letters — metrics auto-populated."),
    ("🎞️", "Board Deck Builder", "8-slide auto-generated board presentations from live data — cover to asks & next steps."),
    ("💰", "Fundraising Suite", "DCF valuation calculator, data room tracker, Series B raise progress CRM with commitment tracking."),
    ("🔄", "Scenario Planning", "Interactive sliders for bull/base/bear cases, 5-year ARR projections, DCF sensitivity grid."),
]

mod_w = Inches(3.7)
mod_h = Inches(2.2)
cols = 3
for i, (icon, title, desc) in enumerate(modules):
    row = i // cols
    col = i % cols
    x = Inches(0.8) + col * (mod_w + Inches(0.35))
    y = Inches(1.8) + row * (mod_h + Inches(0.3))
    add_feature_card(slide, x, y, mod_w, mod_h, icon, title, desc)


# ═══════════════════════════════════════════════
#   SLIDE 6 — AI CHATBOT
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 6)

add_text(slide, Inches(0.8), Inches(0.9), Inches(8), Inches(0.7),
         "InvestorAI Chatbot", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(7), Inches(0.5),
         "An intelligent assistant that answers any major investor query — trained on live company data.",
         font_size=14, color=MUTED)

# Left side — features
features = [
    (PURPLE, [("20+ knowledge topics", True), (" — ARR, NDR, unit economics, valuation, GTM, team, market, compliance & more", False)]),
    (TEAL,   [("Quick suggestion chips", True), (" — one-click access to common investor questions", False)]),
    (BLUE,   [("Rich metric pills", True), (" — color-coded data highlights embedded in every AI response", False)]),
    (ORANGE, [("Natural language input", True), (" — type any question in plain English, get an intelligent answer", False)]),
    (PINK,   [("Always-on availability", True), (" — floating button accessible from every dashboard screen", False)]),
]

add_bullet_list(slide, Inches(0.8), Inches(2.3), Inches(5.8), Inches(4), features, font_size=12)

# Right side — chatbot demo mockup
demo_x = Inches(7.5)
demo_y = Inches(2.0)
demo_w = Inches(5)
demo_h = Inches(5)
demo_card = add_rect(slide, demo_x, demo_y, demo_w, demo_h, fill_color=BG_SURFACE, border_color=PURPLE, border_width=Pt(1.5))

# Chat header
add_rect(slide, demo_x, demo_y, demo_w, Inches(0.7), fill_color=RGBColor(0x1A, 0x1C, 0x2E), border_color=CARD_BORDER)
add_text(slide, demo_x + Inches(0.2), demo_y + Inches(0.15), Inches(0.4), Inches(0.4), "🤖", font_size=16)
add_text(slide, demo_x + Inches(0.65), demo_y + Inches(0.08), Inches(2), Inches(0.25), "InvestorAI", font_size=11, color=WHITE, bold=True)
add_text(slide, demo_x + Inches(0.65), demo_y + Inches(0.35), Inches(2), Inches(0.25), "● Online · Powered by growth data", font_size=8, color=TEAL)

# User message
user_msg = add_rect(slide, demo_x + Inches(1.8), demo_y + Inches(1.0), Inches(2.8), Inches(0.5), fill_color=PURPLE)
add_text(slide, demo_x + Inches(1.8), demo_y + Inches(1.05), Inches(2.8), Inches(0.45), "What are the unit economics?", font_size=10, color=WHITE, align=PP_ALIGN.CENTER)

# AI response
ai_card = add_rect(slide, demo_x + Inches(0.25), demo_y + Inches(1.8), Inches(4.2), Inches(2.2), fill_color=RGBColor(0x1E, 0x21, 0x30), border_color=CARD_BORDER)
add_text(slide, demo_x + Inches(0.45), demo_y + Inches(1.95), Inches(3.8), Inches(1.5),
         "Our unit economics are best-in-class:\n\n• LTV: $19,968\n• CAC: $3,840\n• LTV:CAC: 5.2x (benchmark: 3x)\n• Payback: 11.5 months",
         font_size=10, color=MUTED)

# Metric pills in chatbot
add_pill(slide, demo_x + Inches(0.4), demo_y + Inches(3.55), "LTV $19,968", RGBColor(0x0E, 0x2E, 0x24), TEAL, Inches(1.3))
add_pill(slide, demo_x + Inches(1.85), demo_y + Inches(3.55), "5.2x LTV:CAC", RGBColor(0x0E, 0x2E, 0x24), TEAL, Inches(1.35))
add_pill(slide, demo_x + Inches(3.35), demo_y + Inches(3.55), "Payback 11.5mo", RGBColor(0x1E, 0x18, 0x3A), PURPLE, Inches(1.4))

# Quick chips label
add_text(slide, demo_x + Inches(0.25), demo_y + Inches(4.15), Inches(2), Inches(0.25), "QUICK QUESTIONS", font_size=7, color=DIM, bold=True)
chips = ["📈 ARR & Growth", "🔁 NDR & Retention", "💰 Series B", "⚖️ Unit Economics"]
for ci, chip in enumerate(chips):
    add_pill(slide, demo_x + Inches(0.25) + ci * Inches(1.15), demo_y + Inches(4.45), chip, RGBColor(0x1E, 0x18, 0x3A), RGBColor(0x9B, 0x95, 0xFA), Inches(1.1))


# ═══════════════════════════════════════════════
#   SLIDE 7 — INDUSTRY APPLICATIONS
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 7)

add_text(slide, Inches(0.8), Inches(0.9), Inches(8), Inches(0.7),
         "Industry Applications", font_size=36, color=PURPLE, bold=True)
add_text(slide, Inches(0.8), Inches(1.6), Inches(10), Inches(0.5),
         "InvestorOS serves any company navigating investor relations and growth operations.",
         font_size=14, color=MUTED)

industries = [
    ("🚀", "VC-Backed Startups", "Automate monthly investor updates, track fundraise progress, and maintain board reporting cadence.", "23,000+ companies"),
    ("🏦", "PE Portfolio Companies", "Standardize reporting across portfolio companies with unified metrics and consistent board decks.", "$2.4T AUM market"),
    ("🧠", "AI / Consulting Firms", "Design growth metric frameworks, prepare data rooms, and automate client reporting cadence.", "High-value services"),
    ("📊", "CFO & Finance Teams", "Replace 20+ hours of manual work per month with automated models and scenario planning.", "80% time saved"),
]

ind_w = Inches(2.8)
ind_h = Inches(3.5)
ind_gap = Inches(0.3)
ind_start = Inches(0.8)

for i, (icon, title, desc, tag) in enumerate(industries):
    x = ind_start + i * (ind_w + ind_gap)
    y = Inches(2.4)
    card = add_rect(slide, x, y, ind_w, ind_h, fill_color=BG_CARD, border_color=CARD_BORDER)
    add_text(slide, x + Inches(0.2), y + Inches(0.2), Inches(1), Inches(0.5), icon, font_size=28)
    add_text(slide, x + Inches(0.2), y + Inches(0.7), ind_w - Inches(0.4), Inches(0.35), title, font_size=13, color=WHITE, bold=True)
    add_text(slide, x + Inches(0.2), y + Inches(1.1), ind_w - Inches(0.4), Inches(1.4), desc, font_size=10, color=MUTED)
    add_pill(slide, x + Inches(0.2), y + Inches(2.8), tag, RGBColor(0x0E, 0x2E, 0x24), TEAL, Inches(1.8))


# ═══════════════════════════════════════════════
#   SLIDE 8 — TECH STACK & SKILLS
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 8)

add_text(slide, Inches(0.8), Inches(0.9), Inches(8), Inches(0.7),
         "Technology & Skills Applied", font_size=36, color=PURPLE, bold=True)

# Left — Tech Stack
add_text(slide, Inches(0.8), Inches(1.8), Inches(5), Inches(0.4),
         "Technology Stack", font_size=16, color=WHITE, bold=True)

tech = [
    ("HTML5", RGBColor(0xE3, 0x4F, 0x26)),
    ("CSS3", RGBColor(0x15, 0x72, 0xB6)),
    ("JavaScript (ES6+)", RGBColor(0xF7, 0xDF, 0x1E)),
    ("Chart.js", RGBColor(0xFF, 0x63, 0x84)),
    ("Custom AI Engine", PURPLE),
    ("Responsive Design", TEAL),
]

for i, (name, col) in enumerate(tech):
    row = i // 2
    c = i % 2
    x = Inches(0.8) + c * Inches(2.8)
    y = Inches(2.4) + row * Inches(0.6)
    card = add_rect(slide, x, y, Inches(2.5), Inches(0.45), fill_color=BG_CARD, border_color=CARD_BORDER)
    # Color dot
    dot = slide.shapes.add_shape(MSO_SHAPE.OVAL, x + Inches(0.15), y + Inches(0.14), Inches(0.15), Inches(0.15))
    dot.fill.solid()
    dot.fill.fore_color.rgb = col
    dot.line.fill.background()
    add_text(slide, x + Inches(0.4), y + Inches(0.07), Inches(2), Inches(0.3), name, font_size=11, color=WHITE, bold=True)

# Right — Skills
add_text(slide, Inches(7), Inches(1.8), Inches(5), Inches(0.4),
         "Skill Sets Demonstrated", font_size=16, color=WHITE, bold=True)

skills = [
    (PURPLE, [("Financial Modelling & Valuation", True), (" — DCF, comparable analysis, scenario planning", False)]),
    (TEAL,   [("SaaS Metrics & Unit Economics", True), (" — ARR, NDR, LTV, CAC, Rule of 40", False)]),
    (BLUE,   [("Dashboard Design", True), (" — Power BI / Looker-style executive reporting", False)]),
    (ORANGE, [("Investor Communication", True), (" — pitch storytelling, board deck design", False)]),
    (PINK,   [("Data Integration", True), (" — CRM, finance, delivery data unification", False)]),
    (GREEN,  [("AI Chatbot Development", True), (" — NLP, knowledge base, contextual responses", False)]),
]

add_bullet_list(slide, Inches(7), Inches(2.4), Inches(5.5), Inches(4.5), skills, font_size=11)


# ═══════════════════════════════════════════════
#   SLIDE 9 — LIVE METRICS
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)
slide_number_tag(slide, 9)

add_text(slide, Inches(0.5), Inches(0.9), Inches(12.3), Inches(0.7),
         "Live Metrics Showcase", font_size=36, color=PURPLE, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, Inches(1.5), Inches(1.6), Inches(10.3), Inches(0.5),
         "Key performance indicators from the InvestorOS dashboard",
         font_size=14, color=MUTED, align=PP_ALIGN.CENTER)

# Top row — 3 big KPIs
kpi_w = Inches(3.5)
kpi_h = Inches(2)
kpi_gap = Inches(0.4)
kpi_start = Inches(1.25)

top_kpis = [
    ("$4.82M", "Annual Recurring Revenue", "↑ 18.4% MoM growth rate", PURPLE),
    ("114%", "Net Dollar Retention", "Top-decile SaaS benchmark", TEAL),
    ("5.2x", "LTV / CAC Ratio", "73% above 3x benchmark", ORANGE),
]

for i, (val, label, sub, col) in enumerate(top_kpis):
    x = kpi_start + i * (kpi_w + kpi_gap)
    add_kpi_card(slide, x, Inches(2.4), kpi_w, kpi_h, val, label, sub, col)

# Bottom row — 3 smaller KPIs
sm_kpis = [
    ("58", "Rule of 40 Score", "Exceeds target", GREEN),
    ("$6.2M", "Sales Pipeline Value", "+28% QoQ", BLUE),
    ("84%", "Fundraise Readiness", "Data room nearly complete", PINK),
]

for i, (val, label, sub, col) in enumerate(sm_kpis):
    x = kpi_start + i * (kpi_w + kpi_gap)
    add_kpi_card(slide, x, Inches(4.8), kpi_w, Inches(1.7), val, label, sub, col)


# ═══════════════════════════════════════════════
#   SLIDE 10 — THANK YOU
# ═══════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide)

add_text(slide, Inches(2.5), Inches(1.0), Inches(8.3), Inches(0.8),
         "🎯", font_size=48, align=PP_ALIGN.CENTER)
add_text(slide, Inches(2.5), Inches(1.9), Inches(8.3), Inches(0.8),
         "Thank You!", font_size=48, color=PURPLE, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, Inches(2), Inches(2.9), Inches(9.3), Inches(1.0),
         "InvestorOS streamlines the entire investor relations and growth operations\nworkflow — from data ingestion to board-ready deliverables — saving 20+ hours\nper month and eliminating reporting errors.",
         font_size=14, color=MUTED, align=PP_ALIGN.CENTER)

# Summary pills
pills_data = [
    ("📊  7 Dashboard Modules", RGBColor(0x1E, 0x18, 0x3A), PURPLE),
    ("🤖  AI Chatbot · 20+ Topics", RGBColor(0x0E, 0x2E, 0x24), TEAL),
    ("🔄  Real-Time Data Integration", RGBColor(0x12, 0x24, 0x3A), BLUE),
    ("⚡  Built with HTML · CSS · JS", RGBColor(0x3A, 0x28, 0x10), ORANGE),
]

pill_y = Inches(4.3)
pill_w = Inches(2.7)
total_pills_w = 4 * pill_w.inches + 3 * 0.2
pill_start = Inches((13.333 - total_pills_w) / 2)
for i, (txt, bg, tc) in enumerate(pills_data):
    x = Emu(pill_start + Inches(i * (pill_w.inches + 0.2)))
    add_pill(slide, x, pill_y, txt, bg, tc, pill_w)

# Bottom line
add_text(slide, Inches(3), Inches(5.4), Inches(7.3), Inches(0.5),
         "💡 Questions? Let's discuss!                📁 Live demo available",
         font_size=12, color=DIM, align=PP_ALIGN.CENTER)

# Branding
add_text(slide, Inches(4.5), Inches(6.2), Inches(4.3), Inches(0.5),
         "InvestorOS  ·  Q2 2026  ·  Growth Office",
         font_size=10, color=DIM, align=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════
#   SAVE
# ═══════════════════════════════════════════════
output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "InvestorOS_Presentation.pptx")
prs.save(output_path)
print(f"Presentation saved to: {output_path}")
