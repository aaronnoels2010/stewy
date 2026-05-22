# Documentation Maintenance

Rules for keeping the agent documentation up-to-date and token-efficient.

## When to Update `COMMON_MISTAKES.md`
- After resolving a difficult bug that took more than 30 minutes to diagnose.
- When a new team member (or agent) makes a recurring error.
- When upgrading major dependencies (Expo, React Native, NativeWind).

## When to Create Completion Docs
- After finishing a significant feature (e.g., "Add Volunteer Search").
- After a major refactor.
- Use `.agents/templates/completion-template.md`.

## When to Update Learnings
- When a new design pattern is established.
- When adding a new global service or context.
- When documentation in `docs/learnings/*.md` becomes outdated or superseded.

## Archiving
- Move planning documents, POC summaries, and superseded technical specs to `docs/archive/` once the work is merged and stable.
- Periodically clear old session files from `.agents/sessions/active/` to `archive/`.
