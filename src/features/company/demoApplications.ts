import { sourceText } from "@/i18n/source";
export const companyApplications = [
  {
    id: "1",
    name: sourceText("taroYamada"),
    job: sourceText("backendEngineer"),
    status: sourceText("unverified"),
    received: "2026/11/03",
    skills: sourceText("javaSpringBootPostgresql"),
  },
  {
    id: "2",
    name: sourceText("misakiSato"),
    job: sourceText("webDesigner"),
    status: sourceText("inSelection"),
    received: "2026/11/02",
    skills: sourceText("figmaUiDesign"),
  },
  {
    id: "3",
    name: sourceText("kenSuzuki"),
    job: sourceText("storeOperationsStaff"),
    status: sourceText("meeting"),
    received: "2026/11/01",
    skills: sourceText("storeOperationsCustomerService"),
  },
  {
    id: "4",
    name: sourceText("ayaTakahashi"),
    job: sourceText("webDesigner"),
    status: sourceText("jobOffer"),
    received: "2026/10/28",
    skills: sourceText("webProductionAndDesign"),
  },
] as const;
