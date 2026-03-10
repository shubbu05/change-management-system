# Airport Authority of India (AAI) - Change Management System

A complete production-ready Web-Based Change Management System (CMS) for an IT organization following ITIL Change Management practices. Built with an internal Role-Based Access Control (RBAC) system.

## Setup Instructions

### Prerequisites
- **Node.js**: v18 or newer
- **PostgreSQL**: Running on `localhost:5432`

### 1. Database Setup
1. Open pgAdmin or `psql` and create a database named `aai_cms`.
2. Navigate to the `backend` folder and run the seed script:
```bash
cd backend
node seed.js
```
*Note: This script dynamically builds the database schema and generates the test accounts.*

### 2. Backend Setup
1. Ensure the PostgreSQL connection string in `backend/.env` matches your local database.
2. Install dependencies and start the Express server.
```bash
cd backend
npm install
npm run start # Or: node server.js
```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Install dependencies (including Tailwind CSS v4) and start Vite.
```bash
cd frontend
npm install
npm run dev
```
3. Access the application at `http://localhost:5173`.

---

## Sample Test Users
All passwords are set to `password123`.
- **Change Requester**: `requester1`
- **Change Reviewer**: `reviewer1`
- **InfoSec**: `infosec1`
- **Change Approver**: `approver1`
- **DC Helpdesk**: `helpdesk1`
- **Implementation Team**: `implement1`
- **System Admin**: `admin1`

---

## Folder Structure
```text
AAI/
├── backend/
│   ├── middleware/
│   │   └── auth.js         # RBAC logic and JWT verification
│   ├── routes/
│   │   ├── auth.js         # Login and context API
│   │   ├── cr.js           # Change Request CRUD and workflow API
│   │   ├── implement.js    # Implementation details and RCA upload
│   │   └── reports.js      # Dashboard aggregations
│   ├── utils/
│   │   └── email.js        # SMTP NodeMailer integration
│   ├── .env                # Port, Database, and SMTP credentials
│   ├── db.js               # pg pool configuration
│   ├── schema.sql          # Relational DB Schema
│   ├── seed.js             # Initializer script
│   └── server.js           # Express main app
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx      # Navigation, Sidebar, AAI logo
    │   │   └── StatusBadge.jsx # Reusable UI components
    │   ├── context/
    │   │   └── AuthContext.jsx # Global User State
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CRList.jsx
    │   │   ├── CRSubmit.jsx
    │   │   └── CRView.jsx
    │   ├── utils/
    │   │   └── api.js          # Axios interceptor config
    │   ├── App.jsx             # React Router with Route Guarding
    │   ├── index.css           # Tailwind v4 import
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## API Documentation

### Authentication (`/api/auth`)
- `POST /login`: Accepts `{ username, password }`. Returns `{ token, user }`.
- `GET /me`: Requires `Authorization: Bearer <token>`. Returns user context.

### Change Requests (`/api/cr`)
- `GET /`: Returns all CRs. Filters implicitly if caller is a `Change Requester`.
- `GET /:id`: Returns a specific CR and its comprehensive `history` (Audit trail).
- `POST /`: Creates a CR (Allows `multipart/form-data` for files).
- `POST /:id/workflow`: Accepts `{ action, comments, next_status }`. Advances the state machine.

### Implementation and Reports
- `POST /api/implement/:cr_id`: Saves details (Allows `rca_file` upload on Failure).
- `GET /api/reports/dashboard-stats`: Analyzes system load and calculates dynamic widgets.

---

## Architecture Diagrams

### ER Diagram
\`\`\`mermaid
erDiagram
    Users ||--o{ ChangeRequests : submits
    Users ||--o{ ApprovalHistory : performs
    Roles ||--o{ Users : assigned_to
    ChangeRequests ||--o{ ApprovalHistory : trails
    ChangeRequests ||--|| ImplementationDetails : executes
    Users ||--o{ AuditLogs : creates

    Users {
        int id PK
        string username
        string role_id FK
    }
    ChangeRequests {
        int id PK
        string cr_id
        string status
        string priority
    }
    ApprovalHistory {
        int id PK
        int cr_id FK
        string action
        string comments
    }
    ImplementationDetails {
        int id PK
        string status
        string remarks
    }
\`\`\`

### ITIL Workflow Diagram
\`\`\`mermaid
stateDiagram-v2
    [*] --> Submitted: Requester Submit Form
    Submitted --> Under_Review: Change Reviewer Approve
    Under_Review --> Security_Review: InfoSec Approve
    Security_Review --> Final_Approval: Approver Approve
    Final_Approval --> Implemented: Implementation Team Execute (Success)
    
    Final_Approval --> Failed: Implementation Team Execute (Fail/RCA req)
    Failed --> Closed: Admin/Review
    Implemented --> Closed: Automatic / Manual
    
    Submitted --> Submitted: Sent Back
    Under_Review --> Closed: Rejected
    Security_Review --> Closed: Rejected
    Final_Approval --> Closed: Rejected
\`\`\`
