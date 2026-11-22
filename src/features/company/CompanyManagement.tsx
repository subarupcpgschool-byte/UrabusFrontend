import { translateText } from "@/i18n/display";
import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion, localeTag } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { authRequest } from "@/auth/api";
import { AppInput, AppSelect } from "@/components/form";
import { AppIconButton } from "@/components/ui/AppIconButton";
import { BodyText, Panel, SectionTitle } from "@/components/ui/AppUI";
import {
  levelLabel,
  noPermissions,
  permissionColumns,
  permissionOptions,
  type Flags,
  type PermissionLevel,
} from "./companyPermissions";

type Role = {
  id: string;
  name: string;
  fixed: boolean;
  version: number;
  permissions: Flags;
};
type Position = { id: string; name: string; version: number };
type Member = {
  id: string;
  displayName: string;
  email: string | null;
  employeeNumber: string | null;
  roleId: string | null;
  positionId: string | null;
  roleName: string | null;
  positionName: string | null;
  lastLoginAt: string | null;
  version: number;
};
type Management = {
  roles: Role[];
  positions: Position[];
  members: Member[];
  permissions: Flags;
};
type Form =
  | { kind: "role"; name: string; permissions: Flags }
  | { kind: "position"; id?: string; version: number; name: string }
  | { kind: "member"; member: Member; roleId: string; positionId: string };
const equalRole = (a: Role, b: Role) =>
  a.name === b.name &&
  a.permissions.scout === b.permissions.scout &&
  permissionColumns.every(([key]) => a.permissions[key] === b.permissions[key]);
const message = (e: unknown) =>
  e instanceof Error ? e.message : sourceText("unableToCompleteTheAction");

export function ManagementButton({
  label,
  onPress,
  disabled = false,
  primary = false,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
  accessibilityLabel?: string;
}) {
  "use no memo";
  useLocaleVersion();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={translateText(accessibilityLabel)}
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        primary && s.primary,
        (disabled || pressed) && s.dim,
      ]}
    >
      <Text style={[s.buttonText, primary && s.white]}>{label}</Text>
    </Pressable>
  );
}
function Checkbox({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={translateText(label)}
      accessibilityState={{ checked, disabled }}
      aria-checked={checked}
      disabled={disabled}
      onPress={onChange}
      style={[s.checkTarget, disabled && s.dim]}
    >
      <View style={[s.check, checked && s.checked]}>
        {checked && <Ionicons name="checkmark" size={18} color="#FFF" />}
      </View>
    </Pressable>
  );
}
type ManagementProps = {
  onDirtyChange: (dirty: boolean) => void;
  onEmployees: () => void;
};
type Confirmation =
  | { kind: "update"; previous: Role; next: Role }
  | { kind: "deleteRole"; item: Role }
  | { kind: "deletePosition"; item: Position };

