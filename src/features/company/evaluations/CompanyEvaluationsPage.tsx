import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { query, type Page } from "@/api/platform";
import { Pager } from "@/api/ApiUI";
import AppPage from "@/components/layout/AppPage";
import { AppInput, AppSelect } from "@/components/form";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
  StatusBadge,
} from "@/components/ui/AppUI";
import { CompanyPermissionBoundary } from "@/features/company/CompanyPermissionBoundary";
import { Text, Pressable } from "@/i18n/native";
import { sourceText } from "@/i18n/source";
import { localeTag, tText, useLocaleVersion } from "@/i18n/display";
import { CRITERIA, type CompanyReview } from "./model";
import { CompanyReviewForm } from "./CompanyReviewForm";

function Content() {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const params = useLocalSearchParams<{
    interactionId?: string;
    state?: string;
  }>();
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState<string | null>(
    params.interactionId || null,
  );
  const [search, setSearch] = useState(""),
    [q, setQ] = useState("");
  const [state, setState] = useState(
      ["pending", "overdue", "evaluated"].includes(params.state || "")
        ? params.state!
        : "",
    ),
    [kind, setKind] = useState(""),
    [status, setStatus] = useState("");
  const [criterion, setCriterion] = useState(""),
    [score, setScore] = useState("");
  const [sort, setSort] = useState("deadline"),
    [direction, setDirection] = useState("asc"),
    [page, setPage] = useState(1);
  useEffect(() => {
    setState(
      ["pending", "overdue", "evaluated"].includes(params.state || "")
        ? params.state!
        : "",
    );
    setPage(1);
  }, [params.state]);
  const [dirty, setDirty] = useState(false),
    [confirm, setConfirm] = useState(false),
    [saving, setSaving] = useState(false);
  const pending = useRef<null | (() => void)>(null);
  const list = useResource<Page<CompanyReview>>(
    token
      ? "/company-evaluations?" +
          query({
            q,
            state,
            kind,
            status,
            criterion,
            score: score || undefined,
            sort,
            direction,
            page,
            pageSize: 20,
          })
      : null,
    { items: [], total: 0, page, pageSize: 20 },
    true,
  );
  const detail = useResource<CompanyReview | null>(
    token && selected ? `/company-evaluations/${selected}` : null,
    null,
    true,
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    if (
      list.loaded &&
      !list.error &&
      page > Math.max(1, Math.ceil(list.data.total / 20))
    )
      setPage(Math.max(1, Math.ceil(list.data.total / 20)));
  }, [list.loaded, list.data.total, list.error, page]);
  useEffect(() => {
    if (Platform.OS !== "web" || !dirty || typeof window === "undefined")
      return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (dirty || saving) return;
    const timer = setInterval(() => {
      list.refresh();
      detail.refresh();
    }, 60000);
    return () => clearInterval(timer);
  }, [dirty, saving, list.refresh, detail.refresh]);
  useEffect(() => {
    if (params.interactionId && params.interactionId !== selected)
      guard(() => {
        setDirty(false);
        setSelected(params.interactionId!);
      });
  }, [params.interactionId]);
  function guard(action: () => void) {
    if (saving) return;
    if (dirty) {
      pending.current = action;
      setConfirm(true);
    } else action();
  }
  const navigate = (path: Href) => guard(() => router.push(path));
  const choices = (values: string[]) => [
    { value: "", label: tText("all") },
    ...values.map((value) => ({ value, label: value })),
  ];
  const filter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };
  return (
    <AppPage
      title={tText("reviews")}
      subtitle=""
      role="company"
      activeMenu={sourceText("reviews")}
      onNavigate={navigate}
    >
      <Panel>
        <View style={s.filters}>
          <AppInput
            label={tText("search")}
            accessibilityLabel={tText("companyReviewSearch")}
            placeholder={tText("companyReviewSearch")}
            value={search}
            maxLength={200}
            onChangeText={setSearch}
            containerStyle={{
              flexBasis: 280,
              flexGrow: 2,
              maxWidth: width >= 600 ? 360 : undefined,
            }}
          />
          <AppSelect
            label={tText("companyReviewState")}
            value={state}
            onValueChange={filter(setState)}
            options={[
              { value: "", label: tText("all") },
              { value: "pending", label: tText("companyReviewPending") },
              { value: "evaluated", label: tText("companyReviewEvaluated") },
              { value: "overdue", label: tText("companyReviewOverdue") },
            ]}
            containerStyle={[s.filter, width >= 600 && { maxWidth: 250 }]}
          />
          <AppSelect
            label={tText("companyReviewApplicationType")}
            value={kind}
            onValueChange={filter(setKind)}
            options={[
              { value: "", label: tText("all") },
              { value: "application", label: tText("application") },
              { value: "scout", label: tText("scout") },
              { value: "offer", label: tText("offer") },
            ]}
            containerStyle={[s.filter, width >= 600 && { maxWidth: 250 }]}
          />
          <AppSelect
            label={tText("status")}
            value={status}
            onValueChange={filter(setStatus)}
            options={choices([
              sourceText("unanswered"),
              sourceText("inSelection"),
              sourceText("meeting"),
              sourceText("consideringOffer"),
              sourceText("jobOffer"),
              sourceText("offerDeclined"),
              sourceText("offerWithdrawn"),
              sourceText("notSelected"),
              sourceText("notProceeding"),
            ])}
            containerStyle={[s.filter, width >= 600 && { maxWidth: 250 }]}
          />
          <AppSelect
            label={tText("companyReviewCriterion")}
            value={criterion}
            onValueChange={(value) => {
              setCriterion(value);
              setScore("");
              setPage(1);
            }}
            options={[
              { value: "", label: tText("all") },
              ...CRITERIA.map((c) => ({
                value: c.id,
                label: `${tText(c.category)} / ${tText(c.label)}`,
              })),
            ]}
            containerStyle={{
              flexBasis: 250,
              flexGrow: 1,
              maxWidth: width >= 600 ? 320 : undefined,
            }}
          />
          <AppSelect
            label={tText("companyReviewItemScore")}
            value={score}
            disabled={!criterion}
            onValueChange={filter(setScore)}
            options={[
              { value: "", label: tText("all") },
              ...[1, 2, 3, 4, 5].map((value) => ({
                value: String(value),
                label: tText("companyReviewScoreValue", { score: value }),
              })),
            ]}
            containerStyle={[s.filter, width >= 600 && { maxWidth: 250 }]}
          />
          <AppSelect
            label={tText("companyReviewSort")}
            value={sort}
            onValueChange={filter(setSort)}
            options={[
              { value: "deadline", label: tText("companyReviewDeadline") },
              {
                value: "statusChangedAt",
                label: tText("companyReviewStatusChanged"),
              },
              { value: "rating", label: tText("companyReviewRating") },
              { value: "userName", label: tText("companyReviewUserName") },
              {
                value: "applicationName",
                label: tText("companyReviewApplicationName"),
              },
              { value: "reviewedAt", label: tText("companyReviewUpdated") },
            ]}
            containerStyle={[s.filter, width >= 600 && { maxWidth: 250 }]}
          />
          <AppSelect
            label={tText("companyReviewSortOrder")}
            value={direction}
            onValueChange={filter(setDirection)}
            options={[
              { value: "asc", label: tText("ascending") },
              { value: "desc", label: tText("descending") },
            ]}
            containerStyle={[s.filter, width >= 600 && { maxWidth: 250 }]}
          />
        </View>
      </Panel>
      <View style={[s.columns, width < 1100 && s.vertical]}>
        {(width >= 1100 || !selected) && (
          <View style={[s.list, width < 1100 && { flexBasis: "auto" }]}>
            <Panel>
              <SectionTitle>{tText("companyReviewList")}</SectionTitle>
              <ResourceStatus
                loading={list.loading}
                error={list.error}
                onRetry={list.refresh}
              />
              <Pager page={page} total={list.data.total} onChange={setPage} />
              {list.data.items.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={tText("companyReviewCard", {
                    application: item.applicationName,
                    name: item.userName,
                  })}
                  accessibilityState={{ selected: selected === item.id }}
                  onPress={() => {
                    if (selected !== item.id)
                      guard(() => {
                        setDirty(false);
                        setSelected(item.id);
                      });
                  }}
                  style={[s.card, selected === item.id && s.selected]}
                >
                  <Text localize={false} style={s.cardTitle} numberOfLines={2}>
                    {item.applicationName}
                  </Text>
                  <Text localize={false} style={s.user}>
                    {item.userName}
                  </Text>
                  <View style={s.tags}>
                    <StatusBadge label={item.selectionStatus} />
                    <StatusBadge
                      label={
                        item.evaluationId
                          ? tText("companyReviewEvaluated")
                          : tText("companyReviewPending")
                      }
                      tone={item.evaluationId ? "green" : "yellow"}
                    />
                    {item.overdue && (
                      <StatusBadge
                        label={tText("companyReviewOverdue")}
                        tone="red"
                      />
                    )}
                  </View>
                  <Text style={s.meta}>
                    {tText("companyReviewDeadline")}:{" "}
                    {new Date(item.reviewDeadline).toLocaleDateString(
                      localeTag(),
                    )}
                  </Text>
                  {item.rating !== null && (
                    <Text style={s.rating}>
                      ★ {Number(item.rating).toFixed(1)} / 5.0
                    </Text>
                  )}
                </Pressable>
              ))}
              {!list.loading && !list.error && !list.data.items.length && (
                <BodyText>{tText("companyReviewEmpty")}</BodyText>
              )}
              <Pager page={page} total={list.data.total} onChange={setPage} />
            </Panel>
          </View>
        )}
        <View style={s.detail}>
          {width < 1100 && selected && (
            <View style={{ alignSelf: "flex-start" }}>
              <AppButton
                label={tText("companyReviewBackToList")}
                outline
                onPress={() =>
                  guard(() => {
                    setDirty(false);
                    setSelected(null);
                  })
                }
              />
            </View>
          )}
          <ResourceStatus
            loading={detail.loading}
            error={detail.error}
            onRetry={detail.refresh}
          />
          {detail.data && detail.data.id === selected ? (
            <CompanyReviewForm
              key={detail.data.id}
              item={detail.data}
              onDirtyChange={setDirty}
              onBusyChange={setSaving}
              onSaved={() => {
                list.refresh();
                detail.refresh();
              }}
            />
          ) : (
            !detail.loading &&
            !detail.error && (
              <Panel>
                <BodyText>{tText("companyReviewSelect")}</BodyText>
              </Panel>
            )
          )}
        </View>
      </View>
      <Modal
        visible={confirm}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirm(false)}
      >
        <View style={s.backdrop}>
          <Panel style={{ width: "100%", maxWidth: 480 }}>
            <SectionTitle>{tText("companyReviewDiscardTitle")}</SectionTitle>
            <BodyText>{tText("companyReviewDiscardMessage")}</BodyText>
            <View style={s.tags}>
              <AppButton
                label={tText("companyReviewStay")}
                outline
                onPress={() => {
                  pending.current = null;
                  setConfirm(false);
                }}
              />
              <AppButton
                label={tText("companyReviewDiscard")}
                danger
                onPress={() => {
                  const action = pending.current;
                  pending.current = null;
                  setDirty(false);
                  setConfirm(false);
                  action?.();
                }}
              />
            </View>
          </Panel>
        </View>
      </Modal>
    </AppPage>
  );
}
export default function CompanyEvaluationsPage() {
  "use no memo";
  useLocaleVersion();
  return (
    <CompanyPermissionBoundary
      permission="applicants"
      title={sourceText("reviews")}
    >
      <Content />
    </CompanyPermissionBoundary>
  );
}
const s = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  filter: { flexBasis: 155, flexGrow: 1 },
  columns: { flexDirection: "row", gap: 16, alignItems: "flex-start" },
  vertical: { flexDirection: "column", alignItems: "stretch" },
  list: { flex: 3, minWidth: 250 },
  detail: { flex: 7, minWidth: 0, gap: 12 },
  card: {
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DCE6EF",
    borderRadius: 12,
    backgroundColor: "#FFF",
  },
  selected: { borderColor: "#2484CA", backgroundColor: "#EFF7FE" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#17334F" },
  user: { fontSize: 14, color: "#355570" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  meta: { fontSize: 12, color: "#587086" },
  rating: { fontSize: 14, fontWeight: "700", color: "#946600" },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
