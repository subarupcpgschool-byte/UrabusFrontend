import { useLocaleVersion } from "@/i18n/display";
import { Redirect } from "expo-router";
export default function CompanyReviewPage() {
  "use no memo";
  useLocaleVersion();
  return <Redirect href="/user/evaluations" />;
}
