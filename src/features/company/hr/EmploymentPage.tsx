import { HrButton as AppButton } from "./shared";
import { useEffect, useState } from "react";
import { View, Platform, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text, Pressable } from "@/i18n/native";
import { tText, useLocaleVersion } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import AppPage from "@/components/layout/AppPage";
import { useAuth } from "@/auth/AuthProvider";
import { dataRequest, query, type Page } from "@/api/platform";
import { useResource, ResourceStatus } from "@/api/useResource";
import { ConfirmAction, Pager } from "@/api/ApiUI";
import { AppInput, AppSelect, AppDatePicker } from "@/components/form";
import { Panel, SectionTitle, BodyText } from "@/components/ui/AppUI";
import { CompanyPermissionBoundary } from "../CompanyPermissionBoundary";
import { hs, ActionStatus, useHrAction, kindLabel } from "./shared";
import { emptySettings, type HrSettings, type HrDetail } from "./models";
import { uploadPdf, downloadPrivate } from "./files";
const emptyForm = {
  joinDate: "",
  departmentId: "",
  positionId: "",
  roleId: "",
  employeeId: "",
  employeeEmail: "",
  password: "",
  version: 0,
};
type Candidate = {
  id: string;
  name: string;
  title: string;
  joinDate: string | null;
  employmentStatus: string;
};
function Content() {
  "use no memo";
  useLocaleVersion();
  const { token, user } = useAuth();
  const params = useLocalSearchParams<{ interactionId?: string }>();
  const { width } = useWindowDimensions();
  const [state, setState] = useState("PENDING"),
    [q, setQ] = useState(""),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<string | null>(
      params.interactionId || null,
    ),
    [form, setForm] = useState(emptyForm);
  const action = useHrAction();
  const settings = useResource<HrSettings>(
    "/company-hr/settings",
    emptySettings,
    true,
  );
  const list = useResource<Page<Candidate>>(
    "/company-hr/employments?" + query({ state, q, page, pageSize: 20 }),
    { items: [], total: 0, page: 1, pageSize: 20 },
    true,
  );
  const detail = useResource<HrDetail | null>(
    selected ? `/company-hr/employments/${selected}` : null,
    null,
    true,
  );
  const sync = (d: HrDetail) => {
    const e = d.employment;
    setForm({
      ...emptyForm,
      joinDate: e?.joinDate || "",
      departmentId: e?.departmentId || "",
      positionId: e?.positionId || "",
      roleId: e?.roleId || settings.data.settings.defaultRoleId,
      employeeId: e?.employeeId || "",
      version: e?.version || 0,
    });
  };
  useEffect(() => {
    if (detail.data) sync(detail.data);
  }, [selected, detail.data?.employment?.id]);
  const edit = (k: keyof typeof form, v: string) =>
    setForm((old) => ({ ...old, [k]: v }));
  const d = detail.data,
    e = d?.employment;
  const writable = !!d?.canWrite && (!e || e.status === "PENDING");
  const options = (rows: { id: string; name: string }[], label: string) => [
    { value: "", label },
    ...rows.map((r) => ({ value: r.id, label: r.name })),
  ];
  return (
    <AppPage
      title={tText("hrEmployment")}
      subtitle=""
      role="company"
      activeMenu={sourceText("hrEmployment")}
    >
      <View style={hs.row}>
        <SectionTitle>{tText("hrEmployment")}</SectionTitle>
        <AppButton
          outline
          label={tText("hrSettings")}
          onPress={() => router.push("/company/hr-settings" as never)}
        />
      </View>
      <ActionStatus {...action} />
      <ResourceStatus
        loading={list.loading || settings.loading}
        error={list.error || settings.error}
        onRetry={() => {
          list.refresh();
          settings.refresh();
        }}
        privateData
      />
      <View style={hs.row}>
        <View style={{ width: 220 }}>
          <AppInput
            placeholder={tText("hrSearch")}
            value={q}
            onChangeText={(v) => {
              setQ(v);
              setPage(1);
              setSelected(null);
            }}
          />
        </View>
        <View style={{ width: 170 }}>
          <AppSelect
            disabled={!writable}
            value={state}
            onValueChange={(v) => {
              setState(v);
              setPage(1);
              setSelected(null);
            }}
            options={[
              { value: "PENDING", label: tText("hrPending") },
              { value: "JOINED", label: tText("hrJoined") },
              { value: "CANCELLED", label: tText("hrCancelled") },
            ]}
          />
        </View>
      </View>
      <View style={width >= 1100 ? hs.split : { gap: 16 }}>
        <View style={width >= 1100 ? hs.left : { gap: 10 }}>
          <Pager page={page} total={list.data.total} onChange={setPage} />
          {!list.loading && !list.error && !list.data.items.length && (
            <BodyText>{tText("hrNoCandidates")}</BodyText>
          )}
          {list.data.items.map((row) => (
            <Pressable
              key={row.id}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === row.id }}
              style={[hs.item, selected === row.id && hs.selected]}
              onPress={() => setSelected(row.id)}
            >
              <Text localize={false} style={{ fontWeight: "700" }}>
                {row.name}
              </Text>
              <Text localize={false}>{row.title}</Text>
              <Text style={hs.muted}>
                {row.joinDate || tText("hrUnregistered")}
              </Text>
            </Pressable>
          ))}
          <Pager page={page} total={list.data.total} onChange={setPage} />
        </View>
        <View style={width >= 1100 ? hs.right : { gap: 14 }}>
          <ResourceStatus
            loading={!!selected && detail.loading}
            error={detail.error}
            onRetry={detail.refresh}
          />
          {!selected && (
            <Panel>
              <BodyText>{tText("hrSelectCandidate")}</BodyText>
            </Panel>
          )}
          {d && !detail.error && (
            <>
              <Panel style={hs.card}>
                <SectionTitle>
                  {d.interaction.name} ／ {d.interaction.title}
                </SectionTitle>
                <Text style={hs.muted}>
                  {tText(
                    e?.status === "JOINED"
                      ? "hrJoined"
                      : e?.status === "CANCELLED"
                        ? "hrCancelled"
                        : e
                          ? "hrPending"
                          : "hrUnregistered",
                  )}
                </Text>
                {d.linkedEmployee && (
                  <View style={{ gap: 6 }}>
                    <Text localize={false}>
                      {d.linkedEmployee.name} ／ {d.linkedEmployee.email}
                    </Text>
                    <Text style={hs.muted}>{tText("hrLoginLinkNote")}</Text>
                    <Text selectable localize={false}>
                      {(Platform.OS === "web" && typeof window !== "undefined"
                        ? window.location.origin
                        : process.env.EXPO_PUBLIC_WEB_BASE_URL || "") +
                        "/company-login?ownerId=" +
                        encodeURIComponent(
                          user?.companyOwnerId || user?.id || "",
                        )}
                    </Text>
                  </View>
                )}

                <View style={hs.row}>
                  <View style={hs.field}>
                    <AppDatePicker
                      disabled={!writable}
                      label={tText("hrJoinDate")}
                      value={form.joinDate}
                      onValueChange={(v) => edit("joinDate", v)}
                    />
                  </View>
                  <View style={hs.field}>
                    <AppSelect
                      disabled={!writable}
                      label={tText("hrDepartment")}
                      value={form.departmentId}
                      options={options(
                        settings.data.departments,
                        tText("hrNone"),
                      )}
                      onValueChange={(v) => edit("departmentId", v)}
                    />
                  </View>
                </View>
                <View style={hs.row}>
                  <View style={hs.field}>
                    <AppSelect
                      disabled={!writable}
                      label={tText("hrPosition")}
                      value={form.positionId}
                      options={options(
                        settings.data.positions,
                        tText("hrDefaultPosition"),
                      )}
                      onValueChange={(v) => edit("positionId", v)}
                    />
                  </View>
                  <View style={hs.field}>
                    <AppSelect
                      disabled={!writable}
                      label={tText("hrRole")}
                      value={form.roleId}
                      options={options(
                        settings.data.roles,
                        tText("hrDefaultRole"),
                      )}
                      onValueChange={(v) => edit("roleId", v)}
                    />
                  </View>
                </View>
                <BodyText>{tText("hrRoleTiming")}</BodyText>
                {!e && (
                  <>
                    <AppSelect
                      disabled={!writable}
                      label={tText("hrEmployeeAccount")}
                      value={form.employeeId}
                      onValueChange={(v) => edit("employeeId", v)}
                      options={[
                        { value: "", label: tText("hrCreateEmployee") },
                        ...settings.data.employees.map((r) => ({
                          value: r.id,
                          label: r.name + " / " + r.email,
                        })),
                      ]}
                    />
                    {!form.employeeId && (
                      <>
                        <BodyText>{tText("hrSeparateEmail")}</BodyText>
                        <AppInput
                          label={tText("hrEmployeeEmail")}
                          value={form.employeeEmail}
                          onChangeText={(v) => edit("employeeEmail", v)}
                          autoCapitalize="none"
                          keyboardType="email-address"
                        />
                        <AppInput
                          label={tText("hrPassword")}
                          value={form.password}
                          onChangeText={(v) => edit("password", v)}
                          secureTextEntry
                          autoCapitalize="none"
                        />
                      </>
                    )}
                  </>
                )}
                {writable && (
                  <ConfirmAction
                    ButtonComponent={AppButton}
                    label={e ? tText("hrSave") : tText("hrRegister")}
                    message={tText("hrRegisterConfirm", {
                      name: d.interaction.name,
                    })}
                    onConfirm={async () => {
                      const result = await dataRequest<HrDetail>(
                        `/company-hr/employments/${selected}`,
                        token,
                        form,
                        "PUT",
                      );
                      sync(result);
                    }}
                  />
                )}
                {e && e.status === "PENDING" && d.canWrite && (
                  <View style={hs.row}>
                    <ConfirmAction
                      ButtonComponent={AppButton}
                      label={tText("hrConfirmJoin")}
                      message={tText("hrJoinConfirm", {
                        name: d.interaction.name,
                      })}
                      onConfirm={async () => {
                        const result = await dataRequest<HrDetail>(
                          `/company-hr/employments/${selected}/confirm`,
                          token,
                          { version: e.version },
                        );
                        sync(result);
                      }}
                    />
                    {settings.data.canDelete && (
                      <ConfirmAction
                        ButtonComponent={AppButton}
                        danger
                        label={tText("hrCancelRegistration")}
                        message={tText("hrCancelConfirm")}
                        onConfirm={() =>
                          dataRequest(
                            `/company-hr/employments/${selected}?version=${e.version}`,
                            token,
                            undefined,
                            "DELETE",
                          )
                        }
                      />
                    )}
                  </View>
                )}
              </Panel>
              <Panel style={hs.card}>
                <SectionTitle>{tText("hrDocuments")}</SectionTitle>
                <BodyText>{tText("hrLatestDocumentNote")}</BodyText>
                {!e && (
                  <>
                    {d.documents.map((doc) => (
                      <Text localize={false} key={doc.id}>
                        {kindLabel(doc.kind)}：{doc.fileName}
                        {doc.taxYear ? ` (${doc.taxYear})` : ""}
                      </Text>
                    ))}
                    {d.latestCareer && (
                      <Text>
                        {tText("hrLatestCareer")}: {d.latestCareer.title}
                      </Text>
                    )}
                    {!d.documents.some((doc) => doc.kind === "RESUME") && (
                      <Text style={hs.error}>{tText("hrResumeRequired")}</Text>
                    )}
                  </>
                )}
                {d.received.map((doc) => (
                  <View key={doc.id} style={hs.row}>
                    <Text localize={false} style={{ flex: 1 }}>
                      {kindLabel(doc.kind)}：{doc.fileName}
                    </Text>
                    <AppButton
                      outline
                      label={tText("hrDownload")}
                      disabled={action.busy}
                      onPress={() =>
                        void action.run(() =>
                          downloadPrivate(
                            `/company-hr/files/${doc.id}`,
                            token!,
                            doc.fileName,
                          ),
                        )
                      }
                    />
                    {doc.kind === "CONTRACT" && settings.data.canDelete && (
                      <ConfirmAction
                        ButtonComponent={AppButton}
                        danger
                        label={tText("hrDelete")}
                        message={tText("hrDeleteConfirm")}
                        onConfirm={() =>
                          dataRequest(
                            `/company-hr/files/${doc.id}`,
                            token,
                            undefined,
                            "DELETE",
                          )
                        }
                      />
                    )}
                  </View>
                ))}
                {e && d.canWrite && (
                  <AppButton
                    label={tText("hrAddContract")}
                    disabled={action.busy}
                    onPress={() =>
                      void action.run(() =>
                        uploadPdf(
                          `/company-hr/employments/${e.id}/contracts`,
                          token!,
                        ),
                      )
                    }
                  />
                )}
              </Panel>
            </>
          )}
        </View>
      </View>
    </AppPage>
  );
}
export default function EmploymentPage() {
  return (
    <CompanyPermissionBoundary
      permission="employees"
      title={sourceText("hrEmployment")}
    >
      <Content />
    </CompanyPermissionBoundary>
  );
}
