# Authentication and Security

This document covers Spring Security authentication flow, role-based endpoint permissions, and JWT token handling.

## Authentication Overview
Stewy API uses stateless JWT authentication:
1. Client sends email & password to `/auth/login`.
2. Auth service verifies credentials against DB (using `PasswordEncoder` and `CustomUserDetailsService`).
3. `JwtTokenProvider` generates a signed HS256 JWT containing the user's email.
4. Client stores the token and includes it in the `Authorization` header as `Bearer <token>` for subsequent requests.

## Security Configuration (`WebSecurityConfig.java`)
- CSRF is disabled (stateless token authentication model).
- Session creation policy is set to `SessionCreationPolicy.STATELESS`.
- Permit rules:
  - `POST` `/auth/**` allowed without authentication (Register/Login).
  - `/ws/**` (WebSockets) allowed without HTTP session checks.
  - All other routes require authentication.

## Filter Chain Integration
The `JwtAuthenticationFilter` intercepts HTTP requests:
1. Extracts token from `Authorization` header.
2. Validates signature and expiration using `JwtTokenProvider`.
3. Loads user details using `CustomUserDetailsService`.
4. Sets the security context using `UsernamePasswordAuthenticationToken` to allow the request to proceed.

## User Roles and Authorities
- Roles are defined by the enum `UserRole` (e.g. `ADMIN`, `VOLUNTEER`, `CLUB`).
- Map role-based permissions or restrict endpoints using annotation-based authorization on controllers or service methods.
