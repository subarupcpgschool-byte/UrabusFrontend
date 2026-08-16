import CompanySearchCard from "@/components/search/CompanySearchCard";
import SearchFilterPanel from "@/components/search/SearchFilterPanel";
import SearchPageShell from "@/components/search/SearchPageShell";
import SearchResultHeader from "@/components/search/SearchResultHeader";
import {
  COMPANY_FILTER_CONFIG,
  COMPANY_SEARCH_ITEMS,
} from "@/components/search/searchData";
import type { SearchConditions } from "@/components/search/types";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, useWindowDimensions, View } from "react-native";

export default function CompanySearchPage() {
  const { width } = useWindowDimensions();
  const [conditions, setConditions] = useState<SearchConditions | null>(null);
  const [sort, setSort] = useState("評価が高い順");
  const chips = conditions?.selectedValues ?? [];
  const results = useMemo(
    () =>
      conditions && conditions.selectedValues.length > 0
        ? COMPANY_SEARCH_ITEMS.filter((_, i) => i < 3)
        : COMPANY_SEARCH_ITEMS,
    [conditions],
  );
  const changeSort = () =>
    setSort((v) =>
      v === "評価が高い順"
        ? "公開求人数順"
        : v === "公開求人数順"
          ? "新着順"
          : "評価が高い順",
    );
  return (
    <SearchPageShell
      title="企業検索"
      subtitle="業種・地域・企業評価から働きたい企業を探せます"
      activeNav="companies"
    >
      <View style={[s.layout, width < 900 && s.mobile]}>
        <SearchFilterPanel
          config={COMPANY_FILTER_CONFIG}
          onSearch={(next) => {
            setConditions(next);
            Alert.alert(
              "企業検索",
              `${next.selectedValues.length || "すべての"}条件で検索しました。`,
            );
          }}
        />
        <View style={s.results}>
          <SearchResultHeader
            label="企業検索結果"
            count={conditions ? 84 : 326}
            sort={sort}
            onChangeSort={changeSort}
            chips={chips}
            onClear={() => setConditions(null)}
          />
          <View style={s.grid}>
            {results.map((item) => (
              <CompanySearchCard
                key={item.id}
                item={item}
                onPressDetail={() =>
                  Alert.alert(
                    item.companyName,
                    "企業詳細画面へ遷移するイベントです。",
                  )
                }
                onPressJobs={() => router.push("/jobs" as never)}
              />
            ))}
          </View>
        </View>
      </View>
    </SearchPageShell>
  );
}
const s = StyleSheet.create({
  layout: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  mobile: { flexDirection: "column" },
  results: { flex: 1, minWidth: 0, gap: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 13 },
});
