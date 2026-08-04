import GeneratedScreen from "@/components/generated/GeneratedScreen";
import type { ScreenConfig } from "@/types/Generated";

const screen = {
  screenId: "SC-PB-002",
  route: "/jobs",
  title: "求人検索・一覧",
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
                children: [{ type: "text", text: "求人検索・一覧" }],
              },
              {
                type: "element",
                tag: "p",
                classes: [],
                attrs: {},
                children: [
                  {
                    type: "text",
                    text: "キーワードと各種条件で求人を検索し、結果を一覧表示する",
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
        classes: ["search-layout"],
        attrs: {},
        children: [
          {
            type: "element",
            tag: "aside",
            classes: ["filter-panel"],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "h3",
                classes: [],
                attrs: {},
                children: [
                  { type: "icon", name: "ellipse-outline", classes: ["icon"] },
                  { type: "text", text: "検索条件" },
                ],
              },
              {
                type: "element",
                tag: "div",
                classes: ["form-grid", "cols-1"],
                attrs: {},
                children: [
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
                        children: [{ type: "text", text: "キーワード" }],
                      },
                      {
                        type: "element",
                        tag: "input",
                        classes: [],
                        attrs: { value: "Java Spring Boot", type: "text" },
                        children: [],
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
                        children: [{ type: "text", text: "勤務地" }],
                      },
                      {
                        type: "element",
                        tag: "select",
                        classes: [],
                        attrs: {
                          options: ["全国・リモート", "選択してください"],
                        },
                        children: [],
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
                        children: [{ type: "text", text: "雇用形態" }],
                      },
                      {
                        type: "element",
                        tag: "select",
                        classes: [],
                        attrs: { options: ["すべて", "選択してください"] },
                        children: [],
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
                        children: [{ type: "text", text: "給与下限" }],
                      },
                      {
                        type: "element",
                        tag: "select",
                        classes: [],
                        attrs: {
                          options: ["月給30万円以上", "選択してください"],
                        },
                        children: [],
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
                        children: [{ type: "text", text: "評価" }],
                      },
                      {
                        type: "element",
                        tag: "select",
                        classes: [],
                        attrs: { options: ["4.0以上", "選択してください"] },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-primary", "full"],
                attrs: {},
                children: [{ type: "text", text: "条件を適用" }],
              },
              {
                type: "element",
                tag: "button",
                classes: ["btn", "btn-link", "full"],
                attrs: {},
                children: [{ type: "text", text: "条件をクリア" }],
              },
            ],
          },
          {
            type: "element",
            tag: "section",
            classes: [],
            attrs: {},
            children: [
              {
                type: "element",
                tag: "div",
                classes: ["result-head"],
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
                        tag: "strong",
                        classes: [],
                        attrs: {},
                        children: [{ type: "text", text: "1,248件" }],
                      },
                      {
                        type: "element",
                        tag: "span",
                        classes: [],
                        attrs: {},
                        children: [
                          { type: "text", text: "の求人が見つかりました" },
                        ],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "select",
                    classes: [],
                    attrs: { options: ["おすすめ順", "新着順"] },
                    children: [],
                  },
                ],
              },
              {
                type: "element",
                tag: "div",
                classes: ["job-grid"],
                attrs: {},
                children: [
                  {
                    type: "element",
                    tag: "article",
                    classes: ["job-card"],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-card-head"],
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
                                tag: "h3",
                                classes: [],
                                attrs: {},
                                children: [
                                  {
                                    type: "text",
                                    text: "バックエンドエンジニア",
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
                                    text: "株式会社ブルースカイ",
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "button",
                            classes: ["icon-btn"],
                            attrs: {},
                            children: [
                              {
                                type: "icon",
                                name: "ellipse-outline",
                                classes: ["icon"],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-meta"],
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
                              { type: "text", text: "東京都／フルリモート" },
                            ],
                          },
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
                              { type: "text", text: "正社員" },
                            ],
                          },
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
                              { type: "text", text: "評価 4.8" },
                            ],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-pay"],
                        attrs: {},
                        children: [{ type: "text", text: "月給 45万〜65万円" }],
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
                            children: [{ type: "text", text: "未経験OK" }],
                          },
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-purple"],
                            attrs: {},
                            children: [{ type: "text", text: "副業可" }],
                          },
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-green"],
                            attrs: {},
                            children: [{ type: "text", text: "評価率90%以上" }],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-actions"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "button",
                            classes: ["btn", "btn-ghost"],
                            attrs: {},
                            children: [{ type: "text", text: "詳細を見る" }],
                          },
                          {
                            type: "element",
                            tag: "button",
                            classes: ["btn", "btn-primary"],
                            attrs: {},
                            children: [{ type: "text", text: "応募する" }],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "article",
                    classes: ["job-card"],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-card-head"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "div",
                            classes: ["company-avatar"],
                            attrs: {},
                            children: [{ type: "text", text: "合" }],
                          },
                          {
                            type: "element",
                            tag: "div",
                            classes: [],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "h3",
                                classes: [],
                                attrs: {},
                                children: [
                                  { type: "text", text: "Webデザイナー" },
                                ],
                              },
                              {
                                type: "element",
                                tag: "p",
                                classes: [],
                                attrs: {},
                                children: [
                                  { type: "text", text: "合同会社ノード" },
                                ],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "button",
                            classes: ["icon-btn"],
                            attrs: {},
                            children: [
                              {
                                type: "icon",
                                name: "ellipse-outline",
                                classes: ["icon"],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-meta"],
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
                              { type: "text", text: "大阪府／週3リモート" },
                            ],
                          },
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
                              { type: "text", text: "業務委託" },
                            ],
                          },
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
                              { type: "text", text: "評価 4.6" },
                            ],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-pay"],
                        attrs: {},
                        children: [{ type: "text", text: "時給 2,500円〜" }],
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
                            children: [{ type: "text", text: "未経験OK" }],
                          },
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-purple"],
                            attrs: {},
                            children: [{ type: "text", text: "副業可" }],
                          },
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-green"],
                            attrs: {},
                            children: [{ type: "text", text: "評価率90%以上" }],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-actions"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "button",
                            classes: ["btn", "btn-ghost"],
                            attrs: {},
                            children: [{ type: "text", text: "詳細を見る" }],
                          },
                          {
                            type: "element",
                            tag: "button",
                            classes: ["btn", "btn-primary"],
                            attrs: {},
                            children: [{ type: "text", text: "応募する" }],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tag: "article",
                    classes: ["job-card"],
                    attrs: {},
                    children: [
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-card-head"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "div",
                            classes: ["company-avatar"],
                            attrs: {},
                            children: [{ type: "text", text: "グ" }],
                          },
                          {
                            type: "element",
                            tag: "div",
                            classes: [],
                            attrs: {},
                            children: [
                              {
                                type: "element",
                                tag: "h3",
                                classes: [],
                                attrs: {},
                                children: [
                                  { type: "text", text: "店舗運営スタッフ" },
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
                                    text: "グリーンリーフ株式会社",
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            type: "element",
                            tag: "button",
                            classes: ["icon-btn"],
                            attrs: {},
                            children: [
                              {
                                type: "icon",
                                name: "ellipse-outline",
                                classes: ["icon"],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-meta"],
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
                              { type: "text", text: "兵庫県神戸市" },
                            ],
                          },
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
                              { type: "text", text: "正社員" },
                            ],
                          },
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
                              { type: "text", text: "評価 4.4" },
                            ],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-pay"],
                        attrs: {},
                        children: [{ type: "text", text: "月給 28万〜35万円" }],
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
                            children: [{ type: "text", text: "未経験OK" }],
                          },
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-purple"],
                            attrs: {},
                            children: [{ type: "text", text: "副業可" }],
                          },
                          {
                            type: "element",
                            tag: "span",
                            classes: ["badge", "badge-green"],
                            attrs: {},
                            children: [{ type: "text", text: "評価率90%以上" }],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tag: "div",
                        classes: ["job-actions"],
                        attrs: {},
                        children: [
                          {
                            type: "element",
                            tag: "button",
                            classes: ["btn", "btn-ghost"],
                            attrs: {},
                            children: [{ type: "text", text: "詳細を見る" }],
                          },
                          {
                            type: "element",
                            tag: "button",
                            classes: ["btn", "btn-primary"],
                            attrs: {},
                            children: [{ type: "text", text: "応募する" }],
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
    ],
  },
} as ScreenConfig;

export default function Screen() {
  return <GeneratedScreen screen={screen} />;
}
