"""
Data export and statistics routes.
"""

import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from config import CONDITIONS
from storage import load_events

router = APIRouter()


@router.get("/export/json")
def export_json():
    return load_events()


@router.get("/export/csv")
def export_csv():
    if not os.path.exists("data.csv") or os.path.getsize("data.csv") == 0:
        raise HTTPException(status_code=404, detail="No data logged yet.")
    return FileResponse(
        path="data.csv",
        media_type="text/csv",
        filename="trust_study_export.csv",
    )


@router.get("/stats")
def get_stats():
    events = load_events()
    if not events:
        return {"message": "No events logged yet."}

    stats = {}
    for cond in ["A", "B"]:
        cond_events = [e for e in events if e.get("condition") == cond]
        if not cond_events:
            continue
        accepts   = [e for e in cond_events if e.get("decision") == "accept"]
        overrides = [e for e in cond_events if e.get("decision") == "override"]
        latencies = [e.get("latency_ms", 0) for e in cond_events]
        stats[cond] = {
            "agent_name":      CONDITIONS[cond]["agent_name"],
            "total":           len(cond_events),
            "accept_count":    len(accepts),
            "override_count":  len(overrides),
            "reliance_rate":   round(len(accepts) / len(cond_events), 3),
            "mean_latency_ms": round(sum(latencies) / len(latencies), 1),
        }
    return stats
