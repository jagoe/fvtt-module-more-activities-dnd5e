import { logPrefix } from '@/constants'

export const warn = (...args: unknown[]) => {
  console.warn(logPrefix, ...args)
}
