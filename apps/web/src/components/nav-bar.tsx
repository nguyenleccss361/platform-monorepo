import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LuLanguages, LuUser } from 'react-icons/lu'
import { useSpinDelay } from 'spin-delay'
import useLocalStorageState from 'use-local-storage-state'

import manualIcon from '@/assets/icons/nav-manual.svg'
import qldaIcon from '@/assets/icons/nav-qlda.svg'
import English from '@/assets/images/landingpage/uk-flag.png'
import VietNam from '@/assets/images/landingpage/vietnam-flag.png'
import { SidebarDropDownIcon } from '@/components/svg-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { API_URL } from '@/config'
import i18n from '@/i18n'
import { useLogout, useUser } from '@/lib/auth'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useCopyId } from '@/hook'
import { useProjects } from '@/features/project/api/get-projects'
import { useUserInfo } from '@/features/auth/api/get-user-info'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

const languages = [
  { code: 'vi', name: 'Tiếng Việt', icon: VietNam },
  { code: 'en', name: 'English', icon: English },
] as const

export function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useRouterState({
    select: state => state.location,
  })

  const [, setProjectId] = useLocalStorageState<string>(
    'iot_platform_projectId',
  )
  const [projectId] = useLocalStorageState<string>(
    'iot_platform_projectId',
  ) as unknown as string

  const logout = useLogout()
  const handleCopyId = useCopyId()

  const [searchQuery, setSearchQuery] = useState<string>('')

  const { data: projectsData, isLoading: isLoadingProjectsData } = useProjects({
    search_str: searchQuery,
  })

  const { data: userInfoData, isLoading: userInfoIsLoading } = useUserInfo({})
  const { data: userDataFromStorage } = useUser()

  const showSpinner = useSpinDelay(userInfoIsLoading, {
    delay: 150,
    minDuration: 300,
  })

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <div className="flex w-full">
      <nav className="flex h-16 w-full justify-end gap-x-5 border-b-2 border-solid pr-5 lg:gap-x-10">
        <DropdownMenu>
          <div className="flex items-center gap-x-2">
            <DropdownMenuTrigger className="flex items-center gap-x-2">
              <p className="flex w-full gap-2">
                <img
                  src={qldaIcon}
                  alt="Project management"
                  className="aspect-square w-5"
                />
                {t('nav:qlda')}
              </p>
              <SidebarDropDownIcon width={8} height={8} viewBox="0 0 12 7" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent
            className="flex max-h-[360px] w-[260px] min-w-[260px] flex-col overflow-y-auto rounded-md bg-white p-3 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
            sideOffset={20}
          >
            <Command>
              <CommandInput
                placeholder={t('nav:project_placeholder')}
                className="h-9"
                onValueChange={value => {
                  if (value === '') {
                    setSearchQuery('')
                  }
                  if (
                    projectsData?.projects?.find(project =>
                      project.name.toLowerCase().includes(value.toLowerCase()),
                    ) == null
                  ) {
                    setSearchQuery(value)
                  }
                }}
              />
              <CommandList>
                <CommandEmpty>{t('nav:no_project')}</CommandEmpty>
                {isLoadingProjectsData && (
                  <CommandLoading>
                    {t('cloud:project_manager.add_project.loading')}
                  </CommandLoading>
                )}
                <CommandGroup>
                  {projectsData?.projects?.map(project => {
                    return (
                      <CommandItem
                        key={project.id}
                        value={project.name}
                        onSelect={() => {
                          setProjectId(project.id)
                          // navigate({ to: `${PATHS.ORG_MANAGE}/${project.id}`})
                        }}
                        className={cn(
                          'group relative my-1 flex cursor-pointer select-none items-center gap-x-3 gap-y-5 rounded-lg px-1 py-2 pl-3 leading-none outline-none hover:bg-hover-secondary/10',
                          {
                            'bg-primary text-white aria-selected:bg-primary/100 aria-selected:text-white':
                              project.id === projectId,
                          },
                        )}
                      >
                        <DropdownMenuItem>
                          <div className="rounded-full ring-4 ring-slate-400">
                            {project.image !== ''
                              ? (
                                <img
                                  src={`${API_URL}/file/${project.image}`}
                                  alt="Project"
                                  className="aspect-square w-5 rounded-full ring-2 ring-slate-300"
                                />
                              )
                              : (
                                <LuUser className="size-5" />
                              )}
                          </div>
                          <div className="space-y-1">{project.name}</div>
                        </DropdownMenuItem>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>

        <a
          className="flex cursor-pointer items-center gap-x-2"
          target="_blank"
          href="https://innoway.gitbook.io/innoway/"
          rel="noreferrer"
        >
          <img src={manualIcon} alt="Manual" className="aspect-square w-5" />
          <p>{t('nav:manual')}</p>
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex items-center gap-x-2">
            <div className="cursor-pointer">
              {languages.find(language => i18n.language === language.code)
                ?.icon != null
                ? (
                  <img
                    src={languages.find(language => i18n.language === language.code)?.icon}
                    alt="flag"
                    className="h-auto w-6"
                  />
                )
                : <LuLanguages />}
              <p>
                {languages.find(language => i18n.language === language.code)?.name ?? t('nav:choose_lang')}
              </p>
              <SidebarDropDownIcon width={8} height={8} viewBox="0 0 12 7" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex max-h-[360px] min-w-[160px] flex-col overflow-y-auto rounded-md bg-white p-3 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
            sideOffset={-15}
          >
            {languages.map(language => (
              <DropdownMenuItem
                key={language.code}
                className="group relative mb-1 flex cursor-pointer select-none items-center gap-x-3 rounded-md px-1 leading-none outline-none hover:bg-hover-secondary/10"
                onClick={() => changeLanguage(language.code)}
              >
                <img src={language.icon} alt="" className="h-auto w-8" />
                <div>{language.name}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {userInfoIsLoading
          ? (
            <div className="flex items-center justify-center">
              <Spinner showSpinner={showSpinner} size="md" />
            </div>
          )
          : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="flex items-center gap-x-2">
                <div className="cursor-pointer">
                  <div className="flex h-8 items-center gap-2">
                    {userInfoData && userInfoData.profile.profile_image !== ''
                      ? (
                        <img
                          className="size-8 rounded-full"
                          src={userInfoData.profile.profile_image}
                          alt="User Avatar"
                        />
                      )
                      : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-secondary-500">
                          {userInfoData?.name
                            ? userInfoData.name.substring(0, 2).toUpperCase()
                            : userInfoData?.email.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    <div className="">
                      <div className="flex items-center gap-2">
                        <p className="h-fit font-[600]">
                          {userInfoData != null
                            ? userInfoData.name
                            : t('nav:friend')}
                        </p>
                        <SidebarDropDownIcon
                          width={8}
                          height={8}
                          viewBox="0 0 12 7"
                        />
                      </div>
                      <p className="text-secondary-700">
                        {userInfoData != null && userInfoData.profile.company}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="flex max-h-[360px] w-[220px] flex-col overflow-y-auto rounded-md bg-white p-3 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
                sideOffset={-15}
              >
                <DropdownMenuItem className="mb-2 rounded-md p-2 hover:bg-hover-secondary/10 focus-visible:border-none focus-visible:outline-none">
                  {userDataFromStorage != null
                    ? (
                      <p
                        className="cursor-pointer"
                        onClick={() =>
                          handleCopyId(userDataFromStorage.device_token)}
                      >
                        {t('user:copy_device_token')}
                      </p>
                    )
                    : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className={cn(
                    'mb-2 rounded-md p-2 hover:bg-hover-secondary/10 focus-visible:border-none focus-visible:outline-none',
                    {
                      'bg-primary text-white hover:bg-primary/100':
                        location.pathname.split('/')[1] === 'auth',
                    },
                  )}
                >
                  <Link to=".">
                    {t('user:change_password')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-md p-2 hover:bg-hover-secondary/10 focus-visible:border-none focus-visible:outline-none"
                  onClick={() => logout.mutate({})}
                >
                  <p>{t('user:logout')}</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </nav>
    </div>
  )
}
