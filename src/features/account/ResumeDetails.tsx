import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { View } from "react-native";
import { BodyText, SectionTitle } from "@/components/ui/AppUI";
import type { ResumeRow } from "@/api/models";
export function ResumeDetails({ body }: { body: ResumeRow["body"] }) {
  "use no memo";
  useLocaleVersion();
  return (
    <View style={{ gap: 12 }}>
      {!!body.summary && <BodyText localize={false}>{body.summary}</BodyText>}
      {!!body.skills?.length && (
        <>
          <SectionTitle>{tText("skills")}</SectionTitle>
          <BodyText>{body.skills.join(" ／ ")}</BodyText>
        </>
      )}
      {body.employmentHistory?.map((j, i) => (
        <View key={i} style={{ gap: 5 }}>
          <SectionTitle localize={false}>{j.company}</SectionTitle>
          <BodyText>
            {j.position} ／ {j.startDate || sourceText("notEntered")}〜
            {j.endDate || sourceText("currentlyEmployed")}
          </BodyText>
          <BodyText localize={false}>{j.description}</BodyText>
        </View>
      ))}
      {body.education?.map((s, i) => (
        <View key={i}>
          <SectionTitle>{s.school}</SectionTitle>
          <BodyText>
            {s.department} ／ {s.graduatedAt || sourceText("notEntered")}
          </BodyText>
        </View>
      ))}
    </View>
  );
}
