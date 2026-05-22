# Stewy API Agents Guide

Backend REST API and WebSocket service for Stewy, a game and volunteer coordination platform. Built with Spring Boot, JPA/Hibernate, Spring Security (JWT), WebSockets, and PostgreSQL.

## Session Start Protocol

**MANDATORY** — load these files at session start (~800 tokens total):
- `.agents/COMMON_MISTAKES.md` ⚠️ CRITICAL
- `.agents/QUICK_START.md`
- `.agents/ARCHITECTURE_MAP.md`

**Then load task-specific docs** (~500-1500 tokens):
- See `docs/INDEX.md` for navigation

**⚠️ NEVER auto-load:**
- `.agents/completions/**`
- `.agents/sessions/**`
- `docs/archive/**`

## Quick Start

- Run dev server: `./gradlew bootRun`
- Run tests: `./gradlew test`
- Build project: `./gradlew build`

## Architecture Quick Reference

- **REST Controllers**: `src/main/java/be/an/stewy/stewyapi/controller/`
- **JPA Domain Entities**: `src/main/java/be/an/stewy/stewyapi/domain/`
- **Custom Repositories (EntityManager)**: `src/main/java/be/an/stewy/stewyapi/repository/`
- **Service Interfaces & Impls**: `src/main/java/be/an/stewy/stewyapi/service/`
- **Security & JWT Configuration**: `src/main/java/be/an/stewy/stewyapi/security/` and `WebSecurityConfig.java`
- **WebSocket Configuration**: `WebSocketConfig.java`

## Testing

- Testing framework: JUnit 5, SpringBootTest, Mockito.
- Execute command: `./gradlew test`

## Code Style

- **Repository Pattern**: Do not use standard Spring Data JPA interfaces. Write a repository interface, then implement it under `repository/Impl/` using `EntityManager` directly.
- **Transactions**: Annotate repository implementation classes with `@Transactional(readOnly = true, rollbackFor = Exception.class)`, and add `@Transactional` on writing/updating methods.
- **DTOs**: Always separate domain entities from API endpoints using DTOs, mapped using MapStruct interfaces.
- **Lombok**: Use `@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` on entities and DTOs where appropriate.

## Documentation Navigation

- Common mistakes → `.agents/COMMON_MISTAKES.md`
- Commands → `.agents/QUICK_START.md`
- File map → `.agents/ARCHITECTURE_MAP.md`
- Detailed docs → `docs/INDEX.md`
