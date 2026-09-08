# GymOS Backend: Business Context

This document is a highly condensed overview of the domain and structure expected by the GymOS product.

## Project Overview
GymOS is a B2B SaaS architecture for gyms and fitness businesses. The gym/fitness business signs up as a "Tenant", while its staff and end-customers (members) use the system for memberships, attendance, workouts, and analytics.

## Tenancy
The authoritative hierarchy is:
**Platform** (GymOS SaaS product limit) 
→ **Gym / Tenant** (The subscribed business) 
→ **Branch** (A physical building within a Gym owner's umbrella) 
→ **Users / Operations** (Members, Staff, Data residing in a branch)

## RBAC Roles
Roles represent authorization scopes inside GymOS:
- **SUPER_ADMIN**: Platform level access. Manages tenants, subscriptions, and system health.
- **OWNER**: Primary business administrator for one particular Tenant boundary (sees all branches).
- **BRANCH_MANAGER**: Operates a specific, scoped physical Branch.
- **RECEPTIONIST**: Operates the front desk for a specific Branch (checking in, taking money).
- **TRAINER**: Works at a Branch. Handed assigned Members, generates workout and diet programs.
- **MEMBER**: The Gym's end-customer. Only views their own data securely. Must *never* view other member data.

## Business Domains
- **Authentication**: JWT login, password resets, tokens (DOC-006, DOC-010).
- **Users**: Application users and staff profiles.
- **Gyms/Tenants**: Company-level business accounts (DOC-002, DOC-005).
- **Branches**: Scoped locations mapped inside a Tenant.
- **Members**: Profiles of end-customers attached to branches.
- **Trainers**: Staff profiles representing fitness coaches.
- **Membership Plans**: Reusable, priced duration templates.
- **Memberships**: A purchased/active time block based on a plan for a specific member.
- **Attendance**: Physical visits, QR scans, and duration logs.
- **Payments / Invoices / Receipts**: Money transactions tied securely to Members and Memberships.
- **Workouts**: Trainer-authored plans containing exercises.
- **Diets**: Trainer-authored meal plans.
- **Progress**: Weight and dimensional measurements of Members over time.
- **Notifications**: Automated messages and alerts via Email/SMS/WhatsApp (async).
- **Reports/Analytics**: Operational visualizations scaling Revenue and Attendance limits.
- **Subscriptions**: B2B SaaS platform plans applied per Tenant (Starter, Professional).
- **Audit Logs**: Immutable records of meaningful business flows and CRUD mutations.

## Current Status
- **FRONTEND**: Complete through Phase 23.
- **BACKEND**: Implementation pending.
- **LIVE BACKEND**: Not verified.

*The frontend is functionally tested and rigorously checks against a mock MSW contract. The backend must fulfill these expectations without demanding frontend changes.*

---
### AUTHORITATIVE SOURCES
- DOC-001 Product Requirements Document
- DOC-002 Business Requirements Document
- DOC-003 User Stories
- DOC-007 RBAC Permission Matrix
