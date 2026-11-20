import { View } from "react-native";
import { BodyText, SectionTitle } from "@/components/ui/AppUI";
import type { ResumeRow } from "@/api/models";
export function ResumeDetails({ body }: { body: ResumeRow["body"] }) {
  return (
    <View style={{ gap: 12 }}>
      {!!body.summary && <BodyText>{body.summary}</BodyText>}
      {!!body.skills?.length && (
        <>
          <SectionTitle>スキル</SectionTitle>
          <BodyText>{body.skills.join(" ／ ")}</BodyText>
        </>
      )}
      {body.employmentHistory?.map((j, i) => (
        <View key={i} style={{ gap: 5 }}>
          <SectionTitle>{j.company}</SectionTitle>
          <BodyText>
            {j.position} ／ {j.startDate || "未記入"}〜{j.endDate || "在職中"}
          </BodyText>
          <BodyText>{j.description}</BodyText>
        </View>
      ))}
      {body.education?.map((s, i) => (
        <View key={i}>
          <SectionTitle>{s.school}</SectionTitle>
          <BodyText>
            {s.department} ／ {s.graduatedAt || "未記入"}
          </BodyText>
        </View>
      ))}
    </View>
  );
}
