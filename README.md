## Project Overview

### Timeline

2 week

---

## Technologies Used

**Frontend:**

- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- Axios
- React Hook Form
- Zod
- TanStack Query
- Headless UI
- date-fns

**Backend:**

- Bun
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT
- Zod
- CORS, Dotenv

**Development Tools:**

- Beekeeper Studio
- Bruno
- Git & GitHub

**Deployment:**

- Netlify
- Railway
- Neon

---

![MediCheck Logo](./frontend/public/MediCheck_Logo_H.svg)

# MediCheck: Healthcare Coordination Platform

**Live Demo:** [Deployed Link Here]
**Author:** @Mathisha Mahawalage

**MediCheck** is a privacy-first multiplayer appointment management system designed to create an accountability safety net between patients and their trusted caregivers.

---

## Approach to Development

### 1. Initial Thinking

#### The Problem

Healthcare doesn't end when the prescription is written but for many patients, especially **elderly individuals living alone**, that's exactly where it breaks down.

**For Patients Living Alone (Expats, Elderly, Singles):**

**No accountability safety net:**

- Run out of medication and no one notices
- Miss follow-up appointments with no reminder system
- Fall off track with treatment and it goes undetected until crisis

**Cognitive overload:**

- "What am I supposed to do next?" isn't clear after leaving the clinic
- Medication runs out → stops there → no refill, no follow-up, no completion

**Social isolation compounds the problem:**

- No one to notice when medications aren't being taken
- No one to provide gentle reminders about appointments
- No one to check in when health management deteriorates

**For Elderly Patients Specifically:**

- **Stubbornness and cost concerns:** "I feel fine now, why waste money on another checkup?"
- **Memory gaps:** Simply forget when follow-up appointments are due
- **No clear next steps:** Take medication until it runs out, then stop

#### The Insight

> **Healthcare isn't a single transaction — it's a continuous cycle. Appointment management isn't just a reminder problem — it's a _state management_ and _accountability_ problem.**

**Current appointment apps are:**

