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

Two MCP servers are registered and can be invoked by name:

### `code-review-graph`
Provides code review and knowledge graph tools (`detect-changes`, `query_graph`, etc.). Invoke with `use code-review-graph` in your prompt.

### `graphify`
Provides graph query tools (`query_graph`, `get_node`, `get_neighbors`, `shortest_path`). Invoke with `use graphify` in your prompt.

### Workflow
1. Use these before falling back to Grep/Glob/Read.
2. The graphify CLI (`graphify query/path/explain`) is also available directly via bash.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
