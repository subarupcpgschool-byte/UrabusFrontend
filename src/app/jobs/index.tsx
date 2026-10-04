import { useMapResults } from "@/components/search/useMapResults";
import JobSearchCard from "@/components/search/JobSearchCard";
import SearchFilterPanel from "@/components/search/SearchFilterPanel";
import SearchPageShell from "@/components/search/SearchPageShell";
import SearchResultHeader from "@/components/search/SearchResultHeader";
import {
  JOB_FILTER_CONFIG,
  JOB_SEARCH_ITEMS,
} from "@/components/search/searchData";
import type { SearchConditions } from "@/components/search/types";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function JobSearchPage() {
  const params=useLocalSearchParams<{keyword?:string;location?:string}>();
  const { width } = useWindowDimensions();
  const [conditions, setConditions] = useState<SearchConditions | null>(()=> params.keyword || params.location ? {keyword:params.keyword||"",location:params.location||"",selectedValues:[]} : null);
  const [sort, setSort] = useState("おすすめ順");
  const chips = conditions?.selectedValues ?? [];
  const mapResults = useMapResults("jobs",conditions);
  const useSamples = useMemo(() => JOB_SEARCH_ITEMS.filter(item => {
    const keyword=conditions?.keyword.trim().toLowerCase()??"";
    const location=conditions?.location.trim().toLowerCase()??"";
    return JSON.stringify(item).toLowerCase().includes(keyword) && item.location.toLowerCase().includes(location);
  }), [conditions]);
  const results = conditions?.area ? mapResults.jobs : useSamples;
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
          initialConditions={conditions}
          config={JOB_FILTER_CONFIG}
          onSearch={(next) => {
            setConditions(next);

          }}
        />
        <View style={s.results}>
          {mapResults.busy && <Text>検索中…</Text>}
          {!!mapResults.error && <Text accessibilityRole="alert" style={{color:"#B42318"}}>{mapResults.error}</Text>}
          {conditions?.area && !mapResults.busy && !mapResults.error && results.length === 0 && <Text>指定範囲に座標登録済みのデータがありません。</Text>}
          <SearchResultHeader
            label="検索結果"
            count={results.length}
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
