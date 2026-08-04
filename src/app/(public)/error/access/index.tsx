import GeneratedScreen from "@/components/generated/GeneratedScreen";
import type { ScreenConfig } from "@/types/Generated";

const screen = {
  screenId: "SC-PB-016",
  route: "/error/access",
  title: "権限・上限エラー案内",
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
                children: [{ type: "text", text: "エラー" }],
              },
              {
                type: "element",
                tag: "h1",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "権限・上限エラー案内" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "権限不足、求人公開枠超過、契約制限時の理由と次の操作を表示する",
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
        classes: ["two-col"],
        attrs: {},
        children: [
          {
            type: "element",
            tag: "article",
            classes: ["content-card"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "権限・上限エラー案内" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "権限不足、求人公開枠超過、契約制限時の理由と次の操作を表示する",
                  },
                ],
              },
              {
                type: "element",
                tag: "div",
                classes: ["placeholder-visual"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "span",
                    classes: [],
                    attrs: {},
                    children: [
                      {
                        type: "icon",
                        name: "ellipse-outline",
                        classes: ["icon"],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "strong",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "画面コンテンツ" }],
                  },
                  {
                    type: "element",
                    tag: "p",
                    classes: [],
                    attrs: {},
                    children: [
                      {
                        type: "text",
                        text: "この画面に必要な情報、操作、ステータスを配置する想定です。",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "element",
            tag: "aside",
            classes: ["content-card"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "基本情報" }],
              },
              {
                type: "element",
                tag: "dl",
                classes: ["info-list"],
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
                        tag: "dt",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "画面ID" }],
                      },
                      {
                        type: "element",
                        tag: "dd",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "SC-PB-016" }],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "div",
                    classes: [],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "dt",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "利用者" }],
                      },
                      {
                        type: "element",
                        tag: "dd",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "共通" }],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "div",
                    classes: [],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "dt",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "分類" }],
                      },
                      {
                        type: "element",
                        tag: "dd",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "エラー" }],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "div",
                    classes: [],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "dt",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "認証" }],
                      },
                      {
                        type: "element",
                        tag: "dd",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "状況による" }],
                      },
                    ],
                  },
                ],
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
