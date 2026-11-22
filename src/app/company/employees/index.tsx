import { translateText } from "@/i18n/display";
import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion, localeTag } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Platform, ScrollView, StyleSheet, View } from "react-native";
import AppPage from "@/components/layout/AppPage";
import { AppInput, AppSelect } from "@/components/form";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
} from "@/components/ui/AppUI";
import { useAuth } from "@/auth/AuthProvider";
import { useCompanyPermission } from "@/features/company/CompanyPermissionBoundary";
import { authRequest, type AuthUser } from "@/auth/api";

const emptyForm = {
  employeeNumber: "",
  familyName: "",
  givenName: "",
  email: "",
  password: "",
  gender: "UNDISCLOSED",
};
const genders = [
  { value: "UNDISCLOSED", label: sourceText("preferNotToSay") },
  { value: "MALE", label: sourceText("male") },
  { value: "FEMALE", label: sourceText("female") },
  { value: "OTHER", label: sourceText("other") },
];
const options = (values: string[]) =>
  values.map((value) => ({ value, label: value }));
type SortKey = "employeeNumber" | "displayName" | "createdAt";

export default function EmployeePage() {
  "use no memo";
  useLocaleVersion();
  const { user, token, ready } = useAuth();
  const permission = useCompanyPermission("employees");
  const allowed = permission.allowed && !!token;
  return (
    <AppPage
      title={tText("employeeManagement")}
      subtitle=""
      role="company"
      activeMenu={sourceText("employeeManagement")}
    >
      {!ready || !permission.ready ? (
        <BodyText>{tText("loading")}</BodyText>
      ) : allowed && user && token ? (
        <EmployeeManager
          key={token}
          user={user}
          token={token}
          level={permission.level}
        />
      ) : (
        <Panel>
          <SectionTitle>{tText("employeeManagement")}</SectionTitle>
          <BodyText>
            {tText("availableToCompanyAccountsAndEmployeesWith")}
          </BodyText>
          {!user && <Link href="/auth">{tText("logIn_184")}</Link>}
        </Panel>
      )}
    </AppPage>
  );
}

