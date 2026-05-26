import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import ProfileScreen from "@/app/(app)/(tabs)/profile";

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

jest.mock("@/contexts/auth.context", () => {
  const mock = {
    user: { id: "u1", role: "VOLUNTEER" },
    signOut: jest.fn(),
    isAdmin: false,
  };
  return {
    useSession: () => mock,
    __setSession: (overrides: Record<string, unknown>) => {
      Object.assign(mock, overrides);
    },
  };
});

jest.mock("@/services/volunteer.service", () => ({
  volunteerService: {
    getMyProfile: jest.fn(),
  },
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

jest.mock("@/components/ThemedBadge", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemedBadge: (p: any) =>
      R.createElement(RN.View, null, p.label ?? p.children),
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

jest.mock("@/components/VolunteerProfileForm", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    VolunteerProfileForm: (p: any) =>
      R.createElement(RN.View, { testID: "volunteer-profile-form" }),
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
  router: { push: jest.fn() },
}));

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { volunteerService } = require("@/services/volunteer.service");
    volunteerService.getMyProfile.mockResolvedValue({
      id: "vp1",
      role: "HOOFD_STEWARD",
      club: { id: "c1", name: "Test Club" },
      kbvbId: "KBVB001",
      profileStatus: "APPROVED",
    });
  });

  it("does not render Club Management CTA button even for HOOFD_STEWARD", async () => {
    const { queryByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(queryByText("KBVB: KBVB001")).not.toBeNull();
    });

    expect(queryByText("Club Management")).toBeNull();
  });
});
