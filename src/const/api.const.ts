type Keyword = {
  [key: string]: string
}

export const API = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/users',
  RESET_PASSWORD: '/users/password/reset/me',
  CONFIRM_RESET_PASSWORD: '/users/password/reset/verify/me'
}

export const ErrorKeyword: Keyword = {
  LOGIN_INVALID_CREDENTIAL: 'Invalid username or password',
  VALIDATION_ERROR: 'There are problems with the data,\n',
  SERVER_ERROR: 'There was an error on server, please try again later',
  API_HOST_CONNECTION_REFUSED: 'Unable to reach API service',
  USER_NOT_FOUND: 'Email was not found in the system',
  RESET_PASSWORD_COMPLETED: 'The message has been sent to your email to reset the password'
}