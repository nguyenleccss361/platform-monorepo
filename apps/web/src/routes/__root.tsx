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
import appCss from "../index.css?url";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { HelmetProvider } from "react-helmet-async";
import { useUser } from "@/lib/auth";
import useLocalStorageState from "use-local-storage-state";
import { useEffect } from "react";
import '@/style/progress-bar.css'
import { endProgress, startProgress } from "@/components/Progress";

export interface RouterAppContext {
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
  } = useRouterState({
    select: s => ({ status: s.status, location: s.location }),
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
    if (status === 'pending') {
      startProgress()
    } else if(status === 'idle') {
      endProgress()
    }
  }, [status])

  return (
    <HelmetProvider>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <QueryClientProvider client={queryClient}>
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
            <TanStackRouterDevtools position="bottom-left" />
          </QueryClientProvider>
          <Scripts />
        </body>
      </html>
    </HelmetProvider>
  );
}
