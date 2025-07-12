import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'


export function useCopyId() {
  const { t } = useTranslation()

  async function handleCopyId(id: string, title?: string, typeCopy?: string) {
    try {
      if (id === '') {
        toast.error(
          t('cloud:org_manage.org_map.copy_fail').replace(
            '{{TITLE}}',
            () => title ?? '',
          ),
        )
        return
      }
      if (!window.isSecureContext) {
        toast.error(t('cloud:org_manage.org_map.copy_fail_insecure_web'))
        return
      }
      else {
        await navigator.clipboard.writeText(id)
        toast.success(
          t('cloud:org_manage.org_map.copy_success').replace(
            '{{TITLE}}',
            () => title ?? '',
          ),
        )
      }
    }
    catch (error) {
      console.error(error)
      toast.error('Lỗi copy. Xin thử lại.')
    }
  }

  return handleCopyId
}
