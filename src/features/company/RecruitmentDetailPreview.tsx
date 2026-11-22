import { sourceText } from "@/i18n/source";
import { tText, translateText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { StyleSheet, View } from "react-native";
import {
  BodyText,
  Panel,
  SectionTitle,
  StatusBadge,
} from "@/components/ui/AppUI";
import { RecruitmentArticle } from "./RecruitmentArticle";

type DraftPreview = {
  kind: string;
  title: string;
  employment: string;
  location: string;
  compensation: string;
  requirements: string;
  startDate: string;
  endDate: string;
  articleHtml: string;
  articleCss: string;
};

export function RecruitmentDetailPreview({
  draft,
  companyName,
  commonCss,
  visibility,
}: {
  draft: DraftPreview;
  companyName?: string | null;
  commonCss?: string;
  visibility: string;
}) {
  "use no memo";
  useLocaleVersion();
  const company = draft.kind === "COMPANY_RECRUITMENT";
  const title = draft.title.trim() || tText("postingTitle");
  const name = companyName?.trim() || tText("companyName");
  const location = draft.location.trim() || sourceText("notEntered_1031");
  const pay = draft.compensation.trim() || sourceText("notEntered_1031");

  return (
    <View style={s.stack}>
      <SectionTitle>{tText("fullPagePreview")}</SectionTitle>
      <BodyText>
        {visibility} {tText("showingYourCurrentChanges")}
      </BodyText>
      <View style={s.page}>
        <Text accessibilityRole="header" style={s.pageTitle}>
          {company ? sourceText("companyDetails") : sourceText("jobDetails")}
        </Text>
        <Panel>
          <View style={s.hero}>
            <View style={s.mark}>
              <Text localize={false} style={s.initial}>
                {name.slice(0, 1)}
              </Text>
            </View>
            <View style={s.identity}>
              <Text localize={false} accessibilityRole="header" style={s.title}>
                {company ? name : title}
              </Text>
              <BodyText localize={false}>
                {company
                  ? translateText(draft.location.trim()) ||
                    tText("noLocationEntered")
                  : name}
              </BodyText>
            </View>
          </View>
          <View style={s.tags}>
            {!!draft.location.trim() && (
              <StatusBadge label={draft.location.trim()} />
            )}
            {!!draft.employment && <StatusBadge label={draft.employment} />}
          </View>
          {!company && <Text style={s.pay}>{pay}</Text>}
        </Panel>
        <Panel>
          <SectionTitle>
            {company
              ? sourceText("companyRecruitment_309")
              : sourceText("jobDescription")}
          </SectionTitle>
          {company && (
            <Text localize={false} accessibilityRole="header" style={s.title}>
              {title}
            </Text>
          )}
          {draft.articleHtml ? (
            <RecruitmentArticle
              html={draft.articleHtml}
              commonCss={commonCss}
              articleCss={draft.articleCss}
            />
          ) : (
            <BodyText>{tText("enterContentToSeeItHere")}</BodyText>
          )}
        </Panel>
        <Panel>
          <SectionTitle>
            {company
              ? sourceText("postingOverview")
              : sourceText("locationAndWorkArrangements")}
          </SectionTitle>
          <BodyText>
            {tText("workLocationOrRecruitmentArea")}
            {location}
          </BodyText>
          <BodyText>
            {tText("employmentType")}
            {draft.employment || sourceText("notEntered_1031")}
          </BodyText>
          <BodyText>
            {tText("pay")}
            {pay}
          </BodyText>
          <BodyText>
            {tText("postingPeriod")}
            {draft.startDate || sourceText("noStartRestriction")} 〜{" "}
            {draft.endDate || sourceText("noEndDate")}
          </BodyText>
        </Panel>
        <Panel>
          <SectionTitle>{tText("requirements")}</SectionTitle>
          <BodyText>
            {draft.requirements.trim() || sourceText("notEntered_1031")}
          </BodyText>
        </Panel>
        <Panel>
          <SectionTitle>
            {company
              ? sourceText("applyToThisOpportunity")
              : sourceText("applyToThisJob")}
          </SectionTitle>
          <Text style={s.pay}>{pay}</Text>
          <View
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            style={s.action}
          >
            <Text style={s.actionText}>{tText("apply")}</Text>
          </View>
          <BodyText>{tText("youCannotApplyFromThePreview")}</BodyText>
        </Panel>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  stack: { gap: 8 },
  page: { gap: 12, padding: 10, borderRadius: 12, backgroundColor: "#F1F6FD" },
  pageTitle: { color: "#183455", fontWeight: "700", fontSize: 17 },
  hero: { flexDirection: "row", alignItems: "center", gap: 12 },
  mark: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#315B8A",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: "#FFF", fontSize: 22, fontWeight: "800" },
  identity: { flex: 1, minWidth: 0, gap: 4 },
  title: { color: "#183455", fontSize: 20, fontWeight: "800" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pay: { color: "#183455", fontSize: 17, fontWeight: "800" },
  action: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#DCE8F7",
  },
  actionText: { color: "#315275", fontWeight: "700" },
});
