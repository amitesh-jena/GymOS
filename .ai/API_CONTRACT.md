# API Contract Expectations

**Note**: This document describes the expected contract for the frontend. Do NOT create actual API calls in this project setup phase.

## General Structure
- **Base URL**: `/api/v1`
- **Authentication**: JWT Bearer token authentication in standard headers.
- **Tokens**: Refresh token architecture in place to handle session duration securely.

## Response Format
- **Standard JSON Envelope**: All successful responses wrapped consistently.
- **Standard Error Envelope**: All API errors return a standard format containing code, message, and field-level validation dictionaries if applicable.
- **Pagination**: Consistent structure for listing resources (e.g., `count`, `next`, `previous`, `results`).
- **Query Params**: Standardized query conventions for search, filter, and sort (e.g., `?search=name&sort=-created_at`).

## Core Endpoints
- **Authentication**: `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`.
- **Major Resource Groups**: 
  - Users, Branches, Memberships, Attendance, Plans, Payments.

## Security & Architecture
- **Tenant Scoping**: All API requests implicitly or explicitly scope to the authorized tenant context based on the user's token.
- **Authorization Expectations**: The backend will return `403 Forbidden` if a user requests data beyond their role or tenant. The frontend must handle this gracefully.
- **Payment Verification**: Payments (via Razorpay) utilize a webhook principle for server-side verification; the frontend facilitates the initial handshake.
