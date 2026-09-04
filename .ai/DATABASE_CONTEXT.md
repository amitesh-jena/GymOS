# Database Context

*Overview of the major entities for frontend development context. Do not redesign or implement this database manually.*

## Major Entities
- **users**: Base identity for authentication.
- **roles**, **permissions**: RBAC mapping.
- **tenants**: The core B2B business isolator.
- **branches**: Physical locations under a tenant.
- **members**: Gym customers.
- **trainers**, **staff**: Employees.
- **membership_plans**: Templates for memberships offered.
- **memberships**: Active/Historical links between a Member and a Plan.
- **payments**, **invoices**: Financial records.
- **attendance_records**: Tracked entry/exit or class participation.
- **workout_plans**, **exercises**, **workout_plan_exercises**: Training structures.
- **workout_logs**, **progress_records**: Member execution and metrics.
- **diet_plans**: Nutritional guidance.
- **notifications**, **audit_logs**: System communication and security tracking.
- **subscription_plans**, **subscriptions**: GymOS billing to the Tenant/Gym Owner.
- **features**, **entitlements**: Granular SaaS capabilities mapped to subscriptions.

## Important Concepts
- ALMOST ALL entities must link back to a `tenant_id` to enforce multitenancy in the backend.
- The frontend must respect relational dependencies (e.g., cannot create a membership without a member and a plan).
