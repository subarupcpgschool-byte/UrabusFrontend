import { StyleSheet } from 'react-native'

/**
 * Auto-converted from the supplied CSS for React Native / Expo.
 *
 * Important differences from CSS:
 * - CSS Grid rules are approximated with Flexbox and may need child width/flex styles.
 * - :before / :after require explicit <View>/<Text> elements in JSX.
 * - :hover / :focus should be implemented with Pressable state or component state.
 * - linear/radial/conic gradients require expo-linear-gradient or react-native-svg.
 * - sticky positioning should use stickyHeaderIndices or a web-only style.
 * - @media rules are exported separately as tabletStyles/mobileStyles and should be
 *   combined with useWindowDimensions()/useResponsive().
 */
export const COLORS = {
  blue: '#2463eb',
  blue2: '#4c8df6',
  navy: '#10213f',
  ink: '#16223a',
  muted: '#6d7b92',
  line: '#dfe6f0',
  bg: '#f5f7fb',
  white: '#fff',
  green: '#16a273',
  amber: '#e89b1d',
  red: '#e34c57',
  purple: '#7c5ce7',

  blueDark: '#245CA9',
  blueLight: '#EAF3FF',
  sky: '#6FC0F0',
  greenLight: '#E6F6EF',
  purpleLight: '#F0EBFF',
  border: '#D8E2EF',
  surface: '#FFFFFF',
  background: '#F5F8FC',
  soft: '#EFF5FC',
  warning: '#F4A340',
  lightBlue: '#E8F1FF',
  lightGreen: '#E4F7EF',
  lightAmber: '#FFF3D8',
  lightRed: '#FFE8EB',
  lightPurple: '#EFEAFF',
  lightGray: '#EDF1F6'
} as const

export const TOKENS = {
  radius: 16
} as const

export const BREAKPOINTS = {
  tablet: 700,
  desktop: 1050
} as const

export const GRADIENTS = {
  logoMark: ['#2463eb', '#62a6ff'] as const,
  heroBackdrop: ['#eef5ff', '#e6f9f4'] as const,
  portrait: ['#d9e9ff', '#d4f7e9'] as const,
  welcome: ['#183b72', '#2c6fd1'] as const,
  attendance: ['#173c76', '#2463eb'] as const,
  creditCard: ['#122745', '#3062a4'] as const,
  progress: ['#2463eb', '#68a8ff'] as const
} as const

