import { Href } from "expo-router";

export type NavigationItem = {
  href: Href;
  name: string;
};

const Root: NavigationItem = { href: "/(app)/(tabs)", name: "index" };
const Explore: NavigationItem = {
  href: "/(app)/(tabs)/explore",
  name: "explore",
};
const Volonteers: NavigationItem = {
  href: "/(app)/(tabs)/volonteers",
  name: "volonteers",
};
const Games: NavigationItem = {
  href: "/(app)/(tabs)/games",
  name: "games",
};

const Profile: NavigationItem = {
  href: "/(app)/(tabs)/profile",
  name: "profile",
};

const Invitations: NavigationItem = {
  href: "/(app)/(tabs)/invitations" as any,
  name: "invitations",
};

export const Navigation = {
  Root,
  Explore,
  Volonteers,
  Games,
  Profile,
  Invitations,
};
