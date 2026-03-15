import os
import csv
from random import choice
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import json
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title = "Humanlike AI Systems and Trust Attribution",
    description = "A project to explore the relationship between humanlike AI systems and trust attribution.",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


CSV_FIELDS = [
    "event_id", "participant_id", "session_id", "condition",
    "task_id", "decision", "timestamp", "latency_ms",
    "confidence_rating", "agent_name", "tone", "confidence_framing"
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

class EventLog(BaseModel):
    participant_id: str
    session_id: str
    condition: str  
    task_id: str
    decision: str   
    latency_ms: int
    confidence_rating: Optional[int] = None  

class SessionStart(BaseModel):
    participant_id: Optional[str] = None  


def load_data()-> list:
    if os.path.exists("data.json"):
        with open("data.json", "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
            
    return []


def save_data(data: list):
    events = load_data()
    events.append(data)
    with open("data.json", "w") as f:
        json.dump(events, f, indent=4)

    #csv
    with open("data.csv", "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        if not os.path.exists("data.csv"):
            writer.writeheader()
        writer.writerow({k: data.get(k, "") for k in CSV_FIELDS})



@app.get("/")
def root():
    return {"status": "System successfully running", "version": "1.0.0"}

@app.post("/session/start")
def start_session(body: SessionStart):

    participant_id = body.participant_id or str(uuid.uuid4())[:8]
    condition = choice(["A", "B"])
    session_id = str(uuid.uuid4())[:12]
    return {
        "participant_id": participant_id,
        "session_id": session_id,
        "condition": condition,
        "condition_config": CONDITIONS[condition],
        "tasks": TASKS,
    }


@app.post("/event/log")
def log_event(event: EventLog):
    if event.condition not in CONDITIONS:
        raise HTTPException(status_code=400, detail="Invalid condition. Must be 'A' or 'B'.")
    if event.decision not in ["accept", "override"]:
        raise HTTPException(status_code=400, detail="Decision must be 'accept' or 'override'.")

    cond = CONDITIONS[event.condition]
    record = {
        "event_id":           str(uuid.uuid4()),
        "participant_id":     event.participant_id,
        "session_id":         event.session_id,
        "condition":          event.condition,
        "task_id":            event.task_id,
        "decision":           event.decision,
        "timestamp":          datetime.now(timezone.utc).isoformat() + "Z",
        "latency_ms":         event.latency_ms,
        "confidence_rating":  event.confidence_rating,
        "agent_name":         cond["agent_name"],
        "tone":               cond["tone"],
        "confidence_framing": cond["confidence_framing"],
    }
    save_data(record)
    return {"status": "logged", "event_id": record["event_id"]}


@app.get("/export/json")
def export_json():
    return load_data()


@app.get("/export/csv")
def export_csv_info():
    count = len(load_data())
    return {
        "csv_path": os.path.abspath("data.csv"),
        "total_events": count,
        "fields": CSV_FIELDS,
    }


@app.get("/stats")
def get_stats():
    events = load_data()
    if not events:
        return {"message": "No events logged yet."}

    stats = {}
    for cond in ["A", "B"]:
        cond_events = [e for e in events if e.get("condition") == cond]
        if not cond_events:
            continue
        accepts  = [e for e in cond_events if e.get("decision") == "accept"]
        overrides = [e for e in cond_events if e.get("decision") == "override"]
        latencies = [e.get("latency_ms", 0) for e in cond_events]
        stats[cond] = {
            "agent_name":    CONDITIONS[cond]["agent_name"],
            "total":         len(cond_events),
            "accept_count":  len(accepts),
            "override_count": len(overrides),
            "reliance_rate": round(len(accepts) / len(cond_events), 3),
            "mean_latency_ms": round(sum(latencies) / len(latencies), 1),
        }
    return stats

