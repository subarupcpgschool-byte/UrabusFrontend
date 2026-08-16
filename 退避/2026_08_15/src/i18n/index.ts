import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en'
import ja from '@/locales/ja'

const deviceLanguage = getLocales()[0]?.languageCode ?? 'ja'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',

  resources: {
    ja: {
      translation: ja
    },
    en: {
      translation: en
    }
  },

  lng: deviceLanguage,

  fallbackLng: 'ja',

  interpolation: {
    escapeValue: false
  }
})

export default i18n
