import { TitleBar } from '@/components/Head'
import { SearchField } from '@/components/Input'
import { SkeletonLoading } from '@/components/Skeleton'
import { getProjectsOptions } from '@/features/project/api'
import { CreateProject } from '@/features/project/components/CreateProject'
import { ListProjectItem } from '@/features/project/components/ListProjectItem'
import { useAuthorization } from '@/lib/authorization'
import type { BasePagination } from '@/types/base'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import z from 'zod'
import { ContentLayout } from './_contentLayout'
import { useSuspenseQuery } from '@tanstack/react-query'

export type Project = {
  id: string
  name: string
  image: string
  description: string
  app_key: string
  app_secret: string
  sms_config: {
    type: string
    config: {
      code: string
      password: string
      service_id: string
      url: string
      user: string
    } | null
    content: string
    reset_password_content: string
  }
  tenant_dev_quantity: string
  device_quantity: string
}

export type ProjectList = {
  projects?: Project[]
} & BasePagination

export const CreateProjectSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  description: z.string(),
})

export const Route = createFileRoute('/_projectLayout/project')({
  component: RouteComponent,
  pendingComponent: () => {
    return (<SkeletonLoading type='full' className="bg-slate-300"/>)
  },
  ssr: false,
  loader: async ({context}) => {
     context.queryClient.prefetchQuery(getProjectsOptions())
  },
})

function RouteComponent({ hasSideBar = true }: { hasSideBar?: boolean }) {
  const { t } = useTranslation()

  return (
    <ContentLayout title={t('cloud:project_manager.title')}>
      <Suspense fallback="Tại sao không hiện fallback Suspense???">
        <ProjectListPanel />
      </Suspense>
    </ContentLayout>
  )
}

function ProjectListPanel() {
  const { t } = useTranslation()
  const { checkAccessHook } = useAuthorization()

  const [searchQuery, setSearchQuery] = useState('')
  const { data: projectsData } = useSuspenseQuery({
    ...getProjectsOptions({ search_str: searchQuery }),
  })
  
  return (
    <div className="p-3">
      <div className="flex items-center">
        <div className="w-full">
          <TitleBar
            className="w-full"
            title={t('cloud:project_manager.project')}
          />
          {Number(projectsData.total) > 0
            ? (
              <div className="w-full">
                <div className="my-1 text-sm text-secondary-700">
                  {t('cloud:project_manager.count_project').replace(
                    '{{NO_OF_PROJECT}}',
                    Number(projectsData.total).toString(),
                  )}
                </div>
              </div>
            )
            : null}
        </div>
        <div className="ml-3 flex items-center gap-x-4">
          <SearchField
            setSearchValue={value => setSearchQuery(value)}
            closeSearch={true}
            placeholder={t('cloud:project_manager.search_placeholder')}
          />
          {checkAccessHook({
            allowedRoles: ['SYSTEM_ADMIN', 'TENANT'],
          }) && <CreateProject />}
        </div>
      </div>
      <div className="mt-6">
        {Number(projectsData.total) > 0
          ? <ListProjectItem listProjectData={projectsData.projects ?? []} />
          : <div>{t('cloud:project_manager.no_data')}</div>}
      </div>
    </div>
  )
}
