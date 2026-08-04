import GeneratedScreen from "@/components/generated/GeneratedScreen";
import type { ScreenConfig } from "@/types/Generated";

const screen = {
  screenId: "SC-PB-015",
  route: "/terms",
  title: "利用規約・プライバシー",
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
                children: [{ type: "text", text: "規約" }],
              },
              {
                type: "element",
                tag: "h1",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "利用規約・プライバシー" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "利用規約、プライバシーポリシー、評価投稿ガイドラインを表示する",
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
        classes: ["document-layout"],
        attrs: {},
        children: [
          {
            type: "element",
            tag: "aside",
            classes: [],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "a",
                classes: ["active"],
                attrs: {},
                children: [{ type: "text", text: "利用規約" }],
              },
              {
                type: "element",
                tag: "a",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "プライバシーポリシー" }],
              },
              {
                type: "element",
                tag: "a",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "評価ガイドライン" }],
              },
              {
                type: "element",
                tag: "a",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "特定商取引法表記" }],
              },
            ],
          },
          {
            type: "element",
            tag: "article",
            classes: ["content-card", "prose"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "h2",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "GlobalWorkers 利用規約" }],
              },
              {
                type: "element",
                tag: "p",
                classes: ["updated"],
                attrs: {},
                children: [{ type: "text", text: "最終更新日：2026年7月31日" }],
              },
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "第1条（目的）" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "本規約は、GlobalWorkersが提供する求人掲載、応募、チャット、評価、雇用管理サービスの利用条件を定めるものです。",
                  },
                ],
              },
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "第2条（アカウント）" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "利用者は、正確かつ最新の情報を登録し、アカウントを適切に管理するものとします。",
                  },
                ],
              },
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "第3条（評価）" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "評価は実際の応募・採用・勤務実績に基づき、客観的かつ誠実に投稿してください。",
                  },
                ],
              },
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "第4条（禁止事項）" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "虚偽情報、差別的表現、第三者の権利を侵害する内容の投稿を禁止します。",
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
