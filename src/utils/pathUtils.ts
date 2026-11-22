import { sourceText } from "@/i18n/source";
import { Alert } from "@/i18n/native";
import { router } from "expo-router";

export const notify = (title: string) => {
  if (title === "top" || title === "top") {
    router.push("/" as never);
    return;
  }
  if (title === sourceText("findJobs") || title === sourceText("jobSearch")) {
    router.push("/jobs" as never);
    return;
  }
  if (title === sourceText("findCompanies")) {
    router.push("/companies" as never);
    return;
  }
  if (
    title === sourceText("logIn") ||
    title === sourceText("getStartedForFree")
  ) {
    router.push("/auth" as never);
    return;
  }
  if (title.includes(sourceText("details"))) {
    router.push("/jobs/1" as never);
    return;
  }
  if (title.includes(sourceText("application"))) {
    router.push("/jobs/1/apply" as never);
    return;
  }
  Alert.alert(title, sourceText("searchFiltersReceivedDemo"));
};
