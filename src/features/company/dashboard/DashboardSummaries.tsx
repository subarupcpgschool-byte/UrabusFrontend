import { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "@/i18n/native";
import { localeTag, tText, useLocaleVersion } from "@/i18n/display";
import { SectionTitle } from "@/components/ui/AppUI";
import { ChartFrame } from "./ChartFrame";
import { chartDocument } from "./chartDocument";
import { PALETTE, type Dashboard } from "./model";

export function OutcomeSummary({
  data,
  compact = false,
}: {
  data: Dashboard;
  compact?: boolean;
}) {
  "use no memo";
  const locale = useLocaleVersion();
  const [failed, setFailed] = useState(false);
  const accepted = data.staff.reduce((n, s) => n + Number(s.accepted), 0);
  const rejected = data.staff.reduce((n, s) => n + Number(s.rejected), 0);
  const total = accepted + rejected;
  const html = useMemo(
    () =>
      chartDocument({
        kind: "doughnut",
        labels: [tText("dashAccepted"), tText("dashRejected")],
        datasets: [
          {
            label: tText("dashOutcomeMix"),
            data: [accepted, rejected],
            borderColor: "#FFFFFF",
            backgroundColor: "#0D9488",
          },
        ],
        axisX: "",
        axisY: "",
        title: tText("dashOutcomeMix"),
        totalLabel: "",
        locale: localeTag(),
      }),
    [accepted, rejected, locale],
  );
  return (
    <View style={[s.card, compact && { gap: 6 }]}>
      <SectionTitle>{tText("dashOutcomeMix")}</SectionTitle>
      {!compact && <Text style={s.note}>{tText("dashOutcomeNote")}</Text>}
      {failed ? (
        <Text accessibilityRole="alert">{tText("dashChartError")}</Text>
      ) : (
        <View>
          <ChartFrame
            html={html}
            title={tText("dashOutcomeMix")}
            height={compact ? 106 : 160}
            onPoint={() => {}}
            onError={() => setFailed(true)}
          />
          <View pointerEvents="none" style={s.center}>
            <Text style={[s.total, compact && { fontSize: 22 }]}>
              {tText("dashMetricCount", { count: total })}
            </Text>
            <Text style={s.note}>{tText("dashDecisions")}</Text>
          </View>
        </View>
      )}
      <View style={s.legend}>
        <View style={[s.dot, { backgroundColor: "#0D9488" }]} />
        <Text style={s.note}>{tText("dashAccepted")}</Text>
        <Text style={s.count}>{accepted}</Text>
      </View>
      <View style={s.legend}>
        <View style={[s.dot, { backgroundColor: "#E85D75" }]} />
        <Text style={s.note}>{tText("dashRejected")}</Text>
        <Text style={s.count}>{rejected}</Text>
      </View>
      {!total && <Text style={s.note}>{tText("dashNoDecisions")}</Text>}
    </View>
  );
}
export function RecruitmentTotals({
  data,
  compact = false,
}: {
  data: Dashboard;
  compact?: boolean;
}) {
  "use no memo";
  useLocaleVersion();
  const totals = new Map<string, number>();
  for (const p of data.points)
    totals.set(
      p.recruitmentId,
      (totals.get(p.recruitmentId) || 0) + Number(p.count),
    );
  const jobs = data.series
    .map((j, index) => ({
      ...j,
      count: totals.get(j.id) || 0,
      color: PALETTE[index % 10],
    }))
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...jobs.map((j) => j.count));
  return (
    <View style={[s.card, compact && { gap: 6 }]}>
      <SectionTitle>{tText("dashJobsTotal")}</SectionTitle>
      <Text style={s.note}>{tText("dashSelectedPeriod")}</Text>
      {!jobs.length && <Text style={s.note}>{tText("dashNoJobs")}</Text>}
      <ScrollView
        style={{ maxHeight: compact ? 90 : 240 }}
        nestedScrollEnabled
        contentContainerStyle={{ gap: 12 }}
      >
        {jobs.map((j) => (
          <View key={j.id} style={{ gap: 8 }}>
            <View style={s.legend}>
              <Text localize={false} style={s.job}>
                {j.title}
              </Text>
              <Text style={s.count}>
                {tText("dashMetricCount", { count: j.count })}
              </Text>
            </View>
            <View style={s.track}>
              <View
                style={{
                  width: `${(j.count / max) * 100}%`,
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: j.color,
                }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  card: { gap: 14 },
  note: { fontSize: 12, color: "#64748B", lineHeight: 19 },
  center: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  total: { fontSize: 28, color: "#132840", fontWeight: "700" },
  legend: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  count: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: "auto",
  },
  job: { flex: 1, fontSize: 12, color: "#334155" },
  track: { backgroundColor: "#F1F5F9", height: 8, borderRadius: 8 },
});
