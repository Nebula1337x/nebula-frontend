import { i18n } from '@/i18n'

type useHandleAPIErrorType = {
  errorMessage: string
}

export function useHandleAPIError(error: string, httpCode?: number, keyword: string = ''): useHandleAPIErrorType {
  // can not reach api server
  if (!httpCode) return { errorMessage: i18n.global.t('messages.error.apiConnectionRefused') }

  // default error message server error
  let errorMessage = i18n.global.t('api.SERVER_ERROR')

  // get an error message base on api keyword
  if (keyword) {
    errorMessage = i18n.global.t(`api.${keyword}`)  
  }

  return { errorMessage }
}