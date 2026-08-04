import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { COLORS } from "@/theme/GlobalWorkersStyles";
import { layoutFixes } from "@/theme/layoutFixes";
import { responsiveStyles, responsiveTextStyle } from "@/theme/themeUtils";
import { Trans, useTranslation } from "react-i18next";
export default function TopScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const s = (...names: string[]) => responsiveStyles(names, width) as never;
  const text = (...names: string[]) => responsiveTextStyle(names, width);
  const lx = (classes: readonly string[]) => layoutFixes(classes, width);
  const cycleSelect = (
    value: string,
    setter: (value: string) => void,
    options: string[],
  ) => {
    if (!options.length) return;
    const current = options.indexOf(value);
    setter(options[(current + 1 + options.length) % options.length]);
  };
  const [companyName, setCompanyName] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleSearchJobs = () => {
    router.push("/jobs" as Href);
  };
  const handleShowJobs = () => {
    router.push("/jobs" as Href);
  };
  const handleAction = () => {
    // TODO: Service/API処理をここに実装します。
  };
  const handleViewDetails = () => {
    router.push("/jobs/1" as Href);
  };
  const handleApply = () => {
    router.push("/jobs/1/apply" as Href);
  };
  const handleAction2 = () => {
    // TODO: Service/API処理をここに実装します。
  };
  const handleViewDetails2 = () => {
    router.push("/jobs/1" as Href);
  };
  const handleApply2 = () => {
    router.push("/jobs/1/apply" as Href);
  };
  const handleAction3 = () => {
    // TODO: Service/API処理をここに実装します。
  };
  const handleViewDetails3 = () => {
    router.push("/jobs/1" as Href);
  };
  const handleApply3 = () => {
    router.push("/jobs/1/apply" as Href);
  };

  return (
    <View style={[s("publicMain"), lx(["public-main"])]}>
      <View style={[s("hero"), lx(["hero"])]}>
        <View style={lx(["hero-copy"])}>
          <View
            style={[s("badge", "badgeGreen"), lx(["badge", "badge-green"])]}
          >
            <Text style={text("badge", "badgeGreen")}>
              {"採用成功報酬 0円"}
            </Text>
          </View>
          <Text style={text("heroCopyH1")}>
            <Trans
              i18nKey="top.title"
              components={{
                em: <Text style={text("heroCopyH1Em")} />,
                br: <br />,
              }}
            />
          </Text>
          <Text style={text("p", "publicPageTitleP")}>
            {
              "サービス概要、求人検索導線、新着求人、評価を活用した特徴を表示する"
            }
          </Text>
          <Text style={text("p")}>
            {
              "求人掲載からチャット、採用後の従業員・勤怠管理まで。信頼できる評価をもとに企業と働く人が直接つながります。"
            }
          </Text>
          <View style={[s("heroSearch"), lx(["hero-search"])]}>
            <View style={s("heroSearchDiv")}>
              <Ionicons name="ellipse-outline" size={16} color={COLORS.muted} />
              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder={"職種・スキル・企業名"}
                placeholderTextColor={COLORS.muted}
                style={s("input", "heroSearchInput")}
              />
            </View>
            <View style={s("heroSearchDiv")}>
              <Ionicons
                name="business-outline"
                size={16}
                color={COLORS.muted}
              />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder={"勤務地・リモート"}
                placeholderTextColor={COLORS.muted}
                style={s("input", "heroSearchInput")}
              />
            </View>
            <Pressable
              onPress={handleSearchJobs}
              style={({ pressed }) => [
                [
                  s("btn", "btnPrimary", "btnLg"),
                  lx(["btn", "btn-primary", "btn-lg"]),
                ],
                pressed && { opacity: 0.72 },
              ]}
            >
              <Ionicons name="search-outline" size={16} color={COLORS.white} />
              <Text style={text("btn", "btnPrimary", "btnLg")}>
                {"求人を検索"}
              </Text>
            </Pressable>
          </View>
          <View style={[s("heroNumbers"), lx(["hero-numbers"])]}>
            <Text style={text("heroNumbersSpan")}>
              <Text style={text("heroNumbersB")}>{"12,480"}</Text>
              {"公開求人"}
            </Text>
            <Text style={text("heroNumbersSpan")}>
              <Text style={text("heroNumbersB")}>{"8,260"}</Text>
              {"評価済み採用"}
            </Text>
            <Text style={text("heroNumbersSpan")}>
              <Text style={text("heroNumbersB")}>{"94%"}</Text>
              {"評価協力率"}
            </Text>
          </View>
        </View>
        <View style={[s("heroVisual"), lx(["hero-visual"])]}>
          <View
            style={[
              s("floatingCard", "cardA"),
              lx(["floating-card", "card-a"]),
            ]}
          >
            <Ionicons name="ellipse-outline" size={16} color={COLORS.muted} />
            <Text style={text("floatingCardB")}>{"4.8"}</Text>
            <Text style={text("floatingCardSpan")}>{"信頼できる企業評価"}</Text>
          </View>
          <View style={[s("personCard"), lx(["person-card"])]}>
            <View style={[s("portrait"), lx(["portrait"])]}>
              <Text>{"GW"}</Text>
            </View>
            <Text style={text("h3")}>{"直接雇用が成立"}</Text>
            <Text style={text("p", "personCardP")}>
              {"バックエンドエンジニア"}
            </Text>
            <View style={[s("successLine"), lx(["success-line"])]}>
              <Ionicons name="ellipse-outline" size={16} color={COLORS.muted} />
              <Text>{"中間手数料なし"}</Text>
            </View>
          </View>
          <View
            style={[
              s("floatingCard", "cardB"),
              lx(["floating-card", "card-b"]),
            ]}
          >
            <Ionicons name="ellipse-outline" size={16} color={COLORS.muted} />
            <Text style={text("floatingCardB")}>{"採用決定"}</Text>
            <Text style={text("floatingCardSpan")}>
              {"チャットから直接契約"}
            </Text>
          </View>
        </View>
      </View>
      <View style={[s("pageSection"), lx(["page-section"])]}>
        <View style={[s("sectionHeading"), lx(["section-heading"])]}>
          <View style={undefined}>
            <Text style={text("h2", "sectionHeadingH2")}>
              {"評価の高い新着求人"}
            </Text>
            <Text style={text("p", "sectionHeadingP")}>
              {"実際に働いた人の評価を確認して応募できます。"}
            </Text>
          </View>
          <Pressable
            onPress={handleShowJobs}
            style={({ pressed }) => [
              [
                s("btn", "btnPrimary", "sectionHeadingBtn"),
                lx(["btn", "btn-primary"]),
              ],
              pressed && { opacity: 0.72 },
            ]}
          >
            <Ionicons name="briefcase-outline" size={16} color={COLORS.white} />
            <Text style={text("btn", "btnPrimary", "sectionHeadingBtn")}>
              {"求人をもっと見る"}
            </Text>
          </Pressable>
        </View>
        <View style={[s("jobGrid"), lx(["job-grid"])]}>
          <View style={[s("jobCard"), lx(["job-card"])]}>
            <View style={[s("jobCardHead"), lx(["job-card-head"])]}>
              <View style={[s("companyAvatar"), lx(["company-avatar"])]}>
                <Text>{"株"}</Text>
              </View>
              <View style={undefined}>
                <Text style={text("h3", "jobCardHeadH3")}>
                  {"バックエンドエンジニア"}
                </Text>
                <Text style={text("p", "jobCardHeadP")}>
                  {"株式会社ブルースカイ"}
                </Text>
              </View>
              <Pressable
                onPress={handleAction}
                style={({ pressed }) => [
                  [s("iconBtn", "jobCardHeadIconBtn"), lx(["icon-btn"])],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.blue}
                />
                <Text style={text("iconBtn", "jobCardHeadIconBtn")}>
                  {"操作"}
                </Text>
              </Pressable>
            </View>
            <View style={[s("jobMeta"), lx(["job-meta"])]}>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text style={text("jobMetaSpan")}>
                  {"東京都／フルリモート"}
                </Text>
              </View>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text style={text("jobMetaSpan")}>{"正社員"}</Text>
              </View>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons name="star-outline" size={16} color={COLORS.muted} />
                <Text style={text("jobMetaSpan")}>{"評価 4.8"}</Text>
              </View>
            </View>
            <View style={[s("jobPay"), lx(["job-pay"])]}>
              <Text>{"月給 45万〜65万円"}</Text>
            </View>
            <View style={[s("tagRow"), lx(["tag-row"])]}>
              <View
                style={[s("badge", "badgeBlue"), lx(["badge", "badge-blue"])]}
              >
                <Text style={text("badge", "badgeBlue")}>{"未経験OK"}</Text>
              </View>
              <View
                style={[
                  s("badge", "badgePurple"),
                  lx(["badge", "badge-purple"]),
                ]}
              >
                <Text style={text("badge", "badgePurple")}>{"副業可"}</Text>
              </View>
              <View
                style={[s("badge", "badgeGreen"), lx(["badge", "badge-green"])]}
              >
                <Text style={text("badge", "badgeGreen")}>
                  {"評価率90%以上"}
                </Text>
              </View>
            </View>
            <View style={[s("jobActions"), lx(["job-actions"])]}>
              <Pressable
                onPress={handleViewDetails}
                style={({ pressed }) => [
                  [
                    s("btn", "btnGhost", "jobActionsBtn"),
                    lx(["btn", "btn-ghost", "job-actions"]),
                  ],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.blue}
                />
                <Text
                  style={text("btn", "btnGhost", "jobActionsBtn", "jobActions")}
                >
                  {"詳細を見る"}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleApply}
                style={({ pressed }) => [
                  [
                    s("btn", "btnPrimary", "jobActionsBtn"),
                    lx(["btn", "btn-primary", "job-actions"]),
                  ],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={text("btn", "btnPrimary", "jobActionsBtn")}>
                  {"応募する"}
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={[s("jobCard"), lx(["job-card"])]}>
            <View style={[s("jobCardHead"), lx(["job-card-head"])]}>
              <View style={[s("companyAvatar"), lx(["company-avatar"])]}>
                <Text>{"合"}</Text>
              </View>
              <View style={undefined}>
                <Text style={text("h3", "jobCardHeadH3")}>
                  {"Webデザイナー"}
                </Text>
                <Text style={text("p", "jobCardHeadP")}>
                  {"合同会社ノード"}
                </Text>
              </View>
              <Pressable
                onPress={handleAction2}
                style={({ pressed }) => [
                  [s("iconBtn", "jobCardHeadIconBtn"), lx(["icon-btn"])],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.blue}
                />
                <Text style={text("iconBtn", "jobCardHeadIconBtn")}>
                  {"操作"}
                </Text>
              </Pressable>
            </View>
            <View style={[s("jobMeta"), lx(["job-meta"])]}>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text style={text("jobMetaSpan")}>{"大阪府／週3リモート"}</Text>
              </View>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text style={text("jobMetaSpan")}>{"業務委託"}</Text>
              </View>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons name="star-outline" size={16} color={COLORS.muted} />
                <Text style={text("jobMetaSpan")}>{"評価 4.6"}</Text>
              </View>
            </View>
            <View style={[s("jobPay"), lx(["job-pay"])]}>
              <Text>{"時給 2,500円〜"}</Text>
            </View>
            <View style={[s("tagRow"), lx(["tag-row"])]}>
              <View
                style={[s("badge", "badgeBlue"), lx(["badge", "badge-blue"])]}
              >
                <Text style={text("badge", "badgeBlue")}>{"未経験OK"}</Text>
              </View>
              <View
                style={[
                  s("badge", "badgePurple"),
                  lx(["badge", "badge-purple"]),
                ]}
              >
                <Text style={text("badge", "badgePurple")}>{"副業可"}</Text>
              </View>
              <View
                style={[s("badge", "badgeGreen"), lx(["badge", "badge-green"])]}
              >
                <Text style={text("badge", "badgeGreen")}>
                  {"評価率90%以上"}
                </Text>
              </View>
            </View>
            <View style={[s("jobActions"), lx(["job-actions"])]}>
              <Pressable
                onPress={handleViewDetails2}
                style={({ pressed }) => [
                  [
                    s("btn", "btnGhost", "jobActionsBtn"),
                    lx(["btn", "btn-ghost", "job-actions"]),
                  ],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.blue}
                />
                <Text style={text("btn", "btnGhost", "jobActionsBtn")}>
                  {"詳細を見る"}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleApply2}
                style={({ pressed }) => [
                  [
                    s("btn", "btnPrimary", "jobActionsBtn"),
                    lx(["btn", "btn-primary", "job-actions"]),
                  ],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={text("btn", "btnPrimary", "jobActionsBtn")}>
                  {"応募する"}
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={[s("jobCard"), lx(["job-card"])]}>
            <View style={[s("jobCardHead"), lx(["job-card-head"])]}>
              <View style={[s("companyAvatar"), lx(["company-avatar"])]}>
                <Text>{"グ"}</Text>
              </View>
              <View style={undefined}>
                <Text style={text("h3", "jobCardHeadH3")}>
                  {"店舗運営スタッフ"}
                </Text>
                <Text style={text("p", "jobCardHeadP")}>
                  {"グリーンリーフ株式会社"}
                </Text>
              </View>
              <Pressable
                onPress={handleAction3}
                style={({ pressed }) => [
                  [s("iconBtn", "jobCardHeadIconBtn"), lx(["icon-btn"])],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.blue}
                />
                <Text style={text("iconBtn", "jobCardHeadIconBtn")}>
                  {"操作"}
                </Text>
              </Pressable>
            </View>
            <View style={[s("jobMeta"), lx(["job-meta"])]}>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text style={text("jobMetaSpan")}>{"兵庫県神戸市"}</Text>
              </View>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text style={text("jobMetaSpan")}>{"正社員"}</Text>
              </View>
              <View
                style={[
                  s("jobMetaSpan"),
                  { flexDirection: "row", alignItems: "center", gap: 6 },
                ]}
              >
                <Ionicons name="star-outline" size={16} color={COLORS.muted} />
                <Text style={text("jobMetaSpan")}>{"評価 4.4"}</Text>
              </View>
            </View>
            <View style={[s("jobPay"), lx(["job-pay"])]}>
              <Text>{"月給 28万〜35万円"}</Text>
            </View>
            <View style={[s("tagRow"), lx(["tag-row"])]}>
              <View
                style={[s("badge", "badgeBlue"), lx(["badge", "badge-blue"])]}
              >
                <Text style={text("badge", "badgeBlue")}>{"未経験OK"}</Text>
              </View>
              <View
                style={[
                  s("badge", "badgePurple"),
                  lx(["badge", "badge-purple"]),
                ]}
              >
                <Text style={text("badge", "badgePurple")}>{"副業可"}</Text>
              </View>
              <View
                style={[s("badge", "badgeGreen"), lx(["badge", "badge-green"])]}
              >
                <Text style={text("badge", "badgeGreen")}>
                  {"評価率90%以上"}
                </Text>
              </View>
            </View>
            <View style={[s("jobActions"), lx(["job-actions"])]}>
              <Pressable
                onPress={handleViewDetails3}
                style={({ pressed }) => [
                  [
                    s("btn", "btnGhost", "jobActionsBtn"),
                    lx(["btn", "btn-ghost", "job-actions"]),
                  ],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={16}
                  color={COLORS.blue}
                />
                <Text style={text("btn", "btnGhost", "jobActionsBtn")}>
                  {"詳細を見る"}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleApply3}
                style={({ pressed }) => [
                  [
                    s("btn", "btnPrimary", "jobActionsBtn"),
                    lx(["btn", "btn-primary", "job-actions"]),
                  ],
                  pressed && { opacity: 0.72 },
                ]}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={text("btn", "btnPrimary", "jobActionsBtn")}>
                  {"応募する"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <View style={[s("featureStrip"), lx(["feature-strip"])]}>
        <View style={s("featureStripArticle")}>
          <Ionicons name="ellipse-outline" size={16} color={COLORS.muted} />
          <Text style={text("h3")}>{"直接チャット"}</Text>
          <Text style={text("p", "featureStripP")}>
            {"応募前の質問から採用後の連絡まで、企業と直接やり取りできます。"}
          </Text>
        </View>
        <View style={s("featureStripArticle")}>
          <Ionicons name="ellipse-outline" size={16} color={COLORS.muted} />
          <Text style={text("h3")}>{"相互評価"}</Text>
          <Text style={text("p", "featureStripP")}>
            {"勤務実績に基づく評価で、企業とユーザー双方の信頼を可視化します。"}
          </Text>
        </View>
        <View style={s("featureStripArticle")}>
          <Ionicons name="ellipse-outline" size={16} color={COLORS.muted} />
          <Text style={text("h3")}>{"透明な料金"}</Text>
          <Text style={text("p", "featureStripP")}>
            {"成功報酬は不要。評価協力率が高い企業ほど月額料金を優遇します。"}
          </Text>
        </View>
      </View>
    </View>
  );
}
