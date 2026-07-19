// theme.ts
// GlobalWorkers — Design Tokens (React Native / Expo)
//
// Palette derived from the GlobalWorkers logo:
//  - Deep navy from the cat silhouette + "Global" wordmark
//  - Sky-blue → navy gradient from the globe
//  - White / near-white background (the logo sits on transparency)

export const colors = {
  white: '#FFFFFF',
  mist: '#EFF5FC',        // page backdrop tint, pale sky
  skyLight: '#6FC0F0',    // globe highlight (top-left of the sphere)
  sky: '#4A8FE0',         // globe mid-tone
  blue: '#2F6FCB',        // primary brand blue ("Workers" wordmark)
  blueDeep: '#14284D',    // navy ("Global" wordmark / cat silhouette)
  ink: '#101C2C',         // body text — near-navy-black, not pure black
  muted: '#5B6B85',       // secondary text
  hairline: 'rgba(20,40,77,0.12)',
  chipBg: '#EFF5FC',
  overlay: 'rgba(20,40,77,0.06)',
} as const;

// Tuples typed `as const` so they satisfy expo-linear-gradient's readonly
// [string, string, ...string[]] color array requirement.
export const gradients = {
  pageBackdrop: ['#FFFFFF', '#F3F8FD', '#E9F2FB'] as const,
  globe: ['#6FC0F0', '#2F6FCB', '#14284D'] as const,       // mirrors the logo's globe
  primaryButton: ['#4A8FE0', '#14284D'] as const,
} as const;

export const typography = {
  fontFamily: {
    displayBlack: 'ZenKakuGothicNew_900Black',
    displayBold: 'ZenKakuGothicNew_700Bold',
    medium: 'ZenKakuGothicNew_500Medium',
    regular: 'ZenKakuGothicNew_400Regular',
    latin: 'Sora_600SemiBold', // for the "GLOBALWORKERS" Latin wordmark/eyebrow
  },
  size: {
    eyebrow: 14,
    h1: 40,
    sub: 18,
    button: 16,
    chip: 14,
  },
  lineHeight: {
    h1: 48,
    sub: 25,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  pill: 999,
} as const;

export const shadow = {
  button: {
    shadowColor: colors.blueDeep,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

const theme = { colors, gradients, typography, spacing, radii, shadow };
export default theme;

