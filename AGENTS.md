# Stewy Monorepo — AI Agent Guide

## Agent skills

### Issue tracker

Local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

No CONTEXT.md or ADRs yet — single-context layout. See `docs/agents/domain.md`.

Monorepo containing the Stewy platform — a game and volunteer coordination application.

## Repository Structure

- **`stewy-api/`** — Backend REST API + WebSocket service (Spring Boot, JPA/Hibernate, PostgreSQL)
- **`stewy-mobile/`** — Cross-platform mobile app (Expo / React Native, NativeWind, Expo Router)
- **`websocket/`** — Standalone WebSocket service

## Guardrails (Load Per Subproject)

Each subproject has its own `AGENTS.md` with session start protocols, code style, and architecture docs. **Load the relevant one before working in that directory.**

| Subproject | Guardrails File |
|---|---|
| `stewy-api/` | `stewy-api/AGENTS.md` |
| `stewy-mobile/` | `stewy-mobile/AGENTS.md` |

Both also define mandatory session-start docs in `.agents/COMMON_MISTAKES.md`, `.agents/QUICK_START.md`, and `.agents/ARCHITECTURE_MAP.md`.

## Quick Reference

### stewy-api
- Run: `./gradlew bootRun` (from `stewy-api/`)
- Test: `./gradlew test`
- REST controllers in `.../controller/`, services in `.../service/`, custom repositories via `EntityManager` in `.../repository/`
- Read `stewy-api/AGENTS.md` for full code style (DTOs via MapStruct, Lombok, transactional patterns)

### stewy-mobile
- Run: `npm start` (from `stewy-mobile/`)
- Test: `npm run test`
- Expo Router in `app/`, shared components in `components/`, state in `contexts/`
- Read `stewy-mobile/AGENTS.md` for full code style (NativeWind, Themed components, absolute imports)

## MCP Servers (configured in .opencode/opencode.json)

MCP Tools: code-review-graph

IMPORTANT: This project has a knowledge graph. ALWAYS use the code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore the codebase. The graph is faster, cheaper (fewer tokens), and gives you structural context (callers, dependents, test coverage) that file scanning cannot.

When to use graph tools FIRST
Exploring code: semantic_search_nodes or query_graph instead of Grep
Understanding impact: get_impact_radius instead of manually tracing imports
Code review: detect_changes + get_review_context instead of reading entire files
Finding relationships: query_graph with callers_of/callees_of/imports_of/tests_for
Architecture questions: get_architecture_overview + list_communities
Fall back to Grep/Glob/Read only when the graph doesn't cover what you need.

Key Tools
Tool	Use when
detect_changes	Reviewing code changes — gives risk-scored analysis
get_review_context	Need source snippets for review — token-efficient
get_impact_radius	Understanding blast radius of a change
get_affected_flows	Finding which execution paths are impacted
query_graph	Tracing callers, callees, imports, tests, dependencies
semantic_search_nodes	Finding functions/classes by name or keyword
get_architecture_overview	Understanding high-level codebase structure
refactor_tool	Planning renames, finding dead code
Workflow
The graph auto-updates on file changes (via hooks).
Use detect_changes for code review.
Use get_affected_flows to understand impact.
Use query_graph pattern="tests_for" to check coverage.