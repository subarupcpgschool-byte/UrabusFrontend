import { StyleSheet, TextStyle } from 'react-native'

import {
  BREAKPOINTS,
  mobileStyles,
  styles,
  tabletStyles
} from '@/theme/GlobalWorkersStyles'



type AnyStyleMap = Record<string, unknown>

const base = styles as unknown as AnyStyleMap
const tablet = tabletStyles as unknown as AnyStyleMap
const mobile = mobileStyles as unknown as AnyStyleMap

const TEXT_PROPERTIES = new Set<keyof TextStyle>([
  'color',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'fontVariant',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textAlignVertical',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationStyle',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'userSelect'
])

export function cssClassToThemeKey(value: string): string {
  const parts = value.split(/[-_]+/g).filter(Boolean)

  if (parts.length === 0) {
    return value
  }

  return (
    parts[0] +
    parts
      .slice(1)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  )
}

export function pascal(value: string): string {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function hasThemeStyle(name: string): boolean {
  return name in base || name in tablet || name in mobile
}

export function responsiveStyle(name: string, width: number): any[] {
  const result: unknown[] = []

  if (name in base) {
    result.push(base[name])
  }

  if (width < BREAKPOINTS.desktop && name in tablet) {
    result.push(tablet[name])
  }

  if (width < BREAKPOINTS.tablet && name in mobile) {
    result.push(mobile[name])
  }

  return result
}

export function responsiveStyles(
  names: readonly string[],
  width: number
): unknown[] {
  const result: unknown[] = []
  const unique = [...new Set(names)]

  unique.forEach(name => {
    result.push(...responsiveStyle(name, width))
  })

  return result
}

export function responsiveTextStyle(
  names: readonly string[],
  width: number
): TextStyle {
  const flattened = StyleSheet.flatten(
    responsiveStyles(names, width) as never
  ) as Record<string, unknown> | undefined

  if (!flattened) {
    return {}
  }

  const textStyle: Record<string, unknown> = {}

  Object.entries(flattened).forEach(([key, value]) => {
    if (TEXT_PROPERTIES.has(key as keyof TextStyle)) {
      textStyle[key] = value
    }
  })

  return textStyle as TextStyle
}
