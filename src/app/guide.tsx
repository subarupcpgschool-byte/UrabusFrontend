import { tText, useLocaleVersion } from "@/i18n/display";
import AppPage from "@/components/layout/AppPage";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
} from "@/components/ui/AppUI";
import { router } from "expo-router";

export default function GuidePage() {
  "use no memo";
  useLocaleVersion();
  return (
    <AppPage
      title={tText("userGuide")}
      subtitle={tText("learnTheBasicsOfUsingGlobalworkers")}
    >
      <Panel>
        <SectionTitle>{tText("1FindJobsAndCompanies")}</SectionTitle>
        <BodyText>{tText("useFindJobsOrFindCompaniesTo")}</BodyText>
        <AppButton
          label={tText("findJobs")}
          onPress={() => router.push("/jobs")}
        />
      </Panel>
      <Panel>
        <SectionTitle>{tText("2CreateAnAccount")}</SectionTitle>
        <BodyText>{tText("logInOrCreateAnAccountTo")}</BodyText>
        <AppButton
          label={tText("account")}
          onPress={() => router.push("/auth")}
        />
      </Panel>
      <Panel>
        <SectionTitle>{tText("3ApplicationsAndAfterHiring")}</SectionTitle>
        <BodyText>{tText("applyFromAJobDetailsPageAnd")}</BodyText>
      </Panel>
      <Panel>
        <SectionTitle>{tText("checkPricing")}</SectionTitle>
        <BodyText>{tText("theFreeCompanyPlanAllowsOneCompany")}</BodyText>
        <AppButton
          label={tText("viewPricing")}
          onPress={() => router.push("/price")}
        />
      </Panel>
    </AppPage>
  );
}
