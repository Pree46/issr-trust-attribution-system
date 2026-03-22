# ISSR Trust Attribution System

> An open-source experimentation engine for studying trust calibration in AI-assisted decision systems.

Participants interact with an AI assistant that varies across experimental conditions — differing in **name**, **tone**, and **confidence framing** — and make accept-or-override decisions on AI recommendations. All behavioral data (decisions, latency, confidence) is logged at high temporal resolution for analysis.

---

## Condition Logic

Participants are **randomly assigned** to one of two conditions at session start:

| Dimension | Condition A — Neutral System | Condition B — Humanlike Agent |
|-----------|------------------------------|-------------------------------|
| **Agent name** | "System 7" | "Alex" |
| **Tone** | Formal / technical | Conversational / social |
| **Confidence framing** | Calibrated probability ("72%") | Overstated certainty ("I'd definitely go with Option X!") |
| **Accept button** | "Confirm Recommendation" | "Sounds good, go with it" |
| **Override button** | "Override System" | "No thanks, I'll decide" |

Conditions are defined in [`backend/config.py`](backend/config.py) and are extensible — new cue dimensions can be added without modifying route logic.

---

## Experiment Flow

```
Welcome Screen → [Start Session] → Task 1/3 → Task 2/3 → Task 3/3 → Stats Summary
```

Each task presents a real-world decision scenario (medical, financial, hiring) where the AI provides a recommendation. The participant chooses to **accept** or **override** it. Response latency is measured using `performance.now()` from the moment the recommendation becomes visible.

---

## Logging Implementation

Every decision event is logged with the following schema and exported as both **JSON** and **CSV**:

### Event Schema

| Field | Type | Description |
|-------|------|-------------|
| `event_id` | `string` | Unique UUID for this event |
| `participant_id` | `string` | Auto-assigned participant identifier |
| `session_id` | `string` | Session identifier |
| `condition` | `string` | `"A"` or `"B"` — assigned condition |
| `task_id` | `string` | Which task (`t1`, `t2`, `t3`) |
| `decision` | `string` | `"accept"` or `"override"` |
| `timestamp` | `string` | ISO 8601 UTC timestamp |
| `latency_ms` | `integer` | Milliseconds from stimulus display to decision |
| `confidence_rating` | `integer\|null` | Optional participant confidence (1–10) |
| `agent_name` | `string` | AI agent name shown to participant |
| `tone` | `string` | `"formal"` or `"conversational"` |
| `confidence_framing` | `string` | `"calibrated"` or `"overstated"` |

### Trust Scale Schema (post-session)

| Field | Type | Description |
|-------|------|-------------|
| `participant_id` | `string` | Participant identifier |
| `session_id` | `string` | Session identifier |
| `condition` | `string` | Assigned condition |
| `trust_q1` – `trust_q3` | `integer` | Likert-scale trust ratings (1–7) |
| `timestamp` | `string` | ISO 8601 UTC timestamp |

---

## Project Structure

```
issr-trust-attribution-system/
├── backend/
│   ├── main.py              # FastAPI app setup + router registration
│   ├── config.py            # Experiment constants (conditions, tasks, CSV fields)
│   ├── models.py            # Pydantic request models
│   ├── storage.py           # JSON/CSV data persistence
│   ├── requirements.txt     # Python dependencies
│   └── routes/
│       ├── session.py       # POST /session/start, POST /session/end
│       ├── events.py        # POST /event/log
│       └── export.py        # GET /export/json, GET /export/csv, GET /stats
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx     # Page orchestrator (session state flow)
│       │   ├── layout.tsx   # Root layout
│       │   └── globals.css  # Design system
│       ├── components/
│       │   ├── WelcomeView.tsx   # Welcome/landing screen
│       │   ├── TaskCard.tsx      # Task card + latency tracking
│       │   └── StatsView.tsx     # Results display
│       ├── lib/
│       │   └── api.ts       # Backend API client
│       └── types/
│           └── index.ts     # Shared TypeScript interfaces
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Python, FastAPI, Pydantic |
| **Data Storage** | Flat-file JSON + CSV (no database required) |
| **Latency Measurement** | `performance.now()` (sub-millisecond browser API) |

---

## How to Run Locally

### Prerequisites
- **Node.js** v18+
- **Python** v3.9+

### 1. Clone the repository
```bash
git clone https://github.com/Pree46/issr-trust-attribution-system.git
cd issr-trust-attribution-system
```

### 2. Start the backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
Backend will be running at `http://localhost:8000`.  
API docs available at `http://localhost:8000/docs`.

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be running at `http://localhost:3000`.

### 4. Run the experiment
1. Open `http://localhost:3000` in your browser
2. Click **Start Session** — you'll be randomly assigned to Condition A or B
3. Complete all 3 decision tasks (accept or override the AI recommendation)
4. View the aggregated stats summary

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/session/start` | Start a new session, returns condition assignment + tasks |
| `POST` | `/event/log` | Log a single decision event |
| `POST` | `/session/end` | Submit post-session trust scale |
| `GET` | `/export/json` | Download all events as JSON |
| `GET` | `/export/csv` | Download all events as CSV |
| `GET` | `/stats` | Get aggregate statistics by condition |

---

## Sample Output

### Event log entry (`data.json`)
```json
{
    "event_id": "c061aa4b-ab99-4848-81ab-f939c782b816",
    "participant_id": "955f58e5",
    "session_id": "78b24a93-461",
    "condition": "A",
    "task_id": "t1",
    "decision": "accept",
    "timestamp": "2026-03-19T13:17:00.994546+00:00Z",
    "latency_ms": 16352,
    "confidence_rating": 5,
    "agent_name": "System 7",
    "tone": "formal",
    "confidence_framing": "calibrated"
}
```

### Aggregate stats (`/stats`)
```json
{
    "A": {
        "agent_name": "System 7",
        "total": 12,
        "accept_count": 5,
        "override_count": 7,
        "reliance_rate": 0.417,
        "mean_latency_ms": 5632.1
    },
    "B": {
        "agent_name": "Alex",
        "total": 15,
        "accept_count": 11,
        "override_count": 4,
        "reliance_rate": 0.733,
        "mean_latency_ms": 12894.3
    }
}
```

---

## License

MIT