export default function CompanyManagement({
  onDirtyChange,
  onEmployees,
}: ManagementProps) {
  "use no memo";
  useLocaleVersion();
  const { user, token, ready } = useAuth();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [confirmError, setConfirmError] = useState("");
  const [tableWidth, setTableWidth] = useState(0);
  const [data, setData] = useState<Management | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Role>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const busyRef = useRef(false);
  const [form, setForm] = useState<Form | null>(null);
  const [initial, setInitial] = useState("");
  const [modalError, setModalError] = useState("");
  const [discard, setDiscard] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const hasChanges =
    !!data?.roles.some(
      (role) => drafts[role.id] && !equalRole(role, drafts[role.id]),
    ) ||
    (form !== null && JSON.stringify(form) !== initial);
  useEffect(() => {
    onDirtyChange(hasChanges);
  }, [hasChanges, onDirtyChange]);
  useEffect(() => {
    let active = true;
    setData(null);
    setDrafts({});
    setError("");
    setForm(null);
    if (
      !ready ||
      !token ||
      !["COMPANY", "EMPLOYEE"].includes(user?.accountType || "")
    )
      return;
    setLoading(true);
    authRequest<Management>("/company-management", undefined, token)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        if (active) setError(message(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [ready, token, user?.accountType, revision]);
  async function run(key: string, action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(key);
    setNotice("");
    try {
      await action();
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  }
  function open(value: Form) {
    if (busyRef.current) return;
    setForm(value);
    setInitial(JSON.stringify(value));
    setModalError("");
    setDiscard(false);
  }
  function close() {
    if (busyRef.current) return;
    setForm(null);
    setDiscard(false);
    setModalError("");
  }
  function requestClose() {
    if (busyRef.current) return;
    if (JSON.stringify(form) !== initial) setDiscard(true);
    else close();
  }
  async function updateRole(role: Role) {
    if (!token) return;
    await run(role.id, async () => {
      try {
        const saved = await authRequest<Role>(
          `/company-management/roles/${role.id}`,
          {
            name: role.name,
            version: role.version,
            permissions: role.permissions,
          },
          token,
        );
        setData(
          (old) =>
            old && {
              ...old,
              roles: old.roles.map((item) =>
                item.id === saved.id ? saved : item,
              ),
              members: old.members.map((item) =>
                item.roleId === saved.id
                  ? { ...item, roleName: saved.name }
                  : item,
              ),
            },
        );
        setDrafts((old) => {
          const next = { ...old };
          delete next[role.id];
          return next;
        });
        setConfirmation(null);
        setNotice(sourceFormat("updated_927", { v0: saved.name }, []));
      } catch (e) {
        setConfirmError(message(e));
      }
    });
  }
  function openConfirmation(value: Confirmation) {
    setConfirmError("");
    setConfirmation(value);
  }
  async function confirmChange() {
    if (!confirmation || !token) return;
    setConfirmError("");
    if (confirmation.kind === "update") {
      await updateRole(confirmation.next);
      return;
    }
    const { kind, item } = confirmation;
    await run(item.id, async () => {
      try {
        const collection = kind === "deleteRole" ? "roles" : "positions";
        await authRequest(
          `/company-management/${collection}/${item.id}/delete`,
          { version: item.version },
          token,
        );
        setData(
          (old) =>
            old && {
              ...old,
              roles:
                kind === "deleteRole"
                  ? old.roles.filter((role) => role.id !== item.id)
                  : old.roles,
              positions:
                kind === "deletePosition"
                  ? old.positions.filter((position) => position.id !== item.id)
                  : old.positions,
            },
        );
        setConfirmation(null);
        setNotice(sourceFormat("deleted_928", { v0: item.name }, []));
      } catch (cause) {
        setConfirmError(message(cause));
      }
    });
  }
  async function saveForm() {
    if (!form || !token) return;
    if (form.kind !== "member" && !form.name.trim()) {
      setModalError(sourceText("enterAName"));
      return;
    }
    await run("modal", async () => {
      setModalError("");
      try {
        if (form.kind === "role") {
          const result = await authRequest<Role>(
            "/company-management/roles",
            {
              name: form.name.trim(),
              permissions: form.permissions,
              version: 0,
            },
            token,
          );
          setData((old) => old && { ...old, roles: [...old.roles, result] });
        } else if (form.kind === "position") {
          const result = await authRequest<Position>(
            `/company-management/positions${form.id ? "/" + form.id : ""}`,
            { name: form.name.trim(), version: form.version },
            token,
          );
          setData(
            (old) =>
              old && {
                ...old,
                positions: form.id
                  ? old.positions.map((item) =>
                      item.id === result.id ? result : item,
                    )
                  : [...old.positions, result],
                members: old.members.map((item) =>
                  item.positionId === result.id
                    ? { ...item, positionName: result.name }
                    : item,
                ),
              },
          );
        } else {
          const result = await authRequest<Member>(
            `/company-management/members/${form.member.id}`,
            {
              roleId: form.roleId || null,
              positionId: form.positionId || null,
              version: form.member.version,
            },
            token,
          );
          setData(
            (old) =>
              old && {
                ...old,
                members: old.members.map((item) =>
                  item.id === result.id ? result : item,
                ),
              },
          );
        }
        setForm(null);
        setDiscard(false);
        setNotice(sourceText("saved"));
      } catch (e) {
        setModalError(message(e));
      }
    });
  }
  function setRoleDraft(role: Role, patch: Partial<Role>) {
    setDrafts((old) => ({ ...old, [role.id]: { ...role, ...patch } }));
  }
  if (!ready || loading)
    return (
      <Panel>
        <BodyText>{tText("loadingEmployeesAndPermissions")}</BodyText>
      </Panel>
    );
  if (!data)
    return (
      <Panel>
        {!!error && (
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
        )}
        <BodyText>
          {tText("employeeOrPermissionManagementAccessIsRequired")}
        </BodyText>
        {token && (
          <View style={s.actions}>
            <ManagementButton
              label={tText("reload")}
              onPress={() => setRevision((value) => value + 1)}
            />
          </View>
        )}
      </Panel>
    );
  const isCompanyOwner = user?.accountType === "COMPANY";
  const roleManagementLevel = isCompanyOwner
    ? 3
    : (data.permissions?.roles ?? 0);
  const employeeManagementLevel = isCompanyOwner
    ? 3
    : (data.permissions?.employees ?? 0);
  const canManageRoles = roleManagementLevel >= 2;
  const canManageEmployees = employeeManagementLevel >= 2;
  const showRoles = roleManagementLevel >= 1;
  const showPositions = employeeManagementLevel >= 1;
  const narrowTable = tableWidth < 540;
  const roleWidth = narrowTable ? 108 : 168;
  const actionWidth = narrowTable ? 78 : 108;
  const members = data.members.filter((item) =>
    `${item.displayName} ${item.employeeNumber || ""}`
      .normalize("NFKC")
      .toLowerCase()
      .includes(query.normalize("NFKC").toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(members.length / Number(pageSize))),
    current = Math.min(page, pages);
  const shown = members.slice(
    (current - 1) * Number(pageSize),
    current * Number(pageSize),
  );
  const pager = (
    <View style={s.pager}>
      <ManagementButton
        label={tText("previous")}
        disabled={current === 1}
        onPress={() => setPage(current - 1)}
      />
      <Text>
        {current} / {pages} {tText("page")}
        {members.length}
        {tText("total_199")}
      </Text>
      <ManagementButton
        label={tText("next")}
        disabled={current === pages}
        onPress={() => setPage(current + 1)}
      />
    </View>
  );
  return (
    <>
      {!!notice && (
        <Text accessibilityLiveRegion="polite" style={s.success}>
          {notice}
        </Text>
      )}
      <Panel>
        <View style={s.header}>
          <SectionTitle>{tText("employeeList_932")}</SectionTitle>
          {showPositions && (
            <ManagementButton
              label={tText("employeeManagement")}
              onPress={onEmployees}
            />
          )}
        </View>
        <View style={s.controls}>
          <AppInput
            label={tText("searchByNameOrEmployeeId")}
            containerStyle={s.search}
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              setPage(1);
            }}
          />
          <AppSelect
            label={tText("itemsPerPage")}
            containerStyle={s.pageSize}
            value={pageSize}
            onValueChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
            options={["10", "20", "50"].map((value) => ({
              value,
              label: value + sourceText("total_199"),
            }))}
          />
        </View>
        <ScrollView horizontal>
          <View style={s.memberTable}>
            <View style={[s.tableRow, s.heading]}>
              {[
                sourceText("employee"),
                sourceText("position"),
                sourceText("role"),
                sourceText("lastLogin"),
                sourceText("actions"),
              ].map((text, index) => (
                <Text key={text} style={[s.cell, index === 0 && s.personCell]}>
                  {text}
                </Text>
              ))}
            </View>
            {shown.map((member) => (
              <View key={member.id} style={s.tableRow}>
                <View style={[s.cell, s.personCell]}>
                  <Text localize={false} style={s.memberName}>
                    {member.displayName}
                  </Text>
                  <Text localize={false} style={s.meta}>
                    {member.employeeNumber || tText("noEmployeeId")}
                    {"\n"}
                    {member.email}
                  </Text>
                </View>
                <Text style={s.cell}>
                  {member.positionName || sourceText("notConfigured")}
                </Text>
                <Text style={s.cell}>
                  {member.roleName || sourceText("individualPermissions")}
                </Text>
                <Text style={s.cell}>
                  {member.lastLoginAt
                    ? new Date(member.lastLoginAt).toLocaleString(localeTag())
                    : sourceText("neverLoggedIn")}
                </Text>
                <View style={s.cell}>
                  {(canManageRoles || canManageEmployees) && (
                    <ManagementButton
                      label={tText("edit")}
                      disabled={!!busy}
                      onPress={() =>
                        open({
                          kind: "member",
                          member,
                          roleId: member.roleId || "",
                          positionId: member.positionId || "",
                        })
                      }
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {!shown.length && (
          <BodyText>
            {query
              ? sourceText("noEmployeesMatchYourSearch_940")
              : sourceText("noEmployeesHaveBeenRegistered_941")}
          </BodyText>
        )}
        {pager}
      </Panel>
      {showPositions && (
        <Panel>
          <View style={s.header}>
            <SectionTitle>{tText("positionList")}</SectionTitle>
            {canManageEmployees && (
              <ManagementButton
                label={tText("create")}
                primary
                disabled={!!busy}
                onPress={() => open({ kind: "position", name: "", version: 0 })}
              />
            )}
          </View>
          {!data.positions.length && (
            <BodyText>{tText("noPositionsHaveBeenRegistered")}</BodyText>
          )}
          {data.positions.map((position) => (
            <View key={position.id} style={s.positionRow}>
              <Text style={s.memberName}>{position.name}</Text>
              <View style={s.actions}>
                {canManageEmployees && (
                  <ManagementButton
                    label={sourceFormat("edit_944", { v0: position.name }, [])}
                    disabled={!!busy}
                    onPress={() => open({ kind: "position", ...position })}
                  />
                )}
                {employeeManagementLevel === 3 && (
                  <ManagementButton
                    label={tText("delete")}
                    disabled={!!busy}
                    onPress={() =>
                      openConfirmation({
                        kind: "deletePosition",
                        item: position,
                      })
                    }
                  />
                )}
              </View>
            </View>
          ))}
        </Panel>
      )}
      {showRoles && (
        <Panel>
          <View style={s.header}>
            <SectionTitle>{tText("roleList")}</SectionTitle>
            {canManageRoles && (
              <ManagementButton
                label={tText("createRole")}
                primary
                disabled={!!busy}
                onPress={() =>
                  open({
                    kind: "role",
                    name: "",
                    permissions: { ...noPermissions },
                  })
                }
              />
            )}
          </View>
          <BodyText>{tText("ownerIsAFixedRoleAutomaticallyApplied")}</BodyText>
          {canManageRoles && !data.roles.some((role) => !role.fixed) && (
            <BodyText>{tText("thereAreNoEditableRolesUseCreate")}</BodyText>
          )}
          <BodyText>
            {tText("scrollHorizontallyInTheMiddleToConfigure")}
          </BodyText>
          <View
            style={s.fixedTable}
            onLayout={(event) => setTableWidth(event.nativeEvent.layout.width)}
          >
            <View style={[s.fixedColumn, { width: roleWidth }]}>
              <View style={[s.roleHeader, s.leftCell]}>
                <Text style={s.tableLabel}>{tText("roleName")}</Text>
              </View>
              {data.roles.map((original) => {
                const role = drafts[original.id] || original;
                return (
                  <View
                    key={role.id}
                    style={[
                      s.roleCell,
                      s.leftCell,
                      !equalRole(role, original) && s.changed,
                    ]}
                  >
                    {role.fixed ? (
                      <Text style={[s.memberName, s.centerText]}>
                        {role.name}
                        {tText("fixed")}
                      </Text>
                    ) : (
                      <AppInput
                        accessibilityLabel={translateText(
                          sourceFormat(
                            "roleNameFor",
                            { v0: original.name },
                            [],
                          ),
                        )}
                        value={role.name}
                        maxLength={100}
                        style={s.centerText}
                        editable={canManageRoles && !busy}
                        onChangeText={(name) => setRoleDraft(role, { name })}
                      />
                    )}
                  </View>
                );
              })}
            </View>
            <ScrollView
              horizontal
              style={s.permissionScroll}
              showsHorizontalScrollIndicator
            >
              <View>
                <View style={[s.roleHeader, s.permissionRow]}>
                  {permissionColumns.map(([key, label]) => (
                    <Text key={key} style={[s.permissionCell, s.tableLabel]}>
                      {label}
                    </Text>
                  ))}
                  <Text style={[s.permissionCell, s.tableLabel]}>
                    {tText("scout")}
                  </Text>
                </View>
                {data.roles.map((original) => {
                  const role = drafts[original.id] || original;
                  const disabled = !canManageRoles || !!busy;
                  return (
                    <View
                      key={role.id}
                      style={[
                        s.roleCell,
                        s.permissionRow,
                        !equalRole(role, original) && s.changed,
                      ]}
                    >
                      {permissionColumns.map(([key, label]) => (
                        <View key={key} style={s.permissionCell}>
                          {role.fixed ? (
                            <Text style={s.tableLabel}>
                              {levelLabel(role.permissions[key])}
                            </Text>
                          ) : (
                            <AppSelect
                              align="center"
                              accessibilityLabel={translateText(
                                `${original.name}：${translateText(label)}`,
                              )}
                              value={String(role.permissions[key])}
                              options={permissionOptions}
                              disabled={disabled}
                              onValueChange={(value) =>
                                setRoleDraft(role, {
                                  permissions: {
                                    ...role.permissions,
                                    [key]: Number(value) as PermissionLevel,
                                  },
                                })
                              }
                            />
                          )}
                        </View>
                      ))}
                      <View style={s.permissionCell}>
                        {role.fixed ? (
                          <Text style={s.tableLabel}>
                            {role.permissions.scout
                              ? sourceText("allow")
                              : sourceText("noAccess")}
                          </Text>
                        ) : (
                          <Checkbox
                            label={sourceFormat(
                              "scouts",
                              { v0: original.name },
                              [],
                            )}
                            checked={role.permissions.scout}
                            disabled={disabled}
                            onChange={() =>
                              setRoleDraft(role, {
                                permissions: {
                                  ...role.permissions,
                                  scout: !role.permissions.scout,
                                },
                              })
                            }
                          />
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            <View style={[s.fixedColumn, { width: actionWidth }]}>
              <View style={[s.roleHeader, s.operationCell]}>
                <Text style={s.tableLabel}>{tText("actions")}</Text>
              </View>
              {data.roles.map((original) => {
                const role = drafts[original.id] || original;
                const dirty = !equalRole(role, original);
                return (
                  <View
                    key={role.id}
                    style={[s.roleCell, s.operationCell, dirty && s.changed]}
                  >
                    {role.fixed ? (
                      <Text style={s.tableLabel}>－</Text>
                    ) : (
                      <View
                        style={[s.roleActions, narrowTable && s.stackedActions]}
                      >
                        <AppIconButton
                          icon="save-outline"
                          label={sourceFormat(
                            "update",
                            { v0: original.name },
                            [],
                          )}
                          tooltip={tText("reviewChangesAndUpdate")}
                          disabled={
                            !canManageRoles ||
                            !!busy ||
                            !dirty ||
                            !role.name.trim()
                          }
                          onPress={() =>
                            openConfirmation({
                              kind: "update",
                              previous: original,
                              next: role,
                            })
                          }
                        />
                        {roleManagementLevel === 3 && (
                          <AppIconButton
                            icon="trash-outline"
                            tone="danger"
                            label={sourceFormat(
                              "delete_591",
                              { v0: original.name },
                              [],
                            )}
                            tooltip={tText("deleteRole")}
                            disabled={!!busy || dirty}
                            onPress={() =>
                              openConfirmation({
                                kind: "deleteRole",
                                item: original,
                              })
                            }
                          />
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
          <BodyText>
            {tText("assignedPostingPermissionsApplyOnlyToPostings")}
          </BodyText>
        </Panel>
      )}
      <Modal
        transparent
        visible={confirmation !== null}
        animationType="fade"
        onRequestClose={() => {
          if (!busy) setConfirmation(null);
        }}
      >
        <View style={s.backdrop}>
          <View style={s.modal} accessibilityViewIsModal>
            <Text accessibilityRole="header" style={s.title}>
              {confirmation?.kind === "update"
                ? sourceText("reviewChanges")
                : sourceText("confirmDeletion_961")}
            </Text>
            <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={s.stack}>
              {!!confirmError && (
                <Text accessibilityRole="alert" style={s.error}>
                  {confirmError}
                </Text>
              )}
              {confirmation?.kind === "update" ? (
                <>
                  <BodyText>
                    {confirmation.previous.name}
                    {tText("changes")}
                  </BodyText>
                  {confirmation.previous.name !== confirmation.next.name && (
                    <Text>
                      {tText("roleName")}
                      {confirmation.previous.name} →{" "}
                      {confirmation.next.name.trim()}
                    </Text>
                  )}
                  {permissionColumns
                    .filter(
                      ([key]) =>
                        confirmation.previous.permissions[key] !==
                        confirmation.next.permissions[key],
                    )
                    .map(([key, label]) => (
                      <View key={key}>
                        <Text style={s.memberName}>{label}</Text>
                        <Text>
                          {levelLabel(confirmation.previous.permissions[key])} →{" "}
                          {levelLabel(confirmation.next.permissions[key])}
                        </Text>
                      </View>
                    ))}
                  {confirmation.previous.permissions.scout !==
                    confirmation.next.permissions.scout && (
                    <Text>
                      {tText("scout")}
                      {confirmation.previous.permissions.scout
                        ? sourceText("allow")
                        : sourceText("noAccess")}{" "}
                      →{" "}
                      {confirmation.next.permissions.scout
                        ? sourceText("allow")
                        : sourceText("noAccess")}
                    </Text>
                  )}
                </>
              ) : (
                confirmation && (
                  <BodyText>
                    {confirmation.item.name}
                    {tText("deleteThisItem")}
                  </BodyText>
                )
              )}
            </ScrollView>
            <View style={s.footer}>
              <ManagementButton
                label={tText("cancel")}
                disabled={!!busy}
                onPress={() => setConfirmation(null)}
              />
              <ManagementButton
                label={
                  busy
                    ? sourceText("processing")
                    : confirmation?.kind === "update"
                      ? sourceText("update_964")
                      : sourceText("delete_965")
                }
                primary
                disabled={!!busy}
                onPress={() => void confirmChange()}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        animationType="fade"
        visible={!!form}
        onRequestClose={() => (discard ? setDiscard(false) : requestClose())}
      >
        <View style={s.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel={tText("closeEditor_966")}
            disabled={!!busy}
            onPress={requestClose}
          />
          <View
            style={s.modal}
            accessibilityViewIsModal
            importantForAccessibility={discard ? "no-hide-descendants" : "auto"}
          >
            <View style={s.header}>
              <Text accessibilityRole="header" style={s.title}>
                {form?.kind === "role"
                  ? sourceText("createRole")
                  : form?.kind === "position"
                    ? form.id
                      ? sourceText("editPosition")
                      : sourceText("createPosition")
                    : sourceText("editEmployeePositionAndRole")}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={tText("close")}
                style={s.close}
                disabled={!!busy}
                onPress={requestClose}
              >
                <Ionicons name="close" size={28} color="#183455" />
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={s.stack}
            >
              {!!modalError && (
                <Text accessibilityRole="alert" style={s.error}>
                  {modalError}
                </Text>
              )}
              {form?.kind === "member" ? (
                <>
                  <Text localize={false} style={s.memberName}>
                    {form.member.displayName}
                  </Text>
                  <BodyText localize={false}>{form.member.email}</BodyText>
                  <AppSelect
                    label={tText("position")}
                    value={form.positionId}
                    disabled={!canManageEmployees || !!busy}
                    options={[
                      { value: "", label: sourceText("notConfigured") },
                      ...data.positions.map((p) => ({
                        value: p.id,
                        label: p.name,
                      })),
                    ]}
                    onValueChange={(positionId) =>
                      setForm({ ...form, positionId })
                    }
                  />
                  <AppSelect
                    label={tText("role")}
                    value={form.roleId}
                    disabled={!canManageRoles || !!busy}
                    options={[
                      {
                        value: "",
                        label: sourceText("individualPermissionsNoRole"),
                      },
                      ...data.roles
                        .filter((r) => !r.fixed)
                        .map((r) => ({ value: r.id, label: r.name })),
                    ]}
                    onValueChange={(roleId) => setForm({ ...form, roleId })}
                  />
                  <BodyText>{tText("aRoleChangeTakesEffectOnThe")}</BodyText>
                </>
              ) : (
                form && (
                  <>
                    <AppInput
                      label={
                        form.kind === "role"
                          ? sourceText("roleName")
                          : sourceText("positionName")
                      }
                      required
                      autoFocus
                      value={form.name}
                      maxLength={100}
                      editable={!busy}
                      onChangeText={(name) => setForm({ ...form, name })}
                    />
                    {form.kind === "role" && (
                      <>
                        {permissionColumns.map(([key, label]) => (
                          <AppSelect
                            key={key}
                            label={label}
                            value={String(form.permissions[key])}
                            options={permissionOptions}
                            disabled={!!busy}
                            onValueChange={(value) =>
                              setForm({
                                ...form,
                                permissions: {
                                  ...form.permissions,
                                  [key]: Number(value) as PermissionLevel,
                                },
                              })
                            }
                          />
                        ))}
                        <View style={s.header}>
                          <Text>{tText("scout")}</Text>
                          <Checkbox
                            label={tText("scout")}
                            checked={form.permissions.scout}
                            disabled={!!busy}
                            onChange={() =>
                              setForm({
                                ...form,
                                permissions: {
                                  ...form.permissions,
                                  scout: !form.permissions.scout,
                                },
                              })
                            }
                          />
                        </View>
                      </>
                    )}
                  </>
                )
              )}
            </ScrollView>
            <View style={s.footer}>
              <ManagementButton
                label={tText("cancel")}
                disabled={!!busy}
                onPress={requestClose}
              />
              <ManagementButton
                label={
                  busy === "modal"
                    ? sourceText("saving")
                    : sourceText("save_384")
                }
                primary
                disabled={!!busy}
                onPress={() => void saveForm()}
              />
            </View>
          </View>
          {discard && (
            <View style={s.confirmBackdrop}>
              <View style={s.confirm} accessibilityViewIsModal>
                <Text accessibilityRole="header" style={s.title}>
                  {tText("discardYourChanges")}
                </Text>
                <BodyText>{tText("discardUnsavedChangesAndClose")}</BodyText>
                <View style={s.footer}>
                  <ManagementButton
                    label={tText("continueEditing")}
                    onPress={() => setDiscard(false)}
                  />
                  <ManagementButton
                    label={tText("discardAndClose")}
                    onPress={close}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}
const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-end",
  },
  search: { width: 300, maxWidth: "100%" },
  pageSize: { width: 110 },
  actions: { flexDirection: "row", gap: 10 },
  button: {
    minHeight: 44,
    minWidth: 84,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1857B4",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 13, fontWeight: "700", color: "#1857B4" },
  primary: { backgroundColor: "#1857B4" },
  white: { color: "#FFF" },
  dim: { opacity: 0.45 },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#DCE5EF",
  },
  heading: { backgroundColor: "#F1F5FA" },
  memberTable: { minWidth: 920 },
  cell: { width: 150, padding: 10, color: "#183455", fontSize: 13 },
  personCell: { width: 320 },
  memberName: {
    color: "#183455",
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  meta: { color: "#64748B", fontSize: 12, lineHeight: 20 },
  positionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  fixedTable: {
    flexDirection: "row",
    minWidth: 0,
    borderWidth: 1,
    borderColor: "#DCE5EF",
    borderRadius: 8,
    overflow: "hidden",
  },
  fixedColumn: { flexShrink: 0, backgroundColor: "#FFF" },
  permissionScroll: { flex: 1, minWidth: 0 },
  roleHeader: {
    height: 56,
    backgroundColor: "#F1F5FA",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#DCE5EF",
  },
  roleCell: {
    height: 112,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#DCE5EF",
    backgroundColor: "#FFF",
  },
  changed: { backgroundColor: "#FFF3BF" },
  leftCell: {
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderColor: "#DCE5EF",
  },
  operationCell: {
    paddingHorizontal: 6,
    gap: 4,
    borderLeftWidth: 1,
    borderColor: "#DCE5EF",
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  permissionCell: { width: 184, paddingHorizontal: 8 },
  tableLabel: {
    color: "#183455",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  centerText: { textAlign: "center" },
  roleActions: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  stackedActions: { flexDirection: "column" },
  checkTarget: {
    alignSelf: "center",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#7890AA",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: { borderColor: "#1857B4", backgroundColor: "#1857B4" },
  pending: { fontSize: 11, color: "#875E00", fontWeight: "700" },
  rowError: { fontSize: 13, color: "#B42318", padding: 12 },
  error: { color: "#B42318", fontSize: 13 },
  success: { color: "#187344" },
  pager: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,.4)",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    maxWidth: 600,
    maxHeight: "90%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#FFF",
    gap: 14,
  },
  close: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 17, fontWeight: "700", color: "#183455", flexShrink: 1 },
  stack: { gap: 14, paddingBottom: 12 },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
    paddingTop: 12,
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,.5)",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  confirm: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 22,
    gap: 16,
  },
});
