"""
Event logging route.
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from models import EventLog
from config import CONDITIONS
from storage import save_event

router = APIRouter()


@router.post("/event/log")
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

    save_event(record)
    return {"status": "logged", "event_id": record["event_id"]}
