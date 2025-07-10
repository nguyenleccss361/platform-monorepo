
import { type RoleTypes } from '@/lib/authorization'

export type PolicyResources =
  | 'groups'
  | 'devices'
  | 'devicetokens'
  | 'events'
  | 'eventaction'
  | 'tenants'
  | 'users'
  | 'roles'
  | 'projects'
  | 'organizations'
  | 'templates'
  | 'pricing'
  | 'adapter'
  | '*'

export type PolicyActions =
  | 'read'
  | 'create'
  | 'modify'
  | 'delete'
  | 'fota'
  | 'update_status'
  | 'update_mqtt_config'
  | '*'

export type User = {
  expired_at: number
  device_token: string
  is_admin: boolean
  user_id: string
  email: string
  role_id?: string
  role_name?: string
  name?: string
  system_role: RoleTypes
}

export type EndUser = {
  project_id: string
  org_id?: string
  org_name?: string
} & User

export type RolePolicy = {
  actions: PolicyActions[]
  resources: PolicyResources[]
}

export type Permissions = {
  project_id: string
  role_id: string
  role_policies: RolePolicy[]
  created_time: number
}

export type UserResponse = {
  token: string
  refresh_token: string
  timestamp: Date
  phone: number
  permissions: Permissions[]
} & Pick<
  User,
  | 'device_token'
  | 'email'
  | 'expired_at'
  | 'is_admin'
  | 'system_role'
  | 'user_id'
>
