import { router } from "expo-router";
import { Alert } from "react-native";

export const notify = (title: string) => {
  if (title === "top" || title === "top") {
    router.push("/" as never);
    return;
  }
  if (title === "求人を探す" || title === "求人検索") {
    router.push("/jobs" as never);
    return;
  }
  if (title === "企業を探す") {
    router.push("/companies" as never);
    return;
  }
  if (title === "ログイン" || title === "無料で始める") {
    router.push("/auth" as never);
    return;
  }
  if (title.includes("詳細")) {
    router.push("/jobs/1" as never);
    return;
  }
  if (title.includes("応募")) {
    router.push("/jobs/1/apply" as never);
    return;
  }
  Alert.alert(title, "検索条件を受け付けました（デモ）。");
};