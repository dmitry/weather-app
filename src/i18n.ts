import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
const translationModules = import.meta.glob('/src/translations/*.json')


// export const loadLocale = (language: string) => {
//   return import(`../locales/${language}/index.ts`).then(
//     (module) => module.default
//   )
// }

export const loadCommonTranslations = async (language: string) => {
  if (!i18n.hasResourceBundle(language, 'common')) {
    try {
      const module = await translationModules[`/src/translations/${language}.json`]()
      i18n.addResourceBundle(language, 'common', module.default, true, true)
    } catch (error) {
      console.error(`Failed to load common translations for ${language}`, error)
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    // ns: ['common'],
    defaultNS: 'common',
    // debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    // partialBundledLanguages: true
  })

export default i18n