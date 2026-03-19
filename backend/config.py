"""
Experiment configuration constants.

CONDITIONS  – the two experimental arms (neutral vs. humanlike).
TASKS       – the decision-making scenarios shown to participants.
CSV_FIELDS  – column order for the flat CSV export.
"""

CSV_FIELDS = [
    "event_id", "participant_id", "session_id", "condition",
    "task_id", "decision", "timestamp", "latency_ms",
    "confidence_rating", "agent_name", "tone", "confidence_framing",
]

CONDITIONS = {
    "A": {
        "label": "Condition A — Neutral System",
        "agent_name": "System 7",
        "tone": "formal",
        "confidence_framing": "calibrated",
        "greeting": "Analyzing input data...",
        "recommendation_prefix": "Based on statistical analysis, the probability of the recommended outcome is",
        "confidence_display": "72%",
        "button_accept": "Confirm Recommendation",
        "button_override": "Override System",
    },
    "B": {
        "label": "Condition B — Humanlike Agent",
        "agent_name": "Alex",
        "tone": "conversational",
        "confidence_framing": "overstated",
        "greeting": "Hey! I've looked at this carefully for you.",
        "recommendation_prefix": "I'm really confident about this one —",
        "confidence_display": "I'd definitely go with Option X!",
        "button_accept": "Sounds good, go with it",
        "button_override": "No thanks, I'll decide",
    },
}

TASKS = [
    {
        "task_id": "t1",
        "scenario": "A patient has presented with ambiguous symptoms. The AI has reviewed the case.",
        "recommendation": "Recommend further blood work before prescribing medication.",
        "ai_accuracy_rate": 0.72,
    },
    {
        "task_id": "t2",
        "scenario": "A loan applicant has a mixed credit history. The AI has assessed their profile.",
        "recommendation": "Approve the loan with a standard interest rate.",
        "ai_accuracy_rate": 0.68,
    },
    {
        "task_id": "t3",
        "scenario": "A résumé has been submitted for a technical role. The AI has screened it.",
        "recommendation": "Advance this candidate to the interview stage.",
        "ai_accuracy_rate": 0.75,
    },
]
