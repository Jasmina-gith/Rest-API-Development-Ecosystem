
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cls(...args) {
  return twMerge(clsx(...args))
}
