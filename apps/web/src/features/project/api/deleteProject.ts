import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { axios } from '@/lib/axios'
import { type MutationConfig, queryClient } from '@/lib/react-query'

type DeleteProject = {
  projectId: string
}

export const deleteProject = ({ projectId }: DeleteProject) => {
  return axios.delete(`/api/projects/${projectId}`)
}

type UseDeleteProjectOptions = {
  config?: MutationConfig<typeof deleteProject>
}

export const useDeleteProject = ({ config }: UseDeleteProjectOptions = {}) => {
  const { t } = useTranslation()
  const { onSuccess, ...restConfig } = config || {}

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args)
      toast.promise(() => queryClient.invalidateQueries({
        queryKey: ['projects'],
      }), {
        loading: t('loading:loading'),
        success: t('cloud:project_manager.add_project.success_delete'),
        error: t('error:server_res.title'),
      })
    },
    ...restConfig,
    mutationFn: deleteProject,
  })
}
