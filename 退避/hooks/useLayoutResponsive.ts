import { useEffect, useMemo, useState } from 'react'
import { Platform, useWindowDimensions } from 'react-native'

export function useLayoutResponsive () {
  const { width, height } = useWindowDimensions()

  const [isWebReady, setIsWebReady] = useState(Platform.OS !== 'web')

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsWebReady(true)
    }
  }, [])

  const isDesktop = width >= 1040
  const isTablet = width >= 720
  const isMobile = width < 720

  const pagePadding = useMemo(() => {
    if (width >= 1280) return 48
    if (width >= 720) return 28
    return 18
  }, [width])

  return {
    width,
    height,

    isWebReady,

    isDesktop,
    isTablet,
    isMobile,

    pagePadding
  }
}
