# UX Rules & Guidelines

## General Principles
- **Consistent App Shell**: Maintain a stable layout foundation comprising a Header, Sidebar, and Breadcrumbs to provide continuous context.
- **Search/Filter/Sort/Pagination**: Provide standardized controls for data grids and lists to manage large datasets efficiently.
- **Forms and Validation**: Ensure immediate inline validation and clear messaging before submission.
- **Destructive-Action Confirmation**: Require explicit user confirmation (via dialogs/modals) for actions like deletion or cancellation.
- **Toast Behavior**: Use toasts for ephemeral success, info, and non-blocking error notifications.
- **Loading/Empty/Error/Success States**: Always provide visual feedback. Never leave the user wondering if an action succeeded or failed.
- **Responsive Behavior**: Optimize layouts contextually (e.g., tables may switch to card views on mobile). Ensure touch targets are size-appropriate.
- **Accessibility**: Support keyboard navigation, screen readers, and clear focus states.

## Navigation & Context
- **Role-Specific Navigation**: Display only the features accessible to the current user's role.
- **Member Mobile-First**: The Member experience should prioritize mobile device dimensions and touch interactions.
- **Dashboard Principles**: Surface immediately actionable items and key metrics relevant to the specific role.
- **Error/403/404 Handling**: Provide graceful fallback screens that guide the user back to safety rather than dead ends.

## Major Screens by Role (Overview)
*Note: Do not implement these screens yet.*
- **Super Admin**: Platform overview, tenant management, global settings, audit logs.
- **Gym Owner**: Tenant dashboard, branch management, aggregate financial metrics, membership plans.
- **Branch Manager**: Branch-specific dashboard, staff scheduling, localized analytics, active members.
- **Receptionist**: Check-ins, point of sale, immediate member inquiries, attendance logging.
- **Trainer**: Personal schedule, member workout/diet plan assignments, progress tracking.
- **Member**: Personal dashboard, active memberships, class booking, progress view, payment history.
