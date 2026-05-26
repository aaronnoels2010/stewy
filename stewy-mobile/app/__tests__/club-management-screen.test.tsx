import React from "react";
import { render, waitFor } from "@testing-library/react-native";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));

jest.mock("@/hooks/useDesignTokens", () => ({
  useDesignTokens: () => ({
    colors: {
      background: "#F2F5F7",
      accent: "#006B22",
      border: "#BECAB9",
      danger: "#BA1A1A",
    },
    isDark: false,
  }),
}));

jest.mock("@/contexts/auth.context", () => ({
  useSession: () => ({
    isAdmin: false,
  }),
}));

const mockApiGet = jest.fn();
jest.mock("@/services/api", () => ({
  api: {
    get: (...args: unknown[]) => mockApiGet(...args),
    put: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock("@/services/volunteer.service", () => ({
  volunteerService: {
    getMyProfile: jest.fn(),
  },
}));

jest.mock("@/services/club.service", () => ({
  clubService: {},
}));

jest.mock("@/components/ThemedText", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemedText: (p: any) =>
      R.createElement(RN.Text, null, p.children ?? p.type ?? ""),
  };
});

jest.mock("@/components/ThemedView", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemedView: (p: any) => R.createElement(RN.View, null, p.children),
  };
});

jest.mock("@/components/ThemedCard", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemedCard: (p: any) => R.createElement(RN.View, null, p.children),
  };
});

jest.mock("@/components/ThemedButton", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemedButton: ({ label, onPress }: any) =>
      R.createElement(
        RN.TouchableOpacity,
        { onPress, testID: `btn-${label}` },
        R.createElement(RN.Text, null, label)
      ),
  };
});

jest.mock("@/components/ThemedBadge", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemedBadge: (p: any) =>
      R.createElement(RN.View, null, p.label ?? p.children),
  };
});

jest.mock("@/components/ThemedInput", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemedInput: (p: any) => R.createElement(RN.TextInput, p),
  };
});

jest.mock("@/components/ui/IconSymbol", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    IconSymbol: () => R.createElement(RN.View),
  };
});

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => {
    const R = require("react");
    const RN = require("react-native");
    return R.createElement(RN.View, null, children);
  },
}));

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
}));

import ClubManagementScreen from "@/app/(app)/(tabs)/club-management";

describe("ClubManagementScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { volunteerService } = require("@/services/volunteer.service");
    volunteerService.getMyProfile.mockResolvedValue({
      id: "vp1",
      role: "HOOFD_STEWARD",
      club: { id: "c1", clubName: "Test Club" },
      firstName: "Test",
      lastName: "User",
      kbvbId: "KBVB001",
      profileStatus: "APPROVED",
    });
    mockApiGet.mockResolvedValue([]);
  });

  it("renders the club management title", async () => {
    const { getByText } = render(<ClubManagementScreen />);

    await waitFor(() => {
      expect(getByText("Club Management")).toBeDefined();
    });
  });
});
