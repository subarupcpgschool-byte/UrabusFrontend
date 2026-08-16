import { COLORS } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const MAX_WIDTH = 1280;

type Props = {
  title: string;
};

export function AppHeader({ title }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.inner}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="menu-outline" size={28} color={COLORS.text} />
        </Pressable>

        <Text style={styles.title}>{title}</Text>

        <Pressable style={styles.iconButton}>
          <View>
            <Ionicons
              name="notifications-outline"
              size={25}
              color={COLORS.text}
            />
            <View style={styles.dot} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 68,
    backgroundColor: COLORS.header,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    justifyContent: "center",
  },
  inner: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "900",
  },
  dot: {
    position: "absolute",
    right: -1,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
