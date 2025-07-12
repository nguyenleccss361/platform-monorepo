import { useMutation } from '@tanstack/react-query'
import { type z } from 'zod'

import { axios } from '@/lib/axios'
import { type MutationConfig, queryClient } from '@/lib/react-query'
import type { uploadImageResSchema } from '../components/import-project'
import type { UploadImageDTO } from '@/hook/use-upload-image'
type UploadImageRes = z.infer<typeof uploadImageResSchema>

export const uploadImage = ({
  data,
}: UploadImageDTO): Promise<UploadImageRes> => {
  return axios.post('/api/miniovt/file/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

type UseUploadImageOptions = {
  config?: MutationConfig<typeof uploadImage>
}

export const useUploadImageAPI = ({ config }: UseUploadImageOptions = {}) => {
  const { onSuccess, ...restConfig } = config || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['upload-image'],
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: uploadImage,
  })
}
