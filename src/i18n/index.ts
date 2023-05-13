import { createI18n } from 'vue-i18n'
import en from './locales/en-US.yml'

export enum Locale {
  EN = 'en-US',
  KH = 'km-kh'
}

export const i18n = createI18n({
  locale: Locale.EN,
  fallbackLocale: Locale.EN,
  legacy: false,
  messages: {
    'en-US': en
  }
})