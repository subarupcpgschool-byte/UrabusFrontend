import { useLocaleVersion } from "@/i18n/display";
import LiveCatalogPage from "@/components/search/LiveCatalogPage";
export default function JobSearchPage() {
  "use no memo";
  useLocaleVersion();
  return <LiveCatalogPage kind="jobs" />;
}
