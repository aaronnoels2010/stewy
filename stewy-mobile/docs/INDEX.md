# Documentation Index (stewy-mobile)

Master navigation for all project documentation.

## Navigation by Task Type

### 🆕 Starting a New Feature
1. Read `AGENTS.md` for session protocol.
2. Check `docs/learnings/component-patterns.md` for UI standards.
3. Reference `.agents/QUICK_START.md` for commands.

### 🐛 Debugging
1. Review `.agents/COMMON_MISTAKES.md` for known pitfalls.
2. Check `docs/QUICK_REFERENCE.md` for common debug tips.
3. Examine `docs/learnings/state-management.md` if data is inconsistent.

### 🧪 Testing
1. See `docs/learnings/testing-patterns.md` for Jest setup.
2. Check existing tests in `components/__tests__`.

---

## Token Estimates

| Document | Purpose | Est. Tokens |
| :--- | :--- | :--- |
| `AGENTS.md` | Session Entry | ~300 |
| `.agents/COMMON_MISTAKES.md` | Risk Mitigation | ~250 |
| `.agents/ARCHITECTURE_MAP.md` | Navigation | ~200 |
| `docs/QUICK_REFERENCE.md` | Fast Lookup | ~300 |
| `docs/learnings/*.md` | Deep Dive | ~400-600 each |

---

## Decision Tree: What to Load?

- **"I need to add a button"** -> Load `docs/learnings/theming.md`.
- **"I need to fix a login bug"** -> Load `docs/learnings/authentication.md`.
- **"I need to add a new game field"** -> Load `docs/learnings/state-management.md`.
- **"I'm lost in the folders"** -> Load `.agents/ARCHITECTURE_MAP.md`.