- **Reminder-based** (passive, ignorable) — they notify you about appointments, but don't track if you actually went
- **Not state-aware** (they don't track completion) — they don't know if tasks were done or appointments were missed
- **Isolated** (no connection to support system) — you manage health completely alone with no accountability loop

**What's Missing:**

1. **Accountability:**
   - People managing health alone have no safety net
   - When they fall off track, no one notices
   - Support networks want to help but don't know when to step in

2. **Real-world constraint modeling:**
   - Appointments create follow-up tasks
   - Tasks need completion tracking
   - Without modeling this system, users cannot prioritize actions

3. **Privacy-first visibility:**
   - Existing caregiver apps are invasive (they see everything: diagnoses, medications, conditions)
   - What's needed: **minimal viable support** — just enough info for accountability, not medical snooping

4. **Clear action roadmap (stretch goals):**
   - Patients need a structured "what to do next" system allowing them to come back for a followup
   - Task lists linked to appointments eliminate confusion

#### The Solution

**MediCheck tracks:**

- **Appointments** — What's scheduled and when
- **Tasks** — Action items linked to appointments ("Pick up prescription")
- **Health Status** — Daily emoji check-ins (1-5 scale) without medical details
- **Support Requests** — When patients need help from caregivers
- **Caregiver Access** — Privacy-controlled sharing (who sees what)

---

### 2. MVP Planning

#### **Key Features**

**1. Authentication & Security**

- **Secure Access:** JWT-based authentication for private, encrypted sessions
- **Role-Based Access:** Patient and Caregiver roles with different permissions
- **Data Ownership:** Strict authorization ensures users only interact with their own data

**2. Appointment Management (CRUD)**

- **Structured Entries:** Log appointments with doctor name, clinic, date, and notes
- **Full CRUD:** Create, view, edit, and delete appointments
- **Authorization:** Only the patient who created an appointment can modify it

**3. Daily Health Logger**

- **One-Tap Emoji System:** Rate how you're feeling (scale:1-5)
- **Health Alert** Send to the Caregiver if the Patient is feeling unwell or bad
- **Privacy-First:** Caregivers see status without medical details encouraging them to check-in
- **7-Day History:** Visual timeline of recent health check-ins for patients

**4. Support Request Flow**

- **Support Requests:** Patients can request assistance from assigned caregivers for upcoming appointments
- **Status Tracking:** Pending, In Progress, Completed states
- **Two-Way Communication:** Caregivers can respond and mark requests complete

**5. Caregiver Access Control**

- **Grant/Revoke Access:** Patients control who can view their data
- **Read-Only Permissions:** Caregivers view appointments and tasks but cannot modify them
- **Privacy Preservation:** Medical details remain hidden from caregivers
- **Help Summary:** Caregivers can see their commitment of helping stats
- **Remove Access:** Not only patients but caregivers can remove patients if need be

---

### 3. Wireframes & Planning

#### **App Structure**

```
MediCheck PATIENT
│
├── Page 0 → Auth (Login / Signup)
├── Page 1 → Dashboard
├── Page 2 → Appointments
└── Page 3 → Profile

MediCheck CAREGIVER
│
├── Page 0 → Auth (Login / Signup)
├── Page 1 → Dashboard
├── Page 2 → Support & Tasks
└── Page 3 → Profile
```

[Wireframes](./doc/wireframes)
[Planning]()

---

## Styling Approach

- **Mobile-First Layout:** Tailwind CSS utility classes for responsive design
- **Card-Based UI:** Consistent rounded corners, subtle shadows, clean borders
- **Semantic Color System:**
  - Blue for primary actions (appointments, tasks)
  - Green for completed/healthy status
  - Red for overdue/urgent items
  - Gray for neutral/informational content
- **Typography Hierarchy:**
  - Uppercase labels with tracking for section headers
  - Bold text for key metrics (appointment count, task completion)
  - Regular weight for body content

---

## Database Schema (PostgreSQL)

**6 Core Tables:**

1. **users** - Authentication & profiles
2. **appointments** - Patient appointment records
3. **caregiver_assignments** - Patient-caregiver access control
4. **support_requests** - Help requests from patient to caregiver
5. **medical_logs** - Daily emoji feeling check-ins (1-5 scale)
6. **tasks** - Appointment-linked action items

**Future Tables:**

- medication_refills - For post-course clinic role expansion
- reminders - For future dashboard features

---

## Next Steps

- **Analytics Dashboard** for caregivers (trend visualization)
- **Access limitation** setup for both Caregiver side and Clinic side
- **Clinic Role** for managing multiple patients
- **Appointment Scheduling** for both clinic and patient
- **Task Management** for each Appointment act as a todo list
- **Medication Management** with supply tracking
- **Push Notifications** for upcoming appointments
- **Email Reminders** for overdue tasks
- **Multi-Language Support** (i18n)

---

## New Technologies Learned

This project introduced several new technologies compared to my previous work:

**Backend:**

- [PostgreSQL](https://www.postgresql.org/docs/) — Relational database for structured data persistence
- [Sequelize ORM](https://sequelize.org/) — SQL object-relational mapping for database queries
- [Bun](https://bun.sh/) — Fast JavaScript runtime as Node.js alternative
- [Express.js](https://expressjs.com/) — Web framework for building REST APIs
- [Zod](https://zod.dev) — Request validation and schema definition

**Frontend:**

- [Vite](https://vitejs.dev/) — Next-generation build tool with lightning-fast HMR
- [React 18](https://react.dev/) — UI library with hooks and concurrent features

**Libraries & Development:**

- [TanStack Query](https://tanstack.com/query/latest) — Server state management with caching and synchronization
- [React Hook Form](https://react-hook-form.com) — Form handling with minimal re-renders
- [Zod](https://zod.dev) — Runtime schema validation (shared frontend/backend)
- [Axios](https://axios-http.com/) — Promise-based HTTP client with interceptors
- [React Router DOM](https://reactrouter.com/) — Client-side routing for single-page applications
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework for rapid UI development
- [Lucide React](https://lucide.dev/) — Consistent, customizable icon library
- [Headless UI](https://headlessui.com/) — Unstyled, accessible React components
- [date-fns](https://date-fns.org/) — Modular date utility library for JavaScript

**Authentication & Security:**

- JWT (JSON Web Tokens) — Stateless authentication mechanism
- Bcrypt — Password hashing for secure credential storage

**Deployment:**

- [Neon](https://neon.tech) — Managed PostgreSQL hosting with serverless capabilities
- [Railway](https://railway.app) — Backend deployment with Git integration
- [Netlify](https://netlify.com/) — Frontend deployment with automatic builds from GitHub

## References
