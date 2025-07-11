import { configureAuth } from 'react-query-auth'
import storage from '@/utils/storage'
import type { UserResponse } from '@/types'
import type { LoginCredentialsDTO } from '@/features/auth/component/login-form'
import { loginWithEmailAndPassword } from '@/features/auth/api/login'
import { registerWithEmailAndPassword, type RegisterCredentialsDTO } from '@/features/auth/api/register'

async function handleUserResponse(user: UserResponse) {
  storage.setUser({
    token: user.token,
    refresh_token: user.refresh_token,
    system_role: user.system_role,
    timestamp: new Date(),
    device_token: user.device_token,
    user_id: user.user_id,
    permissions: user.permissions,
  })

  return user
}

async function userFn() {
  return storage.getUser()
}

async function loginFn(data: LoginCredentialsDTO) {
  if (data.isPersistLogin) {
    storage.setIsPersistLogin(true)
  }
  else {
    storage.clearIsPersistLogin()
  }

  const response = await loginWithEmailAndPassword(data)
  const user = await handleUserResponse(response)

  return user
}

async function registerFn(data: RegisterCredentialsDTO) {
  const response = await registerWithEmailAndPassword(data)
  const user = await handleUserResponse(response)
  return user
}

export async function logoutFn() {
  storage.clearProject()
  storage.clearUser()
  window.location.assign("/auth/login")
  // window.history.replaceState({ from: window.location.pathname }, PATHS.LOGIN)
}

const authConfig = {
  userFn,
  loginFn,
  registerFn,
  logoutFn,
}

export const { useUser, useLogin, useLogout, useRegister, AuthLoader }
  = configureAuth(authConfig)
