import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion, localeTag } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import PublicCompanyEditor from "@/features/company/PublicCompanyEditor";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Modal, Platform, ScrollView, StyleSheet, View } from "react-native";
import AppPage from "@/components/layout/AppPage";
import { AppInput } from "@/components/form";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
} from "@/components/ui/AppUI";
import { useAuth } from "@/auth/AuthProvider";
import { authRequest } from "@/auth/api";
import CompanyManagement from "@/features/company/CompanyManagement";
import { useSettingsExitGuard } from "@/features/company/useSettingsExitGuard";

type CompanyProfile = {
  id: string;
  businessName: string | null;
  industry: string | null;
  employeeCount: string | null;
  address: string | null;
  email: string;
  createdAt: string | null;
};
type CompanyForm = {
  businessName: string;
  industry: string;
  employeeCount: string;
  address: string;
};
const toForm = (p: CompanyProfile): CompanyForm => ({
  businessName: p.businessName || "",
  industry: p.industry || "",
  employeeCount: p.employeeCount || "",
  address: p.address || "",
});
const emptyForm: CompanyForm = {
  businessName: "",
  industry: "",
  employeeCount: "",
  address: "",
};
const limits: Record<keyof CompanyForm, number> = {
  businessName: 100,
  industry: 100,
  employeeCount: 50,
  address: 500,
};
const labels: Record<keyof CompanyForm, string> = {
  businessName: sourceText("businessOrCompanyName"),
  industry: sourceText("industry"),
  employeeCount: sourceText("numberOfEmployees"),
  address: sourceText("location"),
};
const display = (value?: string | null) => value || sourceText("notRegistered");

function Action({
  label,
  onPress,
  disabled = false,
  primary = false,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
  danger?: boolean;
}) {
  "use no memo";
  useLocaleVersion();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        s.action,
        primary && s.primary,
        danger && s.danger,
        (disabled || pressed) && s.dim,
      ]}
    >
      <Text style={[s.actionText, (primary || danger) && s.white]}>
        {label}
      </Text>
    </Pressable>
  );
}
function Detail({ label, value }: { label: string; value?: string | null }) {
  "use no memo";
  useLocaleVersion();
  return (
    <View style={s.detail}>
      <Text style={s.label}>{label}</Text>
      <Text selectable style={s.value}>
        {display(value)}
      </Text>
    </View>
  );
}

