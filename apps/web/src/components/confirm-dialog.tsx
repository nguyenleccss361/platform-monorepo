import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlineXMark } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTitle } from '@/components/ui/dialog'

export type ConfirmDialogProps = {
  title: string
  body?: string | ReactNode
  icon?: 'danger' | 'info' | 'block' | 'active'
  close: () => void
  isOpen: boolean
  isLoading: boolean
  isSuccess: boolean
  handleSubmit: () => void
}

export const ConfirmDialog = ({
  title,
  body = '',
  icon = 'danger',
  close,
  isOpen,
  isLoading,
  isSuccess,
  handleSubmit,
}: ConfirmDialogProps) => {
  const cancelButtonRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [close, isSuccess])

  return (
    <>
      <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
        <div className="relative inline-block rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute -right-3 -top-3">
            <button
              className="rounded-md bg-white text-secondary-900 hover:text-secondary-700 focus:outline-hidden focus:ring-2 focus:ring-secondary-600"
              onClick={close}
            >
              <span className="sr-only">Close panel</span>
              <HiOutlineXMark className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 px-5 pb-5 text-center sm:mt-0 sm:text-center">
            <div className="flex items-center justify-between">
              <div className="mx-auto">
                <DialogTitle className="text-2xl font-semibold ">
                  {title}
                </DialogTitle>
              </div>
            </div>
            {body && (
              <div className="mt-2">
                <p className="text-body-sm text-secondary-900">{body}</p>
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-center space-x-2">
             <Button
              type="button"
              variant="secondaryLight"
              onClick={close}
              ref={cancelButtonRef}
            >
              {t('btn:cancel')}
            </Button>
            <Button
              isLoading={isLoading}
              type="button"
              size="md"
              className="bg-primary"
              onClick={handleSubmit}
            >
              {icon === 'danger' && t('btn:delete')}
              {icon === 'block' && t('btn:block')}
              {icon === 'active' && t('btn:active')}
              {icon === 'info' && t('btn:save')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
