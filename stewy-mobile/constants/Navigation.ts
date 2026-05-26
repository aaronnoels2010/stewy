import { Href } from "expo-router";

export type NavigationItem = {
  href: Href;
  name: string;
};

const Dashboard: NavigationItem = { href: "/(app)/(tabs)", name: "index" };
const Games: NavigationItem = {
  href: "/(app)/(tabs)/games",
  name: "games",
};
const Invitations: NavigationItem = {
  href: "/(app)/(tabs)/invitations" as any,
  name: "invitations",
};
const Profile: NavigationItem = {
  href: "/(app)/(tabs)/profile",
  name: "profile",
};
const Volonteers: NavigationItem = {
  href: "/(app)/(tabs)/volonteers" as any,
  name: "volonteers",
};
const ClubManagement: NavigationItem = {
  href: "/(app)/(tabs)/club-management",
  name: "club-management",
};

export const Navigation = {
  Dashboard,
  Games,
  Invitations,
  Profile,
  Volonteers,
  ClubManagement,
};
