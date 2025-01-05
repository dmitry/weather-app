import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { loadCommonTranslations } from '@/i18n'

const translationModules = import.meta.glob('/src/components/**/translations/*.json')

export const useComponentTranslation = (componentPath: string) => {
  const namespace = componentPath.replace(/\//g, '.')
  const { i18n, t } = useTranslation([namespace, 'common'], {
    useSuspense: false
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true)

      await loadCommonTranslations(i18n.language)

      if (!i18n.hasResourceBundle(i18n.language, namespace)) {
        try {
          const key = `/src/components/${componentPath}/translations/${i18n.language}.json`
          const module = await translationModules[key]()

          const resources = {}
          Object.entries(module.default).forEach(([key, value]) => {
            resources[`${key}`] = value
          })

          i18n.addResourceBundle(
            i18n.language,
            namespace,
            resources,
            true,
            true
          )
        } catch (error) {
          console.error(`Failed to load translations for ${namespace}`, error)
        }
      }

      setIsLoading(false)
    }

    loadTranslations()
  }, [namespace, i18n.language])

  const tWithFallback = (key: string, options?: any) => {
    if (key.includes(':')) {
      return t(key, options)
    }

    const withComponentNS = `${namespace}:${key}`
    const translation = t(withComponentNS, { ...options, nsSeparator: ':', defaultValue: undefined })

    if (translation === withComponentNS) {
      return t(key, { ...options, ns: 'common' })
    }

    return translation
  }

  return { t: tWithFallback, isLoading }
}