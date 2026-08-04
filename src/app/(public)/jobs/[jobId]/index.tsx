import GeneratedScreen from "@/components/generated/GeneratedScreen";
import type { ScreenConfig } from "@/types/Generated";

const screen = {
  screenId: "SC-PB-003",
  route: "/jobs/{jobId}",
  title: "求人詳細",
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
                children: [{ type: "text", text: "求人検索" }],
              },
              {
                type: "element",
                tag: "h1",
                classes: [],
                attrs: {},
                children: [{ type: "text", text: "求人詳細" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "求人条件、企業情報、企業評価を確認し、応募・お気に入り・問い合わせへ進む",
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
        classes: ["detail-layout"],
        attrs: {},
        children: [
          {
            type: "element",
            tag: "main",
            classes: [],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "article",
                classes: ["detail-card"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "div",
                    classes: ["detail-header"],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "div",
                        classes: ["company-avatar", "xl"],
                        attrs: {},
                        children: [{ type: "text", text: "株" }],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: [],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "div",
                            classes: ["tag-row"],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "span",
                                classes: ["badge", "badge-blue"],
                                attrs: {},
                                children: [{ type: "text", text: "正社員" }],
                              },
                              {
                                type: "element",
                                tag: "span",
                                classes: ["badge", "badge-purple"],
                                attrs: {},
                                children: [
                                  { type: "text", text: "フルリモート" },
                                ],
                              },
                              {
                                type: "element",
                                tag: "span",
                                classes: ["badge", "badge-green"],
                                attrs: {},
                                children: [
                                  { type: "text", text: "評価協力率 96%" },
                                ],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "h2",
                            classes: [],
                            attrs: {},
                            children: [
                              { type: "text", text: "バックエンドエンジニア" },
                            ],
                          },
                          {
                            type: "element",
                            tag: "p",
                            classes: [],
                            attrs: {},
                            children: [
                              { type: "text", text: "株式会社ブルースカイ" },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "div",
                    classes: ["detail-facts"],
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
                            children: [{ type: "text", text: "給与" }],
                          },
                          {
                            type: "element",
                            tag: "b",
                            classes: [],
                            attrs: {},
                            children: [
                              { type: "text", text: "月給45万〜65万円" },
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
                            tag: "span",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "勤務地" }],
                          },
                          {
                            type: "element",
                            tag: "b",
                            classes: [],
                            attrs: {},
                            children: [
                              { type: "text", text: "全国／フルリモート" },
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
                            tag: "span",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "勤務時間" }],
                          },
                          {
                            type: "element",
                            tag: "b",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "9:00〜18:00" }],
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
                            tag: "span",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "雇用形態" }],
                          },
                          {
                            type: "element",
                            tag: "b",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "正社員" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
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
                    children: [{ type: "text", text: "仕事内容" }],
                  },
                  {
                    type: "element",
                    tag: "p",
                    classes: [],
                    attrs: {},
                    children: [
                      {
                        type: "text",
                        text: "求人・採用管理プラットフォームのバックエンド開発を担当します。Spring Boot、PostgreSQLを中心に、設計から運用まで携わっていただきます。",
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "h3",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "必須スキル" }],
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
                        children: [
                          {
                            type: "text",
                            text: "JavaまたはKotlinでの開発経験3年以上",
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "li",
                        classes: [],
                        attrs: {},
                        children: [
                          {
                            type: "text",
                            text: "Spring Bootを使用したAPI開発経験",
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "li",
                        classes: [],
                        attrs: {},
                        children: [
                          { type: "text", text: "RDBの設計・運用経験" },
                        ],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "h3",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "この求人の特徴" }],
                  },
                  {
                    type: "element",
                    tag: "div",
                    classes: ["tag-row"],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "span",
                        classes: ["badge", "badge-blue"],
                        attrs: {},
                        children: [{ type: "text", text: "副業可" }],
                      },
                      {
                        type: "element",
                        tag: "span",
                        classes: ["badge", "badge-blue"],
                        attrs: {},
                        children: [{ type: "text", text: "年間休日120日" }],
                      },
                      {
                        type: "element",
                        tag: "span",
                        classes: ["badge", "badge-blue"],
                        attrs: {},
                        children: [{ type: "text", text: "学歴不問" }],
                      },
                      {
                        type: "element",
                        tag: "span",
                        classes: ["badge", "badge-blue"],
                        attrs: {},
                        children: [{ type: "text", text: "オンライン面接" }],
                      },
                    ],
                  },
                ],
              },
              {
                type: "element",
                tag: "div",
                classes: ["review-summary"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "div",
                    classes: ["score-block"],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "strong",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "4.7" }],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["stars"],
                        attrs: {},
                        children: [{ type: "text", text: "★★★★★" }],
                      },
                      {
                        type: "element",
                        tag: "span",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "128件の評価" }],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "div",
                    classes: ["score-bars"],
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
                            children: [{ type: "text", text: "求人の正確さ" }],
                          },
                          {
                            type: "element",
                            tag: "i",
                            classes: [],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "b",
                                classes: [],
                                attrs: {},
                                children: [],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "strong",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "4.7" }],
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
                            tag: "span",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "連絡対応" }],
                          },
                          {
                            type: "element",
                            tag: "i",
                            classes: [],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "b",
                                classes: [],
                                attrs: {},
                                children: [],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "strong",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "4.5" }],
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
                            tag: "span",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "働きやすさ" }],
                          },
                          {
                            type: "element",
                            tag: "i",
                            classes: [],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "b",
                                classes: [],
                                attrs: {},
                                children: [],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "strong",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "4.4" }],
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
                            tag: "span",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "報酬の透明性" }],
                          },
                          {
                            type: "element",
                            tag: "i",
                            classes: [],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "b",
                                classes: [],
                                attrs: {},
                                children: [],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "strong",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "4.8" }],
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
                classes: ["review-list"],
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
                        tag: "div",
                        classes: ["review-head"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "div",
                            classes: ["avatar"],
                            attrs: {},
                            children: [{ type: "text", text: "1" }],
                          },
                          {
                            type: "element",
                            tag: "div",
                            classes: [],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "strong",
                                classes: [],
                                attrs: {},
                                children: [
                                  {
                                    type: "text",
                                    text: "安心して働ける企業でした",
                                  },
                                ],
                              },
                              {
                                type: "element",
                                tag: "div",
                                classes: ["stars", "small"],
                                attrs: {},
                                children: [{ type: "text", text: "★★★★★" }],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "time",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "2026/07/28" }],
                          },
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
                            text: "面接から勤務開始までの説明が丁寧で、求人条件との相違もありませんでした。",
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["tag-row"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-green"],
                            attrs: {},
                            children: [{ type: "text", text: "勤務確認済み" }],
                          },
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-blue"],
                            attrs: {},
                            children: [{ type: "text", text: "直接雇用" }],
                          },
                        ],
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
                        tag: "div",
                        classes: ["review-head"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "div",
                            classes: ["avatar"],
                            attrs: {},
                            children: [{ type: "text", text: "2" }],
                          },
                          {
                            type: "element",
                            tag: "div",
                            classes: [],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "strong",
                                classes: [],
                                attrs: {},
                                children: [
                                  {
                                    type: "text",
                                    text: "コミュニケーションがスムーズ",
                                  },
                                ],
                              },
                              {
                                type: "element",
                                tag: "div",
                                classes: ["stars", "small"],
                                attrs: {},
                                children: [{ type: "text", text: "★★★★★" }],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "time",
                            classes: [],
                            attrs: {},
                            children: [{ type: "text", text: "2026/07/27" }],
                          },
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
                            text: "担当者の返信が早く、業務内容も明確でした。",
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["tag-row"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-green"],
                            attrs: {},
                            children: [{ type: "text", text: "勤務確認済み" }],
                          },
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-blue"],
                            attrs: {},
                            children: [{ type: "text", text: "直接雇用" }],
                          },
                        ],
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
            classes: ["apply-card"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "div",
                classes: ["price"],
                attrs: {},
                children: [
                  { type: "text", text: "月給" },
                  {
                    type: "element",
                    tag: "b",
                    classes: [],
                    attrs: {},
                    children: [{ type: "text", text: "45万〜65万円" }],
                  },
                ],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-primary", "btn-lg", "full"],
                attrs: {},
                children: [{ type: "text", text: "この求人に応募" }],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-ghost", "full"],
                attrs: {},
                children: [
                  { type: "icon", name: "ellipse-outline", classes: ["icon"] },
                  { type: "text", text: "お気に入り" },
                ],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-ghost", "full"],
                attrs: {},
                children: [
                  { type: "icon", name: "ellipse-outline", classes: ["icon"] },
                  { type: "text", text: "企業に質問" },
                ],
              },
              {
                type: "element",
                tag: "hr",
                classes: [],
                attrs: {},
                children: [],
              },
              {
                type: "element",
                tag: "div",
                classes: ["mini-company"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "div",
                    classes: ["company-avatar"],
                    attrs: {},
                    children: [{ type: "text", text: "株" }],
                  },
                  {
                    type: "element",
                    tag: "div",
                    classes: [],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "strong",
                        classes: [],
                        attrs: {},
                        children: [
                          { type: "text", text: "株式会社ブルースカイ" },
                        ],
                      },
                      {
                        type: "element",
                        tag: "span",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "企業評価 4.7" }],
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
