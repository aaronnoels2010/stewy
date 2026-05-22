# Theming & Tailwind (stewy-mobile)

### Tech Stack: NativeWind v4
NativeWind allows using Tailwind CSS classes in React Native.

### Design Tokens
- **Colors**: Defined in `constants/Colors.ts`.
- **Tailwind Config**: `tailwind.config.js` maps tokens to Tailwind classes.
- **Global CSS**: `global.css` contains root styles and CSS variables.

### Dark Mode
- Handled via `nativewind` "class" strategy.
- Toggle using `useColorScheme` hook or system settings.
- Usage: `className="text-black dark:text-white"`.

### Themed Hooks
- `useThemeColor`: Low-level hook to get color values for a specific theme.
- `useDesignTokens`: High-level hook for spacing, colors, and typography.
- `useTailwindThemeClass`: Helper for dynamic class generation.

### Best Practices
- Avoid hardcoded hex codes in components.
- Use semantic names from `Colors.ts` (e.g., `tabIconSelected`).
- Prefer `Themed*` components over raw `View` + `className` when possible.
