import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/auth/AuthProvider";
import { query } from "@/api/platform";
import { ResourceStatus, useResource } from "@/api/useResource";
import { Pager } from "@/api/ApiUI";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
  StatusBadge,
} from "@/components/ui/AppUI";
import { Text, Pressable } from "@/i18n/native";
import { localeTag, tText, useLocaleVersion } from "@/i18n/display";
import { ResumeDetails } from "@/features/account/ResumeDetails";
import type { ResumeRow } from "@/api/models";
import { RecruitmentArticle, articleHtml } from "../RecruitmentArticle";
import type { MessageKey } from "@/i18n/source";
import type { Article, PeriodDetail } from "./model";

export function ArticleSnapshot({
  document,
}: {
  document: Article | null | undefined;
}) {
  useLocaleVersion();
  if (!document) return <BodyText>{tText("dashMissingHistory")}</BodyText>;
  const lines: [MessageKey, unknown][] = [
    ["dashTitle", document.title],
    ["dashLocation", document.location],
    ["dashSalary", document.compensation || document.salary],
    ["dashEmployment", document.employment || document.employmentType],
    ["dashRequirements", document.requirements],
    [
      "dashGroup",
      document.kind === undefined
        ? undefined
        : tText(
            document.kind === "COMPANY_RECRUITMENT"
              ? "dashRecruitCompany"
              : "dashRecruitJob",
          ),
    ],
    ["dashWorkStyle", document.workStyle],
    ["dashStart", document.startDate || tText("dashUnlimited")],
    ["dashEnd", document.endDate || tText("dashUnlimited")],
    ["dashPublishTime", document.publishTime],
    [
      "dashVisibility",
      document.hidden === undefined
        ? undefined
        : tText(document.hidden ? "dashHidden" : "dashVisible"),
    ],
  ];
  return (
    <View style={{ gap: 10 }}>
      {lines.map(([label, value]) => (
        <View key={label} style={{ gap: 3 }}>
          <Text style={s.caption}>{tText(label)}</Text>
          <Text localize={false} style={s.value}>
            {String(value || tText("dashNoValue"))}
          </Text>
        </View>
      ))}
      {!!articleHtml(document) && (
        <RecruitmentArticle
          html={articleHtml(document)}
          articleCss={document.articleCss || ""}
        />
      )}
    </View>
  );
}
export function PeriodDetailModal({
  selection,
  onClose,
}: {
  selection: { id: string; from: string; to: string } | null;
  onClose: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const [page, setPage] = useState(1),
    [versionPage, setVersionPage] = useState(1),
    [index, setIndex] = useState(0),
    [before, setBefore] = useState(false),
    [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    setPage(1);
    setVersionPage(1);
    setIndex(0);
    setBefore(false);
    setSelected(null);
  }, [selection?.id, selection?.from, selection?.to]);
  const r = useResource<PeriodDetail | null>(
    token && selection
      ? "/company-dashboard/period?" +
          query({
            jobId: selection.id,
            from: selection.from,
            to: selection.to,
            page,
            pageSize: 20,
            versionPage,
          })
      : null,
    null,
    true,
  );
  const data = r.data,
    version = data?.versions[index],
    application = data?.items.find((item) => item.id === selected);
  const showVersion = (next: number) => {
    setBefore(false);
    if (next < 0) {
      setVersionPage((n) => n - 1);
      setIndex(19);
    } else if (next >= 20) {
      setVersionPage((n) => n + 1);
      setIndex(0);
    } else setIndex(next);
  };
  const date = (value: string) =>
    new Date(value).toLocaleString(localeTag(), { timeZone: "Asia/Tokyo" });
  return (
    <Modal
      transparent
      visible={!!selection}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={s.backdrop}>
        <View style={s.modal}>
          <View style={s.header}>
            <View style={{ flex: 1, gap: 4 }}>
              <SectionTitle>{tText("dashHistory")}</SectionTitle>
              <Text localize={false} style={s.value}>
                {data?.title || ""}
              </Text>
              <Text style={s.caption}>
                {selection &&
                  tText("dashPeriodLabel", {
                    from: selection.from,
                    to: selection.to,
                  })}
              </Text>
            </View>
            <AppButton label={tText("close")} outline onPress={onClose} />
          </View>
          <ScrollView contentContainerStyle={s.body}>
            <ResourceStatus
              loading={r.loading}
              error={r.error}
              onRetry={r.refresh}
            />
            {data && !r.error && !r.loading && (
              <>
                <Panel>
                  <SectionTitle>{tText("dashApplications")}</SectionTitle>
                  <BodyText>{tText("dashSnapshotNote")}</BodyText>
                  <Pager
                    page={page}
                    total={data.total}
                    onChange={(n) => {
                      setPage(n);
                      setSelected(null);
                    }}
                  />
                  {!data.items.length && (
                    <BodyText>{tText("dashNoApplications")}</BodyText>
                  )}
                  {data.items.map((item) => (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: item.id === selected }}
                      onPress={() => setSelected(item.id)}
                      style={[s.card, item.id === selected && s.active]}
                    >
                      <View style={{ gap: 4, flex: 1 }}>
                        <Text localize={false} style={s.bold}>
                          {item.userName}
                        </Text>
                        <Text localize={false} style={s.caption}>
                          {date(item.createdAt)}
                        </Text>
                      </View>
                      <StatusBadge label={item.status} />
                    </Pressable>
                  ))}
                  {application && (
                    <View style={{ gap: 14, paddingTop: 10 }}>
                      <SectionTitle>
                        {tText("dashApplicationSnapshot")}
                      </SectionTitle>
                      <ArticleSnapshot
                        document={
                          application.snapshot.document || application.snapshot
                        }
                      />
                      <Text style={s.bold}>{tText("dashInitialMessage")}</Text>
                      <Text localize={false} style={s.value}>
                        {application.initialMessage || tText("dashNoValue")}
                      </Text>
                      <Text style={s.bold}>{tText("dashSubmittedResume")}</Text>
                      {application.snapshot.resumeSnapshot ? (
                        <>
                          <Text localize={false} style={s.value}>
                            {application.snapshot.resumeSnapshot.title}
                          </Text>
                          <ResumeDetails
                            body={
                              (application.snapshot.resumeSnapshot.body ||
                                {}) as ResumeRow["body"]
                            }
                          />
                        </>
                      ) : (
                        <BodyText>{tText("dashNotSubmitted")}</BodyText>
                      )}
                      <View style={s.actions}>
                        <AppButton
                          label={tText("dashCurrentSelection")}
                          onPress={() => {
                            onClose();
                            router.push({
                              pathname: "/company/applications",
                              params: { interactionId: application.id },
                            });
                          }}
                        />
                      </View>
                    </View>
                  )}
                  <Pager
                    page={page}
                    total={data.total}
                    onChange={(n) => {
                      setPage(n);
                      setSelected(null);
                    }}
                  />
                </Panel>
                <Panel>
                  <SectionTitle>{tText("dashBaseline")}</SectionTitle>
                  <ArticleSnapshot document={data.baseline?.document} />
                </Panel>
                <Panel>
                  <SectionTitle>{tText("dashVersions")}</SectionTitle>
                  {!data.versionTotal ? (
                    <BodyText>{tText("dashNoVersions")}</BodyText>
                  ) : (
                    <>
                      <View style={s.actions}>
                        <AppButton
                          label={tText("previous")}
                          outline
                          disabled={(versionPage - 1) * 20 + index === 0}
                          onPress={() => showVersion(index - 1)}
                        />
                        <Text style={s.caption}>
                          {tText("dashVersion", {
                            index: (versionPage - 1) * 20 + index + 1,
                            total: data.versionTotal,
                          })}
                        </Text>
                        <AppButton
                          label={tText("next")}
                          outline
                          disabled={
                            (versionPage - 1) * 20 + index + 1 >=
                            data.versionTotal
                          }
                          onPress={() => showVersion(index + 1)}
                        />
                      </View>
                      {version && (
                        <>
                          <Text localize={false} style={s.caption}>
                            {tText("dashUpdatedBy", {
                              date: date(version.changedAt),
                              name: version.actorName,
                            })}
                          </Text>
                          <View style={s.actions}>
                            <AppButton
                              label={tText("dashBefore")}
                              outline={!before}
                              onPress={() => setBefore(true)}
                            />
                            <AppButton
                              label={tText("dashAfter")}
                              outline={before}
                              onPress={() => setBefore(false)}
                            />
                          </View>
                          {version.action === "DELETE" && !before ? (
                            <BodyText>{tText("dashJobRemoved")}</BodyText>
                          ) : (
                            <ArticleSnapshot
                              document={before ? version.before : version.after}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </Panel>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,.5)",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    maxWidth: 1100,
    maxHeight: "94%",
    backgroundColor: "#F5F8FC",
    borderRadius: 20,
    overflow: "hidden",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  body: { padding: 16, gap: 16 },
  caption: { fontSize: 12, color: "#64748B", lineHeight: 20 },
  value: { fontSize: 14, color: "#334155", lineHeight: 23 },
  bold: { fontSize: 14, fontWeight: "700", color: "#173650" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  active: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
});
