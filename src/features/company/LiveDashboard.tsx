import { useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Modal,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { query } from "@/api/platform";
import AppPage from "@/components/layout/AppPage";
import { AppDatePicker, AppSelect } from "@/components/form";
import { Panel, SectionTitle, BodyText } from "@/components/ui/AppUI";
import { Ionicons } from "@expo/vector-icons";
import { DashboardButton, DashboardMetric } from "./dashboard/DashboardUI";
import { Text } from "@/i18n/native";
import { sourceText } from "@/i18n/source";
import { localeTag, tText, useLocaleVersion } from "@/i18n/display";
import {
  OutcomeSummary,
  RecruitmentTotals,
} from "./dashboard/DashboardSummaries";
import { TrendChart } from "./dashboard/TrendChart";
import { RecruitmentPicker } from "./dashboard/RecruitmentPicker";
import { PeriodDetailModal } from "./dashboard/PeriodDetailModal";
import {
  EMPTY,
  today,
  shift,
  validRange,
  type Dashboard,
  type Recruitment,
} from "./dashboard/model";

export default function LiveDashboard() {
  "use no memo";
  useLocaleVersion();
  const { token, user } = useAuth();
  const { width, height } = useWindowDimensions();
  const wide = width >= 1180;
  const [filters, setFilters] = useState(false);
  const chartHeight = wide ? Math.max(130, Math.min(220, height - 608)) : 240;
  const [from, setFrom] = useState(() => shift(today(), -29)),
    [to, setTo] = useState(today),
    [bucket, setBucket] = useState("day");
  const [range, setRange] = useState(() => ({
    from: shift(today(), -29),
    to: today(),
    bucket: "day",
  }));
  const [selected, setSelected] = useState<Recruitment[]>([]),
    [picker, setPicker] = useState(false),
    [error, setError] = useState(false);
  const [periodPreset, setPeriodPreset] = useState("30"),
    [info, setInfo] = useState(false);
  const [selection, setSelection] = useState<{
    id: string;
    from: string;
    to: string;
  } | null>(null);
  const company =
    user?.accountType === "COMPANY" || user?.accountType === "EMPLOYEE";
  const r = useResource<Dashboard>(
    token && company
      ? "/company-dashboard?" +
          query({ ...range, jobs: selected.map((s) => s.id).join(",") })
      : null,
    EMPTY,
    true,
  );
  const apply = () => {
    if (!validRange(from, to, bucket)) {
      setError(true);
      return;
    }
    setError(false);
    setRange({ from, to, bucket });
    setPeriodPreset("custom");
    setFilters(false);
  };
  const preset = (type: string) => {
    setPeriodPreset(type);
    const end = today();
    let start = shift(end, -29),
      unit = "day";
    if (type === "month") start = end.slice(0, 7) + "-01";
    if (type === "year") {
      start = end.slice(0, 4) + "-01-01";
      unit = "month";
    }
    if (type === "all") {
      start = r.data.earliestDate || start;
      unit = "month";
    }
    setFrom(start);
    setTo(end);
    setBucket(unit);
    setRange({ from: start, to: end, bucket: unit });
    setError(false);
  };
  const d = r.data,
    bill = d.billing,
    loaded = r.loaded && !r.loading && !r.error && company;
  const staffMax = Math.max(
    1,
    ...d.staff.flatMap((s) => [Number(s.accepted), Number(s.rejected)]),
  );
  const review = (state: string) =>
    router.push({ pathname: "/company/evaluations", params: { state } });
  const billing = loaded && bill && (
    <Panel style={s.billingCard}>
      <View style={s.billingRow}>
        <Text style={s.billingTitle}>{tText("dashBilling")}</Text>
        <View style={s.divider} />
        <View style={s.planBadge}>
          <Text style={s.planText}>
            {bill.plan.code === "FREE" ? tText("dashFree") : bill.plan.name}
          </Text>
        </View>
        <Text style={s.amount}>
          {bill.amount === null
            ? tText("dashAmountUnknown")
            : new Intl.NumberFormat(localeTag(), {
                style: "currency",
                currency: "JPY",
                maximumFractionDigits: 0,
              }).format(bill.amount)}
        </Text>
        {!wide && bill.plan.code === "FREE" && (
          <Text style={s.billNote}>{tText("dashNoCharge")}</Text>
        )}
        {bill.upgradeUrl && (
          <DashboardButton
            label={tText("dashUpgrade")}
            active
            onPress={() => router.push(bill.upgradeUrl as never)}
          />
        )}
      </View>
      {(bill.pending > 0 || bill.overdue > 0) && (
        <View style={s.billingLinks}>
          {bill.pending > 0 && (
            <DashboardButton
              label={tText("dashPending", { count: bill.pending })}
              icon="star-outline"
              onPress={() => review("pending")}
            />
          )}
          {bill.overdue > 0 && (
            <DashboardButton
              label={tText("dashOverdue", { count: bill.overdue })}
              icon="alert-circle-outline"
              onPress={() => review("overdue")}
            />
          )}
          {!wide && <Text style={s.hint}>{tText("dashReviewFeeNote")}</Text>}
        </View>
      )}
    </Panel>
  );
  const filterControls = (
    <>
      <View style={s.controls}>
        <View style={s.dateField}>
          <AppDatePicker
            label={tText("dashPeriodFrom")}
            value={from}
            onValueChange={setFrom}
          />
        </View>
        <View style={s.dateField}>
          <AppDatePicker
            label={tText("dashPeriodTo")}
            value={to}
            onValueChange={setTo}
          />
        </View>
        <View style={s.bucketField}>
          <AppSelect
            label={tText("dashBucket")}
            value={bucket}
            onValueChange={setBucket}
            options={[
              { value: "day", label: tText("dashDay") },
              { value: "week", label: tText("dashWeek") },
              { value: "month", label: tText("dashMonth") },
            ]}
          />
        </View>
        <DashboardButton label={tText("dashApply")} active onPress={apply} />
      </View>
      {error && (
        <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
          {tText("dashInvalidRange")}
        </Text>
      )}
    </>
  );
  const trend = company && (!r.loaded || d.canViewApplicants) && (
    <Panel style={s.trendCard}>
      <View style={s.cardHeader}>
        <SectionTitle>{tText("dashTrend")}</SectionTitle>
        <View style={s.presets}>
          {(
            [
              ["30", "dash30"],
              ["month", "dashThisMonth"],
              ["year", "dashYear"],
              ["all", "dashAllTime"],
            ] as const
          ).map(([type, label]) => (
            <DashboardButton
              key={type}
              label={tText(label)}
              active={periodPreset === type}
              disabled={!loaded}
              onPress={() => preset(type)}
            />
          ))}
        </View>
      </View>
      <View style={s.scopeRow}>
        <DashboardButton
          label={tText("dashFilters")}
          icon="options-outline"
          onPress={() => setFilters(true)}
        />
        <DashboardButton
          label={tText("dashCompare")}
          icon="swap-horizontal-outline"
          onPress={() => setPicker((v) => !v)}
        />
        {!!selected.length && (
          <DashboardButton
            label={tText("dashClearJobs")}
            onPress={() => setSelected([])}
          />
        )}
        <View style={s.smallDivider} />
        <Text style={s.scope}>
          {tText(
            !selected.length && periodPreset === "30"
              ? "dashScope"
              : "dashCustomScope",
          )}
        </Text>
        <View style={{ flex: 1 }} />
        <DashboardButton
          label={tText("dashHowCounted")}
          icon="information-circle-outline"
          iconOnly
          onPress={() => setInfo(true)}
        />
        <DashboardButton
          label={tText("dashRefresh")}
          icon="refresh-outline"
          iconOnly
          onPress={r.refresh}
        />
      </View>
      {loaded ? (
        <TrendChart
          key={
            range.from +
            range.to +
            range.bucket +
            selected.map((s) => s.id).join()
          }
          height={chartHeight}
          data={d}
          onSelect={(id, from, to) => setSelection({ id, from, to })}
        />
      ) : (
        <View
          style={{
            height: chartHeight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={s.hint}>{r.error || tText("loading")}</Text>
        </View>
      )}
      {loaded && (!d.series.length || !d.points.length) && (
        <View style={s.emptyNotice}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#4265A3"
          />
          <Text style={s.noticeText}>
            {tText(!d.series.length ? "dashEmptyNotice" : "dashNoApplications")}
          </Text>
        </View>
      )}
    </Panel>
  );
  const metrics = (
    <View style={s.metrics}>
      <DashboardMetric
        icon="people-outline"
        label={tText("dashApplicationsTotal")}
        value={tText("dashMetricCount", {
          count: d.points.reduce((n, p) => n + Number(p.count), 0),
        })}
      />
      <DashboardMetric
        icon="checkmark-done-outline"
        label={tText("dashAccepted")}
        value={tText("dashMetricCount", {
          count: d.staff.reduce((n, p) => n + Number(p.accepted), 0),
        })}
      />
      <DashboardMetric
        icon="close-circle-outline"
        label={tText("dashRejected")}
        value={tText("dashMetricCount", {
          count: d.staff.reduce((n, p) => n + Number(p.rejected), 0),
        })}
      />
    </View>
  );
  const staff = (
    <Panel style={s.staffCard}>
      <SectionTitle>{tText("dashStaff")}</SectionTitle>
      {!d.staff.length ? (
        <Text style={s.scope}>{tText("dashNoDecisions")}</Text>
      ) : (
        <>
          <View style={s.presets}>
            <Text style={{ color: "#0D9488" }}>● {tText("dashAccepted")}</Text>
            <Text style={{ color: "#E85D75" }}>● {tText("dashRejected")}</Text>
          </View>
          <ScrollView
            style={{ maxHeight: wide ? 96 : 220 }}
            nestedScrollEnabled
          >
            {d.staff.map((staff) => (
              <View key={staff.id} style={s.staff}>
                <Text localize={false} style={s.bold}>
                  {staff.name ||
                    (staff.id === "unknown"
                      ? tText("dashUnknownStaff")
                      : tText("dashStaffRecord"))}
                </Text>
                {(
                  [
                    ["dashAccepted", staff.accepted, "#0D9488"],
                    ["dashRejected", staff.rejected, "#E85D75"],
                  ] as const
                ).map(([label, value, color]) => (
                  <View key={label} style={s.barRow}>
                    <Text style={s.barLabel}>{tText(label)}</Text>
                    <View style={s.track}>
                      <View
                        style={{
                          width: `${(Number(value) / staffMax) * 100}%`,
                          height: 12,
                          borderRadius: 5,
                          backgroundColor: color,
                        }}
                      />
                    </View>
                    <Text style={s.number}>{value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </Panel>
  );
  return (
    <AppPage
      title={tText("dashboard")}
      subtitle=""
      role="company"
      activeMenu={sourceText("dashboard")}
    >
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      {user && !company && (
        <Panel>
          <BodyText>{tText("dashPermission")}</BodyText>
        </Panel>
      )}
      {loaded && !d.canViewApplicants && (
        <Panel>
          <BodyText>{tText("dashPermission")}</BodyText>
        </Panel>
      )}
      <View testID="dashboard-board" style={[s.board, wide && s.boardWide]}>
        <View style={[s.mainColumn, wide && { flex: 2.25 }]}>
          {!wide && billing}
          {loaded && d.canViewApplicants && metrics}
          {trend}
          {loaded && d.canViewApplicants && staff}
        </View>
        <View style={[s.sideColumn, wide && { flex: 1 }]}>
          {wide && billing}
          {loaded && d.canViewApplicants && (
            <>
              <Panel style={s.summaryCard}>
                <OutcomeSummary data={d} compact={wide} />
              </Panel>
              <Panel style={s.summaryCard}>
                <RecruitmentTotals data={d} compact={wide} />
              </Panel>
            </>
          )}
        </View>
      </View>
      <Modal
        visible={filters || picker || info}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setFilters(false);
          setPicker(false);
          setInfo(false);
        }}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.cardHeader}>
              <SectionTitle>
                {tText(
                  info
                    ? "dashHowCounted"
                    : picker
                      ? "dashCompare"
                      : "dashFilters",
                )}
              </SectionTitle>
              <DashboardButton
                label={tText("close")}
                icon="close-outline"
                onPress={() => {
                  setFilters(false);
                  setPicker(false);
                  setInfo(false);
                }}
              />
            </View>
            <ScrollView
              style={{ maxHeight: Math.max(200, height - 200) }}
              keyboardShouldPersistTaps="handled"
            >
              {filters && filterControls}
              {picker && (
                <RecruitmentPicker selected={selected} onChange={setSelected} />
              )}
              {info && (
                <View style={{ gap: 12 }}>
                  <Text style={s.hint}>{tText("dashDefaultSeries")}</Text>
                  <Text style={s.hint}>{tText("dashTrendNote")}</Text>
                  <Text style={s.hint}>{tText("dashPointHint")}</Text>
                  <Text style={s.hint}>{tText("dashStaffNote")}</Text>
                  <Text style={s.hint}>{tText("dashReviewFeeNote")}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <PeriodDetailModal
        selection={selection}
        onClose={() => setSelection(null)}
      />
    </AppPage>
  );
}
const s = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(19,40,64,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 740,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "white",
    gap: 18,
  },
  board: { gap: 12 },
  boardWide: { flexDirection: "row", alignItems: "flex-start" },
  mainColumn: { gap: 12, minWidth: 0 },
  sideColumn: { gap: 12, minWidth: 0 },
  summaryCard: {
    padding: 14,
    gap: 8,
    borderRadius: 22,
    borderWidth: 0,
    backgroundColor: "#FFFFFF",
    shadowColor: "#30517A",
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  billingCard: {
    padding: 14,
    gap: 8,
    borderRadius: 22,
    borderWidth: 0,
    backgroundColor: "#FFFFFF",
  },
  billingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  billingTitle: { fontSize: 14, fontWeight: "800", color: "#162941" },
  divider: { display: "none" },
  planBadge: {
    backgroundColor: "#E5F0FF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  planText: { fontSize: 13, fontWeight: "700", color: "#164B97" },
  amount: { width: "100%", fontSize: 28, fontWeight: "800", color: "#132840" },
  billNote: {
    fontSize: 13,
    color: "#697A92",
    minWidth: 0,
    lineHeight: 21,
  },
  billingLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    paddingTop: 0,
  },
  trendCard: {
    padding: 14,
    gap: 8,
    borderWidth: 0,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
  },
  cardHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-end",
  },
  dateField: { width: 175, maxWidth: "100%" },
  bucketField: { width: 125, maxWidth: "100%" },
  scopeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  scope: { fontSize: 13, color: "#63748E", lineHeight: 21 },
  smallDivider: { height: 20, width: 1, backgroundColor: "#D8E1ED" },
  info: { gap: 6, padding: 12, backgroundColor: "#F7FAFF", borderRadius: 8 },
  hint: { fontSize: 12, color: "#64748B", lineHeight: 20 },
  emptyNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EBF2FC",
  },
  noticeText: { fontSize: 12, color: "#334A69", lineHeight: 20, flex: 1 },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  staffCard: {
    padding: 14,
    gap: 8,
    borderWidth: 0,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
  },
  bold: { fontSize: 15, fontWeight: "700", color: "#173650" },
  staff: {
    gap: 4,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  barRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  barLabel: { width: 120, fontSize: 12, color: "#64748B" },
  track: { height: 12, flex: 1, backgroundColor: "#F1F5F9", borderRadius: 5 },
  number: {
    width: 32,
    textAlign: "right",
    fontWeight: "700",
    color: "#334155",
  },
});
