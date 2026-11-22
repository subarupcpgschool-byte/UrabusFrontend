import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { AppInput, AppSelect } from "@/components/form";
import { choices } from "./recruitmentOptions";

function parse(value: string) {
  const match = /^(年収|月給|時給)\s*([0-9]+(?:\.[0-9]+)?)\s*(万円|円)$/.exec(
    value,
  );
  return match
    ? { method: match[1], amount: match[2], unit: match[3] }
    : {
        method: sourceText("monthlyPay_978"),
        amount: "",
        unit: sourceText("jpy10000"),
      };
}

export function CompensationInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  "use no memo";
  useLocaleVersion();
  const [input, setInput] = useState(() => parse(value));
  useEffect(() => {
    const displayed = input.amount
      ? `${input.method} ${input.amount}${input.unit}`
      : "";
    if (value !== displayed) setInput(parse(value));
  }, [value]); // External article changes restore the saved selection.

  function change(key: keyof typeof input, next: string) {
    const updated = { ...input, [key]: next };
    setInput(updated);
    onChange(
      updated.amount
        ? `${updated.method} ${updated.amount}${updated.unit}`
        : "",
    );
  }

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <AppSelect
          label={tText("payPeriod")}
          required
          value={input.method}
          options={choices([
            sourceText("annualPay"),
            sourceText("monthlyPay_978"),
            sourceText("hourlyPay"),
          ])}
          disabled={disabled}
          onValueChange={(v) => change("method", v)}
          containerStyle={{ flexGrow: 1, flexBasis: 100 }}
        />
        <AppInput
          label={tText("amount")}
          required
          value={input.amount}
          keyboardType="decimal-pad"
          inputMode="decimal"
          editable={!disabled}
          maxLength={16}
          onChangeText={(v) => {
            if (/^[0-9]*(?:\.[0-9]{0,2})?$/.test(v)) change("amount", v);
          }}
          containerStyle={{ flexGrow: 2, flexBasis: 120 }}
        />
        <AppSelect
          label={tText("amountUnit")}
          value={input.unit}
          options={choices([sourceText("jpy"), sourceText("jpy10000")])}
          disabled={disabled}
          onValueChange={(v) => change("unit", v)}
          containerStyle={{ flexGrow: 1, flexBasis: 90 }}
        />
      </View>
      {!!value &&
        !/^(年収|月給|時給)\s*[0-9]+(?:\.[0-9]+)?\s*(万円|円)$/.test(value) && (
          <AppInput
            label={tText("legacyPayDescription")}
            value={value}
            editable={false}
            hint={tText("enterAnAmountAboveToChangeThe")}
          />
        )}
    </View>
  );
}
