# AGENTS.md - stewy-mobile AI Guide

Token-optimized guide for AI agents working on the stewy-mobile Expo project.

## Project Overview
stewy-mobile is a cross-platform mobile application built with Expo (React Native) for managing games and volunteers. It uses NativeWind for styling and Expo Router for navigation.

## Session Start Protocol
**MANDATORY** at the start of each session, load these files (~800 tokens):
✓ AGENTS.md
✓ .agents/COMMON_MISTAKES.md ⚠️ CRITICAL
✓ .agents/QUICK_START.md
✓ .agents/ARCHITECTURE_MAP.md

**Then load task-specific docs** (~500-1500 tokens):
- See `docs/INDEX.md` for navigation.

## Quick Start Commandsf
- `npm start`: Start Expo dev server
- `npm run ios` / `npm run android`: Run on simulator/emulator
- `npm run test`: Run Jest tests
- `npm run lint`: Run Expo lint

## Architecture Quick Reference
- `app/`: Expo Router file-based navigation
- `components/`: Shared UI components (Themed UI, Forms)
- `contexts/`: Global state management (Auth, Games)
- `hooks/`: Custom React hooks (Theming, Storage)
- `constants/`: Design tokens, Colors, Spacing

## Testing Methodology
- Use Jest with `jest-expo`.
- Snapshot testing for UI components.
- Unit tests for logic/hooks.
- Test files located in `__tests__` directories or alongside files.

## Documentation Navigation
- `.agents/`: Internal agent workflows and mistakes.
- `docs/`: Technical deep dives and patterns.
- `docs/learnings/`: Topic-specific best practices.

## Code Style Guidelines
- Use Functional Components with Hooks.
- Prefer `Themed*` components for automatic dark mode support.
- Use NativeWind (Tailwind) classes for styling.
- Absolute imports for clean code structure.
- Always write tests for new logic
- Performance optimized

## Translations
- Translations live in `public/translation/en.json` and `public/translation/nl.json`
- **When adding a key to `en.json`, always add the corresponding Dutch translation to `nl.json`** — keep both files structurally in sync
