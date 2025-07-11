import { type UserStorage } from '@/utils/storage'

import { ROLES } from './authorization'
import type { PolicyActions, PolicyResources } from '@/types/api'

type Policy = {
  user?: UserStorage
  projectId: string
}

/**
 * If user system_role is either SYSTEM_ADMIN or TENANT then policies will be true all the time
 * If user system_role is either TENANT_DEV or NORMAL_USER then policies will be true only if hasAction return true
 */

export const POLICIES = {
  'tenants:read': (params: Policy) => checkPolicy('tenants', 'read', params),
  'tenants:create': (params: Policy) => checkPolicy('tenants', 'create', params),
  'tenants:modify': (params: Policy) => checkPolicy('tenants', 'modify', params),
  'tenants:delete': (params: Policy) => checkPolicy('tenants', 'delete', params),

  'organizations:read': (params: Policy) => checkPolicy('organizations', 'read', params),
  'organizations:create': (params: Policy) => checkPolicy('organizations', 'create', params),
  'organizations:modify': (params: Policy) => checkPolicy('organizations', 'modify', params),
  'organizations:delete': (params: Policy) => checkPolicy('organizations', 'delete', params),

  'group:read': (params: Policy) => checkPolicy('groups', 'read', params),
  'group:create': (params: Policy) => checkPolicy('groups', 'create', params),
  'group:modify': (params: Policy) => checkPolicy('groups', 'modify', params),
  'group:delete': (params: Policy) => checkPolicy('groups', 'delete', params),

  'users:read': (params: Policy) => checkPolicy('users', 'read', params),
  'users:create': (params: Policy) => checkPolicy('users', 'create', params),
  'users:modify': (params: Policy) => checkPolicy('users', 'modify', params),
  'users:delete': (params: Policy) => checkPolicy('users', 'delete', params),

  'devices:read': (params: Policy) => checkPolicy('devices', 'read', params),
  'devices:create': (params: Policy) => checkPolicy('devices', 'create', params),
  'devices:modify': (params: Policy) => checkPolicy('devices', 'modify', params),
  'devices:delete': (params: Policy) => checkPolicy('devices', 'delete', params),
  'devices:fota': (params: Policy) => checkPolicy('devices', 'fota', params),
  'devices:update_mqtt_config': (params: Policy) => checkPolicy('devices', 'update_mqtt_config', params),
  'devices:update_status': (params: Policy) => checkPolicy('devices', 'update_status', params),

  'events:read': (params: Policy) => checkPolicy('events', 'read', params),
  'events:create': (params: Policy) => checkPolicy('events', 'create', params),
  'events:modify': (params: Policy) => checkPolicy('events', 'modify', params),
  'events:delete': (params: Policy) => checkPolicy('events', 'delete', params),

  'templates:read': (params: Policy) => checkPolicy('templates', 'read', params),
  'templates:create': (params: Policy) => checkPolicy('templates', 'create', params),
  'templates:modify': (params: Policy) => checkPolicy('templates', 'modify', params),
  'templates:delete': (params: Policy) => checkPolicy('templates', 'delete', params),

  'roles:read': (params: Policy) => checkPolicy('roles', 'read', params),
  'roles:create': (params: Policy) => checkPolicy('roles', 'create', params),
  'roles:modify': (params: Policy) => checkPolicy('roles', 'modify', params),
  'roles:delete': (params: Policy) => checkPolicy('roles', 'delete', params),

  'adapter:read': (params: Policy) => checkPolicy('adapter', 'read', params),
  'adapter:create': (params: Policy) => checkPolicy('adapter', 'create', params),
  'adapter:modify': (params: Policy) => checkPolicy('adapter', 'modify', params),
  'adapter:delete': (params: Policy) => checkPolicy('adapter', 'delete', params),
} as const

const checkPolicy = (resource: PolicyResources, action: PolicyActions, { user }: Policy): boolean => {
  const policies = (user?.permissions ?? [])[0]?.role_policies ?? []

  if (isGodMode({ user })) return true

  if (isTenantDev(user) || isEndUser(user)) {
    return policies.filter(policy => policy.resources[0] === resource)[0].actions.includes(action)
  }

  return false
}

function isSystemAdmin(user?: UserStorage): boolean {
  return user?.system_role === ROLES.SYSTEM_ADMIN
}
function isTenant(user?: UserStorage): boolean {
  return user?.system_role === ROLES.TENANT
}
function isTenantDev(user?: UserStorage): boolean {
  return user?.system_role === ROLES.TENANT_DEV
}
function isEndUser(user?: UserStorage): boolean {
  return user?.system_role === ROLES.NORMAL_USER
}

function isGodMode({ user }: { user?: UserStorage }): boolean {
  return isSystemAdmin(user) || isTenant(user)
}
