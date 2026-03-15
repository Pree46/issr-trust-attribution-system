# ISSR Humanlike AI Systems and Trust Attribution System 
A simple application built for human–AI trust, calibration, and adoption studies.

## Project Structure

```
project-root/
├── backend/          # FastAPI backend
│   ├── main.py       # FastAPI server
│   ├── data.json     # JSON data storage
│   ├── data.csv      # CSV data storage
│   └── requirements.txt # Python dependencies
├── frontend/         # Next.js frontend
│   ├── src/          # Source code for the frontend
│   ├── public/       # Static assets (optional)
│   ├── package.json  # Frontend dependencies
│   └── tsconfig.json # TypeScript configuration
└── README.md         # Project documentation
```

## Prerequisites

- **Node.js** (v16 or later)
- **Python** (v3.9 or later)
- **npm** (comes with Node.js)

## Setup Instructions

### 1. Clone the repository
```bash
git clone "https://github.com/Pree46/issr-trust-attribution-system"
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`.

## Usage

1. Start the backend server.
2. Start the frontend server.
3. Open your browser and navigate to `http://localhost:3000`.
4. Interact with the application to participate in the study.



