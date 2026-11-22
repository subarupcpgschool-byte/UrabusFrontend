import { translateText } from "@/i18n/display";
import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import {
  EvaluationButton,
  EvaluationModal,
  EvaluationDetail,
} from "@/features/evaluations/EvaluationUI";
import { useEvaluations } from "@/features/evaluations/EvaluationProvider";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest, query, type Page } from "@/api/platform";
import type { InteractionRow } from "@/api/models";
import { ConfirmAction } from "@/api/ApiUI";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppPage from "@/components/layout/AppPage";
import { AppSelect } from "@/components/form";
import { AppButton, Panel, StatusBadge } from "@/components/ui/AppUI";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import MessageWorkspace from "@/features/workspace/MessageWorkspace";
import {
  FILTERS,
  APPLICATION_TYPES,
  applicationPay,
  formatUpdatedAt,
  INTERACTION_KINDS,
  kindLabel,
  eventDateLabel,
  progressSteps,
  outcomeLabel,
  isNegativeStep,
  type InteractionKind,
  type ApplicationFilter,
  type SortKey,
  type SortDirection,
} from "@/features/applications/data";

export default function ApplicationsWorkspace({
  mode = "selection",
  embedded = false,
}: { mode?: "selection" | "ratings"; embedded?: boolean } = {}) {
  "use no memo";
  useLocaleVersion();
  const [ratingOpen, setRatingOpen] = useState(false);
  const evaluations = useEvaluations();
  const { token } = useAuth();
  const mockMode = false;
  const [filter, setFilter] = useState<ApplicationFilter>(sourceText("all")),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<string | null>(null),
    [expanded, setExpanded] = useState(true),
    [width, setWidth] = useState(0),
    [mobileDetail, setMobileDetail] = useState(false);
  const [kind, setKind] = useState<InteractionKind | "">("");
  const [employmentType, setEmploymentType] = useState(""),
    [sortKey, setSortKey] = useState<SortKey>("updatedAt"),
    [direction, setDirection] = useState<SortDirection>("desc");
  function resetSelection() {
    setPage(1);
    setSelected(null);
    setMobileDetail(false);
    setRatingOpen(false);
  }
  const resource = useResource<Page<InteractionRow>>(
    token
      ? "/interactions?" +
          query({
            kind,
            status: filter === sourceText("all") ? "" : filter,
            employment: employmentType,
            sort: sortKey,
            direction,
            page,
            pageSize: 20,
          })
      : null,
    { items: [], total: 0, page, pageSize: 20 },
    true,
  );
  const all = resource.data.items;
  const total = resource.data.total;
  const result = {
    items: all,
    filtered: { length: total },
    pages: Math.max(1, Math.ceil(total / 20)),
    current: page,
    start: total ? (page - 1) * 20 + 1 : 0,
    end: Math.min(page * 20, total),
  };
  const application = all.find((a) => a.id === selected);
  const compact = width > 0 && width < 950;
  function changeFilter(next: ApplicationFilter) {
    setFilter(next);
    setPage(1);
    setSelected(null);
    setMobileDetail(false);
    setRatingOpen(false);
  }
  function changePage(next: number) {
    setPage(next);
    setSelected(null);
    setMobileDetail(false);
    setRatingOpen(false);
  }
  function pagination(position: string) {
    return (
      <View
        accessibilityLabel={translateText(
          sourceFormat("pagination", { v0: position }, []),
        )}
        style={s.pagination}
      >
        <Text style={s.meta}>
          {result.start}–{result.end} / {result.filtered.length}
          {tText("total_199")}
        </Text>
        <View style={s.pageButtons}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={translateText(
              sourceFormat("previousPage_863", { v0: position }, []),
            )}
            disabled={result.current === 1}
            onPress={() => changePage(result.current - 1)}
            style={[s.pageButton, result.current === 1 && s.disabled]}
          >
            <Text>‹</Text>
          </Pressable>
          {Array.from(
            { length: Math.min(5, result.pages) },
            (_, i) =>
              Math.min(Math.max(1, page - 2), Math.max(1, result.pages - 4)) +
              i,
          ).map((n) => (
            <Pressable
              key={n}
              accessibilityRole="button"
              accessibilityLabel={translateText(
                sourceFormat("page_864", { v0: position, v1: n }, []),
              )}
              accessibilityState={{ selected: n === result.current }}
              onPress={() => changePage(n)}
              style={[s.pageButton, n === result.current && s.active]}
            >
              <Text
                style={n === result.current ? { color: "#FFF" } : undefined}
              >
                {n}
              </Text>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={translateText(
              sourceFormat("nextPage_865", { v0: position }, []),
            )}
            disabled={result.current === result.pages}
            onPress={() => changePage(result.current + 1)}
            style={[
              s.pageButton,
              result.current === result.pages && s.disabled,
            ]}
          >
            <Text>›</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  const content = (
    <>
      <View
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        style={[
          s.workspace,
          { opacity: width > 0 ? 1 : 0 },
          compact && { flexDirection: "column" },
        ]}
      >
        {(!compact || !mobileDetail) && (
          <View style={[s.list, compact && { flex: undefined, width: "100%" }]}>
            <Text style={s.heading}>
              {mode === "ratings"
                ? sourceText("reviewList")
                : sourceText("applicationsAndOffers")}
            </Text>
            <AppSelect
              label={tText("interactionType")}
              value={kind}
              onValueChange={(value) => {
                setKind(value as InteractionKind | "");
                resetSelection();
              }}
              options={[
                { label: sourceText("allInteractions"), value: "" },
                ...INTERACTION_KINDS,
              ]}
            />
            <View
              accessibilityRole="tablist"
              accessibilityLabel={tText("applicationAndOfferStatusFilters")}
              style={s.filters}
            >
              {FILTERS.map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="tab"
                  accessibilityLabel={translateText(value)}
                  accessibilityState={{ selected: filter === value }}
                  onPress={() => changeFilter(value)}
                  style={[s.filter, filter === value && s.active]}
                >
                  <Text
                    style={[
                      s.filterText,
                      filter === value && { color: "#FFF" },
                    ]}
                  >
                    {value}{" "}
                  </Text>
                </Pressable>
              ))}
            </View>
            <AppSelect
              label={tText("employmentType")}
              value={employmentType}
              onValueChange={(value) => {
                setEmploymentType(value);
                resetSelection();
              }}
              options={[
                { label: sourceText("allEmploymentTypes"), value: "" },
                ...APPLICATION_TYPES.map((value) => ({ label: value, value })),
              ]}
            />
            <View style={s.sortRow}>
              <AppSelect
                label={tText("sortBy")}
                value={sortKey}
                onValueChange={(value) => {
                  setSortKey(value as SortKey);
                  resetSelection();
                }}
                containerStyle={{ flex: 1 }}
                options={[
                  { label: sourceText("lastUpdated"), value: "updatedAt" },
                  { label: sourceText("status"), value: "status" },
                ]}
              />
              <AppSelect
                label={tText("sortDirection")}
                value={direction}
                onValueChange={(value) => {
                  setDirection(value as SortDirection);
                  resetSelection();
                }}
                containerStyle={{ flex: 1 }}
                options={[
                  { label: sourceText("ascending"), value: "asc" },
                  { label: sourceText("descending"), value: "desc" },
                ]}
              />
            </View>
            {sortKey === "status" && (
              <Text style={s.meta}>
                {tText("statusOrderUnansweredInSelectionMeetingConsidering")}
              </Text>
            )}
            <ResourceStatus
              loading={resource.loading}
              error={resource.error}
              onRetry={resource.refresh}
              privateData
            />
            {pagination(sourceText("top"))}
            <ScrollView
              style={s.cards}
              contentContainerStyle={{ gap: 10, paddingBottom: 6 }}
            >
              {result.items.map((a) => (
                <Pressable
                  key={a.id}
                  accessibilityRole="button"
                  accessibilityLabel={translateText(
                    sourceFormat(
                      "select",
                      { v0: a.company, v1: kindLabel(a.kind), v2: a.id },
                      [],
                    ),
                  )}
                  accessibilityState={{ selected: selected === a.id }}
                  onPress={() => {
                    setSelected(a.id);
                    setRatingOpen(false);
                    setExpanded(true);
                    setMobileDetail(true);
                  }}
                  style={({ pressed }) => [
                    s.card,
                    selected === a.id && s.selected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={s.row}>
                    <Text localize={false} style={s.company}>
                      {a.company}
                    </Text>
                    <StatusBadge
                      label={outcomeLabel(a)}
                      tone={
                        a.afterResult ||
                        a.companyResult === sourceText("notSelected") ||
                        a.companyResult === sourceText("notProceeding")
                          ? "red"
                          : a.companyResult === sourceText("jobOffer")
                            ? "green"
                            : a.status === sourceText("meeting")
                              ? "blue"
                              : "yellow"
                      }
                    />
                  </View>
                  {mode === "ratings" && (
                    <Text style={s.meta}>
                      {evaluations.records.some((r) => r.applicationId === a.id)
                        ? sourceText("reviewed")
                        : sourceText("notReviewed")}
                    </Text>
                  )}
                  <Text style={s.kind}>
                    {kindLabel(a.kind)} ／{" "}
                    {a.kind === "application"
                      ? sourceText("appliedByYou")
                      : sourceText("receivedFromCompany")}
                  </Text>
                  <Text numberOfLines={2} style={s.cardTitle}>
                    {a.title}
                  </Text>
                  <Text style={s.meta}>
                    {a.location} ／ {a.workStyle}
                  </Text>
                  <Text style={s.meta}>
                    {a.employmentType} ／ {applicationPay(a)}
                  </Text>
                  <Text style={s.meta}>
                    {tText("updated_877")}
                    {formatUpdatedAt(a.updatedAt)}
                  </Text>
                  <View style={s.row}>
                    <Text style={[s.meta, { flex: 1 }]}>
                      {eventDateLabel(a.kind)}：{formatUpdatedAt(a.appliedAt)}
                    </Text>
                  </View>
                </Pressable>
              ))}
              {!result.items.length && (
                <Text style={s.empty}>
                  {tText("noInteractionsMatchYourFilters")}
                </Text>
              )}
            </ScrollView>
            {pagination(sourceText("bottom"))}
          </View>
        )}
        {(!compact || mobileDetail) && (
          <View
            style={[s.detail, compact && { flex: undefined, width: "100%" }]}
          >
            {compact && (
              <AppButton
                label={tText("backToList")}
                outline
                onPress={() => setMobileDetail(false)}
              />
            )}
            {mode === "ratings" ? (
              <EvaluationDetail
                key={application?.id ?? "none"}
                application={application}
              />
            ) : (
              <>
                <Panel>
                  {application ? (
                    <>
                      <View style={s.conditionHeader}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={tText(
                            "expandOrCollapsePostingAndProposedTerms",
                          )}
                          accessibilityState={{ expanded }}
                          onPress={() => setExpanded((v) => !v)}
                          style={[s.row, { flex: 1 }]}
                        >
                          <Ionicons
                            name="document-text-outline"
                            size={22}
                            color="#2563EB"
                          />
                          <Text style={s.heading}>
                            {tText("postingAndProposedTerms")}
                          </Text>
                          <Ionicons
                            name={expanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#2563EB"
                          />
                        </Pressable>
                        <EvaluationButton
                          application={application}
                          onPress={() => setRatingOpen(true)}
                        />
                      </View>
                      <View style={s.row}>
                        <Text localize={false} style={s.company}>
                          {application.company}
                        </Text>
                        <StatusBadge label={outcomeLabel(application)} />
                      </View>
                      <Text localize={false} style={s.cardTitle}>
                        {application.title}
                      </Text>
                      {expanded && (
                        <View style={s.facts}>
                          {[
                            [
                              sourceText("interactionType"),
                              kindLabel(application.kind),
                            ],
                            [
                              sourceText("employmentType"),
                              application.employmentType,
                            ],
                            [sourceText("pay"), applicationPay(application)],
                            [sourceText("workLocation"), application.location],
                            [
                              sourceText("workArrangements"),
                              application.workStyle,
                            ],
                            [
                              eventDateLabel(application.kind),
                              formatUpdatedAt(application.appliedAt),
                            ],
                            [
                              sourceText("lastUpdated"),
                              formatUpdatedAt(application.updatedAt),
                            ],
                          ].map(([label, value]) => (
                            <View key={label} style={s.fact}>
                              <Text style={s.meta}>{label}</Text>
                              <Text style={s.value}>{value}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      <View style={s.timeline}>
                        {progressSteps(application).steps.map((step, i) => (
                          <View key={step} style={s.step}>
                            <View
                              accessibilityLabel={translateText(
                                `${translateText(step)}：${translateText(i <= progressSteps(application).current ? sourceText("reached") : sourceText("notReached"))}`,
                              )}
                              style={[
                                s.dot,
                                i <= progressSteps(application).current &&
                                  s.active,
                                isNegativeStep(step) && s.negativeDot,
                              ]}
                            />
                            <Text style={[s.meta, { textAlign: "center" }]}>
                              {step}
                            </Text>
                          </View>
                        ))}
                      </View>
                      {application.companyResult && (
                        <View style={s.outcome}>
                          <Text style={s.value}>
                            {tText("companyDecision_885")}
                            {application.companyResult}
                          </Text>
                          {application.afterResult && (
                            <Text style={s.value}>
                              {application.afterResult ===
                              sourceText("offerDeclined")
                                ? sourceText("userResponse")
                                : sourceText("companyResponse")}
                              ：{application.afterResult}
                            </Text>
                          )}
                        </View>
                      )}
                      {application.companyResult === sourceText("jobOffer") &&
                        !application.afterResult && (
                          <ConfirmAction
                            label={tText("declineTheJobOffer")}
                            danger
                            message={tText("declineThisJobOfferThisCannotBe")}
                            onConfirm={() =>
                              dataRequest(
                                `/interactions/${application.id}`,
                                token,
                                {
                                  stage: application.stage,
                                  companyResult: sourceText("jobOffer"),
                                  afterResult: sourceText("offerDeclined"),
                                  version: application.version,
                                },
                                "PUT",
                              )
                            }
                          />
                        )}
                    </>
                  ) : (
                    <View style={s.empty}>
                      <Ionicons
                        name="document-text-outline"
                        size={34}
                        color="#94A3B8"
                      />
                      <Text style={s.heading}>
                        {tText("postingAndProposedTermsAppearHere")}
                      </Text>
                      <Text style={s.meta}>
                        {tText("selectAnInteractionFromTheListOn")}
                      </Text>
                    </View>
                  )}
                </Panel>
                {application ? (
                  <MessageWorkspace
                    key={application.id}
                    conversationOnly
                    initialRoom={{
                      kind: "job",
                      id: application.id,
                      roomId: application.roomId,
                      company: application.company,
                      title: application.title,
                    }}
                  />
                ) : (
                  <Panel>
                    <View style={[s.empty, { minHeight: 360 }]}>
                      <Ionicons
                        name="chatbubbles-outline"
                        size={42}
                        color="#94A3B8"
                      />
                      <Text style={s.heading}>
                        {tText("messagesAppearHere")}
                      </Text>
                      <Text style={s.meta}>
                        {tText("selectACardOnTheLeft")}
                      </Text>
                    </View>
                  </Panel>
                )}
                {application && (
                  <EvaluationModal
                    key={`evaluation-${application.id}`}
                    application={application}
                    visible={ratingOpen}
                    onClose={() => setRatingOpen(false)}
                  />
                )}
              </>
            )}
          </View>
        )}
      </View>
    </>
  );
  return embedded ? (
    content
  ) : (
    <AppPage
      title={translateText(
        mode === "ratings"
          ? sourceText("reviews")
          : sourceText("applicationsAndOffers_641"),
      )}
      subtitle=""
      role="user"
      activeMenu={
        mode === "ratings"
          ? sourceText("reviews")
          : sourceText("applicationsAndOffers_641")
      }
    >
      {content}
    </AppPage>
  );
}
const s = StyleSheet.create({
  conditionHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  negativeDot: { backgroundColor: "#E45C5C", borderColor: "#E45C5C" },
  outcome: { padding: 12, gap: 6, borderRadius: 8, backgroundColor: "#F1F5F9" },
  kind: { fontSize: 11, color: "#2563EB", fontWeight: "700" },
  sortRow: { flexDirection: "row", gap: 8 },
  openButton: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 7,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  openLabel: { fontSize: 11, color: "#2563EB", fontWeight: "700" },
  workspace: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  list: {
    flex: 3,
    minWidth: 0,
    borderWidth: 1,
    borderColor: "#DDE6F1",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    backgroundColor: "#FFF",
  },
  detail: { flex: 7, minWidth: 0, gap: 14 },
  heading: { fontSize: 18, fontWeight: "800", color: "#10284B", flexShrink: 1 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  filter: {
    paddingHorizontal: 9,
    minHeight: 36,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDE6F1",
    borderRadius: 8,
  },
  filterText: { fontSize: 11, fontWeight: "700", color: "#61708A" },
  active: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6,
  },
  pageButtons: { flexDirection: "row", gap: 4 },
  pageButton: {
    minWidth: 28,
    height: 30,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#DDE6F1",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.35 },
  meta: { fontSize: 11, color: "#64748B", lineHeight: 18 },
  cards: { height: 570 },
  card: {
    borderWidth: 1,
    borderColor: "#DDE6F1",
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  selected: { borderColor: "#2563EB", backgroundColor: "#F2F7FF" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  company: { fontSize: 14, fontWeight: "800", color: "#10284B", flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#162033" },
  empty: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 12,
    backgroundColor: "#F7FAFF",
    borderRadius: 10,
  },
  fact: { width: "46%", minWidth: 120, gap: 3 },
  value: { fontSize: 13, color: "#162033" },
  timeline: { flexDirection: "row", paddingTop: 12 },
  step: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    borderTopWidth: 2,
    borderColor: "#DDE6F1",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#DDE6F1",
    marginTop: -8,
  },
  banner: {
    fontSize: 12,
    color: "#1748B8",
    backgroundColor: "#EAF2FF",
    padding: 12,
    borderRadius: 10,
  },
});
