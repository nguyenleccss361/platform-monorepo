import { DownloadIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoCpu } from 'react-icons/go'
import { RxAvatar } from 'react-icons/rx'
import { toast } from 'sonner'
import useLocalStorageState from 'use-local-storage-state'

import btnDeleteIcon from '@/assets/icons/btn-delete.svg'
import btnEditIcon from '@/assets/icons/btn-edit.svg'
import { BtnContextMenuIcon } from '@/components/svg-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { API_URL } from '@/config'
import { useAuthorization } from '@/lib/authorization'

import { backupProject } from '../api/backup-project'
import { useDeleteProject } from '../api/delete-project'

import { UpdateProject } from './update-project'
import { useNavigate } from '@tanstack/react-router'
import type { Project } from '@/routes/_project-layout.project'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDisclosure } from '@/hook/use-disclosure'

export function ListProjectItem({
  listProjectData,
}: {
  listProjectData: Project[]
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { checkAccessHook } = useAuthorization()

  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [, setProjectId] = useLocalStorageState<string>(
    'iot_platform_projectId',
  )

  const { close, open, isOpen } = useDisclosure()
  const {
    close: closeDelete,
    open: openDelete,
    isOpen: isOpenDelete,
  } = useDisclosure()

  const { mutateAsync, isPending, isSuccess } = useDeleteProject()

  const [selectedUpdateProject, setSelectedUpdateProject] = useState<Project>()

  async function handleBackupProject(project: Project) {
    const loadingToast = toast.loading(t('loading:loading'))
    const data = await backupProject({ projectId: project.id })
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `${project.name}.json`
    link.click()
    toast.dismiss(loadingToast)
    toast.success(t('cloud:tenant.success_export'))
    URL.revokeObjectURL(href)
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {listProjectData.map((project: Project) => {
        return (
          <div
            key={project.id}
            className="relative cursor-pointer bg-background-upload shadow-xl"
            style={{
              height: '186px',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url(${API_URL}/file/${project.image})`,
              borderRadius: '10px',
            }}
            onClick={() => {
              setProjectId(project.id)
              // navigate({ to: `${PATHS.ORG_MANAGE}/${project.id}`})
            }}
          >
            <div className="h-full rounded-[10px] bg-black/40 p-6">
              <p className="mb-3 text-h2 text-white">{project.name}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left text-white">
                    {project.description.length > 100
                      ? project.description.slice(0, 100) + '...'
                      : project.description}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {checkAccessHook({
              allowedRoles: ['SYSTEM_ADMIN', 'TENANT'],
            }) && (
              <div
                className="absolute right-6 top-6 flex size-7 justify-center rounded-full bg-[#9B9B9B] hover:bg-primary/90"
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="flex items-center justify-center rounded-md text-body-sm text-white hover:bg-primary/40 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white/75">
                      <BtnContextMenuIcon
                        height={20}
                        width={18}
                        viewBox="0 0 3 20"
                        className="text-white"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        open()
                        setSelectedUpdateProject(project)
                      }}
                    >
                      <img
                        src={btnEditIcon}
                        alt="Edit project"
                        className="size-5"
                      />
                      {t('cloud:project_manager.add_project.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleBackupProject(project)
                      }}
                    >
                      <DownloadIcon className="size-5" />
                      {t('cloud:project_manager.backup')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        openDelete()
                        setId(project.id)
                        setName(project.name)
                      }}
                    >
                      <img
                        src={btnDeleteIcon}
                        alt="Delete project"
                        className="size-5"
                      />
                      {t('cloud:project_manager.add_project.delete_project')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {selectedUpdateProject?.id === project.id
                  ? (
                    <UpdateProject
                      close={close}
                      isOpen={isOpen}
                      selectedUpdateProject={selectedUpdateProject}
                    />
                  )
                  : null}
              </div>
            )}
            {/* Project card */}
            <div
              className="absolute bottom-0 flex items-center justify-between gap-x-3 whitespace-nowrap p-6"
              style={{
                height: '80px',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '0 0 10px 10px',
              }}
            >
              <div className="flex items-center">
                <RxAvatar className="mr-3 aspect-square size-6 rounded-full text-secondary-600" />
                {t('cloud:project_manager.count_dev').replace(
                  '{{COUNT_DEV}}',
                  project.tenant_dev_quantity || '0',
                )}
              </div>
              <div className="flex items-center">
                <GoCpu className="mr-3 size-6 text-secondary-600" />
                {t('cloud:project_manager.count_device').replace(
                  '{{COUNT_DEVICE}}',
                  project.device_quantity || '0',
                )}
              </div>
            </div>
          </div>
        )
      })}

      <ConfirmDialog
        icon="danger"
        title={t('cloud:project_manager.add_project.delete_project')}
        body={t('cloud:project_manager.add_project.confirm_delete').replace(
          '{{PROJECT}}',
          name,
        )}
        close={closeDelete}
        isOpen={isOpenDelete}
        isSuccess={isSuccess}
        handleSubmit={async () => {
          await mutateAsync({
            projectId: id,
          })
          closeDelete()
        }}
        isLoading={isPending}
      />
    </div>
  )
}
