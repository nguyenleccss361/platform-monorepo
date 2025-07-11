import { Toaster as Sonner } from 'sonner'

import { ErrorToastIcon, SuccessToastIcon } from '../svg-icons'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          closeButton: 'absolute top-5 left-80',
        },
      }}
      icons={{
        success: (
          <SuccessToastIcon
            width={30}
            height={30}
            viewBox="0 0 30 30"
            className="size-6"
          />
        ),
        error: (
          <ErrorToastIcon
            width={30}
            height={30}
            viewBox="0 0 30 30"
            className="size-6"
          />
        ),
      }}
      className="group"
      {...props}
    />
  )
}

export { Toaster }
