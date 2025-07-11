import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { axios } from '@/lib/axios'
import { type MutationConfig, queryClient } from '@/lib/react-query'

export type RestoreProjectRes = {
  data: string
}

export type RestoreProjectDTO = {
  projectId: string
  backup: any
}

export const restoreProject = ({
  projectId,
  backup,
}: RestoreProjectDTO): Promise<RestoreProjectRes> => {
  return axios.post(`/api/projects/restore/${projectId}`, backup)
}

type UseUploadImageOptions = {
  type?: string
  config?: MutationConfig<typeof restoreProject>
}

export const useRestoreProject = ({
  type,
  config,
}: UseUploadImageOptions = {}) => {
  const { t } = useTranslation()
  const { onSuccess, ...restConfig } = config || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['restore-project'],
      })
      onSuccess?.(...args)
      toast.success(t('cloud:project_manager.add_project.success_restore'))
    },
    ...restConfig,
    mutationFn: restoreProject,
  })
}
