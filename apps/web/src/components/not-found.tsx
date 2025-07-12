import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigate } from '@tanstack/react-router'
import { AnimatedWrapper } from './animated-wrapper'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => navigate({to: '/project'}), 3000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <AnimatedWrapper>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-gray-800">
        <h1 className="text-9xl font-extrabold tracking-widest text-gray-900">
          404
        </h1>
        <div className="absolute rotate-12 rounded-sm bg-blue-500 px-2 text-sm text-background">
          Trang không tồn tại
        </div>
        <p className="mt-5 text-lg">{t('error:page_not_found')}</p>
      </div>
    </AnimatedWrapper>
  )

  return null
}
