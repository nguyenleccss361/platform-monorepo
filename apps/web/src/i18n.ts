import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/assets/locales/en.json'
import vi from '@/assets/locales/vi.json'

export const resources = {
  en,
  vi,
} as const

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'vi',
  load: 'languageOnly',
})

export default i18n
