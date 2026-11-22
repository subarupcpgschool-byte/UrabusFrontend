import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { Header } from "@/components/common/Header";
import { Logo } from "@/components/common/Logo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

const navy = "#081b50",
  blue = "#006eff",
  green = "#18833c";
const questions = [
  [
    sourceText("whenDoesPaidPostingBegin"),
    sourceText("allCompaniesCurrentlyUseTheFreePlan"),
  ],
  [
    sourceText("whatIsRequiredForADiscount"),
    sourceText("concludeApplicationNegotiationsAndSubmitHiringReviews"),
  ],
];
const comparison = [
  [
    sourceText("postingAllowance"),
    sourceText("upToThreeJobPostingsAndOne"),
    sourceText("comingSoon"),
  ],
  [sourceText("baseFee"), sourceText("jpy0"), sourceText("jpy8000")],
  [sourceText("discountForMeetingConditions"), "—", sourceText("upToJpy3000")],
  [
    sourceText("additionalHiringSuccessFee"),
    sourceText("jpy0"),
    sourceText("jpy0"),
  ],
];
function Action({ label, color = blue }: { label: string; color?: string }) {
  "use no memo";
  useLocaleVersion();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({ pathname: "/auth", params: { mode: "register" } })
      }
      style={({
        pressed,
        hovered,
      }: {
        pressed: boolean;
        hovered?: boolean;
      }) => [
        s.action,
        {
          backgroundColor: color,
          opacity: pressed ? 0.75 : hovered ? 0.88 : 1,
        },
      ]}
    >
      <Text style={s.actionText}>{label}</Text>
      <Ionicons name="chevron-forward" size={22} color="white" />
    </Pressable>
  );
}
function Feature({ children, color }: { children: string; color: string }) {
  "use no memo";
  useLocaleVersion();
  return (
    <View style={s.feature}>
      <Ionicons name="checkmark-circle" color={color} size={27} />
      <Text style={s.body}>{children}</Text>
    </View>
  );
}
export default function PriceScreen() {
  "use no memo";
  useLocaleVersion();
  const { width } = useWindowDimensions();
  const desktop = width >= 1000,
    columns = width >= 760;
  const [audience, setAudience] = useState<"company" | "user">("company");
  const [opened, setOpened] = useState([true, true]);
  return (
    <ScrollView style={s.page} contentContainerStyle={{ flexGrow: 1 }}>
      <Header />
      <View style={s.main}>
        <View style={s.breadcrumb}>
          <Pressable onPress={() => router.push("/")}>
            <Text style={s.small}>{tText("home")}</Text>
          </Pressable>
          <Ionicons name="chevron-forward" size={13} color={navy} />
          <Text style={s.small}>{tText("pricing_493")}</Text>
        </View>

        <View accessibilityRole="tablist" style={s.segment}>
          {(
            [
              { key: "company", label: sourceText("company") },
              { key: "user", label: sourceText("individualUser_494") },
            ] as const
          ).map((x) => (
            <Pressable
              key={x.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: audience === x.key }}
              onPress={() => setAudience(x.key)}
              style={({ pressed }) => [
                s.segmentButton,
                audience === x.key && s.segmentSelected,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text
                style={[
                  s.segmentText,
                  audience === x.key && { color: "white" },
                ]}
              >
                {x.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {audience === "company" ? (
          <>
            <View style={[s.row, !columns && s.vertical]}>
              <View
                style={[
                  s.plan,
                  { backgroundColor: "#f0fcf4", borderColor: "#a0e5bd" },
                ]}
              >
                <Text style={[s.pill, { backgroundColor: green }]}>
                  {tText("freePlan")}
                </Text>
                <Text style={[s.price, { color: green }]}>
                  0<Text style={s.unit}>{tText("jpy")}</Text>
                </Text>
                <Text style={[s.body, s.center]}>
                  {tText("forCompaniesGettingStartedWithFreeJob")}
                </Text>
                <View style={s.features}>
                  {[
                    sourceText("upToThreeJobPostingsAndOne"),
                    sourceText("jobManagement"),
                    sourceText("chatWithApplicants"),
                    sourceText("noAdditionalHiringSuccessFees"),
                  ].map((x) => (
                    <Feature key={x} color={green}>
                      {x}
                    </Feature>
                  ))}
                </View>
                <View style={s.space} />
                <Action label={tText("startPostingForFree")} color={green} />
              </View>
              <View
                style={[
                  s.plan,
                  { backgroundColor: "#eef8ff", borderColor: "#9ed4ff" },
                ]}
              >
                <Text style={[s.pill, { backgroundColor: blue }]}>
                  {tText("paidPostingPlanComingSoon")}
                </Text>
                <Text style={[s.body, s.center]}>
                  {tText("plansForFourOrMoreJobPostings")}
                </Text>
                <Text style={[s.body, s.center, { marginTop: 12 }]}>
                  {tText("baseFee")}
                </Text>
                <Text style={[s.price, { color: blue, fontSize: 52 }]}>
                  8,000<Text style={s.unit}>{tText("jpy")}</Text>
                </Text>
                <Text style={s.discount}>{tText("saveUpToJpy3000")}</Text>
                <Ionicons
                  name="chevron-down"
                  size={21}
                  color={navy}
                  style={{ alignSelf: "center", marginTop: 7 }}
                />
                <Text style={[s.body, s.center]}>{tText("afterDiscount")}</Text>
                <Text style={[s.price, { color: blue, fontSize: 52 }]}>
                  5,000<Text style={s.unit}>{tText("jpyAndUp")}</Text>
                </Text>
                <Text style={s.note}>
                  {tText("theDiscountDependsOnTheConditionsYou")}
                </Text>
                <View style={s.features}>
                  {[
                    sourceText("jobManagement"),
                    sourceText("chatWithApplicants"),
                    sourceText("additionalHiringSuccessFeeJpy0"),
                  ].map((x) => (
                    <Feature key={x} color={blue}>
                      {x}
                    </Feature>
                  ))}
                </View>
                <View style={s.space} />
                <Text style={s.note}>
                  {tText("onlyTheFreePlanIsCurrentlyAvailable")}
                </Text>
              </View>
            </View>
            <Text style={s.heading}>{tText("discountConditions")}</Text>
            <Text style={[s.body, { marginBottom: 18 }]}>
              {tText("respondingToApplicationsAndSubmittingHiringReviews")}
            </Text>
            <View style={[s.row, !columns && s.vertical]}>
              {[
                {
                  title: sourceText(
                    "setTheApplicationStatusToNegotiationsCompleted",
                  ),
                  limit: sourceText("within30DaysOfApplication"),
                  body: sourceText(
                    "progressApplicationsToNegotiationsCompleted",
                  ),
                  warnings: [
                    sourceText("applicationsExceeding30DaysAreIneligibleUntil"),
                  ],
                },
                {
                  title: sourceText("reviewHiredUsersDuringTheProbationPeriod"),
                  limit: sourceText("duringTheProbationPeriod"),
                  body: sourceText("enterARatingAndReviewContentDuring"),
                  warnings: [
                    sourceText("aReviewCannotBeCompletedWithoutReview"),
                    sourceText("reviewsSubmittedAfterTheProbationPeriodAre"),
                  ],
                },
              ].map((x, i) => (
                <View key={x.title} style={s.condition}>
                  <View style={s.conditionHeader}>
                    <Text style={s.number}>0{i + 1}</Text>
                    <Text style={[s.body, { flex: 1, fontWeight: "800" }]}>
                      {x.title}
                    </Text>
                  </View>
                  <Text style={s.limit}>{x.limit}</Text>
                  <Text
                    style={[s.body, { lineHeight: 25, marginVertical: 14 }]}
                  >
                    {x.body}
                  </Text>
                  <View style={s.warning}>
                    {x.warnings.map((w) => (
                      <View key={w} style={s.warningRow}>
                        <Ionicons
                          name="alert-circle"
                          size={21}
                          color="#ea6c00"
                        />
                        <Text style={s.warningText}>{w}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
            <Text style={s.heading}>{tText("howDiscountsAreCalculated")}</Text>
            <View style={s.condition}>
              <Text style={[s.body, { lineHeight: 26 }]}>
                {tText("applicationResponseAndHiringReviewCompletionRates")}
              </Text>
              <Text
                style={[
                  s.body,
                  { lineHeight: 26, marginTop: 12, fontWeight: "700" },
                ]}
              >
                {tText("discountJpy3000Max0Overall")}
              </Text>
              <Text style={[s.body, { lineHeight: 25, marginTop: 12 }]}>
                {tText("applicationsAreGroupedFromThe15thOf")}
              </Text>
              <Text style={[s.body, { lineHeight: 25, marginTop: 12 }]}>
                {tText("hiringReviewsCoverUsersWhoseProbationPeriod")}
              </Text>
            </View>
            <Text style={s.heading}>{tText("planComparison")}</Text>
            <View style={s.table}>
              <View style={s.tableRow}>
                {[
                  sourceText("feature"),
                  sourceText("freePlan"),
                  sourceText("paidPostingPlan"),
                ].map((x, i) => (
                  <View
                    key={x}
                    style={[
                      s.cell,
                      {
                        backgroundColor:
                          i === 1 ? "#e8f8ed" : i === 2 ? "#e5f3ff" : "#f3f5f8",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.cellText,
                        {
                          fontWeight: "800",
                          color: i === 1 ? green : i === 2 ? blue : navy,
                        },
                      ]}
                    >
                      {x}
                    </Text>
                  </View>
                ))}
              </View>
              {comparison.map((row) => (
                <View style={s.tableRow} key={row[0]}>
                  {row.map((x, i) => (
                    <View key={i} style={s.cell}>
                      <Text
                        style={[s.cellText, i === 0 && { textAlign: "left" }]}
                      >
                        {x}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <Text style={s.heading}>
              {tText("frequentlyAskedQuestions_528")}
            </Text>
            {questions.map(([q, a], i) => (
              <View key={q} style={s.faq}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: opened[i] }}
                  onPress={() =>
                    setOpened((v) => v.map((x, j) => (j === i ? !x : x)))
                  }
                  style={s.question}
                >
                  <Text style={[s.body, { flex: 1, fontWeight: "800" }]}>
                    {q}
                  </Text>
                  <Ionicons
                    name={opened[i] ? "chevron-up" : "chevron-down"}
                    size={19}
                    color={navy}
                  />
                </Pressable>
                {opened[i] && (
                  <Text style={[s.body, { lineHeight: 25, marginTop: 8 }]}>
                    {a}
                  </Text>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={[s.plan, s.userPlan]}>
            <Text style={[s.pill, { backgroundColor: blue }]}>
              {tText("freePlanForIndividuals")}
            </Text>
            <Text style={[s.price, { color: blue }]}>
              0<Text style={s.unit}>{tText("jpy")}</Text>
            </Text>
            <Text style={[s.body, s.center]}>
              {tText("individualUsersAlwaysPayJpy0")}
            </Text>
            <View style={s.features}>
              {[
                sourceText("searchAndViewJobDetails"),
                sourceText("applyForJobs"),
                sourceText("chatWithCompanies"),
                sourceText("reviewCompanies"),
              ].map((x) => (
                <Feature key={x} color={blue}>
                  {x}
                </Feature>
              ))}
            </View>
            <View style={{ height: 24 }} />
            <Action label={tText("registerForFree")} />
          </View>
        )}
        <View style={[s.banner, !columns && s.vertical]}>
          <Text
            style={[
              s.body,
              { fontSize: 22, fontWeight: "900", textAlign: "center" },
            ]}
          >
            {audience === "company"
              ? sourceText("yourNextHireStartsHere")
              : sourceText("yourNextOpportunityStartsHere")}
          </Text>
          <Action
            label={
              audience === "company"
                ? sourceText("postJobsForFree_538")
                : sourceText("registerForFree")
            }
          />
        </View>
        <View style={s.footer}>
          <View style={{ height: 58 }}>
            <Logo />
          </View>
          <Text style={s.small}>© GlobalWorkers</Text>
        </View>
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  segment: {
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#eaf2ff",
    borderRadius: 13,
    padding: 4,
    marginBottom: 25,
    width: "100%",
    maxWidth: 400,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentSelected: { backgroundColor: blue },
  segmentText: { fontSize: 17, fontWeight: "800", color: navy },
  userPlan: {
    flex: undefined,
    alignSelf: "center",
    width: "100%",
    maxWidth: 560,
    minHeight: 0,
    backgroundColor: "#eef8ff",
    borderColor: "#9ed4ff",
  },
  page: { flex: 1, backgroundColor: "#fff" },
  main: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingBottom: 24,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  small: { fontSize: 12, color: "#647494" },
  hero: { alignItems: "center", paddingVertical: 30, gap: 12 },
  tag: {
    color: blue,
    backgroundColor: "#e5f4ff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    fontWeight: "700",
  },
  title: { fontSize: 38, color: navy, fontWeight: "900" },
  body: { color: navy, fontSize: 16 },
  center: { textAlign: "center", fontWeight: "600" },
  row: { flexDirection: "row", gap: 18, alignItems: "stretch" },
  vertical: { flexDirection: "column" },
  plan: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 24,
    minHeight: 570,
  },
  pill: {
    alignSelf: "center",
    color: "white",
    fontSize: 19,
    fontWeight: "800",
    paddingHorizontal: 30,
    paddingVertical: 7,
    borderRadius: 30,
    marginBottom: 10,
  },
  price: {
    fontSize: 76,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 5,
  },
  unit: { fontSize: 29 },
  discount: {
    color: "#eb6900",
    backgroundColor: "#fff5cc",
    textAlign: "center",
    padding: 9,
    fontWeight: "800",
    fontSize: 18,
    borderRadius: 10,
  },
  note: {
    color: navy,
    backgroundColor: "#dfebf6",
    fontSize: 13,
    textAlign: "center",
    padding: 8,
    borderRadius: 9,
  },
  features: {
    borderTopWidth: 1,
    borderColor: "#d6e3df",
    marginTop: 18,
    paddingTop: 15,
    gap: 10,
  },
  feature: { flexDirection: "row", alignItems: "center", gap: 12 },
  space: { flex: 1, minHeight: 18 },
  action: {
    minHeight: 52,
    paddingHorizontal: 22,
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  actionText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  heading: {
    color: navy,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 28,
    marginBottom: 10,
  },
  condition: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c8dfff",
    borderRadius: 9,
    padding: 18,
  },
  conditionHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  number: {
    backgroundColor: blue,
    color: "#fff",
    borderRadius: 25,
    width: 46,
    height: 46,
    textAlign: "center",
    lineHeight: 46,
    fontSize: 19,
    fontWeight: "800",
  },
  limit: {
    alignSelf: "flex-start",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#89caff",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 5,
    color: blue,
    backgroundColor: "#eef9ff",
    fontWeight: "700",
  },
  warning: {
    backgroundColor: "#fff5e7",
    padding: 14,
    borderRadius: 10,
    gap: 9,
  },
  warningRow: { flexDirection: "row", gap: 8 },
  warningText: { flex: 1, color: "#de6000", fontSize: 14, lineHeight: 23 },
  table: {
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: { flexDirection: "row" },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#dbe3ef",
    justifyContent: "center",
  },
  cellText: { color: navy, textAlign: "center", fontSize: 14 },
  faq: {
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 9,
    padding: 18,
    marginBottom: 12,
  },
  question: { flexDirection: "row", alignItems: "center", gap: 12 },
  banner: {
    backgroundColor: "#eaf5ff",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginTop: 6,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },
});
