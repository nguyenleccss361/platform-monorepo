import { zodResolver } from '@hookform/resolvers/zod'
import type React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { LuSearch, LuX } from 'react-icons/lu'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import i18n from '@/i18n'
import { cn } from '@/lib/utils'

type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

type SearchFieldProps = {
  setSearchValue: (value: string) => void
  searchField?: React.MutableRefObject<string | undefined>
  fieldOptions?: { value: string, label: string }[]
  setIsSearchData?: React.Dispatch<React.SetStateAction<boolean>>
  date?: DateRange | undefined
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  placeholder?: string
  title?: string
  closeSearch?: boolean
  className?: string
  searchByFieldClassName?: string
  searchByNameClassName?: string
  searchButtonClassName?: string
  placeholderValueText?: string
}

export function SearchField({
  setSearchValue,
  searchField,
  fieldOptions,
  setIsSearchData,
  date,
  setDate,
  placeholder,
  title,
  closeSearch,
  className,
  searchByFieldClassName,
  searchByNameClassName,
  searchButtonClassName,
  placeholderValueText,
}: SearchFieldProps) {
  const { t } = useTranslation()
  const defaultFieldOption
    = fieldOptions && fieldOptions.length > 0
      ? fieldOptions[0].value
      : ''
  const searchSchema = z.object({
    searchByField: z.string({
      required_error: i18n.t('search:no_search_field'),
    }),
    searchByName: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  })
  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchByName: '',
      searchByField: defaultFieldOption,
    },
  })

  function onSubmit() {
    if (searchField) {
      searchField.current = form.watch('searchByField')
    }
    setSearchValue(form.watch('searchByName').trim())
    setDate?.(date)
    setIsSearchData?.(true)
    setTimeout(() => {
      setIsSearchData?.(false)
    }, 100)
  }

  const [debouncedSearchByName] = useDebounce(form.watch('searchByName'), 500)
  useEffect(() => {
    console.log('check')
    if (form.watch('searchByName').length === 0) {
      form.setValue('searchByName', '')
      setSearchValue('')
    }
  }, [debouncedSearchByName])

  return (
    <Form {...form}>
      <form className={cn(className)} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-full flex-row items-center gap-[14px] 2xl:items-center">
          <div className="flex flex-col items-center gap-[14px] 2xl:flex-row">
            {title && <div className="hidden text-sm 2xl:flex">{title}</div>}
            {searchField && (
              <FormField
                control={form.control}
                name="searchByField"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Select
                          {...field}
                          onValueChange={value => {
                            form.setValue('searchByField', value)
                            form.clearErrors('searchByField')
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              'h-[38px] min-w-[250px] px-[12px] py-[8px] text-sm',
                              searchByFieldClassName,
                            )}
                          >
                            <SelectValue
                              placeholder={
                                placeholderValueText ?? t('table:search_field')
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {fieldOptions?.map(
                              (option: { value: string, label: string }) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.searchByField?.message && (
                          <div className="mt-1 text-xs text-primary 2xl:absolute 2xl:bottom-[-15px]">
                            {form.formState.errors.searchByField.message}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="searchByName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        className={cn(
                          'h-[38px] w-[250px] min-w-[250px] px-[12px] py-[8px] text-sm',
                          closeSearch
                            ? 'pr-[36px]'
                            : 'pr-[12px]',
                          searchByNameClassName,
                        )}
                        placeholder={placeholder ?? t('search:title')}
                        endIcon={
                          closeSearch
                          && form.watch('searchByName').length > 0
                            ? (
                              <LuX
                                className="absolute right-[12px] top-1/4 h-1/2 cursor-pointer"
                                onClick={() => {
                                  form.setValue('searchByName', '')
                                  setSearchValue('')
                                }}
                              />
                            )
                            : undefined
                        }
                      />
                      {form.formState.errors.searchByName?.message && (
                        <div className="mt-1 text-xs text-primary 2xl:absolute 2xl:bottom-[-15px]">
                          {form.formState.errors.searchByName.message}
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className={cn('', searchButtonClassName)}
            variant="search"
          >
            <LuSearch className="size-5 text-[#4B465C]" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
