import { translateText } from "@/i18n/display";
import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { INPUT_THEME as T } from "@/theme/inputTheme";
import { AppFormField, type FieldProps } from "./AppFormField";

const weekdays = [
  sourceText("sun"),
  sourceText("mon"),
  sourceText("tue"),
  sourceText("wed"),
  sourceText("thu"),
  sourceText("fri"),
  sourceText("sat"),
];

function dateKey(year: number, month: number, day: number) {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

export function AppDatePicker({
  value,
  onValueChange,
  disabled = false,
  ...field
}: FieldProps & {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) {
  "use no memo";
  useLocaleVersion();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(0);
  const [yearMode, setYearMode] = useState(false);
  const [yearPage, setYearPage] = useState(0);
  const year = Math.floor(month / 12);
  const calendarMonth = (month % 12) + 1;
  const close = () => setOpen(false);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  function show() {
    const today = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Tokyo",
    }).format();
    const [y, m] = (
      /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/.test(value) && !value.startsWith("0000")
        ? value
        : today
    )
      .split("-")
      .map(Number);
    setMonth(y * 12 + m - 1);
    setYearMode(false);
    setOpen(true);
  }

  function choose(date: string) {
    onValueChange(date);
    close();
  }

  // UTC calendar arithmetic keeps displayed dates independent of device timezone.
  const first = new Date(0);
  first.setUTCFullYear(year, calendarMonth - 1, 1);
  const offset = first.getUTCDay();
  const last = new Date(first);
  last.setUTCMonth(calendarMonth, 0);
  const days = last.getUTCDate();
  const name = field.label ?? sourceText("date");

  return (
    <AppFormField {...field}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={translateText(name)}
        accessibilityValue={{ text: value || sourceText("notSelected_600") }}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={show}
        style={[s.control, field.error && s.error, disabled && s.disabled]}
      >
        <Text style={[s.text, !value && s.placeholder]}>
          {value || sourceText("selectFromCalendar")}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={T.textColor} />
      </Pressable>
      <Modal
        transparent
        visible={open && !disabled}
        animationType="fade"
        onRequestClose={close}
      >
        <View style={s.backdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tText("cancelDateSelection")}
            onPress={close}
            style={StyleSheet.absoluteFill}
          />
          <View accessibilityViewIsModal style={s.dialog}>
            <View style={s.row}>
              <Text accessibilityRole="header" style={[s.text, s.heading]}>
                {name}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={tText("close")}
                onPress={close}
                style={s.close}
              >
                <Ionicons name="close" size={28} color={T.textColor} />
              </Pressable>
            </View>
            <View style={s.row}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={translateText(
                  yearMode
                    ? sourceText("previousYearRange")
                    : sourceText("previousMonth"),
                )}
                disabled={yearMode ? yearPage <= 1 : month <= 12}
                onPress={() =>
                  yearMode
                    ? setYearPage(Math.max(1, yearPage - 12))
                    : setMonth(month - 1)
                }
                style={s.target}
              >
                <Ionicons name="chevron-back" size={20} color={T.textColor} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={translateText(
                  yearMode
                    ? sourceText("backToMonthView")
                    : sourceText("selectYear"),
                )}
                onPress={() => {
                  setYearPage(Math.floor((year - 1) / 12) * 12 + 1);
                  setYearMode(!yearMode);
                }}
                style={s.target}
              >
                <Text style={[s.text, s.heading]}>
                  {yearMode
                    ? sourceFormat(
                        "honorific_607",
                        { v0: yearPage, v1: Math.min(yearPage + 11, 9999) },
                        [],
                      )
                    : sourceFormat(
                        "honorific_608",
                        { v0: year, v1: calendarMonth },
                        [],
                      )}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={translateText(
                  yearMode
                    ? sourceText("nextYearRange")
                    : sourceText("nextMonth"),
                )}
                disabled={yearMode ? yearPage + 12 > 9999 : month >= 119999}
                onPress={() =>
                  yearMode ? setYearPage(yearPage + 12) : setMonth(month + 1)
                }
                style={s.target}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={T.textColor}
                />
              </Pressable>
            </View>
            {yearMode ? (
              <View style={s.grid}>
                {Array.from(
                  { length: Math.min(12, 10000 - yearPage) },
                  (_, i) => yearPage + i,
                ).map((y) => (
                  <Pressable
                    key={y}
                    accessibilityRole="button"
                    accessibilityLabel={translateText(
                      sourceFormat("honorific_611", { v0: y }, []),
                    )}
                    accessibilityState={{ selected: y === year }}
                    onPress={() => {
                      setMonth(y * 12 + calendarMonth - 1);
                      setYearMode(false);
                    }}
                    style={[s.yearCell, s.target, y === year && s.selected]}
                  >
                    <Text style={s.text}>
                      {tText("honorific_611", { v0: y })}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={s.grid}>
                {weekdays.map((day) => (
                  <View key={day} style={[s.target, s.cell]}>
                    <Text style={s.placeholder}>{day}</Text>
                  </View>
                ))}
                {Array.from({ length: offset + days }, (_, i) => {
                  const day = i - offset + 1;
                  if (day < 1) return <View key={i} style={s.cell} />;
                  const date = dateKey(year, calendarMonth, day);
                  return (
                    <Pressable
                      key={i}
                      accessibilityRole="button"
                      accessibilityLabel={translateText(date)}
                      accessibilityState={{ selected: date === value }}
                      onPress={() => choose(date)}
                      style={[s.target, s.cell, date === value && s.selected]}
                    >
                      <Text style={s.text}>{day}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
            {!field.required && !!value && (
              <Pressable
                accessibilityRole="button"
                onPress={() => choose("")}
                style={s.target}
              >
                <Text style={{ color: T.primaryColor }}>
                  {tText("clearDate")}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </AppFormField>
  );
}

const s = StyleSheet.create({
  control: {
    minHeight: T.minHeight,
    borderRadius: T.borderRadius,
    borderWidth: 1,
    borderColor: T.borderColor,
    backgroundColor: T.backgroundColor,
    paddingHorizontal: T.paddingHorizontal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  text: { color: T.textColor, fontSize: T.fontSize },
  placeholder: { color: T.placeholderColor },
  error: { borderColor: T.errorColor },
  disabled: { opacity: T.disabledOpacity },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  dialog: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 14,
    backgroundColor: T.backgroundColor,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: { fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: "14.28%", minWidth: 0 },
  yearCell: { width: "33.33%" },
  close: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  target: {
    minHeight: 40,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { backgroundColor: T.selectedBackground, borderRadius: 6 },
});
