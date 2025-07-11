import { type z } from 'zod'

import { type BasePaginationSchema } from '@/utils/schemaValidation'
import type { JSX } from 'react'
import type { RoleTypes } from '@/lib/authorization'

export interface Window {
  toggleDevtools?: () => void
}

/**
 * Base Types
 */

export type BaseEntity = {
  id: string
  created_by: string
  created_time: number
}

export type BasePagination = z.infer<typeof BasePaginationSchema>

export type BaseTablePagination = {
  offset: number
  setOffset?: React.Dispatch<React.SetStateAction<number>>
  total: number
  isPreviousData: boolean
  isLoading: boolean
}

export type BaseAPIRes = {
  code: 0 | (number & NonNullable<unknown>)
  message: 'success' | (string & NonNullable<unknown>)
}

export type BaseWSRes = {
  errorCode: number
  errorMsg: string
}

export type Attribute = {
  attribute_key: string
  logged: boolean
  value: string | number | boolean
  value_as_string?: string
  last_update_ts: number
  value_type: 'STR' | 'BOOL' | 'LONG' | 'DBL' | 'JSON'
}

export type GetEventHandlers<T extends keyof JSX.IntrinsicElements> = Extract<
  keyof JSX.IntrinsicElements[T],
  `on${string}`
>

/**
 * Provides the event type for a given element and handler.
 *
 * @example
 *
 * type MyEvent = EventFor<"input", "onChange">;
 */
export type EventFor<
  TElement extends keyof JSX.IntrinsicElements,
  THandler extends GetEventHandlers<TElement>,
> = JSX.IntrinsicElements[TElement][THandler] extends
  | ((e: infer TEvent) => any)
  | undefined
  ? TEvent
  : never

// Fix zod error ts: https://github.com/Felipstein/zod-hookform-union-helper
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never
type Flatten<T> = {
  [P in keyof T]: T[P]
}
export type UnifiedErrors<T> = Flatten<UnionToIntersection<T>>
export function unifyErrors<T>(errors: T): UnifiedErrors<T> {
  return errors as UnifiedErrors<T>
}

export type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never
export type DistributivePick<T, K extends keyof T> = T extends any
  ? Pick<T, K>
  : never

  

/**
 * Auth Types
 */

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
