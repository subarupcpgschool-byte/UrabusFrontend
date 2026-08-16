import { useWindowDimensions } from "react-native";

export const BREAKPOINTS = {
  tablet: 768,
  wide: 900,
  desktop: 1200,
} as const;

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isTablet: width >= BREAKPOINTS.tablet,
    isWide: width >= BREAKPOINTS.wide,
    isDesktop: width >= BREAKPOINTS.desktop,
    pagePadding: width >= BREAKPOINTS.wide ? 24 : 14,
    maxContentWidth: 1280,
  };
}
