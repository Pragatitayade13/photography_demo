# System Architecture

## Overview
The Photography Showcase Platform is designed with a **feature-modular layered architecture** to ensure maximum reusability, clean separation of concerns, and maintainability.

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)              │
│  UI Features ──► Hooks ──► Services ──► Axios Client   │
└───────────────────────────┬────────────────────────────┘
                            │ REST JSON (/api/v1)
┌───────────────────────────▼────────────────────────────┐
│              Backend (Node.js + Express + TS)          │
│  Middleware ──► Routes ──► Controllers ──► Services    │
│                                └──► Repositories       │
└───────────────────────────┬────────────────────────────┘
                            │ SQL Queries
┌───────────────────────────▼────────────────────────────┐
│          PostgreSQL Database / Supabase Storage        │
└────────────────────────────────────────────────────────┘
```

## Backend Layer Responsibilities
- **Controller**: Handles incoming HTTP requests, input validation, and sends standardized JSON responses.
- **Service**: Executes core business logic and orchestrates domain tasks.
- **Repository / Database**: Performs direct database queries and data persistence.
- **Middleware**: Manages authentication, error capture, validation, and request logging.

## Frontend Layer Responsibilities
- **Features (`src/features/*`)**: Feature-isolated pages and domain-specific UI components.
- **Components (`src/components/*`)**: Universal presentation components (buttons, dialogs, inputs).
- **Layouts (`src/layouts/*`)**: Structural framing for Public and Admin experiences.
- **Services (`src/services/*`)**: Centralized API communications using a preconfigured Axios client.
