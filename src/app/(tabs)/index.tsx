import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { useResource, ResourceStatus } from "@/api/useResource";
import type { Page } from "@/api/platform";
import { jobItem, type JobRow, type CompanyRow } from "@/api/models";
import JobSearchCard from "@/components/search/JobSearchCard";

import { AppInput, AppTag } from "@/components/form";
import { router } from "expo-router";
import { Button } from "@/components/common/Button";
import { Header } from "@/components/common/Header";
import { Logo } from "@/components/common/Logo";
import { C } from "@/theme/colors";
import { notify } from "@/utils/pathUtils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;
function Search({ mobile }: { mobile: boolean }) {
  "use no memo";
  useLocaleVersion();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  return (
    <View style={[s.search, mobile && s.searchMobile]}>
      <View style={s.searchField}>
        <Ionicons name="search" size={20} color={C.sub} />
        <AppInput
          variant="plain"
          value={keyword}
          onChangeText={setKeyword}
          placeholder={tText("jobTitleSkillsOrCompany")}
          style={s.input}
        />
      </View>
      <View style={[s.divider, mobile && s.dividerMobile]} />
      <View style={s.searchField}>
        <Ionicons name="location-outline" size={21} color={C.sub} />
        <AppInput
          variant="plain"
          value={location}
          onChangeText={setLocation}
          placeholder={tText("locationOrRemoteWork")}
          style={s.input}
        />
      </View>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/jobs",
            params: { keyword, location },
          } as never)
        }
        style={({ pressed }) => [
          s.searchButton,
          mobile && { width: "100%" },
          pressed && s.pressed,
        ]}
      >
        <Ionicons name="search" size={18} color={C.white} />
        <Text style={s.searchButtonText}>{tText("searchJobs")}</Text>
      </Pressable>
    </View>
  );
}

function Flow({ tablet }: { tablet: boolean }) {
  "use no memo";
  useLocaleVersion();
  const items: [IconName, string, string][] = [
    [
      "document-text-outline",
      sourceText("postAJob"),
      sourceText("showWhatMakesYourOpportunityAttractive"),
    ],
    [
      "chatbubbles-outline",
      sourceText("directChat"),
      sourceText("askBeforeYouApply"),
    ],
    [
      "checkmark-circle",
      sourceText("hiringDecision"),
      sourceText("agreeOnTheTermsAndHireWith"),
    ],
    [
      "star-outline",
      sourceText("mutualReviews"),
      sourceText("buildTrustForYourNextOpportunity"),
    ],
  ];
  return (
    <View style={s.visual}>
      <Text style={s.visualTitle}>
        {tText("reviewsHelpYouFindTheRightFit")}
      </Text>
      <View style={s.flow}>
        {items.map(([icon, title, text], i) => (
          <View key={title} style={s.flowGroup}>
            <View style={s.flowCard}>
              <View
                style={[s.flowIcon, i === 2 && { backgroundColor: C.green }]}
              >
                <Ionicons
                  name={icon}
                  size={21}
                  color={i === 2 ? C.white : C.blue}
                />
              </View>
              <Text style={s.flowTitle}>{title}</Text>
              <Text style={s.flowText}>{text}</Text>
            </View>
            {tablet && i < 3 && (
              <Ionicons name="arrow-forward" size={22} color={C.blueDark} />
            )}
          </View>
        ))}
      </View>
      <View style={[s.proofRow, !tablet && { flexDirection: "column" }]}>
        <Review company />
        <View style={s.chat}>
          <Text style={s.chatText}>{tText("couldYouTellMeMoreAboutThe")}</Text>
          <Text style={[s.chatText, s.chatReply]}>
            {tText("ofCourseWhatWouldYouLikeTo")}
          </Text>
        </View>
        <Review />
      </View>
    </View>
  );
}

function Review({ company = false }: { company?: boolean }) {
  "use no memo";
  useLocaleVersion();
  return (
    <View style={s.review}>
      <Text style={s.reviewName}>
        {company
          ? sourceText("reviewTheCompanySCommunicationAndJob")
          : sourceText("reviewWorkExperienceAndQuality")}
      </Text>
      <Text style={s.quote}>
        {tText("seeMutualReviewsBasedOnRealInteractions")}
      </Text>
    </View>
  );
}

