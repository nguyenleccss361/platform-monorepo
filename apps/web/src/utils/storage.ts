import type { UserResponse } from "@/types"


const storagePrefix = 'iot_platform_'

export type UserStorage = Pick<
  UserResponse,
  | 'token'
  | 'refresh_token'
  | 'system_role'
  | 'timestamp'
  | 'device_token'
  | 'user_id'
  | 'permissions'
>

const storage = {
  getUser: (): UserStorage | null => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}token`) as string)
  },
  setUser: (token: UserStorage) => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token))
  },
  clearUser: () => {
    window.localStorage.removeItem(`${storagePrefix}token`)
  },

  clearProject: () => {
    window.localStorage.removeItem(`${storagePrefix}project`)
  },

  getIsPersistLogin: (): boolean | null => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}is-persist-login`) ?? 'null',
    )
  },
  setIsPersistLogin: (checked: boolean) => {
    window.localStorage.setItem(
      `${storagePrefix}is-persist-login`,
      JSON.stringify(checked),
    )
  },
  clearIsPersistLogin: () => {
    window.localStorage.removeItem(`${storagePrefix}is-persist-login`)
  },
}

export default storage
