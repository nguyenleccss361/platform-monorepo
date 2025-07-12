import { cn } from '@/lib/utils'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { HiOutlineBars3 } from 'react-icons/hi2'
import logo from '@/assets/images/logo.svg'
import ProjectSidebar from '@/features/project/components/project-sidebar'
import { Navbar } from '@/components/nav-bar'

export const Route = createFileRoute('/_project-layout')({
  component: RouteComponent,
})

function RouteComponent({ hasSideBar = true }: { hasSideBar?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen overflow-hidden md:h-screen">
      {hasSideBar
        ? (
          <>
            {/* <ProjectMobileSidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            /> */}
            <ProjectSidebar />
          </>
        )
        : null}
      <div
        className={cn(
          'flex w-full flex-col',
          hasSideBar && 'lg:w-[calc(100vw-16rem)]',
        )}
      >
        <div className="flex">
          {hasSideBar
            ? (
              <button
                className="bg-secondary-900 px-4 text-white focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-secondary-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <HiOutlineBars3 className="size-6" aria-hidden="true" />
              </button>
            )
            : null}

          {hasSideBar
            ? null
            : (
              // <NavLink
              //   to="https://iot.vtscloud.vn/"
              //   reloadDocument
              //   className="flex h-20 min-w-[256px] items-center justify-center border-b-2 border-solid bg-white"
              // >
                (<img src={logo} alt="logo" className="h-14 cursor-pointer" />)
              // </NavLink>
            )}
          <Navbar />
        </div>

        <main
          className={cn(
            'flex w-full grow flex-col self-center overflow-y-auto border-l bg-secondary p-3',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
