import { ErrorKeyword } from '@/const';

type useHandleAPIErrorType = {
  errorMessage: string
}

export function useHandleAPIError(error: string, httpCode?: number, keyword: string = ''): useHandleAPIErrorType {

  if (!httpCode) return { errorMessage: ErrorKeyword['API_HOST_CONNECTION_REFUSED'] };

  let errorMessage = ErrorKeyword['SERVER_ERROR'];

  if (keyword) {
    errorMessage = ErrorKeyword[keyword];  
  }

  return { errorMessage };
}