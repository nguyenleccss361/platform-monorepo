import { z } from 'zod'

export const API_URL = import.meta.env.VITE_APP_API_URL
export const WS_URL = import.meta.env.VITE_APP_WS_URL
export const APP_VERSION = import.meta.env.VITE_APP_VERSION

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    VERSION: z.string(),
  })

  const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>((acc, curr) => {
    const [key, value] = curr
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value
    }
    return acc
  }, {})

  const parsedEnv = EnvSchema.safeParse(envVars)

  if (!parsedEnv.success) {
    throw new Error(
      `Biến môi trường không tồn tại. Vui lòng tạo env ở file .env.local: ${Object.entries(parsedEnv.error.flatten().fieldErrors)
        .map(([k, v]) => `- ${k}: ${v.join(', ')}`)
        .join('\n')}`,
    )
  }

  return parsedEnv.data
}

export const env = createEnv()
