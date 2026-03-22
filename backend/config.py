
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
    # High stakes · Professional domain
    {
        "task_id": "t1",
        "domain": "medical",
        "stakes": "high",
        "scenario": "A patient has presented with ambiguous symptoms. The AI has reviewed the case.",
        "recommendation": "Recommend further blood work before prescribing medication.",
        "ai_accuracy_rate": 0.72,
    },
    {
        "task_id": "t2",
        "domain": "finance",
        "stakes": "high",
        "scenario": "A loan applicant has a mixed credit history. The AI has assessed their profile.",
        "recommendation": "Approve the loan with a standard interest rate.",
        "ai_accuracy_rate": 0.68,
    },
    {
        "task_id": "t3",
        "domain": "hiring",
        "stakes": "high",
        "scenario": "A résumé has been submitted for a technical role. The AI has screened it.",
        "recommendation": "Advance this candidate to the interview stage.",
        "ai_accuracy_rate": 0.75,
    },
    # Low stakes · Consumer domain
    {
        "task_id": "t4",
        "domain": "consumer",
        "stakes": "low",
        "scenario": "A customer is choosing between two laptop models with similar specs and prices.",
        "recommendation": "Go with Model B — it has better long-term reliability ratings.",
        "ai_accuracy_rate": 0.70,
    },
    {
        "task_id": "t5",
        "domain": "consumer",
        "stakes": "low",
        "scenario": "A user is selecting a health insurance plan during open enrollment.",
        "recommendation": "The mid-tier plan covers your stated needs at the lowest net cost.",
        "ai_accuracy_rate": 0.65,
    },
    # Low stakes · Everyday domain
    {
        "task_id": "t6",
        "domain": "everyday",
        "stakes": "low",
        "scenario": "A team is deciding which project management tool to adopt for a 6-month project.",
        "recommendation": "Use Tool A — it integrates better with your existing stack.",
        "ai_accuracy_rate": 0.73,
    },
]

TRUST_SCALE = [
    {"q_id": "trust_q1", "text": "I felt the AI was competent.", "scale": "1–7"},
    {"q_id": "trust_q2", "text": "I would rely on this AI again.", "scale": "1–7"},
    {"q_id": "trust_q3", "text": "The AI's confidence felt appropriate.", "scale": "1–7"},
]
