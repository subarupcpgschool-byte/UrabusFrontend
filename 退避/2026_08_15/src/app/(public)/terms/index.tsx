import { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";

import { baseStyle, layoutFixStyle, textStyle } from "@/theme/responsiveStyle";

type DocumentType = "terms" | "privacy" | "rating" | "commerce";

type DocumentMenu = {
  id: DocumentType;
  label: string;
};

type DocumentSection = {
  title: string;
  body: string;
};

type DocumentData = {
  title: string;
  updatedAt: string;
  sections: DocumentSection[];
};

const menuList: DocumentMenu[] = [
  {
    id: "terms",
    label: "利用規約",
  },
  {
    id: "privacy",
    label: "プライバシーポリシー",
  },
  {
    id: "rating",
    label: "評価ガイドライン",
  },
  {
    id: "commerce",
    label: "特定商取引法表記",
  },
];

const documents: Record<DocumentType, DocumentData> = {
  terms: {
    title: "GlobalWorkers 利用規約",
    updatedAt: "最終更新日：2026年7月31日",
    sections: [
      {
        title: "第1条（目的）",
        body: "本規約は、GlobalWorkersが提供する求人掲載、応募、チャット、評価、雇用管理サービスの利用条件を定めるものです。",
      },
      {
        title: "第2条（アカウント）",
        body: "利用者は、正確かつ最新の情報を登録し、アカウントを適切に管理するものとします。",
      },
      {
        title: "第3条（評価）",
        body: "評価は実際の応募・採用・勤務実績に基づき、客観的かつ誠実に投稿してください。",
      },
      {
        title: "第4条（禁止事項）",
        body: "虚偽情報、差別的表現、第三者の権利を侵害する内容の投稿を禁止します。",
      },
    ],
  },

  privacy: {
    title: "GlobalWorkers プライバシーポリシー",
    updatedAt: "最終更新日：2026年7月31日",
    sections: [
      {
        title: "第1条（個人情報の取得）",
        body: "当サービスは、サービス提供に必要な範囲で利用者の個人情報を取得します。",
      },
      {
        title: "第2条（利用目的）",
        body: "取得した個人情報は、求人応募、企業との連絡、本人確認、サービス運営および改善のために利用します。",
      },
      {
        title: "第3条（第三者提供）",
        body: "法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。",
      },
    ],
  },

  rating: {
    title: "GlobalWorkers 評価投稿ガイドライン",
    updatedAt: "最終更新日：2026年7月31日",
    sections: [
      {
        title: "第1条（目的）",
        body: "評価機能は、企業およびユーザーがサービス利用時の判断材料として活用することを目的とします。",
      },
      {
        title: "第2条（評価投稿）",
        body: "実際の応募、採用、勤務実績などに基づいた客観的な内容を投稿してください。",
      },
      {
        title: "第3条（禁止事項）",
        body: "虚偽情報、誹謗中傷、個人情報、差別的表現などを含む投稿は禁止します。",
      },
    ],
  },

  commerce: {
    title: "特定商取引法に基づく表記",
    updatedAt: "最終更新日：2026年7月31日",
    sections: [
      {
        title: "事業者名",
        body: "GlobalWorkers",
      },
      {
        title: "提供サービス",
        body: "求人掲載、応募管理、チャット、評価および雇用管理サービスを提供します。",
      },
      {
        title: "利用料金",
        body: "各サービスの利用料金については、GlobalWorkers内の料金案内ページに表示します。",
      },
    ],
  },
};

export default function TermsScreen() {
  const { width } = useWindowDimensions();

  const s = (...names: string[]) => baseStyle(names, width) as never;

  const text = (...names: string[]) => textStyle(names, width);

  const lx = (classes: readonly string[]) => layoutFixStyle(classes, width);

  /**
   * 現在表示しているドキュメント
   */
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentType>("terms");

  /**
   * Webホバー中のメニュー
   */
  const [hoverDocument, setHoverDocument] = useState<DocumentType | null>(null);

  /**
   * メニュークリック
   */
  const handleDocumentPress = (documentType: DocumentType) => {
    setSelectedDocument(documentType);
  };

  /**
   * ホバー開始
   */
  const handleHoverIn = (documentType: DocumentType) => {
    setHoverDocument(documentType);
  };

  /**
   * ホバー終了
   */
  const handleHoverOut = () => {
    setHoverDocument(null);
  };

  const document = documents[selectedDocument];

  return (
    <View style={[s("publicMain"), lx(["public-main"])]}>
      {/* =============================
          ページタイトル
      ============================== */}
      <View style={[s("publicPageTitle"), lx(["public-page-title"])]}>
        <View>
          <Text style={text("publicPageTitleSpan")}>{"規約"}</Text>

          <Text style={text("h1", "publicPageTitleH1")}>
            {"利用規約・プライバシー"}
          </Text>

          <Text style={text("p", "publicPageTitleP")}>
            {"利用規約、プライバシーポリシー、評価投稿ガイドラインを表示する"}
          </Text>
        </View>

        <View style={[s("badge", "badgeGreen"), lx(["badge", "badge-green"])]}>
          <Text style={text("badge", "badgeGreen")}>{"〇 初期公開"}</Text>
        </View>
      </View>

      {/* =============================
          ドキュメントレイアウト
      ============================== */}
      <View style={[s("documentLayout"), lx(["document-layout"])]}>
        {/* =============================
            左メニュー
        ============================== */}
        <View style={[s("documentAside"), lx(["document-layout-aside"])]}>
          {menuList.map((menu) => {
            const isActive = selectedDocument === menu.id;

            const isHover = hoverDocument === menu.id;

            return (
              <Pressable
                key={menu.id}
                onPress={() => handleDocumentPress(menu.id)}
                onHoverIn={() => handleHoverIn(menu.id)}
                onHoverOut={handleHoverOut}
                style={({ pressed }) => [
                  [s("documentMenu"), lx(["document-menu"])],

                  isActive && [s("documentMenuActive"), lx(["active"])],

                  isHover &&
                    !isActive && {
                      opacity: 0.75,
                    },

                  pressed && {
                    opacity: 0.6,
                  },
                ]}
              >
                <Text
                  style={[
                    text("documentMenuText"),

                    isActive && text("documentMenuTextActive"),
                  ]}
                >
                  {menu.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* =============================
            規約本文
        ============================== */}
        <View
          style={[s("contentCard", "prose"), lx(["content-card", "prose"])]}
        >
          <Text style={text("h2", "proseH2")}>{document.title}</Text>

          <Text style={text("p", "updated")}>{document.updatedAt}</Text>

          {document.sections.map((section, index) => (
            <View key={`${selectedDocument}-${index}`}>
              <Text style={text("h3", "proseH3")}>{section.title}</Text>

              <Text style={text("p", "proseP")}>{section.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
