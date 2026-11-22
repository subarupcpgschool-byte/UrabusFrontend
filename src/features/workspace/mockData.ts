import { sourceText } from "@/i18n/source";
import {
  COMPANY_SEARCH_ITEMS,
  JOB_SEARCH_ITEMS,
} from "@/components/search/searchData";
import type {
  Attachment,
  Favorite,
  Room,
  WorkspaceState,
} from "./WorkspaceProvider";
export const WORKSPACE_MOCK_ENABLED =
  process.env.EXPO_PUBLIC_WORKSPACE_MOCK !== "false";
/** Pure fixture factory: detached copies and relative timestamps on first load/reset only. */
export function createMockWorkspace(now = Date.now()): WorkspaceState {
  const hour = 3600000;
  const image: Attachment = {
    id: "demo-image",
    name: sourceText("officeIntroductionPng"),
    uri: "mock:image",
    mime: "image/png",
    size: 16083,
  };
  const video: Attachment = {
    id: "demo-video",
    name: sourceText("workplaceIntroductionVideo"),
    uri: "mock:video",
    mime: "video/mp4",
    size: 14175,
  };
  const file: Attachment = {
    id: "demo-file",
    name: sourceText("meetingDatesCsv"),
    uri: "mock:csv",
    mime: "text/csv",
    size: 180,
  };
  const companies = COMPANY_SEARCH_ITEMS.slice(0, 3).map((item) => ({
    key: `company:${item.id}`,
    kind: "company" as const,
    item: JSON.parse(JSON.stringify(item)),
    savedAt: now - hour * Number(item.id),
  }));
  const jobs = JOB_SEARCH_ITEMS.map((item) => ({
    key: `job:${item.id}`,
    kind: "job" as const,
    item: JSON.parse(JSON.stringify(item)),
    savedAt: now - hour * (Number(item.id) + 3),
  }));
  const favorites: Favorite[] = [...companies, ...jobs];
  const rooms: Room[] = [
    {
      id: "company:1",
      kind: "company",
      company: COMPANY_SEARCH_ITEMS[0].companyName,
      title: sourceText("contactTheCompany"),
      unread: 2,
      archived: false,
      createdAt: now - 96 * hour,
      messages: [
        {
          id: "demo-c1-1",
          text: sourceText("couldYouTellMeAboutTheWork"),
          at: now - 48 * hour,
          mine: true,
          attachments: [],
        },
        {
          id: "demo-c1-2",
          text: sourceText("thankYouForContactingUsHereIs"),
          at: now - 3 * hour,
          mine: false,
          attachments: [image],
        },
        {
          id: "demo-c1-3",
          text: sourceText("workingHoursAreNegotiablePleaseLetUs"),
          at: now - hour,
          mine: false,
          attachments: [],
        },
      ],
    },
    {
      id: "job:1",
      kind: "job",
      company: JOB_SEARCH_ITEMS[0].companyName,
      title: JOB_SEARCH_ITEMS[0].title,
      unread: 1,
      archived: false,
      createdAt: now - 120 * hour,
      messages: [
        {
          id: "demo-j1-1",
          text: sourceText("iSawTheJobPostingAndWould"),
          at: now - 24 * hour,
          mine: true,
          attachments: [],
        },
        {
          id: "demo-j1-2",
          text: sourceText("thankYouIHaveAttachedPossibleMeeting"),
          at: now - 2 * hour,
          mine: false,
          attachments: [file],
        },
      ],
    },
    {
      id: "job:2",
      kind: "job",
      company: JOB_SEARCH_ITEMS[1].companyName,
      title: JOB_SEARCH_ITEMS[1].title,
      unread: 0,
      archived: false,
      createdAt: now - 144 * hour,
      messages: [
        {
          id: "demo-j2-1",
          text: sourceText("iHaveReviewedYourPortfolioPleaseSee"),
          at: now - 30 * hour,
          mine: false,
          attachments: [video],
        },
        {
          id: "demo-j2-2",
          text: sourceText("thankYouINowHaveABetter"),
          at: now - 27 * hour,
          mine: true,
          attachments: [],
        },
      ],
    },
    {
      id: "company:2",
      kind: "company",
      company: COMPANY_SEARCH_ITEMS[1].companyName,
      title: sourceText("discussingWorkingConditions"),
      unread: 0,
      archived: false,
      createdAt: now - 160 * hour,
      messages: [
        {
          id: "demo-c2-1",
          text: sourceText("couldWeDiscussHowOftenICan"),
          at: now - 40 * hour,
          mine: true,
          attachments: [],
        },
        {
          id: "demo-c2-2",
          text: sourceText("thisDependsOnYourResponsibilitiesWeCan"),
          at: now - 36 * hour,
          mine: false,
          attachments: [],
        },
      ],
    },
    {
      id: "job:3",
      kind: "job",
      company: JOB_SEARCH_ITEMS[2].companyName,
      title: JOB_SEARCH_ITEMS[2].title,
      unread: 0,
      archived: true,
      createdAt: now - 240 * hour,
      messages: [
        {
          id: "demo-j3-1",
          text: sourceText("iWillNotApplyThisTimeI"),
          at: now - 168 * hour,
          mine: true,
          attachments: [],
        },
        {
          id: "demo-j3-2",
          text: sourceText("understoodThankYouForConsideringUs"),
          at: now - 165 * hour,
          mine: false,
          attachments: [],
        },
      ],
    },
    {
      id: "company:3",
      kind: "company",
      company: COMPANY_SEARCH_ITEMS[2].companyName,
      title: sourceText("questionAboutThePosting"),
      unread: 1,
      archived: false,
      createdAt: now - 72 * hour,
      messages: [
        {
          id: "demo-c3-1",
          text: sourceText("couldYouTellMeAboutTheTraining"),
          at: now - 10 * hour,
          mine: true,
          attachments: [],
        },
        {
          id: "demo-c3-2",
          text: sourceText("seniorEmployeesWillSupportYouAfterJoining"),
          at: now - 4 * hour,
          mine: false,
          attachments: [],
        },
      ],
    },
  ];
  return { favorites, rooms };
}
export const MOCK_CSV = sourceText("candidateDateStartTimeFormatSampleOption");
