# Design System

## Overall Visual Direction
- **Product Identity**: Premium B2B SaaS + modern fitness technology.
- **Design Character**: Professional, premium, clean, modern, data-oriented. It should be energetic without looking like a consumer fitness app, and trustworthy enough for business/financial operations. Excellent readability with strong visual hierarchy.

## Design Language
- **Foundation**: Deep navy/slate foundation.
- **Primary Accent**: Electric/energetic green.
- **Surfaces**: Neutral surfaces with clean cards and clear tables.
- **Typography & Details**: Strong typography hierarchy. Subtle borders/shadows. Adaptive and accessible contrast.
- **Implementation**: The visual system will be driven by semantic design tokens centrally. Do NOT hardcode colors around individual component instances.
- **Themes**: Support for Light, Dark, and System preference. Do not over-design or add decorative UI that does not support the product.

## Component Concepts
- **Cards**: Minimalist containment for dashboard metrics and form groups.
- **Buttons**: Clear visual hierarchy (primary, secondary, destructive, ghost).
- **Forms**: Clear validation states, accessible labels, inline errors.
- **Tables**: Data-dense but readable, support for sorting/pagination inline.
- **Badges**: Status indicators (Active, Inactive, Pending).
- **Dialogs/Modals**: Focus-trapped, dismissible for critical actions.
- **Toasts**: Non-intrusive feedback for success/error events.

## Layout Elements
- **Navigation**: Intuitive context switching.
- **Sidebar**: Primary module navigation (collapsible based on viewport).
- **Header**: Global actions, user profile, tenant switcher (if applicable).
- **Dashboard Cards**: High-level KPIs and shortcuts.
- **Charts**: Clean data visualization for attendance/revenue.

## States & Behaviors
- **Data States**: Loading, Empty, Error, Success are mandatory for all data views.
- **Responsive Behavior**: Mobile-first for Member views, desktop-optimized for Admin/Staff views. Adapts fluidly.
- **Accessibility**: High contrast, ARIA labels, keyboard navigability.
