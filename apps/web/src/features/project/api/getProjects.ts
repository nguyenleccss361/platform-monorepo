import { useQuery } from '@tanstack/react-query'

import { axios } from '@/lib/axios'
import { type ExtractFnReturnType, type QueryConfig } from '@/lib/react-query'
import { limitPagination } from '@/utils/const'
import type { ProjectList } from '@/routes/_projectLayout.project'

type GetProjects = {
  search_field?: string
  search_str?: string
  offset?: number
  limit?: number
}

export const getProjects = ({
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

type QueryFnType = typeof getProjects

export type UseProjectsOptions = {
  config?: QueryConfig<QueryFnType>
} & GetProjects

export const useProjects = ({
  offset = 0,
  limit = limitPagination,
  search_field = 'name',
  search_str = '',
  config,
}: UseProjectsOptions) => {
  const projectQuery = useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['projects', offset, limit, search_field, search_str],
    queryFn: () => getProjects({ offset, limit, search_field, search_str }),
    ...config,
  })
  return projectQuery
}
