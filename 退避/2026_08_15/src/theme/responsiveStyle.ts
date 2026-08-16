import { layoutFixes } from "@/theme/layoutFixes";
import { responsiveStyles, responsiveTextStyle } from "@/theme/themeUtils";

// 基礎のスタイル設定
export function baseStyle(names: string[], width: number) {
  return responsiveStyles(names, width);
}

export function textStyle(names: string[], width: number) {
  return responsiveTextStyle(names, width);
}

export function layoutFixStyle(classes: readonly string[], width: number) {
  return layoutFixes(classes, width);
}
