import { tText, useLocaleVersion } from "@/i18n/display";
import AppPage from "@/components/layout/AppPage";
import { BodyText, Panel, SectionTitle } from "@/components/ui/AppUI";

export default function ReviewsPage() {
  "use no memo";
  useLocaleVersion();
  return (
    <AppPage
      title={tText("aboutReviews")}
      subtitle={tText("reviewsHelpCompaniesAndUsersUnderstandEach")}
    >
      <Panel>
        <SectionTitle>{tText("mutualCompanyAndUserReviews")}</SectionTitle>
        <BodyText>
          {tText("usersReviewCompaniesAndCompaniesReviewHired")}
        </BodyText>
      </Panel>
      <Panel>
        <SectionTitle>{tText("reviewsAfterHiring")}</SectionTitle>
        <BodyText>{tText("companiesShouldProvideARatingAndWritten")}</BodyText>
      </Panel>
      <Panel>
        <SectionTitle>{tText("postingFeeDiscountConditions")}</SectionTitle>
        <BodyText>
          {tText("completingNegotiationsAndSubmittingReviewsDuringProbation")}
        </BodyText>
      </Panel>
    </AppPage>
  );
}
