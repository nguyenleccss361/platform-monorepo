import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/react-query";
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { NotFoundPage } from "./components/not-found";

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      context: {
        queryClient
      },
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: NotFoundPage,
      Wrap: ({ children }) => <>{children}</>,
    }),
    queryClient,
  )
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
