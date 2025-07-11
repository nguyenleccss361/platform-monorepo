import { queryOptions, useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { axios } from '@/lib/axios'
import { type QueryConfig } from '@/lib/react-query'

export type Profile = {
  identity_info: {
    identity: string
    front_image: string
    back_image: string
    registration_form_image: string
    authorization_letter_image: string
  }
  dob?: string | Date
  nationality: string
  province: string
  district: string
  ward: string
  full_address: string
  url: string
  company?: string
  gender: string
  profile_image?: string
  tax_code: string
}

export type UserInfo = {
  name: string
  email: string
  admin_id: string
  user_id: string
  is_admin: boolean
  activate: boolean
  role_id: string
  role_name: string
  group_id: string
  group_name: string
  profile: Profile
  org_id?: string
  org_name?: string
  customer_code: string
  phone: string
}

const getUserInfo = async (): Promise<UserInfo> => {
  // await sleep(5000)
  return axios.get('/api/users/self')
}

export const getUserInfoOptions = () => {
  return queryOptions({
    queryKey: ['user-info'],
    queryFn: () => getUserInfo(),
  })
}

type UseUserInfoOptions = {
  queryConfig?: QueryConfig<typeof getUserInfoOptions>
}

export const useUserInfo = ({ queryConfig }: UseUserInfoOptions = {}) => {
  return useQuery({
    ...getUserInfoOptions(),
    ...queryConfig,
  })
}
