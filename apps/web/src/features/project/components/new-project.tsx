import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { LuTrash } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { CreateProjectSchema } from '@/routes/_project-layout.project'
import { useUploadImageAPI } from '../api/upload-image'
import { useCreateProject, type CreateProjectDTO } from '../api/create-project'
import { useUpdateProject } from '../api/update-project'
import { useUploadImage } from '@/hook/use-upload-image'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/const'

type NewProjectProps = {
  close: React.Dispatch<React.SetStateAction<boolean>>
}

export function NewProject({ close }: NewProjectProps) {
  const { t } = useTranslation()

  const {
    avatarRef,
    uploadImageErr,
    setUploadImageErr,
    controlUploadImage,
    setValueUploadImage,
    getValueUploadImage,
  } = useUploadImage()

  const form = useForm<CreateProjectDTO['data']>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const { handleSubmit, watch } = form
  console.log('errrrrrrrrrrrrrrrrr', form.formState.errors)

  const { mutateAsync: mutateAsyncUploadImage, isPending: isLoadingUpload }
    = useUploadImageAPI()

  const { mutate: mutateUpdateProject, isPending: isLoadingUpdateProject }
    = useUpdateProject({
      isOnCreateProject: true,
    })

  const {
    mutateAsync: mutateAsyncCreateProject,
    isPending: isLoadingCreateProject,
  } = useCreateProject()

  function handleResetForm() {
    setUploadImageFileName('')
  }

  const [uploadImageFileName, setUploadImageFileName] = useState('')
  return (
    <div className="mt-4">
      <Form {...form}>
        <form
          id="create-project"
          className="flex w-full flex-col justify-between space-y-6"
          onSubmit={handleSubmit(async values => {
            const dataCreateProject = await mutateAsyncCreateProject(
              {
                data: {
                  name: values.name,
                  description: values.description,
                },
              },
              {
                onSuccess: () => close(true),
              },
            )
            if (
              getValueUploadImage('file') != null
              && getValueUploadImage('file').length !== 0
              && uploadImageFileName !== ''
            ) {
              const dataUploadImage = await mutateAsyncUploadImage({
                data: {
                  project_id: dataCreateProject.id,
                  file: getValueUploadImage('file'),
                },
              })
              mutateUpdateProject(
                {
                  data: {
                    name: dataCreateProject.name,
                    description: dataCreateProject.description,
                    image: dataUploadImage.link
                      .split('/')
                      .map((part, index, arr) =>
                        index === arr.length - 1
                          ? part.replace(/\s+/g, '')
                          : part,
                      )
                      .join('/'),
                  },
                  projectId: dataCreateProject.id,
                },
                {
                  onSuccess: () => close(true),
                },
              )
            }
          })}
        >
          <div className="grid gap-y-4">
            <div className="grid gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('cloud:project_manager.add_project.name')}
                      <span className="pl-1 text-primary">*</span>
                    </FormLabel>
                    <div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t(
                            'cloud:project_manager.add_project.name_placeholder',
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('cloud:project_manager.add_project.description')}
                    </FormLabel>
                    <div>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          {...field}
                          rows={6}
                          placeholder={t(
                            'cloud:project_manager.add_project.description_placeholder',
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <div className="relative mb-4 h-28 rounded-md bg-background-upload">
                <div className="absolute left-5 top-5 text-white">
                  <p className="mb-3 font-semibold">
                    {watch('name') !== '' && watch('name') != null
                      ? watch('name')
                      : t('cloud:project_manager.name')}
                  </p>
                  <p>
                    {watch('description') !== '' && watch('description') != null
                      ? watch('description')
                      : t('cloud:project_manager.description')}
                  </p>
                </div>

                {uploadImageFileName !== '' && (
                  <img
                    src=""
                    alt="Project"
                    className="mb-4 h-28 w-full rounded-md"
                    ref={avatarRef}
                  />
                )}
                {uploadImageFileName !== ''
                  ? (
                    <Button
                      className="absolute right-5 top-5 min-h-fit min-w-fit"
                      variant="none"
                      size="square"
                      onClick={handleResetForm}
                    >
                      <LuTrash className="size-4 text-primary" />
                    </Button>
                  )
                  : null}
              </div>
              <div>
                <FormLabel>
                  {t('cloud:project_manager.add_project.avatar')}
                </FormLabel>
                <div className="mb-1 mt-2 flex items-center justify-between">
                  <div className="mr-4 flex-1">
                    <Input
                      disabled
                      value={
                        uploadImageFileName !== ''
                          ? uploadImageFileName
                          : ''
                      }
                      placeholder={t(
                        'cloud:project_manager.add_project.no_file',
                      )}
                      className="h-9 w-full disabled:cursor-auto disabled:bg-white"
                    />
                  </div>
                  <FormField
                    control={controlUploadImage}
                    name="file"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel className="flex h-9 w-fit cursor-pointer items-center justify-center gap-x-2 rounded-md border bg-primary-200 px-5 py-2 font-medium text-primary shadow-xs hover:opacity-80">
                          {t('cloud:project_manager.add_project.upload')}
                        </FormLabel>
                        <div>
                          <FormControl>
                            <Input
                              type="file"
                              className="mt-2 border-none p-2 shadow-none"
                              {...controlUploadImage.register('file')}
                              onChange={event => {
                                setUploadImageErr('')
                                if (event.target && event.target.files) {
                                  const file = event.target.files[0]
                                  const formData = new FormData()
                                  formData.append('file', event.target.files[0])
                                  setValueUploadImage(
                                    'file',
                                    formData.get('file') as unknown as {
                                      file: File
                                    },
                                  )
                                  if (file && file.size > MAX_FILE_SIZE) {
                                    setUploadImageErr(
                                      t('validate:image_max_size'),
                                    )
                                    return false
                                  }
                                  if (
                                    file
                                    && !ACCEPTED_IMAGE_TYPES.includes(file.type)
                                  ) {
                                    setUploadImageErr(t('validate:image_type'))
                                    return false
                                  }

                                  if (file) {
                                    const reader = new FileReader()
                                    reader.readAsDataURL(file)
                                    reader.onload = e => {
                                      if (
                                        avatarRef.current != null
                                        && e.target != null
                                        && reader.readyState === 2
                                      ) {
                                        avatarRef.current.src = e.target
                                          .result as string
                                      }
                                    }
                                  }
                                  setUploadImageFileName(file.name)
                                  event.target.value = ''
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="text-body-xs">
                {t('cloud:project_manager.add_project.upload_instruction')}
              </div>
              <p className="text-body-sm text-primary">{uploadImageErr}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              isLoading={
                isLoadingCreateProject
                || isLoadingUpload
                || isLoadingUpdateProject
              }
              form="create-project"
              type="submit"
              size="md"
              className="rounded-md border bg-primary"
            >
              {t('dialog:save')}
            </Button>
            <Button
              type="button"
              variant="secondaryLight"
              className="inline-flex w-full justify-center rounded-md border-none focus:ring-1 focus:ring-secondary-700 focus:ring-offset-1 sm:mt-0 sm:w-auto sm:text-body-sm"
              onClick={() => {
                close(true)
              }}
            >
              {t('dialog:cancel')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
