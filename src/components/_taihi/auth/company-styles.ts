import { Platform, StyleSheet } from 'react-native'

export const companyAuthStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F8FD'
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32
  },
  container: {
    width: '100%',
    maxWidth: 1060,
    alignSelf: 'center',
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCE6F2',
    shadowColor: '#14284D',
    shadowOffset: {
      width: 0,
      height: 18
    },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8
  },
  introduction: {
    flex: 1,
    minHeight: 500,
    padding: 40,
    backgroundColor: '#EAF3FC'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 52
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14284D'
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800'
  },
  brandName: {
    color: '#14284D',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1
  },
  brandSub: {
    marginTop: 2,
    color: '#2F6FCB',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 16
  },
  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6FC0F0'
  },
  eyebrowText: {
    color: '#2F6FCB',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8
  },
  introductionTitle: {
    maxWidth: 390,
    color: '#101C2C',
    fontSize: 32,
    lineHeight: 45,
    fontWeight: '800'
  },
  introductionDescription: {
    maxWidth: 410,
    marginTop: 18,
    color: '#596B84',
    fontSize: 15,
    lineHeight: 27
  },
  featureList: {
    marginTop: 32,
    gap: 15
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  featureIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9EBFA'
  },
  featureIconText: {
    color: '#2F6FCB',
    fontSize: 13,
    fontWeight: '800'
  },
  featureText: {
    flex: 1,
    color: '#344B68',
    fontSize: 14,
    fontWeight: '600'
  },
  companyCodeBox: {
    alignSelf: 'flex-start',
    marginTop: 38,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E5F3'
  },
  companyCodeLabel: {
    color: '#7A8BA2',
    fontSize: 11,
    fontWeight: '600'
  },
  companyCode: {
    marginTop: 3,
    color: '#14284D',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  companyCodeError: {
    alignSelf: 'flex-start',
    marginTop: 38,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#FFF1F1'
  },
  companyCodeErrorText: {
    color: '#B33A3A',
    fontSize: 13,
    fontWeight: '600'
  },
  formCard: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 44,
    backgroundColor: '#FFFFFF'
  },
  formHeader: {
    marginBottom: 28
  },
  formTitle: {
    color: '#101C2C',
    fontSize: 26,
    lineHeight: 36,
    fontWeight: '800'
  },
  formDescription: {
    marginTop: 9,
    color: '#718198',
    fontSize: 14,
    lineHeight: 22
  },
  field: {
    marginBottom: 19
  },
  label: {
    marginBottom: 8,
    color: '#344B68',
    fontSize: 13,
    fontWeight: '700'
  },
  input: {
    width: '100%',
    minHeight: 50,
    paddingHorizontal: 15,
    color: '#101C2C',
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CDD9E6',
    borderRadius: 12,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {})
  },
  inputError: {
    borderColor: '#D95454',
    backgroundColor: '#FFFAFA'
  },
  passwordContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CDD9E6',
    borderRadius: 12,
    backgroundColor: '#FFFFFF'
  },
  passwordContainerError: {
    borderColor: '#D95454',
    backgroundColor: '#FFFAFA'
  },
  passwordInput: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 15,
    color: '#101C2C',
    fontSize: 15,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {})
  },
  passwordToggle: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#2F6FCB',
    fontSize: 13,
    fontWeight: '700'
  },
  errorText: {
    marginTop: 6,
    color: '#C33F3F',
    fontSize: 12
  },
  submitErrorBox: {
    marginBottom: 17,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 11,
    backgroundColor: '#FFF0F0'
  },
  submitErrorText: {
    color: '#AF3434',
    fontSize: 13,
    lineHeight: 20
  },
  submitButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#14284D',
    shadowColor: '#14284D',
    shadowOffset: {
      width: 0,
      height: 9
    },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4
  },
  submitButtonPressed: {
    opacity: 0.88,
    transform: [{ translateY: 1 }]
  },
  submitButtonDisabled: {
    opacity: 0.45
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    paddingVertical: 16
  },
  forgotPasswordText: {
    color: '#2F6FCB',
    fontSize: 13,
    fontWeight: '600'
  },
  termsText: {
    marginTop: 14,
    color: '#8491A4',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center'
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8F0'
  },
  dividerText: {
    color: '#98A5B8',
    fontSize: 12
  },
  switchMode: {
    alignItems: 'center',
    gap: 7
  },
  switchModeText: {
    color: '#6D7C91',
    fontSize: 13,
    textAlign: 'center'
  },
  switchModeLink: {
    color: '#2F6FCB',
    fontSize: 14,
    fontWeight: '800'
  },
  personalAccountButton: {
    alignSelf: 'center',
    marginTop: 24,
    paddingVertical: 8
  },
  personalAccountText: {
    color: '#596B84',
    fontSize: 12,
    textDecorationLine: 'underline'
  }
})
