import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

import i18n from '@/i18n'
import { axios } from '@/lib/axios'
import { type MutationConfig, queryClient } from '@/lib/react-query'
import type { BaseAPIRes } from '@/types/base'
import type { CreateProjectSchema } from '@/routes/_projectLayout.project'

type CreateProjectRes = {
  id: string
  name: string
  description: string
  image: string
  app_key: string
  app_secret: string
  sms_config: unknown
} & BaseAPIRes

export const ACCEPTED_RESTORE_FILE = ['application/json', 'text/plain']
export const restoreProjectSchema = z.object({
  file: z
    .instanceof(File, {
      message: i18n.t('cloud:project_manager.add_project.choose_file'),
    })
    .refine(
      file => ACCEPTED_RESTORE_FILE.includes(file.type),
      i18n.t('validate:json_type'),
    ),
})

export type CreateProjectDTO = {
  data: z.infer<typeof CreateProjectSchema>
}

export const createProject = ({
  data,
}: CreateProjectDTO): Promise<CreateProjectRes> => {
  return axios.post('/api/projects', data)
}

export type UseCreateProjectOptions = {
  config?: MutationConfig<typeof createProject>
}

export const useCreateProject = ({ config }: UseCreateProjectOptions = {}) => {
  const { t } = useTranslation()
  const { onSuccess, ...restConfig } = config || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      })
      onSuccess?.(...args)
      toast.success(t('cloud:project_manager.add_project.success_add'))
    },
    ...restConfig,
    mutationFn: createProject,
  })
}
