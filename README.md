## Project Overview

### Timeline

2 week

---

## Technologies Used

**Frontend:**

- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Lucide React (Icons)
- Axios (HTTP client)
- React Hook Form
- Zod (Schema validation)
- TanStack Query (Server state management)

**Backend:**

- Bun (JavaScript runtime)
- Express.js
- PostgreSQL + Sequelize (ORM)
- JWT + Bcrypt (Authentication)
- Zod (Request validation)
- Cors, Dotenv

**Development Tools:**

- Beekeeper Studio (Database GUI)
- Bruno (API testing)
- Git & GitHub

**Deployment:**

- Netlify (frontend)
- Railway (backend)
- Neon (PostgreSQL database)

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

1. **Real-world constraint modeling:**
   - Appointments create follow-up tasks
   - Tasks need completion tracking
   - Without modeling this system, users cannot prioritize actions

2. **Accountability layer:**
   - People managing health alone have no safety net
   - When they fall off track, no one notices
   - Support networks want to help but don't know when to step in

3. **Privacy-first visibility:**
   - Existing caregiver apps are invasive (they see everything: diagnoses, medications, conditions)
   - What's needed: **minimal viable support** — just enough info for accountability, not medical snooping

4. **Clear action roadmap:**
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

**3. Task Management**

- **Appointment-Linked Tasks:** Create tasks tied to specific appointments
- **Checkbox Toggle:** Simple one-tap completion tracking
- **Progress Visibility:** Caregivers can see task completion status

**4. Daily Health Logger**

- **One-Tap Emoji System:** Rate how you're feeling (scale:1-5)
- **7-Day History:** Visual timeline of recent health check-ins
- **Privacy-First:** Caregivers see status without medical details

**5. Support Request Flow**

- **Help Requests:** Patients can request assistance from assigned caregivers
- **Status Tracking:** Pending, In Progress, Completed states
- **Two-Way Communication:** Caregivers can respond and mark requests complete

**6. Caregiver Access Control**

- **Grant/Revoke Access:** Patients control who can view their data
- **Read-Only Permissions:** Caregivers view appointments and tasks but cannot modify them
- **Privacy Preservation:** Medical details remain hidden from caregivers

---

### 3. Wireframes & Planning

#### **App Structure**

```
MediCheck PATIENT
│
├── Page 0 → Auth (Login / Signup)
├── Page 1 → Dashboard
├── Page 2 → Appointments
├── Page 3 → Tasks
└── Page 4 → Profile

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
- **Clinic Role** for managing multiple patients
- **Medication Refill Workflow** with supply tracking
- **Calendar View UI** for appointment visualization
- **Push Notifications** for upcoming appointments
- **Email Reminders** for overdue tasks
- **Mobile App** (React Native)
- **Multi-Language Support** (i18n)

---

## New Technologies Learned

This project introduced several new technologies compared to my previous work:

**Backend:**

- [PostgreSQL](https://www.postgresql.org/docs/) — Relational database
- [Sequelize ORM](https://sequelize.org/) — SQL object-relational mapping

**Frontend:**

- [TanStack Query](https://tanstack.com/query/latest) — Server state management & caching
- [React Hook Form](https://react-hook-form.com) — Form handling with validation
- [Zod](https://zod.dev) — Schema validation (shared frontend/backend)

**Deployment:**

- [Neon](https://neon.tech) — Managed PostgreSQL hosting
- [Railway](https://railway.app) — Backend deployment

## References