function EmployeeManager({
  user,
  token,
  level,
}: {
  user: AuthUser;
  token: string;
  level: number;
}) {
  "use no memo";
  useLocaleVersion();
  const needsBusinessName =
    user.accountType === "COMPANY" && !user.businessName?.trim();
  const [items, setItems] = useState<AuthUser[] | null>(null);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [direction, setDirection] = useState("desc");
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<"detail" | "create" | "edit" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(false);
  const [mailPassword, setMailPassword] = useState("");
  const [mailOpen, setMailOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const employee = items?.find((item) => item.id === selected);
  const origin =
    Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.origin
      : process.env.EXPO_PUBLIC_WEB_BASE_URL?.replace(/\/$/, "");
  const loginUrl = `${origin || ""}/company-login?ownerId=${encodeURIComponent(user.companyOwnerId || user.id)}`;

  async function refresh() {
    setItems(await authRequest<AuthUser[]>("/employees", undefined, token));
  }
  useEffect(() => {
    let active = true;
    authRequest<AuthUser[]>("/employees", undefined, token)
      .then((list) => {
        if (active) setItems(list);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function run(action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : sourceText("unableToCompleteTheAction"),
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  function close() {
    if (busyRef.current) return;
    setMode(null);
    setSelected(null);
    setForm(emptyForm);
    setMailPassword("");
    setMailOpen(false);
    setDeleting(false);
    setError("");
  }
  function openDetail(item: AuthUser) {
    if (busyRef.current) return;
    setSelected(item.id);
    setMode("detail");
    setDeleting(false);
    setMailPassword("");
    setMailOpen(false);
    setError("");
  }
  function edit() {
    if (!employee || busyRef.current) return;
    setForm({
      employeeNumber: employee.employeeNumber || "",
      familyName: employee.familyName || employee.displayName,
      givenName: employee.givenName || "",
      email: employee.email,
      password: "",
      gender: employee.gender || "UNDISCLOSED",
    });
    setMode("edit");
    setMailPassword("");
    setMailOpen(false);
    setError("");
    setDeleting(false);
  }
  async function save() {
    const familyName = form.familyName.trim();
    const givenName = form.givenName.trim();
    const displayName = [familyName, givenName].filter(Boolean).join(" ");
    const legacy = mode === "edit" && !employee?.givenName;
    if (!familyName || (!givenName && !legacy))
      throw new Error(sourceText("enterTheEmployeeSFamilyAndGiven"));
    if (displayName.length > 100)
      throw new Error(sourceText("theFullNameMustBeNoMore"));
    if (!form.email.trim())
      throw new Error(sourceText("enterTheRegisteredEmailAddress"));
    if (
      (mode === "create" || form.password) &&
      (form.password.length < 8 || form.password.length > 72)
    ) {
      throw new Error(sourceText("passwordsMustHaveAtLeast8Characters"));
    }
    if (
      form.employeeNumber.trim() &&
      !/^[a-zA-Z0-9_-]{1,40}$/.test(form.employeeNumber.trim())
    ) {
      throw new Error(sourceText("employeeIdsMayContainUpTo40"));
    }
    const body = {
      ...form,
      familyName,
      givenName,
      displayName,
      email: form.email.trim(),
      password: form.password || undefined,
    };
    if (mode === "edit" && employee) {
      const saved = await authRequest<AuthUser>(
        `/employees/${employee.id}/edit`,
        body,
        token,
      );
      setItems((old) =>
        (old || []).map((item) => (item.id === saved.id ? saved : item)),
      );
      setMode("detail");
      setForm(emptyForm);
      setNotice(sourceText("employeeDetailsUpdated"));
    } else {
      const result = await authRequest<{
        employee: AuthUser;
        mailSent: boolean;
      }>("/employees/register", body, token);
      setItems((old) => [result.employee, ...(old || [])]);
      setSelected(result.employee.id);
      setMode("detail");
      setForm(emptyForm);
      setNotice(
        result.mailSent
          ? sourceText("employeeCreatedAndRegistrationEmailSent")
          : sourceText("theEmployeeWasCreatedButTheRegistration"),
      );
      if (!result.mailSent) {
        setMailPassword(form.password);
        setMailOpen(true);
      }
    }
  }
  async function remove() {
    if (!employee) return;
    await authRequest(`/employees/${employee.id}/delete`, {}, token);
    setItems((old) => (old || []).filter((item) => item.id !== employee.id));
    setMode(null);
    setSelected(null);
    setDeleting(false);
    setMailPassword("");
    setNotice(sourceText("employeeDeleted"));
  }
  async function resend() {
    if (!employee || !mailPassword)
      throw new Error(sourceText("enterYourCurrentLoginPassword"));
    const result = await authRequest<{ mailSent: boolean }>(
      `/employees/${employee.id}/registration-mail`,
      { password: mailPassword },
      token,
    );
    if (!result.mailSent)
      throw new Error(sourceText("unableToSendTheRegistrationEmailCheck"));
    setMailPassword("");
    setMailOpen(false);
    setNotice(sourceText("registrationEmailSent"));
  }

  const normalize = (value: string) =>
    value.normalize("NFKC").toLocaleLowerCase().replace(/\s/g, "");
  const filtered = (items || []).filter((item) =>
    normalize(item.displayName + " " + (item.employeeNumber || "")).includes(
      normalize(query),
    ),
  );
  const sorted = [...filtered].sort((a, b) => {
    const comparison =
      sortKey === "createdAt"
        ? (Date.parse(a.createdAt || "") || 0) -
          (Date.parse(b.createdAt || "") || 0)
        : (a[sortKey] || "").localeCompare(b[sortKey] || "", "ja", {
            numeric: true,
          });
    return (
      (direction === "asc" ? comparison : -comparison) ||
      a.id.localeCompare(b.id)
    );
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / Number(pageSize)));
  const currentPage = Math.min(page, totalPages);
  const shown = sorted.slice(
    (currentPage - 1) * Number(pageSize),
    currentPage * Number(pageSize),
  );
  const columns = width >= 900 ? 3 : width >= 560 ? 2 : 1;
  const field = (key: keyof typeof form) => ({
    value: form[key],
    editable: !busy,
    onChangeText: (value: string) =>
      setForm((old) => ({ ...old, [key]: value })),
  });
  const pager = (
    <View style={s.pager}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={tText("previousPage")}
        disabled={currentPage === 1 || busy}
        onPress={() => setPage(currentPage - 1)}
        style={[s.smallButton, currentPage === 1 && s.disabled]}
      >
        <Text>{tText("previous")}</Text>
      </Pressable>
      <Text accessibilityLiveRegion="polite">
        {currentPage} / {totalPages} {tText("page")}
        {filtered.length}
        {tText("total_199")}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={tText("nextPage")}
        disabled={currentPage === totalPages || busy}
        onPress={() => setPage(currentPage + 1)}
        style={[s.smallButton, currentPage === totalPages && s.disabled]}
      >
        <Text>{tText("next")}</Text>
      </Pressable>
    </View>
  );

  return (
    <>
      <Panel>
        <SectionTitle localize={false}>
          {user.businessName || tText("company_201")}
          {tText("employeeLoginUrl")}
        </SectionTitle>
        <Text selectable style={s.link}>
          {loginUrl}
        </Text>
        <BodyText>{tText("loginDetailsWillBeEmailedToThe")}</BodyText>
      </Panel>
      {!mode && !!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      {!mode && !!notice && (
        <Text accessibilityLiveRegion="polite">{notice}</Text>
      )}
      <Panel>
        <View style={s.row}>
          <SectionTitle>{tText("employeeList")}</SectionTitle>
          {level >= 2 && !needsBusinessName && (
            <View style={s.createButton}>
              <AppButton
                label={tText("create")}
                onPress={() => {
                  if (busy || items === null) return;
                  setForm(emptyForm);
                  setSelected(null);
                  setMode("create");
                  setError("");
                  setNotice("");
                }}
              />
            </View>
          )}
        </View>
        {needsBusinessName && (
          <BodyText>{tText("registerABusinessOrCompanyNameIn")}</BodyText>
        )}
        <View style={s.toolbar}>
          <AppInput
            label={tText("searchByNameOrEmployeeId")}
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              setPage(1);
            }}
            containerStyle={s.searchField}
          />
          <AppSelect
            label={tText("itemsPerPage")}
            value={pageSize}
            options={options(["10", "20", "50"])}
            onValueChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
            containerStyle={s.shortFilter}
          />
          <AppSelect
            label={tText("sortBy")}
            value={sortKey}
            options={[
              { value: "employeeNumber", label: sourceText("employeeId") },
              { value: "displayName", label: sourceText("name_211") },
              { value: "createdAt", label: sourceText("registrationDate") },
            ]}
            onValueChange={(value) => {
              setSortKey(value as SortKey);
              setPage(1);
            }}
            containerStyle={s.sortFilter}
          />
          <AppSelect
            label={tText("sortDirection")}
            value={direction}
            options={[
              { value: "asc", label: sourceText("ascending") },
              { value: "desc", label: sourceText("descending") },
            ]}
            onValueChange={(value) => {
              setDirection(value);
              setPage(1);
            }}
            containerStyle={s.shortFilter}
          />
        </View>
        {pager}
        {items === null ? (
          <>
            <BodyText>
              {error
                ? sourceText("unableToLoadEmployees")
                : sourceText("loading")}
            </BodyText>
            {!!error && (
              <AppButton
                label={tText("reload")}
                outline
                onPress={() => void run(refresh)}
              />
            )}
          </>
        ) : (
          !shown.length && (
            <BodyText>
              {query
                ? sourceText("noEmployeesMatchYourSearch")
                : sourceText("noEmployeesHaveBeenRegistered")}
            </BodyText>
          )
        )}
        <View
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
          style={s.grid}
        >
          {shown.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={translateText(
                sourceFormat(
                  "detailsFor",
                  {
                    v0:
                      item.employeeNumber ||
                      sourceText("noEmployeeNumberRegistered"),
                    v1: item.displayName,
                  },
                  ["v0", "v1"],
                ),
              )}
              onPress={() => openDetail(item)}
              style={[
                s.card,
                {
                  width:
                    width > 0
                      ? (width - 12 * (columns - 1)) / columns
                      : undefined,
                },
              ]}
            >
              <View style={s.row}>
                <Ionicons
                  name="person-circle-outline"
                  size={36}
                  color="#356396"
                />
                <Text localize={false} style={s.number}>
                  {item.employeeNumber || tText("noEmployeeId")}
                </Text>
              </View>
              <Text localize={false} style={s.name}>
                {item.displayName}
              </Text>
              <Text localize={false} style={s.email} numberOfLines={1}>
                {item.email}
              </Text>
              <Text style={s.meta}>
                {tText("registeredOn")}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(localeTag())
                  : sourceText("notRegistered")}
              </Text>
            </Pressable>
          ))}
        </View>
        {pager}
      </Panel>
      <Modal
        transparent
        visible={mode !== null}
        animationType="fade"
        onRequestClose={close}
      >
        <View style={s.backdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tText("closeEmployeeDialog")}
            onPress={close}
            style={StyleSheet.absoluteFill}
          />
          <View accessibilityViewIsModal style={s.modal}>
            <View style={s.row}>
              <Text accessibilityRole="header" style={s.name}>
                {mode === "create"
                  ? sourceText("createEmployee")
                  : mode === "edit"
                    ? sourceText("editEmployeeDetails")
                    : sourceText("employeeDetails")}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={tText("close")}
                disabled={busy}
                onPress={close}
                style={s.close}
              >
                <Ionicons name="close" size={28} color="#183455" />
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ flexGrow: 0 }}
            >
              <View style={s.stack}>
                {!!error && (
                  <Text accessibilityRole="alert" style={s.error}>
                    {error}
                  </Text>
                )}
                {!!notice && (
                  <Text accessibilityLiveRegion="polite">{notice}</Text>
                )}
                {mode === "detail" && employee ? (
                  <>
                    <BodyText localize={false}>
                      {tText("employeeId")}
                      {employee.employeeNumber || tText("notRegistered")}
                    </BodyText>
                    <BodyText localize={false}>
                      {tText("fullName")}
                      {employee.displayName}
                    </BodyText>
                    <Text localize={false} selectable style={s.email}>
                      {tText("registeredEmailAddress")}
                      {employee.email}
                    </Text>
                    <BodyText>
                      {tText("gender")}
                      {genders.find(
                        (gender) => gender.value === employee.gender,
                      )?.label || sourceText("preferNotToSay")}
                    </BodyText>
                    <BodyText>
                      {tText("registrationDateAndTime")}
                      {employee.createdAt
                        ? new Date(employee.createdAt).toLocaleString(
                            localeTag(),
                          )
                        : sourceText("notRegistered")}
                    </BodyText>
                    <Text selectable style={s.link}>
                      {loginUrl}
                    </Text>
                    {level >= 2 && (
                      <AppButton label={tText("edit")} outline onPress={edit} />
                    )}
                    {level >= 3 && (
                      <AppButton
                        label={
                          deleting
                            ? sourceText("confirmDeletion")
                            : sourceText("delete")
                        }
                        danger
                        onPress={() => {
                          if (busy) return;
                          if (deleting) void run(remove);
                          else setDeleting(true);
                        }}
                      />
                    )}
                    {deleting && (
                      <AppButton
                        label={tText("cancelDeletion")}
                        outline
                        onPress={() => {
                          if (!busy) setDeleting(false);
                        }}
                      />
                    )}
                    {level >= 2 && (
                      <AppButton
                        label={tText("resendRegistrationEmail")}
                        outline
                        onPress={() => {
                          if (!busy) setMailOpen((open) => !open);
                        }}
                      />
                    )}
                    {mailOpen && (
                      <>
                        <AppInput
                          label={tText("currentLoginPassword")}
                          secureTextEntry
                          value={mailPassword}
                          onChangeText={setMailPassword}
                          editable={!busy}
                          maxLength={72}
                        />
                        <AppButton
                          label={
                            busy
                              ? sourceText("processing")
                              : sourceText("sendRegistrationDetails")
                          }
                          onPress={() => void run(resend)}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <AppInput
                      label={tText("employeeIdGeneratedAutomaticallyIfBlank")}
                      {...field("employeeNumber")}
                      maxLength={40}
                      autoCapitalize="characters"
                    />
                    <View style={s.filters}>
                      <AppInput
                        label={tText("employeeFamilyName")}
                        required
                        {...field("familyName")}
                        maxLength={50}
                        containerStyle={s.filter}
                      />
                      <AppInput
                        label={tText("employeeGivenName")}
                        required={mode === "create" || !!employee?.givenName}
                        {...field("givenName")}
                        maxLength={50}
                        containerStyle={s.filter}
                      />
                    </View>
                    {mode === "edit" && !employee?.familyName && (
                      <BodyText>
                        {tText("theExistingFullNameAppearsInThe")}
                      </BodyText>
                    )}
                    <AppInput
                      label={tText("registeredEmailAddress")}
                      required
                      {...field("email")}
                      maxLength={254}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    <AppInput
                      label={
                        mode === "edit"
                          ? sourceText("newPasswordIfChanging")
                          : sourceText("password")
                      }
                      required={mode === "create"}
                      {...field("password")}
                      secureTextEntry
                      autoComplete="new-password"
                      maxLength={72}
                    />
                    <AppSelect
                      label={tText("gender")}
                      value={form.gender}
                      options={genders}
                      disabled={busy}
                      onValueChange={(gender) =>
                        setForm((old) => ({ ...old, gender }))
                      }
                    />
                    <BodyText>
                      {tText("creatingAnEmployeeSendsAnEmailContaining")}
                    </BodyText>
                    <AppButton
                      label={
                        busy
                          ? sourceText("processing")
                          : mode === "create"
                            ? sourceText("createAndSendEmail")
                            : sourceText("saveChanges")
                      }
                      onPress={() => void run(save)}
                    />
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  stack: { gap: 14, paddingBottom: 12 },
  createButton: { width: 110, flexShrink: 0 },
  toolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: 10,
  },
  searchField: { width: 300, maxWidth: "100%" },
  shortFilter: { width: 110, maxWidth: "100%" },
  sortFilter: { width: 150, maxWidth: "100%" },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  filter: { flexGrow: 1, flexBasis: 140, minWidth: 0 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: "#D2DFF0",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    backgroundColor: "#F9FBFF",
    minWidth: 0,
  },
  name: { fontSize: 18, fontWeight: "700", color: "#183455", flexShrink: 1 },
  number: { fontSize: 12, fontWeight: "600", color: "#436384", flexShrink: 1 },
  email: { fontSize: 13, color: "#244564", flexShrink: 1 },
  meta: { fontSize: 12, color: "#64748B" },
  link: { color: "#1857B4", fontSize: 13 },
  error: { color: "#B42318" },
  pager: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 14,
  },
  smallButton: {
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: "#EDF3FC",
    borderRadius: 7,
  },
  disabled: { opacity: 0.4 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 650,
    maxHeight: "90%",
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#FFF",
    gap: 12,
  },
  close: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
