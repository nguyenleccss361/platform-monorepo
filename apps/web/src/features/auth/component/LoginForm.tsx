import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import {
  BtnPasswordLoginIcon,
  BtnUserLoginIcon,
  EyeHide,
  EyeShow,
} from '@/components/SVGIcons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/lib/auth'
import { Link } from '@tanstack/react-router'
import { emailSchema, passwordSchema } from '@/utils/schemaValidation'

const loginSchema = z.object({
  identifier: emailSchema,
  password: passwordSchema,
  isPersistLogin: z.boolean().optional(),
})

export type LoginCredentialsDTO = z.infer<typeof loginSchema>

type LoginFormProps = {
  onSuccess: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { t } = useTranslation()

  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }
  const form = useForm<LoginCredentialsDTO>({
    resolver: loginSchema && zodResolver(loginSchema),
    defaultValues: {
      password: '',
      identifier: '',
      isPersistLogin: false,
    },
  })
  const { handleSubmit } = form

  return (
    <div>
      <Form {...form}>
        <form
          className="w-full space-y-6"
          onSubmit={handleSubmit(async values => {
            await login.mutateAsync(values)
            onSuccess()
          })}
        >
          <>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="mt-10 bg-stone-300"
                      placeholder={t('auth:require_email')}
                      autoComplete="off"
                      startIcon={(
                        <BtnUserLoginIcon
                          height={20}
                          width={20}
                          viewBox="0 0 20 20"
                          className="absolute left-2 top-1/2 z-20 -translate-y-1/2"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword
                        ? 'text'
                        : 'password'}
                      placeholder={t('user:password')}
                      className="bg-stone-300"
                      autoComplete="nope"
                      startIcon={(
                        <BtnPasswordLoginIcon
                          height={20}
                          width={20}
                          viewBox="0 0 20 20"
                          className="absolute left-2 top-1/2 z-20 -translate-y-1/2"
                        />
                      )}
                      endIcon={
                        showPassword
                          ? (
                            <EyeShow
                              height={24}
                              width={24}
                              viewBox="0 0 24 24"
                              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer"
                              onClick={togglePasswordVisibility}
                            />
                          )
                          : (
                            <EyeHide
                              height={24}
                              width={24}
                              viewBox="0 0 24 24"
                              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer"
                              onClick={togglePasswordVisibility}
                            />
                          )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPersistLogin"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem className="flex">
                  <FormControl>
                    <Checkbox
                      {...field}
                      className="size-6"
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  </FormControl>
                  <FormLabel className="ml-2">
                    {t('auth:persist_login')}
                  </FormLabel>
                </FormItem>
              )}
            />

            <div>
              <Button
                isLoading={login.isPending}
                type="submit"
                className="w-full bg-primary"
                variant="primary"
              >
                {t('user:login')}
              </Button>
            </div>
          </>
        </form>
      </Form>

      <div className="py-[13%]">
        <div className="container mx-auto text-center">
          <ul className="text-body-xs">
            <li className="m-1">
              {t('auth:no_account')}
              {' '}
              <Link to="." className="font-bold text-black">
                {t('auth:from_login_to_register')}
              </Link>
            </li>
            <li>
              {t('auth:forgot_password')}
              {' '}
              <Link to= "." className="font-bold text-black">
                {t('auth:change_password')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
