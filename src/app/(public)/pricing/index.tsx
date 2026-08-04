import GeneratedScreen from "@/components/generated/GeneratedScreen";
import type { ScreenConfig } from "@/types/Generated";

const screen = {
  screenId: "SC-PB-013",
  route: "/pricing",
  title: "料金・プラン案内",
  group: "public",
  content: {
    type: "element",
    tag: "main",
    classes: ["public-main"],
    attrs: {},
    children: [
      {
        type: "element",
        tag: "div",
        classes: ["public-page-title"],
        attrs: {},
        children: [
          {
            type: "element",
            tag: "div",
            classes: [],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "span",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "料金" }],
              },
              {
                type: "element",
                tag: "h1",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "料金・プラン案内" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "無料枠、有料条件、評価協力率と月額料金の考え方を表示する",
                  },
                ],
              },
            ],
          },
          {
            type: "element",
            tag: "span",
            classes: ["badge", "badge-green"],
            attrs: {},
            children: [{ type: "text", text: "〇 初期公開" }],
          },
        ],
      },
      {
        type: "element",
        tag: "div",
        classes: ["pricing-head"],
        attrs: {},
        children: [
          {
            type: "element",
            tag: "h2",
            classes: [],
            attrs: {},
            children: [
              { type: "text", text: "評価に協力する企業ほど、お得に。" },
            ],
          },
          {
            type: "element",
            tag: "p",
            classes: [],
            attrs: {},
            children: [
              {
                type: "text",
                text: "採用成功報酬は0円。公開求人2件までは無料です。",
              },
            ],
          },
          {
            type: "element",
            tag: "div",
            classes: ["billing-toggle"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "span",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "月払い" }],
              },
              {
                type: "element",
                tag: "i",
                classes: [],
                attrs: {},
                children: [],
              },
              {
                type: "element",
                tag: "span",
                classes: [],
                attrs: {},
                children: [
                  { type: "text", text: "年払い" },
                  {
                    type: "element",
                    tag: "span",
                    classes: ["badge", "badge-green"],
                    attrs: {},
                    children: [{ type: "text", text: "2か月分お得" }],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "element",
        tag: "div",
        classes: ["pricing-grid", "justify-center"],
        attrs: {},
        children: [
          {
            type: "element",
            tag: "article",
            classes: [],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "フリー" }],
              },
              {
                type: "element",
                tag: "div",
                classes: ["plan-price"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "b",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "0" }],
                  },
                  {
                    type: "element",
                    tag: "span",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "円／月" }],
                  },
                ],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "小規模な採用を無料で開始" }],
              },
              {
                type: "element",
                tag: "ul",
                classes: ["check-list"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "公開求人2件" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "採用人数無制限" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "チャット・評価" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "応募者管理" }],
                  },
                ],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-ghost", "full"],
                attrs: {},
                children: [{ type: "text", text: "無料で始める" }],
              },
            ],
          },
          {
            type: "element",
            tag: "article",
            classes: ["featured"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "div",
                classes: ["recommended"],
                attrs: {},
                children: [{ type: "text", text: "おすすめ" }],
              },
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "評価協力プラン" }],
              },
              {
                type: "element",
                tag: "div",
                classes: ["plan-price"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "b",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "6,000" }],
                  },
                  {
                    type: "element",
                    tag: "span",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "円〜／月" }],
                  },
                ],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  { type: "text", text: "採用実績と評価協力率に応じて変動" },
                ],
              },
              {
                type: "element",
                tag: "ul",
                classes: ["check-list"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "公開求人10件" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "評価協力率で最大割引" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "従業員管理20名" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "基本勤怠管理" }],
                  },
                ],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-primary", "full"],
                attrs: {},
                children: [{ type: "text", text: "プランを選択" }],
              },
            ],
          },
          {
            type: "element",
            tag: "article",
            classes: [],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "ビジネス" }],
              },
              {
                type: "element",
                tag: "div",
                classes: ["plan-price"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "b",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "10,000" }],
                  },
                  {
                    type: "element",
                    tag: "span",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "円／月" }],
                  },
                ],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "複数拠点・詳細な勤怠管理" }],
              },
              {
                type: "element",
                tag: "ul",
                classes: ["check-list"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "公開求人30件" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "従業員管理50名" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "シフト・休暇承認" }],
                  },
                  {
                    type: "element",
                    tag: "li",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "詳細権限・監査ログ" }],
                  },
                ],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-ghost", "full"],
                attrs: {},
                children: [{ type: "text", text: "詳細を見る" }],
              },
            ],
          },
        ],
      },
    ],
  },
} as ScreenConfig;

export default function Screen() {
  return <GeneratedScreen screen={screen} />;
}
