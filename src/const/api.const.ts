export const API = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/users',
  RESET_PASSWORD: '/users/password/reset/me',
  CONFIRM_RESET_PASSWORD: '/users/password/reset/verify/me'
}

export enum ApiKeyword {
  LoginInvalidCredential = 'LOGIN_INVALID_CREDENTIAL',
  ValidationError = 'VALIDATION_ERROR',
  ServerError = 'SERVER_ERROR',
  UserNotFound = 'USER_NOT_FOUND',
  UserNameTaken = 'USER_NAME_TAKEN',
  UserEmailTaken = 'USER_EMAIL_TAKEN'
}
