import { Toaster } from "@/components/ui/sonner";

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import appCss from "../index.css?url";
import { QueryClient } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { useUser } from "@/lib/auth";
import useLocalStorageState from "use-local-storage-state";
import { useEffect } from "react";
import '@/style/progress-bar.css'
import { endProgress, startProgress } from "@/components/progress";

export interface RouterAppContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Dev portal - InnoWay IoT Platform",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
  // shellComponent: RootDocument
});

function RootDocument() {
  const {
    status,
    location: { pathname },
    isLoading
  } = useRouterState({
    select: s => ({ status: s.status, location: s.location, isLoading: s.isLoading }),
  })

  // const navigate = useNavigate()

  // const isAuthRoutes
  //   = pathname === PATHS.FORGETPASSWORD
  //   || pathname === PATHS.REGISTER
  //   || pathname === PATHS.LOGIN

  // const isCommonRoutes
  //   = pathname === PATHS.VERSION
  //   || pathname === PATHS.MAINTAIN
  //   || pathname === PATHS.NOTFOUND

  // const { data: userDataFromStorage } = useUser()
  // const [projectId] = useLocalStorageState<string>('iot_platform_projectId') as unknown as string


  // // Auto redirect to login page when token is null
  // useEffect(() => {
  //   if (
  //     userDataFromStorage == null
  //     && !isAuthRoutes
  //     && !isCommonRoutes
  //     && pathname !== PATHS.LOGIN
  //   ) {
  //     navigate({ to: '/auth/login' });    }
  // }, [isAuthRoutes, userDataFromStorage])

  // // Auto redirect to project manage page when token is available or when projectId is null or redirect from landing page
  // useEffect(() => {
  //   if (
  //     userDataFromStorage != null
  //     && pathname !== PATHS.PROJECT_MANAGE
  //   ) {
  //     if (projectId == null || isAuthRoutes) {
  //       if (pathname !== PATHS.VERSION) {
  //         navigate({ to: '/project' });
  //       }
  //     }
  //   }
  // }, [isAuthRoutes, projectId, userDataFromStorage])
  useEffect(() => {
    if (isLoading && status === 'pending') {
      startProgress()
    } else if (!isLoading || status === 'idle') {
      endProgress()
    }
  }, [status, isLoading])

  return (
    <HelmetProvider>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <Toaster
            position="top-right"
            closeButton
            richColors
            duration={5000}
            visibleToasts={10}
          />
          <div className="grid h-svh grid-rows-[auto_1fr]">
            <Outlet />
          </div>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <Scripts />
        </body>
      </html>
    </HelmetProvider>
  );
}
