# Quick Reference (stewy-mobile)

### Session Start Checklist
- [ ] Load `AGENTS.md`.
- [ ] Run `npm start` to ensure environment is up.
- [ ] Run `npm run lint` to check current state.

### Common Code Patterns

#### Functional Component (Themed)
```tsx
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function MyComponent() {
  return (
    <ThemedView className="p-4 bg-primary-100 dark:bg-primary-900">
      <ThemedText type="subtitle">Hello World</ThemedText>
    </ThemedView>
  );
}
```

#### Programmatic Navigation
```tsx
import { useRouter } from 'expo-router';
const router = useRouter();
router.push('/(app)/(tabs)/games');
```

#### Translation Usage
```tsx
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
<Text>{t('games.title')}</Text>
```

### Debugging Quick Tips
- **Metro Bundler Issues**: `npx expo start -c` (clear cache).
- **NativeWind Styles not updating**: Re-run `npm start`.
- **Context not updating**: Check if the Provider is wrapping the component in `app/_layout.tsx`.
