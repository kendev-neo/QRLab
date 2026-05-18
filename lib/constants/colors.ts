/**
 * Color Constants
 *
 * All color values used throughout the application
 */

export const COLORS = {
  // Primary colors
  cream: "#FFF8F0",
  creamDeep: "#F4F1ED",
  ink: "#4A4658",
  inkSoft: "#8B8799",
  inkFaint: "#B8B4C4",

  // Accent colors
  mint: "#10B981",
  mintDeep: "#059669",
  lavender: "#A78BFA",
  peach: "#FB923C",
  peachDeep: "#F472B6",
  rose: "#F43F5E",

  // QR background colors
  white: "#FFFFFF",
  blush: "#FFE6E1",
  lilac: "#F1ECFF",
  mintAir: "#E6F6EF",
  skyAir: "#EAF3FF",
  butter: "#FFF7DA",
  pearl: "#F4F1ED",
} as const;

export const COLOR_PRESETS = [
  { name: "Peach", colors: ["#F472B6", "#FB923C"] as [string, string] },
  { name: "Strawberry", colors: ["#F43F5E", "#FB7185"] as [string, string] },
  { name: "Mint", colors: ["#10B981", "#34D399"] as [string, string] },
  { name: "Sky", colors: ["#3B82F6", "#60A5FA"] as [string, string] },
  { name: "Mono", colors: ["#4A4658", "#8B8799"] as [string, string] },
] as const;

export const DOT_COLORS = [
  "#000000",
  "#F472B6",
  "#FB923C",
  "#10B981",
  "#3B82F6",
  "#6B7280",
  "#F43F5E",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#A78BFA",
] as const;

export const EYE_COLORS = [
  "#000000",
  "#F472B6",
  "#FB923C",
  "#10B981",
  "#3B82F6",
  "#6B7280",
  "#F43F5E",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#A78BFA",
] as const;

export const BACKGROUND_COLORS = [
  "#FFF8F0", // Cream
  "#FFFFFF", // White
  "#FFE6E1", // Blush
  "#F1ECFF", // Lilac
  "#E6F6EF", // Mint Air
  "#EAF3FF", // Sky Air
  "#FFF7DA", // Butter
  "#F4F1ED", // Pearl
] as const;
