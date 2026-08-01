import { Platform, StyleSheet } from 'react-native'

export const colors = {
  white: '#ffffff',
  mist: '#eff5fc',
  skyLight: '#6fc0f0',
  sky: '#4a8fe0',
  blue: '#2f6fcb',
  blueDeep: '#14284d',
  ink: '#101c2c',
  muted: '#5b6b85',
  hairline: 'rgba(20, 40, 77, 0.14)',
  chipBg: '#edf4fb',
  overlay: 'rgba(16, 28, 44, 0.45)'
} as const

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white
  },
  scrollContent: {
    flexGrow: 1
  },
  hero: {
    paddingTop: 42,
    paddingBottom: 34
  },
  content: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center'
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18
  },
  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.skyLight,
    shadowColor: colors.skyLight,
    shadowOpacity: 0.45,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 }
  },
  eyebrowText: {
    color: colors.blueDeep,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2.1
  },
  heading: {
    color: colors.ink,
    fontSize: 38,
    lineHeight: 53,
    fontWeight: '900',
    marginBottom: 28
  },
  headingMobile: {
    fontSize: 27,
    lineHeight: 39
  },
  headingAccent: {
    color: colors.blue
  },
  searchForm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: 14,
    padding: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 20,
    shadowColor: colors.blueDeep,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3
  },
  searchFormMobile: {
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  field: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 160,
    minWidth: 150,
    gap: 6
  },
  fieldKeyword: {
    flexGrow: 2,
    flexBasis: 260,
    minWidth: 240
  },
  fieldMobile: {
    width: '100%',
    minWidth: 0,
    flexBasis: 'auto'
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500'
  },
  input: {
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 11 : 9,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 10,
    backgroundColor: colors.white,
    color: colors.ink,
    fontSize: 15,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {})
  },
  pickerShell: {
    minHeight: 46,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: 'hidden'
  },
  picker: {
    width: '100%',
    minHeight: 44,
    color: colors.ink,
    backgroundColor: colors.white,
    borderWidth: 0
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 26,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden'
  },
  buttonMobile: {
    width: '100%'
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }]
  },
  buttonTextPrimary: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700'
  },
  mapSelectButton: {
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.blue
  },
  mapSelectText: {
    color: colors.blueDeep,
    fontSize: 15,
    fontWeight: '700'
  },
  areaSummary: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    padding: 9,
    paddingRight: 14,
    backgroundColor: colors.chipBg,
    borderRadius: 16
  },
  areaMapFrame: {
    width: 88,
    height: 88,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.white
  },
  areaSummaryText: {
    flexShrink: 1,
    gap: 3
  },
  areaSummaryTitle: {
    color: colors.blueDeep,
    fontSize: 13,
    fontWeight: '600'
  },
  areaSummarySub: {
    color: colors.muted,
    fontSize: 12
  },
  clearButton: {
    width: 26,
    height: 26,
    marginLeft: 2,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  quickFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 19
  },
  quickFilter: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: colors.chipBg
  },
  quickFilterPressed: {
    borderColor: colors.blue
  },
  quickFilterActive: {
    backgroundColor: colors.blueDeep
  },
  quickFilterText: {
    color: colors.blueDeep,
    fontSize: 13,
    fontWeight: '500'
  },
  quickFilterTextActive: {
    color: colors.white
  },
  results: {
    paddingTop: 56,
    paddingBottom: 96,
    backgroundColor: colors.white
  },
  resultsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 26
  },
  resultsCount: {
    color: colors.muted,
    fontSize: 14
  },
  resultsCountStrong: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700'
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  sortLabel: {
    color: colors.muted,
    fontSize: 13
  },
  sortPickerShell: {
    width: 150,
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.white
  },
  sortPicker: {
    width: '100%',
    minHeight: 38,
    color: colors.ink,
    backgroundColor: colors.white
  },
  jobList: {
    gap: 16
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    paddingHorizontal: 26,
    paddingVertical: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 18,
    shadowColor: colors.blueDeep,
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1
  },
  jobCardMobile: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 18
  },
  logoGradient: {
    width: 52,
    height: 52,
    flexShrink: 0,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  jobLogoText: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '700'
  },
  jobBody: {
    flex: 1,
    minWidth: 0
  },
  jobTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4
  },
  jobCompany: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 11
  },
  jobMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 10
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  jobMetaText: {
    color: colors.muted,
    fontSize: 13
  },
  jobTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.chipBg
  },
  chipText: {
    color: colors.blueDeep,
    fontSize: 12,
    fontWeight: '500'
  },
  ghostButton: {
    flexShrink: 0,
    minHeight: 46,
    paddingHorizontal: 22,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline
  },
  ghostButtonMobile: {
    width: '100%'
  },
  ghostButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 16
  },
  emptyTitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 16,
    marginBottom: 5,
    textAlign: 'center'
  },
  emptySub: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center'
  },
  pagination: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22
  },
  pageLink: {
    color: colors.blueDeep,
    fontSize: 14,
    fontWeight: '600'
  },
  pageStatus: {
    color: colors.muted,
    fontSize: 14
  },
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay
  },
  modalCard: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '92%',
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.ink,
    shadowOpacity: 0.28,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12
  },
  modalHeader: {
    minHeight: 62,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline
  },
  modalTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700'
  },
  modalClose: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalHint: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 12,
    color: colors.muted,
    fontSize: 13
  },
  mapContainer: {
    width: '100%',
    height: 340,
    backgroundColor: colors.mist
  },
  modalControls: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 16
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  radiusLabel: {
    color: colors.muted,
    fontSize: 13
  },
  slider: {
    flex: 1,
    height: 36
  },
  radiusValue: {
    minWidth: 52,
    color: colors.blueDeep,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 11
  },
  modalActionMobile: {
    flex: 1,
    minWidth: 130
  }
})
