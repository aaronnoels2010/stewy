# State Management (stewy-mobile)

### Approach: React Context API
The project uses Context for global state to keep dependencies low and utilize native React features.

### Current Contexts
- `AuthContext` (`contexts/auth.context.tsx`):
  - Manages `user`, `isLoading`, `session`.
  - Provides `signIn`, `signOut` methods.
- `GamesContext` (`contexts/games.context.tsx`):
  - Manages list of `games`.
  - Provides CRUD: `addGame`, `updateGame`, `deleteGame`.

### Usage Pattern
```tsx
import { useGames } from '@/contexts/games.context';
const { games, addGame } = useGames();
```

### Best Practices
- Keep Context providers as high as possible (`app/_layout.tsx`).
- Memoize context values to prevent unnecessary re-renders.
- Use custom hooks (`useAuth`, `useGames`) to expose context values rather than `useContext(MyContext)` directly.
