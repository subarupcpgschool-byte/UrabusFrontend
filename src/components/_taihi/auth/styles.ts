import { Platform, StyleSheet } from 'react-native'

export const authColors = {
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
  danger: '#c43b4d'
} as const

export const authStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authColors.white
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: authColors.white
  },
  headerBorder: {
    backgroundColor: authColors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: authColors.hairline
  },
  headerInner: {
    width: '100%',
    maxWidth: 1180,
    minHeight: 64,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20
  },
  logoLink: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: authColors.blueDeep,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.1
  },
  backToJobsButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: authColors.hairline,
    borderRadius: 999,
    backgroundColor: authColors.white
  },
  backToJobsText: {
    color: authColors.blueDeep,
    fontSize: 13,
    fontWeight: '700'
  },
  page: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    flex: 1,
    paddingTop: 36,
    paddingBottom: 46,
    gap: 36
  },
  pageDesktop: {
    minHeight: 700,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  brandPanel: {
    flex: 1.05,
    minHeight: 630,
    padding: 46,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(47, 111, 203, 0.10)'
  },
  brandGlowTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    right: -90,
    top: -100,
    borderRadius: 999,
    backgroundColor: 'rgba(111, 192, 240, 0.26)'
  },
  brandGlowBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    left: -100,
    bottom: -110,
    borderRadius: 999,
    backgroundColor: 'rgba(47, 111, 203, 0.10)'
  },
  brandContent: {
    zIndex: 1
  },
  brandIconShell: {
    alignSelf: 'flex-start',
    padding: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    marginBottom: 28
  },
  brandIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    maxWidth: 420,
    color: authColors.ink,
    fontSize: 34,
    lineHeight: 47,
    fontWeight: '900',
    marginBottom: 16
  },
  brandDescription: {
    maxWidth: 440,
    color: authColors.muted,
    fontSize: 15,
    lineHeight: 26
  },
  benefitList: {
    marginTop: 38,
    gap: 20
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13
  },
  benefitIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: authColors.white,
    borderWidth: 1,
    borderColor: 'rgba(47, 111, 203, 0.12)'
  },
  benefitTextGroup: {
    flex: 1,
    paddingTop: 1
  },
  benefitTitle: {
    color: authColors.blueDeep,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3
  },
  benefitText: {
    color: authColors.muted,
    fontSize: 12,
    lineHeight: 19
  },
  miniCard: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(47, 111, 203, 0.10)'
  },
  miniCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: authColors.chipBg
  },
  miniCardText: {
    flex: 1
  },
  miniCardTitle: {
    color: authColors.blueDeep,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2
  },
  miniCardDescription: {
    color: authColors.muted,
    fontSize: 11,
    lineHeight: 17
  },
  formColumn: {
    width: '100%',
    maxWidth: 570,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  formColumnDesktop: {
    flex: 0.95,
    maxWidth: 520
  },
  formCard: {
    width: '100%',
    padding: 34,
    backgroundColor: authColors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: authColors.hairline,
    shadowColor: authColors.blueDeep,
    shadowOpacity: 0.11,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 15 },
    elevation: 4
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14
  },
  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: authColors.skyLight,
    shadowColor: authColors.skyLight,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 }
  },
  eyebrowText: {
    color: authColors.blueDeep,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8
  },
  title: {
    color: authColors.ink,
    fontSize: 31,
    lineHeight: 43,
    fontWeight: '900',
    marginBottom: 9
  },
  titleMobile: {
    fontSize: 27,
    lineHeight: 38
  },
  description: {
    color: authColors.muted,
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 27
  },
  formFields: {
    gap: 18
  },
  fieldGroup: {
    gap: 7
  },
  label: {
    color: authColors.blueDeep,
    fontSize: 13,
    fontWeight: '700'
  },
  inputShell: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: authColors.hairline,
    borderRadius: 13,
    backgroundColor: authColors.white
  },
  inputShellFocused: {
    borderColor: authColors.blue,
    shadowColor: authColors.blue,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 }
  },
  inputShellError: {
    borderColor: authColors.danger
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Platform.OS === 'web' ? 14 : 11,
    color: authColors.ink,
    fontSize: 15,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {})
  },
  errorText: {
    color: authColors.danger,
    fontSize: 11,
    lineHeight: 17
  },
  formOptions: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12
  },
  termsBlock: {
    marginTop: 18,
    gap: 6
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flexShrink: 1
  },
  checkbox: {
    width: 20,
    height: 20,
    flexShrink: 0,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: authColors.hairline,
    backgroundColor: authColors.white
  },
  checkboxChecked: {
    borderColor: authColors.blue,
    backgroundColor: authColors.blue
  },
  checkText: {
    flexShrink: 1,
    color: authColors.muted,
    fontSize: 12,
    lineHeight: 19
  },
  inlineLink: {
    color: authColors.blue,
    fontWeight: '700'
  },
  textLinkButton: {
    paddingVertical: 2
  },
  textLink: {
    color: authColors.blue,
    fontSize: 12,
    fontWeight: '700'
  },
  submitButton: {
    minHeight: 54,
    marginTop: 24,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: authColors.blueDeep,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  submitButtonPressed: {
    opacity: 0.88,
    transform: [{ translateY: 1 }]
  },
  submitButtonDisabled: {
    opacity: 0.58
  },
  submitGradient: {
    minHeight: 54,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9
  },
  submitText: {
    color: authColors.white,
    fontSize: 15,
    fontWeight: '800'
  },
  dividerRow: {
    marginVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: authColors.hairline
  },
  dividerText: {
    color: authColors.muted,
    fontSize: 11
  },
  googleButton: {
    minHeight: 50,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: authColors.hairline,
    borderRadius: 999,
    backgroundColor: authColors.white
  },
  secondaryPressed: {
    backgroundColor: authColors.mist
  },
  googleMark: {
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: authColors.hairline,
    backgroundColor: authColors.white
  },
  googleMarkText: {
    color: '#4285f4',
    fontSize: 13,
    fontWeight: '900'
  },
  googleButtonText: {
    color: authColors.ink,
    fontSize: 14,
    fontWeight: '700'
  },
  switchRow: {
    marginTop: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6
  },
  switchLabel: {
    color: authColors.muted,
    fontSize: 12
  },
  switchButton: {
    paddingVertical: 3
  },
  switchAction: {
    color: authColors.blue,
    fontSize: 12,
    fontWeight: '800'
  },
  accountTypeDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 22,
    backgroundColor: authColors.hairline
  },
  businessEntryButton: {
    minHeight: 64,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(47, 111, 203, 0.14)',
    backgroundColor: '#f7faff'
  },
  businessEntryIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: authColors.white,
    borderWidth: 1,
    borderColor: 'rgba(47, 111, 203, 0.12)'
  },
  businessEntryTextGroup: {
    flex: 1
  },
  businessEntryTitle: {
    color: authColors.blueDeep,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2
  },
  businessEntryDescription: {
    color: authColors.muted,
    fontSize: 11
  },
  securityNote: {
    marginTop: 15,
    textAlign: 'center',
    color: authColors.muted,
    fontSize: 11
  }
})
