import { HrButton as AppButton } from "./shared";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "@/i18n/native";
import { tText, useLocaleVersion } from "@/i18n/display";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { Panel, BodyText } from "@/components/ui/AppUI";
import { hs, useHrAction, ActionStatus, kindLabel } from "./shared";
import { downloadPrivate } from "./files";
export function SharedDocumentsPanel({ interaction }: { interaction: string }) {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const r = useResource<
    { id: string; kind: string; fileName: string; taxYear: number | null }[]
  >(open ? `/company-shared-documents/${interaction}` : null, [], true);
  const action = useHrAction();
  return (
    <Panel style={hs.card}>
      <AppButton
        outline
        label={tText("hrSharedDocuments")}
        onPress={() => setOpen((v) => !v)}
      />
      {open && (
        <>
          <ResourceStatus
            loading={r.loading}
            error={r.error}
            onRetry={r.refresh}
          />
          <ActionStatus {...action} />
          {r.data.map((doc) => (
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
                      `/company-shared-documents/${interaction}/${doc.id}`,
                      token!,
                      doc.fileName,
                    ),
                  )
                }
              />
            </View>
          ))}
          {!r.data.length && !r.loading && !r.error && (
            <BodyText>{tText("hrNoSharedDocuments")}</BodyText>
          )}
        </>
      )}
    </Panel>
  );
}
