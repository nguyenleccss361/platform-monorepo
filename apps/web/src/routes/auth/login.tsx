import { AuthLayout } from '@/components/auth-layout';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next';
import useLocalStorageState from 'use-local-storage-state'
import { LoginForm } from '../../features/auth/component/LoginForm';

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
  ssr: false
});

function RouteComponent() {

  const { t } = useTranslation()
  const navigate = useNavigate()


  const [, , { removeItem }] = useLocalStorageState<string>(
    'iot_platform_projectId',
  )

  return (
    <AuthLayout title={t('user:login')}>
      <LoginForm
        onSuccess={() => {
          removeItem()
          navigate({
            to: '/project',
            replace: true,
          })
        }}
      />
    </AuthLayout>
  )
}
