import {
  QueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type DefaultOptions,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query'
import { type AxiosError } from 'axios'
import { toast } from 'sonner'

import i18n from '@/i18n'
import storage from '@/utils/storage'

const FAILURE_COUNT = 4

function retryQuery(failureCount: number, error: any) {
  if (
    storage.getIsPersistLogin()
    && error.response?.status === 401
    && failureCount < FAILURE_COUNT
  ) {
    return true
  }

  const shouldRetry
    = error.response?.status !== 403
    && error.response?.status !== 401
    && error.response?.status != null
    && failureCount < FAILURE_COUNT
  return shouldRetry
}
const queryConfigProduction: DefaultOptions = {
  queries: {
    useErrorBoundary: false,
    suspense: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: retryQuery,
    retryDelay: attemptIndex =>
      Math.min(Math.pow(2, attemptIndex) * 1000, 10000),
    staleTime: 1000 * 60,
  },
  mutations: {
    retry: false,
  },
}

const queryConfigDev: DefaultOptions = {
  queries: {
    useErrorBoundary: false,
    suspense: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
    staleTime: 1000 * 10,
  },
  mutations: {
    retry: false,
  },
}

export const queryClient = new QueryClient({
  defaultOptions: import.meta.env.PROD
    ? queryConfigProduction
    : queryConfigDev,
  queryCache: new QueryCache({
    onError: error => {
      toast.error(i18n.t('error:server_res.title'), {
        description: (error as AxiosError).message,
      })
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      toast.error(i18n.t('error:server_res.title'), {
        description: (error as AxiosError).message,
      })
    },
  }),
})

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  Promise<ReturnType<FnType>>
>

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >
