import { HrButton as AppButton } from "./shared";
import { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { Text, Pressable } from "@/i18n/native";
import { tText, useLocaleVersion } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import AppPage from "@/components/layout/AppPage";
import { useAuth } from "@/auth/AuthProvider";
import { dataRequest } from "@/api/platform";
import { useResource, ResourceStatus } from "@/api/useResource";
import { ConfirmAction } from "@/api/ApiUI";
import { AppSelect } from "@/components/form";
import { Panel, SectionTitle, BodyText } from "@/components/ui/AppUI";
import { hs, ActionStatus, useHrAction, kindLabel } from "./shared";
import { uploadPdf, downloadPrivate } from "./files";
type Doc = {
  id: string;
  kind: string;
  taxYear: number | null;
  fileName: string;
  createdAt: string;
};
export default function PersonalDocumentsPage() {
  "use no memo";
  useLocaleVersion();
  const { token, user } = useAuth();
  const { width } = useWindowDimensions();
  const [kind, setKind] = useState("RESUME"),
    [selected, setSelected] = useState<string | null>(null);
  const thisYear = Number(
    new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" })
      .format(new Date())
      .slice(0, 4),
  );
  const [year, setYear] = useState(String(thisYear));
  const action = useHrAction();
  const docs = useResource<Doc[]>("/personal-documents", [], true),
    targets = useResource<{ id: string; company: string; title: string }[]>(
      "/personal-documents/targets",
      [],
      true,
    ),
    grants = useResource<{ interactionId: string; company: string }[]>(
      selected ? `/personal-documents/${selected}/grants` : null,
      [],
      true,
    );
  return (
    <AppPage
      title={tText("hrPersonalDocuments")}
      subtitle=""
      role="user"
      activeMenu={sourceText("hrPersonalDocuments")}
    >
      <ActionStatus {...action} />
      <ResourceStatus
        loading={docs.loading}
        error={docs.error || targets.error}
        onRetry={() => {
          docs.refresh();
          targets.refresh();
        }}
        privateData
      />
      {user?.accountType !== "GENERAL" ? (
        <BodyText>{tText("hrGeneralOnly")}</BodyText>
      ) : (
        <>
          <Panel style={hs.card}>
            <SectionTitle>{tText("hrPersonalDocuments")}</SectionTitle>
            <BodyText>{tText("hrShareNote")}</BodyText>
            <View style={hs.row}>
              <View style={{ width: 200 }}>
                <AppSelect
                  label={tText("hrDocumentKind")}
                  value={kind}
                  onValueChange={setKind}
                  options={["RESUME", "CAREER", "WITHHOLDING"].map((v) => ({
                    value: v,
                    label: kindLabel(v),
                  }))}
                />
              </View>
              {kind === "WITHHOLDING" && (
                <View style={{ width: 160 }}>
                  <AppSelect
                    label={tText("hrTaxYear")}
                    value={year}
                    onValueChange={setYear}
                    options={[thisYear, thisYear - 1].map((v) => ({
                      value: String(v),
                      label: String(v),
                    }))}
                  />
                </View>
              )}
              <AppButton
                label={tText("hrUploadPdf")}
                disabled={action.busy || !token}
                onPress={() =>
                  void action.run(() =>
                    uploadPdf(
                      "/personal-documents",
                      token!,
                      kind === "WITHHOLDING" ? { kind, year } : { kind },
                    ),
                  )
                }
              />
            </View>
            <Text style={hs.muted}>{tText("hrPdfLimit")}</Text>
          </Panel>
          <View style={width >= 1100 ? hs.split : { gap: 16 }}>
            <View style={width >= 1100 ? hs.left : { gap: 10 }}>
              {docs.data.map((doc) => (
                <Pressable
                  accessibilityRole="button"
                  key={doc.id}
                  accessibilityState={{ selected: selected === doc.id }}
                  style={[hs.item, selected === doc.id && hs.selected]}
                  onPress={() => setSelected(doc.id)}
                >
                  <Text>
                    {kindLabel(doc.kind)} {doc.taxYear || ""}
                  </Text>
                  <Text localize={false}>{doc.fileName}</Text>
                  <View style={hs.row}>
                    <AppButton
                      outline
                      label={tText("hrDownload")}
                      disabled={action.busy}
                      onPress={() =>
                        void action.run(() =>
                          downloadPrivate(
                            `/personal-documents/${doc.id}/file`,
                            token!,
                            doc.fileName,
                          ),
                        )
                      }
                    />
                    <ConfirmAction
                      ButtonComponent={AppButton}
                      danger
                      label={tText("hrDelete")}
                      message={tText("hrDeleteDocumentNote")}
                      onConfirm={async () => {
                        await dataRequest(
                          `/personal-documents/${doc.id}`,
                          token,
                          undefined,
                          "DELETE",
                        );
                        if (selected === doc.id) setSelected(null);
                      }}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
            <View style={width >= 1100 ? hs.right : { gap: 14 }}>
              <Panel style={hs.card}>
                <SectionTitle>{tText("hrShareCompanies")}</SectionTitle>
                <BodyText>{tText("hrLatestShareNote")}</BodyText>
                <BodyText>{tText("hrRetentionNote")}</BodyText>
                {!selected ? (
                  <BodyText>{tText("hrSelectDocument")}</BodyText>
                ) : (
                  <>
                    <ResourceStatus
                      loading={grants.loading}
                      error={grants.error}
                      onRetry={grants.refresh}
                    />
                    {targets.data.map((target) => {
                      const allow = grants.data.some(
                        (g) => g.interactionId === target.id,
                      );
                      return (
                        <View key={target.id} style={hs.item}>
                          <Text localize={false}>
                            {target.company} ／ {target.title}
                          </Text>
                          <ConfirmAction
                            ButtonComponent={AppButton}
                            label={tText(allow ? "hrRevoke" : "hrGrant")}
                            danger={allow}
                            message={tText(
                              allow ? "hrRevokeConfirm" : "hrGrantConfirm",
                            )}
                            onConfirm={() =>
                              dataRequest(
                                `/personal-documents/${selected}/grants/${target.id}`,
                                token,
                                { allow: !allow },
                                "PUT",
                              )
                            }
                          />
                        </View>
                      );
                    })}
                    {!targets.data.length && (
                      <BodyText>{tText("hrNoShareTargets")}</BodyText>
                    )}
                  </>
                )}
              </Panel>
            </View>
          </View>
        </>
      )}
    </AppPage>
  );
}
