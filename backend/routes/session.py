"""
Session routes — start and end a participant session.

Within-subjects design: each participant completes tasks under BOTH conditions.
The 6 tasks are split into two blocks of 3, each block assigned a different
condition. Block order is counterbalanced by participant hash.
"""

import uuid
from random import shuffle
from datetime import datetime, timezone

from fastapi import APIRouter

from models import SessionStart, TrustScale
from config import CONDITIONS, TASKS, TRUST_SCALE
from storage import save_trust_scale

router = APIRouter()


@router.post("/session/start")
def start_session(body: SessionStart):
    participant_id = body.participant_id or str(uuid.uuid4())[:8]
    session_id = str(uuid.uuid4())[:12]

    # Counterbalance: half get A→B, half get B→A
    first_cond = "A" if hash(participant_id) % 2 == 0 else "B"
    second_cond = "B" if first_cond == "A" else "A"

    # Shuffle tasks and split into two balanced blocks
    shuffled = list(TASKS)
    shuffle(shuffled)
    midpoint = len(shuffled) // 2

    return {
        "participant_id": participant_id,
        "session_id": session_id,
        "conditions": {
            "A": CONDITIONS["A"],
            "B": CONDITIONS["B"],
        },
        "blocks": [
            {
                "condition": first_cond,
                "condition_config": CONDITIONS[first_cond],
                "tasks": shuffled[:midpoint],
            },
            {
                "condition": second_cond,
                "condition_config": CONDITIONS[second_cond],
                "tasks": shuffled[midpoint:],
            },
        ],
        "trust_scale": TRUST_SCALE,
    }


@router.post("/session/end")
def end_session(body: TrustScale):
    record = body.dict()
    record["timestamp"] = datetime.now(timezone.utc).isoformat() + "Z"
    record["type"] = "trust_scale"

    save_trust_scale(record)

    return {"status": "trust scale logged", "participant_id": body.participant_id}
