import { axios } from '@/lib/axios'
import type { LoginCredentialsDTO } from '@/features/auth/component/LoginForm'
import type { UserResponse } from '@/types'

export const loginWithEmailAndPassword = (
  data: LoginCredentialsDTO,
): Promise<UserResponse> => {
  return axios.post('/api/login', data)
}
