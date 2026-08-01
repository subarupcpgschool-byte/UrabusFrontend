import { Platform, StyleSheet } from 'react-native'

export const dashboardColors = {
  white: '#ffffff',
  page: '#f5f8fc',
  mist: '#eff5fc',
  skyLight: '#6fc0f0',
  sky: '#4a8fe0',
  blue: '#2f6fcb',
  blueDeep: '#14284d',
  ink: '#101c2c',
  muted: '#5b6b85',
  softMuted: '#8492a6',
  hairline: 'rgba(20, 40, 77, 0.13)',
  chip: '#edf4fb',
  success: '#23856d',
  successBg: '#eaf7f2',
  warning: '#b56c15',
  warningBg: '#fff4e5',
  danger: '#c43b4d',
  dangerBg: '#fff0f2'
} as const

const cardShadow = Platform.select({
  web: {
    boxShadow: '0 18px 42px rgba(20, 40, 77, 0.07)'
  } as object,
  default: {
    shadowColor: '#14284d',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  }
})

export const companyDashboardStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: dashboardColors.page
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: dashboardColors.page
  },
  sidebar: {
    width: 248,
    backgroundColor: dashboardColors.white,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: dashboardColors.hairline,
    paddingHorizontal: 18,
    paddingVertical: 20
  },
  sidebarLogo: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 26,
    paddingHorizontal: 8
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoTextGroup: {
    flex: 1
  },
  logoText: {
    color: dashboardColors.blueDeep,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.1
  },
  logoSubText: {
    marginTop: 1,
    color: dashboardColors.blue,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.3
  },
  companyPanel: {
    borderRadius: 17,
    padding: 14,
    backgroundColor: dashboardColors.mist,
    marginBottom: 24
  },
  companyPanelTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  companyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: dashboardColors.blueDeep,
    alignItems: 'center',
    justifyContent: 'center'
  },
  companyAvatarText: {
    color: dashboardColors.white,
    fontSize: 13,
    fontWeight: '900'
  },
  companyPanelText: {
    flex: 1
  },
  companyName: {
    color: dashboardColors.ink,
    fontSize: 12,
    fontWeight: '800'
  },
  companyCode: {
    marginTop: 2,
    color: dashboardColors.muted,
    fontSize: 10
  },
  companyVerified: {
    marginTop: 11,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: dashboardColors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  companyVerifiedText: {
    color: dashboardColors.success,
    fontSize: 10,
    fontWeight: '700'
  },
  navSectionLabel: {
    marginBottom: 8,
    paddingHorizontal: 10,
    color: dashboardColors.softMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2
  },
  navList: {
    gap: 5
  },
  navItem: {
    minHeight: 44,
    borderRadius: 13,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11
  },
  navItemActive: {
    backgroundColor: dashboardColors.blueDeep
  },
  navItemPressed: {
    opacity: 0.75
  },
  navItemText: {
    flex: 1,
    color: dashboardColors.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  navItemTextActive: {
    color: dashboardColors.white
  },
  navBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: dashboardColors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.16)'
  },
  navBadgeText: {
    color: dashboardColors.danger,
    fontSize: 9,
    fontWeight: '900'
  },
  navBadgeTextActive: {
    color: dashboardColors.white
  },
  sidebarBottom: {
    marginTop: 'auto',
    gap: 6,
    paddingTop: 20
  },
  main: {
    flex: 1,
    minWidth: 0
  },
  mobileHeader: {
    minHeight: 62,
    paddingHorizontal: 18,
    backgroundColor: dashboardColors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: dashboardColors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  mobileLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9
  },
  mobileLogoText: {
    color: dashboardColors.blueDeep,
    fontSize: 15,
    fontWeight: '900'
  },
  mobileHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: dashboardColors.hairline,
    backgroundColor: dashboardColors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: dashboardColors.danger,
    borderWidth: 1.5,
    borderColor: dashboardColors.white
  },
  mobileNavScroll: {
    maxHeight: 58,
    backgroundColor: dashboardColors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: dashboardColors.hairline
  },
  mobileNavContent: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 8
  },
  mobileNavItem: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: dashboardColors.mist,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  mobileNavItemActive: {
    backgroundColor: dashboardColors.blueDeep
  },
  mobileNavText: {
    color: dashboardColors.blueDeep,
    fontSize: 11,
    fontWeight: '700'
  },
  mobileNavTextActive: {
    color: dashboardColors.white
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 54
  },
  content: {
    width: '100%',
    maxWidth: 1400,
    alignSelf: 'center',
    paddingHorizontal: 34,
    paddingTop: 28
  },
  contentMobile: {
    paddingHorizontal: 16,
    paddingTop: 20
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 22,
    marginBottom: 24
  },
  pageHeaderMobile: {
    flexDirection: 'column'
  },
  eyebrow: {
    color: dashboardColors.blue,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 7
  },
  title: {
    color: dashboardColors.ink,
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '900'
  },
  titleMobile: {
    fontSize: 23,
    lineHeight: 32
  },
  subtitle: {
    marginTop: 7,
    color: dashboardColors.muted,
    fontSize: 13,
    lineHeight: 21
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 999,
    overflow: 'hidden'
  },
  primaryButtonPressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }]
  },
  primaryButtonGradient: {
    minHeight: 46,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  primaryButtonText: {
    color: dashboardColors.white,
    fontSize: 12,
    fontWeight: '900'
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 18
  },
  metricCard: {
    minWidth: 210,
    flexGrow: 1,
    padding: 18,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: dashboardColors.hairline,
    backgroundColor: dashboardColors.white,
    ...cardShadow
  },
  metricCardDesktop: {
    flexBasis: '22%'
  },
  metricCardTablet: {
    flexBasis: '46%'
  },
  metricCardMobile: {
    flexBasis: '100%'
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  metricIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: dashboardColors.mist
  },
  metricValue: {
    marginTop: 16,
    color: dashboardColors.ink,
    fontSize: 28,
    fontWeight: '900'
  },
  metricLabel: {
    marginTop: 3,
    color: dashboardColors.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  metricComparison: {
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  metricComparisonText: {
    color: dashboardColors.softMuted,
    fontSize: 10,
    fontWeight: '600'
  },
  metricComparisonUp: {
    color: dashboardColors.success
  },
  twoColumn: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16,
    marginBottom: 18
  },
  twoColumnMobile: {
    flexDirection: 'column'
  },
  sectionCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: dashboardColors.hairline,
    backgroundColor: dashboardColors.white,
    overflow: 'hidden',
    ...cardShadow
  },
  sectionHeader: {
    minHeight: 66,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: dashboardColors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  sectionHeaderText: {
    flex: 1
  },
  sectionTitle: {
    color: dashboardColors.ink,
    fontSize: 15,
    fontWeight: '900'
  },
  sectionDescription: {
    marginTop: 3,
    color: dashboardColors.muted,
    fontSize: 10
  },
  textButton: {
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 10
  },
  textButtonPressed: {
    backgroundColor: dashboardColors.mist
  },
  textButtonText: {
    color: dashboardColors.blue,
    fontSize: 10,
    fontWeight: '900'
  },
  funnelBody: {
    padding: 20,
    gap: 17
  },
  funnelRow: {
    gap: 7
  },
  funnelLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  funnelLabel: {
    color: dashboardColors.muted,
    fontSize: 11,
    fontWeight: '700'
  },
  funnelValue: {
    color: dashboardColors.ink,
    fontSize: 12,
    fontWeight: '900'
  },
  funnelTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: dashboardColors.mist,
    overflow: 'hidden'
  },
  funnelFill: {
    height: '100%',
    minWidth: 8,
    borderRadius: 999,
    backgroundColor: dashboardColors.blue
  },
  funnelFooter: {
    marginTop: 2,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: dashboardColors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  funnelFooterText: {
    flex: 1,
    color: dashboardColors.muted,
    fontSize: 10,
    lineHeight: 16
  },
  taskList: {
    paddingVertical: 5
  },
  taskRow: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: dashboardColors.hairline
  },
  taskRowLast: {
    borderBottomWidth: 0
  },
  taskIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: dashboardColors.mist
  },
  taskIconHigh: {
    backgroundColor: dashboardColors.dangerBg
  },
  taskText: {
    flex: 1,
    minWidth: 0
  },
  taskTitle: {
    color: dashboardColors.ink,
    fontSize: 11,
    fontWeight: '800'
  },
  taskDescription: {
    marginTop: 3,
    color: dashboardColors.muted,
    fontSize: 9
  },
  taskDue: {
    color: dashboardColors.softMuted,
    fontSize: 9,
    fontWeight: '700'
  },
  taskDueHigh: {
    color: dashboardColors.danger
  },
  fullSection: {
    marginBottom: 18
  },
  jobList: {
    paddingVertical: 4
  },
  jobHeaderRow: {
    paddingHorizontal: 20,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfcfe',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: dashboardColors.hairline
  },
  jobHeaderText: {
    color: dashboardColors.softMuted,
    fontSize: 9,
    fontWeight: '800'
  },
  jobRow: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: dashboardColors.hairline
  },
  jobRowLast: {
    borderBottomWidth: 0
  },
  jobMainColumn: {
    flex: 2.2,
    minWidth: 220,
    paddingRight: 12
  },
  jobStatusColumn: {
    flex: 0.75,
    minWidth: 82
  },
  jobNumberColumn: {
    flex: 0.65,
    minWidth: 62
  },
  jobDeadlineColumn: {
    flex: 0.9,
    minWidth: 95
  },
  jobActionColumn: {
    width: 42,
    alignItems: 'flex-end'
  },
  jobTitle: {
    color: dashboardColors.ink,
    fontSize: 12,
    fontWeight: '900'
  },
  jobMeta: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7
  },
  jobMetaText: {
    color: dashboardColors.muted,
    fontSize: 9
  },
  statusBadge: {
    alignSelf: 'flex-start',
    minHeight: 24,
    paddingHorizontal: 9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: dashboardColors.successBg
  },
  statusBadgeDraft: {
    backgroundColor: dashboardColors.warningBg
  },
  statusBadgeClosed: {
    backgroundColor: dashboardColors.mist
  },
  statusText: {
    color: dashboardColors.success,
    fontSize: 9,
    fontWeight: '900'
  },
  statusTextDraft: {
    color: dashboardColors.warning
  },
  statusTextClosed: {
    color: dashboardColors.muted
  },
  jobNumber: {
    color: dashboardColors.ink,
    fontSize: 12,
    fontWeight: '900'
  },
  jobNumberLabel: {
    marginTop: 2,
    color: dashboardColors.muted,
    fontSize: 8
  },
  jobDeadline: {
    color: dashboardColors.ink,
    fontSize: 10,
    fontWeight: '700'
  },
  moreButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  jobMobileList: {
    padding: 12,
    gap: 10
  },
  jobMobileCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: dashboardColors.hairline,
    borderRadius: 16,
    backgroundColor: dashboardColors.white
  },
  jobMobileTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  jobMobileTitleWrap: {
    flex: 1,
    minWidth: 0
  },
  jobMobileStats: {
    marginTop: 14,
    paddingTop: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: dashboardColors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18
  },
  jobMobileStat: {
    flex: 1
  },
  applicantList: {
    paddingVertical: 4
  },
  applicantRow: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: dashboardColors.hairline
  },
  applicantRowLast: {
    borderBottomWidth: 0
  },
  applicantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: dashboardColors.blueDeep
  },
  applicantAvatarText: {
    color: dashboardColors.white,
    fontSize: 11,
    fontWeight: '900'
  },
  applicantText: {
    flex: 1,
    minWidth: 0
  },
  applicantName: {
    color: dashboardColors.ink,
    fontSize: 11,
    fontWeight: '900'
  },
  applicantJob: {
    marginTop: 3,
    color: dashboardColors.muted,
    fontSize: 9
  },
  applicantRight: {
    alignItems: 'flex-end',
    gap: 5
  },
  stageBadge: {
    minHeight: 23,
    paddingHorizontal: 9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: dashboardColors.mist
  },
  stageBadgeNew: {
    backgroundColor: dashboardColors.dangerBg
  },
  stageBadgeInterview: {
    backgroundColor: dashboardColors.warningBg
  },
  stageBadgeOffer: {
    backgroundColor: dashboardColors.successBg
  },
  stageText: {
    color: dashboardColors.blueDeep,
    fontSize: 8,
    fontWeight: '900'
  },
  stageTextNew: {
    color: dashboardColors.danger
  },
  stageTextInterview: {
    color: dashboardColors.warning
  },
  stageTextOffer: {
    color: dashboardColors.success
  },
  applicantTime: {
    color: dashboardColors.softMuted,
    fontSize: 8
  },
  bottomGrid: {
    flexDirection: 'row',
    gap: 16
  },
  bottomGridMobile: {
    flexDirection: 'column'
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14
  },
  profileAvatar: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: dashboardColors.blueDeep
  },
  profileAvatarText: {
    color: dashboardColors.white,
    fontSize: 10,
    fontWeight: '900'
  },
  profileText: {
    alignItems: 'flex-end'
  },
  profileName: {
    color: dashboardColors.ink,
    fontSize: 10,
    fontWeight: '900'
  },
  profileRole: {
    marginTop: 2,
    color: dashboardColors.muted,
    fontSize: 8
  }
})