function Feature({
  icon,
  title,
  text,
  green = false,
}: {
  icon: IconName;
  title: string;
  text: string;
  green?: boolean;
}) {
  "use no memo";
  useLocaleVersion();
  return (
    <View style={s.feature}>
      <View style={[s.featureIcon, green && { backgroundColor: C.greenSoft }]}>
        <Ionicons name={icon} size={30} color={green ? C.green : C.blue} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.featureTitle}>{title}</Text>
        <Text style={s.featureText}>{text}</Text>
      </View>
    </View>
  );
}

function Footer({ desktop }: { desktop: boolean }) {
  "use no memo";
  useLocaleVersion();
  const cols = [
    [
      sourceText("services"),
      sourceText("findJobs"),
      sourceText("findCompanies"),
      sourceText("aboutReviews"),
    ],
    [
      sourceText("forJobSeekers"),
      sourceText("logIn"),
      sourceText("frequentlyAskedQuestions"),
      sourceText("contactUs"),
    ],
    [
      sourceText("forCompanies"),
      sourceText("howToPostAJob"),
      sourceText("pricing"),
      sourceText("hiringSuccessStories"),
    ],
    [
      sourceText("companyInformation"),
      sourceText("aboutUs"),
      sourceText("termsOfService"),
      sourceText("privacyPolicy"),
    ],
  ];
  return (
    <View style={s.footer}>
      <View style={[s.footerInner, !desktop && { flexDirection: "column" }]}>
        <View style={s.footerBrand}>
          <Logo backgroundColor="white" />
          <Text style={s.footerDesc}>
            {tText("aDirectHiringPlatformBuiltOnReviews")}
          </Text>
        </View>
        <View style={s.footerCols}>
          {cols.map((col) => (
            <View key={col[0]} style={s.footerCol}>
              <Text style={s.footerTitle}>{col[0]}</Text>
              {col.slice(1).map((x) => (
                <Pressable key={x} onPress={() => notify(x)}>
                  <Text style={s.footerLink}>{x}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
      <Text style={s.copy}>© 2026 GlobalWorkers</Text>
    </View>
  );
}

export default function HomeScreen() {
  "use no memo";
  useLocaleVersion();
  const jobs = useResource<Page<JobRow>>("/jobs?pageSize=3&sort=updatedAt", {
    items: [],
    total: 0,
    page: 1,
    pageSize: 3,
  });
  const companies = useResource<Page<CompanyRow>>("/companies?pageSize=1", {
    items: [],
    total: 0,
    page: 1,
    pageSize: 1,
  });
  const { width } = useWindowDimensions();
  const desktop = width >= 1024;
  const tablet = width >= 720;
  const padding = desktop ? 28 : tablet ? 24 : 16;
  return (
    <SafeAreaView style={s.safe}>
      <Header />
      <ScrollView style={s.page} showsVerticalScrollIndicator={false}>
        <View style={[s.content, { paddingHorizontal: padding }]}>
          <View style={[s.hero, desktop && s.heroDesktop]}>
            <View style={[s.heroCopy, desktop && { flex: 1 }]}>
              <Text style={s.badge}>{tText("noHiringSuccessFees")}</Text>

              <Search mobile={!tablet} />
              <View style={s.metrics}>
                {[
                  ...(!jobs.loading && !jobs.error
                    ? [
                        sourceFormat(
                          "openJobs",
                          { v0: jobs.data.total.toLocaleString() },
                          [],
                        ),
                      ]
                    : []),
                  ...(!companies.loading && !companies.error
                    ? [
                        sourceFormat(
                          "companies",
                          { v0: companies.data.total.toLocaleString() },
                          [],
                        ),
                      ]
                    : []),
                ].map((x) => (
                  <View key={x} style={s.metric}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={C.green}
                    />
                    <Text style={s.metricText}>{x}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={[s.visualWrap, desktop && { flex: 1.05 }]}>
              <Flow tablet={tablet} />
            </View>
          </View>
          <View style={s.section}>
            <View
              style={[
                s.sectionHead,
                !tablet && {
                  flexDirection: "column",
                  alignItems: "flex-start",
                },
              ]}
            >
              <View>
                <Text style={s.sectionTitle}>{tText("latestJobs")}</Text>
                <Text style={s.sectionSub}>
                  {tText("readReviewsFromPeopleWhoHaveWorked")}
                </Text>
              </View>
              <Pressable onPress={() => router.push("/jobs")} style={s.more}>
                <Text style={s.moreText}>{tText("seeMoreJobs")}</Text>
                <Ionicons name="arrow-forward" size={18} color={C.blueDark} />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.filters}
            >
              {[
                sourceText("all"),
                sourceText("noExperienceRequired"),
                sourceText("remoteWorkAvailable"),
                sourceText("fullTimeEmployee"),
                sourceText("freelanceContractWork"),
              ].map((x, i) => (
                <View key={x} style={[s.filter, i === 0 && s.filterActive]}>
                  <Text style={[s.filterText, i === 0 && { color: C.white }]}>
                    {x}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <View style={[s.jobGrid, !desktop && { flexDirection: "column" }]}>
              <ResourceStatus
                loading={jobs.loading}
                error={jobs.error}
                onRetry={jobs.refresh}
              />
              {jobs.data.items.map((job) => (
                <View key={job.id} style={{ flex: 1, minWidth: 260 }}>
                  <JobSearchCard
                    item={jobItem(job)}
                    onPressDetail={(id) => router.push(`/jobs/${id}` as never)}
                    onPressApply={(id) =>
                      router.push(`/jobs/${id}/apply` as never)
                    }
                  />
                </View>
              ))}
              {!jobs.loading && !jobs.error && !jobs.data.items.length && (
                <Text>{tText("thereAreNoOpenJobsYet")}</Text>
              )}
            </View>
          </View>
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              {tText("simplerHiringYouCanTrust")}
            </Text>
            <Text style={s.sectionSub}>
              {tText("supportFromYourFirstApplicationThroughEmployment")}
            </Text>
            <View style={[s.features, !desktop && { flexDirection: "column" }]}>
              <Feature
                icon="chatbubbles-outline"
                title={tText("directChat")}
                text={tText("chatDirectlyWithCompaniesFromQuestionsBefore")}
              />
              <Feature
                icon="ribbon-outline"
                title={tText("mutualReviews")}
                text={tText("companiesAndUsersReviewEachOtherTo")}
                green
              />
              <Feature
                icon="wallet-outline"
                title={tText("transparentPricing")}
                text={tText("noHiringSuccessFeesClearPricingTo")}
              />
            </View>
          </View>
          <View style={s.process}>
            <Text style={s.processHeading}>{tText("howItWorks")}</Text>
            <View style={[s.steps, !tablet && { flexDirection: "column" }]}>
              {[
                [
                  "search-outline",
                  sourceText("findJobs"),
                  sourceText("searchByTermsAndReviews"),
                ],
                [
                  "chatbubbles-outline",
                  sourceText("talkToTheCompany"),
                  sourceText("askQuestionsDirectlyInChat"),
                ],
                [
                  "people-outline",
                  sourceText("hiringAndReviews"),
                  sourceText("shareYourExperienceAfterWorkingTogether"),
                ],
              ].map(([icon, title, text], i) => (
                <View key={title} style={s.step}>
                  <Text style={s.stepNo}>{i + 1}</Text>
                  <Ionicons
                    name={icon as IconName}
                    size={27}
                    color={C.blueDark}
                  />
                  <View>
                    <Text style={s.stepTitle}>{title}</Text>
                    <Text style={s.stepText}>{text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View
            style={[
              s.cta,
              !tablet && { flexDirection: "column", alignItems: "stretch" },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.ctaTitle}>
                {tText("findYourNextWayOfWorking")}
              </Text>
              <Text style={s.ctaText}>
                {tText("findTheRightOpportunityOrTalentThrough")}
              </Text>
            </View>
            <View
              style={[s.ctaButtons, !tablet && { flexDirection: "column" }]}
            >
              <Button label={tText("findJobsForFree")} />
              <Button label={tText("postJobsForFree")} outline />
            </View>
          </View>
        </View>
        <Footer desktop={desktop} />
      </ScrollView>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: "#23436D",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.07,
  shadowRadius: 16,
  elevation: 2,
};
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  page: { flex: 1, backgroundColor: C.bg },
  content: { width: "100%", maxWidth: 1320, alignSelf: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    zIndex: 5,
  },
  headerInner: {
    width: "100%",
    maxWidth: 1320,
    minHeight: 72,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  nav: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 27 },
  navText: { color: C.text, fontSize: 14, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 20 },
  login: { color: C.blue, fontWeight: "800" },
  menu: {
    marginLeft: "auto",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileMenu: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  mobileItem: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  button: {
    minHeight: 44,
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.blue,
    borderWidth: 1,
    borderColor: C.blue,
  },
  buttonOutline: { backgroundColor: C.white },
  buttonText: { color: C.white, fontSize: 14, fontWeight: "800" },
  buttonTextOutline: { color: C.blue },
  hero: { paddingTop: 38, paddingBottom: 34, gap: 24 },
  heroDesktop: {
    minHeight: 500,
    flexDirection: "row",
    alignItems: "center",
    gap: 48,
  },
  heroCopy: { width: "100%" },
  badge: {
    alignSelf: "flex-start",
    color: C.green,
    backgroundColor: C.greenSoft,
    borderRadius: 99,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 14,
    fontSize: 12,
    fontWeight: "900",
  },
  heroTitle: {
    color: C.text,
    fontSize: 35,
    lineHeight: 49,
    fontWeight: "900",
    letterSpacing: -1.1,
  },
  heroTitleDesktop: { fontSize: 51, lineHeight: 66, letterSpacing: -2 },
  accent: {
    color: C.blue,
    textDecorationLine: "underline",
    textDecorationColor: "#9BC0FF",
  },
  heroText: {
    maxWidth: 630,
    marginTop: 14,
    color: C.sub,
    fontSize: 15,
    lineHeight: 25,
  },
  search: {
    marginTop: 22,
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 13,
    padding: 6,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow,
  },
  searchMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    padding: 10,
    gap: 4,
  },
  searchField: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
  },
  input: { outlineWidth: 0, flex: 1 },
  divider: { width: 1, height: 32, backgroundColor: C.border },
  dividerMobile: { width: "100%", height: 1 },
  searchButton: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.blue,
  },
  searchButtonText: { color: C.white, fontWeight: "900" },
  metrics: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 16 },
  metric: { flexDirection: "row", alignItems: "center", gap: 6 },
  metricText: { color: C.sub, fontSize: 12.5 },
  visualWrap: { width: "100%" },
  visual: {
    backgroundColor: C.blueSoft,
    borderRadius: 19,
    padding: 16,
    borderWidth: 1,
    borderColor: "#C9DAF3",
    ...shadow,
  },
  visualTitle: {
    textAlign: "center",
    color: C.navy,
    fontWeight: "900",
    marginBottom: 12,
  },
  flow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 7,
  },
  flowGroup: {
    flex: 1,
    minWidth: 110,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flowCard: {
    flex: 1,
    minHeight: 104,
    padding: 10,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  flowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  flowTitle: { marginTop: 7, color: C.navy, fontWeight: "900", fontSize: 12 },
  flowText: {
    marginTop: 3,
    textAlign: "center",
    color: C.sub,
    fontSize: 9.5,
    lineHeight: 13,
  },
  proofRow: { marginTop: 14, flexDirection: "row", gap: 10 },
  review: {
    flex: 1,
    minWidth: 0,
    backgroundColor: C.white,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: C.border,
    padding: 11,
  },
  reviewHead: { flexDirection: "row", alignItems: "center", gap: 6 },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#6B8FD9",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewType: { color: C.muted, fontSize: 8 },
  reviewName: { color: C.text, fontSize: 9.5, fontWeight: "800" },
  verified: {
    color: C.green,
    backgroundColor: C.greenSoft,
    borderRadius: 8,
    padding: 3,
    fontSize: 6.5,
    fontWeight: "900",
  },
  rating: { marginTop: 8, flexDirection: "row", gap: 7 },
  ratingNo: { fontWeight: "900" },
  stars: { color: C.green, fontSize: 11 },
  quote: { marginTop: 5, color: C.sub, fontSize: 8, lineHeight: 12 },
  chat: { width: 150, justifyContent: "center", gap: 7 },
  chatText: {
    backgroundColor: C.white,
    borderRadius: 8,
    padding: 7,
    color: C.sub,
    fontSize: 8,
    lineHeight: 12,
  },
  chatReply: { backgroundColor: "#DCEAFF", color: C.blueDark },
  section: { paddingTop: 28, paddingBottom: 18 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "900",
  },
  sectionSub: { marginTop: 4, color: C.sub, fontSize: 13, lineHeight: 20 },
  more: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 7,
  },
  moreText: { color: C.blueDark, fontSize: 13, fontWeight: "800" },
  filters: { marginTop: 14, gap: 8 },
  filter: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterActive: { backgroundColor: C.blue, borderColor: C.blue },
  filterText: { color: C.sub, fontSize: 12, fontWeight: "700" },
  jobGrid: { marginTop: 14, flexDirection: "row", gap: 14 },
  jobCard: {
    flex: 1,
    padding: 16,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow,
  },
  jobHead: { flexDirection: "row", alignItems: "center", gap: 11 },
  jobMark: {
    width: 45,
    height: 45,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  jobMarkText: { color: C.white, fontSize: 16, fontWeight: "900" },
  jobTitle: { color: C.text, fontSize: 16, fontWeight: "900" },
  company: { color: C.sub, fontSize: 12, marginTop: 3 },
  save: {
    width: 38,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: { marginTop: 13, flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: C.sub, fontSize: 11.5, flexShrink: 1 },
  salaryRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  salary: { color: C.text, fontSize: 13, fontWeight: "800" },
  jobRating: { color: "#B77A08", fontSize: 12, fontWeight: "800" },
  tags: { marginTop: 13, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: C.blueSoft,
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  tagPurple: { backgroundColor: "#F1EDFF" },
  tagText: { color: C.blueDark, fontSize: 9.5, fontWeight: "800" },
  jobButtons: { marginTop: 16, flexDirection: "row", gap: 9 },
  features: { marginTop: 16, flexDirection: "row", gap: 14 },
  feature: {
    flex: 1,
    minHeight: 122,
    padding: 18,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: { color: C.text, fontSize: 17, fontWeight: "900" },
  featureText: { marginTop: 5, color: C.sub, fontSize: 12, lineHeight: 18 },
  process: { marginTop: 18, marginBottom: 22 },
  processHeading: {
    color: C.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
  },
  steps: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  step: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  stepNo: {
    width: 28,
    height: 28,
    lineHeight: 28,
    borderRadius: 14,
    textAlign: "center",
    color: C.white,
    backgroundColor: C.blue,
    fontWeight: "900",
  },
  stepTitle: { color: C.text, fontSize: 13, fontWeight: "900" },
  stepText: { marginTop: 3, color: C.sub, fontSize: 10.5 },
  cta: {
    marginTop: 12,
    marginBottom: 44,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#C7DAF6",
    backgroundColor: C.blueSoft,
    padding: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  ctaTitle: { color: C.navy, fontSize: 26, lineHeight: 34, fontWeight: "900" },
  ctaText: { marginTop: 7, color: C.sub, fontSize: 13, lineHeight: 20 },
  ctaButtons: { flex: 1.25, flexDirection: "row", gap: 12 },
  footer: { backgroundColor: C.navy, padding: 28, paddingBottom: 18 },
  footerInner: {
    width: "100%",
    maxWidth: 1264,
    alignSelf: "center",
    flexDirection: "row",
    gap: 50,
  },
  footerBrand: { flex: 0.8, maxWidth: 320 },
  footerDesc: { marginTop: 13, color: "#BDCAE0", fontSize: 11, lineHeight: 18 },
  footerCols: {
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 22,
  },
  footerCol: { minWidth: 125, gap: 8 },
  footerTitle: {
    color: C.white,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },
  footerLink: { color: "#BDCAE0", fontSize: 11 },
  copy: {
    marginTop: 24,
    textAlign: "center",
    color: "#91A3BF",
    fontSize: 10.5,
  },
});