export const styles = StyleSheet.create({
  body: {
    margin: 0,
    fontFamily: 'Noto Sans JP',
    color: '#16223a',
    backgroundColor: '#f5f7fb',
    fontSize: 14,
    lineHeight: 23
  },
  a: {
    textDecorationLine: 'none'
  },
  icon: {
    textAlignVertical: 'center'
  },
  h1: {
    marginTop: 0,
    fontSize: 30,
    lineHeight: 41,
    marginBottom: 8
  },
  h2: {
    marginTop: 0,
    fontSize: 22,
    marginBottom: 6
  },
  h3: {
    marginTop: 0,
    fontSize: 17,
    marginBottom: 12
  },
  p: {
    marginTop: 0
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  brandStrong: {
    fontSize: 18,
    letterSpacing: -0.3
  },
  logoMark: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 11,
    color: '#fff',
    fontWeight: '800'
  },
  btn: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    fontWeight: '700',
    backgroundColor: '#fff',
    color: '#16223a'
  },
  btnHover: {
    transform: [{ translateY: -1 }]
  },
  btnPrimary: {
    backgroundColor: '#2463eb',
    color: '#fff'
  },
  btnGhost: {
    borderColor: '#dfe6f0',
    backgroundColor: '#fff'
  },
  btnLink: {
    backgroundColor: 'transparent',
    color: '#2463eb'
  },
  btnDanger: {
    backgroundColor: '#e34c57',
    color: '#fff'
  },
  btnLg: {
    paddingVertical: 13,
    paddingHorizontal: 20
  },
  full: {
    width: '100%'
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    backgroundColor: '#fff',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#56677f'
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 9,
    fontSize: 11,
    fontWeight: '700',
    width: 'fit-content' as any
  },
  badgeBlue: {
    color: '#1d54ba',
    backgroundColor: '#e8f1ff'
  },
  badgeGreen: {
    color: '#087650',
    backgroundColor: '#e4f7ef'
  },
  badgeAmber: {
    color: '#9c6500',
    backgroundColor: '#fff3d8'
  },
  badgeRed: {
    color: '#b92738',
    backgroundColor: '#ffe8eb'
  },
  badgeGray: {
    color: '#617086',
    backgroundColor: '#edf1f6'
  },
  badgePurple: {
    color: '#6542cb',
    backgroundColor: '#efeaff'
  },
  publicHeader: {
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0',
    display: 'flex',
    alignItems: 'center',
    gap: 48,
    top: 0,
    zIndex: 30
  },
  publicHeaderNav: {
    display: 'flex',
    gap: 26,
    fontWeight: '600'
  },
  publicHeaderNavAHover: {
    color: '#2463eb'
  },
  headerActions: {
    marginLeft: 'auto',
    display: 'flex',
    gap: 8
  },
  mobileMenu: {
    display: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  publicMain: {
    maxWidth: 1240,
    paddingTop: 20,
    paddingHorizontal: 28,
    paddingBottom: 70,
    marginHorizontal: "auto"

  },
  routeBanner: {
    marginTop: 16,
    marginHorizontal: 0,
    marginBottom: 0,
    backgroundColor: '#eef4ff',
    color: '#56709a',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 12
  },
  routeBannerSpan: {
    fontWeight: '800',
    color: '#2463eb'
  },
  routeBannerCode: {
    backgroundColor: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6
  },
  routeBannerA: {
    marginLeft: 'auto',
    color: '#2463eb',
    fontWeight: '700'
  },
  publicPageTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 35,
    paddingHorizontal: 0,
    paddingBottom: 22
  },
  publicPageTitleDivSpan: {
    fontSize: 12,
    color: '#2463eb',
    fontWeight: '700'
  },
  pageTitleDivSpan: {
    fontSize: 12,
    color: '#2463eb',
    fontWeight: '700'
  },
  publicPageTitleP: {
    color: '#6d7b92',
    margin: 0
  },
  pageTitleP: {
    color: '#6d7b92',
    margin: 0
  },
  publicFooter: {
    backgroundColor: '#10213f',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 24
  },
  publicFooterP: {
    margin: 0,
    color: '#c8d3e5'
  },
  publicFooterSmall: {
    marginLeft: 'auto',
    color: '#98a8c3'
  },
  hero: {
    minHeight: 450,
    marginTop: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 55,
    position: 'relative'
  },
  heroBefore: {
    position: 'absolute',
    zIndex: -1
  },
  heroCopyH1: {
    fontSize: 48,
    letterSpacing: -2,
    marginVertical: 18,
    marginHorizontal: 0
  },
  heroCopyH1Em: {
    fontStyle: 'normal',
    color: '#2463eb'
  },
  heroCopyP: {
    fontSize: 17,
    color: '#6d7b92',
    maxWidth: 650
  },
  heroSearch: {
    marginTop: 28,
    marginHorizontal: 0,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 8,
    display: 'flex',
    gap: 6
  },
  heroSearchDiv: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 0,
    paddingHorizontal: 11,
    borderRightWidth: 1,
    borderRightColor: '#dfe6f0',
    color: '#7b8ba2'
  },
  heroSearchInput: {
    width: '100%',
    borderWidth: 0,
    paddingVertical: 11,
    paddingHorizontal: 0
  },
  heroNumbers: {
    display: 'flex',
    gap: 28,
    color: '#6d7b92'
  },
  heroNumbersSpan: {
    display: 'flex',
    flexDirection: 'column'
  },
  heroNumbersB: {
    fontSize: 19,
    color: '#16223a'
  },
  heroVisual: {
    height: 460,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  personCard: {
    width: 290,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 25,
    textAlign: 'center'
  },
  portrait: {
    height: 220,
    borderRadius: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2463eb',
    fontSize: 54,
    fontWeight: '800',
    marginBottom: 18
  },
  personCardP: {
    color: '#6d7b92'
  },
  successLine: {
    backgroundColor: '#e8f8f1',
    color: '#16a273',
    borderRadius: 10,
    padding: 9,
    fontWeight: '700'
  },
  floatingCard: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 17,
    display: 'flex',
    alignItems: 'center'
  },
  floatingCardSvg: {
    color: '#2463eb'
  },
  floatingCardB: {
    fontSize: 17
  },
  floatingCardSpan: {
    color: '#6d7b92',
    fontSize: 11
  },
  cardA: {
    left: 0,
    top: 80
  },
  cardB: {
    right: 0,
    bottom: 70
  },
  pageSection: {
    paddingVertical: 40,
    paddingHorizontal: 0
  },
  sectionHeading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  sectionHeadingH2: {
    marginBottom: 3
  },
  sectionHeadingP: {
    color: '#6d7b92',
    margin: 0
  },
  jobGrid: {
    display: 'flex',
    gap: 18
  },
  jobCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 20
  },
  jobCardHead: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12
  },
  jobCardHeadH3: {
    fontSize: 16,
    marginBottom: 2
  },
  jobCardHeadP: {
    fontSize: 12,
    color: '#6d7b92'
  },
  jobCardHeadIconBtn: {
    marginLeft: 'auto'
  },
  companyAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    color: '#2463eb',
    fontWeight: '800',
    width: 42,
    height: 42
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: '#2463eb',
    fontWeight: '800',
    width: 42,
    height: 42
  },
  companyAvatarLarge: {
    width: 58,
    height: 58
  },
  companyAvatarXl: {
    width: 76,
    height: 76,
    fontSize: 22
  },
  avatarXl: {
    width: 76,
    height: 76,
    fontSize: 22
  },
  companyAvatarXxl: {
    width: 96,
    height: 96,
    fontSize: 32,
    borderWidth: 6,
    borderStyle: 'solid',
    borderColor: '#fff'
  },
  jobMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 11,
    marginVertical: 17,
    marginHorizontal: 0,
    color: '#63738a',
    fontSize: 12
  },
  jobMetaSpan: {
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  jobPay: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12
  },
  tagRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap'
  },
  jobActions: {
    display: 'flex',
    gap: 8,
    marginTop: 17
  },
  jobActionsBtn: {
    flex: 1
  },
  featureStrip: {
    display: 'flex',
    gap: 18,
    paddingTop: 25,
    paddingHorizontal: 0,
    paddingBottom: 55
  },
  featureStripArticle: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0'
  },
  featureStripSvg: {
    color: '#2463eb',
    marginBottom: 12
  },
  featureStripP: {
    color: '#6d7b92',
    margin: 0
  },
  searchLayout: {
    display: 'flex',
    gap: 24
  },
  filterPanel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 19,
    top: 88
  },
  filterPanelH3: {
    display: 'flex',
    gap: 8
  },
  filterPanelField: {
    marginBottom: 13
  },
  resultHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  resultHeadStrong: {
    fontSize: 22
  },
  resultHeadSpan: {
    color: '#6d7b92'
  },
  resultHeadSelect: {
    width: 150
  },
  detailLayout: {
    display: 'flex',
    gap: 22
  },
  detailCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 23,
    marginBottom: 18
  },
  contentCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 23,
    marginBottom: 18
  },
  applyCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 23,
    marginBottom: 18,
    top: 90
  },
  detailHeader: {
    display: 'flex',
    gap: 17,
    alignItems: 'center'
  },
  detailHeaderH2: {
    fontSize: 25,
    marginTop: 8,
    marginHorizontal: 0,
    marginBottom: 3
  },
  detailHeaderP: {
    color: '#6d7b92'
  },
  detailFacts: {
    display: 'flex',
    gap: 10,
    marginTop: 20
  },
  detailFactsDiv: {
    padding: 14,
    backgroundColor: '#f7f9fc',
    borderRadius: 11
  },
  detailFactsSpan: {
    display: 'flex',
    color: '#6d7b92',
    fontSize: 11
  },
  detailFactsB: {
    fontSize: 13
  },
  contentCardH3NotFirstChild: {
    marginTop: 25
  },
  contentCardP: {
    color: '#526178'
  },
  checkList: {
    padding: 0,
    marginVertical: 12,
    marginHorizontal: 0
  },
  checkListLi: {
    position: 'relative',
    paddingTop: 7,
    paddingRight: 0,
    paddingBottom: 7,
    paddingLeft: 27
  },
  checkListLiBefore: {
    position: 'absolute',
    left: 0,
    top: 7,
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: '#e3f6ee',
    color: '#16a273',
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800'
  },
  applyCardPrice: {
    marginBottom: 15
  },
  applyCardPriceB: {
    display: 'flex',
    fontSize: 23
  },
  applyCardBtn: {
    marginBottom: 9
  },
  applyCardHr: {
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopColor: '#dfe6f0',
    marginVertical: 17,
    marginHorizontal: 0
  },
  actionPanelHr: {
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopColor: '#dfe6f0',
    marginVertical: 17,
    marginHorizontal: 0
  },
  miniCompany: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  miniCompanyDivLastChild: {
    display: 'flex',
    flexDirection: 'column'
  },
  miniCompanySpan: {
    fontSize: 12,
    color: '#6d7b92'
  },
  reviewSummary: {
    display: 'flex',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 23,
    marginBottom: 18
  },
  scoreBlock: {
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#dfe6f0',
    paddingRight: 23
  },
  scoreBlockStrong: {
    fontSize: 46
  },
  stars: {
    letterSpacing: 2,
    color: '#f7ad2b',
    fontSize: 19
  },
  starsSmall: {
    fontSize: 13
  },
  scoreBlockSpan: {
    display: 'flex',
    color: '#6d7b92',
    fontSize: 12
  },
  scoreBars: {
    paddingLeft: 25
  },
  scoreBarsDiv: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 0
  },
  scoreBarsI: {
    height: 7,
    backgroundColor: '#edf1f6',
    borderRadius: 10,
    overflow: 'hidden'
  },
  progressBlockI: {
    height: 7,
    backgroundColor: '#edf1f6',
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    marginVertical: 6,
    marginHorizontal: 0
  },
  quotaI: {
    height: 7,
    backgroundColor: '#edf1f6',
    borderRadius: 10,
    overflow: 'hidden',
    flex: 1
  },
  miniJobI: {
    height: 7,
    backgroundColor: '#edf1f6',
    borderRadius: 10,
    overflow: 'hidden'
  },
  scoreBarsIB: {
    display: 'flex',
    height: '100%',
    borderRadius: 10
  },
  progressBlockIB: {
    display: 'flex',
    height: '100%',
    borderRadius: 10
  },
  quotaIB: {
    display: 'flex',
    height: '100%',
    borderRadius: 10
  },
  miniJobIB: {
    display: 'flex',
    height: '100%',
    borderRadius: 10
  },
  reviewListArticle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 15,
    padding: 19,
    marginBottom: 12
  },
  reviewHead: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  reviewHeadTime: {
    marginLeft: 'auto',
    color: '#6d7b92',
    fontSize: 12
  },
  reviewListP: {
    color: '#526178',
    marginVertical: 13,
    marginHorizontal: 0
  },
  companyCover: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 22
  },
  coverPattern: {
    height: 150,
    position: 'relative'
  },
  coverPatternAfter: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.5
  },
  companyIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    paddingTop: 0,
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  companyIdentityCompanyAvatar: {
    marginTop: -45,
    position: 'relative'
  },
  companyIdentityDivNthChild2: {
    flex: 1
  },
  companyIdentityP: {
    color: '#6d7b92'
  },
  companyStats: {
    display: 'flex',
    gap: 10,
    marginTop: 20
  },
  companyStatsDiv: {
    backgroundColor: '#f7f9fc',
    borderRadius: 11,
    padding: 14,
    textAlign: 'center'
  },
  companyStatsB: {
    display: 'flex',
    fontSize: 18
  },
  companyStatsSpan: {
    color: '#6d7b92',
    fontSize: 11
  },
  authWrap: {
    minHeight: 600,
    display: 'flex',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0'
  },
  authArt: {
    color: '#fff',
    padding: 60,
    display: 'flex',
    alignItems: 'center'
  },
  authMessage: {
    maxWidth: 390
  },
  authMessageLogoMark: {
    marginBottom: 25
  },
  authMessageH2: {
    fontSize: 34
  },
  authMessageP: {
    color: '#cbd7e8'
  },
  quote: {
    marginTop: 40,
    padding: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '0.18)',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  authCard: {
    padding: 55,
    alignSelf: 'center'
  },
  authCardWide: {
    maxWidth: 850,
    width: '100%'
  },
  authCardP: {
    color: '#6d7b92',
    marginBottom: 25
  },
  authWrapCompact: {
    display: 'flex'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontWeight: '600',
    color: '#40516a'
  },
  fieldInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9e1ec',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#16223a',
    width: '100%'
  },
  fieldSelect: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9e1ec',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#16223a',
    width: '100%'
  },
  fieldTextarea: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9e1ec',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#16223a',
    width: '100%'
  },
  select: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9e1ec',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#16223a',
    width: '100%'
  },
  input: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9e1ec',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#16223a',
    width: '100%'
  },
  textarea: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9e1ec',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#16223a',
    width: '100%'
  },
  fieldInputFocus: {
    borderColor: '#8cb5f8'
  },
  fieldSelectFocus: {
    borderColor: '#8cb5f8'
  },
  fieldTextareaFocus: {
    borderColor: '#8cb5f8'
  },
  inputFocus: {
    borderColor: '#8cb5f8'
  },
  selectFocus: {
    borderColor: '#8cb5f8'
  },
  textareaFocus: {
    borderColor: '#8cb5f8'
  },
  formGrid: {
    display: 'flex',
    gap: 15,
    marginBottom: 20
  },
  between: {
    display: 'flex',
    justifyContent: 'space-between',
    marginVertical: 15,
    marginHorizontal: 0
  },
  betweenA: {
    color: '#2463eb',
    fontWeight: '700'
  },
  authFootA: {
    color: '#2463eb',
    fontWeight: '700'
  },
  checkbox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    color: '#53647c',
    marginVertical: 12,
    marginHorizontal: 0
  },
  checkboxInput: {
    marginTop: 5
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#6d7b92',
    marginVertical: 17,
    marginHorizontal: 0
  },
  dividerBefore: {
    height: 1,
    backgroundColor: '#dfe6f0',
    flex: 1
  },
  dividerAfter: {
    height: 1,
    backgroundColor: '#dfe6f0',
    flex: 1
  },
  authFoot: {
    textAlign: 'center',
    color: '#6d7b92',
    marginTop: 20
  },
  stepper: {
    display: 'flex',
    gap: 0,
    marginBottom: 24
  },
  stepperSpan: {
    flex: 1,
    padding: 9,
    textAlign: 'center',
    backgroundColor: '#edf1f6',
    color: '#8290a3',
    fontWeight: '700',
    fontSize: 12,
    position: 'relative'
  },
  stepperSpanActive: {
    backgroundColor: '#e8f1ff',
    color: '#2463eb'
  },
  centerCard: {
    maxWidth: 620,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 20,
    padding: 45,
    textAlign: 'center'
  },
  centerCardNarrow: {
    maxWidth: 480
  },
  successIcon: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f7ef',
    color: '#16a273'
  },
  dangerIcon: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffe8eb',
    color: '#e34c57',
    fontSize: 28,
    fontWeight: '800'
  },
  statusRing: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f7ef',
    color: '#16a273'
  },
  statusRingPending: {
    backgroundColor: '#fff3d8',
    color: '#e89b1d'
  },
  centerCardP: {
    color: '#6d7b92'
  },
  centerCardA: {
    display: 'flex',
    color: '#2463eb',
    marginTop: 15
  },
  pricingHead: {
    textAlign: 'center',
    paddingVertical: 30,
    paddingHorizontal: 0
  },
  pricingHeadH2: {
    fontSize: 32
  },
  billingToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 12
  },
  billingToggleI: {
    width: 45,
    height: 24,
    borderRadius: 20,
    backgroundColor: '#2463eb',
    position: 'relative'
  },
  billingToggleIAfter: {
    position: 'absolute',
    width: 18,
    height: 18,
    backgroundColor: '#fff',
    borderRadius: '50%',
    right: 3,
    top: 3
  },
  pricingGrid: {
    display: 'flex',
    gap: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pricingGridArticle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 18,
    padding: 27,
    position: 'relative'
  },
  pricingGridArticleFeatured: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#2463eb',
    transform: [{ scale: 1.03 }]
  },
  recommended: {
    position: 'absolute',
    top: -13,
    left: '50%',
    backgroundColor: '#2463eb',
    color: '#fff',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 14,
    fontSize: 11,
    fontWeight: '700'
  },
  planPriceB: {
    fontSize: 40
  },
  planPriceSpan: {
    color: '#6d7b92'
  },
  pricingGridArticleP: {
    color: '#6d7b92',
    minHeight: 45
  },
  contactLayout: {
    display: 'flex',
    gap: 24
  },
  contactLayoutSection: {
    padding: 25
  },
  contactMethod: {
    display: 'flex',
    gap: 13,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 13,
    padding: 16,
    marginTop: 12
  },
  contactMethodSpan: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f1ff',
    color: '#2463eb'
  },
  contactMethodP: {
    margin: 0,
    color: '#6d7b92',
    fontSize: 12
  },
  documentLayout: {
    display: 'flex',
    gap: 22
  },
  documentLayoutAside: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5
  },
  documentLayoutAsideA: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 9
  },
  documentLayoutAsideAActive: {
    backgroundColor: '#e8f1ff',
    color: '#2463eb',
    fontWeight: '700'
  },
  prose: {
    padding: 35
  },
  proseH3: {
    marginTop: 30
  },
  proseP: {
    lineHeight: 28
  },
  updated: {
    fontSize: 12
  },
  dropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#bdc9d9',
    borderRadius: 12,
    padding: 20,
    textAlign: 'center',
    color: '#6d7b92',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  dropzoneStrong: {
    color: '#16223a'
  },
  switchRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  switchRowInput: {
    display: 'none'
  },
  switchRowI: {
    width: 42,
    height: 23,
    backgroundColor: '#2463eb',
    borderRadius: 20,
    position: 'relative'
  },
  switchRowIAfter: {
    position: 'absolute',
    width: 17,
    height: 17,
    backgroundColor: '#fff',
    borderRadius: '50%',
    right: 3,
    top: 3
  },
  appShell: {
    display: 'flex'
  },
  appSidebar: {
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#dfe6f0',
    paddingVertical: 19,
    paddingHorizontal: 15,
    width: 252,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 40
  },
  appSidebarAdmin: {
    backgroundColor: '#111e35',
    color: '#dae3f1',
    borderWidth: 0
  },
  appSidebarAdminWorkspace: {
    backgroundColor: '#213250'
  },
  appSidebarAdminNavAActive: {
    backgroundColor: '#213250'
  },
  appSidebarAdminNavA: {
    color: '#b6c4d8'
  },
  appSidebarBrand: {
    paddingTop: 2,
    paddingHorizontal: 8,
    paddingBottom: 19
  },
  workspace: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f2f6fc',
    borderRadius: 12,
    padding: 11,
    marginBottom: 15
  },
  workspaceDivLastChild: {
    minWidth: 0
  },
  workspaceStrong: {
    display: 'flex',
    overflow: 'hidden'
  },
  workspaceSpan: {
    display: 'flex',
    overflow: 'hidden',
    fontSize: 11,
    color: '#6d7b92'
  },
  appSidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    overflow: 'scroll'
  },
  appSidebarNavA: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 10,
    paddingHorizontal: 11,
    borderRadius: 10,
    color: '#586980',
    fontWeight: '600'
  },
  appSidebarNavAActive: {
    backgroundColor: '#eaf2ff',
    color: '#2463eb'
  },
  appSidebarNavABadge: {
    marginLeft: 'auto'
  },
  sidebarFoot: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#dfe6f0',
    paddingTop: 10
  },
  sidebarFootA: {
    display: 'flex',
    gap: 9,
    color: '#6d7b92',
    padding: 9
  },
  miniProfile: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginTop: 7,
    padding: 8
  },
  miniProfileDivLastChild: {
    display: 'flex',
    flexDirection: 'column'
  },
  miniProfileSpan: {
    fontSize: 11,
    color: '#6d7b92'
  },
  appContent: {
    minWidth: 0
  },
  appTopbar: {
    height: 66,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0',
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 27,
    top: 0,
    zIndex: 30
  },
  breadcrumb: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    color: '#8390a4',
    fontSize: 12
  },
  breadcrumbStrong: {
    color: '#16223a'
  },
  topActions: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 9
  },
  notificationDot: {
    position: 'relative'
  },
  notificationDotAfter: {
    position: 'absolute',
    width: 7,
    height: 7,
    backgroundColor: '#e34c57',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderRadius: '50%',
    right: 6,
    top: 5
  },
  dashboardMain: {
    paddingTop: 0,
    paddingHorizontal: 28,
    paddingBottom: 50,
    maxWidth: 1500
  },
  appRoute: {
    marginTop: 13
  },
  pageTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 24,
    paddingHorizontal: 0,
    paddingBottom: 20
  },
  pageTitleActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  },
  statsGrid: {
    display: 'flex',
    gap: 15,
    marginBottom: 20
  },
  kpiCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 15,
    padding: 17
  },
  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  iconBox: {
    width: 39,
    height: 39,
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f1ff',
    color: '#2463eb'
  },
  kpiValue: {
    fontSize: 27,
    fontWeight: '800',
    marginTop: 10
  },
  kpiTitle: {
    fontWeight: '700'
  },
  kpiNote: {
    fontSize: 11,
    color: '#6d7b92',
    marginTop: 3
  },
  welcomeCard: {
    color: '#fff',
    borderRadius: 18,
    paddingVertical: 25,
    paddingHorizontal: 28,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative'
  },
  planCurrent: {
    color: '#fff',
    borderRadius: 18,
    paddingVertical: 25,
    paddingHorizontal: 28,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between'
  },
  welcomeCardAfter: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderWidth: 55,
    borderStyle: 'solid',
    borderColor: '0.08)',
    borderRadius: '50%',
    right: -60,
    top: -120
  },
  welcomeCardDivFirstChild: {
    flex: 1
  },
  welcomeCardH2: {
    fontSize: 25,
    marginVertical: 2,
    marginHorizontal: 0
  },
  welcomeCardP: {
    margin: 0,
    color: '#d4e1f4'
  },
  welcomeCardBtn: {
    position: 'relative',
    zIndex: 2
  },
  dashboardGrid: {
    display: 'flex',
    gap: 18
  },
  twoCol: {
    display: 'flex',
    gap: 18
  },
  tableWrap: {
    overflow: 'scroll',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0'
  },
  table: {
    width: '100%'
  },
  th: {
    textAlign: 'left',
    backgroundColor: '#f7f9fc',
    color: '#65748a',
    fontSize: 11,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0'
  },
  td: {
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f6',
    fontSize: 13
  },
  tbodyTrLastChildTd: {
    borderBottomWidth: 0
  },
  tbodyTrHover: {
    backgroundColor: '#fafcff'
  },
  miniJob: {
    marginVertical: 16,
    marginHorizontal: 0
  },
  miniJobStrong: {
    display: 'flex'
  },
  miniJobSpan: {
    display: 'flex',
    color: '#6d7b92',
    fontSize: 12,
    marginTop: 3,
    marginHorizontal: 0,
    marginBottom: 8
  },
  fakeChart: {
    height: 240,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 12,
    paddingTop: 25,
    paddingHorizontal: 10,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0'
  },
  fakeChartDiv: {
    flex: 1
  },
  fakeChartTall: {
    height: 300
  },
  chatShell: {
    display: 'flex',
    height: 650,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 17,
    overflow: 'hidden'
  },
  chatList: {
    borderRightWidth: 1,
    borderRightColor: '#dfe6f0',
    overflow: 'scroll'
  },
  chatSearch: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    margin: 13,
    backgroundColor: '#f4f7fb',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    color: '#6d7b92'
  },
  chatSearchInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 7
  },
  chatPerson: {
    display: 'flex',
    gap: 10,
    padding: 13,
    borderTopWidth: 1,
    borderTopColor: '#edf1f6',
    alignItems: 'center'
  },
  chatPersonActive: {
    backgroundColor: '#edf4ff'
  },
  chatPersonDivNthChild2: {
    minWidth: 0
  },
  chatPersonStrong: {
    display: 'flex',
    overflow: 'hidden'
  },
  chatPersonSpan: {
    display: 'flex',
    overflow: 'hidden',
    fontSize: 11,
    color: '#6d7b92'
  },
  chatPersonTime: {
    fontSize: 10,
    color: '#6d7b92'
  },
  chatMain: {
    display: 'flex',
    minWidth: 0
  },
  chatMainHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0'
  },
  chatMainHeaderDivNthChild2: {
    display: 'flex',
    flexDirection: 'column'
  },
  chatMainHeaderSpan: {
    color: '#6d7b92',
    fontSize: 11
  },
  chatMainHeaderIconBtn: {
    marginLeft: 'auto'
  },
  messages: {
    padding: 24,
    overflow: 'scroll',
    backgroundColor: '#f7f9fc'
  },
  message: {
    maxWidth: '65%',
    marginBottom: 15
  },
  messageP: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    margin: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0'
  },
  messageTime: {
    fontSize: 10,
    color: '#6d7b92',
    display: 'flex',
    marginTop: 4
  },
  messageMine: {
    marginLeft: 'auto'
  },
  messageMineP: {
    backgroundColor: '#2463eb',
    color: '#fff',
    borderColor: '#2463eb'
  },
  messageMineTime: {
    textAlign: 'right'
  },
  chatMainFooter: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#dfe6f0'
  },
  chatMainFooterInput: {
    flex: 1
  },
  reviewEditor: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 23
  },
  reviewTarget: {
    display: 'flex',
    alignItems: 'center',
    gap: 13,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0',
    marginBottom: 15
  },
  reviewTargetDivNthChild2: {
    flex: 1
  },
  ratingRow: {
    display: 'flex',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f6'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 18
  },
  attendanceHero: {
    color: '#fff',
    borderRadius: 19,
    padding: 28,
    display: 'flex',
    gap: 30,
    alignItems: 'center',
    marginBottom: 19
  },
  attendanceHeroDivFirstChildSpan: {
    display: 'flex',
    color: '#d4e1f5'
  },
  attendanceHeroDivFirstChildP: {
    display: 'flex',
    color: '#d4e1f5'
  },
  attendanceHeroDivFirstChildStrong: {
    display: 'flex',
    fontSize: 42,
    letterSpacing: 1
  },
  clockActions: {
    display: 'flex',
    gap: 11
  },
  clockBtn: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '0.23)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#fff',
    borderRadius: 15,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  clockBtnPrimary: {
    backgroundColor: '#fff',
    color: '#2463eb'
  },
  clockBtnDanger: {
    backgroundColor: '#d84c5b',
    borderColor: '#d84c5b'
  },
  clockBtnB: {
    fontSize: 18
  },
  clockBtnSpan: {
    fontSize: 10,
    opacity: 0.8
  },
  calendar: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 18
  },
  calendarHead: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  calendarHeadH3: {
    margin: 0,
    minWidth: 150,
    textAlign: 'center'
  },
  week: {
    display: 'flex'
  },
  days: {
    display: 'flex'
  },
  weekSpan: {
    textAlign: 'center',
    fontSize: 11,
    color: '#6d7b92',
    padding: 10
  },
  calDay: {
    minHeight: 90,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#edf1f6',
    marginTop: -1,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: -1,
    padding: 8
  },
  calDayMuted: {
    backgroundColor: '#fafbfc',
    color: '#b6bfcb'
  },
  calEvent: {
    display: 'flex',
    fontSize: 9,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginTop: 7
  },
  calEventBlue: {
    backgroundColor: '#e8f1ff',
    color: '#2463eb'
  },
  calEventGreen: {
    backgroundColor: '#e4f7ef',
    color: '#16a273'
  },
  leaveBalance: {
    textAlign: 'center',
    padding: 25,
    backgroundColor: '#f7f9fc',
    borderRadius: 13
  },
  leaveBalanceStrong: {
    display: 'flex',
    fontSize: 42,
    color: '#2463eb'
  },
  notice: {
    backgroundColor: '#eef4ff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d5e4ff',
    color: '#405b84',
    borderRadius: 11,
    padding: 12,
    marginVertical: 14,
    marginHorizontal: 0
  },
  permissionNote: {
    backgroundColor: '#eef4ff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d5e4ff',
    color: '#405b84',
    borderRadius: 11,
    padding: 12,
    marginVertical: 14,
    marginHorizontal: 0
  },
  planAlert: {
    backgroundColor: '#eef4ff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d5e4ff',
    color: '#405b84',
    borderRadius: 11,
    padding: 12,
    marginVertical: 14,
    marginHorizontal: 0
  },
  exportPreview: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 12,
    padding: 15,
    marginTop: 20
  },
  evidenceBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    gap: 12
  },
  exportPreviewDiv: {
    display: 'flex',
    gap: 12
  },
  exportPreviewDivDiv: {
    display: 'flex',
    flexDirection: 'column'
  },
  evidenceBoxDiv: {
    display: 'flex',
    flexDirection: 'column'
  },
  monthlyClose: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  profileCover: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 18,
    padding: 24,
    marginBottom: 18
  },
  profileCoverDivNthChild2: {
    flex: 1
  },
  profileCoverP: {
    color: '#6d7b92'
  },
  compactCover: {
    padding: 18
  },
  skillList: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  skillListSpan: {
    backgroundColor: '#eef4ff',
    color: '#315f9e',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '600'
  },
  timeline: {
    borderLeftWidth: 2,
    borderLeftColor: '#dce5f1',
    marginLeft: 8,
    paddingLeft: 20
  },
  timelineDiv: {
    position: 'relative',
    paddingBottom: 19
  },
  timelineDivBefore: {
    position: 'absolute',
    left: -27,
    top: 5,
    width: 11,
    height: 11,
    borderRadius: '50%',
    backgroundColor: '#2463eb',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#e8f1ff'
  },
  timelineB: {
    display: 'flex',
    fontSize: 11,
    color: '#2463eb'
  },
  timelineStrong: {
    display: 'flex'
  },
  timelineP: {
    display: 'flex',
    color: '#6d7b92',
    marginVertical: 2,
    marginHorizontal: 0
  },
  infoList: {
    margin: 0
  },
  infoListDiv: {
    display: 'flex',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f6'
  },
  infoListDt: {
    color: '#6d7b92'
  },
  infoListDd: {
    margin: 0,
    fontWeight: '600'
  },
  documentGrid: {
    display: 'flex',
    gap: 14
  },
  documentGridArticle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 14,
    padding: 16,
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  docIcon: {
    width: 46,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f1ff',
    color: '#2463eb',
    borderRadius: 12
  },
  documentGridArticleDivNthChild2: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  documentGridSpan: {
    fontSize: 11,
    color: '#6d7b92'
  },
  documentGridSmall: {
    fontSize: 11,
    color: '#6d7b92'
  },
  documentGridIconBtn: {
    marginLeft: 'auto'
  },
  tabs: {
    display: 'flex',
    gap: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 12,
    padding: 5,
    marginBottom: 17,
    maxWidth: '100%',
    overflow: 'scroll'
  },
  tabsButton: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 8,
    color: '#6d7b92'
  },
  tabsButtonActive: {
    backgroundColor: '#e8f1ff',
    color: '#2463eb',
    fontWeight: '700'
  },
  selectionStep: {
    display: 'flex',
    gap: 5,
    marginBottom: 25
  },
  selectionStepDiv: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    textAlign: 'center',
    backgroundColor: '#edf1f6',
    color: '#8090a6',
    fontSize: 11,
    fontWeight: '700',
    borderRadius: 7
  },
  selectionStepDone: {
    backgroundColor: '#e4f7ef',
    color: '#16a273'
  },
  selectionStepActive: {
    backgroundColor: '#e8f1ff',
    color: '#2463eb'
  },
  scheduleCard: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 15
  },
  scheduleCardDiv: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  nextSteps: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 25,
    marginHorizontal: 0
  },
  nextStepsSpan: {
    backgroundColor: '#f1f5fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 11
  },
  modalDemo: {
    minHeight: 520,
    backgroundColor: 'rgba(16, 33, 63, 0.1)',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 25
  },
  offerHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 15
  },
  offerHeadSuccessIcon: {
    margin: 0
  },
  offerDetails: {
    display: 'flex',
    gap: 10,
    marginVertical: 20,
    marginHorizontal: 0
  },
  offerDetailsDiv: {
    backgroundColor: '#f7f9fc',
    borderRadius: 11,
    padding: 13
  },
  offerDetailsSpan: {
    display: 'flex',
    color: '#6d7b92',
    fontSize: 11
  },
  offerDetailsB: {
    display: 'flex'
  },
  notificationList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 15,
    overflow: 'hidden'
  },
  notification: {
    display: 'flex',
    gap: 12,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f6'
  },
  notificationUnread: {
    backgroundColor: '#f3f7ff'
  },
  notificationP: {
    marginVertical: 2,
    marginHorizontal: 0,
    color: '#6d7b92'
  },
  notificationTime: {
    fontSize: 10,
    color: '#91a0b4'
  },
  settingsLayout: {
    display: 'flex',
    gap: 18
  },
  roleGrid: {
    display: 'flex',
    gap: 18
  },
  orgLayout: {
    display: 'flex',
    gap: 18
  },
  settingsLayoutAside: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5
  },
  roleGridAside: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5
  },
  settingsLayoutAsideButton: {
    borderWidth: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    textAlign: 'left',
    color: '#63748b'
  },
  roleGridAsideButton: {
    borderWidth: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    textAlign: 'left',
    color: '#63748b'
  },
  settingsLayoutAsideButtonActive: {
    backgroundColor: '#e8f1ff',
    color: '#2463eb',
    fontWeight: '700'
  },
  roleGridAsideButtonActive: {
    backgroundColor: '#e8f1ff',
    color: '#2463eb',
    fontWeight: '700'
  },
  roleGridAsideButtonStrong: {
    display: 'flex'
  },
  roleGridAsideButtonSpan: {
    display: 'flex',
    fontSize: 10,
    color: '#6d7b92'
  },
  permissionGrid: {
    display: 'flex',
    gap: 10
  },
  permissionGridLabel: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    gap: 8
  },
  quota: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 13,
    padding: 14,
    marginBottom: 16
  },
  quotaDivSpan: {
    display: 'flex'
  },
  quotaDivStrong: {
    display: 'flex'
  },
  editorLayout: {
    display: 'flex',
    gap: 18
  },
  editorHelp: {
    backgroundColor: '#eef4ff',
    borderRadius: 15,
    padding: 20
  },
  lineChartSvg: {
    width: '100%',
    height: 240
  },
  donutWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 25
  },
  donut: {
    width: 145,
    height: 145,
    borderRadius: '50%',
    position: 'relative'
  },
  donutAfter: {
    position: 'absolute',
    top: 30,
    right: 30,
    bottom: 30,
    left: 30,
    backgroundColor: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700'
  },
  donutWrapUl: {
    padding: 0
  },
  donutWrapLi: {
    marginVertical: 9,
    marginHorizontal: 0
  },
  donutWrapLiI: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    marginRight: 7
  },
  c1: {
    backgroundColor: '#2463eb'
  },
  c2: {
    backgroundColor: '#67a3f6'
  },
  c3: {
    backgroundColor: '#54c79b'
  },
  c4: {
    backgroundColor: '#dfe6f0'
  },
  toolbar: {
    display: 'flex',
    gap: 9,
    marginBottom: 15
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    flex: 1,
    color: '#6d7b92'
  },
  searchBoxInput: {
    borderWidth: 0
  },
  candidateMini: {
    display: 'flex',
    gap: 11,
    alignItems: 'center',
    marginBottom: 15
  },
  candidateMiniDivLastChild: {
    display: 'flex',
    flexDirection: 'column'
  },
  actionPanelLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    marginBottom: 12
  },
  orgTree: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfe6f0',
    borderRadius: 16,
    padding: 35
  },
  orgNode: {
    backgroundColor: '#edf4ff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#bfd5f6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    textAlign: 'center',
    fontWeight: '700'
  },
  orgNodeSpan: {
    color: '#6d7b92',
    fontSize: 11,
    marginLeft: 8
  },
  orgNodeRoot: {
    maxWidth: 300,
    backgroundColor: '#dfeeff'
  },
  orgChildren: {
    display: 'flex',
    gap: 10,
    marginTop: 50,
    position: 'relative'
  },
  orgChildrenBefore: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    top: -25,
    height: 1,
    backgroundColor: '#b8c6d8'
  },
  planCurrentP: {
    margin: 0,
    color: '#d3e2f7'
  },
  currentPrice: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right'
  },
  currentPriceB: {
    fontSize: 28
  },
  currentPriceSpan: {
    fontSize: 11,
    color: '#d4e0f1'
  },
  invoiceLinesDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0'
  },
  invoiceLinesDiscount: {
    color: '#16a273'
  },
  invoiceLinesTotal: {
    fontSize: 18
  },
  creditCard: {
    height: 175,
    borderRadius: 18,
    padding: 23,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 13
  },
  creditCardB: {
    fontSize: 19,
    letterSpacing: 2
  },
  nextBill: {
    textAlign: 'center',
    padding: 20
  },
  nextBillStrong: {
    display: 'flex',
    fontSize: 36
  },
  nextBillSpan: {
    color: '#6d7b92'
  },
  moderationHead: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  moderationHeadSpan: {
    color: '#6d7b92'
  },
  metricListDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0'
  },
  metricListB: {
    fontSize: 17
  },
  placeholderVisual: {
    textAlign: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c8d3e2',
    borderRadius: 14,
    color: '#6d7b92'
  },
  placeholderVisualSpan: {
    display: 'flex',
    color: '#2463eb'
  },
  narrowContent: {
    maxWidth: 850,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  progressBlock: {
    marginTop: 20
  },
  progressBlockDiv: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  pricingMeter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: '#f7f9fc',
    borderRadius: 12
  },
  pricingMeterStrong: {
    fontSize: 25,
    color: '#2463eb'
  },
  reviewTimeline: {
    marginVertical: 25,
    marginHorizontal: 0,
    textAlign: 'left'
  },
  reviewTimelineDiv: {
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 37,
    borderLeftWidth: 2,
    borderLeftColor: '#dfe6f0',
    position: 'relative'
  },
  reviewTimelineDivBefore: {
    width: 13,
    height: 13,
    borderRadius: '50%',
    position: 'absolute',
    left: -8,
    top: 17,
    backgroundColor: '#c5cfdd'
  },
  reviewTimelineDoneBefore: {
    backgroundColor: '#16a273'
  },
  reviewTimelineActiveBefore: {
    backgroundColor: '#e89b1d'
  },
  reviewTimelineSpan: {
    color: '#6d7b92',
    fontSize: 11
  }
})

