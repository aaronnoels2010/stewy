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

export const Navigation = {
  Root,
  Explore,
};