export default function CompanySettingsPage() {
  "use no memo";
  useLocaleVersion();
  const { user, token, ready, refreshUser } = useAuth();
  const [managementDirty, setManagementDirty] = useState(false);
  const [managementReset, setManagementReset] = useState(0);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [mode, setMode] = useState<"detail" | "edit" | null>(null);
  const [form, setForm] = useState<CompanyForm>(emptyForm);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isOwner = user?.accountType === "COMPANY";
  const allowed = isOwner || user?.accountType === "EMPLOYEE";
  const dirty =
    !!profile &&
    (Object.keys(form) as (keyof CompanyForm)[]).some(
      (key) => form[key] !== toForm(profile)[key],
    );

  const exit = useSettingsExitGuard(
    managementDirty || (mode === "edit" && dirty),
    () => {
      setManagementDirty(false);
      setManagementReset((value) => value + 1);
      setMode(null);
      setForm(emptyForm);
      setConfirmDiscard(false);
    },
  );

  useEffect(() => {
    let active = true;
    setProfile(null);
    setMode(null);
    setConfirmDiscard(false);
    setError("");
    setNotice("");
    if (!ready || !token || !allowed) return;
    setLoading(true);
    authRequest<CompanyProfile>("/company-profile", undefined, token)
      .then((value) => {
        if (active) setProfile(value);
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : sourceText("unableToLoadCompanyInformation"),
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [ready, token, allowed, reload]);

  function close() {
    if (busyRef.current) return;
    setMode(null);
    setConfirmDiscard(false);
    setError("");
    setForm(emptyForm);
  }
  function requestClose() {
    if (busyRef.current) return;
    if (mode === "edit" && dirty) setConfirmDiscard(true);
    else close();
  }
  useEffect(() => {
    if (Platform.OS !== "web" || !mode) return;
    // Web側のModalの処理と重複しないよう、Escapeをここでまとめて扱う。
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (busyRef.current) return;
      if (confirmDiscard) setConfirmDiscard(false);
      else requestClose();
    };
    window.addEventListener("keyup", onKeyUp, true);
    return () => window.removeEventListener("keyup", onKeyUp, true);
  }, [mode, dirty, confirmDiscard]);

  async function save() {
    if (!token || !isOwner || busyRef.current) return;
    if (!form.businessName.trim()) {
      setError(sourceText("enterABusinessOrCompanyName"));
      return;
    }
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await authRequest<CompanyProfile>(
        "/company-profile",
        Object.fromEntries(
          Object.entries(form).map(([key, value]) => [key, value.trim()]),
        ),
        token,
      );
      setProfile(result);
      setForm(toForm(result));
      setMode("detail");
      setNotice(sourceText("companyInformationSaved"));
      void refreshUser().catch(() => {
        /* 保存は完了済み。認証情報は次回取得時にも更新される。 */
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : sourceText("unableToSaveCompanyInformation"),
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <AppPage
      title={tText("companyEmployeesAndPermissions")}
      subtitle={tText("manageCompanyInformationEmployeesAndRolePermissions")}
      role="company"
      activeMenu={sourceText("companyAndPermissions")}
      onNavigate={exit.navigate}
    >
      {!mode && !!notice && (
        <Text accessibilityLiveRegion="polite" style={s.success}>
          {notice}
        </Text>
      )}
      {!mode && !!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <View style={s.top}>
        <Panel style={s.profile}>
          <SectionTitle>{tText("companyProfile")}</SectionTitle>
          {isOwner && (
            <BodyText>{tText("currentRoleOwnerAllPermissions")}</BodyText>
          )}
          {!ready || loading ? (
            <BodyText>{tText("loading")}</BodyText>
          ) : !allowed || !token ? (
            <>
              <BodyText>{tText("logInWithACompanyAccountOr_371")}</BodyText>
              {!user && <Link href="/auth">{tText("logIn_184")}</Link>}
            </>
          ) : profile ? (
            <>
              <Text localize={false} style={s.name}>
                {display(profile.businessName)}
              </Text>
              <BodyText>
                {tText("companyId")}
                {profile.id}
                {"\n"}
                {tText("industry")}
                {display(profile.industry)}
                {"\n"}
                {tText("numberOfEmployees")}
                {display(profile.employeeCount)}
                {"\n"}
                {tText("location")}
                {display(profile.address)}
              </BodyText>
              <View style={s.actions}>
                <Action
                  label={tText("viewDetails_373")}
                  onPress={() => {
                    setError("");
                    setNotice("");
                    setMode("detail");
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <BodyText>{tText("unableToLoadCompanyInformation")}</BodyText>
              <View style={s.actions}>
                <Action
                  label={tText("reload")}
                  onPress={() => setReload((value) => value + 1)}
                />
              </View>
            </>
          )}
        </Panel>
      </View>
      <CompanyManagement
        key={managementReset}
        onDirtyChange={setManagementDirty}
        onEmployees={() => exit.navigate("/company/employees")}
      />
      <Modal
        transparent
        visible={exit.showing}
        animationType="fade"
        onRequestClose={exit.stay}
      >
        <View style={s.backdrop}>
          <View style={s.confirm} accessibilityViewIsModal>
            <Text accessibilityRole="header" style={s.name}>
              {tText("discardChangesAndLeaveThisPage")}
            </Text>
            <BodyText>{tText("youHaveUnsavedChanges")}</BodyText>
            <View style={s.footer}>
              <Action label={tText("stayOnThisPage")} onPress={exit.stay} />
              <Action
                label={tText("discardAndLeave")}
                danger
                onPress={exit.leave}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={!!mode && !!profile}
        animationType="fade"
        onRequestClose={() =>
          confirmDiscard ? setConfirmDiscard(false) : requestClose()
        }
      >
        <View style={s.backdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tText("closeCompanyInformation")}
            onPress={requestClose}
            style={StyleSheet.absoluteFill}
            disabled={busy}
          />
          <View
            accessibilityViewIsModal
            style={s.modal}
            importantForAccessibility={
              confirmDiscard ? "no-hide-descendants" : "auto"
            }
            {...(Platform.OS === "web" && confirmDiscard
              ? { inert: true }
              : {})}
          >
            <View style={s.head}>
              <Text accessibilityRole="header" style={s.name}>
                {mode === "edit"
                  ? sourceText("editCompanyInformation")
                  : sourceText("companyInformationDetails")}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={tText("close")}
                disabled={busy}
                onPress={requestClose}
                style={s.close}
              >
                <Ionicons name="close" size={28} color="#183455" />
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={s.stack}
            >
              {!!error && (
                <Text accessibilityRole="alert" style={s.error}>
                  {error}
                </Text>
              )}
              {profile && (
                <>
                  <Detail
                    label={tText("companyIdReadOnly")}
                    value={profile.id}
                  />
                  <Detail
                    label={tText("registeredEmailAddressReadOnly")}
                    value={profile.email}
                  />
                  {mode === "edit" ? (
                    <>
                      {(Object.keys(form) as (keyof CompanyForm)[]).map(
                        (key) => (
                          <AppInput
                            key={key}
                            label={labels[key]}
                            required={key === "businessName"}
                            value={form[key]}
                            onChangeText={(value) =>
                              setForm((old) => ({ ...old, [key]: value }))
                            }
                            editable={!busy}
                            maxLength={limits[key]}
                            autoFocus={key === "businessName"}
                            multiline={key === "address"}
                          />
                        ),
                      )}
                    </>
                  ) : (
                    <>
                      <Detail
                        label={tText("businessOrCompanyName")}
                        value={profile.businessName}
                      />
                      <Detail
                        label={tText("industry")}
                        value={profile.industry}
                      />
                      <Detail
                        label={tText("numberOfEmployees")}
                        value={profile.employeeCount}
                      />
                      <Detail
                        label={tText("location")}
                        value={profile.address}
                      />
                    </>
                  )}
                  <Detail
                    label={tText("registrationDateReadOnly")}
                    value={
                      profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            localeTag(),
                          )
                        : null
                    }
                  />
                </>
              )}
            </ScrollView>
            <View style={s.footer}>
              {mode === "edit" ? (
                <>
                  <Action
                    label={tText("cancel")}
                    disabled={busy}
                    onPress={requestClose}
                  />
                  <Action
                    label={busy ? sourceText("saving") : sourceText("save_384")}
                    primary
                    disabled={busy}
                    onPress={() => void save()}
                  />
                </>
              ) : (
                <>
                  <Action label={tText("close")} onPress={requestClose} />
                  {isOwner && (
                    <Action
                      label={tText("edit")}
                      primary
                      onPress={() => {
                        if (profile) {
                          setForm(toForm(profile));
                          setError("");
                          setNotice("");
                          setMode("edit");
                        }
                      }}
                    />
                  )}
                </>
              )}
            </View>
          </View>
          {confirmDiscard && (
            <View style={s.confirmBackdrop}>
              <Pressable
                style={StyleSheet.absoluteFill}
                accessibilityRole="button"
                accessibilityLabel={tText("continueEditing")}
                onPress={() => setConfirmDiscard(false)}
              />
              <View accessibilityViewIsModal style={s.confirm}>
                <Text accessibilityRole="header" style={s.name}>
                  {tText("discardYourChanges")}
                </Text>
                <BodyText>
                  {tText("discardUnsavedChangesAndCloseCompanyInformation")}
                </BodyText>
                <View style={s.footer}>
                  <Action
                    label={tText("continueEditing")}
                    onPress={() => setConfirmDiscard(false)}
                  />
                  <Action
                    label={tText("discardAndClose")}
                    danger
                    onPress={close}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
      <PublicCompanyEditor />
    </AppPage>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: "row", flexWrap: "wrap", gap: 13 },
  profile: { flex: 1, minWidth: 240 },
  members: { flex: 2, minWidth: 240 },
  name: { fontSize: 17, fontWeight: "700", color: "#183455", flexShrink: 1 },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  compactButton: { width: 110 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  action: {
    minWidth: 100,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1857B4",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { fontSize: 13, fontWeight: "700", color: "#1857B4" },
  primary: { backgroundColor: "#1857B4" },
  danger: { backgroundColor: "#B42318", borderColor: "#B42318" },
  white: { color: "#FFF" },
  dim: { opacity: 0.5 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 680,
    maxHeight: "90%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  close: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  stack: { gap: 16, paddingBottom: 12 },
  detail: { gap: 6 },
  label: { fontSize: 12, color: "#64748B", fontWeight: "700" },
  value: { fontSize: 14, color: "#183455", lineHeight: 22 },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  error: { color: "#B42318", fontSize: 13 },
  success: { color: "#187344", fontSize: 13 },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  confirm: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 14,
    padding: 22,
    backgroundColor: "#FFF",
    gap: 16,
  },
});
