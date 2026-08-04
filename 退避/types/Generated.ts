export type ScreenNode =
  | { type: 'text'; text: string }
  | { type: 'icon'; name: string; classes?: string[] }
  | {
      type: 'element'
      tag: string
      classes: string[]
      attrs: Record<string, unknown>
      children: ScreenNode[]
    }

export type ScreenConfig = {
  screenId: string
  route: string
  title: string
  group: 'public' | 'auth' | 'mypage' | 'company' | 'admin'
  content: ScreenNode
}
