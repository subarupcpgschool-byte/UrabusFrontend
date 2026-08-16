import JobSearchCard from "@/components/search/JobSearchCard";
import SearchFilterPanel from "@/components/search/SearchFilterPanel";
import SearchPageShell from "@/components/search/SearchPageShell";
import SearchResultHeader from "@/components/search/SearchResultHeader";
import {
  JOB_FILTER_CONFIG,
  JOB_SEARCH_ITEMS,
} from "@/components/search/searchData";
import type { SearchConditions } from "@/components/search/types";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, useWindowDimensions, View } from "react-native";

export default function JobSearchPage() {
  const { width } = useWindowDimensions();
  const [conditions, setConditions] = useState<SearchConditions | null>(null);
  const [sort, setSort] = useState("おすすめ順");
  const chips = conditions?.selectedValues ?? [];
  const results = useMemo(
    () =>
      conditions && conditions.selectedValues.length > 0
        ? JOB_SEARCH_ITEMS.filter((_, i) => i < 2)
        : JOB_SEARCH_ITEMS,
    [conditions],
  );
  const changeSort = () =>
    setSort((v) =>
      v === "おすすめ順"
        ? "新着順"
        : v === "新着順"
          ? "評価が高い順"
          : "おすすめ順",
    );
  return (
    <SearchPageShell
      title="求人検索"
      subtitle="職種・勤務地・働き方・評価から求人を探せます"
      activeNav="jobs"
    >
      <View style={[s.layout, width < 900 && s.mobile]}>
        <SearchFilterPanel
          config={JOB_FILTER_CONFIG}
          onSearch={(next) => {
            setConditions(next);
            Alert.alert(
              "求人検索",
              `${next.selectedValues.length || "すべての"}条件で検索しました。`,
            );
          }}
        />
        <View style={s.results}>
          <SearchResultHeader
            label="検索結果"
            count={conditions ? 326 : 1248}
            sort={sort}
            onChangeSort={changeSort}
            chips={chips}
            onClear={() => setConditions(null)}
          />
          {results.map((item) => (
            <JobSearchCard
              key={item.id}
              item={item}
              onPressDetail={(id) => router.push(`/jobs/${id}` as never)}
              onPressApply={(id) => router.push(`/jobs/${id}/apply` as never)}
            />
          ))}
        </View>
      </View>
    </SearchPageShell>
  );
}
const s = StyleSheet.create({
  layout: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  mobile: { flexDirection: "column" },
  results: { flex: 1, minWidth: 0, gap: 13 },
});
