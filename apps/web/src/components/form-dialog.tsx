import {
  type ReactElement,
  cloneElement,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlineXMark } from 'react-icons/hi2'

import btnCancelIcon from '@/assets/icons/btn-cancel.svg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useDisclosure } from '@/hook/use-disclosure'

const formDialogSizes = {
  sm: 'max-w-[32rem]',
  xl: 'max-w-[36rem]',
  md: 'max-w-[48rem]',
  lg: 'max-w-[60rem]',
  max: 'max-w-[75rem]',
}

export type ConfirmationDialogProps = {
  triggerButton: ReactElement
  confirmButton?: ReactElement
  title: string
  body?: string | ReactNode
  isDone?: boolean
  className?: string
  id?: string
  resetData?: () => void
  resetForm?: () => void
  size?: keyof typeof formDialogSizes
  isFullScreen?: boolean
  titleBtnCancel?: string
  isShowCancel?: boolean
}

export const FormDialog = ({
  triggerButton,
  confirmButton,
  title,
  body = '',
  isDone = false,
  id,
  resetData,
  resetForm, // reset form when pressing cancel button only
  isFullScreen,
  size,
  className,
  titleBtnCancel,
  isShowCancel = true,
}: ConfirmationDialogProps) => {
  const { close, open, isOpen } = useDisclosure()
  const { t } = useTranslation()

  const cancelButtonRef = useRef(null)

  useEffect(() => {
    if (isDone) {
      close()
    }
  }, [close, isDone])

  const trigger = cloneElement(triggerButton, {
    onClick: () => {
      triggerButton.props.onClick?.()
      open()
      resetData?.()
    },
  })

  return (
    <>
      {trigger}
      <Dialog
        isOpen={isOpen}
        onClose={() => null}
        initialFocus={cancelButtonRef}
      >
        <div
          id={id}
          className={cn(
            'relative inline-block rounded-lg bg-white p-8 text-left align-bottom shadow-xl transition-all sm:w-full sm:align-middle',
            className,
            size
              ? formDialogSizes[size]
              : 'sm:max-w-lg',
            isFullScreen
              ? 'h-screen !max-w-full pt-3'
              : '',
          )}
        >
          {!isFullScreen && (
            <div className="absolute -right-3 -top-3">
              <button
                className="rounded-md bg-white text-secondary-900 hover:text-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-600"
                onClick={close}
              >
                <span className="sr-only">Close panel</span>
                <HiOutlineXMark className="size-6" aria-hidden="true" />
              </button>
            </div>
          )}
          <div
            className={cn('text-center sm:mt-0 sm:text-left', {
              'h-[95%]': isFullScreen,
            })}
          >
            {!isFullScreen && (
              <div className="flex items-center justify-between">
                <div className="mx-auto">
                  <DialogTitle className="text-2xl font-semibold ">
                    {title}
                  </DialogTitle>
                </div>
              </div>
            )}
            {body && (
              <div
                className={cn('mt-4', {
                  'h-[95%]': isFullScreen,
                })}
              >
                <p className="text-body-sm text-secondary-900">{body}</p>
              </div>
            )}
          </div>
          <div className={cn('mt-4 flex justify-center space-x-4')}>
            {confirmButton}
            {isShowCancel && (
              <Button
                type="button"
                variant="secondaryLight"
                onClick={() => {
                  resetForm?.()
                  close()
                }}
                ref={cancelButtonRef}
              >
                {titleBtnCancel ?? t('btn:cancel')}
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </>
  )
}
