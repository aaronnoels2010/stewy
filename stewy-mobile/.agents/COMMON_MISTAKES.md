# Common Mistakes & Gotchas (stewy-mobile)

⚠️ **CRITICAL: Avoid these to prevent regressions and bugs.**

### 1. NativeWind v4 Specifics
- **Problem**: Styling not applying or behaving like web CSS.
- **Fix**: Remember that NativeWind translates Tailwind to React Native Styles. Avoid web-only properties (like `grid`). Use `className` but be aware of native layout constraints (Flexbox).

### 2. Expo Router Navigation
- **Problem**: Direct manipulation of navigation state bypassing the router.
- **Fix**: Always use `router` from `expo-router` for programmatic navigation. Ensure route names match the file structure in `app/`.

### 3. Dark Mode & Theming
- **Problem**: Hardcoding colors (e.g., `bg-white`).
- **Fix**: Use `useColorScheme` or `useThemeColor` hooks. Prefer `ThemedView`, `ThemedText`, etc., which handle colors automatically via `constants/Colors.ts`.

### 4. Safe Area Context
- **Problem**: Content overlapping status bar or notches.
- **Fix**: Use `SafeAreaView` from `react-native-safe-area-context` or appropriate padding using `useSafeAreaInsets`. Note that `app/_layout.tsx` usually handles the root.

### 5. i18n Key Management
- **Problem**: Missing translation keys or hardcoded strings.
- **Fix**: Always use `t('key')` from `useTranslation`. Add new keys to `public/translation/en.json` and `nl.json` simultaneously.

### 6. Fast Refresh / Expo State
- **Problem**: Global state (Context) not updating or causing infinite loops.
- **Fix**: Ensure `useEffect` dependencies are correct. Be careful with object/array dependencies in Context providers.
