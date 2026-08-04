import GeneratedScreen from "@/components/generated/GeneratedScreen";
import type { ScreenConfig } from "@/types/Generated";

const screen = {
  screenId: "SC-US-011",
  route: "/jobs/{jobId}/apply/complete",
  title: "応募完了",
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
                children: [{ type: "text", text: "応募完了" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "応募完了と応募チャット作成を案内する",
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
        classes: ["center-card", "success-card"],
        attrs: {},
        children: [
          {
            type: "element",
            tag: "div",
            classes: ["success-icon"],
            attrs: {},
            children: [
              { type: "icon", name: "ellipse-outline", classes: ["icon"] },
            ],
          },
          {
            type: "element",
            tag: "h2",
            classes: [],
            attrs: {},
            children: [{ type: "text", text: "応募が完了しました" }],
          },
          {
            type: "element",
            tag: "p",
            classes: [],
            attrs: {},
            children: [
              {
                type: "text",
                text: "株式会社ブルースカイへ応募情報を送信しました。企業からの連絡はチャットと通知でお知らせします。",
              },
            ],
          },
          {
            type: "element",
            tag: "div",
            classes: ["next-steps"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "span",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "1 応募完了" }],
              },
              {
                type: "element",
                tag: "span",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "2 企業が確認" }],
              },
              {
                type: "element",
                tag: "span",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "3 チャットで連絡" }],
              },
            ],
          },
          {
            type: "element",
            tag: "button",
            classes: ["btn", "btn-primary"],
            attrs: {},
            children: [{ type: "text", text: "応募履歴を確認" }],
          },
        ],
      },
    ],
  },
} as ScreenConfig;

export default function Screen() {
  return <GeneratedScreen screen={screen} />;
}
