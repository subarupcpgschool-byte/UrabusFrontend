import { useMemo, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, Pressable } from "@/i18n/native";
import { localeTag, tText, useLocaleVersion } from "@/i18n/display";
import { AppButton } from "@/components/ui/AppUI";
import { dates, nextBucket, shift, PALETTE, type Dashboard } from "./model";
import { ChartFrame } from "./ChartFrame";
import { chartDocument, type ChartPayload } from "./chartDocument";

export function TrendChart({
  data,
  height = 320,
  onSelect,
}: {
  data: Dashboard;
  height?: number;
  onSelect: (id: string, from: string, to: string) => void;
}) {
  "use no memo";
  const locale = useLocaleVersion();
  const [point, setPoint] = useState<number | null>(null),
    [failed, setFailed] = useState(false),
    [retry, setRetry] = useState(0);
  const ticks = useMemo(
    () => dates(data.from, data.to, data.bucket),
    [data.from, data.to, data.bucket],
  );
  const counts = useMemo(
    () =>
      new Map(
        data.points.map((p) => [
          p.date + ":" + p.recruitmentId,
          Number(p.count),
        ]),
      ),
    [data.points],
  );
  const count = (day: string, id: string) => counts.get(day + ":" + id) || 0;
  const total = (day: string) =>
    data.series.reduce((sum, s) => sum + count(day, s.id), 0);
  const html = useMemo(() => {
    const payload: ChartPayload = {
      labels: ticks,
      datasets: data.series.length
        ? data.series.map((s, i) => ({
            label: s.title,
            data: ticks.map((day) => counts.get(day + ":" + s.id) || 0),
            borderColor: PALETTE[i % 10],
            backgroundColor: data.series.length ? PALETTE[i % 10] : "#0866FF",
          }))
        : [
            {
              label: tText("dashApplicationsTotal"),
              data: ticks.map(() => 0),
              borderColor: "#0866FF",
              backgroundColor: "#0866FF",
            },
          ],
      axisX: tText("dashDateAxis"),
      axisY: tText("dashCountAxis"),
      title: tText("dashTrend"),
      totalLabel: tText("dashTotal", { count: "{{count}}" }),
      locale: localeTag(),
    };
    return chartDocument(payload);
  }, [data.series, counts, ticks, locale]);
  const active = point !== null ? ticks[point] : null;
  return (
    <View style={{ gap: 6 }} testID="application-trend-chart">
      {!failed ? (
        <ChartFrame
          key={retry}
          html={html}
          height={height}
          title={tText("dashTrend")}
          onPoint={(index) => {
            if (index >= 0 && index < ticks.length) setPoint(index);
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={{ height, justifyContent: "center", gap: 12 }}>
          <Text accessibilityRole="alert">{tText("dashChartError")}</Text>
          <AppButton
            label={tText("reload")}
            onPress={() => {
              setFailed(false);
              setRetry((n) => n + 1);
            }}
          />
        </View>
      )}
      <ScrollView style={{ maxHeight: 38 }} contentContainerStyle={s.legend}>
        {(data.series.length
          ? data.series
          : [
              {
                id: "empty",
                title: tText("dashTotal", { count: 0 }),
                deleted: false,
              },
            ]
        ).map((item, i) => (
          <View key={item.id} style={s.legendItem}>
            <View
              style={{
                width: 23,
                height: 2,
                backgroundColor: data.series.length
                  ? PALETTE[i % 10]
                  : "#0866FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 5,
                  backgroundColor: data.series.length
                    ? PALETTE[i % 10]
                    : "#0866FF",
                }}
              />
            </View>
            <Text localize={false} style={s.legendLabel}>
              {item.title}
              {item.deleted ? ` (${tText("dashDeletedJob")})` : ""}
            </Text>
          </View>
        ))}
      </ScrollView>
      {active && (
        <ScrollView
          style={{
            maxHeight: 120,
            position: "absolute",
            top: 6,
            left: 40,
            right: 6,
            zIndex: 10,
          }}
          contentContainerStyle={s.tooltip}
          accessibilityLiveRegion="polite"
        >
          <Text style={s.bold}>
            {tText("dashPeriodLabel", {
              from: active < data.from ? data.from : active,
              to:
                shift(nextBucket(active, data.bucket), -1) > data.to
                  ? data.to
                  : shift(nextBucket(active, data.bucket), -1),
            })}
            　{tText("dashTotal", { count: total(active) })}
          </Text>
          {data.series.map((item, i) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() =>
                onSelect(
                  item.id,
                  active < data.from ? data.from : active,
                  shift(nextBucket(active, data.bucket), -1) > data.to
                    ? data.to
                    : shift(nextBucket(active, data.bucket), -1),
                )
              }
              style={s.tooltipRow}
            >
              <Text
                localize={false}
                style={{ color: PALETTE[i % 10], flex: 1 }}
              >
                {item.title}
              </Text>
              <Text style={s.bold}>
                {tText("dashCount", { count: count(active, item.id) })} ›
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    maxWidth: "100%",
  },
  legendLabel: {
    fontSize: 13,
    color: "#173650",
    fontWeight: "600",
    flexShrink: 1,
  },
  tooltip: {
    backgroundColor: "#F0F7FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    gap: 6,
  },
  tooltipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 9,
  },
  bold: { fontSize: 13, fontWeight: "700", color: "#173650" },
});
