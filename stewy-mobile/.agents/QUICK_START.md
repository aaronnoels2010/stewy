# Quick Start (stewy-mobile)

### Essential Commands
```bash
# Development
npm start          # Start Expo server (default)
npm run ios        # Start on iOS Simulator
npm run android    # Start on Android Emulator
npm run web        # Start on Web browser

# Quality Control
npm run lint       # Run ESLint
npm run test       # Run Jest tests
npm run test -- -u # Update Jest snapshots

# Maintenance
node ./scripts/reset-project.js # Clear example code
```

### Common Workflows

#### Adding a New Screen
1. Create a new file in `app/` (e.g., `app/new-screen.tsx`).
2. Export a default function component.
3. Update navigation if necessary (e.g., in `app/(tabs)/_layout.tsx`).

#### Adding a New Component
1. Create file in `components/`.
2. Use `ThemedView` and `ThemedText` for basic layout.
3. Use NativeWind `className` for styling.

#### Adding a Translation Key
1. Open `public/translation/en.json`.
2. Add key-value pair.
3. Repeat for `public/translation/nl.json`.
4. Use in code: `const { t } = useTranslation(); t('new_key');`
