export const BASE_PATH = '/'
export const BASE_PATH_AUTH = '/auth/'

export const PATHS = {

  // Auth routes
  LOGIN: `${BASE_PATH_AUTH}login`,
  REGISTER: `${BASE_PATH_AUTH}register`,
  FORGETPASSWORD: `${BASE_PATH_AUTH}forgetpassword`,
  CHANGEPASSWORD: `${BASE_PATH_AUTH}changepassword`,
  PROJECT_MANAGE: `${BASE_PATH}project`,


  // Common routers
  VERSION: `${BASE_PATH}version`,
  MAINTAIN: `${BASE_PATH}maintain`,
  NOTFOUND: `${BASE_PATH}*`,

} as const satisfies { [key: string]: string }
