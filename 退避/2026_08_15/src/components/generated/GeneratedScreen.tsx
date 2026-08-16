import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { BREAKPOINTS, COLORS, GRADIENTS } from "@/theme/GlobalWorkersStyles";
import type { ScreenConfig, ScreenNode } from "@/types/Generated";
import {
  cssClassToThemeKey,
  hasThemeStyle,
  pascal,
  responsiveStyles,
  responsiveTextStyle,
} from "../../theme/themeUtils";

type RenderContext = {
  prefixes: string[];
  inheritedTextKeys: string[];
};

const EMPTY_CONTEXT: RenderContext = {
  prefixes: [],
  inheritedTextKeys: [],
};

function nodeText(node: ScreenNode): string {
  if (node.type === "text") return node.text;
  if (node.type === "icon") return "";

  return node.children.map(nodeText).join(" ").replace(/\s+/g, " ").trim();
}

function has(classes: string[], value: string): boolean {
  return classes.includes(value);
}

function iconFor(text: string): keyof typeof Ionicons.glyphMap {
  if (/検索/.test(text)) return "search-outline";
  if (/通知/.test(text)) return "notifications-outline";
  if (/評価|星/.test(text)) return "star-outline";
  if (/求人|応募|採用|契約/.test(text)) return "briefcase-outline";
  if (/企業|会社/.test(text)) return "business-outline";
  if (/ユーザー|従業員|担当者/.test(text)) return "people-outline";
  if (/設定|マスタ/.test(text)) return "settings-outline";
  if (/削除|退会|却下/.test(text)) return "trash-outline";
  if (/チャット|メッセージ/.test(text)) return "chatbubble-outline";
  if (/勤怠|時間|シフト/.test(text)) return "time-outline";
  if (/ファイル|書類|出力/.test(text)) return "document-outline";
  if (/追加|新規|登録/.test(text)) return "add-outline";
  if (/場所|勤務地/.test(text)) return "location-outline";
  if (/確認|完了|成功/.test(text)) return "checkmark-circle-outline";

  return "chevron-forward-outline";
}

function goFor(text: string): string | undefined {
  if (text === "ログイン") return "/login";
  if (/無料で始める|新規登録/.test(text)) return "/signup/user";
  if (/求人をもっと見る|求人を検索/.test(text)) return "/jobs";
  if (/企業を探す/.test(text)) return "/companies";
  if (/料金/.test(text)) return "/pricing";

  return undefined;
}

function classKeys(classes: string[]): string[] {
  const direct = classes.map(cssClassToThemeKey);
  const combined =
    direct.length > 1
      ? [direct.join("").replace(/^./, (value) => value.toLowerCase())]
      : [];

  return [...direct, ...combined].filter(hasThemeStyle);
}

function elementKeys(
  tag: string,
  classes: string[],
  context: RenderContext,
): string[] {
  const directClassKeys = classes.map(cssClassToThemeKey);
  const candidates: string[] = [];

  if (hasThemeStyle(tag)) {
    candidates.push(tag);
  }

  directClassKeys.forEach((classKey) => {
    candidates.push(classKey);
  });

  if (directClassKeys.length > 1) {
    candidates.push(
      directClassKeys
        .map((value, index) => (index === 0 ? value : pascal(value)))
        .join(""),
    );
  }

  context.prefixes.forEach((prefix) => {
    candidates.push(`${prefix}${pascal(tag)}`);

    directClassKeys.forEach((classKey) => {
      candidates.push(`${prefix}${pascal(classKey)}`);
      candidates.push(`${prefix}${pascal(tag)}${pascal(classKey)}`);
    });
  });

  return [...new Set(candidates)].filter(hasThemeStyle);
}

