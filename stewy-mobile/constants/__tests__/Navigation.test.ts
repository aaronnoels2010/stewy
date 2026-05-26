import en from "@/public/translation/en.json";
import nl from "@/public/translation/nl.json";
import { Navigation } from "@/constants/Navigation";

describe("Navigation", () => {
  it("has a ClubManagement entry with correct href and name", () => {
    expect(Navigation.ClubManagement).toBeDefined();
    expect(Navigation.ClubManagement.href).toBe(
      "/(app)/(tabs)/club-management"
    );
    expect(Navigation.ClubManagement.name).toBe("club-management");
  });
});

describe("Translations", () => {
  it("has all navigation keys in english", () => {
    expect(en.navigation?.dashboard).toBeDefined();
    expect(en.navigation?.games).toBeDefined();
    expect(en.navigation?.invitations).toBeDefined();
    expect(en.navigation?.volunteers).toBeDefined();
    expect(en.navigation?.profile).toBeDefined();
    expect(en.navigation?.clubManagement).toBeDefined();
  });

  it("has all navigation keys in dutch", () => {
    expect(nl.navigation?.dashboard).toBeDefined();
    expect(nl.navigation?.games).toBeDefined();
    expect(nl.navigation?.invitations).toBeDefined();
    expect(nl.navigation?.volunteers).toBeDefined();
    expect(nl.navigation?.profile).toBeDefined();
    expect(nl.navigation?.clubManagement).toBeDefined();
  });
});
