import { Head } from '@/components/header'
import { type ReactNode } from 'react'

type ContentLayoutProps = {
  children: ReactNode
  title: string
}

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      {children}
    </>
  )
}
