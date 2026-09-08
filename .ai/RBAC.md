# Role-Based Access Control (RBAC)

## The Six Roles
1. **Super Admin**: Manages the GymOS platform itself.
2. **Gym Owner**: Manages all branches within their specific tenant.
3. **Branch Manager**: Manages operations for a specific geographic branch.
4. **Receptionist**: Handles front-desk operations at a specific branch.
5. **Trainer**: Interacts with assigned members, workouts, and attendance.
6. **Member**: The end consumer using the gym's services.

## Hierarchy & Resolution
`User → Role → Tenant → Branch → Resource → Permission`

## Scopes
- **Tenant Scope**: Isolation barrier. No user (except Super Admin) can access data across tenants.
- **Branch Scope**: Limits visibility to specific physical locations.
- **Resource Scope**: Granular access to entities (e.g., modifying a Membership Plan vs. viewing it).
- **Own-Data Scope**: Members and Trainers have access primarily restricted to their own assigned data.
- **Feature Entitlement**: Paid features limit access regardless of role if the tenant is not entitled.

## Representative Permission Codes
- Examples: `users:create`, `members:view`, `payments:refund`.

## Critical Rule
- **Frontend visibility is NOT authorization.**
- The frontend should hide UI elements the user cannot access, but the **Backend remains strictly authoritative** over all data requests and state mutations.
- **Super Admin** requires explicit access and audit trails.
