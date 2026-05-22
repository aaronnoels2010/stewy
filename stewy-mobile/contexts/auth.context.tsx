import { useContext, createContext, useState, useEffect, useCallback, type PropsWithChildren } from 'react';
import { authService } from '@/services/auth.service';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { UserDto } from '@/types/api';

const TOKEN_KEY = 'auth-token';

interface AuthContextValue {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  user: UserDto | null;
  token: string | null;
  session: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  signIn: async () => {},
  signOut: () => {},
  user: null,
  token: null,
  session: null,
  isAdmin: false,
  isLoading: false,
  isAuthenticated: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        setTokenState(stored);
      }
      setIsLoading(false);
    } else {
      SecureStore.getItemAsync(TOKEN_KEY).then((stored) => {
        if (stored) {
          setTokenState(stored);
        }
        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    authService.getMe()
      .then(setUser)
      .catch(() => {
        setTokenState(null);
        setUser(null);
      });
  }, [token]);

  const session = token;
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN';

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setTokenState(response.token);
    setUser(response.user);

    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, response.token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
    }

    // Register push token if on native platform
    if (Platform.OS !== 'web') {
      try {
        const { notificationService } = await import('@/services/notification.service');
        const Notifications = await import('expo-notifications');
        const Device = await import('expo-device');
        if (Device.default.isDevice) {
          const { status: existingStatus } = await Notifications.default.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.default.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus === 'granted') {
            const pushTokenData = await Notifications.default.getExpoPushTokenAsync();
            await notificationService.updatePushToken(pushTokenData.data);
          }
        }
      } catch {
        // Push notifications not available - silently skip
      }
    }
  }, []);

  const signOut = useCallback(() => {
    setTokenState(null);
    setUser(null);
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        token,
        session,
        isAdmin,
        isLoading,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