export const tabletStyles = StyleSheet.create({
  heroVisual: {
    display: 'none'
  },
  appSidebar: {
    width: 78
  },
  appSidebarBrandStrong: {
    display: 'none'
  },
  workspaceDivLastChild: {
    display: 'none'
  },
  appSidebarNavASpan: {
    display: 'none'
  },
  appSidebarNavABadge: {
    display: 'none'
  },
  sidebarFootA: {
    display: 'none'
  },
  miniProfileDivLastChild: {
    display: 'none'
  },
  appSidebarBrand: {
    justifyContent: 'center'
  },
  workspace: {
    justifyContent: 'center',
    padding: 8
  },
  appSidebarNavA: {
    justifyContent: 'center'
  }
})

export const mobileStyles = StyleSheet.create({
  body: {
    fontSize: 13
  },
  publicHeader: {
    paddingVertical: 0,
    paddingHorizontal: 15
  },
  publicHeaderNav: {
    display: 'none'
  },
  headerActions: {
    display: 'none'
  },
  mobileMenu: {
    display: 'flex',
    marginLeft: 'auto'
  },
  publicMain: {
    paddingTop: 0,
    paddingHorizontal: 15,
    paddingBottom: 45
  },
  publicPageTitle: {
    flexDirection: 'column',
    gap: 10
  },
  pageTitle: {
    flexDirection: 'column',
    gap: 10
  },
  hero: {
    paddingVertical: 55,
    paddingHorizontal: 0
  },
  heroCopyH1: {
    fontSize: 34
  },
  heroSearchDiv: {
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0'
  },
  heroNumbers: {
    gap: 15,
    flexWrap: 'wrap'
  },
  publicFooter: {
    display: 'flex',
    paddingVertical: 30,
    paddingHorizontal: 18
  },
  publicFooterP: {
    marginVertical: 12,
    marginHorizontal: 0
  },
  publicFooterSmall: {
    margin: 0
  },
  appShell: {
    display: 'flex'
  },
  appSidebar: {
    width: 252
  },
  appSidebarOpen: {
    transform: [{ translateX: 0 }]
  },
  appContent: {
    marginLeft: 0
  },
  dashboardMain: {
    paddingTop: 0,
    paddingHorizontal: 15,
    paddingBottom: 40
  },
  appTopbar: {
    paddingVertical: 0,
    paddingHorizontal: 15
  },
  breadcrumb: {
    display: 'none'
  },
  appTopbarMobileMenu: {
    display: 'flex',
    margin: 0
  },
  chatShell: {
    height: 720
  },
  chatList: {
    display: 'none'
  },
  detailLayout: {
    display: 'flex'
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  routeBanner: {
    overflow: 'scroll'
  },
  routeBannerA: {
    display: 'none'
  },
  pageTitleActions: {
    flexWrap: 'wrap'
  },
  scoreBlock: {
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6f0',
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 15
  },
  scoreBars: {
    paddingTop: 15,
    paddingHorizontal: 0,
    paddingBottom: 0
  },
  ratingRowStrong: {
    display: 'none'
  },
  calendarCalDay: {
    minHeight: 65,
    padding: 4
  },
  pricingMeter: {
    flexDirection: 'column'
  },
  authArt: {
    display: 'none'
  },
  authCard: {
    padding: 25
  },
  sectionHeading: {
    alignItems: 'flex-start'
  },
  sectionHeadingBtn: {
    fontSize: 11
  },
  tableWrap: {
    borderRadius: 10
  }
})
