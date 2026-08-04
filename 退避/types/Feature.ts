import { Ionicons } from '@expo/vector-icons'

export type Feature = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
}
