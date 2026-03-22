# ai_accuracy_rate reflects realistic deployment benchmarks from the literature.
# All rates are intentionally clustered in the 0.65–0.75 range so no single
# task provides a strong accuracy signal — participants must rely on interface
# cues (name, tone, confidence framing) rather than performance history.
# This is a core experimental control for isolating the humanlike cue effect.

CSV_FIELDS = [
    "event_id", "participant_id", "session_id", "condition",
    "task_id", "decision", "timestamp", "latency_ms",
    "confidence_rating", "agent_name", "tone", "confidence_framing",
    "task_domain", "task_stakes", "block_position",
]

CONDITIONS = {
    "A": {
        "label": "Condition A — Neutral System",
        "agent_name": "System 7",
        "tone": "formal",
        "confidence_framing": "calibrated",
        "avatar_type": "icon",
        "color_scheme": "neutral",
        "greeting": "Analyzing input data...",
        "recommendation_prefix": "Based on statistical analysis, the recommended outcome is",
        "confidence_display": "72%",
        "button_accept": "Confirm Recommendation",
        "button_override": "Override System",
    },
    "B": {
        "label": "Condition B — Humanlike Agent",
        "agent_name": "Alex",
        "tone": "conversational",
        "confidence_framing": "overstated",
        "avatar_type": "initials",
        "color_scheme": "warm",
        "greeting": "Hey! I've looked at this carefully for you.",
        "recommendation_prefix": "I'm really confident about this one —",
        "confidence_display": "I'd definitely go with this!",
        "button_accept": "Sounds good, go with it",
        "button_override": "No thanks, I'll decide",
    },
}

TASKS = [
    # ── High stakes · Professional domain ────────────────────────────────────

    {
        "task_id": "t1",
        "domain": "medical",
        "stakes": "high",
        "scenario": (
            "Patient: Male, 47. Presenting with fatigue, mild chest tightness, "
            "and intermittent shortness of breath for 3 weeks. ECG shows no acute changes. "
            "Troponin levels are borderline (0.04 ng/mL). No prior cardiac history. "
            "The AI has cross-referenced symptom patterns against 140,000 similar cases."
        ),
        "recommendation": (
            "Order a stress echocardiogram and repeat troponin in 6 hours before "
            "ruling out unstable angina. Do not prescribe beta-blockers until results confirm. "
            "Probability of cardiac event within 72 hours: 18% without further workup."
        ),
        "ai_accuracy_rate": 0.72,
    },

    {
        "task_id": "t2",
        "domain": "finance",
        "stakes": "high",
        "scenario": (
            "Loan applicant: Self-employed, 34. Requesting $42,000 personal loan over 5 years. "
            "Credit score: 631 (dropped from 694 eighteen months ago after a missed payment). "
            "Debt-to-income ratio: 38%. Average monthly income over last 12 months: $5,200. "
            "No defaults in the past 3 years. The AI has assessed the full credit file."
        ),
        "recommendation": (
            "Approve at standard rate (9.4% APR). The score drop is isolated to a single "
            "missed payment during a documented income gap — not a pattern of default risk. "
            "Projected repayment probability over loan term: 74%. "
            "Flagging for 6-month review rather than rejection is the lower-risk outcome."
        ),
        "ai_accuracy_rate": 0.68,
    },

    {
        "task_id": "t3",
        "domain": "hiring",
        "stakes": "high",
        "scenario": (
            "Candidate: 4 years experience in backend engineering (Python, Go). "
            "Degree in Information Systems from a mid-tier university. "
            "Previous role at a Series B startup — company folded 8 months ago. "
            "No open-source contributions. Take-home assessment score: 71/100 "
            "(average for this role is 68). The AI has screened against the job rubric."
        ),
        "recommendation": (
            "Advance to technical interview. The assessment score is above average "
            "and the employment gap is explained by company closure, not performance. "
            "Absence of open-source work is common for startup engineers on proprietary systems. "
            "Estimated role-fit match: 73%."
        ),
        "ai_accuracy_rate": 0.75,
    },

    # ── Low stakes · Consumer domain ─────────────────────────────────────────

    {
        "task_id": "t4",
        "domain": "consumer",
        "stakes": "low",
        "scenario": (
            "Deciding between two 15-inch laptops at the same price ($1,149): "
            "Dell XPS 15 (Intel Core i7, 16GB RAM, OLED display, 84Wh battery) "
            "vs ASUS ProArt 15 (AMD Ryzen 9, 32GB RAM, OLED display, 96Wh battery). "
            "Intended use: video editing and occasional gaming. The AI has analysed "
            "benchmark data, reliability reports, and 4,200 user reviews."
        ),
        "recommendation": (
            "Go with the ASUS ProArt 15. The Ryzen 9 outperforms the i7 by 23% on "
            "sustained multi-core workloads relevant for video rendering. Double the RAM "
            "eliminates an early upgrade. Battery advantage: ~2.1 hours in editing tasks. "
            "Dell's OLED calibration is marginally better out of the box, but the "
            "performance gap matters more for the stated use case."
        ),
        "ai_accuracy_rate": 0.70,
    },

    {
        "task_id": "t5",
        "domain": "consumer",
        "stakes": "low",
        "scenario": (
            "Choosing between three employer health insurance plans during open enrollment. "
            "User: 29, generally healthy, one generic prescription ($45/month). "
            "Estimated 2-3 GP visits per year, no planned procedures. "
            "Plan A: HMO, $0 premium, $1,500 deductible. "
            "Plan B: PPO, $87/month premium, $500 deductible. "
            "Plan C: HDHP + HSA, $0 premium, $2,800 deductible. "
            "The AI has modelled projected annual costs against usage patterns."
        ),
        "recommendation": (
            "Plan A (HMO) is the lowest net-cost option for this profile. "
            "Projected annual out-of-pocket: $540 (prescription + 2 visits, post-deductible). "
            "Plan B costs $1,044 in premiums alone before any care is received. "
            "Plan C suits high earners maximising HSA tax benefits — that advantage "
            "is marginal at this income bracket. Recommend Plan A."
        ),
        "ai_accuracy_rate": 0.65,
    },

    # ── Low stakes · Everyday domain ─────────────────────────────────────────

    {
        "task_id": "t6",
        "domain": "everyday",
        "stakes": "low",
        "scenario": (
            "A 6-person product team is choosing a project management tool for a "
            "6-month feature buildout. Current stack: GitHub, Slack, Figma, Google Workspace. "
            "Budget: up to $25/user/month. Shortlisted: Linear vs Jira. "
            "The AI has evaluated integration depth, onboarding time, and fit across "
            "1,800 comparable team profiles."
        ),
        "recommendation": (
            "Use Linear. For a 6-person team on GitHub and Slack, Linear's native "
            "integrations reduce context-switching by an estimated 35% vs Jira. "
            "Median onboarding time: 1.5 days vs 4.8 days for Jira at this team size. "
            "Jira's advantage is enterprise-scale customisation — unnecessary overhead "
            "for a focused 6-month sprint. Cost difference is negligible."
        ),
        "ai_accuracy_rate": 0.73,
    },
]

TRUST_SCALE = [
    {"q_id": "trust_q1", "text": "I felt the AI was competent.", "scale": "1–7"},
    {"q_id": "trust_q2", "text": "I would rely on this AI again.", "scale": "1–7"},
    {"q_id": "trust_q3", "text": "The AI's confidence felt appropriate.", "scale": "1–7"},
]