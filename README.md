# ✦ SaaSly — Complete Modern B2B SaaS Web Platform

A production-grade, multi-page SaaS application built with **React / Next.js**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**. Designed with a clean, high-conversion B2B SaaS aesthetic matching pixel-for-pixel the reference UI/UX design specifications.

---

## 📌 Table of Contents
1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Folder Architecture](#-folder-architecture)
4. [Complete Page Breakdown & Functionality](#-complete-page-breakdown--functionality)
5. [Backend Architecture & REST API](#-backend-architecture--rest-api)
6. [Data Flow & State Management](#-data-flow--state-management)
7. [How to Run Locally (Step-by-Step)](#-how-to-run-locally-step-by-step)
8. [Demo Credentials & Testing](#-demo-credentials--testing)

---

## 🚀 Overview

**SaaSly** is an all-in-one business operations workspace for high-growth product teams. It combines project milestone tracking, team member permissions, automated workflows, and predictive AI telemetry into a unified, responsive interface.

### Key Highlights:
* **True Multi-Page Routing:** Separate clean URLs (`/`, `/pricing`, `/login`, `/signup`, `/dashboard`, `/projects`, `/team`, `/analytics`, `/settings`, `/tasks`, `/calendar`, `/integrations`).
* **Interactive Navbar:** Rich dropdown menus for **Product**, **Solutions**, and **Resources** with desktop hover, click toggles, and outside-click dismiss.
* **Dual-Persistence Backend:** Connects automatically to local MongoDB via Mongoose, with an intelligent fallback in-memory store so the app works out-of-the-box even without a running database service.
* **Instant Demo Login:** Single-click authentication to immediately explore the authenticated dashboard as workspace owner *Alex Carter*.
* **100% npm Driven:** No dependency on pnpm. Fully standardized scripts for `npm run dev` and `npm start`.

---

## 🛠 Tech Stack

### Frontend (`/Frontend`)
* **Framework:** Next.js 16 (Turbopack) with React 19 & TypeScript
* **Styling:** Tailwind CSS v4 & PostCSS
* **Icons:** Lucide React
* **Charts & Data Visuals:** Responsive SVG & Recharts Data Telemetry
* **Components:** Accessible Modals, Confirmation Dialogs, Custom Progress Bars, Stacked Avatar Groups, and Filter Pills
* **State Management:** React Context API (`AuthContext`, `DataContext`)

### Backend (`/Server`)
* **Runtime:** Node.js
* **Framework:** Express.js (v4.21)
* **Database:** MongoDB with Mongoose ODM (v8.9)
* **Authentication:** JSON Web Tokens (`jsonwebtoken`) & password hashing (`bcryptjs`)
* **Middleware:** CORS, JSON Body Parser, JWT Bearer Token Authenticator

---

## 📂 Folder Architecture

Project ko cleanly do independent folders mein organize kiya gaya hai:

```
f:\saa-sly-interface-analysis\
│
├── Frontend\                         # Client-Side Application (Next.js)
│   ├── app\
│   │   ├── layout.tsx                # Root layout with metadata & Context Providers
│   │   ├── globals.css               # Design system tokens, utilities & layouts
│   │   ├── page.tsx                  # Public Landing Page (/)
│   │   ├── pricing\page.tsx          # Dedicated Pricing Page (/pricing)
│   │   ├── login\page.tsx            # Split-screen Login (/login)
│   │   ├── signup\page.tsx           # Split-screen Sign Up (/signup)
│   │   ├── dashboard\page.tsx        # Main Authenticated Dashboard (/dashboard)
│   │   ├── projects\page.tsx         # Projects Management Table & Modals (/projects)
│   │   ├── team\page.tsx             # Team Members & Role Tiers (/team)
│   │   ├── analytics\page.tsx        # Analytics, KPI Comparison & CSV Export (/analytics)
│   │   ├── settings\page.tsx         # Tabbed User & Workspace Settings (/settings)
│   │   ├── tasks\page.tsx            # Workflows & Deliverables Checklist (/tasks)
│   │   ├── calendar\page.tsx         # Roadmap & Milestone Calendar (/calendar)
│   │   └── integrations\page.tsx     # 30+ Enterprise Connectors Directory (/integrations)
│   │
│   ├── components\
│   │   ├── layout\
│   │   │   ├── Navbar.tsx            # Public topbar with rich interactive dropdowns
│   │   │   ├── Footer.tsx            # Public multi-column footer
│   │   │   └── DashboardLayout.tsx   # Authenticated shell (sidebar, topbar, user menu)
│   │   └── ui\
│   │       ├── StatCard.tsx          # KPI metric cards with trend indicators
│   │       ├── StatusBadge.tsx       # Color-coded status & role badges
│   │       ├── RevenueChart.tsx      # SVG Line chart with monthly/quarterly filters & tooltip
│   │       ├── ProjectModal.tsx      # Create / Edit project form modal
│   │       ├── InviteModal.tsx       # Invite team member modal
│   │       ├── Modal.tsx             # Accessible generic dialog with backdrop
│   │       └── ConfirmDialog.tsx     # Destructive action confirmation dialog
│   │
│   ├── context\
│   │   ├── AuthContext.tsx           # Session, active user, login, register, logout
│   │   └── DataContext.tsx           # Real-time state for projects, team, stats, notifications
│   │
│   ├── lib\
│   │   ├── api.ts                    # Centralized REST client with offline fallback
│   │   ├── types.ts                  # TypeScript interfaces (User, Project, TeamMember, etc.)
│   │   └── mock-data.ts              # High-fidelity seed data
│   │
│   ├── public\                       # Static SVG icons, avatars, and assets
│   ├── package.json                  # Frontend dependencies and npm scripts
│   └── tsconfig.json                 # TypeScript compiler configuration
│
└── Server\                           # Server-Side REST API (Express)
    ├── middleware\
    │   └── auth.js                   # JWT token validation middleware
    ├── models\
    │   ├── User.js                   # Mongoose user schema & roles
    │   ├── Project.js                # Mongoose project schema & progress
    │   └── TeamMember.js             # Mongoose team member schema
    ├── routes\
    │   ├── auth.js                   # /api/auth routes (login, register, me)
    │   ├── projects.js               # /api/projects CRUD endpoints
    │   ├── teams.js                  # /api/teams member & role endpoints
    │   └── analytics.js              # /api/analytics KPI metrics & revenue data
    ├── server.js                     # Main Express server entry point (Port 5000)
    ├── .env                          # Server environment configuration
    └── package.json                  # Backend dependencies and npm scripts
```

---

## 🖥 Complete Page Breakdown & Functionality

### 1. Public Landing Page (`/`)
* **Header / Navbar:** Logo `✦ SaaSly`, interactive dropdown menus for **Product**, **Solutions**, and **Resources**, direct `Pricing` link, and action buttons (`Log in`, `Get Started`).
* **Hero Section:**
  * Eyebrow badge: `✦ New AI-powered analytics now available`.
  * Headline: *"Build, Manage and Grow Your Business with AI-Powered Tools"*.
  * Supporting copy, primary CTA (`Get Started Free`), secondary CTA (`Watch Demo`).
  * Trust proof: `✓ No credit card required`, `✓ Free 14-day trial`, `✓ Cancel anytime`.
  * Soft lavender ambient fluid glow background with an interactive floating dashboard preview.
* **Social Proof:** "Trusted by 10,000+ teams worldwide" featuring logos for Google, Microsoft, Slack, Notion, Shopify, and Dropbox.
* **Features Grid:** 6 reusable cards detailing Project Management, Smart Analytics, Team Collaboration, Automated Workflows, and Integrations.
* **How It Works / Workflow Panel:** Real-time milestone tracker with live status pills and animated progress indicators.
* **Pricing Preview:** 3 tier cards with monthly/yearly toggles.
* **FAQs Accordion:** Interactive open/close accordion for common buyer questions.
* **Footer:** Comprehensive links covering Product, Company, Resources, Legal, and copyright.

---

### 2. Pricing Page (`/pricing`)
* **Header:** "Simple, transparent pricing" badge with headline *"Choose the perfect plan for your business"*.
* **Billing Toggle:** Interactive **Monthly** vs **Yearly** toggle with a **Save 20%** discount badge.
* **3 Tier Cards:**
  1. **Starter ($0/mo):** Perfect for individuals and small side projects. Up to 3 projects, 1 member, community support.
  2. **Pro ($29/mo or $23/mo yearly) — Highlighted as Most Popular:** Unlimited projects, AI analytics, 10 team members, priority support, webhooks.
  3. **Business ($79/mo or $63/mo yearly):** Enterprise security, dedicated SLA, custom onboarding, unlimited members.
* **Plan Comparison Matrix Table:** Detailed checklist categorizing Core Features, Analytics & Reporting, and Security & Management across tiers.
* **Ready to Accelerate Banner:** Direct call to action linking to signup.

---

### 3. Authentication Pages
#### Login Page (`/login`)
* **Left Form Pane:**
  * SaaSly brand logo.
  * OAuth Social Buttons: `Continue with Google` and `Continue with GitHub`.
  * Email and Password input fields with password visibility toggle (Eye icon).
  * "Remember me for 30 days" checkbox & "Forgot password?" link.
  * Primary **Sign In** button with client-side validation.
  * **⚡ Instant Demo Login button:** Automatically logs in as *Alex Carter* (`alex@example.com` / `demo123456`) without having to type.
  * Link to `/signup`.
* **Right Feature Showcase:** Soft gradient card with verified value propositions (`✓ All-in-one platform`, `✓ Powerful analytics`, `✓ Secure & reliable`, `✓ Trusted by 10,000+ teams`).

#### Sign Up Page (`/signup`)
* **Left Form Pane:**
  * Full Name, Email, Password, and Confirm Password fields.
  * **Real-time Password Strength Meter:** Visual progress bar evaluating password complexity (Weak / Fair / Strong).
  * Terms of Service and Privacy Policy agreement checkbox.
  * Form validation error banners.
  * Link to `/login`.
* **Right Feature Showcase:** Social proof avatars and free trial benefits.

---

### 4. Authenticated Dashboard (`/dashboard`)
* **Dashboard Layout Shell:**
  * Collapsible left sidebar: Dashboard, Projects, Analytics, Tasks, Team, Calendar, Integrations, Settings.
  * Bottom "Upgrade to Pro" callout box.
  * Responsive Topbar: Search bar (`Search anything...`), notification bell with unread badge + popover dropdown, and user profile menu with Avatar, Name, Role, Account Settings, and Logout action.
* **Main Area Header:** Personal greeting (*"Good morning, Alex"*), date range selector pill (`Apr 1, 2024 - Apr 30, 2024`).
* **4 KPI Stat Cards:**
  1. **Total Revenue:** `$24,893` (+12% from last month)
  2. **Active Users:** `12,482` (+8% from last month)
  3. **Projects:** `28` (+4% from last month)
  4. **Conversion Rate:** `4.8%` (+1.2% from last month)
* **Revenue Overview Line Chart:**
  * Timeframe filter dropdown: `Monthly`, `Quarterly`, `Last 6 months`.
  * Responsive SVG line chart with gradient fill, grid guidelines, and interactive data point hover.
  * Floating dynamic tooltip: `$12,450 (+7.2% from last month)`.
* **Recent Activity Feed:** Color-coded event badges showing user registrations, project updates, payments received, and backups.
* **Recent Projects Table:** High-priority ongoing projects with team member avatars and animated progress bars.

---

### 5. Projects Management (`/projects`)
* **Header:** "Projects" title with `+ New Project` button.
* **Filter Tabs:** `All`, `Active`, `Completed`, `Archived`.
* **Real-Time Search:** Instant filtering by project name or description.
* **Data Table Columns:**
  * Name & Description icon card
  * Team (stacked member avatars with tooltips)
  * Progress percentage and color bar
  * Status Badge (`In Progress`, `Completed`, `Not Started`, `Archived`)
  * Due Date
  * Actions dropdown menu (Edit, Delete)
* **Interactive Modals:**
  * **`ProjectModal`:** Form to create or edit project name, description, status, due date, progress slider, and budget.
  * **`ConfirmDialog`:** Confirmation alert before permanently deleting a project.

---

### 6. Team Management (`/team`)
* **Header:** "Team Members" title with `+ Invite Member` button.
* **Role Filters:** Filter members by `All`, `Owner`, `Admin`, `Member`.
* **Data Table:**
  * Avatar, Name, Email
  * Role Badge (`Owner`, `Admin`, `Member`, `Viewer`)
  * Status Indicator (Active green dot)
  * Joined date
  * Actions menu (Promote/Demote role, Remove member)
* **Interactive Modals:**
  * **`InviteModal`:** Form to invite colleagues with name, email address, and role permission selector.
  * **`ConfirmDialog`:** Confirmation alert before removing a team member.

---

### 7. Analytics & Insights (`/analytics`)
* **Header:** Analytics title with **Export CSV button**.
* **Real CSV Export Engine:** Clicking "Export CSV" generates and downloads a clean `.csv` file directly to the user's computer (`saasly-analytics-report-2024.csv`).
* **KPI Comparisons Matrix:**
  * Monthly Recurring Revenue (MRR): `$24,893` (+12.0%)
  * Annual Run Rate (ARR): `$298,716` (+12.0%)
  * Average Revenue Per User (ARPU): `$48.50` (+7.3%)
  * Churn Rate: `1.2%` (-0.6%)
* **Audited Monthly Table:** Complete historical financial records (Month, Gross Revenue, Active Users, Growth Trajectory, Audited status).

---

### 8. Settings Page (`/settings`)
* **Tabbed Navigation:**
  1. **Profile:** Avatar image with change action, Full Name, Email, Company, Bio, and "Save changes" feedback alert.
  2. **Security:** Current password, new password inputs, and Two-Factor Authentication (2FA) toggle.
  3. **Notifications:** Granular checkboxes for project updates, billing alerts, weekly digests, and in-app push notifications.
  4. **Billing:** Current plan card (Pro $29/mo), saved payment method preview (Visa ending in 4242), and downloadable invoice receipts.
  5. **Integrations:** Connect and disconnect toggles for Slack, GitHub, Stripe, and Google Drive.

---

### 9. Supporting Pages
* **Tasks (`/tasks`):** Interactive deliverables board where tasks can be checked off in real time or added via quick input.
* **Calendar (`/calendar`):** Monthly grid view with scheduled sprint reviews, client syncs, and roadmap launch milestones.
* **Integrations (`/integrations`):** 30+ pre-built connector directory with category tags.

---

## 📡 Backend Architecture & REST API

The backend is built with Express.js in the `/Server` folder and provides full RESTful JSON endpoints.

### API Routes Reference

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with hashed password | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes (Bearer Token) |
| `GET` | `/api/projects` | List all workspace projects | Yes |
| `POST` | `/api/projects` | Create a new project | Yes |
| `PUT` | `/api/projects/:id` | Update project progress, status, or details | Yes |
| `DELETE` | `/api/projects/:id` | Delete a project | Yes |
| `GET` | `/api/teams` | List all team members & roles | Yes |
| `POST` | `/api/teams/invite` | Invite a new colleague to the team | Yes |
| `PATCH`| `/api/teams/:id` | Change member role permission tier | Yes |
| `DELETE`| `/api/teams/:id` | Remove a member from the workspace | Yes |
| `GET` | `/api/analytics/stats` | Retrieve KPI cards telemetry | Yes |
| `GET` | `/api/analytics/revenue`| Retrieve monthly financial performance data | Yes |
| `GET` | `/api/health` | Server heartbeat & MongoDB status check | No |

### Mongoose Models
1. **User Schema:** `name`, `email`, `password` (hashed via bcrypt), `role`, `avatar`, `bio`, `company`, `plan`.
2. **Project Schema:** `name`, `description`, `team` array, `progress` (0-100), `status`, `dueDate`, `budget`, `category`.
3. **TeamMember Schema:** `name`, `email`, `role` (`Owner` | `Admin` | `Member` | `Viewer`), `status`, `joinedAt`.

### Resilient Dual Data Layer
The backend connects to MongoDB via `mongoose.connect('mongodb://127.0.0.1:27017/saasly')`. If MongoDB is not running locally, the server does **not** crash; it automatically operates using a high-fidelity in-memory state store.

---

## 🔄 Data Flow & State Management

1. **Client API Client (`Frontend/lib/api.ts`):**
   * Automatically attaches JWT Bearer token from `localStorage` on authenticated requests.
   * If the backend server is unreachable or offline, it transparently persists changes into browser `localStorage` so the UI remains 100% interactive without errors.
2. **Auth Context (`Frontend/context/AuthContext.tsx`):**
   * Manages user session, login, signup, logout, and profile updates across all pages.
3. **Data Context (`Frontend/context/DataContext.tsx`):**
   * Centralizes project mutations, member additions, activity logs, and unread notification badges.

---

## 🏃 How to Run Locally (Step-by-Step)

Requirements: **Node.js (v18+)** and **npm** installed.

### Step 1: Run the Backend Server
Open **Terminal 1**:
```powershell
cd f:\saa-sly-interface-analysis\Server
npm run dev
```
* Server will start at: **`http://localhost:5000`**
* Health check: `http://localhost:5000/api/health`

---

### Step 2: Run the Frontend Website
Open **Terminal 2**:
```powershell
cd f:\saa-sly-interface-analysis\Frontend
npm run dev
```
* Website will start at: **`http://localhost:3000`**

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔑 Demo Credentials & Testing

To test the application immediately without signing up manually:
* **Option A (Instant):** Go to [http://localhost:3000/login](http://localhost:3000/login) and click the blue **"⚡ Instant Demo Login (Alex Carter)"** button.
* **Option B (Manual):**
  * **Email:** `alex@example.com`
  * **Password:** `demo123456`
* **Option C (New Account):** Go to [http://localhost:3000/signup](http://localhost:3000/signup) and create your own account with real-time password strength validation!
