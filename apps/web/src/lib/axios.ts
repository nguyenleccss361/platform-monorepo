import Axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { env } from '@/config'
import i18n from '@/i18n'
import { logoutFn } from '@/lib/auth'

import storage, { type UserStorage } from '@/utils/storage'
import type { UserResponse } from '@/types/api'
import { PATHS } from '@/routes/PATHS'

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const controller = new AbortController()

  const allowedOrigins = [env.API_URL]
  const userStorage = storage.getUser()
  if (userStorage?.token && allowedOrigins.includes(config.baseURL as unknown as string)) {
    config.headers.set('Authorization', `Bearer ${userStorage.token}`)
  }

  return {
    ...config,
    signal: controller.signal,
  }
}

export const axios = Axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axios.interceptors.request.use(authRequestInterceptor)

let refreshInProgress = false
axios.interceptors.response.use(
  response => {
    let message = ''
    const errCode = response.data?.code
    const errMessage = response.data?.message

    if (errMessage === 'malformed entity specification') {
      message = i18n.t('error:server_res.malformed_data')
      const customError = { ...response.data, message }

      return Promise.reject(customError)
    }
    if (errCode != null && errCode !== 0) {
      message = errMessage ?? i18n.t('error:server_res.server')
      const customError = { ...response.data, message }

      return Promise.reject(customError)
    }
    else {
      return response.data
    }
  },
  async (error: AxiosError<{ code?: number, message?: string }>) => {
    console.error('axios error: ', error)

    let message = ''
    const errRes = error.response

    if (errRes?.data.message === 'malformed entity specification') {
      message = i18n.t('error:server_res.malformed_data')
    }

    switch (errRes?.status) {
      case 401:
        if (!refreshInProgress) {
          refreshInProgress = true
          const refreshToken = storage.getUser()?.refresh_token
          if (storage.getIsPersistLogin() && refreshToken != null) {
            try {
              const {
                data: { token: newAccessToken },
              } = await useRefreshToken(refreshToken)
              if (newAccessToken !== '') {
                storage.setUser({
                  ...storage.getUser(),
                  token: newAccessToken,
                  refresh_token: refreshToken,
                } as UserStorage)
              }
            }
            catch {
              redirect401()
              return logoutFn()
            }
            finally {
              refreshInProgress = false
            }
          }
          else {
            redirect401()
            return logoutFn()
          }
        }
        break
      case 403:
        message = i18n.t('error:server_res.authorization')
        break
      case 404:
        message = i18n.t('error:server_res.notfound')
        break
      case 500:
        message = i18n.t('error:server_res.500')
        break
      default:
        message = errRes?.data.message ?? error.message
    }

    switch (errRes?.data.code) {
      case 401: {
        redirect401()
        return logoutFn()
      }
      case 403:
        message = i18n.t('error:server_res.authorization')
        break
      case 2003:
        message = i18n.t('error:server_res_status.2003')
        break
      case 2004:
        message = i18n.t('error:server_res_status.2004')
        break
      case 2005:
        message = i18n.t('error:server_res_status.2005')
        break
      case 20010:
        message = i18n.t('error:server_res_status.20010')
        break
      case 2007:
        message = i18n.t('error:server_res_status.2007')
        break
      case 2008:
        message = i18n.t('error:server_res_status.2008')
        break
      case 2009:
        message = i18n.t('error:server_res_status.2009')
        break
      case 2010:
        message = i18n.t('error:server_res_status.2010')
        break
      case 2013:
        message = i18n.t('error:server_res_status.2013')
        break
      case 5002:
        message = i18n.t('error:server_res_status.5002')
        break
      case 8002:
        message = i18n.t('error:server_res_status.8002')
        break
      case 8001:
        message = i18n.t('error:server_res_status.8001')
        break
      case 2033:
        message = i18n.t('error:server_res_status.2033')
        break
      case 8006:
        message = i18n.t('error:server_res_status.8006')
        break
      case 8007:
        message = i18n.t('error:server_res_status.8007')
        break
      case 8008:
        message = i18n.t('error:server_res_status.8008')
        break
      case 8009:
        message = i18n.t('error:server_res_status.8009')
        break
      case 8010:
        message = i18n.t('error:server_res_status.8010')
        break
      case 4012:
        message = i18n.t('error:server_res_status.4012')
        break
      case 4002:
        message = i18n.t('error:server_res_status.4002')
        break
      case 4003:
        message = i18n.t('error:server_res_status.4003')
        break
      case 2021:
        message = i18n.t('error:server_res_status.2021')
        break
      case 2022:
        message = i18n.t('error:server_res_status.2022')
        break
      case 4010:
        message = i18n.t('error:server_res_status.4010')
        break
      case 4013:
        message = i18n.t('error:server_res_status.4013')
        break
      case 4014:
        message = i18n.t('error:server_res_status.4014')
        break
      case 4016:
        message = i18n.t('error:server_res_status.4016')
        break
      case 4001:
        message = i18n.t('error:server_res_status.4001')
        break
      case 4333:
        message = i18n.t('error:server_res_status.4333')
        break
      case 5001:
        message = i18n.t('error:server_res_status.5001')
        break
      case 5003:
        message = i18n.t('error:server_res_status.5003')
        break
      case 6504:
        message = i18n.t('error:server_res_status.6504')
        break
      case 6505:
        message = i18n.t('error:server_res_status.6505')
        break
      case 6506:
        message = i18n.t('error:server_res_status.6506')
        break
      case 6507:
        message = i18n.t('error:server_res_status.6507')
        break
      case 6501:
        message = i18n.t('error:server_res_status.6501')
        break
      case 2098:
        message = i18n.t('error:server_res_status.2098')
        break
      case 2001:
        message = i18n.t('error:server_res_status.2001')
        break
      case 5004:
        message = i18n.t('error:server_res_status.5004')
        break
      case 1005:
        message = i18n.t('error:server_res_status.1005')
        break
      case 2019:
        return logoutFn()
      case 2:
        message = i18n.t('error:server_res_status.2')
        window.location.href = PATHS.PROJECT_MANAGE
        break
      default:
        message = errRes?.data.message ?? error.message
    }

    const customError = { ...error, message }

    return Promise.reject(customError)
  },
)

const useRefreshToken = (refreshToken: string): Promise<{ data: UserResponse }> => {
  const axiosPersistLogin = Axios.create({
    baseURL: env.API_URL,
    headers: {
      RefreshToken: refreshToken,
    },
  })

  return axiosPersistLogin.get('/api/token/refresh')
}

function redirect401() {
  const searchParams = new URLSearchParams()
  const redirectTo = searchParams.get('redirectTo')
  window.location.href = `${PATHS.LOGIN}?redirectTo=${redirectTo}`
}
