# Component Patterns (stewy-mobile)

### Themed Components
The project provides a set of `Themed*` components in `components/` that automatically handle light/dark mode based on `constants/Colors.ts`.

- `ThemedView`: Standard container.
- `ThemedText`: Handles typography levels (`default`, `title`, `subtitle`, `link`, `defaultSemiBold`).
- `ThemedButton`: Custom button with themed styles.
- `ThemedCard`: Pre-styled container for items.

### Layout Patterns
- **Padding/Spacing**: Use `constants/Spacing.ts` or Tailwind classes (`p-4`, `m-2`).
- **Icons**: Use `IconSymbol` which abstracts platform differences (SFSymbols on iOS, MaterialIcons on others).

### Form Patterns
- Use `ThemedInput` for text fields.
- Wrap forms in `KeyboardAvoidingView` where necessary.
- Validation: Currently handled manually or with simple state checks.

### Reusability
- Extract complex UI into small, stateless components.
- Use `tailwind-variants` for components with multiple states/sizes.
