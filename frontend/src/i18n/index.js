import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import en from './en'

export const LOCALE_KEY = 'app-locale'
export const SUPPORTED_LOCALES = ['zh-CN', 'en']

function detectLocale() {
  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (fromQuery) {
    const match = SUPPORTED_LOCALES.find((l) => l.toLowerCase().startsWith(fromQuery.toLowerCase().slice(0, 2)))
    if (match) {
      try { localStorage.setItem(LOCALE_KEY, match) } catch { /* ignore */ }
      return match
    }
  }
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (SUPPORTED_LOCALES.includes(saved)) return saved
  } catch { /* ignore */ }
  return (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { 'zh-CN': zhCN, en },
})

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return
  i18n.global.locale.value = locale
  try { localStorage.setItem(LOCALE_KEY, locale) } catch { /* ignore */ }
  document.documentElement.setAttribute('lang', locale)
}

// Language code sent to the backend for AI output ("zh" | "en")
export function aiLanguage() {
  return i18n.global.locale.value.startsWith('zh') ? 'zh' : 'en'
}

export default i18n
