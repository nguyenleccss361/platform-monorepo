import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import frameAuth from '@/assets/images/frame-auth-layout.svg'
import logo from '@/assets/images/logo.svg'
import textureLogin from '@/assets/images/texture-auth-layout.svg'
import { Head } from './header'
type LayoutProps = {
  children: ReactNode
  title: string
}

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const { t } = useTranslation()
  return (
    <>
      <Head title={title} />
      <div
        className="relative min-h-screen bg-neutral-600"
        style={{ backgroundImage: `url(${textureLogin})` }}
      >
        <div className="flex h-[99.3vh] pb-20 pt-30 sm:px-14 lg:px-60">
          <div className="flex w-2/3 shrink flex-col items-center justify-center rounded-s-lg bg-white">
            <div className="flex justify-center pt-16 sm:py-5 lg:pb-5 lg:pt-10">
              <img src={logo} alt="logo" />
            </div>
            <div className="flex justify-center pt-16 sm:py-5 lg:pt-5">
              <img src={frameAuth} alt="" />
            </div>
          </div>
          <div className="flex w-1/3 flex-col items-center justify-center bg-white sm:rounded-e-lg">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mb-4 mt-10 text-center text-xl font-extrabold text-gray-900">
                {title}
              </h2>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="px-4 py-0  sm:px-10">{children}</div>
            </div>
          </div>
        </div>
        <footer className="absolute bottom-5 left-1/2 -translate-x-1/2 py-0">
          <div className="container mx-auto text-center">
            <ul className="text-body-xs">
              <li>
                {t('auth:footer_text_1').replace(
                  '{{YEAR}}',
                  String(new Date().getFullYear()),
                )}
              </li>
              <li>{t('auth:footer_text_2')}</li>
            </ul>
          </div>
        </footer>
      </div>
    </>
  )
}
