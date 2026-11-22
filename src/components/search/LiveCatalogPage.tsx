import { translateText } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useResource, ResourceStatus } from "@/api/useResource";
import { query, type Page } from "@/api/platform";
import {
  companyItem,
  jobItem,
  type CompanyRow,
  type JobRow,
} from "@/api/models";
import { Pager } from "@/api/ApiUI";
import SearchPageShell from "./SearchPageShell";
import SearchFilterPanel from "./SearchFilterPanel";
import SearchResultHeader from "./SearchResultHeader";
import JobSearchCard from "./JobSearchCard";
import CompanySearchCard from "./CompanySearchCard";
import { JOB_FILTER_CONFIG, COMPANY_FILTER_CONFIG } from "./searchData";
import type { SearchConditions } from "./types";
export default function LiveCatalogPage({
  kind,
}: {
  kind: "jobs" | "companies";
}) {
  "use no memo";
  useLocaleVersion();
  const params = useLocalSearchParams<{
    keyword?: string;
    location?: string;
    companyId?: string;
  }>();
  const { width } = useWindowDimensions();
  const [conditions, setConditions] = useState<SearchConditions | null>(() =>
      params.keyword || params.location
        ? {
            keyword: params.keyword || "",
            location: params.location || "",
            selectedValues: [],
          }
        : null,
    ),
    [page, setPage] = useState(1),
    [sort, setSort] = useState(kind === "jobs" ? "updatedAt" : "rating");
  const firstOptions = useResource<{ value: string; label: string }[]>(
    `/options?category=${kind === "jobs" ? "employment" : "industry"}`,
    [],
  );
  const workOptions = useResource<{ value: string; label: string }[]>(
    kind === "jobs" ? "/options?category=workStyle" : null,
    [],
  );
  const config = {
    ...(kind === "jobs" ? JOB_FILTER_CONFIG : COMPANY_FILTER_CONFIG),
    firstGroupOptions: firstOptions.data,
    ...(kind === "jobs" ? { secondGroupOptions: workOptions.data } : {}),
  };
  const area = conditions?.area;
  const resource = useResource<Page<JobRow | CompanyRow>>(
    `/${kind}?` +
      query({
        q: conditions?.keyword ?? "",
        location: conditions?.location ?? "",
        selectedValues: conditions?.selectedValues.join(",") ?? "",
        salaryMin: conditions?.salaryMin || undefined,
        salaryMax: conditions?.salaryMax || undefined,
        companyId: params.companyId,
        page,
        pageSize: 20,
        sort,
        latitude: area?.latitude,
        longitude: area?.longitude,
        radiusKm: area?.radiusKm,
      }),
    { items: [], total: 0, page, pageSize: 20 },
  );
  const change = (c: SearchConditions | null) => {
    setConditions(c);
    setPage(1);
  };
  return (
    <SearchPageShell
      title={translateText(
        kind === "jobs" ? sourceText("jobSearch") : sourceText("companySearch"),
      )}
      subtitle=""
      activeNav={kind === "jobs" ? "jobs" : "companies"}
    >
      <View
        style={{
          flexDirection: width < 900 ? "column" : "row",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <SearchFilterPanel
          key={params.companyId || kind}
          config={config}
          initialConditions={conditions}
          onSearch={change}
        />
        <View
          style={{
            flex: 1,
            width: width < 900 ? "100%" : undefined,
            minWidth: 0,
            gap: 14,
          }}
        >
          <SearchResultHeader
            label={tText("searchResults")}
            count={resource.data.total}
            sort={
              sort === "rating"
                ? sourceText("highestRatedFirst")
                : sourceText("mostRecentlyUpdated")
            }
            onChangeSort={() => {
              setSort((v) => (v === "rating" ? "updatedAt" : "rating"));
              setPage(1);
            }}
            chips={conditions?.selectedValues ?? []}
            onClear={() => change(null)}
          />
          <ResourceStatus
            loading={resource.loading}
            error={resource.error}
            onRetry={resource.refresh}
          />
          <Pager page={page} total={resource.data.total} onChange={setPage} />
          {resource.data.items.map((row) =>
            kind === "jobs" ? (
              <JobSearchCard
                key={row.id}
                item={jobItem(row as JobRow)}
                onPressDetail={(id) => router.push(`/jobs/${id}` as never)}
                onPressApply={(id) => router.push(`/jobs/${id}/apply` as never)}
              />
            ) : (
              <CompanySearchCard
                key={row.id}
                item={companyItem(row as CompanyRow)}
                onPressDetail={() =>
                  router.push(`/companies/${row.id}` as never)
                }
                onPressJobs={() =>
                  router.push({
                    pathname: "/jobs",
                    params: { companyId: row.id },
                  })
                }
              />
            ),
          )}
          {!resource.loading &&
            !resource.error &&
            !resource.data.items.length && (
              <Text>
                {tText("matching")}
                {kind === "jobs" ? sourceText("job") : sourceText("company")}
                {tText("wereNotFound")}
              </Text>
            )}
          <Pager page={page} total={resource.data.total} onChange={setPage} />
        </View>
      </View>
    </SearchPageShell>
  );
}