function nextContext(
  tag: string,
  classes: string[],
  context: RenderContext,
  currentKeys: string[],
): RenderContext {
  const directClassKeys = classes.map(cssClassToThemeKey);
  const prefixes = new Set<string>();

  directClassKeys.forEach((key) => prefixes.add(key));

  if (directClassKeys.length > 1) {
    prefixes.add(
      directClassKeys
        .map((value, index) => (index === 0 ? value : pascal(value)))
        .join(""),
    );
  }

  if (directClassKeys.length === 0) {
    context.prefixes.forEach((prefix) => {
      prefixes.add(`${prefix}${pascal(tag)}`);
    });
  } else {
    context.prefixes.forEach((prefix) => {
      directClassKeys.forEach((classKey) => {
        prefixes.add(`${prefix}${pascal(classKey)}`);
      });
    });
  }

  currentKeys.forEach((key) => {
    if (
      key !== tag &&
      key.length > 0 &&
      !["h1", "h2", "h3", "p", "a"].includes(key)
    ) {
      prefixes.add(key);
    }
  });

  return {
    prefixes: [...prefixes].filter(hasThemeStyle),
    inheritedTextKeys: [...context.inheritedTextKeys, ...currentKeys],
  };
}

function structuralStyles(classes: string[], width: number): unknown[] {
  const desktop = width >= BREAKPOINTS.desktop;
  const tablet = width >= BREAKPOINTS.tablet;

  const result: unknown[] = [];

  const rowClasses = [
    "hero-numbers",
    "job-card-head",
    "job-meta",
    "job-actions",
    "tag-row",
    "detail-header",
    "mini-company",
    "review-head",
    "moderation-head",
    "between",
    "monthly-close",
    "toolbar",
    "page-title-actions",
    "form-actions",
    "attendance-hero",
    "clock-actions",
    "offer-head",
    "offer-details",
    "profile-cover",
    "candidate-mini",
    "evidence-box",
    "export-preview",
  ];

  if (classes.some((value) => rowClasses.includes(value))) {
    result.push(structural.row);
  }

  if (
    classes.some((value) =>
      ["tag-row", "job-meta", "toolbar", "page-title-actions"].includes(value),
    )
  ) {
    result.push(structural.wrap);
  }

  if (has(classes, "section-heading")) {
    result.push(desktop ? structural.betweenRow : structural.column);
  }

  if (has(classes, "hero")) {
    result.push(desktop ? structural.row : structural.column);
  }

  if (has(classes, "hero-search")) {
    result.push(desktop ? structural.row : structural.column);
  }

  if (has(classes, "job-grid") || has(classes, "feature-strip")) {
    result.push(
      desktop
        ? structural.gridThree
        : tablet
          ? structural.gridTwo
          : structural.gridOne,
    );
  }

  if (
    classes.some((value) =>
      [
        "search-layout",
        "detail-layout",
        "two-col",
        "review-summary",
        "contact-layout",
        "document-layout",
        "settings-layout",
        "role-grid",
        "org-layout",
        "editor-layout",
        "dashboard-grid",
      ].includes(value),
    )
  ) {
    result.push(desktop ? structural.row : structural.column);
  }

  if (has(classes, "stats-grid")) {
    result.push(
      desktop
        ? structural.gridFour
        : tablet
          ? structural.gridTwo
          : structural.gridOne,
    );
  }

  if (has(classes, "pricing-grid")) {
    result.push(desktop ? structural.gridThree : structural.gridOne);
  }

  if (has(classes, "form-grid")) {
    if (has(classes, "cols-2") && tablet) {
      result.push(structural.gridTwo);
    } else {
      result.push(structural.gridOne);
    }
  }

  if (has(classes, "detail-facts")) {
    result.push(desktop ? structural.gridFour : structural.gridTwo);
  }

  if (has(classes, "document-grid")) {
    result.push(tablet ? structural.gridTwo : structural.gridOne);
  }

  if (has(classes, "permission-grid")) {
    result.push(tablet ? structural.gridTwo : structural.gridOne);
  }

  if (has(classes, "message") && has(classes, "mine")) {
    result.push(structural.messageMine);
  }

  return result;
}

function gradientFor(keys: string[]) {
  if (keys.includes("hero")) return GRADIENTS.heroBackdrop;
  if (keys.includes("portrait")) return GRADIENTS.portrait;
  if (keys.includes("welcomeCard")) return GRADIENTS.welcome;
  if (keys.includes("attendanceHero")) return GRADIENTS.attendance;
  if (keys.includes("creditCard")) return GRADIENTS.creditCard;

  return undefined;
}

