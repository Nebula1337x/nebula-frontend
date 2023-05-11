type Keyword = {
  [key: string]: string
}

export const API = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/users'
}

export const ErrorKeyword: Keyword = {
  LOGIN_INVALID_CREDENTIAL: 'Invalid username or password',
  VALIDATION_ERROR: 'There are problems with the data,\n',
  SERVER_ERROR: 'There was an error on server, please try again later',
  API_HOST_CONNECTION_REFUSED: 'Unable to reach API service'
}