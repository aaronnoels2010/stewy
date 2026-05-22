# Architecture Map (stewy-mobile)

### Directory Structure Overview
- `app/`: **Root of navigation.**
  - `(app)/`: Authenticated routes.
  - `(tabs)/`: Main navigation tabs.
  - `game/`: Dynamic game routes `[id].tsx`.
- `components/`: **UI Library.**
  - `Themed*`: Components that automatically respond to light/dark mode.
  - `ui/`: Platform-specific implementations (e.g., `IconSymbol`).
- `contexts/`: **State Management.**
  - `auth.context.tsx`: Handles session and login state.
  - `games.context.tsx`: Handles games data and CRUD operations.
- `hooks/`: **Reusable Logic.**
  - `useThemeColor.ts`: Utility for dynamic colors.
  - `useStorageState.ts`: Persistent storage (SecureStore).
- `constants/`: **Design System.**
  - `Colors.ts`: Theme definitions.
  - `TailwindClass.ts`: Reusable tailwind string constants.
- `translation/`: i18n initialization and types.
- `public/translation/`: JSON translation files.

### Key File Locations
- Root Layout: `app/_layout.tsx`
- App Entry: `expo-router/entry` (defined in `package.json`)
- Global Styles: `global.css`
- Tailwind Config: `tailwind.config.js`
