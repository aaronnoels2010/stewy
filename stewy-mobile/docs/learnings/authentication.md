# Authentication Flow (stewy-mobile)

### Provider: AuthContext
Located in `contexts/auth.context.tsx`.

### Flow
1. **App Load**: `app/_layout.tsx` mounts `AuthProvider`.
2. **Session Check**: `useStorageState` retrieves session from `expo-secure-store`.
3. **Redirection**:
   - If `session` is null -> User redirected to `app/sign-in.tsx`.
   - If `session` exists -> User allowed into `app/(app)/`.

### Storage
Uses `expo-secure-store` for safe storage of tokens/session data on device.

### Mock Auth
Currently implemented as a simple mock for development. Replace with real API calls in `signIn` and `signOut` methods as needed.
