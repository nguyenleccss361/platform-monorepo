import { clsx, type ClassValue } from 'clsx'
import { type RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

type DateFormat = {
  date: number | Date
  config?: Intl.DateTimeFormatOptions
}

export const defaultDateConfig: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Ho_Chi_Minh',
  hourCycle: 'h23',
}
export function getVNDateFormat({ date, config }: DateFormat) {
  let dateConfig = defaultDateConfig
  if (config) {
    dateConfig = config
  }
  if (date == null) return new Intl.DateTimeFormat('vi-VN', dateConfig).format(new Date())
  else return new Intl.DateTimeFormat('vi-VN', dateConfig).format(new Date(date))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export const scrollToIntro = (Ref: RefObject<HTMLDivElement>) => {
  Ref.current?.scrollIntoView({ behavior: 'smooth' })
}

// export function flattenOrgs(input: Org[]) {
//   return input.reduce((acc: Org[], item: Org) => {
//     item = Object.assign({}, item)
//     acc = acc.concat(item)
//     if (item.sub_orgs) {
//       acc = acc.concat(flattenOrgs(item.sub_orgs))
//       item.sub_orgs = []
//     }
//     return acc
//   }, [])
// }
