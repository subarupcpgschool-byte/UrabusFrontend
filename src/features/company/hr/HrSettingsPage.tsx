import { HrButton as AppButton } from "./shared";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/i18n/native";
import { tText, useLocaleVersion } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import AppPage from "@/components/layout/AppPage";
import { useAuth } from "@/auth/AuthProvider";
import { dataRequest } from "@/api/platform";
import { useResource, ResourceStatus } from "@/api/useResource";
import { ConfirmAction } from "@/api/ApiUI";
import { AppInput, AppSelect } from "@/components/form";
import { Panel, SectionTitle, BodyText } from "@/components/ui/AppUI";
import { CompanyPermissionBoundary } from "../CompanyPermissionBoundary";
import { hs, ActionStatus, useHrAction } from "./shared";
import { emptySettings, type HrSettings, type Option } from "./models";
function Content() {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const r = useResource<HrSettings>(
    "/company-hr/settings",
    emptySettings,
    true,
  );
  const [role, setRole] = useState(""),
    [name, setName] = useState(""),
    [editing, setEditing] = useState<Option | null>(null);
  const action = useHrAction();
  useEffect(() => {
    setRole(r.data.settings.defaultRoleId);
  }, [r.data.settings.version, r.data.settings.defaultRoleId]);
  return (
    <AppPage
      title={tText("hrSettings")}
      subtitle=""
      role="company"
      activeMenu={sourceText("companyAndPermissions")}
    >
      <ActionStatus {...action} />
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      {!r.error && (
        <>
          <Panel style={hs.card}>
            <SectionTitle>{tText("hrDefaultRole")}</SectionTitle>
            <BodyText>{tText("hrDefaultRoleNote")}</BodyText>
            <AppSelect
              label={tText("hrRole")}
              value={role}
              onValueChange={setRole}
              options={r.data.roles.map((x) => ({
                value: x.id,
                label: x.name,
              }))}
            />
            {r.data.canSetDefaults && (
              <AppButton
                label={tText("hrSave")}
                disabled={action.busy || !role}
                onPress={() =>
                  void action.run(() =>
                    dataRequest(
                      "/company-hr/settings",
                      token,
                      { defaultRoleId: role, version: r.data.settings.version },
                      "PUT",
                    ),
                  )
                }
              />
            )}
          </Panel>
          <Panel style={hs.card}>
            <SectionTitle>{tText("hrDepartments")}</SectionTitle>
            <BodyText>{tText("hrDepartmentNote")}</BodyText>
            {r.data.departments.map((row) => (
              <View key={row.id} style={hs.row}>
                <Text localize={false} style={{ flex: 1 }}>
                  {row.name}
                </Text>
                {r.data.canWrite && (
                  <AppButton
                    outline
                    label={tText("hrEdit")}
                    onPress={() => {
                      setEditing(row);
                      setName(row.name);
                    }}
                  />
                )}
                {r.data.canDelete && (
                  <ConfirmAction
                    ButtonComponent={AppButton}
                    danger
                    label={tText("hrDelete")}
                    message={tText("hrDeleteConfirm")}
                    onConfirm={() =>
                      dataRequest(
                        `/company-hr/departments/${row.id}?version=${row.version}`,
                        token,
                        undefined,
                        "DELETE",
                      )
                    }
                  />
                )}
              </View>
            ))}
            {r.data.canWrite && (
              <>
                <AppInput
                  label={
                    editing
                      ? tText("hrEditDepartment")
                      : tText("hrAddDepartment")
                  }
                  value={name}
                  onChangeText={setName}
                />
                <View style={hs.row}>
                  <AppButton
                    label={tText("hrSave")}
                    disabled={action.busy || !name.trim()}
                    onPress={() =>
                      void action.run(async () => {
                        await dataRequest(
                          "/company-hr/departments" +
                            (editing ? "/" + editing.id : ""),
                          token,
                          { name, version: editing?.version || 0 },
                          editing ? "PUT" : "POST",
                        );
                        setName("");
                        setEditing(null);
                      })
                    }
                  />
                  {editing && (
                    <AppButton
                      outline
                      label={tText("cancel")}
                      onPress={() => {
                        setEditing(null);
                        setName("");
                      }}
                    />
                  )}
                </View>
              </>
            )}
          </Panel>
        </>
      )}
    </AppPage>
  );
}
export default function HrSettingsPage() {
  return (
    <CompanyPermissionBoundary
      permission="employees"
      title={sourceText("companyAndPermissions")}
    >
      <Content />
    </CompanyPermissionBoundary>
  );
}
