import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import i18n from '@/i18n'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/const'

const uploadImageSchema = z.object({
  file: z
    .instanceof(File, {
      message: i18n.t('cloud:org_manage.org_manage.add_org.choose_avatar'),
    })
    .refine(
      file => file.size <= MAX_FILE_SIZE,
      i18n.t('validate:image_max_size'),
    )
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      i18n.t('validate:image_type'),
    ),
})
type UploadImage = {
  project_id: string
  file: z.infer<typeof uploadImageSchema>
}
export type UploadImageDTO = {
  data: UploadImage
}
export function useUploadImage(
  defaultImage?: string,
  defaultFileName?: string,
) {
  const avatarRef = useRef<HTMLImageElement>(null)
  const [uploadImageErr, setUploadImageErr] = useState('')

  const {
    control: controlUploadImage,
    setValue: setValueUploadImage,
    getValues: getValueUploadImage,
    formState: formStateUploadImage,
    resetField: resetFieldUploadImage,
  } = useForm<UploadImageDTO['data']>({
    resolver: uploadImageSchema && zodResolver(uploadImageSchema),
  })

  function handleResetDefaultImage() {
    resetFieldUploadImage('file')
    setUploadImageErr('')
    if (defaultImage != null) {
      if (avatarRef.current != null) {
        avatarRef.current.src = defaultImage
      }
      fetch(defaultImage)
        .then(res => res.blob())
        .then(blob => {
          const defaultFile = new File([blob], (defaultFileName = ''), blob)
          const formData = new FormData()
          formData.append('file', defaultFile)
          setValueUploadImage(
            'file',
            formData.get('file') as unknown as { file: File },
          )
        })
    }
  }

  return {
    handleResetDefaultImage,
    avatarRef,
    uploadImageErr,
    setUploadImageErr,
    controlUploadImage,
    setValueUploadImage,
    getValueUploadImage,
    formStateUploadImage,
  }
}
