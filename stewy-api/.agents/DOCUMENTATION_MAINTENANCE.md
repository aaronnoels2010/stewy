# Documentation Maintenance Protocol

To ensure agent documentation remains correct, clean, and token-efficient:

## When to Update Existing Files
- **`COMMON_MISTAKES.md`**: Update when encountering a new, non-obvious bug or system constraint that takes more than 15 minutes to debug.
- **`ARCHITECTURE_MAP.md`**: Update when folders are restructured, sub-modules are introduced, or package naming conventions change.
- **`QUICK_START.md`**: Update when build steps, environment variables, or database migrations requirements are modified.

## When to Create Completion Docs
- After finishing a task of significant size or architectural complexity (e.g. creating new endpoints, implementing new entity associations, configuring external integrations).
- Save completion logs under `.agents/completions/` using the template [completion-template.md](file:///Users/aaron.noels/DEV/stewy/stewy-api/.agents/templates/completion-template.md).

## Archive Process
- When planning docs, design specs, or legacy architectural designs are superseded, move them to `docs/archive/` and update `docs/INDEX.md` to ensure they are excluded from the main agent context.
