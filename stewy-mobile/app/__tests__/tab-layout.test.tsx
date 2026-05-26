import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));

jest.mock("@/hooks/usePlatform", () => ({
  usePlatform: () => ({ isMobile: true }),
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

const mockUseSession = jest.fn();
jest.mock("@/contexts/auth.context", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("@/components/HapticTab", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    HapticTab: (p: any) => R.createElement(RN.TouchableOpacity, p),
  };
});

jest.mock("@/components/ui/IconSymbol", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    IconSymbol: () => R.createElement(RN.View),
  };
});

jest.mock("@/components/ui/TabBarBackground", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    default: () => R.createElement(RN.View),
  };
});

jest.mock("@/constants/Colors", () => ({
  Colors: { light: { tint: "#006B22" }, dark: { tint: "#006B22" } },
}));

jest.mock("@/hooks/useColorScheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("expo-router", () => {
  const R = require("react");
  const RN = require("react-native");
  const Tabs = ({ children }: any) =>
    R.createElement(RN.View, { testID: "tabs" }, children);
  Tabs.Screen = ({ name }: { name: string }) =>
    R.createElement(RN.View, { testID: `tab-screen-${name}` });
  return { Tabs };
});

jest.mock("@/components/LanguageSwitcher", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    LanguageSwitcher: () => R.createElement(RN.View),
  };
});

jest.mock("@/components/ThemeSwitcher", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemeSwitcher: () => R.createElement(RN.View),
  };
});

jest.mock("@/components/ThemedLink", () => {
  const R = require("react");
  const RN = require("react-native");
  return {
    ThemedLink: ({ to, children }: any) =>
      R.createElement(RN.TouchableOpacity, { testID: `link-${to}` }, children),
  };
});

import TabLayout from "@/app/(app)/(tabs)/_layout";

describe("TabLayout (mobile)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tab screens but hides unauthorized ones via href=null", () => {
    mockUseSession.mockReturnValue({
      isProfileApproved: false,
      isAdmin: false,
      isHoofdSteward: false,
    });

    const { getByTestId } = render(<TabLayout />);

    expect(getByTestId("tab-screen-index")).toBeDefined();
    expect(getByTestId("tab-screen-profile")).toBeDefined();
    expect(getByTestId("tab-screen-games")).toBeDefined();
    expect(getByTestId("tab-screen-invitations")).toBeDefined();
    expect(getByTestId("tab-screen-volonteers")).toBeDefined();
    expect(getByTestId("tab-screen-club-management")).toBeDefined();
  });
});
