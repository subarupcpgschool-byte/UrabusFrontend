import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { query, type Page } from "@/api/platform";
import { Pager } from "@/api/ApiUI";
import { AppCheckbox, AppInput } from "@/components/form";
import { AppButton, BodyText } from "@/components/ui/AppUI";
import { tText, useLocaleVersion } from "@/i18n/display";
import type { Recruitment } from "./model";
export function RecruitmentPicker({
  selected,
  onChange,
}: {
  selected: Recruitment[];
  onChange: (next: Recruitment[]) => void;
}) {
  useLocaleVersion();
  const { token } = useAuth();
  const [search, setSearch] = useState(""),
    [q, setQ] = useState(""),
    [page, setPage] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);
  const r = useResource<Page<Recruitment>>(
    token
      ? "/company-dashboard/recruitments?" + query({ q, page, pageSize: 20 })
      : null,
    { items: [], total: 0, page: 1, pageSize: 20 },
    true,
  );
  return (
    <View style={{ gap: 12 }}>
      <View style={{ width: "100%", maxWidth: 340 }}>
        <AppInput
          label={tText("dashSearchJob")}
          value={search}
          maxLength={200}
          onChangeText={setSearch}
        />
      </View>
      <BodyText>
        {tText("dashSelectedJobs", { count: selected.length })}
      </BodyText>
      <ResourceStatus loading={r.loading} error={r.error} onRetry={r.refresh} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {selected.map((s) => (
          <AppButton
            key={s.id}
            label={s.title + " ×"}
            outline
            onPress={() =>
              onChange(selected.filter((item) => item.id !== s.id))
            }
          />
        ))}
      </View>
      {!r.loading && !r.error && !r.data.items.length && (
        <BodyText>{tText("dashNoJobs")}</BodyText>
      )}
      {r.data.items.map((item) => (
        <AppCheckbox
          key={item.id}
          label={
            item.title + (item.deleted ? ` (${tText("dashDeletedJob")})` : "")
          }
          checked={selected.some((s) => s.id === item.id)}
          disabled={
            selected.length >= 10 && !selected.some((s) => s.id === item.id)
          }
          onValueChange={(checked) =>
            onChange(
              checked
                ? [...selected, item]
                : selected.filter((s) => s.id !== item.id),
            )
          }
        />
      ))}
      <Pager page={page} total={r.data.total} onChange={setPage} />
    </View>
  );
}
