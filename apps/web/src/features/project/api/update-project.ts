import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { type z } from 'zod'

import { axios } from '@/lib/axios'
import { type MutationConfig, queryClient } from '@/lib/react-query'
import type { CreateProjectSchema } from '@/routes/_project-layout.project'

export type UpdateProjectDTO = {
  data: z.infer<typeof CreateProjectSchema>
  projectId: string
}

export const updateProject = ({ data, projectId }: UpdateProjectDTO) => {
  return axios.put(`/api/projects/${projectId}`, data)
}

export type UseUpdateProjectOptions = {
  config?: MutationConfig<typeof updateProject>
  isOnCreateProject?: boolean
}

export const useUpdateProject = ({
  config,
  isOnCreateProject,
}: UseUpdateProjectOptions = {}) => {
  const { t } = useTranslation()
  const { onSuccess, ...restConfig } = config || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      })
      onSuccess?.(...args)
      if (!isOnCreateProject) {
        toast.success(t('cloud:project_manager.add_project.success_update'))
      }
    },
    ...restConfig,
    mutationFn: updateProject,
  })
}