export default function GeneratedScreen({ screen }: { screen: ScreenConfig }) {
  const { width } = useWindowDimensions();

  return (
    <View style={structural.screen}>
      <RenderNode node={screen.content} width={width} context={EMPTY_CONTEXT} />
    </View>
  );
}

function RenderNode({
  node,
  width,
  context,
}: {
  node: ScreenNode;
  width: number;
  context: RenderContext;
}): React.ReactNode {
  if (node.type === "text") {
    if (!node.text) return null;

    return (
      <Text style={responsiveTextStyle(context.inheritedTextKeys, width)}>
        {node.text}
      </Text>
    );
  }

  if (node.type === "icon") {
    return <Ionicons name="ellipse-outline" size={16} color={COLORS.muted} />;
  }

  const { tag, classes, attrs, children } = node;
  const text = nodeText(node);
  const keys = elementKeys(tag, classes, context);
  const childContext = nextContext(tag, classes, context, keys);

  const themeStyle = responsiveStyles(keys, width);
  const layoutStyle = structuralStyles(classes, width);

  if (tag === "input") {
    const type = String(attrs.type || "text");

    if (type === "checkbox" || type === "radio") {
      return (
        <View style={[themeStyle as never, structural.checkBox]}>
          <Ionicons
            name={attrs.checked ? "checkbox" : "square-outline"}
            size={20}
            color={attrs.checked ? COLORS.blue : COLORS.muted}
          />
        </View>
      );
    }

    return (
      <TextInput
        defaultValue={String(attrs.value || "")}
        placeholder={String(attrs.placeholder || "")}
        placeholderTextColor={COLORS.muted}
        secureTextEntry={type === "password"}
        keyboardType={type === "email" ? "email-address" : "default"}
        style={[themeStyle as never, structural.input]}
      />
    );
  }

  if (tag === "textarea") {
    return (
      <TextInput
        defaultValue={text}
        placeholder={String(attrs.placeholder || "")}
        placeholderTextColor={COLORS.muted}
        multiline
        numberOfLines={5}
        style={[themeStyle as never, structural.input, structural.textarea]}
      />
    );
  }

  if (tag === "select") {
    const options = (attrs.options as string[] | undefined) || [];

    return (
      <Pressable style={[themeStyle as never, structural.select]}>
        <Text style={structural.selectText}>
          {options[0] || "選択してください"}
        </Text>
        <Ionicons name="chevron-down" size={17} color={COLORS.muted} />
      </Pressable>
    );
  }

  if (tag === "button" || tag === "a") {
    const href = goFor(text);
    const primary = has(classes, "btn-primary");
    const danger = has(classes, "btn-danger");

    return (
      <Pressable
        onPress={() => href && router.push(href as Href)}
        style={({ pressed }) => [
          themeStyle as never,
          structural.button,
          pressed && structural.pressed,
        ]}
      >
        <Ionicons
          name={iconFor(text)}
          size={has(classes, "icon-btn") ? 19 : 16}
          color={primary || danger ? COLORS.white : COLORS.blue}
        />
        <Text
          numberOfLines={2}
          style={[
            responsiveTextStyle(keys, width),
            structural.buttonText,
            (primary || danger) && structural.buttonTextWhite,
          ]}
        >
          {text || "操作"}
        </Text>
      </Pressable>
    );
  }

  if (tag === "hr") {
    return <View style={[themeStyle as never, structural.hr]} />;
  }

  if (tag === "table") {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={[themeStyle as never, structural.table]}>
          {children.map((child, index) => (
            <React.Fragment key={index}>
              <RenderNode node={child} width={width} context={childContext} />
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    );
  }

  if (tag === "thead" || tag === "tbody") {
    return (
      <View style={themeStyle as never}>
        {children.map((child, index) => (
          <React.Fragment key={index}>
            <RenderNode node={child} width={width} context={childContext} />
          </React.Fragment>
        ))}
      </View>
    );
  }

  if (tag === "tr") {
    return (
      <View style={[themeStyle as never, structural.tableRow]}>
        {children.map((child, index) => (
          <React.Fragment key={index}>
            <RenderNode node={child} width={width} context={childContext} />
          </React.Fragment>
        ))}
      </View>
    );
  }

  if (tag === "th" || tag === "td") {
    return (
      <View style={[themeStyle as never, structural.cell]}>
        <Text
          numberOfLines={4}
          style={[responsiveTextStyle(keys, width), structural.cellText]}
        >
          {text}
        </Text>
      </View>
    );
  }

  if (tag === "ul") {
    return (
      <View style={[themeStyle as never, structural.list]}>
        {children.map((child, index) => (
          <React.Fragment key={index}>
            <RenderNode node={child} width={width} context={childContext} />
          </React.Fragment>
        ))}
      </View>
    );
  }

  if (tag === "li") {
    return (
      <View style={[themeStyle as never, structural.listItem]}>
        <Ionicons name="checkmark-circle" size={17} color={COLORS.green} />
        <Text
          style={[responsiveTextStyle(keys, width), structural.listItemText]}
        >
          {text}
        </Text>
      </View>
    );
  }

  if (
    [
      "h1",
      "h2",
      "h3",
      "p",
      "strong",
      "b",
      "em",
      "code",
      "small",
      "time",
    ].includes(tag) ||
    (tag === "span" && !has(classes, "badge"))
  ) {
    return (
      <Text
        style={responsiveTextStyle(
          [...context.inheritedTextKeys, ...keys],
          width,
        )}
      >
        {children.map((child, index) => (
          <React.Fragment key={index}>
            <RenderInline node={child} width={width} context={childContext} />
          </React.Fragment>
        ))}
      </Text>
    );
  }

  if (tag === "span" && has(classes, "badge")) {
    return (
      <View style={[themeStyle as never, structural.badgeFallback]}>
        <Text style={responsiveTextStyle([...keys], width)}>{text}</Text>
      </View>
    );
  }

  const gradient = gradientFor(keys);
  const content = children.map((child, index) => (
    <React.Fragment key={index}>
      <RenderNode node={child} width={width} context={childContext} />
    </React.Fragment>
  ));

  if (gradient) {
    return (
      <LinearGradient
        colors={[...gradient]}
        style={[themeStyle as never, layoutStyle as never]}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View style={[themeStyle as never, layoutStyle as never]}>{content}</View>
  );
}

function RenderInline({
  node,
  width,
  context,
}: {
  node: ScreenNode;
  width: number;
  context: RenderContext;
}): React.ReactNode {
  if (node.type === "text") {
    return node.text;
  }

  if (node.type === "icon") {
    return null;
  }

  const keys = elementKeys(node.tag, node.classes, context);

  return (
    <Text
      style={responsiveTextStyle(
        [...context.inheritedTextKeys, ...keys],
        width,
      )}
    >
      {node.children.map((child, index) => (
        <React.Fragment key={index}>
          <RenderInline
            node={child}
            width={width}
            context={nextContext(node.tag, node.classes, context, keys)}
          />
        </React.Fragment>
      ))}
    </Text>
  );
}

const structural = StyleSheet.create({
  screen: {
    width: "100%",
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  betweenRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  column: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  wrap: {
    flexWrap: "wrap",
  },
  gridOne: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  gridTwo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  gridThree: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },
  gridFour: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  input: {
    minHeight: 44,
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  select: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  selectText: {
    flex: 1,
    color: COLORS.ink,
  },
  checkBox: {
    minWidth: 24,
  },
  button: {
    flexDirection: "row",
  },
  buttonText: {
    fontWeight: "700",
    color: COLORS.ink,
  },
  buttonTextWhite: {
    color: COLORS.white,
  },
  pressed: {
    opacity: 0.72,
  },
  hr: {
    height: 1,
    width: "100%",
    backgroundColor: COLORS.line,
  },
  table: {
    minWidth: 760,
  },
  tableRow: {
    flexDirection: "row",
  },
  cell: {
    width: 160,
    padding: 10,
  },
  cellText: {
    color: COLORS.ink,
    fontSize: 12,
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  listItemText: {
    flex: 1,
    color: COLORS.ink,
  },
  badgeFallback: {
    alignSelf: "flex-start",
  },
  messageMine: {
    alignSelf: "flex-end",
  },
});
