import GeneratedScreen from "@/components/generated/GeneratedScreen";
import type { ScreenConfig } from "@/types/Generated";

const screen = {
  screenId: "SC-US-010",
  route: "/jobs/{jobId}/apply",
  title: "求人応募確認",
  group: "public",
  content: {
    type: "element",
    tag: "main",
    classes: ["dashboard-main"],
    attrs: {},
    children: [
      {
        type: "element",
        tag: "div",
        classes: ["page-title"],
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
                children: [{ type: "text", text: "応募" }],
              },
              {
                type: "element",
                tag: "h1",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "求人応募確認" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "応募に使用するプロフィールと書類、企業へのメッセージを確認する",
                  },
                ],
              },
            ],
          },
          {
            type: "element",
            tag: "div",
            classes: ["page-title-actions"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "span",
                classes: ["badge", "badge-green"],
                attrs: {},
                children: [{ type: "text", text: "無料" }],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-ghost"],
                attrs: {},
                children: [
                  { type: "icon", name: "ellipse-outline", classes: ["icon"] },
                  { type: "text", text: "操作ガイド" },
                ],
              },
            ],
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
                children: [{ type: "text", text: "応募内容を確認" }],
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
                        children: [{ type: "text", text: "応募求人" }],
                      },
                      {
                        type: "element",
                        tag: "dd",
                        classes: [],
                        attrs: {},
                        children: [
                          { type: "text", text: "バックエンドエンジニア" },
                        ],
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
                        children: [{ type: "text", text: "企業" }],
                      },
                      {
                        type: "element",
                        tag: "dd",
                        classes: [],
                        attrs: {},
                        children: [
                          { type: "text", text: "株式会社ブルースカイ" },
                        ],
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
                        children: [{ type: "text", text: "履歴書" }],
                      },
                      {
                        type: "element",
                        tag: "dd",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "履歴書_2026.pdf" }],
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
                        children: [{ type: "text", text: "希望入社日" }],
                      },
                      {
                        type: "element",
                        tag: "dd",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "2026/09/01" }],
                      },
                    ],
                  },
                ],
              },
              {
                type: "element",
                tag: "label",
                classes: ["field"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "span",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "企業へのメッセージ" }],
                  },
                  {
                    type: "element",
                    tag: "textarea",
                    classes: [],
                    attrs: { rows: "5" },
                    children: [
                      {
                        type: "text",
                        text: "これまでのSpring Boot開発経験を活かし、貴社サービスに貢献したいと考えています。",
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
                tag: "div",
                classes: ["notice"],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "応募後、企業との専用チャットが作成されます。",
                  },
                ],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-primary", "btn-lg", "full"],
                attrs: {},
                children: [{ type: "text", text: "応募を確定する" }],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-ghost", "full"],
                attrs: {},
                children: [{ type: "text", text: "入力内容を修正" }],
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
