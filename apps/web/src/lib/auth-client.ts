import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
      import.meta.env.VITE_APP_API_URL,
});
