import { useContext, createContext, useState, useEffect, useCallback, type PropsWithChildren } from 'react';
import { authService } from '@/services/auth.service';
import { volunteerService } from '@/services/volunteer.service';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { UserDto, VolunteerProfileResponse } from '@/types/api';

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
  profile: VolunteerProfileResponse | null;
  profileStatus: string | null;
  volunteerRole: string | null;
  isProfileApproved: boolean;
  isHoofdSteward: boolean;
  isProfileLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const noop = async () => {};

const AuthContext = createContext<AuthContextValue>({
  signIn: async () => {},
  signOut: () => {},
  user: null,
  token: null,
  session: null,
  isAdmin: false,
  isLoading: false,
  isAuthenticated: false,
  profile: null,
  profileStatus: null,
  volunteerRole: null,
  isProfileApproved: false,
  isHoofdSteward: false,
  isProfileLoading: false,
  refreshProfile: noop,
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
  const [profile, setProfile] = useState<VolunteerProfileResponse | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

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

  const fetchProfile = useCallback(async () => {
    if (!token || !user) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }
    setIsProfileLoading(true);
    try {
      const p = await volunteerService.getMyProfile();
      setProfile(p);
    } catch {
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const session = token;
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN';
  const profileStatus = profile?.profileStatus ?? null;
  const volunteerRole = profile?.role ?? null;
  const isProfileApproved = profileStatus === 'APPROVED';
  const isHoofdSteward = volunteerRole === 'HOOFD_STEWARD';

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
    setProfile(null);
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
        profile,
        profileStatus,
        volunteerRole,
        isProfileApproved,
        isHoofdSteward,
        isProfileLoading,
        refreshProfile: fetchProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
