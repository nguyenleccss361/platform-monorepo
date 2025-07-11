import { type UseMutationOptions, type DefaultOptions, keepPreviousData, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { type AxiosError } from 'axios'
import i18n from '@/i18n'
import { toast } from 'sonner'

import storage from '@/utils/storage'
import { sleep } from './utils'

const FAILURE_COUNT = 4

function retryQuery(failureCount: number, error: unknown) {
  if (storage.getIsPersistLogin() && (error as AxiosError).response?.status === 401 && failureCount < FAILURE_COUNT) {
    return true
  }

  return false
}

export const queryConfigProduction = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: retryQuery,
    retryDelay: attemptIndex => Math.min(Math.pow(2, attemptIndex) * 1000, 10000),
    staleTime: 1000 * 60,
  },
  mutations: {
    retry: retryQuery,
    retryDelay: attemptIndex => Math.min(Math.pow(2, attemptIndex) * 1000, 10000),
  },
} satisfies DefaultOptions

export const queryConfigDev = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 1000 * 10,
  },
  mutations: {
    retry: false,
  },
} satisfies DefaultOptions

export const queryClient = new QueryClient({
  defaultOptions: import.meta.env.PROD ? queryConfigProduction : queryConfigDev,
  queryCache: new QueryCache({
    onError: async (error, query) => {
      if (query.meta?.errorMessage) {
        if (query.meta.isDelayedError) {
          await sleep((query.meta.timeoutDelayedError as number | undefined) ?? 5000)
          toast.error(i18n.t('error:server_res.title'), {
            description: query.meta.errorMessage as string,
          })
        }
        else {
          toast.error(i18n.t('error:server_res.title'), {
            description: query.meta.errorMessage as string,
          })
        }
        return
      }
      if ((error as AxiosError).response?.status === 401) {
        return
      }
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

type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>

export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>
