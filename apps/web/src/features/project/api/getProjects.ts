import { queryOptions, useQuery } from '@tanstack/react-query'

import { axios } from '@/lib/axios'
import type { ProjectList } from '@/routes/_projectLayout.project'
import { limitPagination } from '@/utils/const'
import type { QueryConfig } from '@/lib/react-query'

type GetProjects = {
  search_field?: string
  search_str?: string
  offset?: number
  limit?: number
}

export const getProjects = async ({
  offset,
  limit,
  search_field,
  search_str,
}: GetProjects): Promise<ProjectList> => {
  const searchFieldArray = search_field?.split(',')
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
    search_str: search_str || '',
  })
  searchFieldArray?.forEach(field => {
    params.append('search_field', field)
  })

  return axios.get('/api/projects', { params })  
}

export const getProjectsOptions = ({ offset = 0, limit = limitPagination, search_field = 'name', search_str = '' }: GetProjects = {}) => {
  return queryOptions({
    queryKey: ['projects', offset, limit, search_field, search_str],
    queryFn: () => getProjects({ offset, limit, search_field, search_str }),
  })
}

type UseProjectsOptions = {
  queryConfig?: QueryConfig<typeof getProjectsOptions>
} & GetProjects

export const useProjects = ({ offset, limit, search_field, search_str, queryConfig }: UseProjectsOptions = {}) => {
  return useQuery({
    ...getProjectsOptions({ offset, limit, search_field, search_str }),
    ...queryConfig,
  })
}

