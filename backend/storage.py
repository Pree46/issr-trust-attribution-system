"""
Data persistence helpers.

All functions read/write to flat JSON and CSV files in the working directory.
"""

import os
import csv
import json

from config import CSV_FIELDS


# ── Event data (data.json + data.csv) ────────────────────────────

def load_events() -> list:
    """Load all logged events from data.json."""
    if os.path.exists("data.json"):
        with open("data.json", "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []


def save_event(record: dict) -> None:
    """Append a single event to data.json and data.csv."""
    # JSON
    events = load_events()
    events.append(record)
    with open("data.json", "w") as f:
        json.dump(events, f, indent=4)

    # CSV
    file_exists = os.path.exists("data.csv")
    file_empty = not file_exists or os.path.getsize("data.csv") == 0

    with open("data.csv", "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        if file_empty:
            writer.writeheader()
        writer.writerow({k: record.get(k, "") for k in CSV_FIELDS})


# ── Trust-scale data (trust_scale.json) ──────────────────────────

def load_trust_scales() -> list:
    """Load all trust-scale submissions from trust_scale.json."""
    path = "trust_scale.json"
    if os.path.exists(path):
        with open(path) as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []


def save_trust_scale(record: dict) -> None:
    """Append a single trust-scale entry to trust_scale.json."""
    existing = load_trust_scales()
    existing.append(record)
    with open("trust_scale.json", "w") as f:
        json.dump(existing, f, indent=4)
