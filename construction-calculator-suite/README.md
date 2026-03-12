# Construction Calculator Suite

A web-based SaaS platform for **construction engineers and contractors** that simplifies daily construction site calculations.

## Features

- **Concrete Volume Calculator** — Column/beam concrete volume with unit conversion
- **Steel Rebar Weight Calculator** — Reinforcement bar weight using d²/162 formula
- **Excavation Volume Calculator** — Earthwork volumes with swell factor
- **Wall Material Calculator** — Brick count and mortar estimation
- **Construction Cost Estimator** — Total project cost and per-m² breakdown

### System Features

- JWT-based user authentication (signup/login)
- Dashboard with stats and quick access
- Save calculations to projects
- Full calculation history
- PDF export (single calculation or full project)
- Mobile-responsive UI
- Modern, clean design with TailwindCSS

---

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Frontend       | Next.js 14 + React 18 + TailwindCSS |
| Backend        | Node.js + Express 4                 |
| Database       | PostgreSQL                           |
| Authentication | JWT (jsonwebtoken + bcryptjs)        |
| PDF Export     | PDFKit                               |
| Icons          | Lucide React                         |

---

## Project Structure

```
construction-calculator-suite/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # PostgreSQL connection pool
│   │   ├── db/
│   │   │   └── init.js               # Database schema initialization
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT verification
│   │   │   └── error.middleware.js    # Global error handler
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Signup, Login, Get Me
│   │   │   ├── project.routes.js     # CRUD for projects
│   │   │   ├── calculation.routes.js # Run & save calculations
│   │   │   └── export.routes.js      # PDF export endpoints
│   │   ├── utils/
│   │   │   └── calculators.js        # Pure calculation functions
│   │   └── server.js                 # Express app entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js             # App shell with nav
│   │   │   └── CalculatorForm.js     # Reusable calculator component
│   │   ├── lib/
│   │   │   ├── api.js                # HTTP client (fetch wrapper)
│   │   │   ├── auth-context.js       # React auth provider
│   │   │   └── calculators.js        # Calculator definitions & client logic
│   │   ├── pages/
│   │   │   ├── _app.js               # Next.js app wrapper
│   │   │   ├── index.js              # Landing page
│   │   │   ├── login.js              # Login page
│   │   │   ├── signup.js             # Signup page
│   │   │   ├── dashboard.js          # Dashboard overview
│   │   │   ├── settings.js           # User settings
│   │   │   ├── calculators/
│   │   │   │   ├── index.js          # Calculator selection grid
│   │   │   │   └── [type].js         # Dynamic calculator page
│   │   │   └── projects/
│   │   │       ├── index.js          # Projects list
│   │   │       └── [id].js           # Project detail
│   │   └── styles/
│   │       └── globals.css           # Tailwind + custom utilities
│   ├── .env.local
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ running locally

### 1. Clone and Install

```bash
# Install backend dependencies
cd construction-calculator-suite/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Database

Create a PostgreSQL database:

```sql
CREATE DATABASE construction_calculator;
```

Then configure your backend `.env` file:

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

Initialize the database schema:

```bash
cd backend
npm run db:init
```

### 3. Start Development Servers

**Backend** (port 5000):

```bash
cd backend
npm run dev
```

**Frontend** (port 3000):

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

### Authentication

| Method | Endpoint         | Description            | Auth |
| ------ | ---------------- | ---------------------- | ---- |
| POST   | `/api/auth/signup` | Register new user      | No   |
| POST   | `/api/auth/login`  | Login, returns JWT     | No   |
| GET    | `/api/auth/me`     | Get current user       | Yes  |

### Projects

| Method | Endpoint              | Description           | Auth |
| ------ | --------------------- | --------------------- | ---- |
| GET    | `/api/projects`       | List user projects    | Yes  |
| POST   | `/api/projects`       | Create a project      | Yes  |
| GET    | `/api/projects/:id`   | Get project + calcs   | Yes  |
| PUT    | `/api/projects/:id`   | Update project        | Yes  |
| DELETE | `/api/projects/:id`   | Delete project        | Yes  |

### Calculations

| Method | Endpoint                  | Description              | Auth |
| ------ | ------------------------- | ------------------------ | ---- |
| POST   | `/api/calculations`       | Run & save calculation   | Yes  |
| GET    | `/api/calculations`       | Get calculation history  | Yes  |
| GET    | `/api/calculations/:id`   | Get single calculation   | Yes  |
| DELETE | `/api/calculations/:id`   | Delete calculation       | Yes  |

### Export

| Method | Endpoint                          | Description                | Auth |
| ------ | --------------------------------- | -------------------------- | ---- |
| GET    | `/api/export/calculation/:id`     | Export calculation as PDF  | Yes  |
| GET    | `/api/export/project/:id`         | Export project as PDF      | Yes  |

### Example API Requests

**Signup:**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"engineer@test.com","password":"123456","fullName":"John Doe","company":"BuildCo"}'
```

**Run a Concrete Volume Calculation:**

```bash
curl -X POST http://localhost:5000/api/calculations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "calculatorType": "concrete_volume",
    "inputData": { "width": 40, "length": 60, "height": 3, "quantity": 12 }
  }'
```

**Run a Rebar Weight Calculation:**

```bash
curl -X POST http://localhost:5000/api/calculations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "calculatorType": "rebar_weight",
    "inputData": { "diameter": 12, "length": 12, "quantity": 100 }
  }'
```

---

## Database Schema

```
┌─────────────┐       ┌──────────────┐       ┌────────────────┐
│    users     │       │   projects   │       │  calculations  │
├─────────────┤       ├──────────────┤       ├────────────────┤
│ id (UUID PK)│──┐    │ id (UUID PK) │──┐    │ id (UUID PK)   │
│ email       │  │    │ user_id (FK) │  │    │ project_id(FK) │
│ password_hash│  └───>│ project_name │  └───>│ user_id (FK)   │
│ full_name   │       │ description  │       │ calculator_type│
│ company     │       │ status       │       │ input_data JSON│
│ created_at  │       │ created_at   │       │ result_data JSON│
│ updated_at  │       │ updated_at   │       │ notes          │
└─────────────┘       └──────────────┘       │ created_at     │
                                              └────────────────┘
```

---

## Calculator Formulas

| Calculator       | Formula                                                    |
| ---------------- | ---------------------------------------------------------- |
| Concrete Volume  | `volume = (width_cm/100) × (length_cm/100) × height_m × qty` |
| Rebar Weight     | `weight_kg = (diameter_mm² / 162) × length_m × qty`        |
| Excavation       | `volume = length × width × depth` (+ 25% swell factor)    |
| Wall Materials   | `bricks = wall_area × bricks_per_m²` (+ 5% waste)         |
| Cost Estimator   | `total = concrete_cost + steel_cost + labor_cost`          |

---

## License

MIT
