# Routing & Navigation (stewy-mobile)

### Framework: Expo Router
File-based routing based on the `app/` directory.

### Structure
- `(app)/`: Group for authenticated routes.
- `(tabs)/`: Bottom tab navigation.
- `game/[id].tsx`: Dynamic route for specific games.
- `_layout.tsx`: Defines the navigation structure (Stack, Tabs).

### Navigating
- **Link Component**: For declarative navigation.
  ```tsx
  <Link href="/game/123">View Game</Link>
  ```
- **Router Hook**: For programmatic navigation.
  ```tsx
  const router = useRouter();
  router.push('/sign-in');
  ```

### Protected Routes
Handled in `app/(app)/_layout.tsx` by checking the `session` from `AuthContext`. If no session, it redirects to `/sign-in`.
