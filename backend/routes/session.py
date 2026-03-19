"""
Session routes — start and end a participant session.
"""

import uuid
from random import choice
from datetime import datetime, timezone

from fastapi import APIRouter

from models import SessionStart, TrustScale
from config import CONDITIONS, TASKS
from storage import save_trust_scale

router = APIRouter()


@router.post("/session/start")
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


@router.post("/session/end")
def end_session(body: TrustScale):
    record = body.dict()
    record["timestamp"] = datetime.now(timezone.utc).isoformat() + "Z"
    record["type"] = "trust_scale"

    save_trust_scale(record)

    return {"status": "trust scale logged", "participant_id": body.participant_id}
