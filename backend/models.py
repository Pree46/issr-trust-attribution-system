"""
Pydantic request models for the API.
"""

from pydantic import BaseModel
from typing import Optional


class SessionStart(BaseModel):
    participant_id: Optional[str] = None


class EventLog(BaseModel):
    participant_id: str
    session_id: str
    condition: str
    task_id: str
    decision: str
    latency_ms: int
    confidence_rating: Optional[int] = None


class TrustScale(BaseModel):
    participant_id: str
    session_id: str
    condition: str
    trust_q1: int
    trust_q2: int
    trust_q3: int
