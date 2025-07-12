import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { LuTrash } from 'react-icons/lu'
import { z } from 'zod'

import btnRemoveIcon from '@/assets/icons/btn-remove.svg'
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
import {
  type RestoreProjectDTO,
  useRestoreProject,
} from '../api/restore-project'
import { CreateProjectSchema } from '@/routes/_project-layout.project'
import { useUploadImageAPI } from '../api/upload-image'
import { ACCEPTED_RESTORE_FILE, restoreProjectSchema, useCreateProject, type CreateProjectDTO } from '../api/create-project'
import { useUpdateProject } from '../api/update-project'
import { useUploadImage } from '@/hook/use-upload-image'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/const'

export const uploadImageResSchema = z.object({
  link: z.string(),
  last_modified: z.number(),
})

type ImportProjectProps = {
  close: React.Dispatch<React.SetStateAction<boolean>>
}

export function ImportProject({ close }: ImportProjectProps) {
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
    resolver: CreateProjectSchema && zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const { handleSubmit, watch } = form

  const { mutateAsync: mutateAsyncUploadImage } = useUploadImageAPI()

  const { mutateAsync: mutateAsyncUploadProjectFile } = useRestoreProject()

  const { mutate: mutateUpdateProject } = useUpdateProject({
    isOnCreateProject: true,
  })

  const {
    mutateAsync: mutateAsyncCreateProject,
    isPending: isLoadingCreateProject,
  } = useCreateProject()

  function handleResetRestoreProject() {
    setValueUploadRestoreProject('backup', null)
    setRestoreProjectFileName('')
    setUploadRestoreProjectErr('')
  }

  function handleResetForm() {
    setUploadImageFileName('')
  }

  const {
    control: controlUploadRestoreProject,
    setValue: setValueUploadRestoreProject,
    getValues: getValueUploadRestoreProject,
  } = useForm<RestoreProjectDTO>({
    resolver: restoreProjectSchema && zodResolver(restoreProjectSchema),
  })

  const [uploadRestoreProjectErr, setUploadRestoreProjectErr] = useState('')
  const [restoreProjectFileName, setRestoreProjectFileName] = useState('')
  const [uploadImageFileName, setUploadImageFileName] = useState('')

  return (
    <Form {...form}>
      <form
        id="import-project"
        className="flex w-full flex-col justify-between space-y-6"
        onSubmit={handleSubmit(async values => {
          if (uploadRestoreProjectErr !== '') return
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
          if (getValueUploadRestoreProject('backup') != null) {
            const dataBackup = JSON.parse(
              getValueUploadRestoreProject('backup'),
            )
            await mutateAsyncUploadProjectFile({
              projectId: dataCreateProject.id,
              backup: {
                backup: dataBackup,
              },
            })
          }
        })}
      >
        <div className="mt-4 grid gap-y-4">
          <div>
            <FormLabel>
              {t('cloud:project_manager.add_project.import_project')}
              <span className="pl-1 text-primary">*</span>
            </FormLabel>
            <div className="mb-1 mt-2 flex items-center justify-between">
              <div className="relative mr-4 flex-1">
                <Input
                  disabled
                  value={
                    restoreProjectFileName !== ''
                      ? restoreProjectFileName
                      : ''
                  }
                  placeholder={t('cloud:project_manager.add_project.no_file')}
                  className="h-9 w-full disabled:cursor-auto disabled:bg-white"
                  endIcon={
                    restoreProjectFileName
                      ? (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pl-4">
                          <img
                            height={12}
                            width={12}
                            src={btnRemoveIcon}
                            className="cursor-pointer text-secondary-700 hover:text-primary"
                            onClick={handleResetRestoreProject}
                            alt="import project"
                          />
                        </div>
                      )
                      : (
                        <></>
                      )
                  }
                />
              </div>
              <FormField
                control={controlUploadRestoreProject}
                name="backup"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="flex h-9 w-fit cursor-pointer items-center justify-center gap-x-2 rounded-md border bg-primary-200 px-5 py-2 font-medium text-primary shadow-sm hover:opacity-80">
                      {t('cloud:project_manager.add_project.upload')}
                    </FormLabel>
                    <div>
                      <FormControl>
                        <Input
                          type="file"
                          className="mt-2 border-none p-0 shadow-none"
                          {...controlUploadRestoreProject.register('backup')}
                          onChange={event => {
                            setUploadRestoreProjectErr('')
                            if (event.target && event.target.files) {
                              const file = event.target.files[0]
                              setRestoreProjectFileName(file.name)
                              const reader = new FileReader()
                              reader.readAsText(file)
                              reader.onload = e => {
                                const formData = new FormData()
                                formData.append(
                                  'backup',
                                  e.target?.result as unknown as string,
                                )
                                setValueUploadRestoreProject(
                                  'backup',
                                  formData.get('backup') as unknown as string,
                                )

                                if (
                                  !ACCEPTED_RESTORE_FILE.includes(file.type)
                                ) {
                                  setUploadRestoreProjectErr(
                                    t('validate:json_type'),
                                  )
                                  return false
                                }
                              }
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
            <div className="text-body-xs">
              {t('cloud:project_manager.add_project.import_instruction')}
            </div>
            <p className="text-body-sm text-primary">
              {uploadRestoreProjectErr}
            </p>
          </div>
          <div className="space-y-3">
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
            <div className="relative mb-4 h-28 rounded-md bg-backgroundUpload">
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
                  className="mb-3 h-28 w-full rounded-md"
                  ref={avatarRef}
                />
              )}
              {uploadImageFileName !== ''
                ? (
                  <Button
                    className="absolute right-5 top-5"
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
                    placeholder={t('cloud:project_manager.add_project.no_file')}
                    className="h-9 w-full disabled:cursor-auto disabled:bg-white"
                  />
                </div>
                <FormField
                  control={controlUploadImage}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="flex h-9 w-fit cursor-pointer items-center justify-center gap-x-2 rounded-md border bg-primary-200 px-5 py-2 font-medium text-primary shadow-sm hover:opacity-80">
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
                              if (event.target.files && event.target) {
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
            isLoading={isLoadingCreateProject}
            form="import-project"
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
  )
}
