# Project Context: GymOS

## Product Definition
**GymOS** is a B2B SaaS Fitness Business Operating System designed for gyms and fitness centers.

## Target Audience & Multi-Tenancy
The system targets gym owners and business users, providing a multi-tenant environment to manage multiple branches, staff, members, and operations under distinct isolated tenants.

## System Roles
The system accommodates six distinct roles:
- **Super Admin**: Platform-level oversight and control.
- **Gym Owner**: Top-level tenant control.
- **Branch Manager**: Specific branch operations.
- **Receptionist**: Day-to-day front desk tasks.
- **Trainer**: Workout/diet plans and classes.
- **Member**: End consumer accessing their plans, attendance, and payments.

## MVP Scope & Major Modules
The MVP targets fundamental gym operations including:
- User & Role Management
- Membership & Plan Management
- Billing & Payments
- Attendance Tracking
- Workout & Diet Plans
- Notifications & Reporting

## Business Model & Currency
The current business model is B2B SaaS with multi-tenancy. Currency direction is to be finalized (assumed local to target market or standard international setup).

## Major Integrations
- **Payments**: Razorpay
- **Storage**: S3 / Object Storage
- **Notifications**: External providers (to be finalized)

## Technology Direction
- **Frontend**: React SPA, TypeScript, React Router, Vite (to be set up).
- **Backend**: Django (Modular Monolith), Django REST Framework, Celery, MySQL, Redis.

## Important Business Rules & Constraints
- Tenant isolation is paramount and must be strictly enforced by the backend.
- Authorization and RBAC are backend authorities; frontend only manages UI visibility.
- Data visibility depends entirely on user context (Tenant, Branch, Resource Ownership).
- Avoid generic SaaS functionality when it diverges from the fitness business focus.
